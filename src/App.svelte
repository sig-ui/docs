<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { init, getPath, subscribe, navigate } from "./router/router.ts";
  import { applyBrandColor } from "../../packages/dom/src/brand-runtime.js";
  import { findPreset, applyPresetCSS } from "./theme-presets.ts";
  import { fromOklch, clampToGamut } from "../../packages/core/src/index.js";
  import type { OklchColor } from "../../packages/core/src/types.js";
  import { setToastContext } from "./toast-context.ts";
  import Sidebar from "./layout/Sidebar.svelte";
  import Topbar from "./layout/Topbar.svelte";
  import Breadcrumbs from "./layout/Breadcrumbs.svelte";

  // Pages
  import HomePage from "./pages/HomePage.svelte";
  import PhilosophyIndex from "./pages/philosophy/PhilosophyIndex.svelte";
  import PerceptionPage from "./pages/philosophy/PerceptionPage.svelte";
  import ConstraintsPage from "./pages/philosophy/ConstraintsPage.svelte";
  import AccessibilityPhilosophyPage from "./pages/philosophy/AccessibilityPage.svelte";
  import ModernStackPage from "./pages/philosophy/ModernStackPage.svelte";
  import DerivationPage from "./pages/philosophy/DerivationPage.svelte";
  import ColorIndex from "./pages/color/ColorIndex.svelte";
  import PalettePage from "./pages/color/PalettePage.svelte";
  import ManipulatePage from "./pages/color/ManipulatePage.svelte";
  import AccessibilityPage from "./pages/color/AccessibilityPage.svelte";
  import SystemIndex from "./pages/system/SystemIndex.svelte";
  import ThemeGeneratorPage from "./pages/system/ThemeGeneratorPage.svelte";
  import TypographyPage from "./pages/system/TypographyPage.svelte";
  import SpacingPage from "./pages/system/SpacingPage.svelte";
  import ElevationPage from "./pages/system/ElevationPage.svelte";
  import MotionPage from "./pages/system/MotionPage.svelte";
  import PatternsIndex from "./pages/patterns/PatternsIndex.svelte";
  import InteractivePage from "./pages/patterns/InteractivePage.svelte";
  import MachinesPage from "./pages/patterns/MachinesPage.svelte";
  import DashboardExample from "./pages/examples/DashboardExample.svelte";
  import TasksExample from "./pages/examples/TasksExample.svelte";
  import PlaygroundExample from "./pages/examples/PlaygroundExample.svelte";
  import MailExample from "./pages/examples/MailExample.svelte";
  import FormsExample from "./pages/examples/FormsExample.svelte";
  import RtlCjkExample from "./pages/examples/RtlCjkExample.svelte";
  import { routes, findRoute } from "./router/routes.ts";
  import { generatedComponentPages } from "./generated/component-pages.ts";
  import SectionIndex from "./layout/SectionIndex.svelte";
  import ComponentsIndex from "./pages/components/ComponentsIndex.svelte";
  import IconsIndex from "./pages/icons/IconsIndex.svelte";
  import IconBrowserPage from "./pages/icons/IconBrowserPage.svelte";
  import GeneratedComponentPage from "./pages/components/GeneratedComponentPage.svelte";
  import BuildIndex from "./pages/build/BuildIndex.svelte";
  import TokensPage from "./pages/build/TokensPage.svelte";

  // Preserve legacy component URLs by mapping them to generated routes.
  const componentPathAliases: Record<string, string> = {
    "/components/forms/code": "/components/native/code",
    "/components/forms/kbd": "/components/native/kbd",
    "/components/forms/label": "/components/native/label",
    "/components/data-display/table": "/components/native/table",
    "/components/layout/divider": "/components/native/hr",
  };

  // Generate a random brand color on each page load
  function randomBrandHex(): string {
    const hue = Math.random() * 360;
    const raw: OklchColor = { l: 0.65, c: 0.15, h: hue, alpha: 1 };
    const clamped = clampToGamut(raw, "srgb");
    return fromOklch(clamped, "hex");
  }

  // Shared state
  let brandColor = $state(randomBrandHex());
  let currentPath = $state("/");
  let resolvedComponentPath = $derived(componentPathAliases[currentPath] ?? currentPath);
  let motionPreset = $state<"instant" | "snappy" | "smooth" | "playful">("smooth");
  let activePresetId = $state<string | null>(null);
  let unsub: (() => void) | null = null;
  let toastHost: HTMLElement | null = null;

  setToastContext({
    add(message: string) {
      if (!toastHost) return;
      const toast = document.createElement("sg-toast");
      toast.setAttribute("open", "");
      toast.textContent = message;
      toastHost.appendChild(toast);
      setTimeout(() => toast.remove(), 2600);
    },
  });

  function onColorSelect(hex: string) {
    brandColor = hex;
    applyBrandColor(hex);
    navigate("/color/palette");
  }

  function onBrandChange(color: string) {
    brandColor = color;
    if (activePresetId) {
      activePresetId = null;
      localStorage.removeItem("sg-preset");
    }
  }

  function onMotionChange(preset: "instant" | "snappy" | "smooth" | "playful") {
    motionPreset = preset;
    document.documentElement.setAttribute("data-motion", preset);
    localStorage.setItem("sg-motion", preset);
    if (activePresetId) {
      activePresetId = null;
      localStorage.removeItem("sg-preset");
    }
  }

  function onAppearanceChange(t: "light" | "dark") {
    if (activePresetId) {
      activePresetId = null;
      localStorage.removeItem("sg-preset");
    }
  }

  function onPresetChange(presetId: string) {
    const preset = findPreset(presetId);
    if (!preset) return;
    activePresetId = presetId;
    if (preset.brand) {
      brandColor = preset.brand;
      applyBrandColor(preset.brand);
    }
    document.documentElement.setAttribute("data-theme", preset.appearance);
    localStorage.setItem("sg-theme", preset.appearance);
    motionPreset = preset.motion;
    document.documentElement.setAttribute("data-motion", preset.motion);
    localStorage.setItem("sg-motion", preset.motion);
    applyPresetCSS(preset);
    localStorage.setItem("sg-preset", presetId);
  }

  function onTopbarSearch(query: string) {
    if (typeof query !== "string" || !query.trim()) return;
    // Navigate to /components so the sidebar search can be used
    if (currentPath === "/") {
      navigate("/components");
    }
  }

  onMount(() => {
    init();
    currentPath = getPath();
    unsub = subscribe((p) => {
      currentPath = p;
      window.scrollTo(0, 0);
    });
    // Restore saved preset or fall back to random brand
    const savedPreset = localStorage.getItem("sg-preset");
    if (savedPreset && findPreset(savedPreset)) {
      onPresetChange(savedPreset);
    } else {
      applyBrandColor(brandColor);
      const savedMotion = localStorage.getItem("sg-motion");
      if (savedMotion === "instant" || savedMotion === "snappy" || savedMotion === "smooth" || savedMotion === "playful") {
        motionPreset = savedMotion;
        document.documentElement.setAttribute("data-motion", savedMotion);
      }
    }
  });

  onDestroy(() => unsub?.());
</script>

<sg-toast-provider bind:this={toastHost as any} position="bottom-center">

<Topbar {brandColor} {currentPath} onBrandChange={onBrandChange} onSearch={onTopbarSearch} {activePresetId} {onPresetChange} {onAppearanceChange} />
<div class="app-layout">
  {#if currentPath === "/"}
    <main class="main-content main-content-full">
      <HomePage {onColorSelect} />
      <footer>
        <sg-container size="lg">
          <sg-text size="sm" color="muted">Built with <a href="/" data-nav class="footer-link">SigUI</a> &mdash; a comprehensive design system for the modern web</sg-text>
        </sg-container>
      </footer>
    </main>
  {:else}
    <sg-resizable-root direction="horizontal" class="app-resizable">
      <sg-resizable-panel defaultSize={18} minSize={12} maxSize={35} class="sidebar-panel">
        <Sidebar />
      </sg-resizable-panel>
      <sg-resizable-handle index={0} aria-label="Resize sidebar" />
      <sg-resizable-panel defaultSize={82} minSize={50}>
        <main class="main-content">
          <Breadcrumbs />
          <sg-container size="lg">
            {#if currentPath === "/philosophy"}
              <PhilosophyIndex />
            {:else if currentPath === "/philosophy/perception"}
              <PerceptionPage />
            {:else if currentPath === "/philosophy/constraints"}
              <ConstraintsPage />
            {:else if currentPath === "/philosophy/accessibility"}
              <AccessibilityPhilosophyPage />
            {:else if currentPath === "/philosophy/modern-stack"}
              <ModernStackPage />
            {:else if currentPath === "/philosophy/derivation"}
              <DerivationPage />
            {:else if currentPath === "/color"}
              <ColorIndex />
            {:else if currentPath === "/color/palette"}
              <PalettePage {brandColor} />
            {:else if currentPath === "/color/manipulate"}
              <ManipulatePage />
            {:else if currentPath === "/color/accessibility"}
              <AccessibilityPage />
            {:else if currentPath === "/system"}
              <SystemIndex />
            {:else if currentPath === "/system/theme"}
              <ThemeGeneratorPage {brandColor} />
            {:else if currentPath === "/system/typography"}
              <TypographyPage />
            {:else if currentPath === "/system/spacing"}
              <SpacingPage />
            {:else if currentPath === "/system/elevation"}
              <ElevationPage />
            {:else if currentPath === "/system/motion"}
              <MotionPage />
            {:else if currentPath === "/patterns"}
              <PatternsIndex />
            {:else if currentPath === "/patterns/interactive"}
              <InteractivePage />
            {:else if currentPath === "/patterns/machines"}
              <MachinesPage />
            {:else if currentPath === "/examples" || currentPath === "/examples/dashboard"}
              <DashboardExample />
            {:else if currentPath === "/examples/tasks"}
              <TasksExample />
            {:else if currentPath === "/examples/playground"}
              <PlaygroundExample />
            {:else if currentPath === "/examples/mail"}
              <MailExample />
            {:else if currentPath === "/examples/forms"}
              <FormsExample />
            {:else if currentPath === "/examples/rtl-cjk"}
              <RtlCjkExample />
            {:else if currentPath === "/components"}
              <ComponentsIndex />
            {:else if currentPath.startsWith("/components/") && findRoute(resolvedComponentPath)?.route.children}
              {@const sub = findRoute(resolvedComponentPath)?.route}
              {#if sub?.children}<SectionIndex title={sub.label} description={sub.description ?? ""} items={sub.children} />{/if}
            {:else if generatedComponentPages[resolvedComponentPath]}
              <GeneratedComponentPage config={generatedComponentPages[resolvedComponentPath]} />
            {:else if currentPath === "/icons"}
              <IconsIndex />
            {:else if currentPath === "/icons/browser"}
              <IconBrowserPage />
            {:else if currentPath === "/build"}
              <BuildIndex />
            {:else if currentPath === "/build/tokens"}
              <TokensPage />
            {:else}
              <div class="page">
                <sg-heading level={1}>Not Found</sg-heading>
                <sg-text color="secondary">The page <code>{currentPath}</code> doesn't exist.</sg-text>
                <sg-text><a href="/" data-nav class="go-home-link">Go home</a></sg-text>
              </div>
            {/if}
          </sg-container>
          <footer>
            <sg-container size="lg">
              <sg-text size="sm" color="muted">Built with <a href="/" data-nav class="footer-link">SigUI</a> &mdash; a comprehensive design system for the modern web</sg-text>
            </sg-container>
          </footer>
        </main>
      </sg-resizable-panel>
    </sg-resizable-root>
  {/if}
</div>

</sg-toast-provider>
