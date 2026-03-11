<script lang="ts">
  import {
    generateTypeScale,
    fluidTypeScale,
    computeLineHeight,
    computeMeasure,
    computeLetterSpacing,
    getFontWeights,
    darkModeAdjustments,
    remToPx,
    deriveFluidMaxRatio,
    assignSemanticRoles,
    computeBodyFromViewingAngle,
    DEVICE_PRESETS,
    computeVerticalRhythm,
    getDyslexiaAdjustments,
    applyDyslexiaLineHeight,
    getFontSizeAdjust,
    FONT_X_HEIGHT_RATIOS,
    needsXHeightNormalization,
  } from "../../../packages/core/src/index.js";
  import type { ViewingConditions } from "../../../packages/core/src/index.js";
  import { round } from "../utils.ts";
  // Type Scale Generator
  let ratio = $state(1.2);
  let baseSize = $state(16);

  let typeScale = $derived(generateTypeScale({ ratio, base: baseSize }));
  const scaleSteps = ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl"] as const;

  // Fluid Typography
  let fluidScale = $derived(fluidTypeScale());

  // Line Height
  let lhFontSize = $state(16);
  let lhResult = $derived(computeLineHeight(lhFontSize / 16));
  let lineHeight = $derived(lhResult.ratio);

  // Measure
  let measureFontSize = $state(16);
  let measureResult = $derived(computeMeasure(measureFontSize / 16));

  // Font Weights
  let fontWeights = getFontWeights();

  // Dark Mode - compute for normal body text (1rem, weight 400)
  let darkAdj = darkModeAdjustments(1, 400);

  // Semantic Roles
  let semanticResult = $derived(assignSemanticRoles(typeScale));

  // Fluid Max Ratio
  let fluidMaxRatio = $derived(deriveFluidMaxRatio(ratio));
  let narrowScale = $derived(generateTypeScale({ ratio: ratio * 0.95, base: 14 }));
  let wideScale = $derived(generateTypeScale({ ratio: fluidMaxRatio, base: baseSize }));

  // Visual Angle / Viewing Distance
  let devicePreset: string = $state("desktop");
  let customDistance = $state(60);
  let customPpi = $state(96);
  let viewingConditions = $derived<ViewingConditions>(
    devicePreset === "custom"
      ? { viewingDistanceCm: customDistance, screenPpi: customPpi }
      : DEVICE_PRESETS[devicePreset]
  );
  let visualAngleResult = $derived(computeBodyFromViewingAngle(viewingConditions));
  const deviceNames = [...Object.keys(DEVICE_PRESETS), "custom"];

  // Vertical Rhythm
  let rhythmResult = $derived(computeVerticalRhythm());
  const proseTokenNames = ["proseGapXs", "proseGapSm", "proseGapBase", "proseGapLg", "proseGapXl", "proseGap2xl"] as const;

  // Dyslexia Mode
  let dyslexiaEnabled = $state(false);
  let dyslexiaAdj = getDyslexiaAdjustments();
  let baseLH = $derived(computeLineHeight(1).ratio);
  let dyslexiaLH = $derived(applyDyslexiaLineHeight(baseLH));

  // X-Height
  let fontEntries = Object.entries(FONT_X_HEIGHT_RATIOS);
</script>

<sg-section id="typography" title="Typography System" description="Modular type scale, fluid sizing, adaptive line height, and optical weight adjustments - all derived from psychophysical research.">

    <!-- Type Scale Generator -->
    <div class="subsection">
      <sg-heading level={3}>Type Scale Generator</sg-heading>
      <div class="controls">
        <div class="control-group" style="min-width: 180px">
          <input class="sg-slider" type="range" min={1.067} max={1.5} step={0.001} value={ratio} oninput={(e) => { const el = e.currentTarget as any; ratio = (el.value ?? ratio); }} onchange={(e) => { const el = e.currentTarget as any; ratio = (el.value ?? ratio); }} onclick={(e) => { const el = e.currentTarget as any; ratio = (el.value ?? ratio); }} ontoggle={(e) => { const el = e.currentTarget as any; ratio = (el.value ?? ratio); }} />
        </div>
        <div class="control-group" style="min-width: 180px">
          <input class="sg-slider" type="range" min={12} max={24} step={1} value={baseSize} oninput={(e) => { const el = e.currentTarget as any; baseSize = (el.value ?? baseSize); }} onchange={(e) => { const el = e.currentTarget as any; baseSize = (el.value ?? baseSize); }} onclick={(e) => { const el = e.currentTarget as any; baseSize = (el.value ?? baseSize); }} ontoggle={(e) => { const el = e.currentTarget as any; baseSize = (el.value ?? baseSize); }} />
        </div>
      </div>
      <div class="type-scale-grid">
        {#each scaleSteps as step}
          {@const rem = typeScale[step]}
          {@const px = remToPx(rem)}
          <div class="type-scale-row">
            <span class="type-scale-label">{step}</span>
            <span class="type-scale-value">{round(rem, 4)}rem / {round(px, 0)}px</span>
            <span class="type-scale-sample" style="font-size: {rem}rem">
              The quick brown fox
            </span>
          </div>
        {/each}
      </div>
    </div>

    <!-- Fluid Typography -->
    <div class="subsection">
      <sg-heading level={3}>Fluid Typography</sg-heading>
      <sg-text color="secondary" style="margin-bottom: var(--sg-space-4)">
        CSS <code>clamp()</code> expressions that scale smoothly between viewport sizes.
      </sg-text>
      <div class="fluid-scale-grid">
        {#each scaleSteps as step}
          {@const clampValue = fluidScale[step]}
          <div class="fluid-scale-row">
            <span class="type-scale-label">{step}</span>
            <code class="fluid-clamp">{clampValue}</code>
          </div>
        {/each}
      </div>
    </div>

    <!-- Line Height -->
    <div class="subsection">
      <sg-heading level={3}>Adaptive Line Height</sg-heading>
      <div class="controls">
        <div class="control-group" style="min-width: 200px">
          <input class="sg-slider" type="range" min={10} max={72} step={1} value={lhFontSize} oninput={(e) => { const el = e.currentTarget as any; lhFontSize = (el.value ?? lhFontSize); }} onchange={(e) => { const el = e.currentTarget as any; lhFontSize = (el.value ?? lhFontSize); }} onclick={(e) => { const el = e.currentTarget as any; lhFontSize = (el.value ?? lhFontSize); }} ontoggle={(e) => { const el = e.currentTarget as any; lhFontSize = (el.value ?? lhFontSize); }} />
        </div>
        <div class="control-group">
          <span class="card-label">Computed Line Height</span>
          <span class="info-value" style="font-size: var(--sg-text-lg); font-weight: var(--sg-weight-semibold)">{round(lineHeight, 3)}</span>
        </div>
      </div>
      <div class="line-height-demo" style="font-size: {lhFontSize}px; line-height: {lineHeight}">
        <p>Typography is the craft of endowing human language with a durable visual form. Good line height ensures comfortable reading by providing adequate vertical space between baselines.</p>
      </div>
    </div>

    <!-- Measure -->
    <div class="subsection">
      <sg-heading level={3}>Optimal Line Length (Measure)</sg-heading>
      <div class="controls">
        <div class="control-group" style="min-width: 200px">
          <input class="sg-slider" type="range" min={10} max={36} step={1} value={measureFontSize} oninput={(e) => { const el = e.currentTarget as any; measureFontSize = (el.value ?? measureFontSize); }} onchange={(e) => { const el = e.currentTarget as any; measureFontSize = (el.value ?? measureFontSize); }} onclick={(e) => { const el = e.currentTarget as any; measureFontSize = (el.value ?? measureFontSize); }} ontoggle={(e) => { const el = e.currentTarget as any; measureFontSize = (el.value ?? measureFontSize); }} />
        </div>
        <div class="control-group">
          <span class="card-label">Optimal Measure</span>
          <span class="info-value" style="font-size: var(--sg-text-lg); font-weight: var(--sg-weight-semibold)">{measureResult.ideal}ch</span>
        </div>
      </div>
      <div class="measure-demo" style="font-size: {measureFontSize}px; max-width: {measureResult.ideal}ch">
        <p>This paragraph is constrained to the computed optimal measure. The ideal line length for body text balances reading speed with comfort, typically 45-75 characters per line.</p>
      </div>
    </div>

    <!-- Font Weights -->
    <div class="subsection">
      <sg-heading level={3}>Font Weight System</sg-heading>
      <div class="weight-chart">
        {#each Object.entries(fontWeights) as [name, value]}
          <div class="weight-row">
            <span class="weight-name">{name}</span>
            <span class="weight-value">{value}</span>
            <span class="weight-sample" style="font-weight: {value}">
              Aa Bb Cc 123
            </span>
          </div>
        {/each}
      </div>
    </div>

    <!-- Dark Mode Adjustments -->
    <div class="subsection">
      <sg-heading level={3}>Dark Mode Adjustments</sg-heading>
      <div class="dark-mode-comparison">
        <div class="dark-mode-panel light-panel">
          <sg-heading level={4}>Light Mode</sg-heading>
          <p style="font-weight: var(--sg-weight-normal); font-size: var(--sg-text-base); letter-spacing: 0">
            Regular weight (400), no tracking adjustment. Standard rendering for light backgrounds.
          </p>
        </div>
        <div class="dark-mode-panel dark-panel">
          <sg-heading level={4}>Dark Mode</sg-heading>
          <p style="font-weight: {darkAdj.adjustedWeight}; letter-spacing: {darkAdj.letterSpacingOffset}; font-size: var(--sg-text-base)">
            Weight {darkAdj.adjustedWeight}, tracking {darkAdj.letterSpacingOffset}. Compensates for halation on dark backgrounds.
          </p>
          <div class="dark-adj-details">
            <span>weight: {darkAdj.adjustedWeight}</span>
            <span>tracking: {darkAdj.letterSpacingOffset}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Semantic Roles -->
    <div class="subsection">
      <sg-heading level={3}>Semantic Roles</sg-heading>
      <sg-text color="secondary" style="margin-bottom: var(--sg-space-4)">
        Maps scale steps to semantic roles (display, h1–h4, body, caption) based on their ratio to the body size. Adjust the ratio slider above to see assignments change.
      </sg-text>
      <div class="token-table">
        <div class="semantic-table-header">
          <span>Role</span>
          <span>Step</span>
          <span>Size</span>
          <span>Ratio</span>
        </div>
        {#each semanticResult.assignments as assignment}
          <div class="semantic-table-row">
            <span class="semantic-role" class:semantic-role-display={assignment.role.startsWith("display")} class:semantic-role-heading={assignment.role.startsWith("h")} class:semantic-role-body={assignment.role.startsWith("body") || assignment.role === "caption"}>
              {assignment.role}
            </span>
            <code class="token-scale">{assignment.scaleStep}</code>
            <span class="token-value">{round(assignment.sizeRem, 3)}rem</span>
            <span class="token-value">{round(assignment.ratioToBody, 2)}×</span>
          </div>
        {/each}
      </div>
      {#if semanticResult.gaps.length > 0}
        <div class="semantic-gaps">
          <span class="card-label">Gaps (no matching scale step):</span>
          <div class="semantic-gap-badges">
            {#each semanticResult.gaps as gap}
              <span class="badge gap-badge">{gap}</span>
            {/each}
          </div>
        </div>
      {/if}
    </div>

    <!-- Fluid Max Ratio -->
    <div class="subsection">
      <sg-heading level={3}>Fluid Max Ratio</sg-heading>
      <sg-text color="secondary" style="margin-bottom: var(--sg-space-4)">
        Derives a wider-viewport ratio from the modular scale ratio using <code>ratio^1.2</code>. Headings grow proportionally larger on wide screens.
      </sg-text>
      <div class="controls">
        <div class="control-group">
          <span class="card-label">Scale Ratio</span>
          <span class="info-value" style="font-size: var(--sg-text-lg); font-weight: var(--sg-weight-semibold)">{round(ratio, 3)}</span>
        </div>
        <div class="control-group">
          <span class="card-label">Fluid Max Ratio</span>
          <span class="info-value" style="font-size: var(--sg-text-lg); font-weight: var(--sg-weight-semibold)">{round(fluidMaxRatio, 4)}</span>
        </div>
        <div class="control-group">
          <span class="card-label">Formula</span>
          <code class="fluid-clamp">{round(ratio, 3)}^1.2 = {round(fluidMaxRatio, 4)}</code>
        </div>
      </div>
      <div class="fluid-comparison">
        <div class="fluid-comparison-col">
          <sg-heading level={4}>Narrow (320px)</sg-heading>
          {#each (["base", "lg", "xl", "2xl", "3xl"] as const) as step}
            <div class="fluid-compare-row">
              <span class="type-scale-label">{step}</span>
              <span class="type-scale-value">{round(narrowScale[step], 3)}rem</span>
              <span class="type-scale-sample" style="font-size: {narrowScale[step]}rem">Aa</span>
            </div>
          {/each}
        </div>
        <div class="fluid-comparison-col">
          <sg-heading level={4}>Wide (1440px)</sg-heading>
          {#each (["base", "lg", "xl", "2xl", "3xl"] as const) as step}
            <div class="fluid-compare-row">
              <span class="type-scale-label">{step}</span>
              <span class="type-scale-value">{round(wideScale[step], 3)}rem</span>
              <span class="type-scale-sample" style="font-size: {wideScale[step]}rem">Aa</span>
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- Visual Angle / Viewing Distance -->
    <div class="subsection">
      <sg-heading level={3}>Visual Angle / Viewing Distance</sg-heading>
      <sg-text color="secondary" style="margin-bottom: var(--sg-space-4)">
        Computes optimal body font size from viewing distance and screen PPI using the minimum comfortable visual angle (K = 0.005 rad).
      </sg-text>
      <div class="controls">
        <div class="control-group">
          <span class="card-label">Device</span>
          <sg-toggle-group type="single" value={devicePreset} oninput={(e) => { const el = e.currentTarget as any; devicePreset = (el.value ?? devicePreset); }} onclick={(e) => { const el = e.currentTarget as any; devicePreset = (el.value ?? devicePreset); }} ontoggle={(e) => { const el = e.currentTarget as any; devicePreset = (el.value ?? devicePreset); }} onchange={(e) => { const v = ((e as CustomEvent<any>).detail ?? (e.currentTarget as any).value); devicePreset = v as string }} size="sm">
            {#each deviceNames as name}
              <button class="sg-toggle" value={name}>{name}</button>
            {/each}
          </sg-toggle-group>
        </div>
      </div>
      {#if devicePreset === "custom"}
        <div class="controls" style="margin-top: var(--sg-space-3)">
          <div class="control-group" style="min-width: 200px">
            <span class="card-label">Distance: {customDistance}cm</span>
            <input class="sg-slider" type="range" min={20} max={400} step={5} value={customDistance} oninput={(e) => { const el = e.currentTarget as any; customDistance = (el.value ?? customDistance); }} onchange={(e) => { const el = e.currentTarget as any; customDistance = (el.value ?? customDistance); }} onclick={(e) => { const el = e.currentTarget as any; customDistance = (el.value ?? customDistance); }} ontoggle={(e) => { const el = e.currentTarget as any; customDistance = (el.value ?? customDistance); }} />
          </div>
          <div class="control-group" style="min-width: 200px">
            <span class="card-label">PPI: {customPpi}</span>
            <input class="sg-slider" type="range" min={40} max={400} step={1} value={customPpi} oninput={(e) => { const el = e.currentTarget as any; customPpi = (el.value ?? customPpi); }} onchange={(e) => { const el = e.currentTarget as any; customPpi = (el.value ?? customPpi); }} onclick={(e) => { const el = e.currentTarget as any; customPpi = (el.value ?? customPpi); }} ontoggle={(e) => { const el = e.currentTarget as any; customPpi = (el.value ?? customPpi); }} />
          </div>
        </div>
      {/if}
      <div class="visual-angle-result">
        <div class="control-group">
          <span class="card-label">Computed Body Size</span>
          <span class="info-value" style="font-size: var(--sg-text-lg); font-weight: var(--sg-weight-semibold)">{round(visualAngleResult.bodySizePx, 1)}px / {round(visualAngleResult.bodySizeRem, 3)}rem</span>
        </div>
        <div class="control-group">
          <span class="card-label">Nearest Scale Step</span>
          <sg-badge color="success">{visualAngleResult.nearestScaleStep}</sg-badge>
        </div>
        {#if devicePreset !== "custom"}
          <div class="control-group">
            <span class="card-label">Distance</span>
            <span class="info-value">{viewingConditions.viewingDistanceCm}cm</span>
          </div>
          <div class="control-group">
            <span class="card-label">PPI</span>
            <span class="info-value">{viewingConditions.screenPpi}</span>
          </div>
        {/if}
      </div>
    </div>

    <!-- Vertical Rhythm -->
    <div class="subsection">
      <sg-heading level={3}>Vertical Rhythm</sg-heading>
      <sg-text color="secondary" style="margin-bottom: var(--sg-space-4)">
        Prose spacing tokens on a 4px grid, plus heading margins for consistent vertical rhythm.
      </sg-text>
      <div class="spacing-bars">
        {#each proseTokenNames as token}
          {@const px = rhythmResult.proseTokens[token]}
          <div class="spacing-bar-row">
            <span class="spacing-bar-label" style="width: 90px; text-align: right">{token.replace("proseGap", "")}</span>
            <div class="spacing-bar" style="width: {Math.max(px, 2)}px"></div>
            <span class="spacing-bar-value">{px}px</span>
          </div>
        {/each}
      </div>
      <div class="heading-spacing-preview" style="margin-top: var(--sg-space-4)">
        <div class="control-group">
          <span class="card-label">Heading Spacing</span>
          <span class="info-value">top: {rhythmResult.headingSpacing.marginTop}px / bottom: {rhythmResult.headingSpacing.marginBottom}px</span>
        </div>
      </div>
    </div>

    <!-- Dyslexia Mode & X-Height -->
    <div class="subsection">
      <sg-heading level={3}>Dyslexia Mode & X-Height</sg-heading>
      <div class="controls">
        <div class="control-group">
          <span class="card-label">Dyslexia Mode</span>
          <sg-toggle-group type="single" value={dyslexiaEnabled ? "on" : "off"} onchange={(e) => { const v = ((e as CustomEvent<any>).detail ?? (e.currentTarget as any).value); dyslexiaEnabled = v === "on" }} size="sm">
            <button class="sg-toggle" value="off">Off</button>
            <button class="sg-toggle" value="on">On</button>
          </sg-toggle-group>
        </div>
        {#if dyslexiaEnabled}
          <div class="control-group">
            <span class="card-label">Adjustments</span>
            <span class="dark-adj-details" style="margin-top: 0">
              <span>letter: {dyslexiaAdj.letterSpacingOffset}</span>
              <span>word: {dyslexiaAdj.wordSpacingOffset}</span>
              <span>LH: {round(baseLH, 2)} → {round(dyslexiaLH, 2)}</span>
            </span>
          </div>
        {/if}
      </div>
      <div class="dark-mode-comparison" style="margin-top: var(--sg-space-4)">
        <div class="dark-mode-panel" style="background: var(--surface)">
          <sg-heading level={4}>Standard</sg-heading>
          <p style="font-size: var(--sg-text-base); line-height: {baseLH}">
            Typography is the craft of endowing human language with a durable visual form. Good spacing ensures comfortable reading for all users.
          </p>
        </div>
        <div class="dark-mode-panel" style="background: var(--surface)">
          <sg-heading level={4}>Dyslexia Mode</sg-heading>
          <p style="font-size: var(--sg-text-base); line-height: {dyslexiaLH}; letter-spacing: var(--sg-tracking-caps); word-spacing: 0.1em">
            Typography is the craft of endowing human language with a durable visual form. Good spacing ensures comfortable reading for all users.
          </p>
        </div>
      </div>

      <sg-heading level={4} style="margin-top: var(--sg-space-6); margin-bottom: var(--sg-space-3); font-size: var(--sg-text-sm)">Font X-Height Ratios</sg-heading>
      <div class="token-table">
        <div class="semantic-table-header">
          <span>Font</span>
          <span>Ratio</span>
          <span>Normalize?</span>
        </div>
        {#each fontEntries as [font, xRatio]}
          <div class="semantic-table-row">
            <span style="font-size: var(--sg-text-sm); color: var(--sg-color-text-secondary)">{font}</span>
            <code class="token-value">{xRatio}</code>
            <span>
              {#if needsXHeightNormalization(font)}
                <sg-badge color="danger">needs adjust</sg-badge>
              {:else}
                <sg-badge color="success">ok</sg-badge>
              {/if}
            </span>
          </div>
        {/each}
      </div>
      <div style="margin-top: var(--sg-space-3)">
        <span class="card-label">font-size-adjust value:</span>
        <code style="margin-left: var(--sg-space-2); color: var(--sg-color-link)">{getFontSizeAdjust()}</code>
      </div>
    </div>
</sg-section>

<style>
.type-scale-grid {
  display: flex;
  flex-direction: column;
  gap: var(--sg-gap-tight);
}

.type-scale-row {
  display: grid;
  grid-template-columns: 60px 150px 1fr;
  align-items: baseline;
  gap: var(--sg-gap-grouped);
  padding: var(--sg-space-2) 0;
  border-bottom: var(--sg-border-thin) solid var(--sg-color-border);
}

.type-scale-label {
  font-size: var(--sg-text-xs);
  font-weight: var(--sg-weight-bold);
  color: var(--text-3);
  font-family: var(--sg-font-mono);
}

.type-scale-value {
  font-size: var(--sg-text-xs);
  color: var(--text-3);
  font-family: var(--sg-font-mono);
}

.type-scale-sample {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.fluid-scale-grid {
  display: flex;
  flex-direction: column;
  gap: var(--sg-gap-tight);
}

.fluid-scale-row {
  display: grid;
  grid-template-columns: 60px 1fr;
  align-items: center;
  gap: var(--sg-gap-grouped);
  padding: var(--sg-space-1-5) 0;
  border-bottom: var(--sg-border-thin) solid var(--sg-color-border);
}

.fluid-clamp {
  font-size: var(--sg-text-xs);
  color: var(--sg-color-text-secondary);
  word-break: break-all;
}

.line-height-demo {
  background: var(--surface);
  border: var(--sg-border-thin) solid var(--sg-color-border);
  border-radius: var(--radius-sm);
  padding: var(--sg-pad-card, 1.5rem);
  color: var(--sg-color-text-secondary);
}

.measure-demo {
  background: var(--surface);
  border: var(--sg-border-thin) solid var(--sg-color-border);
  border-radius: var(--radius-sm);
  padding: var(--sg-pad-card, 1.5rem);
  color: var(--sg-color-text-secondary);
  margin: 0 auto;
}

.weight-chart {
  display: flex;
  flex-direction: column;
  gap: var(--sg-gap-tight);
}

.weight-row {
  display: grid;
  grid-template-columns: 120px 60px 1fr;
  align-items: baseline;
  gap: var(--sg-gap-grouped);
  padding: var(--sg-space-2) 0;
  border-bottom: var(--sg-border-thin) solid var(--sg-color-border);
}

.weight-name {
  font-size: var(--sg-text-sm);
  color: var(--sg-color-text-secondary);
}

.weight-value {
  font-size: var(--sg-text-xs);
  color: var(--text-3);
  font-family: var(--sg-font-mono);
}

.weight-sample {
  font-size: var(--sg-text-lg);
}

.dark-mode-comparison {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--sg-gap-grouped);
}

.dark-mode-panel {
  border-radius: var(--radius-sm);
  padding: var(--sg-pad-card, 1.5rem);
  border: var(--sg-border-thin) solid var(--sg-color-border);
}

.dark-mode-panel h4 {
  margin-bottom: var(--sg-space-3);
  font-size: var(--sg-text-sm);
}

.light-panel {
  background: #f8f8f8;
  color: #1a1a1a;
}

.dark-panel {
  background: var(--surface);
  color: var(--sg-color-text);
}

.dark-adj-details {
  margin-top: var(--sg-space-3);
  display: flex;
  gap: var(--sg-gap-grouped);
  font-size: var(--sg-text-xs);
  color: var(--text-3);
  font-family: var(--sg-font-mono);
}

.semantic-table-header {
  display: grid;
  grid-template-columns: 120px 80px 80px 80px;
  gap: var(--sg-gap-grouped);
  padding: var(--sg-space-2) 0;
  border-bottom: var(--sg-border-medium) solid var(--sg-color-border);
  font-weight: var(--sg-weight-semibold);
  color: var(--text-3);
  font-size: var(--sg-text-xs);
  text-transform: uppercase;
  letter-spacing: var(--sg-tracking-caps);
}

.semantic-table-row {
  display: grid;
  grid-template-columns: 120px 80px 80px 80px;
  gap: var(--sg-gap-grouped);
  padding: var(--sg-space-1-5) 0;
  border-bottom: var(--sg-border-thin) solid var(--sg-color-border);
  align-items: center;
}

.semantic-role {
  font-size: var(--sg-text-xs);
  font-weight: var(--sg-weight-semibold);
  font-family: var(--sg-font-mono);
}

.semantic-role-display { color: var(--sg-color-link); }
.semantic-role-heading { color: var(--sg-color-text); }
.semantic-role-body { color: var(--text-3); }

.semantic-gaps {
  margin-top: var(--sg-space-3);
  display: flex;
  align-items: center;
  gap: var(--sg-space-3);
}

.semantic-gap-badges {
  display: flex;
  gap: var(--sg-gap-related);
  flex-wrap: wrap;
}

.gap-badge {
  background: oklch(from var(--sg-color-link) l c h / 0.1);
  color: var(--text-3);
  font-size: var(--sg-text-xs);
  padding: var(--sg-space-0-5) var(--sg-space-2);
  border-radius: var(--sg-radius-sm);
}

.fluid-comparison {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--sg-gap-grouped);
  margin-top: var(--sg-space-4);
}

.fluid-comparison-col {
  background: var(--surface);
  border: var(--sg-border-thin) solid var(--sg-color-border);
  border-radius: var(--radius-sm);
  padding: var(--sg-space-4);
}

.fluid-comparison-col h4 {
  font-size: var(--sg-text-sm);
  margin-bottom: var(--sg-space-3);
  color: var(--sg-color-text-secondary);
}

.fluid-compare-row {
  display: grid;
  grid-template-columns: 50px 100px 1fr;
  align-items: baseline;
  gap: var(--sg-space-3);
  padding: var(--sg-space-1) 0;
  border-bottom: var(--sg-border-thin) solid var(--sg-color-border);
}

.visual-angle-result {
  display: flex;
  gap: var(--sg-space-6);
  margin-top: var(--sg-space-4);
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .type-scale-row {
    grid-template-columns: 50px 100px 1fr;
    gap: var(--sg-gap-related);
  }

  .dark-mode-comparison {
    grid-template-columns: 1fr;
  }

  .fluid-comparison {
    grid-template-columns: 1fr;
  }

  .semantic-table-header,
  .semantic-table-row {
    grid-template-columns: 100px 60px 70px 60px;
    gap: var(--sg-gap-related);
  }
}
</style>
