<script lang="ts">
  import {
    generatePalette,
    fromOklch,
    simulateCVD,
    toOklch,
    interpolateColor,
    clamp,
    normalizeHue,
  } from "../../../packages/core/src/index.js";
  import type { OklchColor, CvdType } from "../../../packages/core/src/types.js";
  // Categorical Palette – derived from primary hue
  let catPrimary = $state("#6366f1");
  let catCount = $state(12);

  // Generate categorical colors: 12 equally-spaced hues (30° apart)
  // starting from primary, L=0.55, chroma clamped 0.08–0.15
  let categoricalColors = $derived.by(() => {
    try {
      const primary = toOklch(catPrimary);
      const dataC = clamp(primary.c, 0.08, 0.15);
      const hueStep = 360 / 12;
      const colors: OklchColor[] = [];
      for (let i = 0; i < catCount; i++) {
        const hue = normalizeHue(primary.h + i * hueStep);
        colors.push({ l: 0.55, c: dataC, h: hue, alpha: 1 });
      }
      return colors;
    } catch {
      return [];
    }
  });

  let categoricalHexes = $derived(categoricalColors.map(c => fromOklch(c, "hex")!));

  // Sequential Scale
  let seqStart = $state("#1e3a5f");
  let seqEnd = $state("#93c5fd");
  let seqSteps = $state(7);

  let sequentialColors = $derived.by(() => {
    try {
      const colors: OklchColor[] = [];
      for (let i = 0; i < seqSteps; i++) {
        const t = seqSteps === 1 ? 0.5 : i / (seqSteps - 1);
        colors.push(interpolateColor(seqStart, seqEnd, t));
      }
      return colors;
    } catch { return []; }
  });

  let sequentialHexes = $derived(sequentialColors.map(c => fromOklch(c, "hex")!));

  // Diverging Scale
  let divStart = $state("#dc2626");
  let divEnd = $state("#2563eb");
  let divSteps = $state(9);

  let divergingColors = $derived.by(() => {
    try {
      const start = toOklch(divStart);
      const end = toOklch(divEnd);
      const mid = Math.floor(divSteps / 2);
      const neutral: OklchColor = { l: (start.l + end.l) / 2, c: 0.01, h: 0, alpha: 1 };
      const result: OklchColor[] = [];
      for (let i = 0; i <= mid; i++) {
        const t = mid === 0 ? 0 : i / mid;
        result.push(interpolateColor(start, neutral, t));
      }
      for (let i = 1; i < divSteps - mid; i++) {
        const t = i / (divSteps - mid - 1);
        result.push(interpolateColor(neutral, end, t));
      }
      return result;
    } catch { return []; }
  });

  let divergingHexes = $derived(divergingColors.map(c => fromOklch(c, "hex")!));

  // CVD Comparison
  const cvdTypes: CvdType[] = ["protan", "deutan", "tritan"];

  function simulateHexes(hexes: string[], type: CvdType): string[] {
    return hexes.map(hex => {
      try {
        return fromOklch(simulateCVD(hex, type, 1.0), "hex")!;
      } catch { return hex; }
    });
  }
</script>

<sg-section id="dataviz" title="Data Visualization Palettes" description="Perceptually uniform color scales for charts and maps. Categorical palettes derive from your primary hue with equally-spaced hues at consistent lightness and chroma.">

    <!-- Categorical -->
    <div class="subsection">
      <sg-heading level={3}>Categorical Palette</sg-heading>
      <p style="color: var(--text-3); font-size: var(--sg-text-sm); margin-bottom: var(--sg-space-4)">
        12 equally-spaced hues (30° apart) starting from the primary color, all at L=0.55 with chroma clamped to 0.08–0.15 for perceptual uniformity.
      </p>
      <div class="controls">
        <div class="control-group">
          <span class="card-label">Primary Color</span>
          <sg-color-picker value={catPrimary} oninput={(e) => { const el = e.currentTarget as any; catPrimary = (el.value ?? catPrimary); }} onchange={(e) => { const el = e.currentTarget as any; catPrimary = (el.value ?? catPrimary); }} onclick={(e) => { const el = e.currentTarget as any; catPrimary = (el.value ?? catPrimary); }} ontoggle={(e) => { const el = e.currentTarget as any; catPrimary = (el.value ?? catPrimary); }} mode="popover" input label="Color" />
        </div>
        <div class="control-group" style="min-width: 200px">
          <input class="sg-slider" type="range" min={2} max={12} step={1} value={catCount} oninput={(e) => { const el = e.currentTarget as any; catCount = (el.value ?? catCount); }} onchange={(e) => { const el = e.currentTarget as any; catCount = (el.value ?? catCount); }} onclick={(e) => { const el = e.currentTarget as any; catCount = (el.value ?? catCount); }} ontoggle={(e) => { const el = e.currentTarget as any; catCount = (el.value ?? catCount); }} />
        </div>
      </div>
      <div class="viz-bar-chart">
        {#each categoricalHexes as hex, i}
          <div class="viz-bar" style="background: {hex}; height: {40 + Math.random() * 60}%">
            <span class="viz-bar-label">{hex}</span>
          </div>
        {/each}
      </div>
      <div class="viz-legend">
        {#each categoricalHexes as hex, i}
          <div class="viz-legend-item">
            <div class="viz-legend-swatch" style="background: {hex}"></div>
            <span>Series {i + 1}</span>
          </div>
        {/each}
      </div>
    </div>

    <!-- Sequential -->
    <div class="subsection">
      <sg-heading level={3}>Sequential Scale</sg-heading>
      <div class="controls">
        <div class="control-group">
          <span class="card-label">Start</span>
          <sg-color-picker value={seqStart} oninput={(e) => { const el = e.currentTarget as any; seqStart = (el.value ?? seqStart); }} onchange={(e) => { const el = e.currentTarget as any; seqStart = (el.value ?? seqStart); }} onclick={(e) => { const el = e.currentTarget as any; seqStart = (el.value ?? seqStart); }} ontoggle={(e) => { const el = e.currentTarget as any; seqStart = (el.value ?? seqStart); }} mode="popover" input label="Color" />
        </div>
        <div class="control-group">
          <span class="card-label">End</span>
          <sg-color-picker value={seqEnd} oninput={(e) => { const el = e.currentTarget as any; seqEnd = (el.value ?? seqEnd); }} onchange={(e) => { const el = e.currentTarget as any; seqEnd = (el.value ?? seqEnd); }} onclick={(e) => { const el = e.currentTarget as any; seqEnd = (el.value ?? seqEnd); }} ontoggle={(e) => { const el = e.currentTarget as any; seqEnd = (el.value ?? seqEnd); }} mode="popover" input label="Color" />
        </div>
        <div class="control-group" style="min-width: 120px">
          <input class="sg-slider" type="range" min={3} max={12} step={1} value={seqSteps} oninput={(e) => { const el = e.currentTarget as any; seqSteps = (el.value ?? seqSteps); }} onchange={(e) => { const el = e.currentTarget as any; seqSteps = (el.value ?? seqSteps); }} onclick={(e) => { const el = e.currentTarget as any; seqSteps = (el.value ?? seqSteps); }} ontoggle={(e) => { const el = e.currentTarget as any; seqSteps = (el.value ?? seqSteps); }} />
        </div>
      </div>
      <div class="heatmap-strip">
        {#each sequentialHexes as hex}
          <div class="heatmap-cell" style="background: {hex}"></div>
        {/each}
      </div>
    </div>

    <!-- Diverging -->
    <div class="subsection">
      <sg-heading level={3}>Diverging Scale</sg-heading>
      <div class="controls">
        <div class="control-group">
          <span class="card-label">Start</span>
          <sg-color-picker value={divStart} oninput={(e) => { const el = e.currentTarget as any; divStart = (el.value ?? divStart); }} onchange={(e) => { const el = e.currentTarget as any; divStart = (el.value ?? divStart); }} onclick={(e) => { const el = e.currentTarget as any; divStart = (el.value ?? divStart); }} ontoggle={(e) => { const el = e.currentTarget as any; divStart = (el.value ?? divStart); }} mode="popover" input label="Color" />
        </div>
        <div class="control-group">
          <span class="card-label">End</span>
          <sg-color-picker value={divEnd} oninput={(e) => { const el = e.currentTarget as any; divEnd = (el.value ?? divEnd); }} onchange={(e) => { const el = e.currentTarget as any; divEnd = (el.value ?? divEnd); }} onclick={(e) => { const el = e.currentTarget as any; divEnd = (el.value ?? divEnd); }} ontoggle={(e) => { const el = e.currentTarget as any; divEnd = (el.value ?? divEnd); }} mode="popover" input label="Color" />
        </div>
        <div class="control-group" style="min-width: 120px">
          <input class="sg-slider" type="range" min={5} max={15} step={2} value={divSteps} oninput={(e) => { const el = e.currentTarget as any; divSteps = (el.value ?? divSteps); }} onchange={(e) => { const el = e.currentTarget as any; divSteps = (el.value ?? divSteps); }} onclick={(e) => { const el = e.currentTarget as any; divSteps = (el.value ?? divSteps); }} ontoggle={(e) => { const el = e.currentTarget as any; divSteps = (el.value ?? divSteps); }} />
        </div>
      </div>
      <div class="heatmap-strip">
        {#each divergingHexes as hex}
          <div class="heatmap-cell" style="background: {hex}"></div>
        {/each}
      </div>
    </div>

    <!-- CVD Comparison -->
    <div class="subsection">
      <sg-heading level={3}>CVD Comparison</sg-heading>
      <p style="color: var(--text-3); font-size: var(--sg-text-sm); margin-bottom: var(--sg-space-4)">
        Categorical palette through each CVD simulation type.
      </p>
      <div class="cvd-comparison-grid">
        <div class="cvd-comparison-col">
          <sg-heading level={4}>Normal</sg-heading>
          <div class="cvd-comparison-strip">
            {#each categoricalHexes as hex}
              <div class="cvd-comparison-cell" style="background: {hex}"></div>
            {/each}
          </div>
        </div>
        {#each cvdTypes as type}
          <div class="cvd-comparison-col">
            <sg-heading level={4}>{type === "protan" ? "Protanopia" : type === "deutan" ? "Deuteranopia" : "Tritanopia"}</sg-heading>
            <div class="cvd-comparison-strip">
              {#each simulateHexes(categoricalHexes, type) as hex}
                <div class="cvd-comparison-cell" style="background: {hex}"></div>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    </div>
</sg-section>

<style>
.viz-bar-chart {
  display: flex;
  align-items: flex-end;
  gap: var(--sg-gap-related);
  height: 160px;
  padding: var(--sg-space-4);
  background: var(--surface);
  border: var(--sg-border-thin) solid var(--sg-color-border);
  border-radius: var(--radius-sm);
}

.viz-bar {
  flex: 1;
  border-radius: var(--sg-radius-sm) var(--sg-radius-sm) 0 0;
  min-height: 20px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: var(--sg-space-1);
  transition: opacity var(--sg-duration-normal);
}

.viz-bar:hover {
  opacity: 0.8;
}

.viz-bar-label {
  font-size: var(--sg-text-2xs);
  font-family: var(--sg-font-mono);
  color: var(--sg-color-text-inverse);
  text-shadow: 0 1px 2px oklch(0 0 0 / 0.5);
  writing-mode: vertical-lr;
  transform: rotate(180deg);
}

.viz-legend {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sg-space-3);
  margin-top: var(--sg-space-3);
}

.viz-legend-item {
  display: flex;
  align-items: center;
  gap: var(--sg-space-1-5);
  font-size: var(--sg-text-xs);
  color: var(--text-3);
}

.viz-legend-swatch {
  width: 12px;
  height: 12px;
  border-radius: var(--sg-radius-xs);
}

.heatmap-strip {
  display: flex;
  height: 48px;
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.heatmap-cell {
  flex: 1;
  transition: flex var(--sg-duration-normal);
}

.heatmap-cell:hover {
  flex: 2;
}

.cvd-comparison-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--sg-space-3);
}

.cvd-comparison-col h4 {
  font-size: var(--sg-text-xs);
  font-weight: var(--sg-weight-semibold);
  color: var(--sg-color-text-secondary);
  margin-bottom: var(--sg-space-2);
}

.cvd-comparison-strip {
  display: flex;
  height: 32px;
  border-radius: var(--sg-radius-sm);
  overflow: hidden;
}

.cvd-comparison-cell {
  flex: 1;
}

@media (max-width: 768px) {
  .cvd-comparison-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
