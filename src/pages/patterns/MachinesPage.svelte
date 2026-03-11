<script lang="ts">
  import MachinesSection from "../../sections/MachinesSection.svelte";
</script>

<div class="page">
  <div class="page-header">
    <sg-heading level={1}>State Machines</sg-heading>
    <sg-text size="lg" color="secondary">Finite state machine definitions for every UI component. Pure data objects interpreted by createMachine().</sg-text>
  </div>

  <sg-code-block
    title="Usage"
    language="typescript"
    code={`import { createMachine } from "@sig-ui/core/machines";
import { buttonMachine } from "@sig-ui/core/machines/button";

const machine = createMachine(buttonMachine);
machine.send("PRESS");     // idle → pressed
machine.send("RELEASE");   // pressed → idle
machine.state;              // "idle"
machine.context;            // { pressCount: 1 }`}
  />

  <MachinesSection />
</div>
