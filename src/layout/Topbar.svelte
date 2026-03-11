<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { applyBrandColor } from "../../../packages/dom/src/brand-runtime.js";
  import { PRESETS } from "../theme-presets.ts";

  interface Props {
    brandColor: string;
    currentPath: string;
    onBrandChange: (color: string) => void;
    onSearch: (query: string) => void;
    activePresetId: string | null;
    onPresetChange: (presetId: string) => void;
    onAppearanceChange?: (t: "light" | "dark") => void;
  }

  let { brandColor, currentPath, onBrandChange, onSearch, activePresetId, onPresetChange, onAppearanceChange }: Props = $props();

  let theme = $state<"light" | "dark">("light");
  let searchQuery = $state("");
  let presetOpen = $state(false);

  const PRESET_DESCRIPTIONS: Record<string, string> = {
    default: "Random brand, rounded, smooth",
    sleek: "Apple blue, soft radii, spacious",
    terminal: "Amber, sharp, monospace, instant",
    doom64: "Blood red, sharp, heavy shadows",
  };

  function applyTheme(t: "light" | "dark") {
    document.documentElement.setAttribute("data-theme", t);
    localStorage.setItem("sg-theme", t);
  }

  function setTheme(t: "light" | "dark") {
    theme = t;
    applyTheme(t);
    onAppearanceChange?.(t);
  }

  function updateBrandColor(hex: string) {
    onBrandChange(hex);
    applyBrandColor(hex);
  }

  function handleKeydown(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      const input = document.querySelector<HTMLInputElement>(".topbar-search .sg-search-input-field");
      input?.focus();
    }
  }

  // Sync local theme state when a preset changes appearance
  $effect(() => {
    if (activePresetId) {
      const preset = PRESETS.find(p => p.id === activePresetId);
      if (preset) {
        theme = preset.appearance;
      }
    }
  });

  onMount(() => {
    const saved = localStorage.getItem("sg-theme");
    if (saved === "light" || saved === "dark") theme = saved;
    else theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    applyTheme(theme);

    window.addEventListener("keydown", handleKeydown);
  });

  onDestroy(() => {
    window.removeEventListener("keydown", handleKeydown);
  });

  const navLinks = [
    { label: "Color", href: "/color" },
    { label: "System", href: "/system" },
    { label: "Components", href: "/components" },
    { label: "Patterns", href: "/patterns" },
    { label: "Icons", href: "/icons" },
  ];

  function isActive(href: string): boolean {
    return currentPath === href || currentPath.startsWith(href + "/");
  }
</script>

<header class="topbar sg-sticky-scroll-elevate">
  <div class="topbar-inner">
    <div class="topbar-left">
      <a href="/" data-nav class="topbar-logo">
        <svg class="topbar-logo-icon" viewBox="0 0 512 512" fill="none" aria-hidden="true">
          <rect x="48" y="48" width="264" height="264" rx="64" fill="var(--sg-color-secondary)" opacity="0.65"/>
          <rect x="200" y="200" width="264" height="264" rx="64" fill="currentColor" opacity="0.9"/>
        </svg>
        sig-ui
      </a>

      <nav class="topbar-nav">
        {#each navLinks as link}
          <a href={link.href} data-nav class="topbar-nav-link {isActive(link.href) ? 'active' : ''}">
            {link.label}
          </a>
        {/each}
      </nav>
    </div>

    <div class="topbar-right">
      <div class="topbar-search">
        <input class="sg-search-input" type="search"
          placeholder="Search docs..."
          value={searchQuery}
          oninput={(e) => { searchQuery = (e.currentTarget as HTMLInputElement).value; }}
          onkeydown={(e) => { if (e.key === "Enter") { onSearch(searchQuery); } }}
        />
        <kbd class="sg-kbd topbar-search-kbd">&#8984;K</kbd>
      </div>

      <div class="preset-picker">
        <button
          class="preset-trigger"
          onclick={() => { presetOpen = !presetOpen; }}
          aria-haspopup="listbox"
          aria-expanded={presetOpen}
          title="Theme preset"
        >
          <span class="preset-trigger-label">
            {PRESETS.find(p => p.id === activePresetId)?.label ?? "Preset"}
          </span>
          <svg class="preset-chevron" width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
            <path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        {#if presetOpen}
          <div class="preset-backdrop" role="presentation" onclick={() => { presetOpen = false; }}></div>
          <div class="preset-dropdown" role="listbox" aria-label="Theme presets">
            {#each PRESETS as preset}
              <button
                class="preset-option"
                class:active={activePresetId === preset.id}
                role="option"
                aria-selected={activePresetId === preset.id}
                onclick={() => { onPresetChange(preset.id); presetOpen = false; }}
              >
                <span class="preset-option-info">
                  <span class="preset-option-label">{preset.label}</span>
                  <span class="preset-option-desc">{PRESET_DESCRIPTIONS[preset.id] ?? ""}</span>
                </span>
                {#if activePresetId === preset.id}
                  <svg class="preset-check" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M2.5 7.5l3 3 6-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                {/if}
              </button>
            {/each}
          </div>
        {/if}
      </div>

      <a
        href="https://github.com"
        target="_blank"
        rel="noopener noreferrer"
        class="topbar-icon-link"
        aria-label="GitHub"
      >
        <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"/>
        </svg>
      </a>

      <div class="sg-toggle-group">
        <button class="sg-toggle" aria-pressed={theme === "light"} onclick={() => setTheme("light")} title="Light mode">&#9788;</button>
        <button class="sg-toggle" aria-pressed={theme === "dark"} onclick={() => setTheme("dark")} title="Dark mode">&#9790;</button>
      </div>

      <sg-color-picker
        value={brandColor}
        onchange={(e) => {
          const c = ((e as CustomEvent<any>).detail ?? { hex: (e.currentTarget as any).value });
          updateBrandColor(c.hex);
        }}
        size={40}
        thickness={4.5}
        mode="popover"
        label="Brand color"
      />
    </div>
  </div>
</header>

<style>
  .topbar {
    position: sticky;
    top: 0;
    z-index: var(--sg-z-sticky);
    width: 100%;
    height: var(--sg-chrome-height);
    background: oklch(from var(--sg-bg) l c h / 0.85);
    backdrop-filter: blur(var(--sg-glass-blur, var(--sg-space-3)));
    border-bottom: var(--sg-border-thin) solid var(--sg-color-border);
  }

  .topbar-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    padding: 0 var(--sg-space-6);
    max-width: 100%;
    container-type: inline-size;
    container-name: topbar;
  }

  .topbar-left {
    display: flex;
    align-items: center;
    gap: var(--sg-space-6);
  }

  .topbar-logo {
    font-family: var(--sg-font-display);
    font-size: var(--sg-text-xl);
    font-weight: var(--sg-weight-normal);
    font-style: italic;
    letter-spacing: 0;
    background: linear-gradient(135deg, var(--sg-color-link), var(--sg-color-emphasis));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: var(--sg-gap-related);
    white-space: nowrap;
  }

  .topbar-logo-icon {
    width: 1.4em;
    height: 1.4em;
    flex-shrink: 0;
    color: var(--sg-color-link);
    -webkit-text-fill-color: initial;
  }

  .topbar-nav {
    display: flex;
    align-items: center;
    gap: var(--sg-gap-tight);
  }

  .topbar-nav-link {
    font-size: var(--sg-text-sm);
    color: var(--sg-color-text-secondary);
    text-decoration: none;
    padding: var(--sg-space-1) var(--sg-space-3);
    border-radius: var(--sg-radius-md);
    transition: color var(--sg-duration-fast) var(--sg-ease-default),
                background var(--sg-duration-fast) var(--sg-ease-default);
  }

  .topbar-nav-link:hover {
    color: var(--sg-color-text);
    background: var(--sg-state-hover);
  }

  .topbar-nav-link:global(.active) {
    color: var(--sg-color-text);
    background: var(--sg-state-hover);
    font-weight: var(--sg-weight-medium, 500);
  }

  .topbar-right {
    display: flex;
    align-items: center;
    gap: var(--sg-gap-grouped);
  }

  .topbar-search {
    position: relative;
    display: flex;
    align-items: center;
  }

  .topbar-search :global(.sg-search-input) {
    width: var(--sg-container-sm);
  }

  .topbar-search :global(.sg-search-input-group) {
    border-radius: var(--sg-radius-full, 9999px);
  }

  .topbar-right :global(.sg-toggle-group > .sg-toggle) {
    min-height: calc(var(--sg-touch-min, 44px) * 0.75);
    padding: 0 var(--sg-space-3, 0.75rem);
  }

  .topbar-right :global(.sg-toggle-group > .sg-toggle:first-child) {
    border-radius: var(--sg-radius-full, 9999px) 0 0 var(--sg-radius-full, 9999px);
  }

  .topbar-right :global(.sg-toggle-group > .sg-toggle:last-child) {
    border-radius: 0 var(--sg-radius-full, 9999px) var(--sg-radius-full, 9999px) 0;
  }

  .topbar-search :global(.topbar-search-kbd) {
    position: absolute;
    right: var(--sg-space-2);
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    z-index: var(--sg-z-raised);
    font-size: var(--sg-text-xs);
  }

  .topbar-icon-link {
    display: flex;
    align-items: center;
    color: var(--sg-color-text-muted);
  }

  .topbar-icon-link:hover {
    color: var(--sg-color-text);
  }

  /* Preset Picker */
  .preset-picker {
    position: relative;
  }

  .preset-trigger {
    display: flex;
    align-items: center;
    gap: var(--sg-space-1-5, 6px);
    padding: var(--sg-space-1, 4px) var(--sg-space-3, 12px);
    border: var(--sg-border-thin) solid var(--sg-color-border);
    border-radius: var(--sg-radius-md);
    background: var(--sg-surface-container, transparent);
    color: var(--sg-color-text-secondary);
    font-size: var(--sg-text-sm);
    font-family: inherit;
    cursor: pointer;
    white-space: nowrap;
    transition: border-color var(--sg-duration-fast) var(--sg-ease-default),
                color var(--sg-duration-fast) var(--sg-ease-default);
  }

  .preset-trigger:hover {
    border-color: var(--sg-color-border-focus, var(--sg-color-link));
    color: var(--sg-color-text);
  }

  .preset-trigger-label {
    font-weight: var(--sg-weight-medium, 500);
  }

  .preset-chevron {
    color: var(--sg-color-text-muted);
    flex-shrink: 0;
  }

  .preset-backdrop {
    position: fixed;
    inset: 0;
    z-index: var(--sg-z-dropdown, 100);
  }

  .preset-dropdown {
    position: absolute;
    top: calc(100% + var(--sg-space-1, 4px));
    right: 0;
    z-index: calc(var(--sg-z-dropdown, 100) + 1);
    min-width: 240px;
    background: var(--sg-surface-container, var(--sg-bg));
    border: var(--sg-border-thin) solid var(--sg-color-border);
    border-radius: var(--sg-radius-lg);
    box-shadow: var(--sg-shadow-lg);
    padding: var(--sg-space-1, 4px);
    display: flex;
    flex-direction: column;
    gap: var(--sg-gap-micro, 0.125rem);
  }

  .preset-option {
    display: flex;
    align-items: center;
    gap: var(--sg-space-3, 12px);
    padding: var(--sg-space-2, 8px) var(--sg-space-3, 12px);
    border: none;
    border-radius: var(--sg-radius-md);
    background: transparent;
    color: var(--sg-color-text);
    cursor: pointer;
    text-align: left;
    font-family: inherit;
    font-size: var(--sg-text-sm);
    width: 100%;
    transition: background var(--sg-duration-fast) var(--sg-ease-default);
  }

  .preset-option:hover {
    background: var(--sg-state-hover);
  }

  .preset-option.active {
    background: oklch(from var(--sg-color-link) l c h / 0.1);
  }

  .preset-option-info {
    display: flex;
    flex-direction: column;
    gap: var(--sg-gap-micro, 0.125rem);
    flex: 1;
    min-width: 0;
  }

  .preset-option-label {
    font-weight: var(--sg-weight-semibold, 600);
  }

  .preset-option-desc {
    font-size: var(--sg-text-xs);
    color: var(--sg-color-text-muted);
  }

  .preset-check {
    color: var(--sg-color-link);
    flex-shrink: 0;
  }

  @container topbar (max-width: 64rem) {
    .topbar-search :global(.sg-search-input) {
      width: min(26cqi, 18rem);
    }
  }

  @container topbar (max-width: 54rem) {
    .topbar-nav {
      display: none;
    }

    .topbar-search :global(.topbar-search-kbd) {
      display: none;
    }
  }

</style>
