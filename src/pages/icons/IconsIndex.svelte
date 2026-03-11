<script lang="ts">
  import { getIconCount } from "./icon-catalog.ts";
  const count = getIconCount();
</script>

<div class="section-index">
  <div class="section-header">
    <sg-heading level={1}>Icons</sg-heading>
    <sg-text size="lg" color="secondary">Browse and search {count} curated Material Symbols icons. Pick a style, adjust axes, and copy the code.</sg-text>
  </div>
  <div class="index-grid">
    <a href="/icons/browser" data-nav class="index-card">
      <sg-heading level={3} size="lg">Icon Browser</sg-heading>
      <sg-text color="muted">Search, filter, and preview icons with real-time variable font controls</sg-text>
    </a>
    <a href="/components/data-display/icon" data-nav class="index-card">
      <sg-heading level={3} size="lg">Icon Component</sg-heading>
      <sg-text color="muted">API docs, sizing, colors, and SVG/font mode examples</sg-text>
    </a>
  </div>
</div>
