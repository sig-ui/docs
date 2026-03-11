<script lang="ts">
  import {
    getDurationScale,
    getScaledDurationScale,
    computeDuration,
    getEasingCurves,
    easingToCss,
    getSpringPresets,
    computeSpringDuration,
    springToLinear,
    getReducedMotionAlternative,
    getAllTransitionPresets,
    computeStaggerDelay,
  } from "../../../packages/core/src/index.js";
  import { round } from "../utils.ts";
  // Motion Presets
  const PRESETS = {
    instant:  { scale: 0.05, spring: "snappy",  label: "Instant" },
    snappy:   { scale: 0.5,  spring: "snappy",  label: "Snappy" },
    smooth:   { scale: 1.0,  spring: "default", label: "Smooth" },
    playful:  { scale: 1.3,  spring: "bouncy",  label: "Playful" },
  } as const;

  type PresetName = keyof typeof PRESETS;

  let presetCompareA = $state<PresetName>("smooth");
  let presetCompareB = $state<PresetName>("snappy");
  let presetPlaying = $state(false);

  let baseDurations = getDurationScale();

  let scaledA = $derived(getScaledDurationScale(baseDurations, PRESETS[presetCompareA].scale));
  let scaledB = $derived(getScaledDurationScale(baseDurations, PRESETS[presetCompareB].scale));

  function playPresetCompare() {
    presetPlaying = false;
    requestAnimationFrame(() => { presetPlaying = true; });
    const maxDur = Math.max(
      scaledA.slower ?? 500,
      scaledB.slower ?? 500,
    );
    setTimeout(() => { presetPlaying = false; }, maxDur + 200);
  }

  // Duration Scale
  let durationScale = getDurationScale();

  // Distance-based Duration
  let distance = $state(100);
  let computedDuration = $derived(computeDuration(distance));

  // Easing Curves
  let easingCurves = getEasingCurves();
  let playingEasing: string | null = $state(null);

  function playEasing(name: string) {
    playingEasing = name;
    setTimeout(() => { playingEasing = null; }, 1000);
  }

  // Spring Presets
  let springPresets = getSpringPresets();
  let playingSpring: string | null = $state(null);

  function playSpring(name: string) {
    playingSpring = name;
    const duration = computeSpringDuration(springPresets[name as keyof typeof springPresets]);
    setTimeout(() => { playingSpring = null; }, duration + 100);
  }

  // Transition Presets
  let transitionPresets = getAllTransitionPresets();
  let playingTransition: string | null = $state(null);

  function playTransition(name: string) {
    playingTransition = name;
    setTimeout(() => { playingTransition = null; }, 800);
  }

  // Stagger
  let staggerCount = $state(8);
  let staggerDelay = $state(50);
  let staggerPlaying = $state(false);

  function playStagger() {
    staggerPlaying = true;
    const totalDuration = computeStaggerDelay(staggerCount - 1, staggerDelay) + 300;
    setTimeout(() => { staggerPlaying = false; }, totalDuration + 200);
  }

  // Reduced Motion
  const motionTypes = ["fade", "slide-up", "scale", "expand"] as const;
</script>

<sg-section id="motion" title="Motion System" description="Duration tokens, easing curves, spring presets, transition patterns, and reduced motion alternatives - all grounded in perceptual timing research.">

    <!-- Motion Presets -->
    <div class="subsection">
      <sg-heading level={3}>Motion Presets</sg-heading>
      <sg-text size="sm" color="secondary">
        Four presets scale every duration token via <code>--sg-duration-scalar</code>.
        The sidebar's motion toggle applies <code>data-motion</code> to the root element,
        changing all animations site-wide. Compare any two presets below.
      </sg-text>

      <div class="preset-overview">
        {#each Object.entries(PRESETS) as [key, preset]}
          {@const scaled = getScaledDurationScale(baseDurations, preset.scale)}
          <div class="preset-card" class:active={key === presetCompareA || key === presetCompareB}>
            <span class="preset-name">{preset.label}</span>
            <code class="preset-scalar">{preset.scale}x</code>
            <span class="preset-spring">{preset.spring} spring</span>
            <div class="preset-tokens">
              <span>fast: {scaled.fast}ms</span>
              <span>normal: {scaled.normal}ms</span>
              <span>slow: {scaled.slow}ms</span>
            </div>
          </div>
        {/each}
      </div>

      <div class="preset-compare">
        <div class="preset-compare-controls">
          <div class="preset-compare-select">
            <label>
              A
              <select value={presetCompareA}>
                {#each Object.entries(PRESETS) as [key, p]}
                  <option value={key}>{p.label} ({p.scale}x)</option>
                {/each}
              </select>
            </label>
            <label>
              B
              <select value={presetCompareB}>
                {#each Object.entries(PRESETS) as [key, p]}
                  <option value={key}>{p.label} ({p.scale}x)</option>
                {/each}
              </select>
            </label>
          </div>
          <button class="sg-button" data-size="sm" onclick={playPresetCompare}>Compare</button>
        </div>

        <div class="preset-compare-tracks">
          {#each Object.entries(baseDurations) as [name, _ms]}
            {@const msA = scaledA[name as keyof typeof scaledA]}
            {@const msB = scaledB[name as keyof typeof scaledB]}
            <div class="compare-row">
              <span class="compare-label">{name}</span>
              <div class="compare-track">
                <div
                  class="compare-bar a"
                  class:playing={presetPlaying}
                  style="transition: transform {msA}ms var(--sg-ease-default, ease-out)"
                ></div>
                <div
                  class="compare-bar b"
                  class:playing={presetPlaying}
                  style="transition: transform {msB}ms var(--sg-ease-default, ease-out)"
                ></div>
              </div>
              <span class="compare-ms">{msA}ms / {msB}ms</span>
            </div>
          {/each}
        </div>
        <div class="preset-compare-legend">
          <span class="legend-a">{PRESETS[presetCompareA].label}</span>
          <span class="legend-b">{PRESETS[presetCompareB].label}</span>
        </div>
      </div>

      <div class="preset-config-example">
        <sg-heading level={4}>Config</sg-heading>
        <pre><code>{`// sigui.config.ts
export default {
  brand: "#2563eb",
  motion: "snappy",           // string shorthand
  // or fine-grained:
  motion: {
    preset: "smooth",
    durationScale: 0.8,       // custom multiplier
    defaultSpring: "gentle",  // override spring feel
    reducedMotion: "crossfade",
  },
};`}</code></pre>
      </div>
    </div>

    <!-- Duration Scale -->
    <div class="subsection">
      <sg-heading level={3}>Duration Scale</sg-heading>
      <div class="duration-grid">
        {#each Object.entries(durationScale) as [name, ms]}
          <div class="duration-row">
            <span class="duration-name">{name}</span>
            <span class="duration-value">{ms}ms</span>
            <div class="duration-bar-track">
              <div class="duration-bar" style="width: {(ms / 500) * 100}%; transition: width {ms}ms ease-out"></div>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Distance-based Duration -->
    <div class="subsection">
      <sg-heading level={3}>Distance-based Duration</sg-heading>
      <div class="controls">
        <div class="control-group" style="min-width: 250px">
          <input class="sg-slider" type="range" min={0} max={500} step={10} value={distance} oninput={(e) => { const el = e.currentTarget as any; distance = (el.value ?? distance); }} onchange={(e) => { const el = e.currentTarget as any; distance = (el.value ?? distance); }} onclick={(e) => { const el = e.currentTarget as any; distance = (el.value ?? distance); }} ontoggle={(e) => { const el = e.currentTarget as any; distance = (el.value ?? distance); }} />
        </div>
        <div class="control-group">
          <span class="card-label">Computed Duration</span>
          <span class="info-value" style="font-size: var(--sg-text-xl); font-weight: var(--sg-weight-semibold)">{computedDuration}ms</span>
        </div>
      </div>
      <p style="color: var(--text-3); font-size: var(--sg-text-sm)">
        Uses sublinear square-root scaling: doubling distance only increases duration by ~1.41x.
      </p>
    </div>

    <!-- Easing Curves -->
    <div class="subsection">
      <sg-heading level={3}>Easing Curves</sg-heading>
      <div class="easing-grid">
        {#each Object.entries(easingCurves) as [name, points]}
          {@const [x1, y1, x2, y2] = points}
          <div class="easing-card" onclick={() => playEasing(name)}>
            <svg viewBox="-0.1 -0.3 1.2 1.6" class="easing-svg">
              <line x1="0" y1="1" x2="1" y2="0" stroke="oklch(1 0 0 / 0.06)" stroke-width="0.02" />
              <path
                d="M 0,1 C {x1},{1-y1} {x2},{1-y2} 1,0"
                fill="none"
                stroke="var(--sg-color-emphasis)"
                stroke-width="0.03"
              />
              <circle cx="0" cy="1" r="0.04" fill="var(--sg-color-emphasis)" />
              <circle cx="1" cy="0" r="0.04" fill="var(--sg-color-emphasis)" />
            </svg>
            <div class="easing-info">
              <span class="easing-name">{name}</span>
              <code class="easing-css">{easingToCss(name as any)}</code>
            </div>
            <div class="easing-ball-track">
              <div
                class="easing-ball"
                class:playing={playingEasing === name}
                style="transition: transform 800ms {easingToCss(name as any)}"
              ></div>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Spring Presets -->
    <div class="subsection">
      <sg-heading level={3}>Spring Presets</sg-heading>
      <div class="spring-grid">
        {#each Object.entries(springPresets) as [name, config]}
          {@const duration = computeSpringDuration(config)}
          {@const linear = springToLinear(config, 32)}
          <div class="spring-card">
            <sg-heading level={4}>{name}</sg-heading>
            <div class="spring-params">
              <span>stiffness: {config.stiffness}</span>
              <span>damping: {config.damping}</span>
              <span>mass: {config.mass}</span>
              <span>~{duration}ms</span>
            </div>
            <button class="sg-button" data-size="sm" onclick={() => playSpring(name)}>Play</button>
            <div class="spring-ball-track">
              <div
                class="spring-ball"
                class:playing={playingSpring === name}
                style="transition: transform {duration}ms {linear}"
              ></div>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Transition Presets -->
    <div class="subsection">
      <sg-heading level={3}>Transition Presets</sg-heading>
      <div class="transition-grid">
        {#each Object.entries(transitionPresets) as [name, config]}
          <div class="transition-card" onclick={() => playTransition(name)}>
            <span class="transition-name">{name}</span>
            <span class="transition-details">{config.duration}ms / {config.property}</span>
            <code class="transition-css">{config.css}</code>
            <div
              class="transition-demo-box"
              class:playing={playingTransition === name}
              style="transition: {config.css}"
            ></div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Stagger Delay -->
    <div class="subsection">
      <sg-heading level={3}>Stagger Delay</sg-heading>
      <div class="controls">
        <div class="control-group" style="min-width: 180px">
          <input class="sg-slider" type="range" min={3} max={12} step={1} value={staggerCount} oninput={(e) => { const el = e.currentTarget as any; staggerCount = (el.value ?? staggerCount); }} onchange={(e) => { const el = e.currentTarget as any; staggerCount = (el.value ?? staggerCount); }} onclick={(e) => { const el = e.currentTarget as any; staggerCount = (el.value ?? staggerCount); }} ontoggle={(e) => { const el = e.currentTarget as any; staggerCount = (el.value ?? staggerCount); }} />
        </div>
        <div class="control-group" style="min-width: 180px">
          <input class="sg-slider" type="range" min={20} max={100} step={10} value={staggerDelay} oninput={(e) => { const el = e.currentTarget as any; staggerDelay = (el.value ?? staggerDelay); }} onchange={(e) => { const el = e.currentTarget as any; staggerDelay = (el.value ?? staggerDelay); }} onclick={(e) => { const el = e.currentTarget as any; staggerDelay = (el.value ?? staggerDelay); }} ontoggle={(e) => { const el = e.currentTarget as any; staggerDelay = (el.value ?? staggerDelay); }} />
        </div>
        <button class="sg-button" onclick={playStagger}>Play</button>
      </div>
      <div class="stagger-grid">
        {#each Array(staggerCount) as _, i}
          {@const delay = computeStaggerDelay(i, staggerDelay)}
          <div
            class="stagger-item"
            class:playing={staggerPlaying}
            style="transition-delay: {delay}ms"
          >
            <span>{delay}ms</span>
          </div>
        {/each}
      </div>
    </div>

    <!-- Reduced Motion -->
    <div class="subsection">
      <sg-heading level={3}>Reduced Motion Alternatives</sg-heading>
      <div class="reduced-motion-table">
        <div class="reduced-motion-header">
          <span>Transition</span>
          <span>Reduced Alternative</span>
        </div>
        {#each motionTypes as type}
          {@const alt = getReducedMotionAlternative(type)}
          <div class="reduced-motion-row">
            <code>{type}</code>
            <span>{alt ? `${alt.strategy}: ${alt.durationOverride}ms` : 'no alternative'}</span>
          </div>
        {/each}
      </div>
    </div>
</sg-section>

<style>
/* ===== MOTION SECTION ===== */

/* --- Preset Overview --- */

.preset-overview {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--sg-space-3);
  margin: var(--sg-space-4) 0;
}

.preset-card {
  background: var(--surface);
  border: var(--sg-border-thin) solid var(--sg-color-border);
  border-radius: var(--radius-sm);
  padding: var(--sg-space-4);
  transition: border-color var(--sg-duration-fast);
}

.preset-card.active {
  border-color: var(--sg-color-link);
}

.preset-name {
  display: block;
  font-size: var(--sg-text-sm);
  font-weight: var(--sg-weight-semibold);
  margin-bottom: var(--sg-space-1);
}

.preset-scalar {
  display: inline-block;
  font-size: var(--sg-text-xs);
  background: oklch(from var(--sg-color-link) l c h / 0.1);
  color: var(--sg-color-link);
  padding: 0.1em 0.5em;
  border-radius: var(--radius-xs);
  margin-bottom: var(--sg-space-1);
}

.preset-spring {
  display: block;
  font-size: var(--sg-text-xs);
  color: var(--text-3);
  margin-bottom: var(--sg-space-2);
}

.preset-tokens {
  display: flex;
  flex-direction: column;
  gap: var(--sg-gap-micro);
  font-size: var(--sg-text-xs);
  color: var(--text-3);
  font-family: var(--sg-font-mono);
}

/* --- Preset Comparison --- */

.preset-compare {
  margin: var(--sg-space-4) 0;
  background: var(--surface);
  border: var(--sg-border-thin) solid var(--sg-color-border);
  border-radius: var(--radius-sm);
  padding: var(--sg-space-4);
}

.preset-compare-controls {
  display: flex;
  align-items: center;
  gap: var(--sg-gap-grouped);
  margin-bottom: var(--sg-space-4);
}

.preset-compare-select {
  display: flex;
  gap: var(--sg-space-3);
}

.preset-compare-select label {
  display: flex;
  align-items: center;
  gap: var(--sg-gap-related);
  font-size: var(--sg-text-sm);
  font-weight: var(--sg-weight-semibold);
  color: var(--sg-color-text-secondary);
}

.preset-compare-select select {
  font-size: var(--sg-text-sm);
  padding: var(--sg-space-1) var(--sg-space-2);
  border: var(--sg-border-thin) solid var(--sg-color-border);
  border-radius: var(--radius-xs);
  background: var(--surface);
  color: var(--text-1);
}

.preset-compare-tracks {
  display: flex;
  flex-direction: column;
  gap: var(--sg-gap-related);
}

.compare-row {
  display: grid;
  grid-template-columns: 70px 1fr 100px;
  align-items: center;
  gap: var(--sg-space-3);
}

.compare-label {
  font-size: var(--sg-text-xs);
  color: var(--text-3);
  font-family: var(--sg-font-mono);
}

.compare-track {
  height: 20px;
  position: relative;
  background: var(--sg-surface-container-high);
  border-radius: var(--radius-xs);
  overflow: hidden;
  container-type: inline-size;
}

.compare-bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 50%;
  width: 16px;
  border-radius: var(--radius-xs);
  transform: translateX(0);
}

.compare-bar.a {
  background: var(--sg-color-link);
}

.compare-bar.b {
  top: 50%;
  background: var(--sg-color-primary-subtle);
}

.compare-bar.playing {
  transform: translateX(calc(100cqi - 16px));
}

.compare-ms {
  font-size: var(--sg-text-xs);
  color: var(--text-3);
  font-family: var(--sg-font-mono);
  text-align: right;
}

.preset-compare-legend {
  display: flex;
  gap: var(--sg-gap-grouped);
  margin-top: var(--sg-space-3);
  font-size: var(--sg-text-xs);
}

.legend-a::before,
.legend-b::before {
  content: "";
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 2px;
  margin-right: var(--sg-space-1);
  vertical-align: middle;
}

.legend-a::before { background: var(--sg-color-link); }
.legend-b::before { background: var(--sg-color-primary-subtle); }

/* --- Preset Config Example --- */

.preset-config-example {
  margin-top: var(--sg-space-4);
}

.preset-config-example pre {
  background: var(--surface);
  border: var(--sg-border-thin) solid var(--sg-color-border);
  border-radius: var(--radius-sm);
  padding: var(--sg-space-4);
  font-size: var(--sg-text-xs);
  font-family: var(--sg-font-mono);
  overflow-x: auto;
  color: var(--sg-color-text-secondary);
  margin-top: var(--sg-space-2);
}

@media (max-width: 768px) {
  .preset-overview {
    grid-template-columns: repeat(2, 1fr);
  }
}

.duration-grid {
  display: flex;
  flex-direction: column;
  gap: var(--sg-gap-related);
}

.duration-row {
  display: grid;
  grid-template-columns: 80px 60px 1fr;
  align-items: center;
  gap: var(--sg-gap-grouped);
}

.duration-name {
  font-size: var(--sg-text-sm);
  color: var(--sg-color-text-secondary);
}

.duration-value {
  font-size: var(--sg-text-xs);
  color: var(--text-3);
  font-family: var(--sg-font-mono);
}

.duration-bar-track {
  height: 8px;
  background: var(--sg-surface-container-high);
  border-radius: var(--sg-radius-sm);
  overflow: hidden;
}

.duration-bar {
  height: 100%;
  background: var(--sg-color-link);
  border-radius: var(--sg-radius-sm);
}

.easing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--sg-gap-grouped);
}

.easing-card {
  background: var(--surface);
  border: 1px solid var(--sg-color-border);
  border-radius: var(--radius-sm);
  padding: var(--sg-space-4);
  cursor: pointer;
  transition: border-color var(--sg-duration-fast);
}

.easing-card:hover {
  border-color: var(--border-hover);
}

.easing-svg {
  width: 100%;
  height: 80px;
  margin-bottom: var(--sg-space-2);
}

.easing-info {
  margin-bottom: var(--sg-space-2);
}

.easing-name {
  display: block;
  font-size: var(--sg-text-sm);
  font-weight: var(--sg-weight-semibold);
  margin-bottom: var(--sg-space-0\.5);
}

.easing-css {
  font-size: var(--sg-text-xs);
  color: var(--text-3);
}

.easing-ball-track {
  height: 16px;
  background: var(--sg-surface-container-high);
  border-radius: var(--sg-radius-md);
  position: relative;
  overflow: hidden;
}

.easing-ball {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--sg-color-link);
  position: absolute;
  left: 0;
  transform: translateX(0);
}

.easing-ball.playing {
  transform: translateX(calc(100% + 140px));
}

.spring-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--sg-gap-grouped);
}

.spring-card {
  background: var(--surface);
  border: 1px solid var(--sg-color-border);
  border-radius: var(--radius-sm);
  padding: var(--sg-space-4);
}

.spring-card h4 {
  font-size: var(--sg-text-sm);
  font-weight: var(--sg-weight-semibold);
  margin-bottom: var(--sg-space-2);
  text-transform: capitalize;
}

.spring-params {
  display: flex;
  flex-direction: column;
  gap: var(--sg-space-0\.5);
  font-size: var(--sg-text-xs);
  color: var(--text-3);
  font-family: var(--sg-font-mono);
  margin-bottom: var(--sg-space-3);
}

.spring-ball-track {
  height: 16px;
  background: var(--sg-surface-container-high);
  border-radius: var(--sg-radius-md);
  position: relative;
  margin-top: var(--sg-space-3);
}

.spring-ball {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--sg-color-emphasis);
  position: absolute;
  left: 0;
  transform: translateX(0);
}

.spring-ball.playing {
  transform: translateX(calc(100% + 80px));
}

.transition-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--sg-space-3);
}

.transition-card {
  background: var(--surface);
  border: 1px solid var(--sg-color-border);
  border-radius: var(--radius-sm);
  padding: var(--sg-space-4);
  cursor: pointer;
}

.transition-card:hover {
  border-color: var(--border-hover);
}

.transition-name {
  display: block;
  font-size: var(--sg-text-sm);
  font-weight: var(--sg-weight-semibold);
  margin-bottom: var(--sg-space-1);
}

.transition-details {
  display: block;
  font-size: var(--sg-text-xs);
  color: var(--text-3);
  margin-bottom: var(--sg-space-1);
}

.transition-css {
  display: block;
  font-size: var(--sg-text-xs);
  color: var(--text-3);
  margin-bottom: var(--sg-space-3);
  word-break: break-all;
}

.transition-demo-box {
  height: 24px;
  background: var(--sg-color-link);
  border-radius: var(--sg-radius-sm);
  width: 40%;
  opacity: 1;
}

.transition-demo-box.playing {
  width: 100%;
  opacity: 0.5;
}

.stagger-grid {
  display: flex;
  gap: var(--sg-gap-related);
  margin-top: var(--sg-space-4);
}

.stagger-item {
  flex: 1;
  height: 60px;
  background: var(--surface);
  border: var(--sg-border-thin) solid var(--sg-color-border);
  border-radius: var(--radius-xs);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--sg-text-xs);
  color: var(--text-3);
  font-family: var(--sg-font-mono);
  transition: transform var(--sg-duration-moderate) var(--sg-ease-default), opacity var(--sg-duration-moderate) var(--sg-ease-default), background var(--sg-duration-moderate) var(--sg-ease-default);
  transform: translateY(0);
  opacity: 1;
}

.stagger-item.playing {
  background: oklch(from var(--sg-color-link) l c h / 0.15);
  border-color: var(--sg-color-link);
  transform: translateY(-8px);
}

.reduced-motion-table {
  margin-top: var(--sg-space-4);
}

.reduced-motion-header {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--sg-gap-grouped);
  padding: var(--sg-space-2) 0;
  border-bottom: var(--sg-border-medium) solid var(--sg-color-border);
  font-weight: var(--sg-weight-semibold);
  font-size: var(--sg-text-xs);
  text-transform: uppercase;
  letter-spacing: var(--sg-tracking-caps);
  color: var(--text-3);
}

.reduced-motion-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--sg-gap-grouped);
  padding: var(--sg-space-2) 0;
  border-bottom: var(--sg-border-thin) solid var(--sg-color-border);
  font-size: var(--sg-text-sm);
  color: var(--sg-color-text-secondary);
}

@media (max-width: 768px) {
  .spring-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
