<script lang="ts">
  import {
    resolveTheme,
    resolveShape,
    resolveDepth,
    resolveDensity,
    resolveMotion,
    getInteractionShades,
  } from "../../../packages/theme/src/index.js";
  import type {
    SiguiConfig,
    ShapePreset,
    DepthPreset,
    MotionPreset,
    Density,
    ResolvedTheme,
  } from "../../../packages/theme/src/index.js";
  import type { HarmonyMode, ShadeStop } from "../../../packages/core/src/index.js";
  import { fromOklch } from "../../../packages/core/src/index.js";
  import { isLightColor, round, copyHex } from "../utils.ts";
  import { getToastContext } from "../toast-context.ts";
  interface Props {
    brandColor: string;
  }

  let { brandColor }: Props = $props();
  const toast = getToastContext();

  // Aesthetic axes
  let appearance: "light" | "dark" = $state("light");
  let shape: ShapePreset = $state("rounded");
  let depth: DepthPreset = $state("medium");
  let density: Density = $state("comfortable");
  let motion: MotionPreset = $state("smooth");
  let harmonyMode: HarmonyMode = $state("triadic");
  let tintStrength = $state(0.1);

  const SHAPE_PRESETS: { value: ShapePreset; label: string }[] = [
    { value: "sharp", label: "Sharp" },
    { value: "rounded", label: "Rounded" },
    { value: "soft", label: "Soft" },
    { value: "pill", label: "Pill" },
    { value: "squircle-sharp", label: "Squircle Sharp" },
    { value: "squircle", label: "Squircle" },
    { value: "squircle-soft", label: "Squircle Soft" },
  ];

  const DEPTH_PRESETS: { value: DepthPreset; label: string }[] = [
    { value: "flat", label: "Flat" },
    { value: "subtle", label: "Subtle" },
    { value: "medium", label: "Medium" },
    { value: "pronounced", label: "Pronounced" },
  ];

  const DENSITY_PRESETS: { value: Density; label: string }[] = [
    { value: "compact", label: "Compact" },
    { value: "comfortable", label: "Comfortable" },
    { value: "spacious", label: "Spacious" },
  ];

  const MOTION_PRESETS: { value: MotionPreset; label: string }[] = [
    { value: "instant", label: "Instant" },
    { value: "snappy", label: "Snappy" },
    { value: "smooth", label: "Smooth" },
    { value: "playful", label: "Playful" },
  ];

  const HARMONY_MODES: { value: HarmonyMode; label: string }[] = [
    { value: "monochromatic", label: "Mono" },
    { value: "complementary", label: "Comp" },
    { value: "analogous", label: "Analog" },
    { value: "split-complementary", label: "Split" },
    { value: "triadic", label: "Triadic" },
    { value: "tetradic", label: "Tetra" },
  ];

  const shadeStops = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

  // Build config reactively
  let config: SiguiConfig = $derived({
    brand: brandColor,
    appearance,
    shape,
    depth,
    density,
    motion,
    harmony: { mode: harmonyMode },
    tintStrength,
  });

  let resolved: ResolvedTheme | null = $derived.by(() => {
    try {
      return resolveTheme(config);
    } catch {
      return null;
    }
  });

  // Resolved preset details for display
  let resolvedShape = $derived(resolveShape(shape));
  let resolvedDepthValues = $derived(resolveDepth(depth));
  let resolvedDensity = $derived(resolveDensity(density));
  let resolvedMotionValues = $derived(resolveMotion(motion));

  // Semantic roles for the current appearance
  let roles = $derived(resolved ? resolved.semanticRoles[appearance] : null);

  // Palette names
  const PALETTE_NAMES = ["brand", "secondary", "tertiary", "accent", "neutral", "success", "warning", "danger", "info"] as const;

  function exportConfig(): string {
    const lines: string[] = [
      `import type { SiguiConfig } from "@sig-ui/theme";`,
      ``,
      `export default {`,
      `  brand: "${brandColor}",`,
      `  appearance: "${appearance}",`,
      `  shape: "${shape}",`,
      `  depth: "${depth}",`,
      `  density: "${density}",`,
      `  motion: "${motion}",`,
      `  harmony: { mode: "${harmonyMode}" },`,
    ];
    if (tintStrength !== 0.1) {
      lines.push(`  tintStrength: ${tintStrength},`);
    }
    lines.push(`} satisfies SiguiConfig;`);
    return lines.join("\n");
  }

  /** Resolve a palette+shade to a hex string */
  function shadeHex(paletteName: string, shade: ShadeStop): string {
    if (!resolved) return '';
    const palette = resolved.palettes[paletteName];
    if (!palette) return '';
    const oklch = palette.ramp[shade];
    if (!oklch) return '';
    return fromOklch(oklch, "hex");
  }

  /** Resolve a semantic role name to its hex color */
  function roleToHex(roleName: string): string {
    if (!roles || !resolved) return '';
    const mapping = roles[roleName];
    if (!mapping) return '';
    return shadeHex(mapping.palette, mapping.shade);
  }

  function exportCSS(): string {
    if (!resolved || !roles) return "";
    const lines: string[] = [":root {"];
    // Palettes
    for (const [name, palette] of Object.entries(resolved.palettes)) {
      for (const stop of shadeStops) {
        const oklch = palette.ramp[stop];
        if (oklch) {
          const hex = fromOklch(oklch, "hex");
          lines.push(`  --sg-${name}-${stop}: ${hex};`);
        }
      }
    }
    // Roles
    lines.push("");
    for (const [role, mapping] of Object.entries(roles)) {
      const hex = shadeHex(mapping.palette, mapping.shade);
      if (hex) lines.push(`  --sg-color-${role}: ${hex};`);
    }
    lines.push("}");
    return lines.join("\n");
  }

  function copyExport(format: "config" | "css") {
    const text = format === "config" ? exportConfig() : exportCSS();
    navigator.clipboard.writeText(text);
    toast.add(`Copied ${format === "config" ? "TypeScript config" : "CSS"}`);
  }
</script>

<sg-section id="theme-config" title="Theme Configuration">
  Configure the five aesthetic axes of your design system. Every axis supports both preset strings and fine-grained overrides via <code class="sg-code">SiguiConfig</code>.
  

    <!-- Brand & Harmony -->
    <div class="axis-group">
      <sg-heading level={3}>Color Identity</sg-heading>
      <div class="controls">
        <sg-field label="Brand Color">
          <div class="brand-swatch-row">
            <div class="brand-swatch" style="background: {brandColor}"></div>
            <code class="sg-code">{brandColor}</code>
          </div>
        </sg-field>
        <sg-field label="Harmony">
          <sg-toggle-group type="single" value={harmonyMode} oninput={(e) => { const el = e.currentTarget as any; harmonyMode = (el.value ?? harmonyMode); }} onclick={(e) => { const el = e.currentTarget as any; harmonyMode = (el.value ?? harmonyMode); }} ontoggle={(e) => { const el = e.currentTarget as any; harmonyMode = (el.value ?? harmonyMode); }} onchange={(e) => { const v = ((e as CustomEvent<any>).detail ?? (e.currentTarget as any).value); harmonyMode = v as HarmonyMode }} size="sm">
            {#each HARMONY_MODES as { value, label }}
              <button class="sg-toggle" value={value}>{label}</button>
            {/each}
          </sg-toggle-group>
        </sg-field>
        <sg-field label="Appearance">
          <sg-toggle-group type="single" value={appearance} oninput={(e) => { const el = e.currentTarget as any; appearance = (el.value ?? appearance); }} onclick={(e) => { const el = e.currentTarget as any; appearance = (el.value ?? appearance); }} ontoggle={(e) => { const el = e.currentTarget as any; appearance = (el.value ?? appearance); }} onchange={(e) => { const v = ((e as CustomEvent<any>).detail ?? (e.currentTarget as any).value); appearance = v as "light" | "dark" }} size="sm">
            <button class="sg-toggle" value="light">Light</button>
            <button class="sg-toggle" value="dark">Dark</button>
          </sg-toggle-group>
        </sg-field>
        <sg-field label="Tint Strength">
          <input class="sg-slider" type="range" min={0} max={0.3} step={0.01} value={tintStrength} oninput={(e) => { const el = e.currentTarget as any; tintStrength = (el.value ?? tintStrength); }} onchange={(e) => { const el = e.currentTarget as any; tintStrength = (el.value ?? tintStrength); }} onclick={(e) => { const el = e.currentTarget as any; tintStrength = (el.value ?? tintStrength); }} ontoggle={(e) => { const el = e.currentTarget as any; tintStrength = (el.value ?? tintStrength); }} />
        </sg-field>
      </div>
    </div>

    <!-- Shape -->
    <div class="axis-group">
      <sg-heading level={3}>Shape</sg-heading>
      <sg-text size="sm" color="secondary">Controls border-radius across all components. Squircle variants use superellipse corners.</sg-text>
      <div class="controls">
        <sg-field label="Preset">
          <sg-toggle-group type="single" value={shape} oninput={(e) => { const el = e.currentTarget as any; shape = (el.value ?? shape); }} onclick={(e) => { const el = e.currentTarget as any; shape = (el.value ?? shape); }} ontoggle={(e) => { const el = e.currentTarget as any; shape = (el.value ?? shape); }} onchange={(e) => { const v = ((e as CustomEvent<any>).detail ?? (e.currentTarget as any).value); shape = v as ShapePreset }} size="sm">
            {#each SHAPE_PRESETS as { value, label }}
              <button class="sg-toggle" value={value}>{label}</button>
            {/each}
          </sg-toggle-group>
        </sg-field>
      </div>
      <div class="shape-preview">
        {#each ["sm", "md", "lg", "xl", "2xl"] as stop}
          {@const r = resolvedShape.radii[stop]}
          <div class="shape-card" style="border-radius: {r === 9999 ? '9999px' : r + 'px'}">
            <span class="shape-label">{stop}</span>
            <span class="shape-value">{r === 9999 ? '∞' : r + 'px'}</span>
          </div>
        {/each}
      </div>
      {#if resolvedShape.squircle}
        <sg-badge color="primary" size="sm">Squircle enabled</sg-badge>
      {/if}
    </div>

    <!-- Depth -->
    <div class="axis-group">
      <sg-heading level={3}>Depth</sg-heading>
      <sg-text size="sm" color="secondary">Controls shadow intensity. Flat removes all shadows, pronounced adds bold elevation.</sg-text>
      <div class="controls">
        <sg-field label="Preset">
          <sg-toggle-group type="single" value={depth} oninput={(e) => { const el = e.currentTarget as any; depth = (el.value ?? depth); }} onclick={(e) => { const el = e.currentTarget as any; depth = (el.value ?? depth); }} ontoggle={(e) => { const el = e.currentTarget as any; depth = (el.value ?? depth); }} onchange={(e) => { const v = ((e as CustomEvent<any>).detail ?? (e.currentTarget as any).value); depth = v as DepthPreset }} size="sm">
            {#each DEPTH_PRESETS as { value, label }}
              <button class="sg-toggle" value={value}>{label}</button>
            {/each}
          </sg-toggle-group>
        </sg-field>
      </div>
      <div class="depth-preview">
        {#each [1, 2, 3, 4] as level}
          {@const keyOp = resolvedDepthValues.keyOpacity * level}
          {@const ambOp = resolvedDepthValues.ambientOpacity * level}
          <div
            class="depth-card"
            style="box-shadow: 0 {level * 2}px {level * 4}px oklch(0 0 0 / {round(keyOp, 3)}), 0 {level}px {level * 2}px oklch(0 0 0 / {round(ambOp, 3)})"
          >
            <span class="depth-label">Level {level}</span>
            <span class="depth-value">key: {round(keyOp * 100, 1)}%</span>
          </div>
        {/each}
      </div>
    </div>

    <!-- Density -->
    <div class="axis-group">
      <sg-heading level={3}>Density</sg-heading>
      <sg-text size="sm" color="secondary">Scales spacing tokens by a density factor. Compact for data-heavy UIs, spacious for reading-focused layouts.</sg-text>
      <div class="controls">
        <sg-field label="Preset">
          <sg-toggle-group type="single" value={density} oninput={(e) => { const el = e.currentTarget as any; density = (el.value ?? density); }} onclick={(e) => { const el = e.currentTarget as any; density = (el.value ?? density); }} ontoggle={(e) => { const el = e.currentTarget as any; density = (el.value ?? density); }} onchange={(e) => { const v = ((e as CustomEvent<any>).detail ?? (e.currentTarget as any).value); density = v as Density }} size="sm">
            {#each DENSITY_PRESETS as { value, label }}
              <button class="sg-toggle" value={value}>{label}</button>
            {/each}
          </sg-toggle-group>
        </sg-field>
      </div>
      <div class="density-preview">
        <div class="density-demo" style="gap: {Math.round(8 * resolvedDensity.factor)}px; padding: {Math.round(16 * resolvedDensity.factor)}px">
          <div class="density-row" style="padding: {Math.round(8 * resolvedDensity.factor)}px {Math.round(16 * resolvedDensity.factor)}px">Button</div>
          <div class="density-row" style="padding: {Math.round(8 * resolvedDensity.factor)}px {Math.round(16 * resolvedDensity.factor)}px">Input</div>
          <div class="density-row" style="padding: {Math.round(8 * resolvedDensity.factor)}px {Math.round(16 * resolvedDensity.factor)}px">Card</div>
        </div>
        <div class="density-info">
          <sg-text size="sm">Factor: <code class="sg-code">{resolvedDensity.factor}x</code></sg-text>
          <sg-text size="sm">Mode: <code class="sg-code">{resolvedDensity.mode}</code></sg-text>
        </div>
      </div>
    </div>

    <!-- Motion -->
    <div class="axis-group">
      <sg-heading level={3}>Motion</sg-heading>
      <sg-text size="sm" color="secondary">Controls animation duration scaling. Instant disables animations, playful adds bouncier springs.</sg-text>
      <div class="controls">
        <sg-field label="Preset">
          <sg-toggle-group type="single" value={motion} oninput={(e) => { const el = e.currentTarget as any; motion = (el.value ?? motion); }} onclick={(e) => { const el = e.currentTarget as any; motion = (el.value ?? motion); }} ontoggle={(e) => { const el = e.currentTarget as any; motion = (el.value ?? motion); }} onchange={(e) => { const v = ((e as CustomEvent<any>).detail ?? (e.currentTarget as any).value); motion = v as MotionPreset }} size="sm">
            {#each MOTION_PRESETS as { value, label }}
              <button class="sg-toggle" value={value}>{label}</button>
            {/each}
          </sg-toggle-group>
        </sg-field>
      </div>
      <div class="motion-preview">
        <div class="motion-info-grid">
          <div class="motion-stat">
            <sg-text size="xs" color="muted">Duration Scale</sg-text>
            <sg-text size="lg" weight="semibold">{resolvedMotionValues.durationScale}x</sg-text>
          </div>
          <div class="motion-stat">
            <sg-text size="xs" color="muted">Default Spring</sg-text>
            <sg-text size="lg" weight="semibold">{resolvedMotionValues.defaultSpring}</sg-text>
          </div>
          <div class="motion-stat">
            <sg-text size="xs" color="muted">Reduced Motion</sg-text>
            <sg-text size="lg" weight="semibold">{resolvedMotionValues.reducedMotion}</sg-text>
          </div>
          <div class="motion-stat">
            <sg-text size="xs" color="muted">200ms → {Math.round(200 * resolvedMotionValues.durationScale)}ms</sg-text>
            <div class="motion-bar-container">
              <div class="motion-bar" style="animation-duration: {Math.round(200 * resolvedMotionValues.durationScale)}ms"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Resolved Palettes -->
    {#if resolved}
      <div class="divider"></div>
      <div class="section-header">
        <sg-heading level={3}>Resolved Palettes</sg-heading>
        <sg-text color="secondary">Full shade ramps generated from brand color via {harmonyMode} harmony.</sg-text>
      </div>

      <div class="palettes-grid">
        {#each PALETTE_NAMES as name}
          {@const palette = resolved.palettes[name]}
          {#if palette}
            <sg-stack gap="grouped">
              <sg-text as="span" size="xs" weight="semibold" style="text-transform: capitalize; letter-spacing: var(--sg-tracking-wide); color: var(--sg-color-text-secondary, #666)">{name}</sg-text>
              <div class="shade-ramp">
                {#each shadeStops as stop}
                  {@const oklch = palette.ramp[stop]}
                  {#if oklch}
                    {@const hex = fromOklch(oklch, "hex")}
                    <div
                      class="shade-swatch"
                      class:light-swatch={isLightColor(hex)}
                      class:dark-swatch={!isLightColor(hex)}
                      style="background: {hex}"
                      onclick={() => copyHex(hex, toast.add)}
                      title="{name}-{stop}: {hex}"
                    >
                      <span class="stop-num">{stop}</span>
                      <span class="hex-val">{hex}</span>
                    </div>
                  {/if}
                {/each}
              </div>
            </sg-stack>
          {/if}
        {/each}
      </div>

      <!-- Surfaces -->
      <div class="section-header" style="margin-top: var(--sg-space-8)">
        <sg-heading level={3}>Surface Scale</sg-heading>
        <sg-text color="secondary">Brand-tinted surface hierarchy for {appearance} mode.</sg-text>
      </div>

      {@const surfaceScale = appearance === "light" ? resolved.surfaces.light : resolved.surfaces.dark}
      <div class="surface-preview">
        {#each Object.entries(surfaceScale) as [name, hex]}
          <div
            class="surface-swatch"
            style="background: {hex}"
            onclick={() => copyHex(hex, toast.add)}
            title="{name}: {hex}"
          >
            <span style="color: {isLightColor(hex) ? '#1a1a2e' : '#fafafa'}; font-size: var(--sg-text-xs); font-weight: var(--sg-weight-semibold)">{name.replace('bg.', '').replace('border.', 'b.')}</span>
            <span style="color: {isLightColor(hex) ? '#1a1a2e' : '#fafafa'}; font-size: var(--sg-text-2xs); font-family: var(--sg-font-mono); opacity: 0.8">{hex}</span>
          </div>
        {/each}
      </div>

      <!-- Semantic Roles -->
      {#if roles}
        <div class="section-header" style="margin-top: var(--sg-space-8)">
          <sg-heading level={3}>Semantic Roles</sg-heading>
          <sg-text color="secondary">Token-to-color mappings for {appearance} mode.</sg-text>
        </div>

        <sg-card padding="lg">
          <sg-stack gap="relaxed">
            <!-- Core -->
            <sg-stack gap="compact">
              <sg-text as="span" size="xs" weight="semibold" style="text-transform: uppercase; letter-spacing: var(--sg-tracking-caps); color: var(--sg-color-text-secondary, #666)">Core Actions</sg-text>
              <sg-stack direction="horizontal" wrap gap="compact">
                {#each ["primary", "secondary", "tertiary", "accent", "highlight"] as role}
                  {@const hex = roleToHex(role)}
                  {#if hex}
                    <sg-badge color="ghost" style="background: {hex}; color: {isLightColor(hex) ? '#000' : '#fff'}">{role}</sg-badge>
                  {/if}
                {/each}
              </sg-stack>
            </sg-stack>

            <!-- Status -->
            <sg-stack gap="compact">
              <sg-text as="span" size="xs" weight="semibold" style="text-transform: uppercase; letter-spacing: var(--sg-tracking-caps); color: var(--sg-color-text-secondary, #666)">Status</sg-text>
              <sg-stack direction="horizontal" wrap gap="compact">
                {#each ["success", "warning", "danger", "info"] as role}
                  {@const hex = roleToHex(role)}
                  {#if hex}
                    <sg-badge color="ghost" size="sm" style="background: {hex}; color: {isLightColor(hex) ? '#000' : '#fff'}">{role}</sg-badge>
                  {/if}
                {/each}
              </sg-stack>
            </sg-stack>

            <!-- Text -->
            <sg-stack gap="compact">
              <sg-text as="span" size="xs" weight="semibold" style="text-transform: uppercase; letter-spacing: var(--sg-tracking-caps); color: var(--sg-color-text-secondary, #666)">Text Hierarchy</sg-text>
              <div class="text-hierarchy" style="background: {roleToHex('surface-container') || 'var(--surface)'}; padding: var(--sg-space-4); border-radius: var(--radius-sm)">
                <sg-heading level={4} style="color: {roleToHex('title')}">Title</sg-heading>
                <sg-text weight="semibold" style="color: {roleToHex('subtitle')}">Subtitle</sg-text>
                <sg-text style="color: {roleToHex('text')}">Body text</sg-text>
                <sg-text style="color: {roleToHex('text-secondary')}">Secondary text</sg-text>
                <sg-text style="color: {roleToHex('text-muted')}">Muted text</sg-text>
              </div>
            </sg-stack>

            <!-- Interaction states -->
            <sg-stack gap="compact">
              <sg-text as="span" size="xs" weight="semibold" style="text-transform: uppercase; letter-spacing: var(--sg-tracking-caps); color: var(--sg-color-text-secondary, #666)">Interaction States</sg-text>
              <sg-stack gap="compact">
                {#each ["primary", "secondary", "danger"] as role}
                  {@const mapping = roles?.[role]}
                  {@const baseHex = roleToHex(role)}
                  {@const interaction = mapping ? getInteractionShades(mapping.shade, appearance) : null}
                  {@const subtleHex = mapping && interaction ? shadeHex(mapping.palette, interaction.subtle) : ''}
                  {@const hoverHex = mapping && interaction ? shadeHex(mapping.palette, interaction.hover) : ''}
                  {@const activeHex = mapping && interaction ? shadeHex(mapping.palette, interaction.active) : ''}
                  <sg-stack direction="horizontal" align="center" gap="compact">
                    <sg-text as="span" size="xs" style="color: var(--sg-color-text-secondary, #666); min-width: 72px; text-align: right">{role}</sg-text>
                    <sg-stack direction="horizontal" gap="grouped">
                      <sg-badge color="ghost" size="sm" style="background: {subtleHex}; color: {baseHex}" title="{role}-subtle">subtle</sg-badge>
                      <sg-badge color="ghost" size="sm" style="background: {baseHex}; color: {isLightColor(baseHex || '#000') ? '#000' : '#fff'}" title="{role}">base</sg-badge>
                      <sg-badge color="ghost" size="sm" style="background: {hoverHex}; color: {isLightColor(hoverHex || '#000') ? '#000' : '#fff'}" title="{role}-hover">hover</sg-badge>
                      <sg-badge color="ghost" size="sm" style="background: {activeHex}; color: {isLightColor(activeHex || '#000') ? '#000' : '#fff'}" title="{role}-active">active</sg-badge>
                    </sg-stack>
                  </sg-stack>
                {/each}
              </sg-stack>
            </sg-stack>

            <!-- Data viz -->
            <sg-stack gap="compact">
              <sg-text as="span" size="xs" weight="semibold" style="text-transform: uppercase; letter-spacing: var(--sg-tracking-caps); color: var(--sg-color-text-secondary, #666)">Data Visualization</sg-text>
              <div class="dataviz-strip">
                {#each resolved.dataColors as hex, i}
                  <div
                    class="dataviz-swatch"
                    style="background: {hex}"
                    title="data-{i + 1}: {hex}"
                    onclick={() => copyHex(hex, toast.add)}
                  >
                    <span class="dataviz-label" style="color: {isLightColor(hex) ? '#000' : '#fff'}">{i + 1}</span>
                  </div>
                {/each}
              </div>
            </sg-stack>
          </sg-stack>
        </sg-card>
      {/if}

      <!-- Typography preview -->
      <div class="section-header" style="margin-top: var(--sg-space-8)">
        <sg-heading level={3}>Typography Scale</sg-heading>
        <sg-text color="secondary">Font sizes from the resolved type scale ({resolved.typography.fontFamily.split(",")[0]}).</sg-text>
      </div>
      <div class="type-scale-preview">
        {#each Object.entries(resolved.typography.scale) as [key, ratio]}
          {@const fontSize = round(ratio * 16, 2)}
          <div class="type-row">
            <span class="type-label">{key}</span>
            <span class="type-size">{fontSize}px</span>
            <span class="type-sample" style="font-size: {fontSize}px; line-height: {resolved.typography.lineHeights[key] ?? '1.5'}">{key === "xs" || key === "sm" ? "The quick brown fox" : "Aa"}</span>
          </div>
        {/each}
      </div>

      <!-- Spacing preview -->
      <div class="section-header" style="margin-top: var(--sg-space-8)">
        <sg-heading level={3}>Spacing Scale</sg-heading>
        <sg-text color="secondary">Base unit: {resolved.spacing.baseUnit}px &middot; Density factor: {resolvedDensity.factor}x</sg-text>
      </div>
      <div class="spacing-preview">
        {#each [...resolved.spacing.scale] as [key, entry]}
          <div class="spacing-row">
            <span class="spacing-label">{key}</span>
            <span class="spacing-value">{entry.rem}</span>
            <div class="spacing-bar" style="width: {Math.min(entry.px, 400)}px"></div>
          </div>
        {/each}
      </div>

      <!-- Elevation preview -->
      <div class="section-header" style="margin-top: var(--sg-space-8)">
        <sg-heading level={3}>Elevation</sg-heading>
        <sg-text color="secondary">Shadows, radii, and borders resolved for {depth} depth.</sg-text>
      </div>
      <div class="elevation-grid">
        <sg-stack gap="compact">
          <sg-text size="xs" weight="semibold" style="text-transform: uppercase; letter-spacing: var(--sg-tracking-caps); color: var(--sg-color-text-secondary, #666)">Shadows</sg-text>
          <div class="shadow-preview">
            {#each resolved.elevation.shadows as shadow}
              <div class="shadow-card" style="box-shadow: {shadow.css}">
                <span class="shadow-label">{shadow.name}</span>
              </div>
            {/each}
          </div>
        </sg-stack>

        <sg-stack gap="compact">
          <sg-text size="xs" weight="semibold" style="text-transform: uppercase; letter-spacing: var(--sg-tracking-caps); color: var(--sg-color-text-secondary, #666)">Border Radii</sg-text>
          <div class="radii-preview">
            {#each Object.entries(resolved.elevation.radii) as [name, value]}
              <div class="radii-card" style="border-radius: {value}px">
                <span class="radii-label">{name}</span>
                <span class="radii-value">{value}px</span>
              </div>
            {/each}
          </div>
        </sg-stack>
      </div>

      <!-- Export -->
      <div class="divider"></div>
      <div class="export-section">
        <sg-heading level={3}>Export</sg-heading>
        <sg-text color="secondary" style="margin-bottom: var(--sg-space-4)">Copy your resolved theme as a SiguiConfig or CSS custom properties.</sg-text>
        <sg-button-group>
          <button class="sg-button" data-color="ghost" onclick={() => copyExport("config")}>Copy Config</button>
          <button class="sg-button" data-color="ghost" onclick={() => copyExport("css")}>Copy CSS</button>
        </sg-button-group>

        <div style="margin-top: var(--sg-space-4)">
          <sg-code-block
            title="sigui.config.ts"
            language="typescript"
            code={exportConfig()}
          />
        </div>
      </div>
    {/if}
</sg-section>

<style>
  .axis-group {
    margin-top: var(--sg-space-8);
  }

  .divider {
    margin: var(--sg-space-10) 0 var(--sg-space-6);
    border-top: var(--sg-border-thin) solid var(--border, oklch(0.5 0 0 / 0.2));
  }

  .brand-swatch-row {
    display: flex;
    align-items: center;
    gap: var(--sg-gap-related);
  }

  .brand-swatch {
    width: 32px;
    height: 32px;
    border-radius: var(--sg-radius-sm);
    border: var(--sg-border-thin) solid oklch(0.5 0 0 / 0.2);
  }

  /* Shape preview */
  .shape-preview {
    display: flex;
    gap: var(--sg-space-3);
    margin-top: var(--sg-space-4);
    flex-wrap: wrap;
  }

  .shape-card {
    width: 80px;
    height: 80px;
    background: var(--sg-surface-container-low, oklch(0.95 0.01 250));
    border: var(--sg-border-thin) solid var(--border, oklch(0.8 0.01 250));
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--sg-gap-tight);
  }

  .shape-label {
    font-size: var(--sg-text-xs);
    font-weight: var(--sg-weight-semibold);
    color: var(--sg-color-text-secondary);
  }

  .shape-value {
    font-size: var(--sg-text-2xs);
    font-family: var(--sg-font-mono);
    color: var(--text-3);
  }

  /* Depth preview */
  .depth-preview {
    display: flex;
    gap: var(--sg-gap-grouped);
    margin-top: var(--sg-space-4);
    flex-wrap: wrap;
  }

  .depth-card {
    width: 100px;
    height: 80px;
    background: var(--surface, #fff);
    border-radius: var(--radius-sm, 8px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--sg-gap-tight);
  }

  .depth-label {
    font-size: var(--sg-text-xs);
    font-weight: var(--sg-weight-semibold);
    color: var(--sg-color-text-secondary);
  }

  .depth-value {
    font-size: var(--sg-text-2xs);
    font-family: var(--sg-font-mono);
    color: var(--text-3);
  }

  /* Density preview */
  .density-preview {
    display: flex;
    gap: var(--sg-gap-grouped);
    align-items: flex-start;
    margin-top: var(--sg-space-4);
    flex-wrap: wrap;
  }

  .density-demo {
    display: flex;
    flex-direction: column;
    background: var(--sg-surface-container-low, oklch(0.95 0.01 250));
    border: var(--sg-border-thin) solid var(--border, oklch(0.8 0.01 250));
    border-radius: var(--radius-sm, 8px);
    min-width: 200px;
  }

  .density-row {
    background: var(--surface, #fff);
    border: var(--sg-border-thin) solid var(--border, oklch(0.8 0.01 250));
    border-radius: var(--sg-radius-sm);
    font-size: var(--sg-text-sm);
    color: var(--sg-color-text-secondary);
  }

  .density-info {
    display: flex;
    flex-direction: column;
    gap: var(--sg-gap-related);
  }

  /* Motion preview */
  .motion-info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: var(--sg-gap-grouped);
    margin-top: var(--sg-space-4);
  }

  .motion-stat {
    display: flex;
    flex-direction: column;
    gap: var(--sg-gap-tight);
  }

  .motion-bar-container {
    height: 6px;
    background: var(--sg-surface-container-low, oklch(0.9 0.01 250));
    border-radius: 3px;
    overflow: hidden;
    margin-top: var(--sg-space-1);
  }

  .motion-bar {
    height: 100%;
    width: 0;
    background: var(--sg-color-border-focus, oklch(0.55 0.15 250));
    border-radius: 3px;
    animation: motion-slide 2s ease-in-out infinite;
  }

  @keyframes motion-slide {
    0% { width: 0; }
    50% { width: 100%; }
    100% { width: 0; }
  }

  /* Palettes */
  .palettes-grid {
    display: flex;
    flex-direction: column;
    gap: var(--sg-space-3);
  }

  /* Surface preview */
  .surface-preview {
    display: flex;
    gap: var(--sg-gap-tight);
    border-radius: var(--radius-sm, 8px);
    overflow: hidden;
  }

  .surface-swatch {
    flex: 1;
    height: 64px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--sg-gap-micro);
    cursor: pointer;
    transition: flex var(--sg-duration-normal);
  }

  .surface-swatch:hover {
    flex: 2;
  }

  /* Data viz */
  .dataviz-strip {
    display: flex;
    gap: var(--sg-gap-micro);
    border-radius: 8px;
    overflow: hidden;
  }

  .dataviz-swatch {
    flex: 1;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .dataviz-label {
    font-size: var(--sg-text-2xs);
    font-weight: 600;
  }

  .text-hierarchy {
    display: flex;
    flex-direction: column;
    gap: var(--sg-gap-tight);
  }

  /* Typography scale */
  .type-scale-preview {
    display: flex;
    flex-direction: column;
    gap: var(--sg-gap-related);
  }

  .type-row {
    display: flex;
    align-items: baseline;
    gap: var(--sg-space-3);
  }

  .type-label {
    font-size: var(--sg-text-xs);
    font-weight: var(--sg-weight-semibold);
    min-width: 40px;
    color: var(--sg-color-text-secondary);
  }

  .type-size {
    font-size: var(--sg-text-xs);
    font-family: var(--sg-font-mono);
    color: var(--text-3);
    min-width: 56px;
  }

  .type-sample {
    color: var(--text-1);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Spacing */
  .spacing-preview {
    display: flex;
    flex-direction: column;
    gap: var(--sg-gap-tight);
    max-height: 400px;
    overflow-y: auto;
  }

  .spacing-row {
    display: flex;
    align-items: center;
    gap: var(--sg-gap-related);
  }

  .spacing-label {
    font-size: var(--sg-text-xs);
    font-weight: var(--sg-weight-semibold);
    min-width: 32px;
    color: var(--sg-color-text-secondary);
    text-align: right;
  }

  .spacing-value {
    font-size: var(--sg-text-xs);
    font-family: var(--sg-font-mono);
    color: var(--text-3);
    min-width: 56px;
  }

  .spacing-bar {
    height: 12px;
    background: var(--sg-color-primary-subtle, oklch(0.85 0.08 250));
    border-radius: 2px;
    min-width: 2px;
    max-width: 100%;
  }

  /* Elevation */
  .elevation-grid {
    display: flex;
    flex-direction: column;
    gap: var(--sg-space-6);
  }

  .shadow-preview {
    display: flex;
    gap: var(--sg-gap-grouped);
    flex-wrap: wrap;
    margin-top: var(--sg-space-2);
  }

  .shadow-card {
    width: 80px;
    height: 64px;
    background: var(--surface, #fff);
    border-radius: var(--radius-sm, 8px);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .shadow-label {
    font-size: var(--sg-text-xs);
    font-weight: var(--sg-weight-semibold);
    color: var(--sg-color-text-secondary);
  }

  .radii-preview {
    display: flex;
    gap: var(--sg-space-3);
    flex-wrap: wrap;
    margin-top: var(--sg-space-2);
  }

  .radii-card {
    width: 72px;
    height: 56px;
    background: var(--sg-surface-container-low, oklch(0.95 0.01 250));
    border: var(--sg-border-thin) solid var(--border, oklch(0.8 0.01 250));
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--sg-gap-micro);
  }

  .radii-label {
    font-size: var(--sg-text-2xs);
    font-weight: var(--sg-weight-semibold);
    color: var(--sg-color-text-secondary);
  }

  .radii-value {
    font-size: var(--sg-text-2xs);
    font-family: var(--sg-font-mono);
    color: var(--text-3);
  }

  .export-section {
    margin-top: var(--sg-space-2);
  }
</style>
