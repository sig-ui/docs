<script lang="ts">
  import SectionIndex from "../../layout/SectionIndex.svelte";
  import { routes } from "../../router/routes.ts";

  const buildRoute = routes.find((r) => r.path === "/build")!;
  const items = buildRoute.children!.map((c) => ({
    path: c.path,
    label: c.label,
    description: c.description || "",
  }));
</script>

<SectionIndex
  title="Build"
  description="Token pipeline and theming - generate CSS, JSON, and TypeScript from DTCG design tokens."
  {items}
/>
