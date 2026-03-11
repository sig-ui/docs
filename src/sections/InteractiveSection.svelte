<script lang="ts">
  import {
    getFocusRingConfig,
    getFocusRingCSS,
    getStateLayerOpacity,
    getStateLayerColor,
    getCursorTokens,
    getValidationVisual,
    selectLoadingStrategy,
    getSkeletonConfig,
  } from "../../../packages/core/src/index.js";
  import { round } from "../utils.ts";
  // Focus Ring
  let focusConfig = getFocusRingConfig();
  let focusCss = getFocusRingCSS();

  // State Layers
  const interactionStates = ["hover", "focus", "pressed", "dragged"] as const;
  let activeState: typeof interactionStates[number] | null = $state(null);

  // Cursor Tokens
  let cursorTokens = getCursorTokens();

  // Validation
  const validationStates = ["neutral", "valid", "invalid"] as const;

  // Loading Strategy
  let loadDuration = $state(2000);
  let strategy = $derived(selectLoadingStrategy(loadDuration));
</script>

<sg-section id="interactive" title="Interactive States" description="Focus indicators, state layers, cursor semantics, validation visuals, and loading strategies - all spec-compliant and accessible.">

    <!-- Focus Ring -->
    <div class="subsection">
      <sg-heading level={3}>Focus Ring</sg-heading>
      <div class="focus-demo">
        <p style="color: var(--text-3); font-size: var(--sg-text-sm); margin-bottom: var(--sg-space-4)">
          Tab to these elements to see the focus ring. Config: offset {focusConfig.offset}, width {focusConfig.width}, color {focusConfig.color}.
        </p>
        <div class="focus-demo-row">
          <button class="focus-target" style="{focusCss}">Button</button>
          <a href="#interactive" class="focus-target" style="{focusCss}">Link</a>
          <input type="text" class="focus-target" placeholder="Input" style="{focusCss}" />
        </div>
      </div>
    </div>

    <!-- State Layers -->
    <div class="subsection">
      <sg-heading level={3}>State Layers</sg-heading>
      <div class="state-layer-demo">
        <div class="state-layer-grid">
          {#each interactionStates as state}
            {@const opacity = getStateLayerOpacity(state)}
            {@const color = getStateLayerColor(state)}
            <div
              class="state-layer-card"
              class:active={activeState === state}
              onmouseenter={() => activeState = state}
              onmouseleave={() => activeState = null}
            >
              <div class="state-layer-overlay" style="background: {color}; opacity: {opacity}"></div>
              <span class="state-layer-name">{state}</span>
              <span class="state-layer-value">{round(opacity * 100, 0)}%</span>
            </div>
          {/each}
        </div>
        <div class="state-priority-table">
          <sg-heading level={4}>State Priority (highest to lowest)</sg-heading>
          <ol>
            <li>Focus-visible</li>
            <li>Pressed/Active</li>
            <li>Dragged</li>
            <li>Hover</li>
          </ol>
        </div>
      </div>
    </div>

    <!-- Cursor Tokens -->
    <div class="subsection">
      <sg-heading level={3}>Cursor Tokens</sg-heading>
      <div class="cursor-grid">
        {#each Object.entries(cursorTokens) as [name, value]}
          <div class="cursor-card" style="cursor: {value}">
            <span class="cursor-name">{name}</span>
            <span class="cursor-value">{value}</span>
          </div>
        {/each}
      </div>
    </div>

    <!-- Validation States -->
    <div class="subsection">
      <sg-heading level={3}>Validation States</sg-heading>
      <div class="validation-grid">
        {#each validationStates as state}
          {@const visual = getValidationVisual(state)}
          <div class="validation-card">
            <sg-heading level={4} style="text-transform: capitalize">{state}</sg-heading>
            <div class="validation-input" style="border-color: {visual.borderColor}; background: {visual.background ?? 'transparent'}">
              <span style="color: {visual.borderColor}">{visual.icon}</span>
              <span>Sample input</span>
            </div>
            <span class="validation-message" style="color: {visual.borderColor}">
              {state === 'invalid' ? 'This field is required' : state === 'valid' ? 'Looks good!' : 'Enter a value'}
            </span>
          </div>
        {/each}
      </div>
    </div>

    <!-- Loading Strategies -->
    <div class="subsection">
      <sg-heading level={3}>Loading Strategies</sg-heading>
      <div class="controls">
        <div class="control-group" style="min-width: 250px">
          <input class="sg-slider" type="range" min={100} max={10000} step={100} value={loadDuration} oninput={(e) => { const el = e.currentTarget as any; loadDuration = (el.value ?? loadDuration); }} onchange={(e) => { const el = e.currentTarget as any; loadDuration = (el.value ?? loadDuration); }} onclick={(e) => { const el = e.currentTarget as any; loadDuration = (el.value ?? loadDuration); }} ontoggle={(e) => { const el = e.currentTarget as any; loadDuration = (el.value ?? loadDuration); }} />
        </div>
        <div class="control-group">
          <span class="card-label">Recommended Strategy</span>
          <span class="info-value" style="font-size: var(--sg-text-xl); font-weight: var(--sg-weight-semibold)">{strategy}</span>
        </div>
      </div>
      <div class="loading-strategies">
        <div class="loading-card" class:active-strategy={strategy === "spinner"}>
          <sg-heading level={4}>Spinner</sg-heading>
          <p>Short waits (&lt;1s)</p>
          <div class="spinner-demo"></div>
        </div>
        <div class="loading-card" class:active-strategy={strategy === "skeleton"}>
          <sg-heading level={4}>Skeleton</sg-heading>
          <p>Medium waits (1-4s)</p>
          <div class="skeleton-demo">
            <div class="skeleton-line" style="width: 60%"></div>
            <div class="skeleton-line" style="width: 80%"></div>
            <div class="skeleton-line" style="width: 40%"></div>
          </div>
        </div>
        <div class="loading-card" class:active-strategy={strategy === "progress"}>
          <sg-heading level={4}>Progress</sg-heading>
          <p>Long waits (&gt;4s)</p>
          <div class="progress-demo">
            <div class="progress-bar"></div>
          </div>
        </div>
      </div>
    </div>
</sg-section>

<style>
/* ===== INTERACTIVE SECTION ===== */

.focus-demo-row {
  display: flex;
  gap: var(--sg-gap-grouped);
  flex-wrap: wrap;
}

.focus-target {
  padding: var(--sg-space-2) var(--sg-space-6);
  background: var(--surface);
  border: var(--sg-border-thin) solid var(--sg-color-border);
  border-radius: var(--radius-xs);
  color: var(--sg-color-text);
  font-size: var(--sg-text-sm);
  cursor: pointer;
  text-decoration: none;
}

.focus-target:focus-visible {
  outline: var(--sg-border-medium) solid var(--sg-color-border-focus);
  outline-offset: var(--sg-space-0-5);
}

.state-layer-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--sg-space-3);
  margin-bottom: var(--sg-space-4);
}

.state-layer-card {
  position: relative;
  background: var(--surface);
  border: 1px solid var(--sg-color-border);
  border-radius: var(--radius-sm);
  padding: var(--sg-pad-card, 1.5rem);
  text-align: center;
  overflow: hidden;
  cursor: pointer;
}

.state-layer-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  transition: opacity var(--sg-duration-fast);
}

.state-layer-name {
  position: relative;
  display: block;
  font-size: var(--sg-text-sm);
  font-weight: var(--sg-weight-semibold);
  margin-bottom: var(--sg-space-1);
}

.state-layer-value {
  position: relative;
  font-size: var(--sg-text-xs);
  color: var(--text-3);
  font-family: var(--sg-font-mono);
}

.state-priority-table h4 {
  font-size: var(--sg-text-sm);
  margin-bottom: var(--sg-space-2);
  color: var(--sg-color-text-secondary);
}

.state-priority-table ol {
  padding-left: var(--sg-space-5);
  font-size: var(--sg-text-sm);
  color: var(--text-3);
}

.cursor-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: var(--sg-gap-related);
}

.cursor-card {
  background: var(--surface);
  border: 1px solid var(--sg-color-border);
  border-radius: var(--radius-xs);
  padding: var(--sg-pad-input, 0.75rem);
  text-align: center;
}

.cursor-name {
  display: block;
  font-size: var(--sg-text-xs);
  font-weight: var(--sg-weight-semibold);
  margin-bottom: var(--sg-space-0-5);
}

.cursor-value {
  font-size: var(--sg-text-xs);
  color: var(--text-3);
  font-family: var(--sg-font-mono);
}

.validation-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--sg-gap-grouped);
}

.validation-card {
  background: var(--surface);
  border: 1px solid var(--sg-color-border);
  border-radius: var(--radius-sm);
  padding: var(--sg-space-4);
}

.validation-card h4 {
  font-size: var(--sg-text-sm);
  margin-bottom: var(--sg-space-3);
}

.validation-input {
  border: var(--sg-border-medium) solid;
  border-radius: var(--radius-xs);
  padding: var(--sg-space-2-5) var(--sg-space-3);
  display: flex;
  align-items: center;
  gap: var(--sg-gap-related);
  font-size: var(--sg-text-sm);
  color: var(--sg-color-text-secondary);
}

.validation-message {
  display: block;
  margin-top: var(--sg-space-1-5);
  font-size: var(--sg-text-xs);
}

.loading-strategies {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--sg-gap-grouped);
  margin-top: var(--sg-space-4);
}

.loading-card {
  background: var(--surface);
  border: 1px solid var(--sg-color-border);
  border-radius: var(--radius-sm);
  padding: var(--sg-space-5);
  opacity: 0.5;
  transition: opacity var(--sg-duration-moderate), border-color var(--sg-duration-moderate);
}

.loading-card.active-strategy {
  opacity: 1;
  border-color: var(--sg-color-link);
}

.loading-card h4 {
  font-size: var(--sg-text-base);
  margin-bottom: var(--sg-space-1);
}

.loading-card p {
  font-size: var(--sg-text-xs);
  color: var(--text-3);
  margin-bottom: var(--sg-space-4);
}

.spinner-demo {
  width: 24px;
  height: 24px;
  border: var(--sg-space-1) solid var(--sg-surface-container-high);
  border-top-color: var(--sg-color-link);
  border-radius: var(--sg-radius-full);
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.skeleton-demo {
  display: flex;
  flex-direction: column;
  gap: var(--sg-gap-related);
}

.skeleton-line {
  height: 12px;
  background: var(--sg-surface-container-high);
  border-radius: var(--sg-radius-md);
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}

.progress-demo {
  height: 8px;
  background: var(--sg-surface-container-high);
  border-radius: var(--sg-radius-sm);
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  width: 65%;
  background: var(--sg-color-link);
  border-radius: var(--sg-radius-sm);
  animation: progress 2s ease-in-out infinite;
}

@keyframes progress {
  0% { width: 0%; }
  100% { width: 100%; }
}

@media (max-width: 768px) {
  .state-layer-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .validation-grid,
  .loading-strategies,
  .transition-grid {
    grid-template-columns: 1fr;
  }
}
</style>
