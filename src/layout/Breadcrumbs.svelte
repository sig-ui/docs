<script lang="ts">
  import { getBreadcrumbs } from "../router/routes.ts";
  import { getPath, subscribe } from "../router/router.ts";
  import { onMount, onDestroy } from "svelte";
  let currentPath = $state(getPath());
  let unsub: (() => void) | null = null;

  onMount(() => {
    unsub = subscribe((p) => { currentPath = p; });
  });

  onDestroy(() => unsub?.());

  let crumbs = $derived(getBreadcrumbs(currentPath));
</script>

{#if crumbs.length > 1}
  <nav class="breadcrumbs" aria-label="Breadcrumb">
    {#each crumbs as crumb, i}
      {#if i > 0}
        <sg-text as="span" size="base" color="muted">/</sg-text>
      {/if}
      {#if i === crumbs.length - 1}
        <sg-text as="span" size="base" color="secondary">{crumb.label}</sg-text>
      {:else}
        <a href={crumb.path} data-nav class="breadcrumb-link">{crumb.label}</a>
      {/if}
    {/each}
  </nav>
{/if}
