<script lang="ts">
  import SectionIndex from "../../layout/SectionIndex.svelte";
  import { routes } from "../../router/routes.ts";

  const philosophyRoute = routes.find((r) => r.path === "/philosophy")!;
  const items = philosophyRoute.children!.map((c) => ({
    path: c.path,
    label: c.label,
    description: c.description || "",
  }));
</script>

<SectionIndex
  title="Philosophy"
  description="The ideas behind the system. Not documentation, but the reasoning that came before it."
  {items}
/>
