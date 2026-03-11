<script lang="ts">
  import type { Snippet } from "svelte";
  import { getComponent, getChildren } from "../sg-metadata.ts";
  import PropsTable from "./PropsTable.svelte";

  interface Props {
    componentName: string;
    children: Snippet;
    notes?: Snippet;
  }

  let { componentName, children, notes }: Props = $props();

  // Resolve the manifest entry - try exact name, then try with "Root" suffix for compound components
  let comp = $derived(getComponent(componentName) ?? getComponent(componentName + "Root"));
  let compChildren = $derived(comp ? getChildren(comp.name) : []);
  let hasChildren = $derived(compChildren.length > 0);

  // Build import statement
  let importCode = $derived.by(() => {
    if (!comp) return "";
    const names = [comp.name];
    for (const child of compChildren) {
      names.push(child.name);
    }
    return `import { ${names.join(", ")} } from "${comp.importPath}";`;
  });
</script>

<sg-stack gap="separated">
  <div class="page-header">
    <sg-heading level={1}>{componentName}</sg-heading>
    {#if comp}
      <sg-text size="lg" color="secondary">{comp.description}</sg-text>
    {/if}
  </div>

  {#if importCode}
    <sg-code-block title="Import" language="typescript" code={importCode} />
  {/if}

  {@render children()}

  <PropsTable componentName={comp?.name ?? componentName} includeChildren={hasChildren} />
  {#if notes}
    {@render notes()}
  {/if}
</sg-stack>
