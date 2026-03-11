import { manifest as rawManifest } from "../../packages/components/src/manifest.js";

export type PropDescriptor = {
  type?: string;
  default?: unknown;
  description?: string;
  values?: unknown[];
  required?: boolean;
};

export type ComponentDescriptor = {
  name: string;
  category: string;
  importPath?: string;
  description?: string;
  props?: Record<string, PropDescriptor>;
  parent?: string | null;
};

export const manifest = rawManifest as unknown as ComponentDescriptor[];

export function getComponent(name: string): ComponentDescriptor | null {
  return (manifest.find((m) => m.name === name) ?? null) as ComponentDescriptor | null;
}

export function getChildren(name: string): ComponentDescriptor[] {
  return manifest.filter((m) => m.parent === name) as ComponentDescriptor[];
}
