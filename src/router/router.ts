type Listener = (path: string) => void;

let listeners: Listener[] = [];
let currentPath = "/";

export function getPath(): string {
  return currentPath;
}

export function navigate(path: string) {
  if (path === currentPath) return;
  currentPath = path;
  history.pushState(null, "", path);
  notify();
}

export function subscribe(fn: Listener): () => void {
  listeners.push(fn);
  return () => {
    listeners = listeners.filter((l) => l !== fn);
  };
}

function notify() {
  for (const fn of listeners) fn(currentPath);
}

function handlePopState() {
  currentPath = location.pathname;
  notify();
}

function handleClick(e: MouseEvent) {
  const anchor = (e.target as Element).closest("[data-nav]");
  if (!anchor) return;
  const href = anchor.getAttribute("href") ?? (anchor as HTMLAnchorElement).href;
  if (!href || href.startsWith("http")) return;
  e.preventDefault();
  navigate(href);
}

export function init() {
  currentPath = location.pathname;
  window.addEventListener("popstate", handlePopState);
  document.addEventListener("click", handleClick);
}
