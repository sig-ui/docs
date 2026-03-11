<script lang="ts">
  import { getPath } from "../../router/router.ts";

  interface Props {
    children: import("svelte").Snippet;
  }

  let { children }: Props = $props();

  let currentPath = $state(getPath());
  const isExamplesRoute = $derived(currentPath === "/examples" || currentPath.startsWith("/examples/"));

  const examples = [
    { path: "/examples/dashboard", label: "Dashboard" },
    { path: "/examples/tasks", label: "Tasks" },
    { path: "/examples/playground", label: "Playground" },
    { path: "/examples/mail", label: "Mail" },
    { path: "/examples/forms", label: "Forms" },
    { path: "/examples/rtl-cjk", label: "RTL & CJK" },
  ];

  // Update path on navigation
  import { subscribe } from "../../router/router.ts";
  import { onMount, onDestroy } from "svelte";

  let unsub: (() => void) | null = null;
  onMount(() => { unsub = subscribe((p) => currentPath = p); });
  onDestroy(() => unsub?.());
</script>

<div class="examples-layout">
  {#if isExamplesRoute}
    <nav class="examples-nav">
      <div class="examples-nav-inner">
        {#each examples as ex}
          <a
            href={ex.path}
            data-nav
            class="examples-nav-link"
            class:active={currentPath === ex.path}
          >{ex.label}</a>
        {/each}
      </div>
    </nav>
  {/if}
  <div class="examples-page-content" class:with-nav={isExamplesRoute}>
    {@render children()}
  </div>
</div>

<style>
  .examples-layout {
    display: flex;
    flex-direction: column;
    gap: 0;
    min-height: 0;
  }

  .examples-nav {
    border-bottom: var(--sg-border-thin) solid var(--sg-color-border);
    padding: 0 var(--sg-space-2);
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }

  .examples-nav::-webkit-scrollbar {
    display: none;
  }

  .examples-nav-inner {
    display: flex;
    gap: var(--sg-gap-tight);
    min-width: max-content;
  }

  .examples-nav-link {
    padding: var(--sg-pad-button-y, 0.75rem) var(--sg-pad-button-x, 1rem);
    font-size: var(--sg-text-sm);
    font-weight: var(--sg-weight-medium);
    color: var(--text-3);
    text-decoration: none;
    border-bottom: 2px solid transparent;
    transition: color var(--sg-duration-fast), border-color var(--sg-duration-fast);
    white-space: nowrap;
  }

  .examples-nav-link:hover {
    color: var(--sg-color-text);
  }

  .examples-nav-link.active {
    color: var(--sg-color-text);
    border-bottom-color: var(--sg-color-link);
  }

  .examples-page-content.with-nav {
    margin-top: var(--sg-space-5);
  }

  @media (max-width: 768px) {
    .examples-page-content.with-nav {
      margin-top: var(--sg-space-4);
    }
  }
</style>
