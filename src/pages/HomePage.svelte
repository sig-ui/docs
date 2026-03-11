<script lang="ts">
  import HeroSection from "../sections/HeroSection.svelte";
  import DashboardExample from "./examples/DashboardExample.svelte";
  import TasksExample from "./examples/TasksExample.svelte";
  import PlaygroundExample from "./examples/PlaygroundExample.svelte";
  import MailExample from "./examples/MailExample.svelte";
  import FormsExample from "./examples/FormsExample.svelte";
  import RtlCjkExample from "./examples/RtlCjkExample.svelte";

  interface Props {
    onColorSelect: (hex: string) => void;
  }

  let { onColorSelect }: Props = $props();

  const stats = [
    { value: "8", label: "color roles", detail: "semantic" },
    { value: "70+", label: "components", detail: "Web" },
    { value: "17", label: "motions", detail: "physics-based" },
    { value: "0", label: "dependencies", detail: "runtime" },
  ];

  let activeExample = $state("dashboard");
</script>

<HeroSection {onColorSelect} />

<!-- Stats ribbon -->
<section class="landing-stats">
  <sg-container size="lg">
    <sg-stack direction="horizontal" gap="related" align="center" justify="center" wrap>
      
        {#each stats as stat, i}
          <span class="landing-stat">
            <span class="landing-stat-value">{stat.value}</span>
            <sg-text size="sm" color="secondary">{stat.detail} {stat.label}</sg-text>
          </span>
          {#if i < stats.length - 1}
            <sg-text size="xl" color="muted" as="span">&middot;</sg-text>
          {/if}
        {/each}
      
    </sg-stack>
  </sg-container>
</section>

<!-- Examples -->
<section class="landing-examples">
  <sg-container size="xl">
    <div class="landing-section-header">
      <sg-badge color="primary">Examples</sg-badge>
      <sg-heading level={2} class="landing-section-title">Build <em>anything</em></sg-heading>
      <sg-text size="lg" color="secondary">
        See how SigUI components compose into full application interfaces.
      </sg-text>
    </div>

    <sg-tabs-root value={activeExample} oninput={(e) => { const el = e.currentTarget as any; activeExample = (el.value ?? activeExample); }} onchange={(e) => { const el = e.currentTarget as any; activeExample = (el.value ?? activeExample); }} onclick={(e) => { const el = e.currentTarget as any; activeExample = (el.value ?? activeExample); }} ontoggle={(e) => { const el = e.currentTarget as any; activeExample = (el.value ?? activeExample); }} defaultValue="dashboard">
      <sg-tabs-list aria-label="Example applications" variant="pills" justify="center" class="examples-tabs-list">
        <sg-tabs-trigger value="dashboard">Dashboard</sg-tabs-trigger>
        <sg-tabs-trigger value="tasks">Tasks</sg-tabs-trigger>
        <sg-tabs-trigger value="playground">Playground</sg-tabs-trigger>
        <sg-tabs-trigger value="mail">Mail</sg-tabs-trigger>
        <sg-tabs-trigger value="forms">Forms</sg-tabs-trigger>
        <sg-tabs-trigger value="rtl-cjk">RTL & CJK</sg-tabs-trigger>
      </sg-tabs-list>

      <div class="examples-viewport">
        <sg-tabs-content value="dashboard">
          <DashboardExample />
        </sg-tabs-content>
        <sg-tabs-content value="tasks">
          <TasksExample />
        </sg-tabs-content>
        <sg-tabs-content value="playground">
          <PlaygroundExample />
        </sg-tabs-content>
        <sg-tabs-content value="mail">
          <MailExample />
        </sg-tabs-content>
        <sg-tabs-content value="forms">
          <FormsExample />
        </sg-tabs-content>
        <sg-tabs-content value="rtl-cjk">
          <RtlCjkExample />
        </sg-tabs-content>
      </div>
    </sg-tabs-root>
  </sg-container>
</section>

<style>
  .landing-stats {
    border-bottom: var(--sg-border-thin) solid var(--sg-color-border);
    padding: var(--sg-space-5) 0;
  }

  .landing-stat {
    display: inline-flex;
    align-items: baseline;
    gap: var(--sg-space-1-5);
  }

  .landing-stat-value {
    font-family: var(--sg-font-display);
    font-style: italic;
    font-size: var(--sg-text-xl);
    font-weight: var(--sg-weight-normal);
    background: linear-gradient(135deg, var(--sg-color-link), var(--sg-color-emphasis));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    padding-right: 0.15em;
  }

  .landing-examples {
    padding: var(--sg-space-24) 0;
  }

  .landing-examples :global(.examples-tabs-list) {
    gap: var(--sg-gap-tight);
    margin-bottom: var(--sg-space-4);
    flex-wrap: wrap;
  }

  .examples-viewport {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .examples-viewport :global(.sg-tabs-content) {
    background: var(--sg-bg);
    width: min(100%, var(--sg-grid-max-width));
    overflow: hidden;
    padding: 0;
  }

  @media (max-width: 768px) {
    .landing-examples :global(.examples-tabs-list) {
      gap: var(--sg-gap-micro);
    }
  }
</style>
