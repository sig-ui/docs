<script lang="ts">
  import { generatePalette, simulateCVD, fromOklch, toOklch, deriveBrandBackground } from "../../../packages/core/src/index.js";
  import type { CvdType } from "../../../packages/core/src/types.js";
  import { round } from "../utils.ts";
  let cvdBase = $state("#6366f1");
  let cvdSeverity = $state(1.0);
  const cvdTypes: CvdType[] = ["protan", "deutan", "tritan"];
  const shadeStops = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

  let palette = $derived.by(() => {
    try {
      const oklch = toOklch(cvdBase);
      const bg = deriveBrandBackground(oklch.h, oklch.c, "light");
      return generatePalette(cvdBase, { background: bg, format: "hex" });
    } catch {
      return null;
    }
  });

  let cvdResults = $derived.by(() => {
    if (!palette?.formatted) return null;
    const results: Record<string, Record<number, string>> = { normal: {} };
    for (const type of cvdTypes) results[type] = {};
    for (const stop of shadeStops) {
      const hex = palette.formatted[stop];
      if (!hex) continue;
      results.normal[stop] = hex;
      for (const type of cvdTypes) {
        try {
          const sim = simulateCVD(hex, type, cvdSeverity);
          results[type]![stop] = fromOklch(sim, "hex")!;
        } catch {
          results[type]![stop] = hex;
        }
      }
    }
    return results;
  });
</script>

<sg-section id="cvd" title="Color Vision Deficiency Simulator" description="See how your palette appears to people with protanopia, deuteranopia, and tritanopia using the Machado-Oliveira-Fernandes model.">

    <div class="controls">
      <div class="control-group">
        <span class="card-label">Base Color</span>
        <sg-color-picker value={cvdBase} oninput={(e) => { const el = e.currentTarget as any; cvdBase = (el.value ?? cvdBase); }} onchange={(e) => { const el = e.currentTarget as any; cvdBase = (el.value ?? cvdBase); }} onclick={(e) => { const el = e.currentTarget as any; cvdBase = (el.value ?? cvdBase); }} ontoggle={(e) => { const el = e.currentTarget as any; cvdBase = (el.value ?? cvdBase); }} mode="popover" input label="Color" />
      </div>
      <div class="control-group" style="min-width: 200px">
        <input class="sg-slider" type="range" min={0} max={1} step={0.1} value={cvdSeverity} oninput={(e) => { const el = e.currentTarget as any; cvdSeverity = (el.value ?? cvdSeverity); }} onchange={(e) => { const el = e.currentTarget as any; cvdSeverity = (el.value ?? cvdSeverity); }} onclick={(e) => { const el = e.currentTarget as any; cvdSeverity = (el.value ?? cvdSeverity); }} ontoggle={(e) => { const el = e.currentTarget as any; cvdSeverity = (el.value ?? cvdSeverity); }} />
      </div>
    </div>

    {#if cvdResults}
      <div class="cvd-grid">
        <div class="cvd-column">
          <sg-heading level={4}>Normal Vision</sg-heading>
          <div class="cvd-ramp">
            {#each shadeStops as stop}
              {#if cvdResults.normal[stop]}
                <div class="cvd-swatch" style="background: {cvdResults.normal[stop]}"></div>
              {/if}
            {/each}
          </div>
        </div>
        {#each cvdTypes as type}
          <div class="cvd-column">
            <sg-heading level={4}>{type === "protan" ? "Protanopia" : type === "deutan" ? "Deuteranopia" : "Tritanopia"}</sg-heading>
            <div class="cvd-ramp">
              {#each shadeStops as stop}
                {#if cvdResults[type]?.[stop]}
                  <div class="cvd-swatch" style="background: {cvdResults[type][stop]}"></div>
                {/if}
              {/each}
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <p style="color: var(--text-3)">Choose a base color to see CVD simulations.</p>
    {/if}
</sg-section>
