import { componentRoutes } from "../generated/component-routes.ts";

export interface Route {
  path: string;
  label: string;
  description?: string;
  children?: Route[];
}

// Non-component pages that live under /components/ but aren't generated from meta
const extraNativeRoutes: Route[] = [
  { path: "/components/native/input-variants", label: "Input Variants", description: "Date, time, file, color, and datalist inputs" },
  { path: "/components/native/dialog", label: "Dialog", description: "Baseline native dialog for non-component use" },
  { path: "/components/native/prose", label: "Prose", description: "Blockquote, figure, abbr, and inline quotation" },
];

// Merge extra routes into generated component routes
function mergeComponentRoutes(): Route[] {
  return componentRoutes.map(group => {
    if (group.path === "/components/native" && group.children) {
      const seen = new Set(group.children.map((r) => r.path));
      const extras = extraNativeRoutes.filter((r) => !seen.has(r.path));
      return { ...group, children: [...group.children, ...extras] };
    }
    return group;
  });
}

export const routes: Route[] = [
  { path: "/", label: "Home" },
  {
    path: "/philosophy",
    label: "Philosophy",
    description: "Why this design system exists and what it believes",
    children: [
      { path: "/philosophy/perception", label: "Perception", description: "How human vision shapes every decision" },
      { path: "/philosophy/constraints", label: "Constraints", description: "Why less freedom makes better interfaces" },
      { path: "/philosophy/accessibility", label: "Accessibility", description: "Making exclusion a compile error" },
      { path: "/philosophy/modern-stack", label: "The Modern Stack", description: "Platform-native, zero-dependency architecture for 2026" },
      { path: "/philosophy/derivation", label: "Derivation", description: "Every token has a reason" },
    ],
  },
  {
    path: "/color",
    label: "Color",
    description: "Perceptual color science tools",
    children: [
      { path: "/color/palette", label: "Palette Generator", description: "Shade ramps, theme generation, data viz scales, and gradients" },
      { path: "/color/manipulate", label: "Color Manipulation", description: "Lighten, darken, saturate, and shift hues in OKLCH" },
      { path: "/color/accessibility", label: "Accessibility", description: "Contrast checking and color vision deficiency simulation" },
    ],
  },
  {
    path: "/system",
    label: "Design System",
    description: "Foundation tokens and scales",
    children: [
      { path: "/system/theme", label: "Theme Generator", description: "Configure aesthetic axes and preview a fully resolved design system theme" },
      { path: "/system/typography", label: "Typography", description: "Type scales, fluid sizing, line height, and measure" },
      { path: "/system/spacing", label: "Spacing & Layout", description: "Spatial tokens, density modes, grids, and breakpoints" },
      { path: "/system/elevation", label: "Elevation & Depth", description: "Shadows, z-index, borders, and surface materials" },
      { path: "/system/motion", label: "Motion", description: "Duration, easing, spring presets, and transitions" },
    ],
  },
  {
    path: "/patterns",
    label: "Patterns",
    description: "Interaction and state patterns",
    children: [
      { path: "/patterns/interactive", label: "Interactive States", description: "Focus, hover, validation, and loading patterns" },
      { path: "/patterns/machines", label: "State Machines", description: "FSM definitions for every UI component" },
    ],
  },
  {
    path: "/examples",
    label: "Examples",
    description: "Full-page application examples built with SigUI",
    children: [
      { path: "/examples/dashboard", label: "Dashboard", description: "Analytics dashboard with charts and team activity" },
      { path: "/examples/tasks", label: "Tasks", description: "Issue tracker with filters, statuses, and bulk actions" },
      { path: "/examples/playground", label: "Playground", description: "Interactive component playground with live controls" },
      { path: "/examples/mail", label: "Mail", description: "Mail client interface with folders, list, and detail pane" },
      { path: "/examples/forms", label: "Forms", description: "Form-heavy flows with validation and grouped fields" },
      { path: "/examples/rtl-cjk", label: "RTL & CJK", description: "BiDi and CJK typography/layout compatibility sample" },
    ],
  },
  {
    path: "/components",
    label: "Components",
    description: "Svelte 5 component library",
    children: mergeComponentRoutes(),
  },
  {
    path: "/icons",
    label: "Icons",
    description: "Browse and search Material Symbols icons",
    children: [
      { path: "/icons/browser", label: "Icon Browser", description: "Search, filter, and preview icons with variable font controls" },
    ],
  },
  {
    path: "/build",
    label: "Build",
    description: "Token pipeline and theming",
    children: [
      { path: "/build/tokens", label: "Design Tokens & Theming", description: "DTCG build pipeline with CSS, JSON, and TypeScript output" },
    ],
  },
];

/** Find a route and its ancestors by path (recursive, supports any depth) */
export function findRoute(path: string): { route: Route; ancestors: Route[] } | null {
  function search(nodes: Route[], ancestors: Route[]): { route: Route; ancestors: Route[] } | null {
    for (const node of nodes) {
      if (node.path === path) return { route: node, ancestors };
      if (node.children) {
        const found = search(node.children, [...ancestors, node]);
        if (found) return found;
      }
    }
    return null;
  }
  return search(routes, []);
}

/** Get breadcrumb trail for a path */
export function getBreadcrumbs(path: string): { path: string; label: string }[] {
  const crumbs: { path: string; label: string }[] = [{ path: "/", label: "Home" }];
  const found = findRoute(path);
  if (!found || path === "/") return crumbs;
  for (const ancestor of found.ancestors) {
    if (ancestor.path === "/") continue;
    crumbs.push({ path: ancestor.path, label: ancestor.label });
  }
  crumbs.push({ path: found.route.path, label: found.route.label });
  return crumbs;
}
