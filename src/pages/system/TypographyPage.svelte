<script lang="ts">
  import TypographySection from "../../sections/TypographySection.svelte";
</script>

<div class="page">
  <div class="page-header">
    <sg-heading level={1}>Typography</sg-heading>
    <sg-text size="lg" color="secondary">Type scales, fluid sizing with clamp(), line height ratios, optimal measure, font weights, dark mode adjustments, semantic roles, viewing angle, vertical rhythm, and dyslexia mode.</sg-text>
  </div>

  <sg-code-block
    title="Usage"
    language="typescript"
    code={`import { generateTypeScale } from "@sig-ui/core/tokens";

const scale = generateTypeScale({
  base: 16,
  ratio: 1.25,  // Major third
});
// Returns: { xs, sm, base, md, lg, xl, "2xl", "3xl", "4xl" }`}
  />

  <TypographySection />
</div>
