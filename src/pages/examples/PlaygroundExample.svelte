<script lang="ts">
  import ExamplesLayout from "./ExamplesLayout.svelte";
  type ComponentType = "Button" | "Badge" | "Avatar" | "Progress";
  type ColorVariant = "primary" | "secondary" | "danger" | "success" | "warning" | "info" | "ghost";
  type SizeVariant = "sm" | "md" | "lg";

  let selectedComponent = $state<ComponentType>("Button");
  let selectedColor = $state<ColorVariant>("primary");
  let selectedSize = $state<SizeVariant>("md");
  let isDisabled = $state(false);
  let progressValue = $state(60);

  const allColors: ColorVariant[] = ["primary", "secondary", "danger", "success", "warning", "info", "ghost"];

  const avatarData = [
    { fallback: "AB", alt: "Alice Baker" },
    { fallback: "CJ", alt: "Carlos James" },
    { fallback: "DE", alt: "Diana Evans" },
    { fallback: "FG", alt: "Frank Gibson" },
    { fallback: "HI", alt: "Hannah Irving" },
    { fallback: "JK", alt: "Jake Kim" },
  ];

  const progressValues = [10, 25, 50, 75, 90, 100];
  const progressColors: Array<"primary" | "success" | "danger" | "warning" | "info"> = [
    "primary", "success", "danger", "warning", "info",
  ];

  const componentOptions = [
    { value: "Button", label: "Button" },
    { value: "Badge", label: "Badge" },
    { value: "Avatar", label: "Avatar" },
    { value: "Progress", label: "Progress" },
  ];

  const colorOptions = allColors.map((c) => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }));

  const sizeOptions = [
    { value: "sm", label: "sm" },
    { value: "md", label: "md" },
    { value: "lg", label: "lg" },
  ];

  function handleComponentChange(val: string) {
    selectedComponent = val as ComponentType;
  }

  function handleColorChange(val: string) {
    selectedColor = val as ColorVariant;
  }

  function handleSizeChange(val: string) {
    selectedSize = val as SizeVariant;
  }
</script>

<ExamplesLayout>
  
    <div class="playground-root">
      <!-- Left: Preview panel -->
      <section class="playground-preview" aria-label="Component preview">
        <div class="preview-header">
          <span class="preview-label">Preview</span>
          <span class="preview-component-name">{selectedComponent}</span>
        </div>

        <div class="preview-canvas">
          {#if selectedComponent === "Button"}
            <div class="preview-grid">
              <div class="preview-section-title">All Colors – size: {selectedSize}</div>
              <div class="preview-row wrap">
                {#each allColors as color}
                  <button class="sg-button" data-color={color} data-size={selectedSize} disabled={isDisabled}>
                    {color.charAt(0).toUpperCase() + color.slice(1)}
                  </button>
                {/each}
              </div>

              <hr class="sg-separator" data-orientation="horizontal" />

              <div class="preview-section-title">Selected: {selectedColor} – all sizes</div>
              <div class="preview-row">
                <button class="sg-button" data-color={selectedColor} data-size="sm" disabled={isDisabled}>
                  Small
                </button>
                <button class="sg-button" data-color={selectedColor} data-size="md" disabled={isDisabled}>
                  Medium
                </button>
                <button class="sg-button" data-color={selectedColor} data-size="lg" disabled={isDisabled}>
                  Large
                </button>
              </div>

              <hr class="sg-separator" data-orientation="horizontal" />

              <div class="preview-section-title">States</div>
              <div class="preview-row">
                <button class="sg-button" data-color={selectedColor} data-size={selectedSize}>
                  Default
                </button>
                <button class="sg-button" data-color={selectedColor} data-size={selectedSize} disabled>
                  Disabled
                </button>
                <button class="sg-button" data-color={selectedColor} data-size={selectedSize} data-loading>
                  Loading
                </button>
              </div>
            </div>

          {:else if selectedComponent === "Badge"}
            <div class="preview-grid">
              <div class="preview-section-title">All Colors – size: {selectedSize}</div>
              <div class="preview-row wrap">
                {#each allColors as color}
                  <sg-badge {color} size={selectedSize}>
                    {color.charAt(0).toUpperCase() + color.slice(1)}
                  </sg-badge>
                {/each}
              </div>

              <hr class="sg-separator" data-orientation="horizontal" />

              <div class="preview-section-title">Selected: {selectedColor} – all sizes</div>
              <div class="preview-row align-center">
                <sg-badge color={selectedColor} size="sm">
                  Small
                </sg-badge>
                <sg-badge color={selectedColor} size="md">
                  Medium
                </sg-badge>
                <sg-badge color={selectedColor} size="lg">
                  Large
                </sg-badge>
              </div>

              <hr class="sg-separator" data-orientation="horizontal" />

              <div class="preview-section-title">With icons</div>
              <div class="preview-row wrap">
                <sg-badge color="success" size={selectedSize} icon="check">
                  Verified
                </sg-badge>
                <sg-badge color="danger" size={selectedSize} icon="x">
                  Rejected
                </sg-badge>
                <sg-badge color="warning" size={selectedSize} icon="alert-triangle">
                  Pending
                </sg-badge>
                <sg-badge color="info" size={selectedSize} icon="info">
                  Notice
                </sg-badge>
              </div>
            </div>

          {:else if selectedComponent === "Avatar"}
            <div class="preview-grid">
              <div class="preview-section-title">All sizes – with initials</div>
              <div class="preview-row align-center">
                {#each avatarData.slice(0, 3) as avatar}
                  <div class="avatar-group">
                    <sg-avatar size="sm" fallback={avatar.fallback} alt={avatar.alt} />
                    <sg-avatar size="md" fallback={avatar.fallback} alt={avatar.alt} />
                    <sg-avatar size="lg" fallback={avatar.fallback} alt={avatar.alt} />
                  </div>
                {/each}
              </div>

              <hr class="sg-separator" data-orientation="horizontal" />

              <div class="preview-section-title">Grid – size: {selectedSize}</div>
              <div class="preview-row wrap align-center">
                {#each avatarData as avatar}
                  <sg-avatar size={selectedSize} fallback={avatar.fallback} alt={avatar.alt} />
                {/each}
              </div>

              <hr class="sg-separator" data-orientation="horizontal" />

              <div class="preview-section-title">Avatar stack</div>
              <div class="avatar-stack">
                {#each avatarData as avatar}
                  <sg-avatar size="md" fallback={avatar.fallback} alt={avatar.alt} />
                {/each}
              </div>
            </div>

          {:else if selectedComponent === "Progress"}
            <div class="preview-grid">
              <div class="preview-section-title">Live value: {progressValue}%</div>
              <progress class="sg-progress"
                value={progressValue}
                max={100}
                data-color={selectedColor === "ghost" || selectedColor === "secondary" ? "primary" : selectedColor}
                data-size={selectedSize}
              ></progress>

              <hr class="sg-separator" data-orientation="horizontal" />

              <div class="preview-section-title">Various values – size: {selectedSize}</div>
              <div class="progress-list">
                {#each progressValues as pval}
                  <div class="progress-row">
                    <span class="progress-value-label">{pval}%</span>
                    <progress class="sg-progress"
                      value={pval}
                      max={100}
                      data-color="primary"
                      data-size={selectedSize}
                    ></progress>
                  </div>
                {/each}
              </div>

              <hr class="sg-separator" data-orientation="horizontal" />

              <div class="preview-section-title">All colors – 60%</div>
              <div class="progress-list">
                {#each progressColors as color}
                  <div class="progress-row">
                    <span class="progress-value-label">{color}</span>
                    <progress class="sg-progress" value={60} max={100} data-color={color} data-size={selectedSize}></progress>
                  </div>
                {/each}
              </div>

              <hr class="sg-separator" data-orientation="horizontal" />

              <div class="preview-section-title">Indeterminate</div>
              <progress class="sg-progress" data-color="primary" data-size={selectedSize}></progress>
            </div>
          {/if}
        </div>
      </section>

      <!-- Right: Controls panel -->
      <aside class="playground-controls" aria-label="Playground configuration">
        <div class="controls-inner">
          <div class="controls-section">
            <h2 class="controls-heading">Configuration</h2>
          </div>

          <div class="controls-section">
            <select class="sg-native-select"
              value={selectedComponent} oninput={(e) => { const el = e.currentTarget as any; selectedComponent = (el.value ?? selectedComponent); }} onclick={(e) => { const el = e.currentTarget as any; selectedComponent = (el.value ?? selectedComponent); }} ontoggle={(e) => { const el = e.currentTarget as any; selectedComponent = (el.value ?? selectedComponent); }}
              onchange={handleComponentChange}
            >

                {#each componentOptions as opt}
                  <option value={opt.value}>{opt.label}</option>
                {/each}

            </select>
          </div>

          <div class="controls-section">
            <select class="sg-native-select"
              value={selectedColor} oninput={(e) => { const el = e.currentTarget as any; selectedColor = (el.value ?? selectedColor); }} onclick={(e) => { const el = e.currentTarget as any; selectedColor = (el.value ?? selectedColor); }} ontoggle={(e) => { const el = e.currentTarget as any; selectedColor = (el.value ?? selectedColor); }}
              onchange={handleColorChange}
            >

                {#each colorOptions as opt}
                  <option value={opt.value}>{opt.label}</option>
                {/each}

            </select>
          </div>

          <div class="controls-section">
            <div class="size-control-label">
              <label class="sg-label">Size</label>
            </div>
            <sg-tabs-root value={selectedSize} oninput={(e) => { const el = e.currentTarget as any; selectedSize = (el.value ?? selectedSize); }} onclick={(e) => { const el = e.currentTarget as any; selectedSize = (el.value ?? selectedSize); }} ontoggle={(e) => { const el = e.currentTarget as any; selectedSize = (el.value ?? selectedSize); }} onchange={handleSizeChange}>
              <sg-tabs-list>
                {#each sizeOptions as opt}
                  <sg-tabs-trigger value={opt.value}>
                    
                      {opt.label}
                    
                  </sg-tabs-trigger>
                {/each}
              </sg-tabs-list>
            </sg-tabs-root>
          </div>

          {#if selectedComponent !== "Avatar"}
            <div class="controls-section">
              <input type="checkbox" class="sg-switch" role="switch" checked={isDisabled} oninput={(e) => { const el = e.currentTarget as any; isDisabled = (el.checked ?? isDisabled); }} onchange={(e) => { const el = e.currentTarget as any; isDisabled = (el.checked ?? isDisabled); }} onclick={(e) => { const el = e.currentTarget as any; isDisabled = (el.checked ?? isDisabled); }} ontoggle={(e) => { const el = e.currentTarget as any; isDisabled = (el.checked ?? isDisabled); }} />
            </div>
          {/if}

          {#if selectedComponent === "Progress"}
            <div class="controls-section">
              <input type="range" class="sg-slider"
                min={0}
                max={100}
                step={1}
                value={progressValue} oninput={(e) => { const el = e.currentTarget as any; progressValue = (el.value ?? progressValue); }} onchange={(e) => { const el = e.currentTarget as any; progressValue = (el.value ?? progressValue); }} onclick={(e) => { const el = e.currentTarget as any; progressValue = (el.value ?? progressValue); }} ontoggle={(e) => { const el = e.currentTarget as any; progressValue = (el.value ?? progressValue); }}
              />
            </div>
          {/if}

          <hr class="sg-separator" data-orientation="horizontal" />

          <div class="controls-section controls-meta">
            <div class="meta-row">
              <span class="meta-key">Component</span>
              <span class="meta-value">{selectedComponent}</span>
            </div>
            <div class="meta-row">
              <span class="meta-key">Color</span>
              <span class="meta-value">{selectedColor}</span>
            </div>
            <div class="meta-row">
              <span class="meta-key">Size</span>
              <span class="meta-value">{selectedSize}</span>
            </div>
            {#if selectedComponent !== "Avatar"}
              <div class="meta-row">
                <span class="meta-key">Disabled</span>
                <span class="meta-value">{isDisabled}</span>
              </div>
            {/if}
            {#if selectedComponent === "Progress"}
              <div class="meta-row">
                <span class="meta-key">Value</span>
                <span class="meta-value">{progressValue}</span>
              </div>
            {/if}
          </div>
        </div>
      </aside>
    </div>
  
</ExamplesLayout>

<style>
  .playground-root {
    display: grid;
    grid-template-columns: 1fr 280px;
    min-height: 600px;
    gap: 0;
    border: var(--sg-border-thin) solid var(--sg-color-border);
    border-radius: var(--sg-radius-lg);
    overflow: hidden;
    background: var(--surface);
    margin: 0 var(--sg-space-6);
  }

  @media (max-width: 768px) {
    .playground-root {
      grid-template-columns: 1fr;
      margin: 0 var(--sg-space-4);
    }
  }

  /* Preview panel */

  .playground-preview {
    display: flex;
    flex-direction: column;
    border-right: var(--sg-border-thin) solid var(--sg-color-border);
    overflow: hidden;
  }

  @media (max-width: 768px) {
    .playground-preview {
      border-right: none;
      border-bottom: var(--sg-border-thin) solid var(--sg-color-border);
    }
  }

  .preview-header {
    display: flex;
    align-items: center;
    gap: var(--sg-space-3);
    padding: var(--sg-space-4) var(--sg-space-6);
    border-bottom: var(--sg-border-thin) solid var(--sg-color-border);
    background: var(--sg-surface-container-high);
  }

  .preview-label {
    font-size: var(--sg-text-xs);
    font-weight: var(--sg-weight-semibold);
    text-transform: uppercase;
    letter-spacing: var(--sg-tracking-caps);
    color: var(--text-3);
  }

  .preview-component-name {
    font-size: var(--sg-text-sm);
    font-weight: var(--sg-weight-medium);
    color: var(--sg-color-text);
    background: var(--sg-surface-container-highest);
    padding: var(--sg-space-0-5) var(--sg-space-2);
    border-radius: var(--sg-radius-sm);
    border: var(--sg-border-thin) solid var(--sg-color-border);
    font-family: var(--sg-font-mono, monospace);
  }

  .preview-canvas {
    flex: 1;
    padding: var(--sg-space-8) var(--sg-space-6);
    overflow-y: auto;
  }

  .preview-grid {
    display: flex;
    flex-direction: column;
    gap: var(--sg-space-6);
  }

  .preview-section-title {
    font-size: var(--sg-text-xs);
    font-weight: var(--sg-weight-semibold);
    text-transform: uppercase;
    letter-spacing: var(--sg-tracking-caps);
    color: var(--text-3);
    margin-bottom: var(--sg-space-1);
  }

  .preview-row {
    display: flex;
    align-items: flex-start;
    gap: var(--sg-space-3);
  }

  .preview-row.wrap {
    flex-wrap: wrap;
  }

  .preview-row.align-center {
    align-items: center;
  }

  /* Avatar-specific */

  .avatar-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--sg-gap-related);
  }

  .avatar-stack {
    display: flex;
    flex-direction: row;
  }

  .avatar-stack :global(.sg-avatar) {
    margin-left: -10px;
    border: 2px solid var(--surface);
    box-shadow: 0 0 0 1px var(--sg-color-border);
  }

  .avatar-stack :global(.sg-avatar:first-child) {
    margin-left: 0;
  }

  /* Progress-specific */

  .progress-list {
    display: flex;
    flex-direction: column;
    gap: var(--sg-space-3);
  }

  .progress-row {
    display: grid;
    grid-template-columns: 80px 1fr;
    align-items: center;
    gap: var(--sg-gap-grouped);
  }

  .progress-value-label {
    font-size: var(--sg-text-xs);
    color: var(--text-3);
    font-weight: var(--sg-weight-medium);
    text-align: right;
    font-family: var(--sg-font-mono, monospace);
  }

  /* Controls panel */

  .playground-controls {
    background: var(--sg-surface-container-high);
    overflow-y: auto;
  }

  .controls-inner {
    display: flex;
    flex-direction: column;
    gap: 0;
    padding: var(--sg-pad-card, 1.5rem);
  }

  .controls-section {
    padding: var(--sg-space-4) 0;
    border-bottom: var(--sg-border-thin) solid var(--sg-color-border);
  }

  .controls-section:first-child {
    padding-top: 0;
  }

  .controls-section:last-child {
    border-bottom: none;
  }

  .controls-heading {
    font-size: var(--sg-text-sm);
    font-weight: var(--sg-weight-semibold);
    color: var(--sg-color-text);
    margin: 0;
    line-height: 1.4;
  }

  .size-control-label {
    margin-bottom: var(--sg-space-2);
  }

  /* Metadata display */

  .controls-meta {
    display: flex;
    flex-direction: column;
    gap: var(--sg-gap-related);
  }

  .meta-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--sg-gap-related);
  }

  .meta-key {
    font-size: var(--sg-text-xs);
    color: var(--text-3);
    font-weight: var(--sg-weight-medium);
  }

  .meta-value {
    font-size: var(--sg-text-xs);
    color: var(--sg-color-text);
    font-family: var(--sg-font-mono, monospace);
    background: var(--sg-surface-container-highest);
    padding: var(--sg-space-0-5) var(--sg-space-2);
    border-radius: var(--sg-radius-sm);
    border: var(--sg-border-thin) solid var(--sg-color-border);
  }
</style>
