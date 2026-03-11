<script lang="ts">
  import {
    themeToDTCG,
    generatePalette,
    generateSpacingScale,
    generateTypeScale,
    generateShadowScale,
    getDurationScale,
    getEasingCurves,
    toOklch,
    deriveBrandBackground,
  } from "../../../packages/core/src/index.js";
  import type { DTCGGroup } from "../../../packages/core/src/tokens.js";
  import {
    buildCSS,
    buildJSON,
    buildTypeScript,
    validateDTCG,
    createBrandTheme,
    diffTokenSets,
    detectBreakingChanges,
  } from "../../../packages/cli/src/tokens/index.js";
  // Theme Builder
  let primaryColor = $state("#6366f1");
  let outputTab: "json" | "css" | "ts" = $state("json");

  function autoBgFor(hex: string): string {
    try {
      const oklch = toOklch(hex);
      return deriveBrandBackground(oklch.h, oklch.c, "light");
    } catch {
      return "#ffffff";
    }
  }

  let themeTree = $derived.by(() => {
    try {
      const palette = generatePalette(primaryColor, { background: autoBgFor(primaryColor) });
      const spacing = Object.fromEntries(
        [...generateSpacingScale().entries()].map(([k, v]) => [k, v.rem])
      );
      const typeScale = generateTypeScale();
      const typography = { scale: typeScale, base: 16, ratio: 1.2 };
      const shadows = Object.fromEntries(
        generateShadowScale().map(s => [s.name, s.css])
      );
      const durations = getDurationScale();
      const motion = { durations, easings: {} };

      const tree = themeToDTCG({
        palette: { primary: palette.ramp },
        spacing,
        typography: typography as any,
        shadows: shadows as any,
        motion: motion as any,
      });
      return tree;
    } catch {
      return null;
    }
  });

  let validationResult = $derived.by(() => {
    if (!themeTree) return null;
    try {
      return validateDTCG(themeTree);
    } catch {
      return null;
    }
  });

  let cssOutput = $derived.by(() => {
    if (!themeTree) return "";
    try { return buildCSS(themeTree); } catch { return "// Error generating CSS"; }
  });

  let jsonOutput = $derived.by(() => {
    if (!themeTree) return "";
    try { return buildJSON(themeTree); } catch { return "{}"; }
  });

  let tsOutput = $derived.by(() => {
    if (!themeTree) return "";
    try { return buildTypeScript(themeTree); } catch { return "// Error generating TypeScript"; }
  });

  // Brand Theming
  let brandColor = $state("#dc2626");

  let brandComparison = $derived.by(() => {
    try {
      const basePalette = generatePalette(primaryColor, { background: autoBgFor(primaryColor) });
      const brandPalette = generatePalette(brandColor, { background: autoBgFor(brandColor) });

      const baseTree = themeToDTCG({ palette: { primary: basePalette.ramp } });
      const brandOverrides = themeToDTCG({ palette: { primary: brandPalette.ramp } });

      const brandTheme = createBrandTheme(baseTree, {
        name: "brand",
        overrides: flattenTokens(brandOverrides),
      });

      return { base: baseTree, brand: brandTheme };
    } catch {
      return null;
    }
  });

  function flattenTokens(tree: DTCGGroup): Record<string, string | number> {
    const result: Record<string, string | number> = {};
    function walk(obj: any, prefix: string) {
      for (const [key, val] of Object.entries(obj)) {
        if (key.startsWith("$")) continue;
        if (val && typeof val === "object" && "$value" in (val as any)) {
          const v = (val as any).$value;
          if (typeof v === "string" || typeof v === "number") {
            result[prefix ? `${prefix}.${key}` : key] = v;
          }
        } else if (val && typeof val === "object") {
          walk(val, prefix ? `${prefix}.${key}` : key);
        }
      }
    }
    walk(tree, "");
    return result;
  }

  // Token Diff
  let showDiff = $state(false);

  let diffResult = $derived.by(() => {
    if (!brandComparison) return null;
    try {
      const diff = diffTokenSets(brandComparison.base, brandComparison.brand);
      const breaking = detectBreakingChanges(diff);
      return { diff, breaking };
    } catch {
      return null;
    }
  });
</script>

<sg-section id="tokens" title="Design Tokens & Theming" description="W3C DTCG token pipeline: generate theme trees, build CSS/JSON/TypeScript, validate tokens, compare brands, and detect breaking changes.">

    <!-- Theme Builder -->
    <div class="subsection">
      <sg-heading level={3}>Theme Builder</sg-heading>
      <div class="controls">
        <div class="control-group">
          <span class="card-label">Primary Color</span>
          <sg-color-picker value={primaryColor} oninput={(e) => { const el = e.currentTarget as any; primaryColor = (el.value ?? primaryColor); }} onchange={(e) => { const el = e.currentTarget as any; primaryColor = (el.value ?? primaryColor); }} onclick={(e) => { const el = e.currentTarget as any; primaryColor = (el.value ?? primaryColor); }} ontoggle={(e) => { const el = e.currentTarget as any; primaryColor = (el.value ?? primaryColor); }} mode="popover" input label="Color" />
        </div>
      </div>

      {#if validationResult}
        <div class="validation-badge" class:valid={validationResult.valid} class:invalid={!validationResult.valid}>
          {validationResult.valid ? "Valid DTCG" : `${validationResult.errors.length} validation error(s)`}
        </div>
      {/if}
    </div>

    <!-- Build Pipeline -->
    <div class="subsection">
      <sg-heading level={3}>Build Pipeline Output</sg-heading>
      <div class="controls">
        <div class="control-group">
          <span class="card-label">Format</span>
          <sg-toggle-group type="single" value={outputTab} oninput={(e) => { const el = e.currentTarget as any; outputTab = (el.value ?? outputTab); }} onclick={(e) => { const el = e.currentTarget as any; outputTab = (el.value ?? outputTab); }} ontoggle={(e) => { const el = e.currentTarget as any; outputTab = (el.value ?? outputTab); }} onchange={(e) => { const v = ((e as CustomEvent<any>).detail ?? (e.currentTarget as any).value); outputTab = v as "json" | "css" | "ts" }}>
            <button class="sg-toggle" value="json">JSON</button>
            <button class="sg-toggle" value="css">CSS</button>
            <button class="sg-toggle" value="ts">TypeScript</button>
          </sg-toggle-group>
        </div>
      </div>
      <pre class="code-output">{outputTab === "json" ? jsonOutput : outputTab === "css" ? cssOutput : tsOutput}</pre>
    </div>

    <!-- Brand Theming -->
    <div class="subsection">
      <sg-heading level={3}>Brand Theming</sg-heading>
      <div class="controls">
        <div class="control-group">
          <span class="card-label">Base: {primaryColor}</span>
          <sg-color-picker value={primaryColor} oninput={(e) => { const el = e.currentTarget as any; primaryColor = (el.value ?? primaryColor); }} onchange={(e) => { const el = e.currentTarget as any; primaryColor = (el.value ?? primaryColor); }} onclick={(e) => { const el = e.currentTarget as any; primaryColor = (el.value ?? primaryColor); }} ontoggle={(e) => { const el = e.currentTarget as any; primaryColor = (el.value ?? primaryColor); }} disabled mode="popover" input label="Color" />
        </div>
        <div class="control-group">
          <span class="card-label">Brand Override</span>
          <sg-color-picker value={brandColor} oninput={(e) => { const el = e.currentTarget as any; brandColor = (el.value ?? brandColor); }} onchange={(e) => { const el = e.currentTarget as any; brandColor = (el.value ?? brandColor); }} onclick={(e) => { const el = e.currentTarget as any; brandColor = (el.value ?? brandColor); }} ontoggle={(e) => { const el = e.currentTarget as any; brandColor = (el.value ?? brandColor); }} mode="popover" input label="Color" />
        </div>
      </div>
      {#if brandComparison}
        <div class="brand-comparison">
          <div class="brand-col">
            <sg-heading level={4}>Base Theme</sg-heading>
            <pre class="code-output code-output-sm">{JSON.stringify(brandComparison.base, null, 2).slice(0, 500)}...</pre>
          </div>
          <div class="brand-col">
            <sg-heading level={4}>Brand Theme</sg-heading>
            <pre class="code-output code-output-sm">{JSON.stringify(brandComparison.brand, null, 2).slice(0, 500)}...</pre>
          </div>
        </div>
      {/if}
    </div>

    <!-- Token Diff -->
    <div class="subsection">
      <sg-heading level={3}>Token Diff</sg-heading>
      <button class="sg-button" onclick={() => showDiff = !showDiff}>
        {showDiff ? "Hide" : "Show"} Diff
      </button>
      {#if showDiff && diffResult}
        <div class="diff-summary" style="margin-top: var(--sg-space-4)">
          <sg-badge color="success">+{diffResult.diff.added.length} added</sg-badge>
          <sg-badge color="danger">-{diffResult.diff.removed.length} removed</sg-badge>
          <sg-badge color="warning">~{diffResult.diff.changed.length} changed</sg-badge>
          {#if diffResult.breaking.length > 0}
            <sg-badge color="danger">{diffResult.breaking.length} breaking</sg-badge>
          {:else}
            <sg-badge color="success">No breaking changes</sg-badge>
          {/if}
        </div>
        {#if diffResult.diff.changed.length > 0}
          <div class="diff-table" style="margin-top: var(--sg-space-3)">
            <div class="diff-header">
              <span>Token</span>
              <span>Before</span>
              <span>After</span>
            </div>
            {#each diffResult.diff.changed.slice(0, 20) as change}
              <div class="diff-row">
                <code>{change.path}</code>
                <span class="diff-old">{typeof change.before === 'object' ? JSON.stringify(change.before) : String(change.before)}</span>
                <span class="diff-new">{typeof change.after === 'object' ? JSON.stringify(change.after) : String(change.after)}</span>
              </div>
            {/each}
          </div>
        {/if}
      {/if}
    </div>
</sg-section>

<style>
.validation-badge {
  display: inline-block;
  padding: var(--sg-space-1-5) var(--sg-space-4);
  border-radius: var(--sg-radius-full);
  font-size: var(--sg-text-xs);
  font-weight: var(--sg-weight-bold);
}

.validation-badge.valid {
  background: var(--sg-color-success-subtle);
  color: var(--sg-color-success);
  border: var(--sg-border-thin) solid oklch(from var(--sg-color-success) l c h / 0.2);
}

.validation-badge.invalid {
  background: var(--sg-color-danger-subtle);
  color: var(--sg-color-danger);
  border: var(--sg-border-thin) solid oklch(from var(--sg-color-danger) l c h / 0.2);
}

.code-output {
  background: var(--surface);
  border: var(--sg-border-thin) solid var(--sg-color-border);
  border-radius: var(--radius-sm);
  padding: var(--sg-space-4);
  font-family: var(--sg-font-mono);
  font-size: var(--sg-text-xs);
  color: var(--sg-color-text-secondary);
  overflow-x: auto;
  max-height: 400px;
  overflow-y: auto;
  white-space: pre;
  line-height: 1.5;
}

.code-output-sm {
  max-height: 200px;
}

.brand-comparison {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--sg-gap-grouped);
  margin-top: var(--sg-space-4);
}

.brand-col h4 {
  font-size: var(--sg-text-sm);
  margin-bottom: var(--sg-space-2);
  color: var(--sg-color-text-secondary);
}

.diff-summary {
  display: flex;
  gap: var(--sg-space-3);
  flex-wrap: wrap;
}

.diff-stat {
  padding: var(--sg-space-1) var(--sg-space-3);
  border-radius: var(--sg-radius-full);
  font-size: var(--sg-text-xs);
  font-weight: var(--sg-weight-bold);
}

.diff-stat.added { background: var(--sg-color-success-subtle); color: var(--sg-color-success); }
.diff-stat.removed { background: var(--sg-color-danger-subtle); color: var(--sg-color-danger); }
.diff-stat.changed { background: var(--sg-color-warning-subtle); color: var(--sg-color-warning); }
.diff-stat.breaking { background: var(--sg-color-danger-subtle); color: var(--sg-color-danger); }
.diff-stat.safe { background: var(--sg-color-success-subtle); color: var(--sg-color-success); }

.diff-table {
  font-size: var(--sg-text-xs);
}

.diff-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: var(--sg-space-3);
  padding: var(--sg-space-2) 0;
  border-bottom: var(--sg-border-medium) solid var(--sg-color-border);
  font-weight: var(--sg-weight-semibold);
  font-size: var(--sg-text-xs);
  text-transform: uppercase;
  letter-spacing: var(--sg-tracking-caps);
  color: var(--text-3);
}

.diff-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: var(--sg-space-3);
  padding: var(--sg-space-1-5) 0;
  border-bottom: var(--sg-border-thin) solid var(--sg-color-border);
  align-items: center;
}

.diff-row code {
  font-size: var(--sg-text-xs);
}

.diff-old {
  color: var(--sg-color-danger);
  font-size: var(--sg-text-xs);
  font-family: var(--sg-font-mono);
}

.diff-new {
  color: var(--sg-color-success);
  font-size: var(--sg-text-xs);
  font-family: var(--sg-font-mono);
}

@media (max-width: 768px) {
  .brand-comparison {
    grid-template-columns: 1fr;
  }
}
</style>
