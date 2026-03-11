import { getContext, setContext } from "svelte";

export type ToastContext = { add: (message: string) => void };

const TOAST_CTX = Symbol("sg-toast");

export function getToastContext(): ToastContext {
  return getContext<ToastContext>(TOAST_CTX) ?? { add: (message: string) => console.info("[sigui toast]", message) };
}

export function setToastContext(ctx: ToastContext) {
  setContext(TOAST_CTX, ctx);
}
