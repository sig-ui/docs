export interface ThemePreset {
  id: string;
  label: string;
  brand: string;
  appearance: "light" | "dark";
  motion: "instant" | "snappy" | "smooth" | "playful";
  css: string;
}

export const PRESETS: ThemePreset[] = [
  {
    id: "default",
    label: "Default",
    brand: "",
    appearance: "light",
    motion: "smooth",
    css: `
      --sg-font-family: system-ui, -apple-system, sans-serif;
      --sg-font-mono: ui-monospace, 'Cascadia Code', monospace;
      --sg-radius-sm: 0.25rem;
      --sg-radius-md: 0.5rem;
      --sg-radius-lg: 0.75rem;
      --sg-radius-xl: 1rem;
      --sg-radius-2xl: 1.5rem;
      --sg-radius-full: 9999px;
      --sg-shadow-xs: 0px 0.5px 1px -0.25px rgba(0,0,0,0.08), 0px 0px 2px 0px rgba(0,0,0,0.06);
      --sg-shadow-sm: 0px 1px 2px -0.5px rgba(0,0,0,0.08), 0px 0px 4px 0px rgba(0,0,0,0.06);
      --sg-shadow-md: 0px 1.5px 3px -0.75px rgba(0,0,0,0.08), 0px 0px 6px 0px rgba(0,0,0,0.06);
      --sg-shadow-lg: 0px 2px 4px -1px rgba(0,0,0,0.08), 0px 0px 8px 0px rgba(0,0,0,0.06);
      --sg-shadow-xl: 0px 2.5px 5px -1.25px rgba(0,0,0,0.08), 0px 0px 10px 0px rgba(0,0,0,0.06);
    `,
  },
  {
    id: "sleek",
    label: "Sleek",
    brand: "#007AFF",
    appearance: "light",
    motion: "smooth",
    css: `
      --sg-font-family: -apple-system, 'SF Pro Display', 'SF Pro Text', system-ui, sans-serif;
      --sg-font-mono: 'SF Mono', ui-monospace, monospace;
      --sg-radius-sm: 0.375rem;
      --sg-radius-md: 0.625rem;
      --sg-radius-lg: 0.875rem;
      --sg-radius-xl: 1.25rem;
      --sg-radius-2xl: 1.75rem;
      --sg-radius-full: 9999px;
      --sg-shadow-xs: 0px 0.5px 1.5px -0.5px rgba(0,0,0,0.04), 0px 0px 2px 0px rgba(0,0,0,0.03);
      --sg-shadow-sm: 0px 1px 3px -1px rgba(0,0,0,0.05), 0px 0px 4px 0px rgba(0,0,0,0.03);
      --sg-shadow-md: 0px 2px 5px -1.5px rgba(0,0,0,0.05), 0px 0px 6px 0px rgba(0,0,0,0.03);
      --sg-shadow-lg: 0px 3px 8px -2px rgba(0,0,0,0.05), 0px 0px 10px 0px rgba(0,0,0,0.03);
      --sg-shadow-xl: 0px 4px 12px -3px rgba(0,0,0,0.05), 0px 0px 14px 0px rgba(0,0,0,0.03);
    `,
  },
  {
    id: "terminal",
    label: "Terminal",
    brand: "#D97706",
    appearance: "dark",
    motion: "instant",
    css: `
      --sg-font-family: ui-monospace, 'Cascadia Code', 'JetBrains Mono', monospace;
      --sg-font-mono: ui-monospace, 'Cascadia Code', 'JetBrains Mono', monospace;
      --sg-radius-sm: 0;
      --sg-radius-md: 0;
      --sg-radius-lg: 0;
      --sg-radius-xl: 0;
      --sg-radius-2xl: 0;
      --sg-radius-full: 0;
      --sg-shadow-xs: none;
      --sg-shadow-sm: none;
      --sg-shadow-md: none;
      --sg-shadow-lg: none;
      --sg-shadow-xl: none;
    `,
  },
  {
    id: "doom64",
    label: "Doom 64",
    brand: "#CC0000",
    appearance: "dark",
    motion: "snappy",
    css: `
      --sg-font-family: ui-monospace, 'Cascadia Code', monospace;
      --sg-font-mono: ui-monospace, 'Cascadia Code', monospace;
      --sg-radius-sm: 0;
      --sg-radius-md: 0;
      --sg-radius-lg: 2px;
      --sg-radius-xl: 2px;
      --sg-radius-2xl: 2px;
      --sg-radius-full: 2px;
      --sg-shadow-xs: 0 1px 2px 0 rgba(0,0,0,0.3), 0 0 4px 0 rgba(200,0,0,0.1);
      --sg-shadow-sm: 0 2px 4px 0 rgba(0,0,0,0.35), 0 0 6px 0 rgba(200,0,0,0.12);
      --sg-shadow-md: 0 3px 8px -1px rgba(0,0,0,0.4), 0 0 10px 0 rgba(200,0,0,0.15);
      --sg-shadow-lg: 0 4px 12px -1px rgba(0,0,0,0.45), 0 0 16px 0 rgba(200,0,0,0.18);
      --sg-shadow-xl: 0 6px 20px -2px rgba(0,0,0,0.5), 0 0 24px 0 rgba(200,0,0,0.2);
    `,
  },
];

const STYLE_ID = "sg-preset-runtime";

export function applyPresetCSS(preset: ThemePreset | null): void {
  if (typeof document === "undefined") return;
  const existing = document.getElementById(STYLE_ID);
  if (existing) existing.remove();
  if (!preset || !preset.css.trim()) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `:root {\n${preset.css}\n}`;
  document.head.appendChild(style);
}

export function removePresetCSS(): void {
  if (typeof document === "undefined") return;
  document.getElementById(STYLE_ID)?.remove();
}

export function findPreset(id: string): ThemePreset | undefined {
  return PRESETS.find((p) => p.id === id);
}
