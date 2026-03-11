<script lang="ts">
  import ContrastSection from "../../sections/ContrastSection.svelte";
</script>

<div class="page">
  <div class="page-header">
    <sg-heading level={1}>Contrast Checker</sg-heading>
    <sg-text size="lg" color="secondary">Real-time APCA and WCAG 2.x contrast ratio calculation with pass/fail badges for accessibility compliance.</sg-text>
  </div>

  <sg-code-block
    title="Usage"
    language="typescript"
    code={`import { apcaContrast, wcag2Contrast } from "@sig-ui/core/color";

const apca = apcaContrast("#1a1a2e", "#ffffff");  // APCA Lc value
const wcag = wcag2Contrast("#1a1a2e", "#ffffff");  // WCAG 2.x ratio

// APCA thresholds: Lc 60+ body text, Lc 75+ preferred
// WCAG: 4.5:1 AA normal, 3:1 AA large, 7:1 AAA`}
  />

  <ContrastSection />
</div>
