<script lang="ts">
  import ContrastSection from "../../sections/ContrastSection.svelte";
  import CvdSection from "../../sections/CvdSection.svelte";
</script>

<div class="page">
  <div class="page-header">
    <sg-heading level={1}>Color Accessibility</sg-heading>
    <sg-text size="lg" color="secondary">Contrast checking and color vision deficiency simulation to verify your palette meets accessibility standards.</sg-text>
  </div>

  <sg-code-block
    title="Usage"
    language="typescript"
    code={`import { apcaContrast, wcag2Contrast, simulateCVD } from "@sig-ui/core/color";

const apca = apcaContrast("#1a1a2e", "#ffffff");  // APCA Lc value
const wcag = wcag2Contrast("#1a1a2e", "#ffffff");  // WCAG 2.x ratio

// Simulate deuteranopia (severity 0.0–1.0)
const simulated = simulateCVD("#ff0000", "deutan", 1.0);`}
  />

  <ContrastSection />
  <CvdSection />
</div>
