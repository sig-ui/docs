<script lang="ts">
  import DataVizSection from "../../sections/DataVizSection.svelte";
</script>

<div class="page">
  <div class="page-header">
    <sg-heading level={1}>Data Viz Palettes</sg-heading>
    <sg-text size="lg" color="secondary">Categorical, sequential, and diverging color scales optimized for data visualization with CVD-safe alternatives.</sg-text>
  </div>

  <sg-code-block
    title="Usage"
    language="typescript"
    code={`import {
  categoricalPalette,
  sequentialScale,
  divergingScale
} from "@sig-ui/core/color";

const categorical = categoricalPalette(8);   // 8 distinct colors
const sequential = sequentialScale("#6366f1", 9);  // 9-step ramp
const diverging = divergingScale("#ef4444", "#3b82f6", 11);`}
  />

  <DataVizSection />
</div>
