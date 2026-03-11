<script lang="ts">
  import type { Route } from "../router/routes.ts";

  interface Props {
    title: string;
    description: string;
    items: Route[];
  }

  let { title, description, items }: Props = $props();
  let hasSubgroups = $derived(items.some((item) => item.children && item.children.length > 0));
</script>

<sg-stack gap="separated">
  <div class="section-header">
    <sg-heading level={1}>{title}</sg-heading>
    <sg-text size="lg" color="secondary">{description}</sg-text>
  </div>
  {#if hasSubgroups}
    {#each items as group}
      {#if group.children}
        <div class="index-subgroup">
          <sg-heading level={2}>{group.label}</sg-heading>
          {#if group.description}
            <sg-text size="sm" color="muted">{group.description}</sg-text>
          {/if}
          <div class="index-grid">
            {#each group.children as item}
              <a href={item.path} data-nav class="index-card">
                <sg-heading level={3}>{item.label}</sg-heading>
                <sg-text size="sm" color="secondary">{item.description ?? ""}</sg-text>
              </a>
            {/each}
          </div>
        </div>
      {/if}
    {/each}
  {:else}
    <div class="index-grid">
      {#each items as item}
        <a href={item.path} data-nav class="index-card">
          <sg-heading level={3}>{item.label}</sg-heading>
          <sg-text size="sm" color="secondary">{item.description ?? ""}</sg-text>
        </a>
      {/each}
    </div>
  {/if}
</sg-stack>
