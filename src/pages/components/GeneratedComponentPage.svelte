<script lang="ts">
  import { tick } from "svelte";
  import DemoBlock from "../../components/DemoBlock.svelte";
  import ComponentDocLayout from "../../components/ComponentDocLayout.svelte";
  import { rehydrateSubtree } from "../../../../packages/components/src/lib/base-element.js";

  interface GeneratedComponentConfig {
    componentName: string;
    sections: Array<{
      title: string;
      description?: string;
      examples: Array<{
        title: string;
        description?: string;
        language: string;
        code: string;
        cssCode?: string;
        preview?: boolean;
      }>;
    }>;
  }

  interface Props {
    config: GeneratedComponentConfig;
  }

  let { config }: Props = $props();
  let pageRoot: HTMLElement | null = null;
  let hljsRetryTimer: ReturnType<typeof setTimeout> | null = null;

  function normalizeRenderCode(html: string): string {
    // Strip Svelte block directives that can leak into generated HTML snippets.
    let normalized = html
      .replace(/\{#(if|each|await)[^}]*\}/g, "")
      .replace(/\{\/(if|each|await)\}/g, "")
      .replace(/\{@(?:const|html)[^}]*\}/g, "");

    normalized = stripEventHandlerAttributes(normalized);
    normalized = normalizeStaticAttributeExpressions(normalized);

    // Raw HTML parsing does not support self-closing custom elements.
    return normalized.replace(/<(sg-[a-z0-9-]+)(\s[^<>]*?)?\/>/gi, (_match, tag: string, attrs = "") => {
      return `<${tag}${attrs}></${tag}>`;
    });
  }

  function normalizeStaticAttributeExpressions(input: string): string {
    return input.replace(/\s([^\s=/>]+)=\{([^{}]+)\}/g, (_match, attrName: string, expression: string) => {
      const expr = expression.trim();

      if (/^-?(?:\d+|\d*\.\d+)$/.test(expr)) {
        return ` ${attrName}="${expr}"`;
      }

      const quoted = expr.match(/^(['"])([\s\S]*)\1$/);
      if (quoted) {
        return ` ${attrName}="${quoted[2]}"`;
      }

      if (expr === "true") {
        return ` ${attrName}`;
      }

      if (expr === "false" || expr === "null" || expr === "undefined") {
        return "";
      }

      return ` ${attrName}={${expression}}`;
    });
  }

  function stripEventHandlerAttributes(input: string): string {
    let out = "";
    let i = 0;
    while (i < input.length) {
      const ch = input[i];
      if (/\s/.test(ch)) {
        let j = i;
        while (j < input.length && /\s/.test(input[j])) j += 1;

        const nameStart = j;
        while (j < input.length && /[a-z-]/i.test(input[j])) j += 1;
        const name = input.slice(nameStart, j).toLowerCase();

        let k = j;
        while (k < input.length && /\s/.test(input[k])) k += 1;
        if (name.startsWith("on") && k < input.length && input[k] === "=") {
          k += 1;
          while (k < input.length && /\s/.test(input[k])) k += 1;
          if (k < input.length && input[k] === "{") {
            let depth = 0;
            while (k < input.length) {
              if (input[k] === "{") depth += 1;
              else if (input[k] === "}") {
                depth -= 1;
                if (depth === 0) {
                  k += 1;
                  break;
                }
              }
              k += 1;
            }
            i = k;
            continue;
          }
        }
      }
      out += ch;
      i += 1;
    }
    return out;
  }

  function hasSyntaxTokens(codeEl: HTMLElement): boolean {
    return !!codeEl.querySelector("[class*='hljs-']");
  }

  function shouldRenderPreview(example: { language: string; preview?: boolean }): boolean {
    if (example.preview === false) return false;
    return example.language === "html" || example.language === "svelte";
  }

  function codeSnippetsForExample(example: { code: string; cssCode?: string }): Array<{ title: string; code: string; language: string }> {
    const snippets = [{ title: "HTML", code: example.code, language: "html" }];
    if (example.cssCode) {
      snippets.push({ title: "CSS", code: example.cssCode, language: "css" });
    }
    return snippets;
  }

  function scopeCssToPreview(css: string, scopeClass: string): string {
    // Prefix simple selector lines so demo classes do not leak across cards.
    return css
      .split("\n")
      .map((line) => {
        const trimmed = line.trim();
        if (!trimmed.endsWith("{")) return line;
        if (trimmed.startsWith("@")) return line;
        const indent = line.match(/^\s*/)?.[0] ?? "";
        return `${indent}.${scopeClass} ${trimmed}`;
      })
      .join("\n");
  }

  function previewScopeClass(example: { title: string; code: string }): string {
    const seed = `${config.componentName}-${example.title}-${example.code.length}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return `sg-example-scope-${seed || "default"}`;
  }

  function buildPreviewMarkup(example: { title: string; code: string; cssCode?: string }): string {
    const html = normalizeRenderCode(example.code);
    if (!example.cssCode) return html;
    const scopeClass = previewScopeClass(example);
    const scopedCss = scopeCssToPreview(example.cssCode, scopeClass);
    return `<div class="${scopeClass}"><style>${scopedCss}</style>\n${html}</div>`;
  }

  async function applyInlineHighlighting(retry = true) {
    await tick();
    if (!pageRoot) return;
    const hljs = (globalThis as any).hljs;
    if (!hljs || typeof hljs.highlightElement !== "function") {
      if (retry && !hljsRetryTimer) {
        hljsRetryTimer = setTimeout(() => {
          hljsRetryTimer = null;
          void applyInlineHighlighting(false);
        }, 250);
      }
      return;
    }

    const codeBlocks = pageRoot.querySelectorAll("code.sg-code[data-lang]");
    for (const node of codeBlocks) {
      const codeEl = node as HTMLElement;
      const lang = codeEl.getAttribute("data-lang");
      if (lang && !codeEl.classList.contains(`language-${lang}`)) {
        codeEl.classList.add(`language-${lang}`);
      }
      if (hasSyntaxTokens(codeEl)) continue;
      try {
        hljs.highlightElement(codeEl);
      } catch {
        // Ignore unsupported language/runtime highlight failures.
      }
    }
  }

  $effect(() => {
    config;
    void applyInlineHighlighting();
    // Rehydrate web components rendered via {@html} so interactive elements work.
    tick().then(() => {
      if (!pageRoot) return;
      for (const demo of pageRoot.querySelectorAll(".generated-demo")) {
        rehydrateSubtree(demo);
      }
    });
    return () => {
      if (hljsRetryTimer) {
        clearTimeout(hljsRetryTimer);
        hljsRetryTimer = null;
      }
    };
  });
</script>

<div bind:this={pageRoot}>
  <ComponentDocLayout componentName={config.componentName}>
    {#each config.sections as section}
      <div class="generated-section">
        {#if config.sections.length > 1 || section.title !== "Examples"}
          <sg-stack gap="related">
            <sg-heading level={2}>{section.title}</sg-heading>
            {#if section.description}
              <sg-text color="secondary">{section.description}</sg-text>
            {/if}
          </sg-stack>
        {/if}

        {#each section.examples as example}
          <DemoBlock title={example.title} snippets={codeSnippetsForExample(example)}>
            {#if shouldRenderPreview(example)}
              {#if example.description}
                <sg-text size="sm" color="secondary">{example.description}</sg-text>
              {/if}
              <div class="generated-demo">{@html buildPreviewMarkup(example)}</div>
            {:else if example.description}
              <sg-text size="sm" color="secondary">{example.description}</sg-text>
            {/if}
          </DemoBlock>
        {/each}
      </div>
    {/each}
  </ComponentDocLayout>
</div>

<style>
  .generated-section {
    display: grid;
    gap: var(--sg-gap-grouped, 1rem);
  }

  .generated-section + .generated-section {
    margin-top: var(--sg-space-8, 2rem);
  }

  .generated-demo {
    display: grid;
    gap: var(--sg-gap-grouped, 1rem);
    align-items: start;
  }

  /* Disable container-type in demos so cards size to content instead of
     collapsing to 0 (inline-size containment zeroes intrinsic width). */
  .generated-demo :global(sg-card),
  .generated-demo :global(.sg-card) {
    container-type: normal;
  }

  /* Intrinsically-sized elements should not stretch to fill the grid. */
  .generated-demo > :global(:is(
    button, input, select, textarea, fieldset, dialog,
    label, span, code, sg-card, .sg-card
  )) {
    justify-self: start;
  }

  .generated-demo :global(*) {
    box-sizing: border-box;
  }
</style>
