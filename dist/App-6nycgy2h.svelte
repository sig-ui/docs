<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { init, getPath, subscribe, navigate } from "./router/router.ts";
  import { applyBrandColor } from "../../packages/dom/src/brand-runtime.ts";
  import { fromOklch, clampToGamut } from "../../packages/core/src/index.ts";
  import type { OklchColor } from "../../packages/core/src/types.ts";
  import { Container } from "../../packages/svelte/src/components/Container/index.ts";
  import { Heading } from "../../packages/svelte/src/components/Heading/index.ts";
  import { Text } from "../../packages/svelte/src/components/Text/index.ts";
  import { ToastProvider } from "../../packages/svelte/src/components/Toast/index.ts";
  import { ResizableRoot, ResizablePanel, ResizableHandle } from "../../packages/svelte/src/components/Resizable/index.ts";
  import Sidebar from "./layout/Sidebar.svelte";
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
  import { routes } from "./router/routes.ts";
  import SectionIndex from "./layout/SectionIndex.svelte";
  import ComponentsIndex from "./pages/components/ComponentsIndex.svelte";
  import ButtonPage from "./pages/components/ButtonPage.svelte";
  import BadgePage from "./pages/components/BadgePage.svelte";
  import InputPage from "./pages/components/InputPage.svelte";
  import CheckboxPage from "./pages/components/CheckboxPage.svelte";
  import SwitchPage from "./pages/components/SwitchPage.svelte";
  import SliderPage from "./pages/components/SliderPage.svelte";
  import RadioPage from "./pages/components/RadioPage.svelte";
  import AvatarPage from "./pages/components/AvatarPage.svelte";
  import CardPage from "./pages/components/CardPage.svelte";
  import StackPage from "./pages/components/StackPage.svelte";
  import DialogPage from "./pages/components/DialogPage.svelte";
  import SelectPage from "./pages/components/SelectPage.svelte";
  import TabsPage from "./pages/components/TabsPage.svelte";
  import AccordionPage from "./pages/components/AccordionPage.svelte";
  import NativeAccordionPage from "./pages/components/NativeAccordionPage.svelte";
  import PopoverPage from "./pages/components/PopoverPage.svelte";
  import TooltipPage from "./pages/components/TooltipPage.svelte";
  import MenuPage from "./pages/components/MenuPage.svelte";
  import ToastPage from "./pages/components/ToastPage.svelte";
  import GridPage from "./pages/components/GridPage.svelte";
  import ContainerPage from "./pages/components/ContainerPage.svelte";
  import TextPage from "./pages/components/TextPage.svelte";
  import HeadingPage from "./pages/components/HeadingPage.svelte";
  import DividerPage from "./pages/components/DividerPage.svelte";
  import SpacerPage from "./pages/components/SpacerPage.svelte";
  import IconPage from "./pages/components/IconPage.svelte";
  import AlertDialogPage from "./pages/components/AlertDialogPage.svelte";
  import CollapsiblePage from "./pages/components/CollapsiblePage.svelte";
  import ProgressPage from "./pages/components/ProgressPage.svelte";
  import ScrollAreaPage from "./pages/components/ScrollAreaPage.svelte";
  import SeparatorPage from "./pages/components/SeparatorPage.svelte";
  import SheetPage from "./pages/components/SheetPage.svelte";
  import SkeletonPage from "./pages/components/SkeletonPage.svelte";
  import AlertPage from "./pages/components/AlertPage.svelte";
  import AspectRatioPage from "./pages/components/AspectRatioPage.svelte";
  import BreadcrumbPage from "./pages/components/BreadcrumbPage.svelte";
  import ButtonGroupPage from "./pages/components/ButtonGroupPage.svelte";
  import CalendarPage from "./pages/components/CalendarPage.svelte";
  import CarouselPage from "./pages/components/CarouselPage.svelte";
  import ChartPage from "./pages/components/ChartPage.svelte";
  import ColorPickerPage from "./pages/components/ColorPickerPage.svelte";
  import ComboboxPage from "./pages/components/ComboboxPage.svelte";
  import CommandPage from "./pages/components/CommandPage.svelte";
  import ContextMenuPage from "./pages/components/ContextMenuPage.svelte";
  import DataTablePage from "./pages/components/DataTablePage.svelte";
  import DatePickerPage from "./pages/components/DatePickerPage.svelte";
  import DirectionPage from "./pages/components/DirectionPage.svelte";
  import DrawerPage from "./pages/components/DrawerPage.svelte";
  import EmptyPage from "./pages/components/EmptyPage.svelte";
  import FieldPage from "./pages/components/FieldPage.svelte";
  import HoverCardPage from "./pages/components/HoverCardPage.svelte";
  import InputGroupPage from "./pages/components/InputGroupPage.svelte";
  import InputOTPPage from "./pages/components/InputOTPPage.svelte";
  import KbdPage from "./pages/components/KbdPage.svelte";
  import LabelPage from "./pages/components/LabelPage.svelte";
  import MenubarPage from "./pages/components/MenubarPage.svelte";
  import NativeSelectPage from "./pages/components/NativeSelectPage.svelte";
  import NavigationMenuPage from "./pages/components/NavigationMenuPage.svelte";
  import PaginationPage from "./pages/components/PaginationPage.svelte";
  import ResizablePage from "./pages/components/ResizablePage.svelte";
  import SidebarPage from "./pages/components/SidebarPage.svelte";
  import SpinnerPage from "./pages/components/SpinnerPage.svelte";
  import TablePage from "./pages/components/TablePage.svelte";
  import TextareaPage from "./pages/components/TextareaPage.svelte";
  import TogglePage from "./pages/components/TogglePage.svelte";
  import TypewriterPage from "./pages/components/TypewriterPage.svelte";
  import IconsIndex from "./pages/icons/IconsIndex.svelte";
  import IconBrowserPage from "./pages/icons/IconBrowserPage.svelte";
  import DockPage from "./pages/components/DockPage.svelte";
  import CodePage from "./pages/components/CodePage.svelte";
  import LinkPage from "./pages/components/LinkPage.svelte";
  import CodeBlockPage from "./pages/components/CodeBlockPage.svelte";
  import SectionPage from "./pages/components/SectionPage.svelte";
  import GradientPatternPage from "./pages/components/GradientPatternPage.svelte";
  import SearchInputPage from "./pages/components/SearchInputPage.svelte";
  import BuildIndex from "./pages/build/BuildIndex.svelte";
  import TokensPage from "./pages/build/TokensPage.svelte";

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
  let motionPreset = $state<"instant" | "snappy" | "smooth" | "playful">("smooth");
  let unsub: (() => void) | null = null;

  function onColorSelect(hex: string) {
    brandColor = hex;
    applyBrandColor(hex);
    navigate("/color/palette");
  }

  function onBrandChange(color: string) {
    brandColor = color;
  }

  function onMotionChange(preset: "instant" | "snappy" | "smooth" | "playful") {
    motionPreset = preset;
    document.documentElement.setAttribute("data-motion", preset);
    localStorage.setItem("sigui-motion", preset);
  }

  onMount(() => {
    init();
    currentPath = getPath();
    unsub = subscribe((p) => {
      currentPath = p;
      window.scrollTo(0, 0);
    });
    // Apply the random brand color
    applyBrandColor(brandColor);
    // Restore saved motion preference
    const savedMotion = localStorage.getItem("sigui-motion");
    if (savedMotion === "instant" || savedMotion === "snappy" || savedMotion === "smooth" || savedMotion === "playful") {
      motionPreset = savedMotion;
      document.documentElement.setAttribute("data-motion", savedMotion);
    }
  });

  onDestroy(() => unsub?.());
</script>

<ToastProvider position="bottom-center">
{#snippet children()}
<div class="app-layout">
  {#if currentPath === "/"}
    <main class="main-content main-content-full">
      <HomePage {onColorSelect} />
      <footer>
        <div class="container">
          <Text size="sm" color="muted">Built with <a href="/" data-nav>SigUI</a> &mdash; a comprehensive design system for the modern web</Text>
        </div>
      </footer>
    </main>
  {:else}
    <ResizableRoot direction="horizontal" class="app-resizable">
      <ResizablePanel defaultSize={18} minSize={12} maxSize={35} class="sidebar-panel">
        <Sidebar {brandColor} {onBrandChange} {motionPreset} {onMotionChange} />
      </ResizablePanel>
      <ResizableHandle index={0} aria-label="Resize sidebar" />
      <ResizablePanel defaultSize={82} minSize={50}>
        <main class="main-content">
          <Breadcrumbs />
          <Container size="lg">
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
            {:else if currentPath === "/components"}
              <ComponentsIndex />
            {:else if currentPath === "/components/layout"}
              {@const sub = routes.find(r => r.path === "/components")?.children?.find(r => r.path === "/components/layout")}
              {#if sub?.children}<SectionIndex title={sub.label} description={sub.description ?? ""} items={sub.children} />{/if}
            {:else if currentPath === "/components/forms"}
              {@const sub = routes.find(r => r.path === "/components")?.children?.find(r => r.path === "/components/forms")}
              {#if sub?.children}<SectionIndex title={sub.label} description={sub.description ?? ""} items={sub.children} />{/if}
            {:else if currentPath === "/components/data-display"}
              {@const sub = routes.find(r => r.path === "/components")?.children?.find(r => r.path === "/components/data-display")}
              {#if sub?.children}<SectionIndex title={sub.label} description={sub.description ?? ""} items={sub.children} />{/if}
            {:else if currentPath === "/components/overlays"}
              {@const sub = routes.find(r => r.path === "/components")?.children?.find(r => r.path === "/components/overlays")}
              {#if sub?.children}<SectionIndex title={sub.label} description={sub.description ?? ""} items={sub.children} />{/if}
            {:else if currentPath === "/components/layout/aspect-ratio"}
              <AspectRatioPage />
            {:else if currentPath === "/components/layout/container"}
              <ContainerPage />
            {:else if currentPath === "/components/layout/direction"}
              <DirectionPage />
            {:else if currentPath === "/components/layout/divider"}
              <DividerPage />
            {:else if currentPath === "/components/layout/grid"}
              <GridPage />
            {:else if currentPath === "/components/layout/heading"}
              <HeadingPage />
            {:else if currentPath === "/components/layout/resizable"}
              <ResizablePage />
            {:else if currentPath === "/components/layout/section"}
              <SectionPage />
            {:else if currentPath === "/components/layout/separator"}
              <SeparatorPage />
            {:else if currentPath === "/components/layout/spacer"}
              <SpacerPage />
            {:else if currentPath === "/components/layout/stack"}
              <StackPage />
            {:else if currentPath === "/components/layout/text"}
              <TextPage />
            {:else if currentPath === "/components/forms/badge"}
              <BadgePage />
            {:else if currentPath === "/components/forms/button"}
              <ButtonPage />
            {:else if currentPath === "/components/forms/button-group"}
              <ButtonGroupPage />
            {:else if currentPath === "/components/forms/calendar"}
              <CalendarPage />
            {:else if currentPath === "/components/forms/checkbox"}
              <CheckboxPage />
            {:else if currentPath === "/components/forms/code"}
              <CodePage />
            {:else if currentPath === "/components/forms/color-picker"}
              <ColorPickerPage />
            {:else if currentPath === "/components/forms/field"}
              <FieldPage />
            {:else if currentPath === "/components/forms/input"}
              <InputPage />
            {:else if currentPath === "/components/forms/input-group"}
              <InputGroupPage />
            {:else if currentPath === "/components/forms/input-otp"}
              <InputOTPPage />
            {:else if currentPath === "/components/forms/kbd"}
              <KbdPage />
            {:else if currentPath === "/components/forms/label"}
              <LabelPage />
            {:else if currentPath === "/components/forms/link"}
              <LinkPage />
            {:else if currentPath === "/components/forms/native-select"}
              <NativeSelectPage />
            {:else if currentPath === "/components/forms/radio"}
              <RadioPage />
            {:else if currentPath === "/components/forms/search-input"}
              <SearchInputPage />
            {:else if currentPath === "/components/forms/slider"}
              <SliderPage />
            {:else if currentPath === "/components/forms/switch"}
              <SwitchPage />
            {:else if currentPath === "/components/forms/textarea"}
              <TextareaPage />
            {:else if currentPath === "/components/forms/toggle"}
              <TogglePage />
            {:else if currentPath === "/components/data-display/alert"}
              <AlertPage />
            {:else if currentPath === "/components/data-display/avatar"}
              <AvatarPage />
            {:else if currentPath === "/components/data-display/card"}
              <CardPage />
            {:else if currentPath === "/components/data-display/carousel"}
              <CarouselPage />
            {:else if currentPath === "/components/data-display/chart"}
              <ChartPage />
            {:else if currentPath === "/components/data-display/code-block"}
              <CodeBlockPage />
            {:else if currentPath === "/components/data-display/data-table"}
              <DataTablePage />
            {:else if currentPath === "/components/data-display/empty"}
              <EmptyPage />
            {:else if currentPath === "/components/data-display/gradient-pattern"}
              <GradientPatternPage />
            {:else if currentPath === "/components/data-display/icon"}
              <IconPage />
            {:else if currentPath === "/components/data-display/progress"}
              <ProgressPage />
            {:else if currentPath === "/components/data-display/scroll-area"}
              <ScrollAreaPage />
            {:else if currentPath === "/components/data-display/skeleton"}
              <SkeletonPage />
            {:else if currentPath === "/components/data-display/spinner"}
              <SpinnerPage />
            {:else if currentPath === "/components/data-display/table"}
              <TablePage />
            {:else if currentPath === "/components/data-display/toast"}
              <ToastPage />
            {:else if currentPath === "/components/data-display/typewriter"}
              <TypewriterPage />
            {:else if currentPath === "/components/overlays/accordion"}
              <AccordionPage />
            {:else if currentPath === "/components/overlays/native-accordion"}
              <NativeAccordionPage />
            {:else if currentPath === "/components/overlays/alert-dialog"}
              <AlertDialogPage />
            {:else if currentPath === "/components/overlays/breadcrumb"}
              <BreadcrumbPage />
            {:else if currentPath === "/components/overlays/collapsible"}
              <CollapsiblePage />
            {:else if currentPath === "/components/overlays/combobox"}
              <ComboboxPage />
            {:else if currentPath === "/components/overlays/dock"}
              <DockPage />
            {:else if currentPath === "/components/overlays/command"}
              <CommandPage />
            {:else if currentPath === "/components/overlays/context-menu"}
              <ContextMenuPage />
            {:else if currentPath === "/components/overlays/date-picker"}
              <DatePickerPage />
            {:else if currentPath === "/components/overlays/dialog"}
              <DialogPage />
            {:else if currentPath === "/components/overlays/drawer"}
              <DrawerPage />
            {:else if currentPath === "/components/overlays/hover-card"}
              <HoverCardPage />
            {:else if currentPath === "/components/overlays/menu"}
              <MenuPage />
            {:else if currentPath === "/components/overlays/menubar"}
              <MenubarPage />
            {:else if currentPath === "/components/overlays/navigation-menu"}
              <NavigationMenuPage />
            {:else if currentPath === "/components/overlays/pagination"}
              <PaginationPage />
            {:else if currentPath === "/components/overlays/popover"}
              <PopoverPage />
            {:else if currentPath === "/components/overlays/select"}
              <SelectPage />
            {:else if currentPath === "/components/overlays/sheet"}
              <SheetPage />
            {:else if currentPath === "/components/overlays/sidebar"}
              <SidebarPage />
            {:else if currentPath === "/components/overlays/tabs"}
              <TabsPage />
            {:else if currentPath === "/components/overlays/tooltip"}
              <TooltipPage />
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
                <Heading level={1}>Not Found</Heading>
                <Text color="secondary">The page <code>{currentPath}</code> doesn't exist.</Text>
                <Text><a href="/" data-nav>Go home</a></Text>
              </div>
            {/if}
          </Container>
          <footer>
            <div class="container">
              <Text size="sm" color="muted">Built with <a href="/" data-nav>SigUI</a> &mdash; a comprehensive design system for the modern web</Text>
            </div>
          </footer>
        </main>
      </ResizablePanel>
    </ResizableRoot>
  {/if}
</div>
{/snippet}
</ToastProvider>
