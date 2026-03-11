import { manifest, type ComponentDescriptor } from "../sg-metadata.ts";
import { routes, type Route } from "../router/routes.ts";

/** Display groups - broader than the manifest's 7 categories. */
export type DisplayGroup = "layout" | "forms" | "data-display" | "overlays";

export interface CategoryGroup {
  key: DisplayGroup;
  label: string;
  description?: string;
  subgroups: {
    label: string;
    description?: string;
    routes: Route[];
  }[];
}

const GROUP_LABELS: Record<DisplayGroup, string> = {
  layout: "Layout",
  forms: "Forms & Actions",
  "data-display": "Data Display",
  overlays: "Overlays & Navigation",
};

const SLUG_TO_GROUP: Record<string, DisplayGroup> = {
  layout: "layout",
  forms: "forms",
  "data-display": "data-display",
  overlays: "overlays",
};

/** Map manifest category → display group. */
const CATEGORY_TO_GROUP: Record<ComponentDescriptor["category"], DisplayGroup> = {
  layout: "layout",
  basic: "forms",
  form: "forms",
  overlay: "overlays",
  navigation: "overlays",
  feedback: "data-display",
  "data-display": "data-display",
};

/** Overrides for individual components that fit better elsewhere. */
const COMPONENT_GROUP_OVERRIDE: Record<string, DisplayGroup> = {
  Card: "data-display",
};

function getDisplayGroup(comp: ComponentDescriptor): DisplayGroup {
  return COMPONENT_GROUP_OVERRIDE[comp.name] ?? CATEGORY_TO_GROUP[comp.category] ?? "data-display";
}

/** Get all component routes grouped into display groups (reads from nested route structure). */
export function getComponentsByCategory(): CategoryGroup[] {
  const componentsRoute = routes.find((r) => r.path === "/components");
  if (!componentsRoute?.children) return [];

  const groups: CategoryGroup[] = [];
  for (const sublevel of componentsRoute.children) {
    const slug = sublevel.path.split("/").pop() ?? "";
    const key = SLUG_TO_GROUP[slug];
    if (!key || !sublevel.children) continue;

    const subgroups = sublevel.children
      .filter((group) => group.children && group.children.length > 0)
      .map((group) => ({
        label: group.label,
        description: group.description,
        routes: group.children ?? [],
      }));

    if (subgroups.length === 0) {
      subgroups.push({
        label: sublevel.label,
        description: sublevel.description,
        routes: sublevel.children,
      });
    }

    groups.push({
      key,
      label: sublevel.label,
      description: sublevel.description,
      subgroups,
    });
  }
  return groups;
}

/** Get the display group for a single component name (used by category badge). */
export function getCategoryForComponent(name: string): { key: DisplayGroup; label: string } | undefined {
  const comp = manifest.find((c) => c.name === name && !c.parent)
    ?? manifest.find((c) => c.name === name + "Root" || c.name === name);
  if (!comp) return undefined;
  const group = getDisplayGroup(comp);
  return { key: group, label: GROUP_LABELS[group] };
}
