<script lang="ts">
  import SpacingSection from "../../sections/SpacingSection.svelte";
</script>

<div class="page">
  <div class="page-header">
    <sg-heading level={1}>Spacing & Layout</sg-heading>
    <sg-text size="lg" color="secondary">Spatial scale, semantic tokens, touch targets, Fitts's Law, density modes, fluid spacing, breakpoints, grid system, relationship spacing, content spacing, font spacing subsets, component height, and optical spacing.</sg-text>
  </div>

  <sg-code-block
    title="Tokens"
    language="css"
    code={`/* Spacing scale (4px base unit) */
--sg-space-0: 0;
--sg-space-px: 1px;
--sg-space-0\\.5: 2px;
--sg-space-1: 4px;
--sg-space-2: 8px;
--sg-space-3: 12px;
--sg-space-4: 16px;
--sg-space-6: 24px;
--sg-space-8: 32px;
--sg-space-12: 48px;
--sg-space-16: 64px;

/* Semantic tokens → scale mappings */
--sg-gap-inline: var(--sg-space-2);     /* 8px  icon+label */
--sg-gap-stack: var(--sg-space-4);      /* 16px stacked blocks */
--sg-gap-section: var(--sg-space-12);   /* 48px page sections */
--sg-pad-card: var(--sg-space-6);       /* 24px card padding */
--sg-pad-button-x: var(--sg-space-4);   /* 16px button inline */
--sg-pad-button-y: var(--sg-space-3);   /* 12px button block */`}
  />

  <SpacingSection />
</div>
