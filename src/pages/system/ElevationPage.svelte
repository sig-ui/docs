<script lang="ts">
  import ElevationSection from "../../sections/ElevationSection.svelte";
</script>

<div class="page">
  <div class="page-header">
    <sg-heading level={1}>Elevation & Depth</sg-heading>
    <sg-text size="lg" color="secondary">Physically-grounded dual-shadow model, z-index stacking, border system, nested radius calculator, surface materials, container hierarchy, and squircle corners.</sg-text>
  </div>

  <sg-code-block
    title="Tokens"
    language="css"
    code={`/* Dual key + ambient shadow scale (light mode) */
--sg-shadow-none: none;
--sg-shadow-xs:
  0 0.5px 1px -0.25px rgba(0,0,0,0.08),
  0 0 2px 0 rgba(0,0,0,0.06);
--sg-shadow-sm:
  0 1px 2px -0.5px rgba(0,0,0,0.08),
  0 0 4px 0 rgba(0,0,0,0.06);
--sg-shadow-md:
  0 1.5px 3px -0.75px rgba(0,0,0,0.08),
  0 0 6px 0 rgba(0,0,0,0.06);
--sg-shadow-lg:
  0 2px 4px -1px rgba(0,0,0,0.08),
  0 0 8px 0 rgba(0,0,0,0.06);
--sg-shadow-xl:
  0 2.5px 5px -1.25px rgba(0,0,0,0.08),
  0 0 10px 0 rgba(0,0,0,0.06);

/* Surface container hierarchy */
--sg-surface-container-lowest:  ...;  /* recessed insets */
--sg-surface-container-low:     ...;  /* subtle grouping */
--sg-surface-container:         ...;  /* default (cards) */
--sg-surface-container-high:    ...;  /* emphasized */
--sg-surface-container-highest: ...;  /* maximum emphasis */`}
  />

  <ElevationSection />
</div>
