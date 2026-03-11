<script lang="ts">
  import MotionSection from "../../sections/MotionSection.svelte";
</script>

<div class="page">
  <div class="page-header">
    <sg-heading level={1}>Motion</sg-heading>
    <sg-text size="lg" color="secondary">Duration scale, distance-based duration, easing curves, spring presets, transition presets, stagger delay, and reduced motion alternatives.</sg-text>
  </div>

  <sg-code-block
    title="Tokens"
    language="css"
    code={`/* Duration scale */
--sg-duration-instant: 50ms;
--sg-duration-fast: 100ms;
--sg-duration-normal: 200ms;
--sg-duration-slow: 300ms;
--sg-duration-slower: 500ms;

/* Easing */
--sg-ease-in: cubic-bezier(0.4, 0, 1, 1);
--sg-ease-out: cubic-bezier(0, 0, 0.2, 1);
--sg-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);`}
  />

  <MotionSection />
</div>
