<script lang="ts">
  import ThemeConfigSection from "../../sections/ThemeConfigSection.svelte";
  interface Props {
    brandColor: string;
  }

  let { brandColor }: Props = $props();
</script>

<div class="page">
  <div class="page-header">
    <sg-heading level={1}>Theme Generator</sg-heading>
    <sg-text size="lg" color="secondary">Configure the five aesthetic axes of SigUI – appearance, shape, depth, density, and motion – and preview the fully resolved design system theme in real time.</sg-text>
  </div>

  <sg-code-block
    title="Usage"
    language="typescript"
    code={`import type { SiguiConfig } from "@sig-ui/theme";
import { resolveTheme } from "@sig-ui/theme";

const config: SiguiConfig = {
  brand: "#6366f1",
  appearance: "auto",
  shape: "rounded",
  depth: "medium",
  density: "comfortable",
  motion: "smooth",
  harmony: { mode: "triadic" },
};

const theme = resolveTheme(config);
// theme.palettes    – all shade ramps (brand, secondary, tertiary, ...)
// theme.typography  – type scale, line heights, font weights
// theme.spacing     – spatial tokens with density factor
// theme.elevation   – shadows, radii, borders, z-index
// theme.motion      – durations, easings, spring presets
// theme.surfaces    – brand-tinted surface hierarchy
// theme.semanticRoles – light/dark semantic token maps`}
  />

  <ThemeConfigSection {brandColor} />
</div>
