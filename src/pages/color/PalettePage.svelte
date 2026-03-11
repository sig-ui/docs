<script lang="ts">
  import PaletteSection from "../../sections/PaletteSection.svelte";
  import FullPaletteGeneratorSection from "../../sections/FullPaletteGeneratorSection.svelte";
  interface Props {
    brandColor: string;
  }

  let { brandColor }: Props = $props();
</script>

<div class="page">
  <div class="page-header">
    <sg-heading level={1}>Palette Generator</sg-heading>
    <sg-text size="lg" color="secondary">Generate APCA-calibrated shade ramps, complete color themes from harmony rules, data visualization scales, and gradients – all from a single hex color.</sg-text>
  </div>

  <FullPaletteGeneratorSection />
  <PaletteSection {brandColor} />
</div>
