import { toOklch } from "../../packages/core/src/index.js";

export function copyHex(hex: string, showToast: (msg: string) => void) {
  navigator.clipboard.writeText(hex);
  showToast(`Copied ${hex}`);
}

export function isLightColor(hex: string): boolean {
  try {
    const c = toOklch(hex);
    return c.l > 0.6;
  } catch {
    return false;
  }
}

export function round(n: number, d: number): string {
  return n.toFixed(d);
}
