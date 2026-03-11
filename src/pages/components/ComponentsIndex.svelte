<script lang="ts">
  import { getComponentsByCategory } from "../../utils/componentCategories.ts";
  const categoryGroups = getComponentsByCategory();
</script>

<div class="section-index">
  <div class="section-header">
    <sg-heading level={1}>Components</sg-heading>
    <sg-text size="lg" color="secondary">Web Components organized by category and use-case so common patterns are faster to find.</sg-text>
  </div>
  {#each categoryGroups as group}
    <div class="index-category-group">
      <sg-heading level={2} size="lg">{group.label}</sg-heading>
      {#if group.description}
        <sg-text color="secondary">{group.description}</sg-text>
      {/if}
      {#each group.subgroups as subgroup}
        <div class="index-subgroup">
          <sg-heading level={3}>{subgroup.label}</sg-heading>
          {#if subgroup.description}
            <sg-text size="sm" color="muted">{subgroup.description}</sg-text>
          {/if}
          <div class="index-grid">
            {#each subgroup.routes as item}
              <a href={item.path} data-nav class="index-card">
                <sg-heading level={3} size="lg">{item.label}</sg-heading>
                <sg-text color="muted">{item.description || ""}</sg-text>
              </a>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  {/each}
</div>
