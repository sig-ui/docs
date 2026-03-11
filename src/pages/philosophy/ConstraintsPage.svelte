<script lang="ts">
  // Interactive state machine
  type MState = "idle" | "loading" | "error" | "disabled";
  let machineState = $state<MState>("idle");

  const transitions: Record<MState, { event: string; target: MState }[]> = {
    idle:     [{ event: "SUBMIT", target: "loading" }, { event: "DISABLE", target: "disabled" }],
    loading:  [{ event: "SUCCESS", target: "idle" }, { event: "FAIL", target: "error" }],
    error:    [{ event: "RETRY", target: "loading" }, { event: "DISMISS", target: "idle" }],
    disabled: [{ event: "ENABLE", target: "idle" }],
  };

  function fire(event: string) {
    const t = transitions[machineState].find(tr => tr.event === event);
    if (t) machineState = t.target;
  }

  // Boolean chaos
  let bLoading = $state(false);
  let bDisabled = $state(false);
  let bError = $state(false);
  let boolChaos = $derived([bLoading, bDisabled, bError].filter(Boolean).length >= 2);
</script>

<div class="page">
  <div class="page-header">
    <sg-heading level={1}>Constraints</sg-heading>
    <sg-text size="lg" color="secondary">Less freedom, better interfaces. Toggle the booleans. Click the state machine. Feel the difference.</sg-text>
  </div>

  <!-- Boolean vs FSM -->
  <div class="subsection">
    <sg-heading level={3} size="lg">Booleans vs. state machines</sg-heading>
    <sg-text size="lg" color="secondary" style="margin-bottom: var(--sg-space-5)">
      Three booleans = eight combinations. Most are nonsense. A state machine has only designed states.
    </sg-text>

    <div class="phil-vs-grid">
      <!-- Boolean panel -->
      <div class="card">
        <span class="card-label" style="color: var(--sg-color-danger)">Boolean props (2&sup3; = 8 states)</span>
        <div class="phil-toggles">
          <input type="checkbox" class="sg-checkbox" checked={bLoading} oninput={(e) => { const el = e.currentTarget as any; bLoading = (el.checked ?? bLoading); }} onchange={(e) => { const el = e.currentTarget as any; bLoading = (el.checked ?? bLoading); }} onclick={(e) => { const el = e.currentTarget as any; bLoading = (el.checked ?? bLoading); }} ontoggle={(e) => { const el = e.currentTarget as any; bLoading = (el.checked ?? bLoading); }} />
          <input type="checkbox" class="sg-checkbox" checked={bDisabled} oninput={(e) => { const el = e.currentTarget as any; bDisabled = (el.checked ?? bDisabled); }} onchange={(e) => { const el = e.currentTarget as any; bDisabled = (el.checked ?? bDisabled); }} onclick={(e) => { const el = e.currentTarget as any; bDisabled = (el.checked ?? bDisabled); }} ontoggle={(e) => { const el = e.currentTarget as any; bDisabled = (el.checked ?? bDisabled); }} />
          <input type="checkbox" class="sg-checkbox" checked={bError} oninput={(e) => { const el = e.currentTarget as any; bError = (el.checked ?? bError); }} onchange={(e) => { const el = e.currentTarget as any; bError = (el.checked ?? bError); }} onclick={(e) => { const el = e.currentTarget as any; bError = (el.checked ?? bError); }} ontoggle={(e) => { const el = e.currentTarget as any; bError = (el.checked ?? bError); }} />
        </div>
        <div class="phil-mock-btn-wrap" class:phil-chaos={boolChaos}>
          <button class="phil-mock-btn" class:loading={bLoading} class:error={bError} disabled={bDisabled}>
            {#if bLoading && bError}Loading... and errored?{:else if bLoading && bDisabled}Loading but disabled?{:else if bLoading}Loading...{:else if bError}Error!{:else if bDisabled}Disabled{:else}Submit{/if}
          </button>
          {#if boolChaos}
            <span class="phil-chaos-msg">This state was never designed.</span>
          {/if}
        </div>
      </div>

      <!-- FSM panel -->
      <div class="card">
        <span class="card-label" style="color: var(--sg-color-success)">State machine (4 states, explicit transitions)</span>
        <div class="phil-fsm-nodes">
          {#each (["idle", "loading", "error", "disabled"] as MState[]) as s}
            <span class="phil-fsm-node" class:active={machineState === s} data-state={s}>{s}</span>
          {/each}
        </div>
        <div class="phil-fsm-btns">
          {#each transitions[machineState] as { event }}
            <button class="sg-button" data-color="secondary" onclick={() => fire(event)}>{event}</button>
          {/each}
        </div>
        <div class="phil-mock-btn-wrap">
          <button class="phil-mock-btn" class:loading={machineState === "loading"} class:error={machineState === "error"} disabled={machineState === "disabled"}>
            {#if machineState === "loading"}Loading...{:else if machineState === "error"}Error!{:else if machineState === "disabled"}Disabled{:else}Submit{/if}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Type tree -->
  <div class="subsection">
    <sg-heading level={3} size="lg">Discriminated unions</sg-heading>
    <sg-text size="lg" color="secondary" style="margin-bottom: var(--sg-space-5)">
      A Button is either a <code>&lt;button&gt;</code> or an <code>&lt;a&gt;</code>. The type system decides. No ambiguity.
    </sg-text>

    <div class="phil-type-tree">
      <div class="phil-type-root"><code>ButtonProps</code></div>
      <div class="phil-type-branches">
        <div class="card phil-type-ok">
          <code style="color: var(--sg-color-success)">ButtonAsButton</code>
          <span class="phil-type-props">onclick, type, disabled</span>
          <em class="phil-type-renders">Renders &lt;button&gt;</em>
        </div>
        <div class="card phil-type-ok">
          <code style="color: var(--sg-color-success)">ButtonAsLink</code>
          <span class="phil-type-props">href, target, rel</span>
          <em class="phil-type-renders">Renders &lt;a&gt;</em>
        </div>
        <div class="card phil-type-err">
          <code style="color: var(--sg-color-danger)">href + onclick?</code>
          <span class="phil-type-props phil-strike">No valid type</span>
          <em class="phil-type-renders" style="color: var(--sg-color-danger)">Type error</em>
        </div>
      </div>
    </div>
  </div>

  <!-- Constrained variants -->
  <div class="subsection">
    <sg-heading level={3} size="lg">Constrained variants</sg-heading>
    <div class="phil-variant-row">
      <code style="font-size: var(--sg-text-sm); color: var(--sg-color-text-muted, var(--sg-color-text-secondary)); margin-bottom: var(--sg-space-2); display: block">Size = "sm" | "md" | "lg"</code>
      <div style="display: flex; gap: var(--sg-space-3); align-items: end; flex-wrap: wrap">
        <button class="phil-mock-btn" style="height: var(--sg-space-8); font-size: var(--sg-text-xs); padding: 0 var(--sg-space-3)">sm (32px)</button>
        <button class="phil-mock-btn" style="height: var(--sg-space-10); font-size: var(--sg-text-sm); padding: 0 var(--sg-space-4)">md (40px)</button>
        <button class="phil-mock-btn" style="height: var(--sg-space-12); font-size: var(--sg-text-sm); padding: 0 var(--sg-space-5)">lg (48px)</button>
      </div>
    </div>
    <div class="phil-variant-row" style="margin-top: var(--sg-space-4)">
      <code style="font-size: var(--sg-text-sm); color: var(--sg-color-text-muted, var(--sg-color-text-secondary)); margin-bottom: var(--sg-space-2); display: block">ColorVariant = "primary" | "secondary" | "success" | "warning" | "danger"</code>
      <div style="display: flex; gap: var(--sg-gap-related); flex-wrap: wrap">
        <button class="phil-mock-btn" style="background: var(--sg-color-border-focus); color: var(--sg-color-text-inverse, white); border-color: var(--sg-color-border-focus)">primary</button>
        <button class="phil-mock-btn">secondary</button>
        <button class="phil-mock-btn" style="background: var(--sg-color-success); color: var(--sg-color-text-inverse, white); border-color: transparent">success</button>
        <button class="phil-mock-btn" style="background: var(--sg-color-warning); color: var(--sg-color-text-on-warning, black); border-color: transparent">warning</button>
        <button class="phil-mock-btn" style="background: var(--sg-color-danger); color: var(--sg-color-text-inverse, white); border-color: transparent">danger</button>
      </div>
    </div>
  </div>

  <!-- Required a11y -->
  <div class="subsection">
    <sg-heading level={3} size="lg">Required accessibility</sg-heading>
    <sg-text size="lg" color="secondary" style="margin-bottom: var(--sg-space-4)">A Dialog without a label is a type error. The code does not compile.</sg-text>
    <div class="phil-enforce-grid">
      <div class="card" style="border-color: var(--sg-color-danger)">
        <span class="card-label" style="color: var(--sg-color-danger)">&#10007; Won't compile</span>
        <sg-code-block language="svelte" code={`<Dialog open>
  <p>Delete this item?</p>
</Dialog>
<!-- Missing aria-label -->`} />
      </div>
      <div class="card" style="border-color: var(--sg-color-success)">
        <span class="card-label" style="color: var(--sg-color-success)">&#10003; Compiles</span>
        <sg-code-block language="svelte" code={`<Dialog open aria-label="Confirm deletion">
  <p>Delete this item?</p>
</Dialog>`} />
      </div>
    </div>
  </div>
</div>

<style>
  .phil-vs-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--sg-gap-grouped);
  }

  .phil-toggles {
    display: flex;
    gap: var(--sg-gap-grouped);
    margin-bottom: var(--sg-space-4);
  }

  .phil-toggle-label {
    display: flex;
    align-items: center;
    gap: var(--sg-space-1-5);
    font-size: var(--sg-text-sm);
    cursor: pointer;
  }

  .phil-mock-btn-wrap {
    margin-top: var(--sg-space-4);
    padding: var(--sg-space-4);
    border-radius: var(--sg-radius-md);
    background: var(--sg-color-bg-secondary, var(--sg-surface-container-high));
    text-align: center;
    transition: background var(--sg-duration-normal);
  }

  .phil-chaos {
    background: oklch(0.95 0.04 25);
    border: 1px dashed var(--sg-color-danger);
  }

  .phil-chaos-msg {
    display: block;
    font-size: var(--sg-text-sm);
    color: var(--sg-color-danger);
    margin-top: var(--sg-space-2);
    font-weight: var(--sg-weight-semibold);
  }

  .phil-mock-btn {
    padding: var(--sg-space-2) var(--sg-space-5);
    border-radius: var(--sg-radius-md);
    border: var(--sg-border-thin) solid var(--sg-color-border-default, var(--sg-color-border));
    background: var(--sg-color-bg-primary, var(--sg-bg));
    color: var(--sg-color-text-primary, var(--sg-color-text));
    font-size: var(--sg-text-sm);
    cursor: pointer;
    transition: all var(--sg-duration-fast);
  }

  .phil-mock-btn.loading {
    opacity: 0.6;
    cursor: wait;
  }

  .phil-mock-btn.error {
    border-color: var(--sg-color-danger);
    color: var(--sg-color-danger);
  }

  .phil-mock-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  .phil-fsm-nodes {
    display: flex;
    gap: var(--sg-gap-related);
    margin-bottom: var(--sg-space-3);
    flex-wrap: wrap;
  }

  .phil-fsm-node {
    padding: var(--sg-space-1-5) var(--sg-space-4);
    border-radius: var(--sg-radius-full);
    font-size: var(--sg-text-sm);
    font-weight: var(--sg-weight-semibold);
    border: var(--sg-border-thin) solid var(--sg-color-border-default, var(--sg-color-border));
    background: var(--sg-color-bg-primary, var(--sg-bg));
    color: var(--sg-color-text-muted, var(--sg-color-text-secondary));
    transition: all var(--sg-duration-fast);
  }

  .phil-fsm-node.active {
    background: var(--sg-color-action-primary, var(--sg-color-border-focus));
    color: var(--sg-color-text-inverse, white);
    border-color: var(--sg-color-action-primary, var(--sg-color-border-focus));
  }

  .phil-fsm-btns {
    display: flex;
    gap: var(--sg-space-1-5);
    flex-wrap: wrap;
  }

  .phil-type-tree {
    margin-top: var(--sg-space-2);
  }

  .phil-type-root {
    text-align: center;
    font-size: var(--sg-text-base);
    font-weight: var(--sg-weight-semibold);
    margin-bottom: var(--sg-space-4);
    color: var(--sg-color-text-primary, var(--sg-color-text));
  }

  .phil-type-branches {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--sg-gap-related);
  }

  .phil-type-ok {
    border-color: var(--sg-color-success);
  }

  .phil-type-err {
    border-color: var(--sg-color-danger);
    opacity: 0.7;
  }

  .phil-type-props {
    display: block;
    font-size: var(--sg-text-xs);
    color: var(--sg-color-text-muted, var(--sg-color-text-secondary));
    margin: var(--sg-space-1-5) 0;
  }

  .phil-type-renders {
    display: block;
    font-size: var(--sg-text-xs);
    font-style: italic;
    color: var(--sg-color-text-muted, var(--sg-color-text-secondary));
  }

  .phil-strike {
    text-decoration: line-through;
  }

  .phil-variant-row {
    padding: var(--sg-space-4) 0;
  }

  .phil-enforce-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--sg-gap-related);
  }

  @media (max-width: 768px) {
    .phil-vs-grid { grid-template-columns: 1fr; }
    .phil-type-branches { grid-template-columns: 1fr; }
    .phil-enforce-grid { grid-template-columns: 1fr; }
  }
</style>
