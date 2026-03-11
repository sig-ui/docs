<script lang="ts">
  import {
    toOklch,
    computeAlphaEquivalent,
    generateBlackAlphaScale,
    generateWhiteAlphaScale,
    ALPHA_STOPS,
  } from "../../../packages/core/src/index.js";
  import type { AlphaStop } from "../../../packages/core/src/types.js";
  import { isLightColor } from "../utils.ts";
  import { getToastContext } from "../toast-context.ts";
  const toast = getToastContext();

  let fgHex = $state("#6366f1");
  let bgHex = $state("#ffffff");

  let alphaEquivalents = $derived.by(() => {
    try {
      const fg = toOklch(fgHex);
      const bg = toOklch(bgHex);
      return ALPHA_STOPS.map((alpha) => computeAlphaEquivalent(fg, bg, alpha as AlphaStop));
    } catch {
      return [];
    }
  });

  let blackAlpha = generateBlackAlphaScale();
  let whiteAlpha = generateWhiteAlphaScale();

  function copyCss(css: string) {
    navigator.clipboard.writeText(css);
    toast.add(`Copied ${css}`);
  }
</script>

<sg-section id="alpha-blending" title="Alpha Blending">
  Pre-compute sRGBA values that composite correctly over a known background.
  CSS alpha compositing happens in sRGB, not OKLCH &mdash; these utilities back-solve for the exact RGBA
  that reproduces the target color when layered over the background.
  

    <!-- Alpha Equivalents -->
    <sg-heading level={3}>Alpha Equivalents</sg-heading>
    <sg-text color="secondary">
      Given a foreground and background, compute the RGBA color at each alpha stop
      that produces the same perceived result when composited.
    </sg-text>

    <div class="controls">
      <div class="control-group">
        <span class="card-label">Foreground</span>
        <sg-color-picker value={fgHex} oninput={(e) => { const el = e.currentTarget as any; fgHex = (el.value ?? fgHex); }} onchange={(e) => { const el = e.currentTarget as any; fgHex = (el.value ?? fgHex); }} onclick={(e) => { const el = e.currentTarget as any; fgHex = (el.value ?? fgHex); }} ontoggle={(e) => { const el = e.currentTarget as any; fgHex = (el.value ?? fgHex); }} mode="popover" input label="Color" />
      </div>
      <div class="control-group">
        <span class="card-label">Background</span>
        <sg-color-picker value={bgHex} oninput={(e) => { const el = e.currentTarget as any; bgHex = (el.value ?? bgHex); }} onchange={(e) => { const el = e.currentTarget as any; bgHex = (el.value ?? bgHex); }} onclick={(e) => { const el = e.currentTarget as any; bgHex = (el.value ?? bgHex); }} ontoggle={(e) => { const el = e.currentTarget as any; bgHex = (el.value ?? bgHex); }} mode="popover" input label="Color" />
      </div>
    </div>

    <!-- Target swatch -->
    <div class="alpha-target">
      <div class="alpha-target-label card-label">Target (opaque)</div>
      <div
        class="alpha-swatch alpha-swatch--large"
        class:light-swatch={isLightColor(fgHex)}
        class:dark-swatch={!isLightColor(fgHex)}
        style="background: {fgHex}"
      >
        <span>{fgHex}</span>
      </div>
    </div>

    <!-- Alpha stops -->
    <div class="alpha-grid">
      {#each alphaEquivalents as eq}
        <div class="alpha-card">
          <div class="alpha-card-header">
            <span class="alpha-stop">&#945; {eq.alpha}</span>
            {#if !eq.exact}
              <span class="alpha-clamped" title="Back-solve required clamping; result is approximate">~</span>
            {/if}
          </div>
          <div
            class="alpha-swatch"
            style="background: {bgHex}"
            onclick={() => copyCss(eq.css)}
            title="Click to copy"
          >
            <div
              class="alpha-swatch-fg"
              class:light-swatch={isLightColor(fgHex)}
              class:dark-swatch={!isLightColor(fgHex)}
              style="background: {eq.css}"
            >
              <span class="alpha-css">{eq.css}</span>
            </div>
          </div>
        </div>
      {/each}
    </div>

    <!-- Overlay Scales -->
    <sg-heading level={3}>Overlay Scales</sg-heading>
    <sg-text color="secondary">
      12-step perceptually uniform opacity scales for black and white overlays,
      generated using OKLCH lightness targets for equal visual increments.
    </sg-text>

    <div class="overlay-section">
      <div class="overlay-block">
        <div class="card-label">BlackAlpha</div>
        <div class="overlay-strip" style="background: #ffffff">
          {#each blackAlpha as step}
            <div
              class="overlay-stop"
              style="background: {step.css}"
              onclick={() => copyCss(step.css)}
              title="Step {step.step}: {step.css}"
            ></div>
          {/each}
        </div>
        <div class="overlay-labels">
          {#each blackAlpha as step}
            <span class="overlay-label">{step.opacity}</span>
          {/each}
        </div>
      </div>

      <div class="overlay-block">
        <div class="card-label">WhiteAlpha</div>
        <div class="overlay-strip" style="background: #1a1a2e">
          {#each whiteAlpha as step}
            <div
              class="overlay-stop"
              style="background: {step.css}"
              onclick={() => copyCss(step.css)}
              title="Step {step.step}: {step.css}"
            ></div>
          {/each}
        </div>
        <div class="overlay-labels">
          {#each whiteAlpha as step}
            <span class="overlay-label">{step.opacity}</span>
          {/each}
        </div>
      </div>
    </div>
</sg-section>

<style>
  .subsection-title {
    font-size: var(--sg-text-xl);
    font-weight: var(--sg-weight-semibold);
    margin: var(--sg-space-8) 0 var(--sg-space-1);
    color: var(--sg-color-text);
  }
  .subsection-desc {
    color: var(--sg-color-text-secondary);
    font-size: var(--sg-text-base);
    margin-bottom: var(--sg-space-5);
    max-width: 640px;
  }

  .picker-controls {
    display: flex;
    gap: var(--sg-gap-separated);
    flex-wrap: wrap;
    margin-bottom: var(--sg-space-6);
  }

  .alpha-target {
    margin-bottom: var(--sg-space-5);
  }
  .alpha-target-label {
    margin-bottom: var(--sg-space-1-5);
  }

  .alpha-swatch--large {
    width: 180px;
    height: 56px;
    border-radius: var(--sg-radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--sg-text-sm);
    font-weight: var(--sg-weight-medium);
    font-family: monospace;
  }

  .alpha-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: var(--sg-space-3);
  }

  .alpha-card {
    border: var(--sg-border-thin) solid var(--sg-color-border);
    border-radius: var(--sg-radius-md);
    overflow: hidden;
    background: var(--surface);
  }
  .alpha-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--sg-space-2) var(--sg-space-3);
    font-size: var(--sg-text-sm);
    color: var(--sg-color-text-secondary);
  }
  .alpha-stop {
    font-weight: var(--sg-weight-semibold);
    font-family: monospace;
  }
  .alpha-clamped {
    color: var(--sg-color-warning);
    font-weight: var(--sg-weight-bold);
    font-size: var(--sg-text-base);
    cursor: help;
  }

  .alpha-swatch {
    height: 64px;
    cursor: pointer;
    position: relative;
  }
  .alpha-swatch-fg {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .alpha-css {
    font-family: monospace;
    font-size: var(--sg-text-xs);
    font-weight: var(--sg-weight-medium);
  }

  .overlay-section {
    display: flex;
    flex-direction: column;
    gap: var(--sg-space-6);
  }
  .overlay-block {
    display: flex;
    flex-direction: column;
    gap: var(--sg-gap-tight);
  }
  .overlay-strip {
    display: flex;
    border-radius: var(--sg-radius-md);
    overflow: hidden;
    height: 48px;
  }
  .overlay-stop {
    flex: 1;
    cursor: pointer;
    transition: opacity 0.15s;
  }
  .overlay-stop:hover {
    opacity: 0.8;
  }
  .overlay-labels {
    display: flex;
  }
  .overlay-label {
    flex: 1;
    text-align: center;
    font-family: monospace;
    font-size: var(--sg-text-xs);
    color: var(--text-3);
  }
</style>
