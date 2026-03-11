<script lang="ts">
  import GradientSection from "../../sections/GradientSection.svelte";
</script>

<div class="page">
  <div class="page-header">
    <sg-heading level={1}>Gradient Builder</sg-heading>
    <sg-text size="lg" color="secondary">Build perceptually uniform gradients by interpolating in OKLab or OKLCH color space - no muddy midpoints.</sg-text>
  </div>

  <sg-code-block
    title="Usage"
    language="typescript"
    code={`import { interpolateOklab, interpolateOklch } from "@sig-ui/core/color";

// Interpolate between two colors in OKLab space
const steps = interpolateOklab("#6366f1", "#f472b6", 10);
// Returns array of 10 hex colors

// OKLCH preserves chroma better for hue shifts
const oklchSteps = interpolateOklch("#6366f1", "#f472b6", 10);`}
  />

  <GradientSection />
</div>
