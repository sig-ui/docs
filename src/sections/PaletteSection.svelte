<script lang="ts">
  import {
    generatePalette,
    toOklch,
    fromOklch,
    simulateCVD,
    interpolateColor,
    gradientFill,
    clamp,
    normalizeHue,
    deriveBrandBackground,
  } from "../../../packages/core/src/index.js";
  import type { PaletteResult } from "../../../packages/core/src/palette.js";
  import type { ColorFormat, Gamut, OklchColor, CvdType } from "../../../packages/core/src/types.js";
  import { isLightColor, round, copyHex } from "../utils.ts";
  import { getToastContext } from "../toast-context.ts";
  interface Props {
    brandColor: string;
  }

  let { brandColor }: Props = $props();
  const toast = getToastContext();

  // Palette parameters
  let paletteMode: "light" | "dark" = $state("light");
  let gamut: Gamut = $state("p3");
  let hkCompensation = $state(false);
  let huntCompensation = $state(false);
  let hueBlend = $state(0.5);
  let strictWCAG = $state(false);
  let format: ColorFormat = $state("hex");

  function autoBg(mode: "light" | "dark"): string {
    try {
      const oklch = toOklch(brandColor);
      return deriveBrandBackground(oklch.h, oklch.c, mode);
    } catch {
      return mode === "light" ? "#ffffff" : "#111111";
    }
  }

  let paletteBg = $state(autoBg("light"));

  function setMode(mode: "light" | "dark") {
    paletteMode = mode;
    paletteBg = autoBg(mode);
  }

  const shadeStops = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

  let palette = $derived.by(() => {
    try {
      return generatePalette(brandColor, {
        background: paletteBg,
        mode: paletteMode,
        gamut,
        hkCompensation,
        huntCompensation,
        hueBlend,
        strictWCAG,
        format,
      });
    } catch {
      return null;
    }
  });

  let firstOklch = $derived.by(() => {
    try {
      return toOklch(brandColor);
    } catch {
      return null;
    }
  });

  // --- Data Visualization Scales ---

  // Categorical – derived from primary brand hue
  let catCount = $state(12);

  let categoricalColors = $derived.by(() => {
    try {
      const primary = toOklch(brandColor);
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

  // --- Gradient Builder ---

  let gradStart = $state("#6366f1");
  let gradEnd = $state("#ec4899");
  let gradSteps = $state(11);
  let gradSpace: "oklab" | "oklch" = $state("oklab");

  let gradient = $derived.by(() => {
    try {
      const colors = gradientFill(gradStart, gradEnd, gradSteps, { space: gradSpace });
      return colors.map(c => fromOklch(c, "hex")!);
    } catch {
      return [];
    }
  });

  let gradientAlt = $derived.by(() => {
    try {
      const altSpace = gradSpace === "oklab" ? "oklch" : "oklab";
      const colors = gradientFill(gradStart, gradEnd, gradSteps, { space: altSpace as any });
      return colors.map(c => fromOklch(c, "hex")!);
    } catch {
      return [];
    }
  });
</script>

<sg-section id="palette" title="Palette Generator" description="Generate complete shade ramps from your brand colors. Each stop is calibrated to hit specific APCA contrast targets.">

    <div class="controls">
      <div class="control-group">
        <span class="card-label">Brand</span>
        <div class="palette-brand-indicators">
          <div class="palette-brand-dot" style="background: {brandColor}" title="Brand: {brandColor}"></div>
        </div>
      </div>
      <div class="control-group">
        <span class="card-label">Background</span>
        <sg-color-picker value={paletteBg} oninput={(e) => { const el = e.currentTarget as any; paletteBg = (el.value ?? paletteBg); }} onchange={(e) => { const el = e.currentTarget as any; paletteBg = (el.value ?? paletteBg); }} onclick={(e) => { const el = e.currentTarget as any; paletteBg = (el.value ?? paletteBg); }} ontoggle={(e) => { const el = e.currentTarget as any; paletteBg = (el.value ?? paletteBg); }} mode="popover" input label="Color" />
      </div>
      <div class="control-group">
        <span class="card-label">Mode</span>
        <sg-toggle-group type="single" value={paletteMode} oninput={(e) => { const el = e.currentTarget as any; paletteMode = (el.value ?? paletteMode); }} onclick={(e) => { const el = e.currentTarget as any; paletteMode = (el.value ?? paletteMode); }} ontoggle={(e) => { const el = e.currentTarget as any; paletteMode = (el.value ?? paletteMode); }} onchange={(e) => { const v = ((e as CustomEvent<any>).detail ?? (e.currentTarget as any).value); setMode(v as "light" | "dark") }} size="sm">
          <button class="sg-toggle" value="light">Light</button>
          <button class="sg-toggle" value="dark">Dark</button>
        </sg-toggle-group>
      </div>
      <div class="control-group">
        <span class="card-label">Gamut</span>
        <sg-toggle-group type="single" value={gamut} oninput={(e) => { const el = e.currentTarget as any; gamut = (el.value ?? gamut); }} onclick={(e) => { const el = e.currentTarget as any; gamut = (el.value ?? gamut); }} ontoggle={(e) => { const el = e.currentTarget as any; gamut = (el.value ?? gamut); }} onchange={(e) => { const v = ((e as CustomEvent<any>).detail ?? (e.currentTarget as any).value); gamut = v as any }} size="sm">
          <button class="sg-toggle" value="srgb">sRGB</button>
          <button class="sg-toggle" value="p3">P3</button>
        </sg-toggle-group>
      </div>
    </div>

    <div class="controls">
      <div class="control-group">
        <span class="card-label">Format</span>
        <sg-toggle-group type="single" value={format} oninput={(e) => { const el = e.currentTarget as any; format = (el.value ?? format); }} onclick={(e) => { const el = e.currentTarget as any; format = (el.value ?? format); }} ontoggle={(e) => { const el = e.currentTarget as any; format = (el.value ?? format); }} onchange={(e) => { const v = ((e as CustomEvent<any>).detail ?? (e.currentTarget as any).value); format = v as any }} size="sm">
          <button class="sg-toggle" value="hex">Hex</button>
          <button class="sg-toggle" value="oklch">OKLCH</button>
          <button class="sg-toggle" value="rgb">RGB</button>
          <button class="sg-toggle" value="hsl">HSL</button>
        </sg-toggle-group>
      </div>
      <div class="control-group">
        <span class="card-label">Hue Blend</span>
        <input class="sg-slider" type="range" min={0} max={1} step={0.05} value={hueBlend} oninput={(e) => { const el = e.currentTarget as any; hueBlend = (el.value ?? hueBlend); }} onchange={(e) => { const el = e.currentTarget as any; hueBlend = (el.value ?? hueBlend); }} onclick={(e) => { const el = e.currentTarget as any; hueBlend = (el.value ?? hueBlend); }} ontoggle={(e) => { const el = e.currentTarget as any; hueBlend = (el.value ?? hueBlend); }} />
      </div>
      <div class="control-group">
        <span class="card-label">Options</span>
        <div style="display: flex; gap: var(--sg-space-3)">
          <input class="sg-checkbox" type="checkbox" checked={hkCompensation} oninput={(e) => { const el = e.currentTarget as any; hkCompensation = (el.checked ?? hkCompensation); }} onchange={(e) => { const el = e.currentTarget as any; hkCompensation = (el.checked ?? hkCompensation); }} onclick={(e) => { const el = e.currentTarget as any; hkCompensation = (el.checked ?? hkCompensation); }} ontoggle={(e) => { const el = e.currentTarget as any; hkCompensation = (el.checked ?? hkCompensation); }} />
          <input class="sg-checkbox" type="checkbox" checked={huntCompensation} oninput={(e) => { const el = e.currentTarget as any; huntCompensation = (el.checked ?? huntCompensation); }} onchange={(e) => { const el = e.currentTarget as any; huntCompensation = (el.checked ?? huntCompensation); }} onclick={(e) => { const el = e.currentTarget as any; huntCompensation = (el.checked ?? huntCompensation); }} ontoggle={(e) => { const el = e.currentTarget as any; huntCompensation = (el.checked ?? huntCompensation); }} />
          <input class="sg-checkbox" type="checkbox" checked={strictWCAG} oninput={(e) => { const el = e.currentTarget as any; strictWCAG = (el.checked ?? strictWCAG); }} onchange={(e) => { const el = e.currentTarget as any; strictWCAG = (el.checked ?? strictWCAG); }} onclick={(e) => { const el = e.currentTarget as any; strictWCAG = (el.checked ?? strictWCAG); }} ontoggle={(e) => { const el = e.currentTarget as any; strictWCAG = (el.checked ?? strictWCAG); }} />
        </div>
      </div>
    </div>

    {#if palette}
      <div class="palette-ramp-group" style="background: {paletteBg}; border-radius: var(--radius-sm); padding: var(--sg-space-4); margin-bottom: var(--sg-space-4); border: var(--sg-border-thin) solid var(--sg-color-border)">
        <div class="palette-ramp-label" style="color: {paletteMode === 'light' ? '#1a1a2e' : '#fafafa'}; font-size: var(--sg-text-xs); font-weight: var(--sg-weight-semibold); margin-bottom: var(--sg-space-2); display: flex; align-items: center; gap: var(--sg-gap-related)">
          <span class="palette-brand-dot" style="background: {brandColor}; width: var(--sg-space-3); height: var(--sg-space-3); border-radius: var(--sg-radius-full); display: inline-block; border: var(--sg-border-thin) solid oklch(0.5 0 0 / 0.3)"></span>
          Brand
          <span style="font-weight: var(--sg-weight-normal); font-family: var(--sg-font-mono); font-size: var(--sg-text-xs); opacity: 0.7">{brandColor}</span>
        </div>
        <div class="shade-ramp">
          {#each shadeStops as stop}
            {@const val = palette.formatted[stop]}
            {#if val}
              <div
                class="shade-swatch"
                class:light-swatch={isLightColor(val)}
                class:dark-swatch={!isLightColor(val)}
                style="background: {val}"
                onclick={() => copyHex(val, toast.add)}
                title="Click to copy {val}"
              >
                <span class="stop-num">{stop}</span>
                <span class="hex-val">{val.length > 10 ? val.slice(0, 10) + '…' : val}</span>
              </div>
            {/if}
          {/each}
        </div>
      </div>
    {:else}
      <div style="padding: var(--sg-space-4); color: var(--sg-color-danger); font-size: var(--sg-text-sm)">
        Failed to generate palette for {brandColor}
      </div>
    {/if}

    {#if firstOklch}
      <div class="oklch-info" style="margin-top: var(--sg-space-4)">
        <div class="info-item">
          <div class="info-label">Lightness</div>
          <div class="info-value">{round(firstOklch.l, 3)}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Chroma</div>
          <div class="info-value">{round(firstOklch.c, 3)}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Hue</div>
          <div class="info-value">{round(firstOklch.h, 1)}&deg;</div>
        </div>
      </div>
    {/if}

    <!-- Data Visualization Scales -->
    <div class="dataviz-divider"></div>

    <div class="section-header">
      <sg-heading level={3}>Data Visualization Scales</sg-heading>
      <sg-text color="secondary">
        Perceptually uniform color scales for charts and maps. Categorical palettes derive from your primary brand hue with equally-spaced hues at consistent lightness and chroma.
      </sg-text>
    </div>

    <!-- Categorical -->
    <div class="subsection">
      <sg-heading level={4}>Categorical Palette</sg-heading>
      <sg-text size="sm" color="muted">
        12 equally-spaced hues (30° apart) starting from the primary brand color, all at L=0.55 with chroma clamped to 0.08–0.15 for perceptual uniformity.
      </sg-text>
      <div class="controls">
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
      <sg-heading level={4}>Sequential Scale</sg-heading>
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
      <sg-heading level={4}>Diverging Scale</sg-heading>
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
      <sg-heading level={4}>CVD Comparison</sg-heading>
      <sg-text size="sm" color="muted">
        Categorical palette through each CVD simulation type.
      </sg-text>
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

    <!-- Gradient Builder -->
    <div class="dataviz-divider"></div>

    <div class="section-header">
      <sg-heading level={3}>Gradient Builder</sg-heading>
      <sg-text color="secondary">
        Interpolate between colors in OKLab (Cartesian) or OKLCH (polar) space.
        OKLab avoids hue shifts; OKLCH travels through the color wheel.
      </sg-text>
    </div>

    <div class="controls">
      <div class="control-group">
        <span class="card-label">Start</span>
        <sg-color-picker value={gradStart} oninput={(e) => { const el = e.currentTarget as any; gradStart = (el.value ?? gradStart); }} onchange={(e) => { const el = e.currentTarget as any; gradStart = (el.value ?? gradStart); }} onclick={(e) => { const el = e.currentTarget as any; gradStart = (el.value ?? gradStart); }} ontoggle={(e) => { const el = e.currentTarget as any; gradStart = (el.value ?? gradStart); }} mode="popover" input label="Color" />
      </div>
      <div class="control-group">
        <span class="card-label">End</span>
        <sg-color-picker value={gradEnd} oninput={(e) => { const el = e.currentTarget as any; gradEnd = (el.value ?? gradEnd); }} onchange={(e) => { const el = e.currentTarget as any; gradEnd = (el.value ?? gradEnd); }} onclick={(e) => { const el = e.currentTarget as any; gradEnd = (el.value ?? gradEnd); }} ontoggle={(e) => { const el = e.currentTarget as any; gradEnd = (el.value ?? gradEnd); }} mode="popover" input label="Color" />
      </div>
      <div class="control-group" style="min-width: 120px">
        <input class="sg-slider" type="range" min={3} max={24} step={1} value={gradSteps} oninput={(e) => { const el = e.currentTarget as any; gradSteps = (el.value ?? gradSteps); }} onchange={(e) => { const el = e.currentTarget as any; gradSteps = (el.value ?? gradSteps); }} onclick={(e) => { const el = e.currentTarget as any; gradSteps = (el.value ?? gradSteps); }} ontoggle={(e) => { const el = e.currentTarget as any; gradSteps = (el.value ?? gradSteps); }} />
      </div>
      <div class="control-group">
        <span class="card-label">Space</span>
        <sg-toggle-group type="single" value={gradSpace} oninput={(e) => { const el = e.currentTarget as any; gradSpace = (el.value ?? gradSpace); }} onclick={(e) => { const el = e.currentTarget as any; gradSpace = (el.value ?? gradSpace); }} ontoggle={(e) => { const el = e.currentTarget as any; gradSpace = (el.value ?? gradSpace); }} onchange={(e) => { const v = ((e as CustomEvent<any>).detail ?? (e.currentTarget as any).value); gradSpace = v as any }} size="sm">
          <button class="sg-toggle" value="oklab">OKLab</button>
          <button class="sg-toggle" value="oklch">OKLCH</button>
        </sg-toggle-group>
      </div>
    </div>

    <div class="card-label" style="margin-bottom: var(--sg-space-1)">{gradSpace === "oklab" ? "OKLab" : "OKLCH"} interpolation</div>
    <div class="gradient-strip">
      {#each gradient as color}
        <div class="gradient-stop" style="background: {color}" onclick={() => copyHex(color, toast.add)} title={color}></div>
      {/each}
    </div>
    <div class="gradient-labels">
      {#each gradient as color}
        <span class="gradient-label">{color}</span>
      {/each}
    </div>

    <div style="margin-top: var(--sg-space-6)">
      <div class="card-label" style="margin-bottom: var(--sg-space-1)">{gradSpace === "oklab" ? "OKLCH" : "OKLab"} interpolation (comparison)</div>
      <div class="gradient-strip">
        {#each gradientAlt as color}
          <div class="gradient-stop" style="background: {color}" onclick={() => copyHex(color, toast.add)} title={color}></div>
        {/each}
      </div>
      <div class="gradient-labels">
        {#each gradientAlt as color}
          <span class="gradient-label">{color}</span>
        {/each}
      </div>
    </div>
</sg-section>

<style>
  .dataviz-divider {
    margin: var(--sg-space-10) 0 var(--sg-space-6);
    border-top: var(--sg-border-thin) solid var(--border, oklch(0.5 0 0 / 0.2));
  }

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
