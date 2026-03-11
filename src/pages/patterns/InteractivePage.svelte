<script lang="ts">
  import InteractiveSection from "../../sections/InteractiveSection.svelte";
</script>

<div class="page">
  <div class="page-header">
    <sg-heading level={1}>Interactive States</sg-heading>
    <sg-text size="lg" color="secondary">Focus ring, state layers (hover/press/drag/disabled), cursor tokens, validation states, and loading strategies.</sg-text>
  </div>

  <sg-code-block
    title="Patterns"
    language="css"
    code={`/* Focus ring */
:focus-visible {
  outline: 2px solid var(--sg-focus-ring);
  outline-offset: 2px;
}

/* State layers - overlay opacity */
[data-state="hover"]    { --state-layer: 0.08; }
[data-state="pressed"]  { --state-layer: 0.12; }
[data-state="dragged"]  { --state-layer: 0.16; }
[data-state="disabled"] { opacity: 0.38; }`}
  />

  <InteractiveSection />
</div>
