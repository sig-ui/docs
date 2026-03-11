<script lang="ts">
  import { gradientFill, fromOklch } from "../../../packages/core/src/index.js";
  import { copyHex, round } from "../utils.ts";
  import { getToastContext } from "../toast-context.ts";
  const toast = getToastContext();

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

<sg-section id="gradients" title="Gradient Builder" description="Interpolate between colors in OKLab (Cartesian) or OKLCH (polar) space. OKLab avoids hue shifts; OKLCH travels through the color wheel.">

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
        <sg-toggle-group type="single" value={gradSpace} oninput={(e) => { const el = e.currentTarget as any; gradSpace = (el.value ?? gradSpace); }} onclick={(e) => { const el = e.currentTarget as any; gradSpace = (el.value ?? gradSpace); }} ontoggle={(e) => { const el = e.currentTarget as any; gradSpace = (el.value ?? gradSpace); }} onchange={(e) => { const v = ((e as CustomEvent<any>).detail ?? (e.currentTarget as any).value); gradSpace = v as "oklab" | "oklch" }}>
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
