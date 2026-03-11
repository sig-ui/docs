<script lang="ts">
  import SectionIndex from "../../layout/SectionIndex.svelte";
  import { routes } from "../../router/routes.ts";

  const systemRoute = routes.find((r) => r.path === "/system")!;
  const items = systemRoute.children!.map((c) => ({
    path: c.path,
    label: c.label,
    description: c.description || "",
  }));
</script>

<SectionIndex
  title="Design System"
  description="Foundation tokens and scales - typography, spacing, elevation, and motion that form the backbone of consistent UI."
  {items}
/>
