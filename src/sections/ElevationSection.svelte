<script lang="ts">
  import {
    generateShadow,
    generateShadowScale,
    adaptShadowForDarkMode,
    generateDarkModeShadow,
    getZIndexScale,
    getZIndex,
    getBorderScale,
    getBorderRadiusScale,
    nestedRadius,
    getSurfaceMaterial,
    getEdgeHighlight,
  } from "../../../packages/core/src/index.js";
  import type { ElevationLevel, ElevationShadow, SurfaceMaterial } from "../../../packages/core/src/index.js";
  import { round } from "../utils.ts";
  // ---- Shadow Scale ----
  let shadowScale = generateShadowScale();
  let darkMode = $state(false);

  // Elevation use-case labels
  const ELEVATION_USES: Record<number, string> = {
    0: "Flat element",
    1: "Cards at rest, inputs",
    2: "Hovered cards, dropdowns",
    3: "Active dropdowns, popovers",
    4: "Modals, drawers",
    5: "Toasts, FABs",
  };

  // ---- Dark Mode Surface Tints ----
  const DARK_SURFACE_TINTS = [
    { level: 0, boost: 0.00, label: "Base background" },
    { level: 1, boost: 0.02, label: "Cards at rest" },
    { level: 2, boost: 0.04, label: "Hovered cards" },
    { level: 3, boost: 0.06, label: "Popovers" },
    { level: 4, boost: 0.08, label: "Modals" },
    { level: 5, boost: 0.10, label: "Toasts, floats" },
  ];

  // ---- Z-Index ----
  let zIndexScale = getZIndexScale();
  const Z_INDEX_TOP_LAYER: Record<string, string | null> = {
    base: null,
    raised: null,
    dropdown: "popover",
    sticky: null,
    overlay: "dialog::backdrop",
    modal: "dialog.showModal()",
    popover: "popover",
    tooltip: "popover=\"hint\"",
    toast: "popover",
    max: null,
  };

  // ---- Border System ----
  let borderScale = getBorderScale();
  let radiusScale = getBorderRadiusScale();

  // ---- Nested Radius ----
  let outerRadius = $state(16);
  let padding = $state(8);
  let computedNested = $derived(nestedRadius(outerRadius, padding));

  // ---- Surface Materials ----
  const MATERIAL_TYPES: SurfaceMaterial[] = ["flat", "matte", "glass", "elevated"];
  const MATERIAL_DESCRIPTIONS: Record<string, string> = {
    flat: "Opaque, no shadow, border-defined",
    matte: "Opaque, standard shadow (default)",
    glass: "Semi-transparent, backdrop blur",
    elevated: "Opaque, pronounced shadow",
  };
  let materialDarkMode = $state(false);

  // ---- Surface Container Hierarchy ----
  const CONTAINER_LEVELS = [
    { token: "container-lowest", role: "Recessed inset", lightL: 0.995, darkL: 0.110, use: "Code blocks, input wells" },
    { token: "container-low", role: "Subtle grouping", lightL: 0.975, darkL: 0.170, use: "Section backgrounds" },
    { token: "container", role: "Default", lightL: 0.965, darkL: 0.185, use: "Cards, dialogs, menus" },
    { token: "container-high", role: "Emphasized", lightL: 0.940, darkL: 0.220, use: "Active sidebar, striping" },
    { token: "container-highest", role: "Maximum", lightL: 0.920, darkL: 0.255, use: "Toolbars, headers, banners" },
  ];
  let containerDarkMode = $state(false);
  const PAGE_BG_LIGHT = 0.985;
  const PAGE_BG_DARK = 0.150;

  // ---- Edge Highlight ----
  let edgeHighlightCss = getEdgeHighlight();

  // ---- Squircle ----
  let squircleSupported = $state(false);
</script>

<sg-section id="elevation" title="Elevation & Depth" description="Physically-plausible shadows using a penumbral light model, semantic z-index layers, border scale, surface materials, container hierarchy, and squircle corners.">

    <!-- ================================================================== -->
    <!-- Shadow Scale                                                        -->
    <!-- ================================================================== -->
    <div class="subsection">
      <sg-heading level={3}>Shadow Scale</sg-heading>
      <sg-text color="secondary">
        Six levels (0-5) using a dual key + ambient shadow model. Key shadow provides direction;
        ambient shadow provides soft surrounding glow. Blur scales linearly with elevation.
      </sg-text>
      <div class="controls">
        <div class="control-group">
          <span class="card-label">Mode</span>
          <sg-toggle-group type="single" value={darkMode ? "dark" : "light"} onchange={(e) => { const v = ((e as CustomEvent<any>).detail ?? (e.currentTarget as any).value); darkMode = v === "dark" }}>
            <button class="sg-toggle" value="light">Light</button>
            <button class="sg-toggle" value="dark">Dark</button>
          </sg-toggle-group>
        </div>
        <div class="control-group">
          <span class="card-label">Key opacity</span>
          <span class="info-value mono">{darkMode ? "0.30" : "0.08"}</span>
        </div>
        <div class="control-group">
          <span class="card-label">Ambient opacity</span>
          <span class="info-value mono">{darkMode ? "0.20" : "0.06"}</span>
        </div>
      </div>
      <div class="shadow-grid">
        {#each shadowScale as shadow}
          {@const displayed = darkMode && shadow.level > 0 ? adaptShadowForDarkMode(shadow) : shadow}
          {@const bgStyle = darkMode ? "background: oklch(0.15 0.005 265); color: oklch(0.9 0 0); border-color: oklch(1 0 0 / 0.06)" : ""}
          <div class="shadow-card" style="box-shadow: {displayed.css}; {bgStyle}">
            <span class="shadow-level">Level {shadow.level}</span>
            <span class="shadow-name">{shadow.name}</span>
            <span class="shadow-use">{ELEVATION_USES[shadow.level]}</span>
          </div>
        {/each}
      </div>
      {#if darkMode}
        <div class="info-callout">
          Dark mode shadows use 3-4x opacity (Stevens effect compensation) and 10% blur reduction for perceptibility against dark backgrounds.
        </div>
      {/if}
    </div>

    <!-- ================================================================== -->
    <!-- Dark Mode Surface Elevation Tints                                   -->
    <!-- ================================================================== -->
    <div class="subsection">
      <sg-heading level={3}>Dark Mode Surface Tints</sg-heading>
      <sg-text color="secondary">
        In dark mode, higher-elevation surfaces are progressively lighter, mimicking how surfaces
        closer to a light source receive more illumination. OKLCH lightness boost is additive.
      </sg-text>
      <div class="surface-tint-strip">
        {#each DARK_SURFACE_TINTS as tint}
          {@const l = 0.15 + tint.boost}
          <div class="surface-tint-card" style="background: oklch({l} 0.005 265); color: oklch(0.85 0 0)">
            <span class="tint-level">+{tint.boost.toFixed(2)} L</span>
            <span class="tint-label">{tint.label}</span>
            <span class="tint-value mono">L = {l.toFixed(3)}</span>
          </div>
        {/each}
      </div>
    </div>

    <!-- ================================================================== -->
    <!-- Edge Highlight                                                      -->
    <!-- ================================================================== -->
    <div class="subsection">
      <sg-heading level={3}>Edge Highlight</sg-heading>
      <sg-text color="secondary">
        A composable inset top-edge highlight simulating specular light catch. Stronger depth
        cue than shadows in dark environments. Separate from elevation tokens for independent composition.
      </sg-text>
      <div class="edge-highlight-demo">
        <div class="edge-card edge-card--without">
          <span class="edge-label">Without highlight</span>
          <span class="edge-token mono">box-shadow: shadow-md</span>
        </div>
        <div class="edge-card edge-card--with">
          <span class="edge-label">With highlight</span>
          <span class="edge-token mono">+ edge-highlight</span>
        </div>
      </div>
      <div class="mono token-preview">{edgeHighlightCss}</div>
    </div>

    <!-- ================================================================== -->
    <!-- Z-Index Layers                                                      -->
    <!-- ================================================================== -->
    <div class="subsection">
      <sg-heading level={3}>Z-Index Scale</sg-heading>
      <sg-text color="secondary">
        With top-layer APIs (Popover, dialog, anchor positioning) handling overlays, z-index is
        primarily for in-flow layering. Most overlay components should use top-layer instead.
      </sg-text>
      <div class="z-index-table">
        <div class="z-row z-row--header">
          <span class="z-cell z-cell--name">Token</span>
          <span class="z-cell z-cell--value">Value</span>
          <span class="z-cell z-cell--alt">Top-Layer Alternative</span>
        </div>
        {#each Object.entries(zIndexScale) as [name, value]}
          {@const alt = Z_INDEX_TOP_LAYER[name]}
          <div class="z-row">
            <span class="z-cell z-cell--name mono">z-{name}</span>
            <span class="z-cell z-cell--value">{value}</span>
            <span class="z-cell z-cell--alt">
              {#if alt}
                <sg-badge color="secondary">{alt}</sg-badge>
              {:else}
                <span class="text-muted">--</span>
              {/if}
            </span>
          </div>
        {/each}
      </div>
    </div>

    <!-- ================================================================== -->
    <!-- Border System                                                       -->
    <!-- ================================================================== -->
    <div class="subsection">
      <sg-heading level={3}>Border System</sg-heading>
      <sg-text color="secondary">
        Constrained scales for widths and radii. No 3px width (near-JND at small sizes).
        Curved contours communicate approachability (Bar & Neta, 2006).
      </sg-text>
      <div class="border-demos">
        <div>
          <sg-heading level={4} style="margin-bottom: var(--sg-space-3); color: var(--sg-color-text-secondary); font-size: var(--sg-text-sm)">Border Widths</sg-heading>
          <div class="border-width-grid">
            {#each Object.entries(borderScale) as [name, value]}
              <div class="border-width-sample">
                <div class="border-width-box" style="border-width: {value}px"></div>
                <span class="border-label">{name}: {value}px</span>
              </div>
            {/each}
          </div>
        </div>
        <div>
          <sg-heading level={4} style="margin-bottom: var(--sg-space-3); color: var(--sg-color-text-secondary); font-size: var(--sg-text-sm)">Border Radii</sg-heading>
          <div class="border-radius-grid">
            {#each Object.entries(radiusScale) as [name, value]}
              <div class="border-radius-sample">
                <div class="border-radius-box" style="border-radius: {value}px"></div>
                <span class="border-label">{name}: {value}px</span>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>

    <!-- ================================================================== -->
    <!-- Squircle Corners                                                    -->
    <!-- ================================================================== -->
    <div class="subsection">
      <sg-heading level={3}>Squircle Corners</sg-heading>
      <sg-text color="secondary">
        CSS <code>corner-shape: squircle</code> produces continuous-curvature (superellipse)
        corners, eliminating the tangent discontinuity of circular arcs. Progressive enhancement
        gated by <code>@supports</code>.
      </sg-text>
      <div class="squircle-grid">
        <div class="squircle-card squircle-card--standard">
          <span class="squircle-label">Standard</span>
          <span class="squircle-sub">border-radius (circular arc)</span>
        </div>
        <div class="squircle-card squircle-card--squircle">
          <span class="squircle-label">Squircle</span>
          <span class="squircle-sub">corner-shape: squircle</span>
        </div>
      </div>
      <div class="squircle-compat">
        <div class="compat-row">
          <span class="compat-browser">Chrome 135+</span>
          <sg-badge color="primary">Supported</sg-badge>
        </div>
        <div class="compat-row">
          <span class="compat-browser">Edge 135+</span>
          <sg-badge color="primary">Supported</sg-badge>
        </div>
        <div class="compat-row">
          <span class="compat-browser">Safari 18.4+</span>
          <sg-badge color="primary">Supported</sg-badge>
        </div>
        <div class="compat-row">
          <span class="compat-browser">Firefox</span>
          <sg-badge color="secondary">Not yet</sg-badge>
        </div>
      </div>
    </div>

    <!-- ================================================================== -->
    <!-- Nested Radius                                                       -->
    <!-- ================================================================== -->
    <div class="subsection">
      <sg-heading level={3}>Nested Radius Calculator</sg-heading>
      <sg-text color="secondary">
        Inner radius = outer radius - padding. Prevents the common visual bug where
        corners appear thicker at the junction of nested rounded elements.
      </sg-text>
      <div class="controls">
        <div class="control-group" style="min-width: 200px">
          <input class="sg-slider" type="range" min={0} max={32} step={1} value={outerRadius} oninput={(e) => { const el = e.currentTarget as any; outerRadius = (el.value ?? outerRadius); }} onchange={(e) => { const el = e.currentTarget as any; outerRadius = (el.value ?? outerRadius); }} onclick={(e) => { const el = e.currentTarget as any; outerRadius = (el.value ?? outerRadius); }} ontoggle={(e) => { const el = e.currentTarget as any; outerRadius = (el.value ?? outerRadius); }} />
        </div>
        <div class="control-group" style="min-width: 200px">
          <input class="sg-slider" type="range" min={0} max={24} step={1} value={padding} oninput={(e) => { const el = e.currentTarget as any; padding = (el.value ?? padding); }} onchange={(e) => { const el = e.currentTarget as any; padding = (el.value ?? padding); }} onclick={(e) => { const el = e.currentTarget as any; padding = (el.value ?? padding); }} ontoggle={(e) => { const el = e.currentTarget as any; padding = (el.value ?? padding); }} />
        </div>
        <div class="control-group">
          <span class="card-label">Inner Radius</span>
          <span class="info-value" style="font-size: var(--sg-text-xl); font-weight: var(--sg-weight-semibold)">{computedNested}px</span>
        </div>
      </div>
      <div class="nested-radius-demo">
        <div class="nested-outer" style="border-radius: {outerRadius}px; padding: {padding}px">
          <div class="nested-inner" style="border-radius: {computedNested}px">
            Inner element
          </div>
        </div>
      </div>
      <div class="mono token-preview">nestedRadius({outerRadius}, {padding}) = {computedNested}</div>
    </div>

    <!-- ================================================================== -->
    <!-- Surface Materials                                                   -->
    <!-- ================================================================== -->
    <div class="subsection">
      <sg-heading level={3}>Surface Materials</sg-heading>
      <sg-text color="secondary">
        Materials define how a surface interacts with light, transparency, and blur --
        orthogonal to elevation (shadow intensity) and container level (background emphasis).
      </sg-text>
      <div class="controls">
        <div class="control-group">
          <span class="card-label">Mode</span>
          <sg-toggle-group type="single" value={materialDarkMode ? "dark" : "light"} onchange={(e) => { const v = ((e as CustomEvent<any>).detail ?? (e.currentTarget as any).value); materialDarkMode = v === "dark" }}>
            <button class="sg-toggle" value="light">Light</button>
            <button class="sg-toggle" value="dark">Dark</button>
          </sg-toggle-group>
        </div>
      </div>
      <div class="material-grid">
        {#each MATERIAL_TYPES as type}
          {@const material = getSurfaceMaterial(type, { darkMode: materialDarkMode })}
          {@const darkBg = materialDarkMode ? "background: oklch(0.15 0.005 265);" : ""}
          <div class="material-card" style="{darkBg}">
            <div
              class="material-preview"
              style="
                background: {material.background};
                backdrop-filter: {material.backdropFilter ?? 'none'};
                -webkit-backdrop-filter: {material.backdropFilter ?? 'none'};
                {material.border ? `border: ${material.border};` : ''}
              "
            >
              <span class="material-name">{type}</span>
            </div>
            <span class="material-desc">{MATERIAL_DESCRIPTIONS[type]}</span>
            <span class="material-bg mono">{material.background}</span>
          </div>
        {/each}
      </div>
    </div>

    <!-- ================================================================== -->
    <!-- Surface Container Hierarchy                                         -->
    <!-- ================================================================== -->
    <div class="subsection">
      <sg-heading level={3}>Surface Container Hierarchy</sg-heading>
      <sg-text color="secondary">
        Five levels of background emphasis for nesting depth and visual grouping -- orthogonal
        to both elevation and materials. Inspired by Material Design 3's surface container model.
        Container-lowest sits on the opposite side of the page background for recessed insets.
      </sg-text>
      <div class="controls">
        <div class="control-group">
          <span class="card-label">Mode</span>
          <sg-toggle-group type="single" value={containerDarkMode ? "dark" : "light"} onchange={(e) => { const v = ((e as CustomEvent<any>).detail ?? (e.currentTarget as any).value); containerDarkMode = v === "dark" }}>
            <button class="sg-toggle" value="light">Light</button>
            <button class="sg-toggle" value="dark">Dark</button>
          </sg-toggle-group>
        </div>
      </div>
      <div class="container-hierarchy">
        <!-- Page background reference -->
        <div class="container-level container-level--page" style="background: oklch({containerDarkMode ? PAGE_BG_DARK : PAGE_BG_LIGHT} 0.005 265); {containerDarkMode ? 'color: oklch(0.7 0 0)' : 'color: oklch(0.4 0 0)'}">
          <span class="container-token">page bg</span>
          <span class="container-role">Canvas</span>
          <span class="container-l mono">L = {containerDarkMode ? PAGE_BG_DARK.toFixed(3) : PAGE_BG_LIGHT.toFixed(3)}</span>
        </div>
        {#each CONTAINER_LEVELS as level}
          {@const l = containerDarkMode ? level.darkL : level.lightL}
          {@const pageBg = containerDarkMode ? PAGE_BG_DARK : PAGE_BG_LIGHT}
          {@const direction = l > pageBg ? "brighter" : l < pageBg ? "darker" : "same"}
          <div
            class="container-level"
            style="background: oklch({l} 0.005 265); {containerDarkMode ? 'color: oklch(0.85 0 0)' : 'color: oklch(0.2 0 0)'}"
          >
            <span class="container-token mono">{level.token}</span>
            <span class="container-role">{level.role}</span>
            <span class="container-use">{level.use}</span>
            <span class="container-l mono">L = {l.toFixed(3)}</span>
            {#if level.token === "container-lowest"}
              <sg-badge color="secondary">{direction} than page</sg-badge>
            {/if}
          </div>
        {/each}
      </div>
      <div class="container-diagram">
        <div class="diagram-label">
          {containerDarkMode ? "Dark" : "Light"} mode: container-lowest is
          <strong>{containerDarkMode ? "darker" : "brighter"}</strong> than page bg (recessed insets)
        </div>
      </div>
    </div>
</sg-section>

<style>
/* ---- Shadow Scale ---- */
.shadow-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: var(--sg-gap-grouped);
}

.shadow-card {
  background: var(--surface);
  border: 1px solid var(--sg-color-border);
  border-radius: var(--radius-sm);
  padding: var(--sg-space-5) var(--sg-space-4);
  text-align: center;
  transition: box-shadow var(--sg-duration-moderate), background var(--sg-duration-moderate);
}

.shadow-level {
  display: block;
  font-size: var(--sg-text-sm);
  font-weight: var(--sg-weight-semibold);
  margin-bottom: var(--sg-space-1);
}

.shadow-name {
  display: block;
  font-size: var(--sg-text-xs);
  color: var(--text-3);
  font-family: var(--sg-font-mono);
  margin-bottom: var(--sg-space-1);
}

.shadow-use {
  display: block;
  font-size: var(--sg-text-2xs);
  color: var(--text-3);
  opacity: 0.7;
}

.info-callout {
  margin-top: var(--sg-space-3);
  padding: var(--sg-pad-button-y, 0.75rem) var(--sg-pad-button-x, 1rem);
  background: oklch(from var(--sg-color-link) l c h / 0.08);
  border-radius: var(--radius-sm);
  font-size: var(--sg-text-sm);
  color: var(--sg-color-text-secondary);
}

/* ---- Dark Mode Surface Tints ---- */
.surface-tint-strip {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: var(--sg-space-3);
}

.surface-tint-card {
  border-radius: var(--radius-sm);
  padding: var(--sg-space-4);
  text-align: center;
  border: 1px solid oklch(1 0 0 / 0.06);
}

.tint-level {
  display: block;
  font-size: var(--sg-text-sm);
  font-weight: var(--sg-weight-semibold);
  margin-bottom: var(--sg-space-1);
}

.tint-label {
  display: block;
  font-size: var(--sg-text-xs);
  opacity: 0.7;
  margin-bottom: var(--sg-space-1);
}

.tint-value {
  font-size: var(--sg-text-2xs);
  opacity: 0.5;
}

/* ---- Edge Highlight ---- */
.edge-highlight-demo {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--sg-gap-grouped);
}

.edge-card {
  background: oklch(0.15 0.005 265);
  color: oklch(0.85 0 0);
  border-radius: var(--radius-sm);
  padding: var(--sg-pad-card, 1.5rem);
  text-align: center;
}

.edge-card--without {
  box-shadow: 0 1.5px 3px -0.75px oklch(0 0 0 / 0.30), 0 0 6px 0 oklch(0 0 0 / 0.20);
}

.edge-card--with {
  box-shadow: inset 0 1px 0 0 oklch(1 0 0 / 0.06), 0 1.5px 3px -0.75px oklch(0 0 0 / 0.30), 0 0 6px 0 oklch(0 0 0 / 0.20);
}

.edge-label {
  display: block;
  font-size: var(--sg-text-sm);
  font-weight: var(--sg-weight-semibold);
  margin-bottom: var(--sg-space-1);
}

.edge-token {
  font-size: var(--sg-text-xs);
  opacity: 0.6;
}

.token-preview {
  margin-top: var(--sg-space-3);
  padding: var(--sg-space-2) var(--sg-space-3);
  background: var(--sg-surface-container-high);
  border-radius: var(--radius-xs);
  font-size: var(--sg-text-xs);
  color: var(--text-3);
}

/* ---- Z-Index Table ---- */
.z-index-table {
  border: 1px solid var(--sg-color-border);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.z-row {
  display: grid;
  grid-template-columns: 1fr 80px 1fr;
  gap: var(--sg-space-3);
  padding: var(--sg-space-2) var(--sg-space-4);
  border-bottom: 1px solid var(--sg-color-border);
  align-items: center;
}

.z-row:last-child {
  border-bottom: none;
}

.z-row--header {
  background: var(--sg-surface-container-high);
  font-size: var(--sg-text-xs);
  font-weight: var(--sg-weight-semibold);
  color: var(--sg-color-text-secondary);
  text-transform: uppercase;
  letter-spacing: var(--sg-tracking-caps);
}

.z-cell {
  font-size: var(--sg-text-sm);
}

.z-cell--value {
  text-align: center;
  font-weight: var(--sg-weight-semibold);
}

.text-muted {
  color: var(--text-3);
  opacity: 0.4;
}

/* ---- Border System ---- */
.border-demos {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--sg-gap-separated);
}

.border-width-grid,
.border-radius-grid {
  display: flex;
  flex-direction: column;
  gap: var(--sg-space-3);
}

.border-width-sample,
.border-radius-sample {
  display: flex;
  align-items: center;
  gap: var(--sg-space-3);
}

.border-width-box {
  width: 60px;
  height: 40px;
  border: solid var(--text-3);
  border-radius: var(--sg-radius-sm);
}

.border-radius-box {
  width: 48px;
  height: 48px;
  background: oklch(from var(--sg-color-link) l c h / 0.15);
  border: 1px solid oklch(from var(--sg-color-link) l c h / 0.3);
}

.border-label {
  font-size: var(--sg-text-xs);
  color: var(--text-3);
  font-family: var(--sg-font-mono);
}

/* ---- Squircle ---- */
.squircle-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--sg-gap-grouped);
  margin-bottom: var(--sg-space-4);
}

.squircle-card {
  border-radius: 16px;
  padding: var(--sg-space-8);
  text-align: center;
  background: oklch(from var(--sg-color-link) l c h / 0.08);
  border: 1px solid oklch(from var(--sg-color-link) l c h / 0.2);
}

.squircle-card--squircle {
  corner-shape: squircle;
}

.squircle-label {
  display: block;
  font-size: var(--sg-text-sm);
  font-weight: var(--sg-weight-semibold);
  margin-bottom: var(--sg-space-1);
}

.squircle-sub {
  font-size: var(--sg-text-xs);
  color: var(--text-3);
  font-family: var(--sg-font-mono);
}

.squircle-compat {
  display: flex;
  gap: var(--sg-gap-grouped);
  flex-wrap: wrap;
}

.compat-row {
  display: flex;
  align-items: center;
  gap: var(--sg-gap-related);
  font-size: var(--sg-text-sm);
}

.compat-browser {
  color: var(--sg-color-text-secondary);
}

/* ---- Nested Radius ---- */
.nested-radius-demo {
  display: flex;
  justify-content: center;
  margin-top: var(--sg-space-4);
}

.nested-outer {
  background: var(--sg-surface-container-high);
  border: var(--sg-border-medium, 2px) solid var(--border-hover);
  width: 200px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nested-inner {
  background: oklch(from var(--sg-color-link) l c h / 0.15);
  border: var(--sg-border-thin, 1px) solid var(--sg-color-link);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--sg-text-xs);
  color: var(--sg-color-link);
}

/* ---- Surface Materials ---- */
.material-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--sg-gap-grouped);
}

.material-card {
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 1px solid var(--sg-color-border);
}

.material-preview {
  padding: var(--sg-pad-card, 1.5rem);
  text-align: center;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.material-name {
  font-size: var(--sg-text-sm);
  font-weight: var(--sg-weight-semibold);
}

.material-desc {
  display: block;
  padding: var(--sg-space-2) var(--sg-space-3);
  font-size: var(--sg-text-xs);
  color: var(--sg-color-text-secondary);
}

.material-bg {
  display: block;
  padding: 0 var(--sg-space-3) var(--sg-space-2);
  font-size: var(--sg-text-2xs);
  color: var(--text-3);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ---- Surface Container Hierarchy ---- */
.container-hierarchy {
  display: flex;
  flex-direction: column;
  gap: var(--sg-gap-related);
}

.container-level {
  display: grid;
  grid-template-columns: 1fr 1fr 1.5fr auto auto;
  gap: var(--sg-space-3);
  align-items: center;
  padding: var(--sg-pad-button-y, 0.75rem) var(--sg-pad-button-x, 1rem);
  border-radius: var(--radius-sm);
  transition: background var(--sg-duration-moderate);
}

.container-level--page {
  border: 1px dashed oklch(0.5 0 0 / 0.3);
}

.container-token {
  font-size: var(--sg-text-sm);
  font-weight: var(--sg-weight-semibold);
}

.container-role {
  font-size: var(--sg-text-sm);
}

.container-use {
  font-size: var(--sg-text-xs);
  opacity: 0.7;
}

.container-l {
  font-size: var(--sg-text-xs);
  opacity: 0.5;
}

.container-diagram {
  margin-top: var(--sg-space-3);
  padding: var(--sg-space-2) var(--sg-space-3);
  font-size: var(--sg-text-sm);
  color: var(--sg-color-text-secondary);
  text-align: center;
}

/* ---- Shared ---- */
.mono {
  font-family: var(--sg-font-mono);
}

.info-value {
  font-size: var(--sg-text-sm);
}

@media (max-width: 768px) {
  .shadow-grid,
  .surface-tint-strip {
    grid-template-columns: repeat(3, 1fr);
  }

  .edge-highlight-demo,
  .squircle-grid,
  .border-demos {
    grid-template-columns: 1fr;
  }

  .material-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .container-level {
    grid-template-columns: 1fr 1fr auto;
  }

  .container-use,
  .container-l {
    display: none;
  }
}
</style>
