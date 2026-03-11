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
  // Featured machines
  const featured = [
    { name: "button", def: buttonMachine },
    { name: "dialog", def: dialogMachine },
    { name: "tabs", def: tabsMachine },
    { name: "toast", def: toastMachine },
  ] as const;

  // All machines for compact cards
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

  // Create live instances for each machine
  interface LiveMachine {
    name: string;
    def: MachineDefinition<any, any, any>;
    state: string;
    context: Record<string, unknown>;
    events: string[];
    states: string[];
    send: (event: string) => void;
  }

  let machines: LiveMachine[] = $state(
    allMachines.map(m => {
      const instance = createMachine(m.def);
      const stateNames = Object.keys(m.def.states);
      const events: string[] = [];
      for (const sn of stateNames) {
        const node = m.def.states[sn];
        if (node?.on) {
          for (const ev of Object.keys(node.on)) {
            if (!events.includes(ev)) events.push(ev);
          }
        }
      }

      const live: LiveMachine = {
        name: m.name,
        def: m.def,
        state: instance.state,
        context: { ...instance.context },
        events,
        states: stateNames,
        send: (event: string) => {
          instance.send(event as any);
          live.state = instance.state;
          live.context = { ...instance.context };
        },
      };

      instance.subscribe((state, context) => {
        live.state = state;
        live.context = { ...context };
      });

      return live;
    })
  );

  function resetMachine(index: number) {
    const m = allMachines[index]!;
    const instance = createMachine(m.def);
    const stateNames = Object.keys(m.def.states);
    const events: string[] = [];
    for (const sn of stateNames) {
      const node = m.def.states[sn];
      if (node?.on) {
        for (const ev of Object.keys(node.on)) {
          if (!events.includes(ev)) events.push(ev);
        }
      }
    }
    const live: LiveMachine = {
      name: m.name,
      def: m.def,
      state: instance.state,
      context: { ...instance.context },
      events,
      states: stateNames,
      send: (event: string) => {
        instance.send(event as any);
        live.state = instance.state;
        live.context = { ...instance.context };
      },
    };
    instance.subscribe((state, context) => {
      live.state = state;
      live.context = { ...context };
    });
    machines[index] = live;
  }
</script>

<sg-section id="machines" title="State Machines">
  Pure TypeScript FSM definitions for component behavior.
  <code>createMachine()</code> interprets definitions at runtime; <code>useMachine()</code> binds to Svelte reactivity.
  

    <div class="machines-grid">
      {#each machines as machine, i}
        <div class="machine-card" class:featured-machine={i < 4}>
          <div class="machine-header">
            <sg-heading level={4}>{machine.name}</sg-heading>
            <button class="sg-button" data-size="sm" onclick={() => resetMachine(i)}>Reset</button>
          </div>

          <!-- State pills -->
          <div class="state-pills">
            {#each machine.states as s}
              <span class="state-pill" class:active-state={machine.state === s}>{s}</span>
            {/each}
          </div>

          <!-- Event trigger buttons -->
          <div class="event-buttons">
            {#each machine.events as event}
              <button class="event-btn" onclick={() => machine.send(event)}>
                {event}
              </button>
            {/each}
          </div>

          <!-- Context display -->
          {#if Object.keys(machine.context).length > 0}
            <pre class="context-display">{JSON.stringify(machine.context, null, 2)}</pre>
          {/if}
        </div>
      {/each}
    </div>
</sg-section>

<style>
.machines-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--sg-gap-grouped);
}

.machine-card {
  background: var(--surface);
  border: 1px solid var(--sg-color-border);
  border-radius: var(--radius-sm);
  padding: var(--sg-space-4);
}

.machine-card.featured-machine {
  border-color: oklch(from var(--sg-color-link) l c h / 0.2);
}

.machine-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--sg-space-3);
}

.machine-header h4 {
  font-size: var(--sg-text-base);
  font-weight: var(--sg-weight-semibold);
  text-transform: capitalize;
}

.state-pills {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sg-space-1-5);
  margin-bottom: var(--sg-space-3);
}

.state-pill {
  padding: var(--sg-space-0-5) var(--sg-space-2-5);
  border-radius: var(--sg-radius-full);
  font-size: var(--sg-text-xs);
  font-weight: var(--sg-weight-semibold);
  background: var(--sg-surface-container-high);
  color: var(--text-3);
  border: 1px solid var(--sg-color-border);
  transition: all var(--sg-duration-normal);
}

.state-pill.active-state {
  background: oklch(from var(--sg-color-link) l c h / 0.15);
  color: var(--sg-color-link);
  border-color: oklch(from var(--sg-color-link) l c h / 0.3);
}

.event-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sg-gap-tight);
  margin-bottom: var(--sg-space-3);
}

.event-btn {
  padding: var(--sg-space-1) var(--sg-space-2-5);
  border: var(--sg-border-thin) solid var(--sg-color-border);
  border-radius: var(--sg-radius-sm);
  background: var(--sg-surface-container-high);
  color: var(--sg-color-text-secondary);
  font-size: var(--sg-text-xs);
  font-family: var(--sg-font-mono);
  cursor: pointer;
  transition: all var(--sg-duration-fast);
}

.event-btn:hover {
  background: oklch(from var(--sg-color-text) l c h / 0.08);
  color: var(--sg-color-text);
  border-color: var(--border-hover);
}

.context-display {
  font-size: var(--sg-text-xs);
  font-family: var(--sg-font-mono);
  color: var(--text-3);
  background: var(--sg-surface-container-high);
  padding: var(--sg-space-2);
  border-radius: var(--sg-radius-sm);
  overflow-x: auto;
  white-space: pre;
}
</style>
