<script lang="ts">
  import SectionIndex from "../../layout/SectionIndex.svelte";
  import { routes } from "../../router/routes.ts";

  const colorRoute = routes.find((r) => r.path === "/color")!;
  const items = colorRoute.children!.map((c) => ({
    path: c.path,
    label: c.label,
    description: c.description || "",
  }));
</script>

<SectionIndex
  title="Color"
  description="Perceptual color science tools built on OKLCH - palette generation, manipulation, contrast checking, CVD simulation, gradients, and data visualization palettes."
  {items}
/>
