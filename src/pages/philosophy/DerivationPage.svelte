<script lang="ts">
  import { generatePalette } from "../../../../packages/core/src/index.js";
  import { isLightColor } from "../../utils.ts";
  // Interactive seed demo
  let seedColor = $state("#6366f1");
  let seedBg = $state("#ffffff");
  let palette = $derived(generatePalette(seedColor, { background: seedBg }));
  const stops = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

  // Spacing comparison
  const convention = [4, 8, 12, 16, 24, 32, 48, 64];
  const derived = [
    { val: 2, regime: "linear" }, { val: 4, regime: "linear" }, { val: 6, regime: "linear" },
    { val: 8, regime: "linear" }, { val: 12, regime: "transition" }, { val: 16, regime: "geometric" },
    { val: 24, regime: "geometric" }, { val: 32, regime: "geometric" },
    { val: 48, regime: "geometric" }, { val: 64, regime: "geometric" },
  ];
</script>

<div class="page">
  <div class="page-header">
    <sg-heading level={1}>Derivation</sg-heading>
    <sg-text size="lg" color="secondary">Every token has a reason. Change a seed and watch everything recompute.</sg-text>
  </div>

  <!-- Interactive derivation -->
  <div class="subsection">
    <sg-heading level={3} size="lg">Seeds in, system out</sg-heading>
    <sg-text size="lg" color="secondary" style="margin-bottom: var(--sg-space-5)">Pick a brand color and background. The palette derives itself through binary search against APCA targets.</sg-text>

    <div class="controls">
      <div class="control-group">
        <span class="card-label">Brand</span>
        <sg-color-picker value={seedColor} oninput={(e) => { const el = e.currentTarget as any; seedColor = (el.value ?? seedColor); }} onchange={(e) => { const el = e.currentTarget as any; seedColor = (el.value ?? seedColor); }} onclick={(e) => { const el = e.currentTarget as any; seedColor = (el.value ?? seedColor); }} ontoggle={(e) => { const el = e.currentTarget as any; seedColor = (el.value ?? seedColor); }} mode="popover" input label="Color" />
      </div>
      <div class="control-group">
        <span class="card-label">Background</span>
        <sg-color-picker value={seedBg} oninput={(e) => { const el = e.currentTarget as any; seedBg = (el.value ?? seedBg); }} onchange={(e) => { const el = e.currentTarget as any; seedBg = (el.value ?? seedBg); }} onclick={(e) => { const el = e.currentTarget as any; seedBg = (el.value ?? seedBg); }} ontoggle={(e) => { const el = e.currentTarget as any; seedBg = (el.value ?? seedBg); }} mode="popover" input label="Color" />
      </div>
    </div>

    <div class="shade-ramp" style:border-radius="var(--sg-radius-md)">
      {#each stops as stop}
        {@const hex = palette.formatted[stop]}
        {@const light = isLightColor(hex)}
        <div class="shade-swatch" class:light-swatch={light} class:dark-swatch={!light} style="background: {hex}">
          <span class="stop-num">{stop}</span>
          <span class="hex-val">{hex}</span>
        </div>
      {/each}
    </div>

    <div class="phil-derive-summary">
      <div class="card"><span class="phil-derive-count">11</span><span class="card-label">shade stops</span></div>
      <div class="card"><span class="phil-derive-count">2</span><span class="card-label">color modes</span></div>
      <div class="card"><span class="phil-derive-count">9</span><span class="card-label">type scale steps</span></div>
      <div class="card"><span class="phil-derive-count">14</span><span class="card-label">spacing tokens</span></div>
      <div class="card"><span class="phil-derive-count">6</span><span class="card-label">elevation levels</span></div>
      <div class="card"><span class="phil-derive-count">7</span><span class="card-label">duration tokens</span></div>
    </div>
  </div>

  <!-- Three tiers -->
  <div class="subsection">
    <sg-heading level={3} size="lg">The three-tier model</sg-heading>
    <sg-text size="lg" color="secondary" style="margin-bottom: var(--sg-space-5)">Tokens are a dependency graph. Changing a seed propagates through all tiers.</sg-text>

    <div class="phil-tier-stack">
      <div class="card" style="border-left: var(--sg-border-medium) solid var(--sg-color-emphasis)">
        <span class="card-label">Tier 1: Primitives</span>
        <p style="font-size: var(--sg-text-sm); color: var(--sg-color-text-muted, var(--sg-color-text-secondary)); margin-bottom: var(--sg-space-2)">Raw computed values from derivation functions.</p>
        <code style="font-size: var(--sg-text-xs); display: block; color: var(--sg-color-text-muted, var(--sg-color-text-secondary))">--blue-500: oklch(0.55 0.19 264)</code>
        <code style="font-size: var(--sg-text-xs); display: block; color: var(--sg-color-text-muted, var(--sg-color-text-secondary))">--space-4: 16px</code>
      </div>
      <div style="text-align: center; color: var(--sg-color-text-muted, var(--sg-color-text-secondary)); font-size: var(--sg-text-sm); padding: var(--sg-space-1) 0">&darr;</div>
      <div class="card" style="border-left: var(--sg-border-medium) solid var(--sg-color-success)">
        <span class="card-label">Tier 2: Semantic</span>
        <p style="font-size: var(--sg-text-sm); color: var(--sg-color-text-muted, var(--sg-color-text-secondary)); margin-bottom: var(--sg-space-2)">Intent mapped to primitives. Changes between modes.</p>
        <code style="font-size: var(--sg-text-xs); display: block; color: var(--sg-color-text-muted, var(--sg-color-text-secondary))">--sg-color-text: var(--gray-900)</code>
        <code style="font-size: var(--sg-text-xs); display: block; color: var(--sg-color-text-muted, var(--sg-color-text-secondary)); opacity: 0.6">dark &rarr; --sg-color-text: var(--gray-100)</code>
      </div>
      <div style="text-align: center; color: var(--sg-color-text-muted, var(--sg-color-text-secondary)); font-size: var(--sg-text-sm); padding: var(--sg-space-1) 0">&darr;</div>
      <div class="card" style="border-left: var(--sg-border-medium) solid var(--sg-color-warning)">
        <span class="card-label">Tier 3: Component</span>
        <p style="font-size: var(--sg-text-sm); color: var(--sg-color-text-muted, var(--sg-color-text-secondary)); margin-bottom: var(--sg-space-2)">Scoped to a specific element.</p>
        <code style="font-size: var(--sg-text-xs); display: block; color: var(--sg-color-text-muted, var(--sg-color-text-secondary))">--sg-button-bg: var(--sg-primary)</code>
        <code style="font-size: var(--sg-text-xs); display: block; color: var(--sg-color-text-muted, var(--sg-color-text-secondary))">--sg-button-fg: var(--sg-on-primary)</code>
      </div>
    </div>
  </div>

  <!-- Convention vs derivation -->
  <div class="subsection">
    <sg-heading level={3} size="lg">Convention vs. derivation</sg-heading>
    <sg-text size="lg" color="secondary" style="margin-bottom: var(--sg-space-5)">Both produce spacing scales. Only one has a reason for every value.</sg-text>

    <div class="phil-vs-grid">
      <div class="card">
        <span class="card-label" style="color: var(--sg-color-danger)">Convention: "multiples of 4"</span>
        <div class="phil-spacing-bars">
          {#each convention as val}
            <div class="phil-spacing-row">
              <div class="phil-bar-sm" style="width: {val * 1.8}px; background: var(--sg-color-link); opacity: 0.35"></div>
              <code>{val}px</code>
            </div>
          {/each}
        </div>
        <p style="font-size: var(--sg-text-sm); color: var(--sg-color-text-muted, var(--sg-color-text-secondary)); margin-top: var(--sg-space-3)">Why 24 and not 20? "Because 24 is closer to what we wanted." Post-hoc justification.</p>
      </div>
      <div class="card">
        <span class="card-label" style="color: var(--sg-color-success)">Derivation: Weber's Law</span>
        <div class="phil-spacing-bars">
          {#each derived as { val, regime }}
            <div class="phil-spacing-row">
              <div class="phil-bar-sm" style="width: {val * 1.8}px; background: var(--sg-color-success); opacity: 0.5"></div>
              <code>{val}px</code>
              <span style="font-size: var(--sg-text-xs); color: var(--sg-color-text-muted, var(--sg-color-text-secondary)); font-style: italic">{regime}</span>
            </div>
          {/each}
        </div>
        <p style="font-size: var(--sg-text-sm); color: var(--sg-color-text-primary, var(--sg-color-text)); margin-top: var(--sg-space-3)">Small: linear (every pixel matters). Large: geometric (proportional differences dominate).</p>
      </div>
    </div>
  </div>
</div>

<style>
  .phil-derive-summary {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: var(--sg-gap-related);
    margin-top: var(--sg-space-5);
  }

  .phil-derive-count {
    display: block;
    font-size: var(--sg-text-xl);
    font-weight: var(--sg-weight-bold);
    color: var(--sg-color-text-primary, var(--sg-color-text));
    letter-spacing: var(--sg-tracking-xl);
  }

  .phil-tier-stack {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .phil-vs-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--sg-gap-grouped);
  }

  .phil-spacing-bars {
    display: flex;
    flex-direction: column;
    gap: var(--sg-space-1-5);
    margin-top: var(--sg-space-3);
  }

  .phil-spacing-row {
    display: flex;
    align-items: center;
    gap: var(--sg-gap-related);
  }

  .phil-spacing-row code {
    font-size: var(--sg-text-xs);
    color: var(--sg-color-text-muted, var(--sg-color-text-secondary));
    min-width: var(--sg-space-8);
  }

  .phil-bar-sm {
    height: var(--sg-space-3);
    border-radius: var(--sg-radius-sm);
  }

  @media (max-width: 768px) {
    .phil-derive-summary { grid-template-columns: repeat(3, 1fr); }
    .phil-vs-grid { grid-template-columns: 1fr; }
  }
</style>
