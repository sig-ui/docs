<script lang="ts">
  import {
    generateSpacingScale,
    SEMANTIC_SPACING_TOKENS,
    getMinTouchTarget,
    computeFittsTime,
    meetsWCAGTouchTarget,
    computeHitAreaExpansion,
    TOUCH_TARGET_SIZES,
    getDensityMultiplier,
    CONTEXT_SCALE_FACTORS,
    composeSpacingScales,
    DENSITY_EXEMPT_COMPONENTS,
    getBreakpoints,
    BREAKPOINT_VALUES,
    getBreakpointQuery,
    getGridConfig,
    getAllRelationshipSpacings,
    fluidSpacingScale,
    computeContentSpacing,
    computeComponentHeight,
    VERTICAL_PADDING_PRESETS,
    opticalSpacingMultiplier,
    opticalSpacingFluid,
    generateFontSpacingSubsets,
    generateTypeScale,
    computeLineHeight,
  } from "../../../packages/core/src/index.js";
  import type { TypeScaleStep, FontSpacingSubset } from "../../../packages/core/src/index.js";
  import { round } from "../utils.ts";
  // Spacing Scale
  let baseUnit = $state(4);
  let spacingScale = $derived(generateSpacingScale({ baseUnit }));
  let scaleEntries = $derived([...spacingScale.entries()]);

  // Touch Targets
  let pointerType: "touch" | "pointer" = $state("touch");
  let touchTarget = $derived(getMinTouchTarget(pointerType));
  let meetsWcag = $derived(meetsWCAGTouchTarget(touchTarget, pointerType));
  let hitAreaVisualSize = $state(32);
  let hitAreaExpansion = $derived(computeHitAreaExpansion(hitAreaVisualSize, "touch"));

  // Fitts's Law
  let fittsDistance = $state(200);
  let fittsWidth = $state(48);
  let fittsTime = $derived(computeFittsTime(fittsDistance, fittsWidth));

  // Density
  const densityModes = ["compact", "comfortable", "spacious"] as const;
  let densityMultipliers = $derived(
    Object.fromEntries(densityModes.map(d => [d, getDensityMultiplier(d)])) as Record<string, number>
  );

  // Fluid Spacing
  let fluidScale = $derived(fluidSpacingScale({ baseUnit }));
  let fluidEntries = $derived([...fluidScale.entries()].filter(([name]) => !["0", "px"].includes(name)));

  // Breakpoints
  let breakpoints = getBreakpoints();

  // Grid
  type GridBP = "sm" | "md" | "lg" | "xl" | "2xl";
  let gridBp: GridBP = $state("lg");
  let gridConfig = $derived(getGridConfig(gridBp));

  // Relationship spacing
  let relationships = getAllRelationshipSpacings();

  // Content Spacing
  let csFontSize = $state(16);
  let csLineHeight = $state(1.55);
  let contentSpacing = $derived(computeContentSpacing(csFontSize, csLineHeight));

  // Component Height
  let chDensity: string = $state("comfortable");
  let chLineHeightPx = $derived(csFontSize * csLineHeight);
  let chPadding = $derived(VERTICAL_PADDING_PRESETS[chDensity] ?? 8);
  let chResult = $derived(computeComponentHeight({ bodyLineHeightPx: chLineHeightPx, verticalPadding: chPadding }));

  // Optical Spacing
  let osViewport = $state(768);
  let osMultiplier = $derived(opticalSpacingMultiplier(osViewport));
  let osFluid = opticalSpacingFluid();

  // Font Spacing Subsets – derived from actual type scale
  const FONT_SPACING_STEPS: TypeScaleStep[] = ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl"];
  const fsTypeScale = generateTypeScale({ ratio: 1.2 });
  const fsFontEntries: ReadonlyArray<readonly [TypeScaleStep, number, number]> = FONT_SPACING_STEPS.map(step => {
    const fontSizePx = fsTypeScale[step] * 16;
    const lh = parseFloat(computeLineHeight(fsTypeScale[step]).computed);
    return [step, fontSizePx, lh] as const;
  });
  let fsBaseUnit = $state(4);
  let fontSpacingMap = $derived(generateFontSpacingSubsets(fsFontEntries, { baseUnit: fsBaseUnit }));
  let fontSpacingList = $derived(FONT_SPACING_STEPS.map(step => fontSpacingMap.get(step)!));
  let fsHighlight: TypeScaleStep | null = $state(null);
</script>

<sg-section id="spacing" title="Spacing & Layout System" description="A hybrid linear/geometric spacing scale, touch targets calibrated for Fitts's Law, density modes, responsive grids, and relationship-based proximity.">

    <!-- Spacing Scale -->
    <div class="subsection">
      <sg-heading level={3}>Spacing Scale</sg-heading>
      <div class="controls">
        <div class="control-group" style="min-width: 200px">
          <input class="sg-slider" type="range" min={2} max={8} step={1} value={baseUnit} oninput={(e) => { const el = e.currentTarget as any; baseUnit = (el.value ?? baseUnit); }} onchange={(e) => { const el = e.currentTarget as any; baseUnit = (el.value ?? baseUnit); }} onclick={(e) => { const el = e.currentTarget as any; baseUnit = (el.value ?? baseUnit); }} ontoggle={(e) => { const el = e.currentTarget as any; baseUnit = (el.value ?? baseUnit); }} />
        </div>
      </div>
      <div class="spacing-bars">
        {#each scaleEntries as [name, entry]}
          {#if entry.px > 0 && entry.px <= 96}
            <div class="spacing-bar-row">
              <span class="spacing-bar-label">{name}</span>
              <div class="spacing-bar" style="width: {Math.max(entry.px, 2)}px"></div>
              <span class="spacing-bar-value">{entry.px}px / {entry.rem}</span>
            </div>
          {/if}
        {/each}
      </div>
    </div>

    <!-- Semantic Tokens -->
    <div class="subsection">
      <sg-heading level={3}>Semantic Spacing Tokens</sg-heading>
      <div class="token-table">
        <div class="token-table-header">
          <span>Token</span>
          <span>Scale Key</span>
          <span>Value</span>
        </div>
        {#each Object.entries(SEMANTIC_SPACING_TOKENS) as [token, scaleKey]}
          {@const entry = spacingScale.get(scaleKey)}
          <div class="token-table-row">
            <code class="token-name">{token}</code>
            <span class="token-scale">{scaleKey}</span>
            <span class="token-value">{entry?.px ?? '?'}px</span>
          </div>
        {/each}
      </div>
    </div>

    <!-- Touch Targets -->
    <div class="subsection">
      <sg-heading level={3}>Touch Targets</sg-heading>
      <div class="controls">
        <div class="control-group">
          <span class="card-label">Pointer Type</span>
          <sg-toggle-group type="single" value={pointerType} oninput={(e) => { const el = e.currentTarget as any; pointerType = (el.value ?? pointerType); }} onclick={(e) => { const el = e.currentTarget as any; pointerType = (el.value ?? pointerType); }} ontoggle={(e) => { const el = e.currentTarget as any; pointerType = (el.value ?? pointerType); }} onchange={(e) => { const v = ((e as CustomEvent<any>).detail ?? (e.currentTarget as any).value); pointerType = v as "touch" | "pointer" }}>
            <button class="sg-toggle" value="touch">touch</button>
            <button class="sg-toggle" value="pointer">pointer</button>
          </sg-toggle-group>
        </div>
      </div>
      <div class="touch-target-demo">
        <div class="touch-target-box" style="width: {touchTarget}px; height: {touchTarget}px">
          {touchTarget}px
        </div>
        <div class="touch-target-info">
          <sg-badge color={meetsWcag ? "success" : "danger"}>
            WCAG {meetsWcag ? "Pass" : "Fail"}
          </sg-badge>
          <span class="info-value">Min: {touchTarget}px for {pointerType}</span>
        </div>
      </div>

      <div class="hit-area-expansion">
        <sg-heading level={4}>Hit Area Expansion</sg-heading>
        <sg-text color="secondary" size="sm">
          When a visual element is smaller than the WCAG minimum ({TOUCH_TARGET_SIZES.WCAG_MIN}px),
          a pseudo-element expands the touch target to meet the requirement.
        </sg-text>
        <div class="controls" style="margin-top: var(--sg-space-3)">
          <div class="control-group" style="min-width: 200px">
            <input class="sg-slider" type="range" min={16} max={48} step={2} value={hitAreaVisualSize} oninput={(e) => { const el = e.currentTarget as any; hitAreaVisualSize = (el.value ?? hitAreaVisualSize); }} onchange={(e) => { const el = e.currentTarget as any; hitAreaVisualSize = (el.value ?? hitAreaVisualSize); }} onclick={(e) => { const el = e.currentTarget as any; hitAreaVisualSize = (el.value ?? hitAreaVisualSize); }} ontoggle={(e) => { const el = e.currentTarget as any; hitAreaVisualSize = (el.value ?? hitAreaVisualSize); }} />
          </div>
        </div>
        <div class="hit-area-demo">
          <div class="hit-area-outer" style="width: {hitAreaVisualSize + 2 * hitAreaExpansion}px; height: {hitAreaVisualSize + 2 * hitAreaExpansion}px">
            <div class="hit-area-inner" style="width: {hitAreaVisualSize}px; height: {hitAreaVisualSize}px">
              {hitAreaVisualSize}px
            </div>
          </div>
          <div class="touch-target-info">
            <span class="info-value">Visual: {hitAreaVisualSize}px</span>
            <span class="info-value">Expansion: +{hitAreaExpansion}px per side</span>
            <span class="info-value">Hit area: {hitAreaVisualSize + 2 * hitAreaExpansion}px</span>
            {#if hitAreaExpansion > 0}
              <sg-badge color="danger">needs expansion</sg-badge>
            {:else}
              <sg-badge color="success">no expansion needed</sg-badge>
            {/if}
          </div>
        </div>
      </div>
    </div>

    <!-- Fitts's Law -->
    <div class="subsection">
      <sg-heading level={3}>Fitts's Law Calculator</sg-heading>
      <div class="controls">
        <div class="control-group" style="min-width: 200px">
          <input class="sg-slider" type="range" min={10} max={800} step={10} value={fittsDistance} oninput={(e) => { const el = e.currentTarget as any; fittsDistance = (el.value ?? fittsDistance); }} onchange={(e) => { const el = e.currentTarget as any; fittsDistance = (el.value ?? fittsDistance); }} onclick={(e) => { const el = e.currentTarget as any; fittsDistance = (el.value ?? fittsDistance); }} ontoggle={(e) => { const el = e.currentTarget as any; fittsDistance = (el.value ?? fittsDistance); }} />
        </div>
        <div class="control-group" style="min-width: 200px">
          <input class="sg-slider" type="range" min={8} max={120} step={4} value={fittsWidth} oninput={(e) => { const el = e.currentTarget as any; fittsWidth = (el.value ?? fittsWidth); }} onchange={(e) => { const el = e.currentTarget as any; fittsWidth = (el.value ?? fittsWidth); }} onclick={(e) => { const el = e.currentTarget as any; fittsWidth = (el.value ?? fittsWidth); }} ontoggle={(e) => { const el = e.currentTarget as any; fittsWidth = (el.value ?? fittsWidth); }} />
        </div>
        <div class="control-group">
          <span class="card-label">Predicted Time</span>
          <span class="info-value" style="font-size: var(--sg-text-lg); font-weight: var(--sg-weight-semibold)">{round(fittsTime, 0)}ms</span>
        </div>
      </div>
      <div class="fitts-visual">
        <div class="fitts-start"></div>
        <div class="fitts-distance" style="width: {Math.min(fittsDistance, 600)}px"></div>
        <div class="fitts-target" style="width: {fittsWidth}px; height: {fittsWidth}px"></div>
      </div>
    </div>

    <!-- Density Modes -->
    <div class="subsection">
      <sg-heading level={3}>Density Modes</sg-heading>
      <div class="density-grid">
        {#each densityModes as mode}
          {@const mult = densityMultipliers[mode]}
          <div class="density-card">
            <sg-heading level={4}>{mode}</sg-heading>
            <span class="density-mult">{mult}x</span>
            <div class="density-form" style="gap: {12 * (mult ?? 1)}px; padding: {16 * (mult ?? 1)}px">
              <div class="density-input" style="height: {36 * (mult ?? 1)}px; padding: 0 {12 * (mult ?? 1)}px">Label</div>
              <div class="density-input" style="height: {36 * (mult ?? 1)}px; padding: 0 {12 * (mult ?? 1)}px">Value</div>
              <div class="density-btn" style="height: {36 * (mult ?? 1)}px; padding: 0 {16 * (mult ?? 1)}px">Submit</div>
            </div>
          </div>
        {/each}
      </div>

      <div class="context-scale-section">
        <sg-heading level={4}>Context Scale Factors</sg-heading>
        <sg-text color="secondary" size="sm" style="margin-bottom: var(--sg-space-3)">
          Spacing tokens scale multiplicatively with typographic context. Smaller text contexts compress spacing; larger contexts expand it.
        </sg-text>
        <div class="context-scale-grid">
          {#each Object.entries(CONTEXT_SCALE_FACTORS) as [size, factor]}
            <div class="context-scale-card">
              <span class="context-scale-label">{size}</span>
              <span class="context-scale-value">{factor}x</span>
              <div class="context-scale-bar" style="width: {factor * 60}px"></div>
              <span class="context-scale-example">{Math.round(16 * factor)}px gap</span>
            </div>
          {/each}
        </div>
      </div>

      <div class="density-exempt-section">
        <sg-heading level={4}>Density-Exempt Components</sg-heading>
        <sg-text color="secondary" size="sm" style="margin-bottom: var(--sg-space-3)">
          These components always render at comfortable density to preserve readability and accessibility.
        </sg-text>
        <div class="exempt-list">
          {#each DENSITY_EXEMPT_COMPONENTS as comp}
            <sg-badge color="secondary">{comp}</sg-badge>
          {/each}
        </div>
      </div>
    </div>

    <!-- Fluid Spacing -->
    <div class="subsection">
      <sg-heading level={3}>Fluid Spacing</sg-heading>
      <sg-text color="secondary" style="margin-bottom: var(--sg-space-4)">
        CSS clamp() expressions for continuous spacing scaling between viewports. Min values use compact density (0.75x), max values use spacious density (1.25x).
      </sg-text>
      <div class="fluid-spacing-table">
        <div class="fluid-spacing-header">
          <span>Token</span>
          <span>clamp() Expression</span>
        </div>
        {#each fluidEntries as [name, clampExpr]}
          <div class="fluid-spacing-row">
            <code class="token-name">space-{name}</code>
            <code class="fluid-clamp">{clampExpr}</code>
          </div>
        {/each}
      </div>
    </div>

    <!-- Breakpoints -->
    <div class="subsection">
      <sg-heading level={3}>Breakpoints</sg-heading>
      <div class="breakpoint-ruler">
        {#each Object.entries(BREAKPOINT_VALUES) as [name, value]}
          <div class="breakpoint-mark" style="left: {(value / 1536) * 100}%">
            <span class="breakpoint-label">{name}</span>
            <span class="breakpoint-value">{value}px</span>
          </div>
        {/each}
      </div>
      <div class="breakpoint-queries">
        {#each Object.keys(BREAKPOINT_VALUES) as name}
          <div class="breakpoint-query-row">
            <span class="breakpoint-query-name">{name}</span>
            <code class="breakpoint-query-code">{getBreakpointQuery(name as any)}</code>
          </div>
        {/each}
      </div>
    </div>

    <!-- Grid -->
    <div class="subsection">
      <sg-heading level={3}>Layout Grid</sg-heading>
      <div class="controls">
        <div class="control-group">
          <span class="card-label">Breakpoint</span>
          <sg-toggle-group type="single" value={gridBp} oninput={(e) => { const el = e.currentTarget as any; gridBp = (el.value ?? gridBp); }} onclick={(e) => { const el = e.currentTarget as any; gridBp = (el.value ?? gridBp); }} ontoggle={(e) => { const el = e.currentTarget as any; gridBp = (el.value ?? gridBp); }} onchange={(e) => { const v = ((e as CustomEvent<any>).detail ?? (e.currentTarget as any).value); gridBp = v as GridBP }}>
            <button class="sg-toggle" value="sm">sm</button>
            <button class="sg-toggle" value="md">md</button>
            <button class="sg-toggle" value="lg">lg</button>
            <button class="sg-toggle" value="xl">xl</button>
            <button class="sg-toggle" value="2xl">2xl</button>
          </sg-toggle-group>
        </div>
      </div>
      <div class="grid-info">
        <span>Columns: {gridConfig.columns}</span>
        <span>Gutter: {gridConfig.gutter}</span>
        <span>Margin: {gridConfig.margin}</span>
      </div>
      <div class="grid-demo" style="gap: 8px; padding: 0 12px">
        {#each Array(gridConfig.columns) as _, i}
          <div class="grid-col"></div>
        {/each}
      </div>
    </div>

    <!-- Relationship Spacing -->
    <div class="subsection">
      <sg-heading level={3}>Relationship Spacing</sg-heading>
      <sg-text color="secondary" style="margin-bottom: var(--sg-space-4)">
        Context-aware spacing using the Gestalt Law of Proximity. Stronger logical connections use tighter spacing.
      </sg-text>
      <div class="relationship-grid">
        {#each relationships as rel}
          <div class="relationship-card">
            <sg-heading level={4}>{rel.relationship}</sg-heading>
            <span class="relationship-range">{rel.min}px – {rel.max}px</span>
            <span class="relationship-tokens">tokens: {rel.tokens.join(", ")}</span>
            <div class="relationship-visual" style="gap: {rel.min}px">
              <div class="relationship-block"></div>
              <div class="relationship-block"></div>
            </div>
            <sg-text size="xs" color="secondary" style="margin-top: var(--sg-space-2)">{rel.description}</sg-text>
            <div class="relationship-examples">
              {#each rel.examples.slice(0, 2) as ex}
                <span class="relationship-example">{ex}</span>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Content Spacing -->
    <div class="subsection">
      <sg-heading level={3}>Content Spacing</sg-heading>
      <sg-text color="secondary" style="margin-bottom: var(--sg-space-4)">
        Derives paragraph and heading spacing from body line-height, snapped to a 4px grid.
      </sg-text>
      <div class="controls">
        <div class="control-group" style="min-width: 200px">
          <input class="sg-slider" type="range" min={12} max={24} step={1} value={csFontSize} oninput={(e) => { const el = e.currentTarget as any; csFontSize = (el.value ?? csFontSize); }} onchange={(e) => { const el = e.currentTarget as any; csFontSize = (el.value ?? csFontSize); }} onclick={(e) => { const el = e.currentTarget as any; csFontSize = (el.value ?? csFontSize); }} ontoggle={(e) => { const el = e.currentTarget as any; csFontSize = (el.value ?? csFontSize); }} />
        </div>
        <div class="control-group" style="min-width: 200px">
          <input class="sg-slider" type="range" min={1.2} max={2.0} step={0.05} value={csLineHeight} oninput={(e) => { const el = e.currentTarget as any; csLineHeight = (el.value ?? csLineHeight); }} onchange={(e) => { const el = e.currentTarget as any; csLineHeight = (el.value ?? csLineHeight); }} onclick={(e) => { const el = e.currentTarget as any; csLineHeight = (el.value ?? csLineHeight); }} ontoggle={(e) => { const el = e.currentTarget as any; csLineHeight = (el.value ?? csLineHeight); }} />
        </div>
      </div>
      <div class="content-spacing-blocks">
        <div class="content-spacing-item">
          <span class="card-label">Paragraph Spacing</span>
          <div class="content-spacing-visual">
            <div class="content-spacing-text-block"></div>
            <div class="content-spacing-gap" style="height: {contentSpacing.paragraphSpacing}px"></div>
            <div class="content-spacing-text-block"></div>
          </div>
          <span class="info-value">{contentSpacing.paragraphSpacing}px</span>
        </div>
        <div class="content-spacing-item">
          <span class="card-label">Heading Top</span>
          <div class="content-spacing-visual">
            <div class="content-spacing-text-block"></div>
            <div class="content-spacing-gap" style="height: {contentSpacing.headingTopMargin}px"></div>
            <div class="content-spacing-heading-block"></div>
          </div>
          <span class="info-value">{contentSpacing.headingTopMargin}px</span>
        </div>
        <div class="content-spacing-item">
          <span class="card-label">Heading Bottom</span>
          <div class="content-spacing-visual">
            <div class="content-spacing-heading-block"></div>
            <div class="content-spacing-gap" style="height: {contentSpacing.headingBottomMargin}px"></div>
            <div class="content-spacing-text-block"></div>
          </div>
          <span class="info-value">{contentSpacing.headingBottomMargin}px</span>
        </div>
      </div>
    </div>

    <!-- Font Spacing Subsets -->
    <div class="subsection">
      <sg-heading level={3}>Font Spacing Subsets</sg-heading>
      <sg-text color="secondary" style="margin-bottom: var(--sg-space-4)">
        Per-step spacing records replace scalar context multipliers. Each property scales at its own rate,
        every value snaps to the grid, and minHeight enforces WCAG touch targets.
      </sg-text>
      <div class="controls">
        <div class="control-group" style="min-width: 200px">
          <input class="sg-slider" type="range" min={2} max={8} step={2} value={fsBaseUnit} oninput={(e) => { const el = e.currentTarget as any; fsBaseUnit = (el.value ?? fsBaseUnit); }} onchange={(e) => { const el = e.currentTarget as any; fsBaseUnit = (el.value ?? fsBaseUnit); }} onclick={(e) => { const el = e.currentTarget as any; fsBaseUnit = (el.value ?? fsBaseUnit); }} ontoggle={(e) => { const el = e.currentTarget as any; fsBaseUnit = (el.value ?? fsBaseUnit); }} />
        </div>
      </div>
      <div class="font-spacing-table">
        <div class="font-spacing-header">
          <span>Step</span>
          <span>Font</span>
          <span>gap</span>
          <span>padX</span>
          <span>padY</span>
          <span>gapStack</span>
          <span>minHeight</span>
        </div>
        {#each fontSpacingList as subset}
          <div
            class="font-spacing-row"
            class:fs-row-active={fsHighlight === subset.step}
            onmouseenter={() => fsHighlight = subset.step}
            onmouseleave={() => fsHighlight = null}
          >
            <span class="fs-step">{subset.step}</span>
            <span class="fs-font">{subset.fontSizePx}px</span>
            <span class="fs-val"><span class="fs-bar" style="width: {subset.gap}px"></span>{subset.gap}</span>
            <span class="fs-val"><span class="fs-bar" style="width: {subset.padX}px"></span>{subset.padX}</span>
            <span class="fs-val"><span class="fs-bar" style="width: {subset.padY}px"></span>{subset.padY}</span>
            <span class="fs-val"><span class="fs-bar" style="width: {subset.gapStack}px"></span>{subset.gapStack}</span>
            <span class="fs-val"><span class="fs-bar fs-bar-min" style="width: {Math.min(subset.minHeight / 2, 80)}px"></span>{subset.minHeight}</span>
          </div>
        {/each}
      </div>

      {#if fsHighlight}
        {@const hl = fontSpacingMap.get(fsHighlight)!}
        <div class="fs-preview">
          <div class="fs-preview-button" style="
            font-size: {hl.fontSizePx}px;
            padding: {hl.padY}px {hl.padX}px;
            gap: {hl.gap}px;
            min-height: {hl.minHeight}px;
          ">
            <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            Button at {fsHighlight}
          </div>
          <span class="fs-preview-label">
            pad: {hl.padY}×{hl.padX} · gap: {hl.gap} · min-h: {hl.minHeight}px
          </span>
        </div>
      {/if}
    </div>

    <!-- Component Height -->
    <div class="subsection">
      <sg-heading level={3}>Component Height</sg-heading>
      <sg-text color="secondary" style="margin-bottom: var(--sg-space-4)">
        Derives standard component heights from line-height + padding, clamped to WCAG touch target minimums.
      </sg-text>
      <div class="controls">
        <div class="control-group">
          <span class="card-label">Density</span>
          <sg-toggle-group type="single" value={chDensity} oninput={(e) => { const el = e.currentTarget as any; chDensity = (el.value ?? chDensity); }} onclick={(e) => { const el = e.currentTarget as any; chDensity = (el.value ?? chDensity); }} ontoggle={(e) => { const el = e.currentTarget as any; chDensity = (el.value ?? chDensity); }} onchange={(e) => { const v = ((e as CustomEvent<any>).detail ?? (e.currentTarget as any).value); chDensity = v }}>
            {#each Object.keys(VERTICAL_PADDING_PRESETS) as mode}
              <button class="sg-toggle" value={mode}>{mode}</button>
            {/each}
          </sg-toggle-group>
        </div>
      </div>
      <div class="component-height-demo">
        <div class="component-height-visual" style="height: {chResult.height}px">
          <span>{chResult.height}px</span>
        </div>
        <div class="component-height-info">
          <span class="dark-adj-details" style="margin-top: 0">
            <span>lineHeight: {round(chLineHeightPx, 1)}px</span>
            <span>padding: {chPadding}px × 2</span>
            <span>raw: {round(chLineHeightPx + 2 * chPadding, 1)}px</span>
          </span>
          {#if chResult.clampedByTouch}
            <sg-badge color="danger">clamped to 44px touch target</sg-badge>
          {:else}
            <sg-badge color="success">exceeds touch target</sg-badge>
          {/if}
        </div>
      </div>
    </div>

    <!-- Optical Spacing -->
    <div class="subsection">
      <sg-heading level={3}>Optical Spacing</sg-heading>
      <sg-text color="secondary" style="margin-bottom: var(--sg-space-4)">
        Viewport-dependent multiplier that increases spacing on narrow screens (1.2x) and normalizes to 1.0x on wide screens.
      </sg-text>
      <div class="controls">
        <div class="control-group" style="min-width: 250px">
          <input class="sg-slider" type="range" min={320} max={1920} step={10} value={osViewport} oninput={(e) => { const el = e.currentTarget as any; osViewport = (el.value ?? osViewport); }} onchange={(e) => { const el = e.currentTarget as any; osViewport = (el.value ?? osViewport); }} onclick={(e) => { const el = e.currentTarget as any; osViewport = (el.value ?? osViewport); }} ontoggle={(e) => { const el = e.currentTarget as any; osViewport = (el.value ?? osViewport); }} />
        </div>
        <div class="control-group">
          <span class="card-label">Multiplier</span>
          <span class="info-value" style="font-size: var(--sg-text-lg); font-weight: var(--sg-weight-semibold)">{round(osMultiplier, 3)}×</span>
        </div>
      </div>
      <div class="optical-bar-container">
        <div class="optical-bar" style="width: {(osMultiplier / 1.2) * 100}%">
          <span>{round(osMultiplier, 3)}×</span>
        </div>
      </div>
      <div style="margin-top: var(--sg-space-3)">
        <span class="card-label">CSS Expression:</span>
        <code class="fluid-clamp" style="margin-left: var(--sg-space-2)">{osFluid}</code>
      </div>
    </div>
</sg-section>

<style>
.spacing-bars {
  display: flex;
  flex-direction: column;
  gap: var(--sg-space-1);
}

.spacing-bar-row {
  display: grid;
  grid-template-columns: 40px 1fr 150px;
  align-items: center;
  gap: var(--sg-space-3);
  padding: 3px 0;
}

.spacing-bar-label {
  font-size: var(--sg-text-xs);
  color: var(--text-3);
  font-family: var(--sg-font-mono);
  text-align: right;
}

.spacing-bar {
  height: 8px;
  background: var(--sg-color-link);
  border-radius: var(--sg-radius-sm);
  min-width: 2px;
}

.spacing-bar-value {
  font-size: var(--sg-text-xs);
  color: var(--text-3);
  font-family: var(--sg-font-mono);
}

.token-table {
  font-size: var(--sg-text-sm);
}

.token-table-header {
  display: grid;
  grid-template-columns: 1fr 80px 80px;
  gap: var(--sg-space-4);
  padding: 8px 0;
  border-bottom: var(--sg-border-medium) solid var(--sg-color-border);
  font-weight: var(--sg-weight-semibold);
  color: var(--text-3);
  font-size: var(--sg-text-xs);
  text-transform: uppercase;
  letter-spacing: var(--sg-tracking-caps);
}

.token-table-row {
  display: grid;
  grid-template-columns: 1fr 80px 80px;
  gap: var(--sg-space-4);
  padding: 6px 0;
  border-bottom: var(--sg-border-thin) solid var(--sg-color-border);
  align-items: center;
}

.token-name {
  font-size: var(--sg-text-xs);
  color: var(--sg-color-link);
}

.token-scale, .token-value {
  font-size: var(--sg-text-xs);
  color: var(--text-3);
  font-family: var(--sg-font-mono);
}

.touch-target-demo {
  display: flex;
  align-items: center;
  gap: var(--sg-space-6);
}

.touch-target-box {
  background: oklch(from var(--sg-color-link) l c h / 0.15);
  border: var(--sg-border-medium) solid var(--sg-color-link);
  border-radius: var(--radius-xs);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--sg-text-xs);
  font-family: var(--sg-font-mono);
  color: var(--sg-color-link);
}

.touch-target-info {
  display: flex;
  flex-direction: column;
  gap: var(--sg-space-2);
}

.fitts-visual {
  display: flex;
  align-items: center;
  gap: 0;
  margin-top: var(--sg-space-4);
}

.fitts-start {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--text-3);
}

.fitts-distance {
  height: 2px;
  background: var(--border-hover);
}

.fitts-target {
  border-radius: var(--radius-xs);
  background: oklch(from var(--sg-color-link) l c h / 0.3);
  border: var(--sg-border-medium) solid var(--sg-color-link);
}

.density-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--sg-space-4);
}

.density-card {
  background: var(--surface);
  border: var(--sg-border-thin) solid var(--sg-color-border);
  border-radius: var(--radius-sm);
  padding: var(--sg-space-4);
}

.density-card h4 {
  font-size: var(--sg-text-sm);
  margin-bottom: var(--sg-space-1);
  text-transform: capitalize;
}

.density-mult {
  font-size: var(--sg-text-xs);
  color: var(--text-3);
  font-family: var(--sg-font-mono);
}

.density-form {
  display: flex;
  flex-direction: column;
  margin-top: var(--sg-space-3);
}

.density-input {
  background: var(--sg-surface-container-high);
  border: var(--sg-border-thin) solid var(--sg-color-border);
  border-radius: var(--sg-radius-sm);
  display: flex;
  align-items: center;
  font-size: var(--sg-text-xs);
  color: var(--text-3);
}

.density-btn {
  background: var(--sg-color-primary);
  border-radius: var(--sg-radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--sg-text-xs);
  color: white;
  font-weight: var(--sg-weight-semibold);
}

.breakpoint-ruler {
  position: relative;
  height: 60px;
  background: var(--surface);
  border: var(--sg-border-thin) solid var(--sg-color-border);
  border-radius: var(--radius-sm);
  margin-top: var(--sg-space-2);
}

.breakpoint-mark {
  position: absolute;
  top: 0;
  bottom: 0;
  border-left: 2px dashed oklch(from var(--sg-color-link) l c h / 0.4);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 6px;
}

.breakpoint-label {
  font-size: var(--sg-text-xs);
  font-weight: var(--sg-weight-bold);
  color: var(--sg-color-link);
}

.breakpoint-value {
  font-size: var(--sg-text-2xs);
  color: var(--text-3);
  font-family: var(--sg-font-mono);
}

.grid-info {
  display: flex;
  gap: var(--sg-space-6);
  margin-bottom: var(--sg-space-3);
  font-size: var(--sg-text-sm);
  color: var(--sg-color-text-secondary);
}

.grid-demo {
  display: flex;
  background: var(--surface);
  border: var(--sg-border-thin) solid var(--sg-color-border);
  border-radius: var(--radius-sm);
  padding: var(--sg-space-3);
  height: 60px;
}

.grid-col {
  flex: 1;
  background: oklch(from var(--sg-color-link) l c h / 0.12);
  border: var(--sg-border-thin) solid oklch(from var(--sg-color-link) l c h / 0.25);
  border-radius: var(--sg-radius-sm);
}

.relationship-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--sg-space-3);
}

.relationship-card {
  background: var(--surface);
  border: var(--sg-border-thin) solid var(--sg-color-border);
  border-radius: var(--radius-sm);
  padding: var(--sg-space-4);
}

.relationship-card h4 {
  font-size: var(--sg-text-sm);
  text-transform: capitalize;
  margin-bottom: var(--sg-space-1);
}

.relationship-range {
  font-size: var(--sg-text-xs);
  color: var(--text-3);
  font-family: var(--sg-font-mono);
}

.relationship-visual {
  display: flex;
  flex-direction: column;
  margin-top: var(--sg-space-3);
}

.relationship-block {
  height: 20px;
  background: oklch(from var(--sg-color-link) l c h / 0.15);
  border: var(--sg-border-thin) solid oklch(from var(--sg-color-link) l c h / 0.3);
  border-radius: var(--sg-radius-sm);
}

.content-spacing-blocks {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--sg-space-4);
  margin-top: var(--sg-space-4);
}

.content-spacing-item {
  background: var(--surface);
  border: var(--sg-border-thin) solid var(--sg-color-border);
  border-radius: var(--radius-sm);
  padding: var(--sg-space-4);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sg-space-3);
}

.content-spacing-visual {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
}

.content-spacing-text-block {
  height: 16px;
  background: oklch(from var(--sg-color-link) l c h / 0.15);
  border: var(--sg-border-thin) solid oklch(from var(--sg-color-link) l c h / 0.3);
  border-radius: var(--sg-radius-sm);
}

.content-spacing-heading-block {
  height: 10px;
  background: oklch(from var(--sg-color-link) l c h / 0.3);
  border: var(--sg-border-thin) solid oklch(from var(--sg-color-link) l c h / 0.5);
  border-radius: var(--sg-radius-sm);
}

.content-spacing-gap {
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 3px,
    oklch(from var(--sg-color-link) l c h / 0.1) 3px,
    oklch(from var(--sg-color-link) l c h / 0.1) 4px
  );
  min-height: 4px;
}

.component-height-demo {
  display: flex;
  align-items: center;
  gap: var(--sg-space-6);
  margin-top: var(--sg-space-4);
}

.component-height-visual {
  background: oklch(from var(--sg-color-link) l c h / 0.15);
  border: var(--sg-border-medium) solid var(--sg-color-link);
  border-radius: var(--radius-xs);
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
  font-size: var(--sg-text-sm);
  font-family: var(--sg-font-mono);
  color: var(--sg-color-link);
  transition: height 0.2s ease;
}

.component-height-info {
  display: flex;
  flex-direction: column;
}

.optical-bar-container {
  background: var(--surface);
  border: var(--sg-border-thin) solid var(--sg-color-border);
  border-radius: var(--radius-sm);
  padding: var(--sg-space-2);
  margin-top: var(--sg-space-4);
}

.optical-bar {
  height: 28px;
  background: oklch(from var(--sg-color-link) l c h / 0.2);
  border: var(--sg-border-thin) solid oklch(from var(--sg-color-link) l c h / 0.4);
  border-radius: var(--sg-radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--sg-text-xs);
  font-family: var(--sg-font-mono);
  color: var(--sg-color-link);
  transition: width 0.15s ease;
  min-width: 60px;
}

.font-spacing-table {
  font-size: var(--sg-text-sm);
  border: var(--sg-border-thin) solid var(--sg-color-border);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.font-spacing-header {
  display: grid;
  grid-template-columns: 60px 60px repeat(5, 1fr);
  gap: var(--sg-space-2);
  padding: 8px 12px;
  background: var(--sg-surface-container-high);
  border-bottom: var(--sg-border-medium) solid var(--sg-color-border);
  font-weight: var(--sg-weight-semibold);
  color: var(--text-3);
  font-size: var(--sg-text-xs);
  text-transform: uppercase;
  letter-spacing: var(--sg-tracking-caps);
}

.font-spacing-row {
  display: grid;
  grid-template-columns: 60px 60px repeat(5, 1fr);
  gap: var(--sg-space-2);
  padding: 6px 12px;
  border-bottom: var(--sg-border-thin) solid var(--sg-color-border);
  align-items: center;
  transition: background 0.1s ease;
  cursor: default;
}

.font-spacing-row:last-child {
  border-bottom: none;
}

.font-spacing-row:hover,
.fs-row-active {
  background: oklch(from var(--sg-color-link) l c h / 0.06);
}

.fs-step {
  font-family: var(--sg-font-mono);
  font-size: var(--sg-text-xs);
  font-weight: var(--sg-weight-semibold);
  color: var(--sg-color-link);
}

.fs-font {
  font-family: var(--sg-font-mono);
  font-size: var(--sg-text-xs);
  color: var(--text-3);
}

.fs-val {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--sg-font-mono);
  font-size: var(--sg-text-xs);
  color: var(--sg-color-text-secondary);
}

.fs-bar {
  height: 6px;
  background: oklch(from var(--sg-color-link) l c h / 0.25);
  border-radius: var(--sg-radius-sm);
  min-width: 2px;
  flex-shrink: 0;
}

.fs-bar-min {
  background: oklch(from var(--sg-color-link) l c h / 0.15);
  border: var(--sg-border-thin) solid oklch(from var(--sg-color-link) l c h / 0.3);
}

.fs-preview {
  margin-top: var(--sg-space-4);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--sg-space-2);
}

.fs-preview-button {
  display: inline-flex;
  align-items: center;
  background: oklch(from var(--sg-color-link) l c h / 0.12);
  border: var(--sg-border-medium) solid var(--sg-color-link);
  border-radius: var(--sg-radius-md);
  color: var(--sg-color-link);
  font-weight: var(--sg-weight-semibold);
  line-height: 1;
  box-sizing: border-box;
}

.fs-preview-label {
  font-size: var(--sg-text-xs);
  color: var(--text-3);
  font-family: var(--sg-font-mono);
}

.hit-area-expansion {
  margin-top: var(--sg-space-6);
}

.hit-area-demo {
  display: flex;
  align-items: center;
  gap: var(--sg-space-6);
  margin-top: var(--sg-space-3);
}

.hit-area-outer {
  background: oklch(from var(--sg-color-link) l c h / 0.08);
  border: 1px dashed oklch(from var(--sg-color-link) l c h / 0.3);
  border-radius: var(--radius-xs);
  display: flex;
  align-items: center;
  justify-content: center;
}

.hit-area-inner {
  background: oklch(from var(--sg-color-link) l c h / 0.2);
  border: var(--sg-border-medium) solid var(--sg-color-link);
  border-radius: var(--radius-xs);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--sg-text-xs);
  font-family: var(--sg-font-mono);
  color: var(--sg-color-link);
}

.context-scale-section {
  margin-top: var(--sg-space-6);
}

.context-scale-grid {
  display: flex;
  gap: var(--sg-space-3);
  flex-wrap: wrap;
}

.context-scale-card {
  background: var(--surface);
  border: var(--sg-border-thin) solid var(--sg-color-border);
  border-radius: var(--radius-sm);
  padding: var(--sg-space-3);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sg-space-1);
  min-width: 80px;
}

.context-scale-label {
  font-size: var(--sg-text-xs);
  font-weight: var(--sg-weight-semibold);
  color: var(--sg-color-link);
  font-family: var(--sg-font-mono);
}

.context-scale-value {
  font-size: var(--sg-text-xs);
  color: var(--text-3);
  font-family: var(--sg-font-mono);
}

.context-scale-bar {
  height: 6px;
  background: oklch(from var(--sg-color-link) l c h / 0.25);
  border-radius: var(--sg-radius-sm);
  min-width: 2px;
}

.context-scale-example {
  font-size: var(--sg-text-2xs);
  color: var(--text-3);
  font-family: var(--sg-font-mono);
}

.density-exempt-section {
  margin-top: var(--sg-space-6);
}

.exempt-list {
  display: flex;
  gap: var(--sg-space-2);
  flex-wrap: wrap;
}

.fluid-spacing-table {
  font-size: var(--sg-text-sm);
  border: var(--sg-border-thin) solid var(--sg-color-border);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.fluid-spacing-header {
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: var(--sg-space-4);
  padding: 8px 12px;
  background: var(--sg-surface-container-high);
  border-bottom: var(--sg-border-medium) solid var(--sg-color-border);
  font-weight: var(--sg-weight-semibold);
  color: var(--text-3);
  font-size: var(--sg-text-xs);
  text-transform: uppercase;
  letter-spacing: var(--sg-tracking-caps);
}

.fluid-spacing-row {
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: var(--sg-space-4);
  padding: 6px 12px;
  border-bottom: var(--sg-border-thin) solid var(--sg-color-border);
  align-items: center;
}

.fluid-spacing-row:last-child {
  border-bottom: none;
}

.fluid-clamp {
  font-size: var(--sg-text-xs);
  color: var(--sg-color-text-secondary);
  font-family: var(--sg-font-mono);
  word-break: break-all;
}

.breakpoint-queries {
  margin-top: var(--sg-space-3);
  display: flex;
  flex-direction: column;
  gap: var(--sg-space-1);
}

.breakpoint-query-row {
  display: grid;
  grid-template-columns: 40px 1fr;
  gap: var(--sg-space-3);
  align-items: center;
  padding: 4px 0;
}

.breakpoint-query-name {
  font-size: var(--sg-text-xs);
  font-weight: var(--sg-weight-semibold);
  color: var(--sg-color-link);
  font-family: var(--sg-font-mono);
}

.breakpoint-query-code {
  font-size: var(--sg-text-xs);
  color: var(--sg-color-text-secondary);
  font-family: var(--sg-font-mono);
}

.relationship-tokens {
  font-size: var(--sg-text-xs);
  color: var(--text-3);
  font-family: var(--sg-font-mono);
  display: block;
  margin-bottom: var(--sg-space-1);
}

.relationship-examples {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: var(--sg-space-1);
}

.relationship-example {
  font-size: var(--sg-text-2xs);
  color: var(--text-3);
}

@media (max-width: 768px) {
  .density-grid,
  .relationship-grid {
    grid-template-columns: 1fr;
  }

  .content-spacing-blocks {
    grid-template-columns: 1fr;
  }

  .font-spacing-header,
  .font-spacing-row {
    grid-template-columns: 50px 50px repeat(5, 1fr);
    gap: var(--sg-space-1);
    padding: 6px 8px;
  }

  .fluid-spacing-header,
  .fluid-spacing-row {
    grid-template-columns: 80px 1fr;
    gap: var(--sg-space-2);
    padding: 6px 8px;
  }
}
</style>
