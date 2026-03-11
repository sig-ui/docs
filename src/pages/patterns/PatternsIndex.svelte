<script lang="ts">
  import SectionIndex from "../../layout/SectionIndex.svelte";
  import { routes } from "../../router/routes.ts";

  const patternsRoute = routes.find((r) => r.path === "/patterns")!;
  const items = patternsRoute.children!.map((c) => ({
    path: c.path,
    label: c.label,
    description: c.description || "",
  }));
</script>

<SectionIndex
  title="Patterns"
  description="Interaction and state management patterns - focus handling, validation, loading states, and finite state machines for every component."
  {items}
/>
