<script lang="ts">
  let dialogOpen = $state(false);
  let dialogEl: HTMLDialogElement | undefined = $state();

  function openDialog() {
    dialogOpen = true;
    requestAnimationFrame(() => dialogEl?.showModal());
  }

  function closeDialog() {
    dialogEl?.close();
    dialogOpen = false;
  }
</script>

<div class="page">
  <div class="page-header">
    <sg-heading level={1}>The Modern Stack</sg-heading>
    <sg-text size="lg" color="secondary">In 2016 we needed div inside div inside div and JavaScript for basic UI elements. In 2026 the platform does it natively.</sg-text>
  </div>

  <!-- 2016 vs 2026 -->
  <div class="subsection">
    <sg-heading level={3} size="lg">What changed</sg-heading>
    <sg-text size="lg" color="secondary" style="margin-bottom: var(--sg-space-5)">
      A decade ago, CSS couldn't express what a design system needs. No custom properties, no
      cascade layers, no container queries, no <code>:has()</code>, no <code>oklch()</code>,
      no native <code>&lt;dialog&gt;</code>, no <code>popover</code>. Every gap had to be
      filled with JavaScript and wrapper divs. That era is over.
    </sg-text>

    <div class="timeline">
      {#each [
        { year: "2016", items: [
          "No custom properties &mdash; JS theme objects",
          "No cascade layers &mdash; specificity wars + !important",
          "No :has() &mdash; parent-aware logic in JS",
          "No container queries &mdash; ResizeObserver hacks",
          "No oklch() &mdash; hand-picked color palettes",
          "No &lt;dialog&gt; / popover &mdash; div nesting + focus trap + z-index",
          "No scroll-driven animations &mdash; IntersectionObserver",
        ]},
        { year: "2026", items: [
          "Custom properties cascade, inherit, animate",
          "@layer guarantees override priority",
          ":has() selects by child/state without JS",
          "@container sizes to parent, not viewport",
          "oklch() is perceptually uniform in the browser",
          "&lt;dialog&gt; and popover are native with top layer",
          "animation-timeline: scroll() is CSS-only",
        ]},
      ] as col}
        <div class="timeline-col" class:timeline-col--past={col.year === "2016"} class:timeline-col--now={col.year === "2026"}>
          <span class="timeline-year">{col.year}</span>
          <ul class="timeline-list">
            {#each col.items as item}
              <li>{@html item}</li>
            {/each}
          </ul>
        </div>
      {/each}
    </div>
  </div>

  <!-- Native dialog demo -->
  <div class="subsection">
    <sg-heading level={3} size="lg">Native &lt;dialog&gt;</sg-heading>
    <sg-text size="lg" color="secondary" style="margin-bottom: var(--sg-space-5)">No JS focus trap. No manual backdrop. No z-index tricks. This is a real <code>&lt;dialog&gt;</code> element.</sg-text>

    <button class="sg-button" data-color="secondary" onclick={openDialog}>Open native dialog</button>

    {#if dialogOpen}
      <dialog bind:this={dialogEl} class="phil-dialog" onclose={closeDialog}>
        <h3 style="margin-bottom: var(--sg-space-2)">Native &lt;dialog&gt;</h3>
        <p style="font-size: var(--sg-text-sm); color: var(--sg-color-text-muted, var(--sg-color-text-secondary)); margin-bottom: var(--sg-space-5)">
          Focus is trapped by the browser. Backdrop is <code>::backdrop</code>. Press Escape to close. No JavaScript reinvention.
        </p>
        <div style="display: flex; gap: var(--sg-gap-related); justify-content: flex-end">
          <button class="sg-button" data-color="secondary" onclick={closeDialog}>Close</button>
        </div>
      </dialog>
    {/if}

    <div class="phil-vs-grid" style="margin-top: var(--sg-space-6)">
      <div class="card">
        <span class="card-label" style="color: var(--sg-color-danger)">JS reinvention</span>
        <ul class="phil-checklist">
          <li><code>&lt;div role="dialog"&gt;</code></li>
          <li>Focus trap library</li>
          <li>Manual backdrop element</li>
          <li>Escape key listener</li>
          <li>Click-outside listener</li>
          <li>aria-modal management</li>
          <li>Inert sibling traversal</li>
          <li>Z-index stacking context</li>
        </ul>
      </div>
      <div class="card">
        <span class="card-label" style="color: var(--sg-color-success)">Native platform</span>
        <ul class="phil-checklist">
          <li><code>&lt;dialog&gt;</code></li>
          <li><code>.showModal()</code></li>
          <li><code>::backdrop</code> pseudo</li>
          <li>Built-in focus trap</li>
          <li>Built-in top layer</li>
          <li>Built-in inert</li>
        </ul>
      </div>
    </div>
  </div>

  <!-- Progressive enhancement -->
  <div class="subsection">
    <sg-heading level={3} size="lg">Progressive enhancement</sg-heading>
    <sg-text size="lg" color="secondary" style="margin-bottom: var(--sg-space-5)">Modern browsers get enhancements. Older ones get a working baseline. Nobody gets a blank screen.</sg-text>

    <div class="phil-enhance-stack">
      {#each [
        { feature: "OKLCH colors", modern: "oklch(0.72 0.19 264)", fallback: "#6366f1", gate: "@supports (color: oklch(...))" },
        { feature: "Anchor Positioning", modern: "CSS-only placement", fallback: "Floating UI (JS)", gate: "@supports (anchor-name: --x)" },
        { feature: "View Transitions", modern: "Animated route changes", fallback: "Instant update", gate: "document.startViewTransition" },
        { feature: "Scroll Animations", modern: "Scroll-driven effects", fallback: "Content just shows", gate: "@supports (animation-timeline)" },
      ] as row}
        <div class="phil-enhance-row">
          <span class="phil-enhance-name">{row.feature}</span>
          <div class="phil-enhance-cells">
            <span class="phil-enhance-modern">{row.modern}</span>
            <span class="phil-enhance-fallback">{row.fallback}</span>
          </div>
          <code class="phil-enhance-gate">{row.gate}</code>
        </div>
      {/each}
    </div>
  </div>

  <!-- CSS Layers -->
  <div class="subsection">
    <sg-heading level={3} size="lg">CSS layers</sg-heading>
    <sg-text size="lg" color="secondary" style="margin-bottom: var(--sg-space-5)">Explicit priority. No specificity wars. Hover to highlight.</sg-text>

    <div class="phil-layers">
      {#each [
        { name: "sigui.base", desc: "Default component styles" },
        { name: "sigui.variants", desc: "Size, color, density" },
        { name: "sigui.states", desc: "Hover, focus, active, disabled" },
        { name: "sigui.utilities", desc: "One-off helpers" },
        { name: "sigui.overrides", desc: "Your customizations" },
      ] as layer, i}
        <div class="phil-layer-row" style="margin-left: {i * 16}px">
          <span class="phil-layer-num">{i + 1}</span>
          <code>@layer {layer.name}</code>
          <span style="color: var(--sg-color-text-muted, var(--sg-color-text-secondary)); font-size: var(--sg-text-sm)">{layer.desc}</span>
        </div>
      {/each}
    </div>

    <div style="margin-top: var(--sg-space-5)">
      <sg-code-block
        title="No !important needed"
        language="css"
        code={`/* Your overrides always win over component defaults */
@layer sigui.overrides {
  [data-sigui="button"] {
    border-radius: 999px;
  }
}`}
      />
    </div>
  </div>

  <!-- Zero dependencies -->
  <div class="subsection">
    <sg-heading level={3} size="lg">Zero runtime dependencies</sg-heading>
    <sg-text size="lg" color="secondary" style="margin-bottom: var(--sg-space-5)">
      The core math layer has no <code>dependencies</code> at all. The component library
      peer-depends on Svelte. That's it. No style runtime, no class-name generator, no
      polyfill bundle. Every line of logic is ours to audit, tree-shake, and optimize.
    </sg-text>

    <div class="dep-grid">
      <div class="dep-card dep-card--zero">
        <span class="dep-pkg">@sig-ui/core</span>
        <span class="dep-count">0 deps</span>
        <span class="dep-desc">Pure math &mdash; color science, tokens, state machines. Runs anywhere.</span>
      </div>
      <div class="dep-card dep-card--zero">
        <span class="dep-pkg">@sig-ui/theme</span>
        <span class="dep-count">0 deps</span>
        <span class="dep-desc">Schema + resolution. Depends only on core (workspace).</span>
      </div>
      <div class="dep-card dep-card--zero">
        <span class="dep-pkg">@sig-ui/dom</span>
        <span class="dep-count">0 deps</span>
        <span class="dep-desc">Browser runtime. CSS injection, brand color, device sensing.</span>
      </div>
      <div class="dep-card dep-card--peer">
        <span class="dep-pkg">@sig-ui/components</span>
        <span class="dep-count">1 peer</span>
        <span class="dep-desc">Svelte 5. The only external dependency &mdash; your framework.</span>
      </div>
    </div>

    <div class="dep-external" style="margin-top: var(--sg-space-5)">
      <span class="card-label">External resources (website only)</span>
      <div class="dep-ext-list">
        <div class="dep-ext-row">
          <code>Material Symbols</code>
          <span>Icon set. Variable font with optical size, weight, fill, and grade axes. Loaded from Google Fonts CDN.</span>
        </div>
        <div class="dep-ext-row">
          <code>Inter</code>
          <span>Body typeface. Variable font, optical sizing. Loaded from Google Fonts CDN.</span>
        </div>
      </div>
      <p class="dep-ext-note">
        Both are font files loaded via CSS <code>@font-face</code> &mdash; not JavaScript. They can be
        self-hosted, replaced, or removed without touching a single line of code.
      </p>
    </div>
  </div>

  <!-- Comprehensive -->
  <div class="subsection">
    <sg-heading level={3} size="lg">Comprehensive</sg-heading>
    <sg-text size="lg" color="secondary" style="margin-bottom: var(--sg-space-5)">
      Most libraries give you components and assume you'll figure out the rest.
      SigUI owns every layer from perceptual color science to interactive UI, so
      the system is coherent by construction.
    </sg-text>

    <div class="stack-layers">
      {#each [
        { name: "Color science", detail: "OKLCH palette generation, APCA contrast, gamut mapping, CVD simulation", pkg: "core" },
        { name: "Design tokens", detail: "Spacing, typography, elevation, motion &mdash; all derived from first principles", pkg: "core" },
        { name: "Theme resolution", detail: "Config schema, semantic mapping, light/dark derivation", pkg: "theme" },
        { name: "CSS generation", detail: "Static custom properties, @layer structure, split-file output", pkg: "cli" },
        { name: "Browser runtime", detail: "Dynamic brand color, device sensing, CSS injection", pkg: "dom" },
        { name: "Component library", detail: "50+ Svelte 5 components with state machines, a11y, compound patterns", pkg: "svelte" },
      ] as layer, i}
        <div class="stack-row">
          <span class="stack-num">{i + 1}</span>
          <div class="stack-info">
            <span class="stack-name">{layer.name}</span>
            <span class="stack-detail">{layer.detail}</span>
          </div>
          <code class="stack-pkg">@sig-ui/{layer.pkg}</code>
        </div>
      {/each}
    </div>

    <p class="section-note" style="margin-top: var(--sg-space-4)">
      Each layer is a separate package with sub-path exports. Use one layer, use all of them, or
      anything in between. The dependency graph is a strict DAG &mdash; no cycles, no coupling.
    </p>
  </div>

  <!-- Efficient -->
  <div class="subsection">
    <sg-heading level={3} size="lg">Efficient</sg-heading>
    <sg-text size="lg" color="secondary" style="margin-bottom: var(--sg-space-5)">
      Three kinds of efficiency, all from the same architecture.
    </sg-text>

    <div class="eff-grid">
      <div class="card">
        <span class="card-label">Compute</span>
        <p class="eff-text">
          No runtime style injection. No className hashing. No virtual DOM diffing for visual changes.
          CSS custom properties resolve in the browser's native C++ style engine. Theme changes
          update one <code>:root</code> block &mdash; the cascade propagates instantly.
        </p>
      </div>
      <div class="card">
        <span class="card-label">Network</span>
        <p class="eff-text">
          Styles are static <code>.css</code> files, generated at build time. No JS payload for
          theming. No style-extraction SSR pass. Fonts load via <code>font-display: swap</code>
          &mdash; text is visible immediately. Core is tree-shakeable to sub-kilobyte imports.
        </p>
      </div>
      <div class="card">
        <span class="card-label">LLM tokens</span>
        <p class="eff-text">
          A button is <code>&lt;button data-color="primary"&gt;</code>, not five nested divs
          with hashed class names. An LLM reading the DOM sees intent, not noise.
          Fewer tokens in, fewer tokens out, better results.
        </p>
      </div>
    </div>
  </div>

  <!-- data-* attributes -->
  <div class="subsection">
    <sg-heading level={3} size="lg">Readable markup</sg-heading>
    <sg-text size="lg" color="secondary" style="margin-bottom: var(--sg-space-5)">
      Variants live on the element as <code>data-*</code> attributes. No mapping layer. No
      runtime cost. Open DevTools and the intent is right there.
    </sg-text>

    <div class="phil-vs-grid">
      <div class="card">
        <span class="card-label" style="color: var(--sg-color-danger)">CSS-in-JS (2016)</span>
        <div class="dom-tree">
          <code class="dom-node dom-node--wrapper">&lt;div class="css-1a2b3c"&gt;</code>
          <code class="dom-node dom-node--wrapper" style="margin-left: var(--sg-space-4)">&lt;div class="css-4d5e6f"&gt;</code>
          <code class="dom-node dom-node--wrapper" style="margin-left: var(--sg-space-8)">&lt;div class="css-7g8h9i"&gt;</code>
          <code class="dom-node" style="margin-left: var(--sg-space-12)">&lt;button class="css-j0k1l2"&gt;</code>
          <code class="dom-node" style="margin-left: var(--sg-space-16)">Click me</code>
        </div>
        <span class="dom-count">5 nodes. Which div does what?</span>
      </div>
      <div class="card">
        <span class="card-label" style="color: var(--sg-color-success)">SigUI (2026)</span>
        <div class="dom-tree">
          <code class="dom-node">&lt;button data-color="primary" data-size="md"&gt;</code>
          <code class="dom-node" style="margin-left: var(--sg-space-4)">Click me</code>
        </div>
        <span class="dom-count">2 nodes. Self-documenting.</span>
      </div>
    </div>

    <div style="margin-top: var(--sg-space-5)">
      <sg-code-block
        title="CSS targets attributes directly"
        language="css"
        code={`[data-sigui="button"][data-color="primary"] {
  background: var(--sg-color-primary);
}
[data-sigui="button"][data-state="disabled"] {
  opacity: 0.5;
  pointer-events: none;
}
/* No generated classes. No hash. No runtime. */`}
      />
    </div>
  </div>

  <!-- Debuggable -->
  <div class="subsection">
    <sg-heading level={3} size="lg">Debuggable</sg-heading>
    <sg-text size="lg" color="secondary" style="margin-bottom: var(--sg-space-5)">
      When something looks wrong, the fix should be obvious. CSS custom properties
      show computed values in DevTools. <code>data-*</code> attributes show component state.
      <code>@layer</code> shows exactly which rule won and why.
    </sg-text>

    <div class="debug-grid">
      <div class="debug-row">
        <span class="debug-q">Why is this button blue?</span>
        <code class="debug-a">data-color="primary"</code>
      </div>
      <div class="debug-row">
        <span class="debug-q">What color is "primary"?</span>
        <code class="debug-a">--sg-color-primary: #6366f1</code>
      </div>
      <div class="debug-row">
        <span class="debug-q">Why does my override not apply?</span>
        <code class="debug-a">@layer sigui.overrides beats sigui.base</code>
      </div>
      <div class="debug-row">
        <span class="debug-q">Why is this disabled?</span>
        <code class="debug-a">data-state="disabled"</code>
      </div>
    </div>
  </div>

  <!-- Portable -->
  <div class="subsection">
    <sg-heading level={3} size="lg">Portable</sg-heading>
    <sg-text size="lg" color="secondary" style="margin-bottom: var(--sg-space-5)">
      The styling layer is plain CSS. The token layer is plain math. Only the component
      layer binds to Svelte &mdash; and even that uses standard HTML elements and attributes.
    </sg-text>

    <div class="port-grid">
      {#each [
        { target: "Svelte 5", how: "Native components with runes" },
        { target: "React / Vue", how: "Import CSS + use data-* attributes" },
        { target: "Web Components", how: "Custom elements inherit custom properties" },
        { target: "Vanilla HTML", how: "Link the stylesheet, add data attributes" },
        { target: "Server-side", how: "Generate tokens with @sig-ui/core &mdash; no DOM needed" },
        { target: "Figma / design tools", how: "Export W3C DTCG tokens, import into any tool" },
      ] as row}
        <div class="port-row">
          <span class="port-target">{row.target}</span>
          <span class="port-how">{row.how}</span>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  /* Timeline */
  .timeline {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--sg-gap-grouped);
  }

  .timeline-col {
    padding: var(--sg-space-5);
    border-radius: var(--sg-radius-lg);
    border: var(--sg-border-thin) solid var(--sg-color-border-default, var(--sg-color-border));
  }

  .timeline-col--past {
    opacity: 0.7;
  }

  .timeline-year {
    display: block;
    font-size: var(--sg-text-xl);
    font-weight: 700;
    margin-bottom: var(--sg-space-3);
  }

  .timeline-col--past .timeline-year {
    color: var(--sg-color-text-muted, var(--sg-color-text-secondary));
  }

  .timeline-col--now .timeline-year {
    color: var(--sg-color-action-primary, var(--sg-color-link));
  }

  .timeline-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--sg-gap-related);
    font-size: var(--sg-text-sm);
    color: var(--sg-color-text-muted, var(--sg-color-text-secondary));
  }

  /* Native dialog */
  .phil-dialog {
    border: var(--sg-border-thin) solid var(--sg-color-border-default, var(--sg-color-border));
    border-radius: var(--sg-radius-lg);
    padding: var(--sg-pad-card, 1.5rem);
    max-width: 420px;
    background: var(--sg-color-bg-primary, var(--sg-bg));
    color: var(--sg-color-text-primary, var(--sg-color-text));
  }

  .phil-dialog::backdrop {
    background: oklch(0 0 0 / 0.4);
  }

  .phil-vs-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--sg-gap-grouped);
  }

  .phil-checklist {
    list-style: none;
    padding: 0;
    margin: var(--sg-space-2) 0 0;
    display: flex;
    flex-direction: column;
    gap: var(--sg-space-1-5);
  }

  .phil-checklist li {
    font-size: var(--sg-text-sm);
    color: var(--sg-color-text-muted, var(--sg-color-text-secondary));
  }

  .phil-checklist code {
    font-size: 0.75em;
    background: var(--sg-color-bg-secondary, var(--sg-surface-container-high));
    padding: var(--sg-space-px) var(--sg-space-1-5);
    border-radius: var(--sg-radius-sm);
  }

  /* Progressive enhancement */
  .phil-enhance-stack {
    display: flex;
    flex-direction: column;
    gap: var(--sg-gap-related);
  }

  .phil-enhance-row {
    display: grid;
    grid-template-columns: 140px 1fr auto;
    align-items: center;
    gap: var(--sg-space-3);
    padding: var(--sg-pad-button-y, 0.75rem) var(--sg-pad-button-x, 1rem);
    background: var(--sg-color-bg-primary, var(--sg-bg));
    border: var(--sg-border-thin) solid var(--sg-color-border-default, var(--sg-color-border));
    border-radius: var(--sg-radius-md);
    font-size: var(--sg-text-sm);
  }

  .phil-enhance-name {
    font-weight: var(--sg-weight-semibold);
    color: var(--sg-color-text-primary, var(--sg-color-text));
  }

  .phil-enhance-cells {
    display: flex;
    gap: var(--sg-gap-grouped);
  }

  .phil-enhance-modern {
    color: var(--sg-color-success);
    font-size: var(--sg-text-sm);
  }

  .phil-enhance-fallback {
    color: var(--sg-color-text-muted, var(--sg-color-text-secondary));
    font-size: var(--sg-text-sm);
  }

  .phil-enhance-gate {
    font-size: var(--sg-text-xs);
    color: var(--sg-color-text-muted, var(--sg-color-text-secondary));
    opacity: 0.7;
  }

  /* CSS layers */
  .phil-layers {
    display: flex;
    flex-direction: column;
    gap: var(--sg-space-1-5);
  }

  .phil-layer-row {
    display: flex;
    align-items: center;
    gap: var(--sg-space-3);
    padding: var(--sg-space-2) var(--sg-space-3);
    background: var(--sg-color-bg-primary, var(--sg-bg));
    border: var(--sg-border-thin) solid var(--sg-color-border-default, var(--sg-color-border));
    border-radius: var(--sg-radius-md);
    transition: background var(--sg-duration-fast);
  }

  .phil-layer-row:hover {
    background: var(--sg-color-bg-secondary, var(--sg-surface-container-high));
  }

  .phil-layer-num {
    font-size: var(--sg-text-xs);
    font-weight: var(--sg-weight-bold);
    color: var(--sg-color-action-primary, var(--sg-color-link));
    min-width: var(--sg-space-4);
  }

  /* Dependency grid */
  .dep-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--sg-gap-related);
  }

  .dep-card {
    display: flex;
    flex-direction: column;
    gap: var(--sg-space-1-5);
    padding: var(--sg-space-4);
    border-radius: var(--sg-radius-md);
    border: var(--sg-border-thin) solid var(--sg-color-border-default, var(--sg-color-border));
  }

  .dep-pkg {
    font-size: var(--sg-text-sm);
    font-weight: 600;
  }

  .dep-count {
    font-size: var(--sg-text-xl);
    font-weight: 700;
  }

  .dep-card--zero .dep-count {
    color: var(--sg-color-success);
  }

  .dep-card--peer .dep-count {
    color: var(--sg-color-action-primary, var(--sg-color-link));
  }

  .dep-desc {
    font-size: var(--sg-text-xs);
    color: var(--sg-color-text-muted, var(--sg-color-text-secondary));
    line-height: 1.5;
  }

  .dep-external {
    padding: var(--sg-space-4);
    border: var(--sg-border-thin) solid var(--sg-color-border-default, var(--sg-color-border));
    border-radius: var(--sg-radius-md);
  }

  .dep-ext-list {
    display: flex;
    flex-direction: column;
    gap: var(--sg-gap-related);
    margin-top: var(--sg-space-3);
  }

  .dep-ext-row {
    display: flex;
    align-items: baseline;
    gap: var(--sg-space-3);
    font-size: var(--sg-text-sm);
    color: var(--sg-color-text-muted, var(--sg-color-text-secondary));
  }

  .dep-ext-row code {
    flex-shrink: 0;
    font-size: var(--sg-text-xs);
    background: var(--sg-color-bg-secondary, var(--sg-surface-container-high));
    padding: var(--sg-space-px) var(--sg-space-1-5);
    border-radius: var(--sg-radius-sm);
  }

  .dep-ext-note {
    font-size: var(--sg-text-xs);
    color: var(--sg-color-text-muted, var(--sg-color-text-secondary));
    margin-top: var(--sg-space-3);
    line-height: 1.5;
  }

  /* Stack layers */
  .stack-layers {
    display: flex;
    flex-direction: column;
    gap: var(--sg-space-1-5);
  }

  .stack-row {
    display: flex;
    align-items: center;
    gap: var(--sg-space-3);
    padding: var(--sg-space-2-5) var(--sg-space-4);
    border: var(--sg-border-thin) solid var(--sg-color-border-default, var(--sg-color-border));
    border-radius: var(--sg-radius-md);
    transition: background var(--sg-duration-fast);
  }

  .stack-row:hover {
    background: var(--sg-color-bg-secondary, var(--sg-surface-container-high));
  }

  .stack-num {
    font-size: var(--sg-text-xs);
    font-weight: 700;
    color: var(--sg-color-action-primary, var(--sg-color-link));
    min-width: var(--sg-space-4);
  }

  .stack-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--sg-gap-micro);
  }

  .stack-name {
    font-size: var(--sg-text-sm);
    font-weight: 600;
  }

  .stack-detail {
    font-size: var(--sg-text-xs);
    color: var(--sg-color-text-muted, var(--sg-color-text-secondary));
  }

  .stack-pkg {
    font-size: var(--sg-text-xs);
    color: var(--sg-color-text-muted, var(--sg-color-text-secondary));
    flex-shrink: 0;
  }

  .section-note {
    font-size: var(--sg-text-sm);
    color: var(--sg-color-text-muted, var(--sg-color-text-secondary));
    line-height: 1.6;
  }

  /* Efficiency grid */
  .eff-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--sg-gap-related);
  }

  .eff-text {
    font-size: var(--sg-text-sm);
    color: var(--sg-color-text-muted, var(--sg-color-text-secondary));
    line-height: 1.6;
    margin: var(--sg-space-2) 0 0;
  }

  .eff-text code {
    font-size: 0.85em;
    background: var(--sg-color-bg-secondary, var(--sg-surface-container-high));
    padding: var(--sg-space-px) var(--sg-space-1-5);
    border-radius: var(--sg-radius-sm);
  }

  /* Readable markup */
  .dom-tree {
    display: flex;
    flex-direction: column;
    gap: var(--sg-gap-tight);
    margin: var(--sg-space-3) 0 var(--sg-space-2);
    font-size: var(--sg-text-xs);
  }

  .dom-node {
    color: var(--sg-color-text-default, var(--sg-color-text));
  }

  .dom-node--wrapper {
    color: var(--sg-color-text-muted, var(--sg-color-text-secondary));
    opacity: 0.6;
  }

  .dom-count {
    font-size: var(--sg-text-xs);
    color: var(--sg-color-text-muted, var(--sg-color-text-secondary));
    font-style: italic;
  }

  /* Debug grid */
  .debug-grid {
    display: flex;
    flex-direction: column;
    gap: var(--sg-gap-related);
  }

  .debug-row {
    display: flex;
    align-items: center;
    gap: var(--sg-gap-grouped);
    padding: var(--sg-space-2-5) var(--sg-space-4);
    border: var(--sg-border-thin) solid var(--sg-color-border-default, var(--sg-color-border));
    border-radius: var(--sg-radius-md);
  }

  .debug-q {
    font-size: var(--sg-text-sm);
    color: var(--sg-color-text-muted, var(--sg-color-text-secondary));
    min-width: 260px;
  }

  .debug-a {
    font-size: var(--sg-text-xs);
    color: var(--sg-color-action-primary, var(--sg-color-link));
  }

  /* Portable grid */
  .port-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--sg-gap-related);
  }

  .port-row {
    display: flex;
    flex-direction: column;
    gap: var(--sg-gap-tight);
    padding: var(--sg-pad-button-y, 0.75rem) var(--sg-pad-button-x, 1rem);
    border: var(--sg-border-thin) solid var(--sg-color-border-default, var(--sg-color-border));
    border-radius: var(--sg-radius-md);
  }

  .port-target {
    font-size: var(--sg-text-sm);
    font-weight: 600;
  }

  .port-how {
    font-size: var(--sg-text-xs);
    color: var(--sg-color-text-muted, var(--sg-color-text-secondary));
  }

  @media (max-width: 768px) {
    .timeline { grid-template-columns: 1fr; }
    .phil-vs-grid { grid-template-columns: 1fr; }
    .phil-enhance-row { grid-template-columns: 1fr; gap: var(--sg-gap-tight); }
    .dep-grid { grid-template-columns: 1fr 1fr; }
    .eff-grid { grid-template-columns: 1fr; }
    .port-grid { grid-template-columns: 1fr; }
    .debug-row { flex-direction: column; align-items: flex-start; gap: var(--sg-gap-tight); }
    .debug-q { min-width: unset; }
  }
</style>
