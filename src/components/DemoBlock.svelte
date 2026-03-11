<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    code?: string;
    language?: string;
    snippets?: Array<{
      title: string;
      code: string;
      language: string;
    }>;
    title?: string;
    children?: Snippet;
  }

  let { code = "", language = "svelte", snippets = [], title, children }: Props = $props();
  let htmlSnippet = $derived(snippets.find((snippet) => snippet.language === "html"));
  let cssSnippet = $derived(snippets.find((snippet) => snippet.language === "css"));
</script>

<sg-card elevation={0}>
  {#if title}
    <sg-card-header>
      <sg-heading level={3} size="lg">{title}</sg-heading>
    </sg-card-header>
  {/if}
  <sg-card-body>
    {#if children}
      {@render children()}
    {/if}
  </sg-card-body>
  {#if snippets.length > 0}
    <div class="snippet-container">
    {#if htmlSnippet && cssSnippet}
      <div class="snippet-split">
        <div class="html-snippet">
          <sg-code-block title={htmlSnippet.title} code={htmlSnippet.code} language={htmlSnippet.language} />
        </div>
        <div class="css-snippet">
          <sg-code-block title={cssSnippet.title} code={cssSnippet.code} language={cssSnippet.language} />
        </div>
      </div>
    {:else}
      <sg-stack gap="related">
        {#each snippets as snippet}
          <div class:css-snippet={snippet.language === "css"}>
            <sg-code-block title={snippet.title} code={snippet.code} language={snippet.language} />
          </div>
        {/each}
      </sg-stack>
    {/if}
    </div>
  {:else if code}
    <sg-code-block {code} {language} />
  {/if}
</sg-card>

<style>
  .snippet-container {
    container-type: inline-size;
  }

  .snippet-split {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 0;
    align-items: stretch;
    width: 100%;
  }

  .snippet-split > div {
    display: flex;
    min-width: 0;
  }

  @container (max-width: 900px) {
    .snippet-split {
      grid-template-columns: 1fr;
    }
  }

  .snippet-split .html-snippet :global(sg-code-block),
  .snippet-split .css-snippet :global(sg-code-block) {
    flex: 1 1 auto;
    width: 100%;
    max-height: 24rem;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .snippet-split .html-snippet :global(.sg-code-block-pre),
  .snippet-split .css-snippet :global(.sg-code-block-pre) {
    flex: 1;
    min-height: 0;
    max-height: none;
    overflow: auto;
  }
</style>
