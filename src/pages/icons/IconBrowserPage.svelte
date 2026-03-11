<script lang="ts">
  import { ICON_CATALOG, getIconCount, type IconEntry } from "./icon-catalog.ts";

  // Toolbar state
  let search = $state("");
  let activeCategory = $state<string | null>(null);
  let variant = $state<"outlined" | "rounded" | "sharp">("outlined");
  let filled = $state(false);
  let weight = $state(400);
  let grade = $state(0);
  let opticalSize = $state(24);

  // Per-category expansion
  let expandedCategories = $state<Set<string>>(new Set());

  // Selection
  let selected = $state<IconEntry | null>(null);
  let copied = $state(false);
  let copiedTimeout: ReturnType<typeof setTimeout> | null = null;

  const totalCount = getIconCount();
  const ICONS_PER_CATEGORY = 36;

  const isSearching = $derived(search.trim().length > 0);
  const isSingleCategory = $derived(!!activeCategory);

  const filteredCategories = $derived.by(() => {
    const q = search.toLowerCase().trim();
    return ICON_CATALOG
      .filter((cat) => !activeCategory || cat.id === activeCategory)
      .map((cat) => {
        const matched = cat.icons.filter((icon) => {
          if (!q) return true;
          return icon.name.includes(q) || icon.tags.some((t) => t.includes(q));
        });
        // Show all when searching, single category selected, or expanded
        const showAll = isSearching || isSingleCategory || expandedCategories.has(cat.id);
        return {
          ...cat,
          icons: showAll ? matched : matched.slice(0, ICONS_PER_CATEGORY),
          totalMatched: matched.length,
          truncated: !showAll && matched.length > ICONS_PER_CATEGORY,
        };
      })
      .filter((cat) => cat.icons.length > 0);
  });

  const filteredCount = $derived(
    filteredCategories.reduce((n, c) => n + c.totalMatched, 0)
  );

  const sizeMap: Record<number, string> = { 20: "xs", 24: "default", 40: "lg", 48: "xl" };
  const iconDisplaySize = $derived(sizeMap[opticalSize] ?? "default");

  function buildSnippet(icon: IconEntry): string {
    const parts = [`name="${icon.name}"`];
    if (filled) parts.push("filled");
    if (variant !== "outlined") parts.push(`variant="${variant}"`);
    if (weight !== 400) parts.push(`weight={${weight}}`);
    if (grade !== 0) parts.push(`grade={${grade}}`);
    return `<sg-icon ${parts.join(" ")} />`;
  }

  function selectIcon(icon: IconEntry) {
    selected = icon;
    copied = false;
  }

  function copyText(text: string) {
    navigator.clipboard.writeText(text);
    copied = true;
    if (copiedTimeout) clearTimeout(copiedTimeout);
    copiedTimeout = setTimeout(() => { copied = false; }, 1500);
  }

  function toggleCategory(id: string) {
    const next = new Set(expandedCategories);
    if (next.has(id)) next.delete(id); else next.add(id);
    expandedCategories = next;
  }
</script>

<div class="icon-browser">
  <div class="icon-browser-header">
    <sg-heading level={1}>Icon Browser</sg-heading>
    <sg-text color="secondary">
      {filteredCount.toLocaleString()} of {totalCount.toLocaleString()} icons
      {#if search || activeCategory}
        &mdash;
        {#if search}<button class="ib-clear-btn" onclick={() => (search = "")}>Clear search</button>{/if}
        {#if activeCategory}<button class="ib-clear-btn" onclick={() => (activeCategory = null)}>All categories</button>{/if}
      {/if}
    </sg-text>
  </div>

  <!-- Search -->
  <div class="ib-search-bar">
    <input type="search" class="sg-search-input"
      placeholder="Search {totalCount.toLocaleString()} icons by name or keyword..."
      value={search}
      oninput={(e) => { search = (e.currentTarget as HTMLInputElement).value; }}
    />
  </div>

  <!-- Toolbar -->
  <div class="ib-toolbar">
    <div class="ib-toolbar-group">
      <span class="ib-toolbar-label">Style</span>
      <div class="ib-segmented">
        {#each /** @type {const} */ (["outlined", "rounded", "sharp"]) as v}
          <button
            class="ib-seg-btn"
            class:active={variant === v}
            onclick={() => (variant = v)}
          >{v[0].toUpperCase() + v.slice(1)}</button>
        {/each}
      </div>
    </div>

    <div class="ib-toolbar-group">
      <span class="ib-toolbar-label">Fill</span>
      <button
        class="ib-fill-toggle"
        class:active={filled}
        onclick={() => (filled = !filled)}
        aria-pressed={filled}
      >
        <sg-icon name="format_paint" {variant} {filled} size="sm" />
      </button>
    </div>

    <div class="ib-toolbar-group ib-toolbar-slider">
      <input type="range" class="sg-slider" min={100} max={700} step={100} value={weight} oninput={(e) => { weight = Number((e.currentTarget as HTMLInputElement).value); }} />
    </div>

    <div class="ib-toolbar-group ib-toolbar-slider">
      <input type="range" class="sg-slider" min={-50} max={200} step={25} value={grade} oninput={(e) => { grade = Number((e.currentTarget as HTMLInputElement).value); }} />
    </div>

    <div class="ib-toolbar-group ib-toolbar-slider">
      <input type="range" class="sg-slider" min={20} max={48} step={4} value={opticalSize} oninput={(e) => { opticalSize = Number((e.currentTarget as HTMLInputElement).value); }} />
    </div>
  </div>

  <!-- Category pills -->
  <div class="ib-categories">
    <button class="ib-cat-pill" class:active={!activeCategory} onclick={() => (activeCategory = null)}>All</button>
    {#each ICON_CATALOG as cat}
      <button
        class="ib-cat-pill"
        class:active={activeCategory === cat.id}
        onclick={() => (activeCategory = activeCategory === cat.id ? null : cat.id)}
      >{cat.label} <span class="ib-cat-count">{cat.icons.length}</span></button>
    {/each}
  </div>

  <!-- Grid + detail panel -->
  <div class="ib-body" class:has-selection={!!selected}>
    <div class="ib-grid-area">
      {#each filteredCategories as cat}
        <div class="ib-category-section">
          <sg-heading level={2} size="lg">{cat.label} <span class="ib-category-count">{cat.totalMatched}</span></sg-heading>
          <div class="ib-icon-grid">
            {#each cat.icons as icon (icon.name)}
              <button
                class="ib-icon-cell"
                class:selected={selected?.name === icon.name}
                onclick={() => selectIcon(icon)}
                title={icon.name}
              >
                <sg-icon name={icon.name} {variant} {filled} {weight} {grade} size={iconDisplaySize} />
                <span class="ib-icon-name">{icon.name}</span>
              </button>
            {/each}
          </div>
          {#if cat.truncated}
            <button class="ib-show-more" onclick={() => toggleCategory(cat.id)}>
              Show all {cat.totalMatched} icons in {cat.label}
            </button>
          {/if}
        </div>
      {/each}

      {#if filteredCategories.length === 0}
        <div class="ib-empty">
          <sg-icon name="search_off" {variant} size="xl" />
          <p>No icons match "<strong>{search}</strong>"</p>
        </div>
      {/if}
    </div>

    {#if selected}
      <aside class="ib-detail">
        <button class="ib-detail-close" onclick={() => (selected = null)} aria-label="Close detail">
          <span class="material-symbols-outlined">close</span>
        </button>

        <div class="ib-detail-preview">
          <sg-icon name={selected.name} {variant} {filled} {weight} {grade} size="xl" />
        </div>

        <sg-heading level={3} size="xl">{selected.name}</sg-heading>

        <div class="ib-detail-tags">
          {#each selected.tags as tag}
            <span class="ib-tag">{tag}</span>
          {/each}
        </div>

        <div class="ib-detail-actions">
          <button class="sg-button" data-color="primary" onclick={() => copyText(buildSnippet(selected!))}>
            <sg-icon name={copied ? "check" : "content_copy"} {variant} size="sm" />
            {copied ? "Copied!" : "Copy Svelte"}
          </button>
          <button class="sg-button" data-color="secondary" onclick={() => copyText(selected!.name)}>
            <sg-icon name="tag" {variant} size="sm" />
            Copy name
          </button>
        </div>

        <div class="ib-detail-code">
          <code>{buildSnippet(selected)}</code>
        </div>

        <div class="ib-detail-variants">
          <span class="ib-detail-section-label">Style comparison</span>
          <div class="ib-variant-row">
            {#each /** @type {const} */ (["outlined", "rounded", "sharp"]) as v}
              <div class="ib-variant-item" class:active={variant === v}>
                <sg-icon name={selected.name} variant={v} {filled} {weight} {grade} size="lg" />
                <span>{v}</span>
              </div>
            {/each}
          </div>
        </div>
      </aside>
    {/if}
  </div>
</div>

<style>
.icon-browser {
  padding-bottom: var(--sg-space-16);
}

.icon-browser-header {
  margin-bottom: var(--sg-space-8);
}

.icon-browser-header .sg-heading {
  letter-spacing: var(--sg-tracking-3xl);
  margin-bottom: var(--sg-space-2);
}

.ib-clear-btn {
  background: none;
  border: none;
  color: var(--sg-color-action-primary);
  font-size: var(--sg-text-base);
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
  font-family: inherit;
}

/* Search */

.ib-search-bar {
  margin-bottom: var(--sg-space-6);
}

/* Toolbar */

.ib-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: var(--sg-space-6);
  padding: var(--sg-space-5) var(--sg-space-6);
  background: var(--sg-color-bg-secondary);
  border: var(--sg-border-default) solid var(--sg-color-border-default);
  border-radius: var(--sg-radius-xl);
  margin-bottom: var(--sg-space-6);
}

.ib-toolbar-group {
  display: flex;
  flex-direction: column;
  gap: var(--sg-gap-related);
}

.ib-toolbar-label {
  font-size: var(--sg-text-xs);
  font-weight: var(--sg-weight-semibold);
  text-transform: uppercase;
  letter-spacing: var(--sg-tracking-xs);
  color: var(--sg-color-text-muted);
}

.ib-val {
  font-weight: var(--sg-weight-medium);
  color: var(--sg-color-text-secondary);
  font-variant-numeric: tabular-nums;
}

.ib-segmented {
  display: flex;
  border: var(--sg-border-default) solid var(--sg-color-border-default);
  border-radius: var(--sg-radius-md);
  overflow: hidden;
}

.ib-seg-btn {
  padding: var(--sg-space-2) var(--sg-space-4);
  border: none;
  background: transparent;
  color: var(--sg-color-text-secondary);
  font-size: var(--sg-text-sm);
  font-family: inherit;
  cursor: pointer;
  transition: all var(--sg-duration-fast) var(--sg-ease-default);
}

.ib-seg-btn:not(:last-child) {
  border-right: var(--sg-border-default) solid var(--sg-color-border-default);
}

.ib-seg-btn.active {
  background: oklch(from var(--sg-color-action-primary) l c h / var(--sg-state-focus-opacity));
  color: var(--sg-color-action-primary);
  font-weight: var(--sg-weight-semibold);
}

.ib-seg-btn:hover:not(.active) {
  background: var(--sg-color-bg-tertiary);
}

.ib-fill-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--sg-touch-min);
  height: var(--sg-touch-min);
  border: var(--sg-border-default) solid var(--sg-color-border-default);
  border-radius: var(--sg-radius-md);
  background: transparent;
  color: var(--sg-color-text-secondary);
  cursor: pointer;
  transition: all var(--sg-duration-fast) var(--sg-ease-default);
}

.ib-fill-toggle.active {
  background: oklch(from var(--sg-color-action-primary) l c h / var(--sg-state-focus-opacity));
  border-color: var(--sg-color-action-primary);
  color: var(--sg-color-action-primary);
}

.ib-toolbar-slider {
  min-width: 140px;
}

.ib-toolbar-slider input[type="range"] {
  width: 100%;
  accent-color: var(--sg-color-action-primary);
  height: var(--sg-space-1);
}

/* Category pills */

.ib-categories {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sg-gap-related);
  margin-bottom: var(--sg-space-8);
}

.ib-cat-pill {
  padding: var(--sg-space-2) var(--sg-space-4);
  border: var(--sg-border-default) solid var(--sg-color-border-default);
  border-radius: var(--sg-radius-full);
  background: transparent;
  color: var(--sg-color-text-secondary);
  font-size: var(--sg-text-sm);
  font-family: inherit;
  cursor: pointer;
  transition: all var(--sg-duration-fast) var(--sg-ease-default);
  white-space: nowrap;
}

.ib-cat-pill:hover:not(.active) {
  border-color: var(--sg-color-border-strong);
  color: var(--sg-color-text-primary);
}

.ib-cat-pill.active {
  background: oklch(from var(--sg-color-action-primary) l c h / var(--sg-state-focus-opacity));
  border-color: var(--sg-color-action-primary);
  color: var(--sg-color-action-primary);
  font-weight: var(--sg-weight-semibold);
}

.ib-cat-count {
  font-size: var(--sg-text-xs);
  opacity: 0.5;
  margin-left: var(--sg-space-0-5);
}

/* Body layout */

.ib-body {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--sg-gap-separated);
  transition: grid-template-columns var(--sg-duration-normal) var(--sg-ease-default);
}

.ib-body.has-selection {
  grid-template-columns: 1fr 360px;
}

/* Grid area */

.ib-grid-area {
  min-width: 0;
}

.ib-category-section {
  margin-bottom: var(--sg-space-10);
}

.ib-category-section > .sg-heading {
  font-size: var(--sg-text-sm);
  font-weight: var(--sg-weight-bold);
  text-transform: uppercase;
  letter-spacing: var(--sg-tracking-xs);
  color: var(--sg-color-text-muted);
  margin-bottom: var(--sg-space-4);
  padding-bottom: var(--sg-space-3);
  border-bottom: var(--sg-border-default) solid var(--sg-color-border-default);
}

.ib-category-count {
  font-weight: var(--sg-weight-medium);
  opacity: 0.5;
}

.ib-show-more {
  display: block;
  width: 100%;
  padding: var(--sg-pad-input, 0.75rem);
  margin-top: var(--sg-space-3);
  border: var(--sg-border-default) dashed var(--sg-color-border-default);
  border-radius: var(--sg-radius-md);
  background: transparent;
  color: var(--sg-color-text-muted);
  font-size: var(--sg-text-sm);
  font-family: inherit;
  cursor: pointer;
  transition: all var(--sg-duration-fast) var(--sg-ease-default);
}

.ib-show-more:hover {
  border-color: var(--sg-color-action-primary);
  color: var(--sg-color-action-primary);
  background: oklch(from var(--sg-color-action-primary) l c h / 0.04);
}

.ib-icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: var(--sg-gap-tight);
}

.ib-icon-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--sg-gap-related);
  padding: var(--sg-space-4) var(--sg-space-2) var(--sg-space-3);
  border: var(--sg-border-default) solid transparent;
  border-radius: var(--sg-radius-lg);
  background: transparent;
  color: var(--sg-color-text-primary);
  cursor: pointer;
  transition: all var(--sg-duration-fast) var(--sg-ease-default);
  font-family: inherit;
  min-height: 100px;
}

.ib-icon-cell:hover {
  background: var(--sg-color-bg-secondary);
  border-color: var(--sg-color-border-default);
  box-shadow: var(--sg-shadow-xs);
}

.ib-icon-cell.selected {
  background: oklch(from var(--sg-color-action-primary) l c h / var(--sg-state-hover-opacity));
  border-color: var(--sg-color-action-primary);
}

.ib-icon-name {
  font-size: var(--sg-text-xs);
  color: var(--sg-color-text-muted);
  text-align: center;
  line-height: var(--sg-leading-xs);
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ib-icon-cell:hover .ib-icon-name,
.ib-icon-cell.selected .ib-icon-name {
  color: var(--sg-color-text-secondary);
}

/* Empty state */

.ib-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sg-gap-grouped);
  padding: var(--sg-space-20) 0;
  color: var(--sg-color-text-muted);
  text-align: center;
}

.ib-empty p {
  font-size: var(--sg-text-lg);
}

/* Detail panel */

.ib-detail {
  position: sticky;
  top: var(--sg-space-6);
  background: var(--sg-color-bg-secondary);
  border: var(--sg-border-default) solid var(--sg-color-border-default);
  border-radius: var(--sg-radius-xl);
  padding: var(--sg-space-8);
  display: flex;
  flex-direction: column;
  gap: var(--sg-space-5);
  max-height: calc(100vh - var(--sg-space-12));
  overflow-y: auto;
  box-shadow: var(--sg-shadow-sm);
}

.ib-detail-close {
  position: absolute;
  top: var(--sg-space-4);
  right: var(--sg-space-4);
  background: none;
  border: none;
  color: var(--sg-color-text-muted);
  cursor: pointer;
  padding: var(--sg-space-1-5);
  border-radius: var(--sg-radius-md);
  display: flex;
  transition: all var(--sg-duration-fast) var(--sg-ease-default);
}

.ib-detail-close:hover {
  color: var(--sg-color-text-primary);
  background: var(--sg-color-bg-tertiary);
}

.ib-detail-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--sg-space-10) 0;
  background: var(--sg-color-bg-tertiary);
  border-radius: var(--sg-radius-lg);
}

.ib-detail .sg-heading {
  font-family: var(--sg-font-mono);
  letter-spacing: var(--sg-tracking-xl);
}

.ib-detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sg-gap-related);
}

.ib-tag {
  padding: var(--sg-space-1) var(--sg-space-3);
  border-radius: var(--sg-radius-full);
  background: var(--sg-color-bg-tertiary);
  color: var(--sg-color-text-muted);
  font-size: var(--sg-text-xs);
}

.ib-detail-actions {
  display: flex;
  gap: var(--sg-space-3);
}

.ib-detail-actions .sg-button {
  white-space: nowrap;
}

.ib-detail-code {
  padding: var(--sg-space-4);
  background: var(--code-bg, #0d1117);
  border-radius: var(--sg-radius-lg);
  overflow-x: auto;
}

.ib-detail-code code {
  font-family: var(--sg-font-mono);
  font-size: var(--sg-text-sm);
  color: var(--code-text, #e6edf3);
  white-space: pre;
}

.ib-detail-section-label {
  font-size: var(--sg-text-xs);
  font-weight: var(--sg-weight-semibold);
  text-transform: uppercase;
  letter-spacing: var(--sg-tracking-xs);
  color: var(--sg-color-text-muted);
}

.ib-detail-variants {
  display: flex;
  flex-direction: column;
  gap: var(--sg-space-3);
}

.ib-variant-row {
  display: flex;
  gap: var(--sg-space-3);
}

.ib-variant-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sg-space-3);
  padding: var(--sg-space-4);
  border: var(--sg-border-default) solid var(--sg-color-border-default);
  border-radius: var(--sg-radius-lg);
  transition: all var(--sg-duration-fast) var(--sg-ease-default);
}

.ib-variant-item span {
  font-size: var(--sg-text-xs);
  color: var(--sg-color-text-muted);
  text-transform: capitalize;
}

.ib-variant-item.active {
  border-color: var(--sg-color-action-primary);
  background: oklch(from var(--sg-color-action-primary) l c h / 0.06);
}

/* Icon browser responsive */

@media (max-width: 1024px) {
  .ib-body.has-selection {
    grid-template-columns: 1fr;
  }

  .ib-detail {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    top: auto;
    max-height: 50vh;
    border-radius: var(--sg-radius-xl) var(--sg-radius-xl) 0 0;
    z-index: var(--sg-z-overlay);
    box-shadow: var(--sg-shadow-xl);
  }
}

@media (max-width: 768px) {
  .ib-toolbar {
    gap: var(--sg-gap-grouped);
  }

  .ib-toolbar-slider {
    min-width: 100px;
  }

  .ib-icon-grid {
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  }
}
</style>
