<script lang="ts">
  import { getComponent, getChildren, type PropDescriptor, type ComponentDescriptor } from "../sg-metadata.ts";

  interface Props {
    componentName: string;
    includeChildren?: boolean;
  }

  let { componentName, includeChildren = false }: Props = $props();

  interface PropsSection {
    title: string;
    entries: { name: string; prop: PropDescriptor }[];
  }

  function buildSections(comp: ComponentDescriptor | undefined): PropsSection[] {
    if (!comp) return [];
    const sections: PropsSection[] = [];

    const entries = Object.entries(comp.props);
    const regular = entries.filter(([name]) => !name.startsWith("on"));
    const callbacks = entries.filter(([name]) => name.startsWith("on"));

    if (regular.length > 0) {
      sections.push({
        title: "Props",
        entries: regular.map(([name, prop]) => ({ name, prop })),
      });
    }

    if (callbacks.length > 0) {
      sections.push({
        title: "Callbacks",
        entries: callbacks.map(([name, prop]) => ({ name, prop })),
      });
    }

    if (includeChildren) {
      const children = getChildren(comp.name);
      for (const child of children) {
        const childEntries = Object.entries(child.props);
        if (childEntries.length > 0) {
          sections.push({
            title: `${child.name} Props`,
            entries: childEntries.map(([name, prop]) => ({ name, prop })),
          });
        }
      }
    }

    return sections;
  }

  function formatType(prop: PropDescriptor): string {
    if (prop.values && prop.values.length > 0) {
      return prop.values.map((v) => typeof v === "string" ? `"${v}"` : String(v)).join(" | ");
    }
    return prop.type;
  }

  function formatDefault(prop: PropDescriptor): string {
    if (prop.default === undefined) return "-";
    if (typeof prop.default === "string") return `"${prop.default}"`;
    return String(prop.default);
  }

  let comp = $derived(getComponent(componentName));
  let sections = $derived(buildSections(comp));
</script>

{#if sections.length > 0}
  <div class="props-table">
    {#each sections as section}
      <sg-heading level={3}>{section.title}</sg-heading>
      <div class="props-grid">
        <div class="props-header">
          <span>Prop</span><span>Type</span><span>Default</span><span>Description</span>
        </div>
        {#each section.entries as { name, prop }}
          <div class="props-row">
            <code>{name}{#if prop.required}<span class="props-required">*</span>{/if}</code>
            <span>{formatType(prop)}</span>
            <span>{formatDefault(prop)}</span>
            <span class="props-desc">{prop.description ?? ""}</span>
          </div>
        {/each}
      </div>
    {/each}
  </div>
{/if}
