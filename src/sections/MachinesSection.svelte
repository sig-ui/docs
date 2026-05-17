<script lang="ts">
  import {
    createMachine,
    buttonMachine,
    dialogMachine,
    selectMachine,
    checkboxMachine,
    tabsMachine,
    accordionMachine,
    popoverMachine,
    tooltipMachine,
    menuMachine,
    sliderMachine,
    toastMachine,
  } from "../../../packages/core/src/machines/index.js";
  import type { MachineDefinition } from "../../../packages/core/src/machines/types.js";

  const descriptions: Record<string, string> = {
    button: "Press, release, and async loading states",
    dialog: "Modal overlay with open/close animation cycle",
    select: "Dropdown selection with focus management",
    checkbox: "Tri-state check: unchecked, checked, indeterminate",
    tabs: "Tab selection with keyboard navigation",
    accordion: "Expand/collapse panels, single or multiple",
    popover: "Floating content with animation lifecycle",
    tooltip: "Delayed show/hide on hover and focus",
    menu: "Dropdown menu with focus tracking",
    slider: "Drag and keyboard value adjustment",
    toast: "Timed notification with enter/exit animations",
  };

  const allMachines = [
    { name: "button", def: buttonMachine },
    { name: "dialog", def: dialogMachine },
    { name: "select", def: selectMachine },
    { name: "checkbox", def: checkboxMachine },
    { name: "tabs", def: tabsMachine },
    { name: "accordion", def: accordionMachine },
    { name: "popover", def: popoverMachine },
    { name: "tooltip", def: tooltipMachine },
    { name: "menu", def: menuMachine },
    { name: "slider", def: sliderMachine },
    { name: "toast", def: toastMachine },
  ];

  interface Transition { event: string; target: string; guard?: string; }
  type TransitionMap = Record<string, Transition[]>;

  function buildTransitionMap(def: MachineDefinition<any, any, any>): TransitionMap {
    const map: TransitionMap = {};
    for (const [stateName, node] of Object.entries(def.states)) {
      const transitions: Transition[] = [];
      if (node?.on) {
        for (const [event, trans] of Object.entries(node.on)) {
          if (typeof trans === "string") {
            transitions.push({ event, target: trans });
          } else if (trans && typeof trans === "object" && "target" in trans) {
            transitions.push({ event, target: (trans as any).target, guard: (trans as any).guard });
          }
        }
      }
      map[stateName] = transitions;
    }
    return map;
  }

  const transitionMaps = allMachines.map(m => buildTransitionMap(m.def));

  let instances = allMachines.map(m => createMachine(m.def));

  let machines = $state(
    allMachines.map((m, i) => ({
      name: m.name,
      state: instances[i].state,
      context: { ...instances[i].context } as Record<string, unknown>,
      states: Object.keys(m.def.states),
      trail: [] as { from: string; event: string; to: string }[],
    }))
  );

  function sendEvent(index: number, event: string) {
    const prev = machines[index].state;
    instances[index].send(event as any);
    const next = instances[index].state;
    machines[index].state = next;
    machines[index].context = { ...instances[index].context };
    if (prev !== next || transitionMaps[index][prev]?.some(t => t.event === event && t.target === next)) {
      const trail = [...machines[index].trail, { from: prev, event, to: next }];
      machines[index].trail = trail.slice(-5);
    }
  }

  function resetMachine(index: number) {
    instances[index] = createMachine(allMachines[index].def);
    machines[index].state = instances[index].state;
    machines[index].context = { ...instances[index].context };
    machines[index].trail = [];
  }
</script>

<sg-section id="machines" title="State Machines">
  <p>
    Pure TypeScript FSM definitions for component behavior.
    <code>createMachine()</code> interprets definitions at runtime.
    Click any transition to drive the machine forward.
  </p>

  <div class="machines-grid">
    {#each machines as machine, i}
      {@const tmap = transitionMaps[i]}
      {@const currentTransitions = tmap[machine.state] ?? []}
      {@const hasContext = Object.keys(machine.context).length > 0}

      <div class="machine-card">
        <!-- Header -->
        <div class="machine-header">
          <div>
            <h4 class="machine-name">{machine.name}</h4>
            <p class="machine-desc">{descriptions[machine.name] ?? ""}</p>
          </div>
          <button class="reset-btn" onclick={() => resetMachine(i)} title="Reset to initial state">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
            </svg>
          </button>
        </div>

        <!-- State flow: all states as a visual chain -->
        <div class="state-flow">
          {#each machine.states as s, si}
            <span
              class="state-node"
              class:state-current={machine.state === s}
              class:state-reachable={currentTransitions.some(t => t.target === s)}
            >
              <span class="state-dot"></span>
              {s}
            </span>
            {#if si < machine.states.length - 1}
              <span class="state-arrow">→</span>
            {/if}
          {/each}
        </div>

        <!-- Transition table: grouped by state -->
        <div class="transition-table">
          {#each machine.states as s}
            {@const trans = tmap[s] ?? []}
            {#if trans.length > 0}
              <div class="transition-row" class:transition-row-active={machine.state === s}>
                <span class="transition-state-label">
                  {#if machine.state === s}<span class="current-marker">▸</span>{/if}
                  {s}
                </span>
                <div class="transition-events">
                  {#each trans as t}
                    <button
                      class="transition-btn"
                      class:transition-available={machine.state === s}
                      disabled={machine.state !== s}
                      onclick={() => sendEvent(i, t.event)}
                      title={machine.state === s ? `Send ${t.event}` : `Available from "${s}"`}
                    >
                      <span class="transition-event-name">{t.event}</span>
                      <span class="transition-arrow-label">→</span>
                      <span class="transition-target">{t.target}</span>
                      {#if t.guard}
                        <span class="transition-guard" title={`Guard: ${t.guard}`}>🛡</span>
                      {/if}
                    </button>
                  {/each}
                </div>
              </div>
            {/if}
          {/each}
        </div>

        <!-- Context -->
        {#if hasContext}
          <div class="context-section">
            <span class="section-label">Context</span>
            <div class="context-pairs">
              {#each Object.entries(machine.context) as [key, val]}
                <div class="context-pair">
                  <span class="context-key">{key}</span>
                  <span class="context-val">{JSON.stringify(val)}</span>
                </div>
              {/each}
            </div>
          </div>
        {/if}

        <!-- Transition trail -->
        {#if machine.trail.length > 0}
          <div class="trail-section">
            <span class="section-label">History</span>
            <div class="trail">
              {#each machine.trail as step, si}
                {#if si === 0}<span class="trail-state">{step.from}</span>{/if}
                <span class="trail-event">{step.event}</span>
                <span class="trail-state" class:trail-state-current={si === machine.trail.length - 1}>{step.to}</span>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    {/each}
  </div>
</sg-section>

<style>
.machines-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: var(--sg-gap-grouped, 1rem);
}

.machine-card {
  background: var(--sg-surface-container-low, var(--surface, #fff));
  border: 1px solid var(--sg-color-border);
  border-radius: var(--sg-radius-lg, 0.75rem);
  padding: var(--sg-space-5, 1.25rem);
  display: flex;
  flex-direction: column;
  gap: var(--sg-gap-grouped, 1rem);
}

/* Header */
.machine-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--sg-gap-related);
}

.machine-name {
  font-size: var(--sg-text-base, 1rem);
  font-weight: 600;
  text-transform: capitalize;
  margin: 0;
  line-height: 1.3;
}

.machine-desc {
  font-size: var(--sg-text-xs, 0.75rem);
  color: var(--sg-color-text-secondary);
  margin: var(--sg-space-1) 0 0;
  line-height: 1.4;
}

.reset-btn {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: var(--sg-radius-sm, 0.375rem);
  border: 1px solid var(--sg-color-border);
  background: var(--sg-surface-container-high);
  color: var(--sg-color-text-secondary);
  cursor: pointer;
  transition: all 150ms;
}

.reset-btn:hover {
  color: var(--sg-color-text);
  border-color: var(--sg-color-text-secondary);
}

/* State flow */
.state-flow {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--sg-gap-tight, 0.25rem);
  padding: var(--sg-space-2-5, 0.625rem) var(--sg-space-3, 0.75rem);
  background: var(--sg-surface-container-high);
  border-radius: var(--sg-radius-md, 0.5rem);
}

.state-node {
  display: inline-flex;
  align-items: center;
  gap: var(--sg-gap-tight, 0.25rem);
  font-size: var(--sg-text-xs, 0.75rem);
  font-family: var(--sg-font-mono, monospace);
  color: var(--sg-color-text-secondary);
  padding: var(--sg-space-0-5) var(--sg-space-1-5);
  border-radius: var(--sg-radius-sm, 0.375rem);
  transition: all 200ms;
}

.state-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--sg-color-border);
  transition: all 200ms;
}

.state-node.state-current {
  color: var(--sg-color-primary, var(--sg-color-link));
  font-weight: 600;
  background: oklch(from var(--sg-color-primary, var(--sg-color-link)) l c h / 0.1);
}

.state-node.state-current .state-dot {
  background: var(--sg-color-primary, var(--sg-color-link));
  box-shadow: 0 0 0 2px oklch(from var(--sg-color-primary, var(--sg-color-link)) l c h / 0.25);
}

.state-node.state-reachable:not(.state-current) .state-dot {
  background: var(--sg-color-success-active, #22c55e);
}

.state-arrow {
  color: var(--sg-color-border);
  font-size: 0.7rem;
}

/* Transition table */
.transition-table {
  display: flex;
  flex-direction: column;
  gap: var(--sg-gap-micro, 0.125rem);
  border-radius: var(--sg-radius-md, 0.5rem);
  overflow: hidden;
}

.transition-row {
  display: flex;
  align-items: flex-start;
  gap: var(--sg-gap-related, 0.5rem);
  padding: var(--sg-space-2, 0.5rem) var(--sg-space-2-5, 0.625rem);
  background: var(--sg-surface-container-high);
  opacity: 0.55;
  transition: all 200ms;
}

.transition-row-active {
  opacity: 1;
  background: oklch(from var(--sg-color-primary, var(--sg-color-link)) l c h / 0.08);
  border-left: 2px solid var(--sg-color-primary, var(--sg-color-link));
}

.transition-state-label {
  flex-shrink: 0;
  min-width: 5.5rem;
  font-size: var(--sg-text-xs, 0.75rem);
  font-family: var(--sg-font-mono, monospace);
  font-weight: 500;
  color: var(--sg-color-text-secondary);
  padding-top: var(--sg-space-1);
  display: flex;
  align-items: center;
  gap: var(--sg-gap-tight, 0.25rem);
}

.current-marker {
  color: var(--sg-color-primary, var(--sg-color-link));
  font-weight: 700;
}

.transition-row-active .transition-state-label {
  color: var(--sg-color-primary, var(--sg-color-link));
  font-weight: 600;
}

.transition-events {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sg-gap-tight, 0.25rem);
  flex: 1;
}

.transition-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--sg-gap-micro, 0.125rem);
  padding: var(--sg-space-1) var(--sg-space-2);
  border: 1px solid var(--sg-color-border);
  border-radius: var(--sg-radius-sm, 0.375rem);
  background: var(--sg-surface-container-low, var(--surface, #fff));
  font-size: 0.6875rem;
  font-family: var(--sg-font-mono, monospace);
  cursor: default;
  color: var(--sg-color-text-secondary);
  transition: all 150ms;
  line-height: 1.3;
}

.transition-btn.transition-available {
  cursor: pointer;
  border-color: oklch(from var(--sg-color-primary, var(--sg-color-link)) l c h / 0.3);
}

.transition-btn.transition-available:hover {
  background: oklch(from var(--sg-color-primary, var(--sg-color-link)) l c h / 0.1);
  border-color: oklch(from var(--sg-color-primary, var(--sg-color-link)) l c h / 0.5);
  color: var(--sg-color-text);
}

.transition-btn.transition-available:active {
  background: oklch(from var(--sg-color-primary, var(--sg-color-link)) l c h / 0.18);
}

.transition-btn:disabled {
  opacity: 0.6;
}

.transition-event-name {
  font-weight: 600;
  color: inherit;
}

.transition-arrow-label {
  color: var(--sg-color-text-secondary);
  opacity: 0.5;
  font-size: 0.6rem;
}

.transition-target {
  color: var(--sg-color-text-secondary);
  font-weight: 400;
}

.transition-guard {
  font-size: 0.6rem;
  opacity: 0.7;
}

/* Section labels */
.section-label {
  display: block;
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--sg-color-text-secondary);
  margin-bottom: var(--sg-space-1);
}

/* Context */
.context-section {
  padding-top: var(--sg-space-1);
}

.context-pairs {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sg-gap-tight, 0.25rem) var(--sg-gap-grouped, 1rem);
}

.context-pair {
  display: inline-flex;
  align-items: baseline;
  gap: var(--sg-gap-tight, 0.25rem);
  font-size: var(--sg-text-xs, 0.75rem);
  font-family: var(--sg-font-mono, monospace);
}

.context-key {
  color: var(--sg-color-text-secondary);
}

.context-key::after {
  content: ":";
}

.context-val {
  color: var(--sg-color-text);
  font-weight: 500;
}

/* Trail */
.trail-section {
  padding-top: var(--sg-space-1);
}

.trail {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--sg-gap-micro, 0.125rem);
  font-size: var(--sg-text-xs, 0.75rem);
  font-family: var(--sg-font-mono, monospace);
}

.trail-state {
  color: var(--sg-color-text-secondary);
  padding: var(--sg-space-0-5) var(--sg-space-1-5);
  border-radius: 3px;
}

.trail-state-current {
  color: var(--sg-color-primary, var(--sg-color-link));
  background: oklch(from var(--sg-color-primary, var(--sg-color-link)) l c h / 0.1);
  font-weight: 600;
}

.trail-event {
  color: var(--sg-color-text-secondary);
  opacity: 0.7;
  font-size: 0.6875rem;
  padding: var(--sg-space-0-5);
  background: oklch(from var(--sg-color-text) l c h / 0.06);
  border-radius: 2px;
}

.trail-event::before {
  content: "→ ";
  opacity: 0.5;
}

.trail-event::after {
  content: " →";
  opacity: 0.5;
}
</style>
