<script lang="ts">
  import { routes, findRoute, type Route } from "../router/routes.ts";
  import { navigate, getPath, subscribe } from "../router/router.ts";
  import { onMount, onDestroy, untrack } from "svelte";

  let currentPath = $state(getPath());
  let mobileOpen = $state(false);
  let unsub: (() => void) | null = null;
  let searchQuery = $state("");
  let searchInputRef: HTMLInputElement | null = $state(null);

  // Collapsible sidebar sections
  let expandedSections = $state(new Set<string>());

  // Flatten all leaf routes for search
  function flattenRoutes(nodes: Route[], ancestors: Route[] = []): { route: Route; ancestors: Route[] }[] {
    const result: { route: Route; ancestors: Route[] }[] = [];
    for (const node of nodes) {
      if (node.children) {
        result.push(...flattenRoutes(node.children, [...ancestors, node]));
      } else {
        result.push({ route: node, ancestors });
      }
    }
    return result;
  }

  const allLeafRoutes = flattenRoutes(routes);

  let searchResults = $derived.by(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return allLeafRoutes.filter(({ route }) =>
      route.label.toLowerCase().includes(q) ||
      (route.description ?? "").toLowerCase().includes(q)
    ).slice(0, 12);
  });

  let isSearching = $derived(searchQuery.trim().length > 0);

  $effect(() => {
    // Auto-expand all ancestor sections and the matched route itself (if it has children).
    const found = findRoute(currentPath);
    if (!found) return;
    const paths: string[] = [];
    for (const ancestor of found.ancestors) {
      if (ancestor.path === "/") continue;
      paths.push(ancestor.path);
    }
    if (found.route.children) {
      paths.push(found.route.path);
    }
    if (paths.length === 0) return;
    untrack(() => {
      const next = new Set(expandedSections);
      let changed = false;
      for (const p of paths) {
        if (!next.has(p)) { next.add(p); changed = true; }
      }
      if (changed) expandedSections = next;
    });
  });

  onMount(() => {
    unsub = subscribe((p) => { currentPath = p; mobileOpen = false; });
  });

  onDestroy(() => unsub?.());

  function isActive(route: Route): boolean {
    if (route.path === "/") return currentPath === "/";
    return currentPath === route.path || currentPath.startsWith(route.path + "/");
  }

  function isExactActive(path: string): boolean {
    return currentPath === path;
  }

  function toggleSection(route: Route) {
    if (isActive(route) && expandedSections.has(route.path)) {
      expandedSections.delete(route.path);
      // Force reactivity
      expandedSections = new Set(expandedSections);
    } else {
      expandedSections.add(route.path);
      expandedSections = new Set(expandedSections);
      navigate(route.path);
    }
  }

  function isSectionExpanded(path: string): boolean {
    return expandedSections.has(path);
  }


</script>

<button class="sidebar-hamburger" onclick={() => mobileOpen = !mobileOpen} aria-label="Toggle navigation">
  <span class="hamburger-line"></span>
  <span class="hamburger-line"></span>
  <span class="hamburger-line"></span>
</button>

{#if mobileOpen}
  <div class="sidebar-overlay" onclick={() => mobileOpen = false}></div>
{/if}

<aside class="sidebar" class:open={mobileOpen}>
  <div class="sidebar-search">
    <div class="sidebar-search-input-wrap">
      <span class="sidebar-search-icon">&#9906;</span>
      <input
        bind:this={searchInputRef}
        bind:value={searchQuery}
        type="text"
        class="sidebar-search-input"
        placeholder="Search docs..."
        aria-label="Search documentation"
        onkeydown={(e) => {
          if (e.key === "Escape") {
            searchQuery = "";
            searchInputRef?.blur();
          } else if (e.key === "Enter" && searchResults.length > 0) {
            navigate(searchResults[0].route.path);
            searchQuery = "";
          }
        }}
      />
      {#if searchQuery}
        <button class="sidebar-search-clear" onclick={() => { searchQuery = ""; searchInputRef?.focus(); }} aria-label="Clear search">&times;</button>
      {/if}
    </div>
    {#if isSearching}
      <div class="sidebar-search-results">
        {#if searchResults.length === 0}
          <div class="sidebar-search-empty">No results for "{searchQuery}"</div>
        {:else}
          {#each searchResults as { route, ancestors }}
            <a
              href={route.path}
              data-nav
              class="sidebar-search-result"
              class:active={isExactActive(route.path)}
              onclick={() => { searchQuery = ""; }}
            >
              <span class="sidebar-search-result-label">{route.label}</span>
              {#if ancestors.length > 0}
                <span class="sidebar-search-result-breadcrumb">{ancestors.map(a => a.label).join(" / ")}</span>
              {/if}
              {#if route.description}
                <span class="sidebar-search-result-desc">{route.description}</span>
              {/if}
            </a>
          {/each}
        {/if}
      </div>
    {/if}
  </div>
  <nav class="sidebar-nav">
    {#each routes as route}
      {#if route.path === "/"}
        <a
          href="/"
          data-nav
          class="sidebar-link"
          class:active={isExactActive("/")}
        >Home</a>
      {:else}
        <div class="sidebar-group" class:expanded={isSectionExpanded(route.path)}>
          <button
            class="sidebar-group-label"
            class:active={isExactActive(route.path)}
            onclick={() => toggleSection(route)}
          >
            <span>{route.label}</span>
            {#if route.children}
              <span class="sidebar-group-chevron" class:expanded={isSectionExpanded(route.path)}>&#9656;</span>
            {/if}
          </button>
          {#if route.children && isSectionExpanded(route.path)}
            <div class="sidebar-children">
              {#each route.children as child}
                {#if child.children}
                  <div class="sidebar-subgroup" class:expanded={isSectionExpanded(child.path)}>
                    <button
                      class="sidebar-subgroup-label"
                      class:active={isExactActive(child.path)}
                      onclick={() => toggleSection(child)}
                    >
                      <span>{child.label}</span>
                      <span class="sidebar-group-chevron" class:expanded={isSectionExpanded(child.path)}>&#9656;</span>
                    </button>
                    {#if isSectionExpanded(child.path)}
                      <div class="sidebar-children">
                        {#each child.children as grandchild}
                          {#if grandchild.children}
                            <div class="sidebar-subgroup" class:expanded={isSectionExpanded(grandchild.path)}>
                              <button
                                class="sidebar-subgroup-label"
                                class:active={isExactActive(grandchild.path)}
                                onclick={() => toggleSection(grandchild)}
                              >
                                <span>{grandchild.label}</span>
                                <span class="sidebar-group-chevron" class:expanded={isSectionExpanded(grandchild.path)}>&#9656;</span>
                              </button>
                              {#if isSectionExpanded(grandchild.path)}
                                <div class="sidebar-children">
                                  {#each grandchild.children as leaf}
                                    <a
                                      href={leaf.path}
                                      data-nav
                                      class="sidebar-link"
                                      class:active={isExactActive(leaf.path)}
                                    >{leaf.label}</a>
                                  {/each}
                                </div>
                              {/if}
                            </div>
                          {:else}
                            <a
                              href={grandchild.path}
                              data-nav
                              class="sidebar-link"
                              class:active={isExactActive(grandchild.path)}
                            >{grandchild.label}</a>
                          {/if}
                        {/each}
                      </div>
                    {/if}
                  </div>
                {:else}
                  <a
                    href={child.path}
                    data-nav
                    class="sidebar-link"
                    class:active={isExactActive(child.path)}
                  >{child.label}</a>
                {/if}
              {/each}
            </div>
          {/if}
        </div>
      {/if}
    {/each}
  </nav>
</aside>
