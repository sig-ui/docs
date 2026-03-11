<script lang="ts">
  import CvdSection from "../../sections/CvdSection.svelte";
</script>

<div class="page">
  <div class="page-header">
    <sg-heading level={1}>CVD Simulator</sg-heading>
    <sg-text size="lg" color="secondary">Simulate protanopia, deuteranopia, and tritanopia to verify your palette remains distinguishable for color vision deficient users.</sg-text>
  </div>

  <sg-code-block
    title="Usage"
    language="typescript"
    code={`import { simulateCVD } from "@sig-ui/core/color";

// Simulate how a color appears to someone with deuteranopia
const simulated = simulateCVD("#ff0000", "deuteranopia", 1.0);
// severity: 0.0 (none) to 1.0 (full)`}
  />

  <CvdSection />
</div>
