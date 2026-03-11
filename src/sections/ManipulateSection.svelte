<script lang="ts">
  import { toOklch, fromOklch, lighten, darken, saturate, desaturate, shiftHue } from "../../../packages/core/src/index.js";
  import { isLightColor, round, copyHex } from "../utils.ts";
  import { getToastContext } from "../toast-context.ts";
  const toast = getToastContext();

  let manipBase = $state("#e11d48");
  let manipLighten = $state(0);
  let manipDarken = $state(0);
  let manipSaturate = $state(0);
  let manipDesaturate = $state(0);
  let manipHue = $state(0);

  let manipResult = $derived.by(() => {
    try {
      let color = toOklch(manipBase);
      if (manipLighten > 0) color = lighten(color, manipLighten);
      if (manipDarken > 0) color = darken(color, manipDarken);
      if (manipSaturate > 0) color = saturate(color, manipSaturate);
      if (manipDesaturate > 0) color = desaturate(color, manipDesaturate);
      if (manipHue !== 0) color = shiftHue(color, manipHue);
      return { color, hex: fromOklch(color, "hex")! };
    } catch {
      return null;
    }
  });

  function resetManip() {
    manipLighten = 0;
    manipDarken = 0;
    manipSaturate = 0;
    manipDesaturate = 0;
    manipHue = 0;
  }
</script>

<sg-section id="manipulate" title="Color Manipulation" description="Lighten, darken, saturate, desaturate, and shift hue - all in perceptually uniform OKLCH space.">

    <div class="controls">
      <div class="control-group">
        <span class="card-label">Source Color</span>
        <sg-color-picker value={manipBase} oninput={(e) => { const el = e.currentTarget as any; manipBase = (el.value ?? manipBase); }} onchange={(e) => { const el = e.currentTarget as any; manipBase = (el.value ?? manipBase); }} onclick={(e) => { const el = e.currentTarget as any; manipBase = (el.value ?? manipBase); }} ontoggle={(e) => { const el = e.currentTarget as any; manipBase = (el.value ?? manipBase); }} mode="popover" input label="Color" />
      </div>
      <button class="sg-button" onclick={resetManip}>Reset</button>
    </div>

    <div class="manip-layout">
      <div class="manip-sliders">
        <input class="sg-slider" type="range" min={0} max={0.5} step={0.01} value={manipLighten} oninput={(e) => { const el = e.currentTarget as any; manipLighten = (el.value ?? manipLighten); }} onchange={(e) => { const el = e.currentTarget as any; manipLighten = (el.value ?? manipLighten); }} onclick={(e) => { const el = e.currentTarget as any; manipLighten = (el.value ?? manipLighten); }} ontoggle={(e) => { const el = e.currentTarget as any; manipLighten = (el.value ?? manipLighten); }} />
        <input class="sg-slider" type="range" min={0} max={0.5} step={0.01} value={manipDarken} oninput={(e) => { const el = e.currentTarget as any; manipDarken = (el.value ?? manipDarken); }} onchange={(e) => { const el = e.currentTarget as any; manipDarken = (el.value ?? manipDarken); }} onclick={(e) => { const el = e.currentTarget as any; manipDarken = (el.value ?? manipDarken); }} ontoggle={(e) => { const el = e.currentTarget as any; manipDarken = (el.value ?? manipDarken); }} />
        <input class="sg-slider" type="range" min={0} max={0.2} step={0.005} value={manipSaturate} oninput={(e) => { const el = e.currentTarget as any; manipSaturate = (el.value ?? manipSaturate); }} onchange={(e) => { const el = e.currentTarget as any; manipSaturate = (el.value ?? manipSaturate); }} onclick={(e) => { const el = e.currentTarget as any; manipSaturate = (el.value ?? manipSaturate); }} ontoggle={(e) => { const el = e.currentTarget as any; manipSaturate = (el.value ?? manipSaturate); }} />
        <input class="sg-slider" type="range" min={0} max={0.2} step={0.005} value={manipDesaturate} oninput={(e) => { const el = e.currentTarget as any; manipDesaturate = (el.value ?? manipDesaturate); }} onchange={(e) => { const el = e.currentTarget as any; manipDesaturate = (el.value ?? manipDesaturate); }} onclick={(e) => { const el = e.currentTarget as any; manipDesaturate = (el.value ?? manipDesaturate); }} ontoggle={(e) => { const el = e.currentTarget as any; manipDesaturate = (el.value ?? manipDesaturate); }} />
        <input class="sg-slider" type="range" min={-180} max={180} step={1} value={manipHue} oninput={(e) => { const el = e.currentTarget as any; manipHue = (el.value ?? manipHue); }} onchange={(e) => { const el = e.currentTarget as any; manipHue = (el.value ?? manipHue); }} onclick={(e) => { const el = e.currentTarget as any; manipHue = (el.value ?? manipHue); }} ontoggle={(e) => { const el = e.currentTarget as any; manipHue = (el.value ?? manipHue); }} />
      </div>

      <div>
        <div class="manip-preview">
          <div
            class="manip-swatch"
            class:light-swatch={isLightColor(manipBase)}
            class:dark-swatch={!isLightColor(manipBase)}
            style="background: {manipBase}"
          >
            <span>Original</span>
            <span>{manipBase}</span>
          </div>
          {#if manipResult}
            <div
              class="manip-swatch"
              class:light-swatch={isLightColor(manipResult.hex)}
              class:dark-swatch={!isLightColor(manipResult.hex)}
              style="background: {manipResult.hex}"
              onclick={() => copyHex(manipResult!.hex, toast.add)}
            >
              <span>Result</span>
              <span>{manipResult.hex}</span>
            </div>
          {/if}
        </div>
        {#if manipResult}
          <div class="oklch-info">
            <div class="info-item">
              <div class="info-label">Lightness</div>
              <div class="info-value">{round(manipResult.color.l, 3)}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Chroma</div>
              <div class="info-value">{round(manipResult.color.c, 3)}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Hue</div>
              <div class="info-value">{round(manipResult.color.h, 1)}&deg;</div>
            </div>
          </div>
        {/if}
      </div>
    </div>
</sg-section>
