<script lang="ts">
  import { composePalette, generateFullPalette, toOklch, fromOklch } from "../../../packages/core/src/index.js";
  import type { HarmonyMode, ComposedPalette, ThemeColors } from "../../../packages/core/src/index.js";
  import { isLightColor, round, copyHex } from "../utils.ts";
  import { getToastContext } from "../toast-context.ts";
  const toast = getToastContext();

  let primaryHex = $state("#6366f1");
  let harmonyMode: HarmonyMode = $state("triadic");
  let colorMode: "light" | "dark" = $state("light");
  let customBackground = $state("");

  const shadeStops = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

  const HARMONY_MODES: { value: HarmonyMode; label: string }[] = [
    { value: "monochromatic", label: "Mono" },
    { value: "complementary", label: "Comp" },
    { value: "analogous", label: "Analog" },
    { value: "split-complementary", label: "Split" },
    { value: "triadic", label: "Triadic" },
    { value: "tetradic", label: "Tetra" },
  ];

  const PALETTE_NAMES = [
    "primary",
    "secondary",
    "tertiary",
    "accent",
    "neutral",
    "success",
    "warning",
    "danger",
    "info",
  ] as const;

  let theme: ComposedPalette | null = $derived.by(() => {
    try {
      return composePalette(primaryHex, {
        harmony: harmonyMode,
        mode: colorMode,
        background: customBackground || undefined,
      });
    } catch {
      return null;
    }
  });

  let primaryOklch = $derived.by(() => {
    try {
      return toOklch(primaryHex);
    } catch {
      return null;
    }
  });

  /** Full theme with semantic roles from generateFullPalette() */
  let themeColors: ThemeColors | null = $derived.by(() => {
    try {
      return generateFullPalette(primaryHex, {
        harmony: harmonyMode,
        mode: colorMode,
        background: customBackground || undefined,
      });
    } catch {
      return null;
    }
  });

  let roles = $derived(themeColors?.roles ?? null);

  /** Actionable role names that have -hover/-active/-subtle variants */
  const ACTIONABLE_ROLES = ["primary", "secondary", "tertiary", "accent", "highlight", "success", "warning", "danger", "info"] as const;

  function exportCSS(): string {
    if (!theme) return "";
    const lines: string[] = [":root {"];
    lines.push("  /* Primitive palette (internal) */");
    for (const [name, palette] of Object.entries(theme.palettes)) {
      for (const stop of shadeStops) {
        const hex = palette.formatted[stop];
        if (hex) lines.push(`  --${name}-${stop}: ${hex};`);
      }
    }
    if (roles) {
      lines.push("");
      lines.push("  /* Semantic tokens */");
      for (const [role, hex] of Object.entries(roles)) {
        lines.push(`  --sg-color-${role}: ${hex};`);
      }
    }
    lines.push("}");
    return lines.join("\n");
  }

  function exportJSON(): string {
    if (!theme) return "";
    const obj: Record<string, Record<string, string>> = {};
    for (const [name, palette] of Object.entries(theme.palettes)) {
      obj[name] = {};
      for (const stop of shadeStops) {
        const hex = palette.formatted[stop];
        if (hex) obj[name][stop] = hex;
      }
    }
    return JSON.stringify({ palettes: obj, roles }, null, 2);
  }

  function exportTS(): string {
    if (!theme) return "";
    const lines: string[] = [
      `import { generateFullPalette } from "@sig-ui/core";`,
      ``,
      `export const theme = generateFullPalette("${primaryHex}", {`,
      `  harmony: "${harmonyMode}",`,
      `  mode: "${colorMode}",`,
      customBackground ? `  background: "${customBackground}",` : "",
      `});`,
      ``,
      `// theme.palettes  – full shade ramps (primary, secondary, tertiary, accent, neutral, status)`,
      `// theme.roles     – 40+ semantic tokens (--sg-color-*)`,
    ].filter(Boolean);
    return lines.join("\n");
  }

  function copyExport(format: "css" | "json" | "ts") {
    let text = "";
    if (format === "css") text = exportCSS();
    else if (format === "json") text = exportJSON();
    else text = exportTS();
    navigator.clipboard.writeText(text);
    toast.add(`Copied ${format.toUpperCase()}`);
  }
</script>

<sg-section id="full-palette-generator" title="Full Palette Generator" description="Pick a primary color and harmony mode to auto-generate a complete design system palette.">

    <!-- Controls -->
    <div class="controls">
      <sg-field label="Primary Color">
        <sg-color-picker value={primaryHex} oninput={(e) => { const el = e.currentTarget as any; primaryHex = (el.value ?? primaryHex); }} onchange={(e) => { const el = e.currentTarget as any; primaryHex = (el.value ?? primaryHex); }} onclick={(e) => { const el = e.currentTarget as any; primaryHex = (el.value ?? primaryHex); }} ontoggle={(e) => { const el = e.currentTarget as any; primaryHex = (el.value ?? primaryHex); }} mode="popover" input label="Color" />
      </sg-field>

      <sg-field label="Harmony Mode">
        <sg-toggle-group type="single" value={harmonyMode} oninput={(e) => { const el = e.currentTarget as any; harmonyMode = (el.value ?? harmonyMode); }} onclick={(e) => { const el = e.currentTarget as any; harmonyMode = (el.value ?? harmonyMode); }} ontoggle={(e) => { const el = e.currentTarget as any; harmonyMode = (el.value ?? harmonyMode); }} onchange={(e) => { const v = ((e as CustomEvent<any>).detail ?? (e.currentTarget as any).value); harmonyMode = v as HarmonyMode }}>
          {#each HARMONY_MODES as { value, label }}
            <button class="sg-toggle" value={value}>{label}</button>
          {/each}
        </sg-toggle-group>
      </sg-field>

      <sg-field label="Mode">
        <sg-toggle-group type="single" value={colorMode} oninput={(e) => { const el = e.currentTarget as any; colorMode = (el.value ?? colorMode); }} onclick={(e) => { const el = e.currentTarget as any; colorMode = (el.value ?? colorMode); }} ontoggle={(e) => { const el = e.currentTarget as any; colorMode = (el.value ?? colorMode); }} onchange={(e) => { const v = ((e as CustomEvent<any>).detail ?? (e.currentTarget as any).value); colorMode = v as "light" | "dark" }}>
          <button class="sg-toggle" value="light">Light</button>
          <button class="sg-toggle" value="dark">Dark</button>
        </sg-toggle-group>
      </sg-field>

      <sg-field label="Background Override">
        <sg-color-picker value={customBackground || "#ffffff"} onchange={(e) => { const d = ((e as CustomEvent<any>).detail ?? { hex: (e.currentTarget as any).value }); customBackground = d.hex }} mode="popover" input label="Color" />
      </sg-field>
    </div>

    <!-- OKLCH Info -->
    {#if primaryOklch}
      <div class="oklch-info">
        <div class="info-item">
          <div class="info-label">Lightness</div>
          <div class="info-value">{round(primaryOklch.l, 3)}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Chroma</div>
          <div class="info-value">{round(primaryOklch.c, 3)}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Hue</div>
          <div class="info-value">{round(primaryOklch.h, 1)}&deg;</div>
        </div>
      </div>
    {/if}

    <!-- Harmony Hue Preview -->
    {#if theme}
      <div class="harmony-preview">
        <span class="card-label">Harmony Hues</span>
        <div class="hue-dots">
          {#each theme.harmony.hues as hue, i}
            {@const dotColor = fromOklch({ l: 0.65, c: 0.2, h: hue, alpha: 1 }, "hex")}
            <div
              class="hue-dot"
              style="background: {dotColor}"
              title="{Math.round(hue)}&deg;"
            >
              <span class="hue-label">{Math.round(hue)}&deg;</span>
            </div>
          {/each}
        </div>
      </div>

      <!-- Palette Ramps -->
      <div class="theme-palettes">
        {#each PALETTE_NAMES as name}
          {@const palette = theme.palettes[name]}
          {#if palette}
            <sg-stack gap="grouped">
              <sg-text as="span" size="xs" weight="semibold" style="text-transform: capitalize; letter-spacing: var(--sg-tracking-wide); color: var(--sg-color-text-secondary, #666)">{name}</sg-text>
              <div class="shade-ramp">
                {#each shadeStops as stop}
                  {@const hex = palette.formatted[stop]}
                  {#if hex}
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

      <!-- Semantic Roles Preview -->
      <div class="roles-section">
        <span class="card-label">Semantic Roles</span>
        <sg-card padding="lg" style="margin-top: var(--sg-space-2)">
          <sg-stack gap="relaxed">
            <!-- Core action colors -->
            <sg-stack gap="compact">
              <sg-text as="span" size="xs" weight="semibold" style="color: {roles?.['text-secondary']}; text-transform: uppercase; letter-spacing: var(--sg-tracking-caps)">Core</sg-text>
              <sg-stack direction="horizontal" wrap gap="compact">
                {#each ["primary", "secondary", "tertiary", "accent", "highlight"] as role}
                  <sg-badge color="ghost" style="background: {roles?.[role]}; color: {isLightColor(roles?.[role] ?? '#000') ? '#000' : '#fff'}">{role}</sg-badge>
                {/each}
              </sg-stack>
            </sg-stack>

            <!-- Status colors -->
            <sg-stack gap="compact">
              <sg-text as="span" size="xs" weight="semibold" style="color: {roles?.['text-secondary']}; text-transform: uppercase; letter-spacing: var(--sg-tracking-caps)">Status</sg-text>
              <sg-stack direction="horizontal" wrap gap="compact">
                {#each ["success", "warning", "danger", "info"] as role}
                  <sg-badge color="ghost" size="sm" style="background: {roles?.[role]}; color: {isLightColor(roles?.[role] ?? '#000') ? '#000' : '#fff'}">{role}</sg-badge>
                {/each}
              </sg-stack>
            </sg-stack>

            <!-- Text hierarchy -->
            <sg-stack gap="compact">
              <sg-text as="span" size="xs" weight="semibold" style="color: {roles?.['text-secondary']}; text-transform: uppercase; letter-spacing: var(--sg-tracking-caps)">Text</sg-text>
              <sg-stack gap="grouped" style="color: {roles?.['text']}">
                <sg-heading level={4} style="color: {roles?.['title']}">Title</sg-heading>
                <sg-text weight="semibold" style="color: {roles?.['subtitle']}">Subtitle</sg-text>
                <sg-text>Body text</sg-text>
                <sg-text style="color: {roles?.['text-secondary']}">Secondary text</sg-text>
                <sg-text style="color: {roles?.['text-muted']}">Muted text</sg-text>
                <sg-text style="color: {roles?.['emphasis']}; font-style: italic">Emphasis</sg-text>
                <sg-text>
                  <a class="sg-link" href="#full-palette-generator" data-underline="always" style="color: {roles?.['link']}">Link</a>
                  <span style="margin: 0 var(--sg-space-2)">&middot;</span>
                  <a class="sg-link" href="#full-palette-generator" data-underline="always" style="color: {roles?.['link-visited']}">Visited</a>
                </sg-text>
              </sg-stack>
            </sg-stack>

            <!-- Surfaces & borders -->
            <sg-stack gap="compact">
              <sg-text as="span" size="xs" weight="semibold" style="color: {roles?.['text-secondary']}; text-transform: uppercase; letter-spacing: var(--sg-tracking-caps)">Surfaces</sg-text>
              <sg-stack direction="horizontal" wrap gap="compact">
                <sg-badge color="ghost" style="background: {roles?.['surface']}; border: var(--sg-border-thin) solid {roles?.['border']}; color: {roles?.['text']}">Surface</sg-badge>
                <sg-badge color="ghost" style="background: {roles?.['surface-alt']}; border: var(--sg-border-thin) solid {roles?.['border-light']}; color: {roles?.['text']}">Surface Alt</sg-badge>
                <sg-badge color="ghost" size="sm" style="background: {roles?.['shadow']}; color: #fff">Shadow</sg-badge>
              </sg-stack>
            </sg-stack>

            <!-- Code tokens -->
            <sg-stack gap="compact">
              <sg-text as="span" size="xs" weight="semibold" style="color: {roles?.['text-secondary']}; text-transform: uppercase; letter-spacing: var(--sg-tracking-caps)">Code</sg-text>
              <div class="code-preview" style="background: {roles?.['code-bg']}; color: {roles?.['code-text']}">
                <code class="sg-code" style="background: transparent; color: inherit">const theme = generateFullPalette(hex);</code>
              </div>
            </sg-stack>

            <!-- Interaction states -->
            <sg-stack gap="compact">
              <sg-text as="span" size="xs" weight="semibold" style="color: {roles?.['text-secondary']}; text-transform: uppercase; letter-spacing: var(--sg-tracking-caps)">Interaction States</sg-text>
              <sg-stack gap="compact">
                {#each ["primary", "secondary", "danger"] as role}
                  <sg-stack direction="horizontal" align="center" gap="compact">
                    <sg-text as="span" size="xs" style="color: {roles?.['text-muted']}; min-width: 72px; text-align: right">{role}</sg-text>
                    <sg-stack direction="horizontal" gap="grouped">
                      <sg-badge color="ghost" size="sm" style="background: {roles?.[`${role}-subtle`]}; color: {roles?.[role]}" title="{role}-subtle">subtle</sg-badge>
                      <sg-badge color="ghost" size="sm" style="background: {roles?.[role]}; color: {isLightColor(roles?.[role] ?? '#000') ? '#000' : '#fff'}" title="{role}">base</sg-badge>
                      <sg-badge color="ghost" size="sm" style="background: {roles?.[`${role}-hover`]}; color: {isLightColor(roles?.[`${role}-hover`] ?? '#000') ? '#000' : '#fff'}" title="{role}-hover">hover</sg-badge>
                      <sg-badge color="ghost" size="sm" style="background: {roles?.[`${role}-active`]}; color: {isLightColor(roles?.[`${role}-active`] ?? '#000') ? '#000' : '#fff'}" title="{role}-active">active</sg-badge>
                    </sg-stack>
                  </sg-stack>
                {/each}
              </sg-stack>
            </sg-stack>

            <!-- Data visualization tokens -->
            <sg-stack gap="compact">
              <sg-text as="span" size="xs" weight="semibold" style="color: {roles?.['text-secondary']}; text-transform: uppercase; letter-spacing: var(--sg-tracking-caps)">Data Visualization</sg-text>
              <div class="dataviz-strip">
                {#each Array.from({ length: 12 }, (_, i) => i + 1) as n}
                  {@const hex = roles?.[`data-${n}`] ?? ''}
                  <div
                    class="dataviz-swatch"
                    style="background: {hex}"
                    title="data-{n}: {hex}"
                  >
                    <span class="dataviz-label" style="color: {isLightColor(hex) ? '#000' : '#fff'}">{n}</span>
                  </div>
                {/each}
              </div>
              <sg-text size="xs" style="color: {roles?.['text-muted']}; margin-top: var(--sg-space-1)">
                12 equally-spaced hues (30&deg; apart) from primary &middot; L=0.55 &middot; chroma 0.08&ndash;0.15
              </sg-text>
            </sg-stack>
          </sg-stack>
        </sg-card>
      </div>

      <!-- Overlay Scales Preview -->
      <div class="overlay-section">
        <span class="card-label">Overlay Scales</span>
        <sg-stack gap="compact" style="margin-top: var(--sg-space-2)">
          <sg-stack gap="grouped">
            <sg-text as="span" size="xs" weight="semibold" style="letter-spacing: var(--sg-tracking-wide); color: var(--sg-color-text-secondary, #666)">BlackAlpha</sg-text>
            <div class="overlay-ramp">
              {#each theme.blackAlpha as step}
                <div
                  class="overlay-swatch"
                  style="background: {step.css}"
                  title="Step {step.step}: opacity {step.opacity}"
                >
                  <span class="overlay-step-num">{step.step}</span>
                </div>
              {/each}
            </div>
          </sg-stack>
          <sg-stack gap="grouped">
            <sg-text as="span" size="xs" weight="semibold" style="letter-spacing: var(--sg-tracking-wide); color: var(--sg-color-text-secondary, #666)">WhiteAlpha</sg-text>
            <div class="overlay-ramp overlay-ramp-dark">
              {#each theme.whiteAlpha as step}
                <div
                  class="overlay-swatch"
                  style="background: {step.css}"
                  title="Step {step.step}: opacity {step.opacity}"
                >
                  <span class="overlay-step-num">{step.step}</span>
                </div>
              {/each}
            </div>
          </sg-stack>
        </sg-stack>
      </div>

      <!-- Export Panel -->
      <div class="export-panel">
        <span class="card-label">Export</span>
        <sg-button-group style="margin-top: var(--sg-space-2)">
          <button class="sg-button" data-color="ghost" onclick={() => copyExport("css")}>Copy CSS</button>
          <button class="sg-button" data-color="ghost" onclick={() => copyExport("json")}>Copy JSON</button>
          <button class="sg-button" data-color="ghost" onclick={() => copyExport("ts")}>Copy TypeScript</button>
        </sg-button-group>
      </div>
    {/if}
</sg-section>

<style>
  .harmony-preview {
    margin-top: var(--sg-space-6);
  }

  .hue-dots {
    display: flex;
    gap: var(--sg-space-3);
    margin-top: var(--sg-space-2);
    flex-wrap: wrap;
  }

  .hue-dot {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 1px 4px rgba(0,0,0,0.15);
  }

  .hue-label {
    font-size: var(--sg-text-xs);
    font-weight: var(--sg-weight-semibold);
    color: #fff;
    text-shadow: 0 1px 2px rgba(0,0,0,0.5);
  }

  .theme-palettes {
    margin-top: var(--sg-space-8);
    display: flex;
    flex-direction: column;
    gap: var(--sg-space-3);
  }

  .roles-section {
    margin-top: var(--sg-space-8);
  }

  .code-preview {
    padding: var(--sg-pad-button-y, 0.75rem) var(--sg-pad-button-x, 1rem);
    border-radius: 8px;
    font-family: var(--sg-font-mono);
    font-size: var(--sg-text-sm);
  }

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
  }

  .dataviz-label {
    font-size: var(--sg-text-2xs);
    font-weight: 600;
  }

  .overlay-section {
    margin-top: var(--sg-space-8);
  }

  .overlay-ramp {
    display: flex;
    gap: var(--sg-gap-micro);
    background: #ffffff;
    padding: var(--sg-space-1);
    border-radius: 8px;
    border: var(--sg-border-thin) solid rgba(128, 128, 128, 0.2);
  }

  .overlay-ramp-dark {
    background: #000000;
  }

  .overlay-swatch {
    flex: 1;
    height: 36px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 0;
  }

  .overlay-step-num {
    font-size: var(--sg-text-2xs);
    font-weight: 600;
    color: rgba(128, 128, 128, 0.6);
  }

  .export-panel {
    margin-top: var(--sg-space-8);
  }
</style>
