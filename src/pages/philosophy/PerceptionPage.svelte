<script lang="ts">
  import { generatePalette, toOklch, deriveBrandBackground } from "../../../../packages/core/src/index.js";
  import { hkOffset } from "../../../../packages/core/src/generation/hk.js";
  import { isLightColor, copyHex } from "../../utils.ts";
  import { getToastContext } from "../../toast-context.ts";
  const toast = getToastContext();

  let brandHex = $state("#6366f1");
  const shadeStops = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

  function autoBg(mode: "light" | "dark"): string {
    try {
      const oklch = toOklch(brandHex);
      return deriveBrandBackground(oklch.h, oklch.c, mode);
    } catch {
      return mode === "light" ? "#ffffff" : "#111111";
    }
  }

  let lightPalette = $derived.by(() => {
    try {
      return generatePalette(brandHex, { background: autoBg("light"), mode: "light" });
    } catch {
      return null;
    }
  });

  let darkPalette = $derived.by(() => {
    try {
      return generatePalette(brandHex, { background: autoBg("dark"), mode: "dark" });
    } catch {
      return null;
    }
  });

  // HSL lie demo
  let demoHue = $state(240);

  // Approximate perceived brightness of fully saturated HSL hue at 50% L
  function perceivedBrightness(h: number): number {
    const pts: [number, number][] = [
      [0, 54], [30, 62], [60, 93], [90, 81], [120, 72], [150, 68],
      [180, 64], [210, 45], [240, 28], [270, 37], [300, 48], [330, 50], [360, 54],
    ];
    for (let i = 0; i < pts.length - 1; i++) {
      if (h >= pts[i][0] && h <= pts[i + 1][0]) {
        const t = (h - pts[i][0]) / (pts[i + 1][0] - pts[i][0]);
        return Math.round(pts[i][1] + t * (pts[i + 1][1] - pts[i][1]));
      }
    }
    return 50;
  }

  let perceived = $derived(perceivedBrightness(demoHue));

  // --- Perceptual compensation demos ---

  // Abney: desaturate a blue-purple while holding hue constant
  const abneyHue = 280;
  const abneyL = 0.55;
  const abneySteps = [0.20, 0.16, 0.12, 0.08, 0.04, 0.01];

  // H-K: compare chromatic vs achromatic at same L
  let hkDemoHue = $state(265);
  let hkDemoChroma = $state(0.18);
  const hkDemoL = 0.60;
  let hkCompensated = $derived(hkDemoL - hkOffset(hkDemoChroma, hkDemoHue));
  let hkOffsetValue = $derived(hkOffset(hkDemoChroma, hkDemoHue));

  // Bezold-Brücke: lightness ramp at constant hue
  const bbHue = 240;
  const bbChroma = 0.15;
  const bbLSteps = [0.30, 0.40, 0.50, 0.60, 0.70, 0.80, 0.90];
</script>

<div class="page">
  <div class="page-header">
    <sg-heading level={1}>Perception</sg-heading>
    <sg-text size="lg" color="secondary">Human vision shapes every decision. Drag the slider. Pick a color. See for yourself.</sg-text>
  </div>

  <!-- HSL lie -->
  <div class="subsection">
    <sg-heading level={3} size="lg">The HSL lightness lie</sg-heading>
    <sg-text size="lg" color="secondary" style="margin-bottom: var(--sg-space-5)">
      HSL says all these colors have 50% lightness. Your eyes disagree. Drag the hue.
    </sg-text>

    <div class="controls">
      <div class="control-group">
        <input type="range" class="sg-slider" min={0} max={360} step={1} value={demoHue} oninput={(e) => { const el = e.currentTarget as any; demoHue = (el.value ?? demoHue); }} onchange={(e) => { const el = e.currentTarget as any; demoHue = (el.value ?? demoHue); }} onclick={(e) => { const el = e.currentTarget as any; demoHue = (el.value ?? demoHue); }} ontoggle={(e) => { const el = e.currentTarget as any; demoHue = (el.value ?? demoHue); }} />
      </div>
    </div>

    <div class="phil-hsl-row">
      <div class="card" style="flex: 1">
        <span class="card-label" style="color: var(--sg-color-danger)">HSL (lies)</span>
        <div class="phil-big-swatch" style="background: hsl({demoHue}, 100%, 50%)"></div>
        <code style="font-size: var(--sg-text-xs)">hsl({demoHue}, 100%, 50%)</code>
        <div class="phil-bar-track">
          <div class="phil-bar-fill" style="width: {perceived}%; background: hsl({demoHue}, 100%, 50%)"></div>
        </div>
        <span class="phil-bar-label">Perceived brightness: <strong>{perceived}%</strong></span>
      </div>
      <div class="card" style="flex: 1">
        <span class="card-label" style="color: var(--sg-color-success)">OKLCH (honest)</span>
        <div class="phil-big-swatch" style="background: oklch(0.50 0.15 {demoHue})"></div>
        <code style="font-size: var(--sg-text-xs)">oklch(0.50, 0.15, {demoHue})</code>
        <div class="phil-bar-track">
          <div class="phil-bar-fill phil-bar-fill--ok" style="width: 50%; background: oklch(0.50 0.15 {demoHue})"></div>
        </div>
        <span class="phil-bar-label">Perceived brightness: <strong>50%</strong> (always)</span>
      </div>
    </div>
  </div>

  <!-- Live palette -->
  <div class="subsection">
    <sg-heading level={3} size="lg">Live palette derivation</sg-heading>
    <sg-text size="lg" color="secondary" style="margin-bottom: var(--sg-space-5)">
      Pick a brand color. Light and dark palettes derived simultaneously &mdash; every shade hits APCA contrast targets against its background.
    </sg-text>

    <div class="controls">
      <div class="control-group">
        <span class="card-label">Brand</span>
        <sg-color-picker value={brandHex} oninput={(e) => { const el = e.currentTarget as any; brandHex = (el.value ?? brandHex); }} onchange={(e) => { const el = e.currentTarget as any; brandHex = (el.value ?? brandHex); }} onclick={(e) => { const el = e.currentTarget as any; brandHex = (el.value ?? brandHex); }} ontoggle={(e) => { const el = e.currentTarget as any; brandHex = (el.value ?? brandHex); }} mode="popover" input label="Color" />
      </div>
    </div>

    <div class="palette-dual">
      {#if lightPalette}
        <div class="palette-ramp-group" style="background: {autoBg('light')}; border-radius: var(--sg-radius-sm); padding: var(--sg-space-4); border: var(--sg-border-thin) solid var(--sg-color-border)">
          <div style="color: #1a1a2e; font-size: var(--sg-text-xs); font-weight: var(--sg-weight-semibold); margin-bottom: var(--sg-space-2); display: flex; align-items: center; gap: var(--sg-gap-related)">
            <span style="background: {brandHex}; width: var(--sg-space-3); height: var(--sg-space-3); border-radius: var(--sg-radius-full); display: inline-block; border: var(--sg-border-thin) solid oklch(0.5 0 0 / 0.3)"></span>
            Light
            <span style="font-weight: var(--sg-weight-normal); font-family: var(--sg-font-mono); font-size: var(--sg-text-xs); opacity: 0.7">{brandHex}</span>
          </div>
          <div class="shade-ramp">
            {#each shadeStops as stop}
              {@const val = lightPalette.formatted[stop]}
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
                  <span class="hex-val">{val}</span>
                </div>
              {/if}
            {/each}
          </div>
        </div>
      {/if}
      {#if darkPalette}
        <div class="palette-ramp-group" style="background: {autoBg('dark')}; border-radius: var(--sg-radius-sm); padding: var(--sg-space-4); border: var(--sg-border-thin) solid var(--sg-color-border)">
          <div style="color: #fafafa; font-size: var(--sg-text-xs); font-weight: var(--sg-weight-semibold); margin-bottom: var(--sg-space-2); display: flex; align-items: center; gap: var(--sg-gap-related)">
            <span style="background: {brandHex}; width: var(--sg-space-3); height: var(--sg-space-3); border-radius: var(--sg-radius-full); display: inline-block; border: var(--sg-border-thin) solid oklch(0.5 0 0 / 0.3)"></span>
            Dark
            <span style="font-weight: var(--sg-weight-normal); font-family: var(--sg-font-mono); font-size: var(--sg-text-xs); opacity: 0.7">{brandHex}</span>
          </div>
          <div class="shade-ramp">
            {#each shadeStops as stop}
              {@const val = darkPalette.formatted[stop]}
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
                  <span class="hex-val">{val}</span>
                </div>
              {/if}
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>

  <!-- Dark mode computation -->
  <div class="subsection">
    <sg-heading level={3} size="lg">Computational dark mode</sg-heading>
    <sg-text size="lg" color="secondary" style="margin-bottom: var(--sg-space-5)">
      Not a second hand-picked palette. A transformation compensating for three perceptual effects.
    </sg-text>

    <div class="phil-effects-grid">
      <div class="card">
        <span class="card-label">Hunt effect</span>
        <p style="font-size: var(--sg-text-sm); color: var(--sg-color-text-muted, var(--sg-color-text-secondary)); margin-bottom: var(--sg-space-3)">Colors look washed out on dark backgrounds. Chroma gets a 5-15% boost.</p>
        <div class="phil-effect-bars">
          <div class="phil-bar-row"><span>Light</span><div class="phil-bar-sm" style="background: oklch(0.55 0.15 264); width: 50%"></div></div>
          <div class="phil-bar-row"><span>Dark (+chroma)</span><div class="phil-bar-sm" style="background: oklch(0.55 0.20 264); width: 68%"></div></div>
        </div>
      </div>
      <div class="card">
        <span class="card-label">Stevens effect</span>
        <p style="font-size: var(--sg-text-sm); color: var(--sg-color-text-muted, var(--sg-color-text-secondary)); margin-bottom: var(--sg-space-3)">Perceived contrast shifts with adaptation level. Subtle shades get +2-3 Lc.</p>
        <div class="phil-effect-bars">
          <div class="phil-bar-row"><span>Light Lc</span><div class="phil-bar-sm" style="background: oklch(0.85 0.03 264); width: 48%"></div></div>
          <div class="phil-bar-row"><span>Dark Lc</span><div class="phil-bar-sm" style="background: oklch(0.88 0.03 264); width: 56%"></div></div>
        </div>
      </div>
      <div class="card">
        <span class="card-label">Hue blending</span>
        <p style="font-size: var(--sg-text-sm); color: var(--sg-color-text-muted, var(--sg-color-text-secondary)); margin-bottom: var(--sg-space-3)">Hues shift toward background temperature for palette cohesion.</p>
        <div style="display: flex; align-items: center; gap: var(--sg-space-3); justify-content: center; padding: var(--sg-space-2) 0">
          <div style="width: var(--sg-space-8); height: var(--sg-space-8); border-radius: var(--sg-radius-full); background: oklch(0.6 0.2 264)"></div>
          <span style="color: var(--sg-color-text-secondary)">&rarr;</span>
          <div style="width: var(--sg-space-8); height: var(--sg-space-8); border-radius: var(--sg-radius-full); background: oklch(0.6 0.19 260)"></div>
          <code style="font-size: var(--sg-text-xs); color: var(--sg-color-text-muted, var(--sg-color-text-secondary))">&minus;4&deg;</code>
        </div>
      </div>
    </div>
  </div>

  <!-- Perceptual compensation table -->
  <div class="subsection">
    <sg-heading level={3} size="lg">What OKLCH corrects – and what it doesn't</sg-heading>
    <sg-text size="lg" color="secondary" style="margin-bottom: var(--sg-space-5)">
      OKLCH solves the big problems. Three residual phenomena still matter for design systems.
      Here's what SigUI compensates for and how.
    </sg-text>

    <!-- H-K effect (first – the one SigUI actively compensates) -->
    <div class="phenom-card">
      <div class="phenom-header">
        <sg-heading level={4} size="lg">Helmholtz-Kohlrausch effect</sg-heading>
        <span class="phenom-tag phenom-tag--compensated">Compensated by SigUI</span>
      </div>
      <p class="phenom-subtitle">Saturated colors appear brighter than their measured lightness</p>

      <div class="phenom-columns">
        <div class="phenom-col">
          <span class="phenom-col-label">Impact on OKLCH</span>
          <p class="phenom-text">
            OKLCH does not account for this. A saturated red at L=0.5 will appear perceptually
            lighter than a gray at L=0.5.
          </p>
        </div>
        <div class="phenom-col">
          <span class="phenom-col-label">Mitigation in SigUI</span>
          <p class="phenom-text">
            Optional H-K lightness compensation is applied during shade generation using the
            Fairchild-Pirrotta 1991 model with HGN 2023 revision.
          </p>
        </div>
      </div>

      <div class="phenom-demo">
        <div class="controls" style="margin-bottom: var(--sg-space-4)">
          <div class="control-group">
            <input type="range" class="sg-slider" min={0} max={360} step={1} value={hkDemoHue} oninput={(e) => { const el = e.currentTarget as any; hkDemoHue = (el.value ?? hkDemoHue); }} onchange={(e) => { const el = e.currentTarget as any; hkDemoHue = (el.value ?? hkDemoHue); }} onclick={(e) => { const el = e.currentTarget as any; hkDemoHue = (el.value ?? hkDemoHue); }} ontoggle={(e) => { const el = e.currentTarget as any; hkDemoHue = (el.value ?? hkDemoHue); }} />
          </div>
          <div class="control-group">
            <input type="range" class="sg-slider" min={0.04} max={0.30} step={0.01} value={hkDemoChroma} oninput={(e) => { const el = e.currentTarget as any; hkDemoChroma = (el.value ?? hkDemoChroma); }} onchange={(e) => { const el = e.currentTarget as any; hkDemoChroma = (el.value ?? hkDemoChroma); }} onclick={(e) => { const el = e.currentTarget as any; hkDemoChroma = (el.value ?? hkDemoChroma); }} ontoggle={(e) => { const el = e.currentTarget as any; hkDemoChroma = (el.value ?? hkDemoChroma); }} />
          </div>
        </div>

        <div class="hk-compare">
          <div class="hk-col hk-col--ref">
            <span class="phenom-demo-label">Achromatic (L={hkDemoL.toFixed(2)})</span>
            <div class="hk-swatch hk-swatch--ref" style="background: oklch({hkDemoL} 0 0)"></div>
            <code class="phenom-swatch-code">oklch({hkDemoL.toFixed(2)} 0 0)</code>
          </div>
          <div class="hk-col">
            <span class="phenom-demo-label" style="color: var(--sg-color-danger)">Chromatic &ndash; same L (looks brighter)</span>
            <div class="hk-swatch" style="background: oklch({hkDemoL} {hkDemoChroma} {hkDemoHue})"></div>
            <code class="phenom-swatch-code">oklch({hkDemoL.toFixed(2)} {hkDemoChroma.toFixed(2)} {hkDemoHue})</code>
          </div>
          <div class="hk-col">
            <span class="phenom-demo-label" style="color: var(--sg-color-success)">H-K compensated (L&minus;{(hkOffsetValue).toFixed(4)})</span>
            <div class="hk-swatch" style="background: oklch({hkCompensated.toFixed(4)} {hkDemoChroma} {hkDemoHue})"></div>
            <code class="phenom-swatch-code">oklch({hkCompensated.toFixed(4)} {hkDemoChroma.toFixed(2)} {hkDemoHue})</code>
          </div>
        </div>

        <p class="phenom-demo-note">
          The chromatic swatch (top right) appears perceptually lighter than the gray despite identical
          OKLCH L values. SigUI reduces L by the H-K offset so chromatic shades match perceived
          lightness. Drag the sliders &ndash; blue (~265&deg;) and red (~25&deg;) show the strongest effect.
        </p>
      </div>
    </div>

    <!-- Abney effect -->
    <div class="phenom-card">
      <div class="phenom-header">
        <sg-heading level={4} size="lg">Abney effect</sg-heading>
        <span class="phenom-tag phenom-tag--corrected">Largely corrected by OKLCH</span>
      </div>
      <p class="phenom-subtitle">Hue shifts during desaturation</p>

      <div class="phenom-columns">
        <div class="phenom-col">
          <span class="phenom-col-label">Impact on OKLCH</span>
          <p class="phenom-text">
            OKLCH largely corrects for this. Residual drift of 1&ndash;3&deg; occurs in the blue-purple
            region (H&nbsp;~260&ndash;300).
          </p>
        </div>
        <div class="phenom-col">
          <span class="phenom-col-label">Mitigation in SigUI</span>
          <p class="phenom-text">
            Hue is held constant during gamut clamping. For blue-purple palettes, a compensatory hue
            offset of 2&ndash;5&deg; may be applied as an escape hatch if visual QA reveals drift.
          </p>
        </div>
      </div>

      <div class="phenom-demo">
        <span class="phenom-demo-label">Desaturation at H&nbsp;=&nbsp;{abneyHue}&deg; – hue stays constant</span>
        <div class="phenom-swatch-row">
          {#each abneySteps as c}
            <div class="phenom-swatch-cell">
              <div
                class="phenom-swatch"
                style="background: oklch({abneyL} {c} {abneyHue})"
              ></div>
              <code class="phenom-swatch-code">C={c.toFixed(2)}</code>
              <code class="phenom-swatch-code phenom-swatch-code--dim">H={abneyHue}&deg;</code>
            </div>
          {/each}
        </div>
        <p class="phenom-demo-note">
          In OKLCH, reducing chroma preserves hue angle. The blue-purple region (shown above) has the
          largest residual drift in other spaces – here it stays locked at {abneyHue}&deg;.
        </p>
      </div>
    </div>

    <!-- Bezold-Brücke shift -->
    <div class="phenom-card">
      <div class="phenom-header">
        <sg-heading level={4} size="lg">Bezold-Br&uuml;cke shift</sg-heading>
        <span class="phenom-tag phenom-tag--corrected">Corrected by OKLCH</span>
      </div>
      <p class="phenom-subtitle">Hue shifts with luminance</p>

      <div class="phenom-columns">
        <div class="phenom-col">
          <span class="phenom-col-label">Impact on OKLCH</span>
          <p class="phenom-text">
            OKLCH corrects for this via its hue correlate, validated against CAM16 hue pairs.
            Residual drift is typically &lt;&nbsp;3&deg; across the lightness range used in UI.
          </p>
        </div>
        <div class="phenom-col">
          <span class="phenom-col-label">Mitigation in SigUI</span>
          <p class="phenom-text">
            No algorithmic correction needed. For brand-critical hue ramps, visual inspection
            is recommended.
          </p>
        </div>
      </div>

      <div class="phenom-demo">
        <span class="phenom-demo-label">Lightness ramp at H&nbsp;=&nbsp;{bbHue}&deg;, C&nbsp;=&nbsp;{bbChroma} – hue is constant</span>
        <div class="phenom-swatch-row">
          {#each bbLSteps as l}
            <div class="phenom-swatch-cell">
              <div
                class="phenom-swatch"
                style="background: oklch({l} {bbChroma} {bbHue})"
              ></div>
              <code class="phenom-swatch-code">L={l.toFixed(2)}</code>
              <code class="phenom-swatch-code phenom-swatch-code--dim">H={bbHue}&deg;</code>
            </div>
          {/each}
        </div>
        <p class="phenom-demo-note">
          In older spaces like HSL, sweeping lightness on blue shifts the perceived hue toward cyan or
          violet. OKLCH's hue correlate holds steady across the full L range.
        </p>
      </div>
    </div>
  </div>
</div>

<style>
  .phil-hsl-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--sg-gap-grouped);
  }

  .phil-big-swatch {
    width: 100%;
    height: 80px;
    border-radius: var(--sg-radius-md);
    margin: var(--sg-space-3) 0;
    border: var(--sg-border-thin) solid var(--sg-color-border-default, var(--sg-color-border));
  }

  .phil-bar-track {
    width: 100%;
    height: var(--sg-space-3);
    background: var(--sg-color-bg-secondary, var(--sg-surface-container-high));
    border-radius: var(--sg-radius-full);
    overflow: hidden;
    margin: var(--sg-space-2) 0 var(--sg-space-1);
  }

  .phil-bar-fill {
    height: 100%;
    border-radius: var(--sg-radius-full);
    transition: width var(--sg-duration-fast) ease;
  }

  .phil-bar-fill--ok {
    opacity: 0.8;
  }

  .phil-bar-label {
    font-size: var(--sg-text-xs);
    color: var(--sg-color-text-muted, var(--sg-color-text-secondary));
  }

  .palette-dual {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--sg-gap-grouped);
  }

  .phil-effects-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--sg-gap-related);
  }

  .phil-effect-bars {
    display: flex;
    flex-direction: column;
    gap: var(--sg-space-1-5);
  }

  .phil-bar-row {
    display: flex;
    align-items: center;
    gap: var(--sg-gap-related);
    font-size: var(--sg-text-xs);
    color: var(--sg-color-text-muted, var(--sg-color-text-secondary));
  }

  .phil-bar-row span {
    min-width: 80px;
    text-align: right;
  }

  .phil-bar-sm {
    height: var(--sg-space-3);
    border-radius: var(--sg-radius-sm);
  }

  /* Phenomenon cards */
  .phenom-card {
    border: var(--sg-border-thin) solid var(--sg-color-border-default, var(--sg-color-border));
    border-radius: var(--sg-radius-lg);
    padding: var(--sg-pad-card, 1.5rem);
    margin-bottom: var(--sg-gap-related);
  }

  .phenom-header {
    display: flex;
    align-items: center;
    gap: var(--sg-space-3);
    margin-bottom: var(--sg-space-1);
    flex-wrap: wrap;
  }

  .phenom-name {
    font-size: var(--sg-text-lg);
    font-weight: 600;
    margin: 0;
  }

  .phenom-tag {
    font-size: var(--sg-text-xs);
    font-weight: 500;
    padding: var(--sg-space-0-5) var(--sg-space-2);
    border-radius: var(--sg-radius-full);
  }

  .phenom-tag--corrected {
    background: oklch(0.92 0.04 145);
    color: oklch(0.35 0.10 145);
  }

  .phenom-tag--compensated {
    background: oklch(0.92 0.04 265);
    color: oklch(0.35 0.10 265);
  }

  .phenom-subtitle {
    font-size: var(--sg-text-sm);
    color: var(--sg-color-text-muted, var(--sg-color-text-secondary));
    margin: 0 0 var(--sg-space-4);
    font-style: italic;
  }

  .phenom-columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--sg-gap-grouped);
    margin-bottom: var(--sg-space-5);
  }

  .phenom-col-label {
    display: block;
    font-size: var(--sg-text-xs);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: var(--sg-tracking-caps);
    color: var(--sg-color-text-muted, var(--sg-color-text-secondary));
    margin-bottom: var(--sg-space-1-5);
  }

  .phenom-text {
    font-size: var(--sg-text-sm);
    line-height: 1.6;
    color: var(--sg-color-text-default, var(--sg-color-text));
    margin: 0;
  }

  .phenom-demo {
    background: var(--sg-color-bg-secondary, var(--sg-surface-container-high));
    border-radius: var(--sg-radius-md);
    padding: var(--sg-space-4);
  }

  .phenom-demo-label {
    display: block;
    font-size: var(--sg-text-xs);
    font-weight: 600;
    color: var(--sg-color-text-muted, var(--sg-color-text-secondary));
    margin-bottom: var(--sg-space-3);
  }

  .phenom-swatch-row {
    display: flex;
    gap: var(--sg-gap-related);
    flex-wrap: wrap;
  }

  .phenom-swatch-cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--sg-gap-tight);
    flex: 1;
    min-width: 60px;
  }

  .phenom-swatch {
    width: 100%;
    aspect-ratio: 1;
    border-radius: var(--sg-radius-md);
    border: var(--sg-border-thin) solid var(--sg-color-border-default, var(--sg-color-border));
  }

  .phenom-swatch-code {
    font-size: var(--sg-text-2xs);
    color: var(--sg-color-text-muted, var(--sg-color-text-secondary));
  }

  .phenom-swatch-code--dim {
    opacity: 0.6;
  }

  .phenom-demo-note {
    font-size: var(--sg-text-xs);
    color: var(--sg-color-text-muted, var(--sg-color-text-secondary));
    margin: var(--sg-space-3) 0 0;
    line-height: 1.5;
  }

  /* H-K comparison – gray ref on left spanning both rows */
  .hk-compare {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--sg-gap-grouped);
  }

  .hk-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--sg-gap-related);
  }

  .hk-col--ref {
    grid-row: 1 / 3;
  }

  .hk-swatch {
    width: 100%;
    height: 80px;
    border-radius: var(--sg-radius-md);
    border: var(--sg-border-thin) solid var(--sg-color-border-default, var(--sg-color-border));
  }

  .hk-swatch--ref {
    flex: 1;
    height: auto;
    min-height: 80px;
  }

  @media (max-width: 768px) {
    .phil-hsl-row { grid-template-columns: 1fr; }
    .palette-dual { grid-template-columns: 1fr; }
    .phil-effects-grid { grid-template-columns: 1fr; }
    .phenom-columns { grid-template-columns: 1fr; }
    .hk-compare { grid-template-columns: 1fr; }
    .hk-col--ref { grid-row: auto; }
  }
</style>
