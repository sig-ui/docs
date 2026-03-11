<script lang="ts">
  // Multi-channel toggle
  let showColor = $state(true);
  let showIcon = $state(true);
  let showText = $state(true);
  let allOff = $derived(!showColor && !showIcon && !showText);
</script>

<div class="page">
  <div class="page-header">
    <sg-heading level={1}>Accessibility</sg-heading>
    <sg-text size="lg" color="secondary">Not a checklist. A property of the system that cannot be removed.</sg-text>
  </div>

  <!-- Stats -->
  <div class="subsection">
    <div class="phil-stat-row">
      <div class="card" style="text-align: center; flex: 1">
        <span class="phil-stat-num">~8%</span>
        <span class="card-label">of males have color vision deficiency</span>
      </div>
      <div class="card" style="text-align: center; flex: 1">
        <span class="phil-stat-num">15-20%</span>
        <span class="card-label">have cognitive or learning disabilities</span>
      </div>
      <div class="card" style="text-align: center; flex: 1">
        <span class="phil-stat-num">0</span>
        <span class="card-label">components ship without a11y enforcement</span>
      </div>
    </div>
  </div>

  <!-- Multi-channel demo -->
  <div class="subsection">
    <sg-heading level={3} size="lg">Multi-channel communication</sg-heading>
    <sg-text size="lg" color="secondary" style="margin-bottom: var(--sg-space-5)">
      Toggle channels off. If your error state is "turns red," ~8% of males can't see it.
    </sg-text>

    <div class="controls">
      <input type="checkbox" class="sg-checkbox" checked={showColor} oninput={(e) => { const el = e.currentTarget as any; showColor = (el.checked ?? showColor); }} onchange={(e) => { const el = e.currentTarget as any; showColor = (el.checked ?? showColor); }} onclick={(e) => { const el = e.currentTarget as any; showColor = (el.checked ?? showColor); }} ontoggle={(e) => { const el = e.currentTarget as any; showColor = (el.checked ?? showColor); }} />
      <input type="checkbox" class="sg-checkbox" checked={showIcon} oninput={(e) => { const el = e.currentTarget as any; showIcon = (el.checked ?? showIcon); }} onchange={(e) => { const el = e.currentTarget as any; showIcon = (el.checked ?? showIcon); }} onclick={(e) => { const el = e.currentTarget as any; showIcon = (el.checked ?? showIcon); }} ontoggle={(e) => { const el = e.currentTarget as any; showIcon = (el.checked ?? showIcon); }} />
      <input type="checkbox" class="sg-checkbox" checked={showText} oninput={(e) => { const el = e.currentTarget as any; showText = (el.checked ?? showText); }} onchange={(e) => { const el = e.currentTarget as any; showText = (el.checked ?? showText); }} onclick={(e) => { const el = e.currentTarget as any; showText = (el.checked ?? showText); }} ontoggle={(e) => { const el = e.currentTarget as any; showText = (el.checked ?? showText); }} />
    </div>

    <div class="phil-channel-row">
      <!-- Error -->
      <div class="card">
        <span class="card-label">Error state</span>
        <div class="phil-channel-input" style="border-color: {showColor ? 'var(--sg-color-danger)' : 'var(--sg-color-border)'}">
          {#if showIcon}<span style="color: {showColor ? 'var(--sg-color-danger)' : 'var(--sg-color-text-secondary)'}">&#9888;</span>{/if}
          <span>user@</span>
        </div>
        {#if showText}<span class="phil-channel-msg" style="color: {showColor ? 'var(--sg-color-danger)' : 'var(--sg-color-text-secondary)'}">Enter a valid email</span>{/if}
        {#if allOff}<span class="phil-channel-msg" style="color: var(--sg-color-danger)">Error is invisible.</span>{/if}
      </div>
      <!-- Success -->
      <div class="card">
        <span class="card-label">Success state</span>
        <div class="phil-channel-input" style="border-color: {showColor ? 'var(--sg-color-success)' : 'var(--sg-color-border)'}">
          {#if showIcon}<span style="color: {showColor ? 'var(--sg-color-success)' : 'var(--sg-color-text-secondary)'}">&#10003;</span>{/if}
          <span>user@example.com</span>
        </div>
        {#if showText}<span class="phil-channel-msg" style="color: {showColor ? 'var(--sg-color-success)' : 'var(--sg-color-text-secondary)'}">Email verified</span>{/if}
        {#if allOff}<span class="phil-channel-msg" style="color: var(--sg-color-danger)">Success is invisible.</span>{/if}
      </div>
      <!-- Disabled -->
      <div class="card">
        <span class="card-label">Disabled state</span>
        <div class="phil-channel-input" style="opacity: 0.4; cursor: not-allowed">
          <span>Cannot edit</span>
        </div>
        <span class="phil-channel-msg" style="color: var(--sg-color-text-secondary)">Opacity + cursor + ARIA (always multi-channel)</span>
      </div>
    </div>
  </div>

  <!-- Structural enforcement -->
  <div class="subsection">
    <sg-heading level={3} size="lg">Structural enforcement</sg-heading>
    <sg-text size="lg" color="secondary" style="margin-bottom: var(--sg-space-4)">Accessibility props are type-level requirements. The compiler rejects components without them.</sg-text>

    <div class="phil-enforce-grid">
      <div class="card" style="border-color: var(--sg-color-danger)">
        <span class="card-label" style="color: var(--sg-color-danger)">&#10007; Won't compile</span>
        <sg-code-block language="svelte" code={`<Dialog open>
  <p>Delete this item?</p>
</Dialog>
<!-- Missing aria-label -->`} />
      </div>
      <div class="card" style="border-color: var(--sg-color-danger)">
        <span class="card-label" style="color: var(--sg-color-danger)">&#10007; Won't compile</span>
        <sg-code-block language="svelte" code={`<Button variant="primary">
  <Icon name="delete" />
</Button>
<!-- Icon-only needs aria-label -->`} />
      </div>
      <div class="card" style="border-color: var(--sg-color-success)">
        <span class="card-label" style="color: var(--sg-color-success)">&#10003; Compiles</span>
        <sg-code-block language="svelte" code={`<Dialog open aria-label="Confirm deletion">
  <p>Delete this item?</p>
</Dialog>`} />
      </div>
    </div>
  </div>

  <!-- Cognitive -->
  <div class="subsection">
    <sg-heading level={3} size="lg">The cognitive dimension</sg-heading>
    <sg-text size="lg" color="secondary" style="margin-bottom: var(--sg-space-4)">15-20% of people have cognitive disabilities. SigUI addresses this structurally.</sg-text>
    <div class="phil-coga-grid">
      <div class="card"><strong style="font-size: var(--sg-text-sm)">Consistent patterns</strong><p style="font-size: var(--sg-text-sm); color: var(--sg-color-text-muted, var(--sg-color-text-secondary)); margin: var(--sg-space-1-5) 0 0">Same keyboard model everywhere. Same close behavior. Same open behavior.</p></div>
      <div class="card"><strong style="font-size: var(--sg-text-sm)">Defined timing</strong><p style="font-size: var(--sg-text-sm); color: var(--sg-color-text-muted, var(--sg-color-text-secondary)); margin: var(--sg-space-1-5) 0 0">No spinner under 200ms. Loading thresholds prevent content jumps.</p></div>
      <div class="card"><strong style="font-size: var(--sg-text-sm)">Error recovery</strong><p style="font-size: var(--sg-text-sm); color: var(--sg-color-text-muted, var(--sg-color-text-secondary)); margin: var(--sg-space-1-5) 0 0">Messages say what went wrong and how to fix it. Undo for destructive actions.</p></div>
      <div class="card"><strong style="font-size: var(--sg-text-sm)">Progressive disclosure</strong><p style="font-size: var(--sg-text-sm); color: var(--sg-color-text-muted, var(--sg-color-text-secondary)); margin: var(--sg-space-1-5) 0 0">Complexity reveals itself as needed. Nobody is overwhelmed up front.</p></div>
    </div>
  </div>
</div>

<style>
  .phil-stat-row {
    display: flex;
    gap: var(--sg-gap-related);
  }

  .phil-stat-num {
    display: block;
    font-size: var(--sg-text-2xl);
    font-weight: var(--sg-weight-bold);
    color: var(--sg-color-text-primary, var(--sg-color-text));
    letter-spacing: var(--sg-tracking-2xl);
    margin-bottom: var(--sg-space-1);
  }

  .phil-toggle-label {
    display: flex;
    align-items: center;
    gap: var(--sg-space-1-5);
    font-size: var(--sg-text-sm);
    cursor: pointer;
  }

  .phil-channel-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--sg-gap-related);
    margin-top: var(--sg-space-4);
  }

  .phil-channel-input {
    display: flex;
    align-items: center;
    gap: var(--sg-space-1-5);
    padding: var(--sg-space-2) var(--sg-space-3);
    border: var(--sg-border-medium) solid var(--sg-color-border-default, var(--sg-color-border));
    border-radius: var(--sg-radius-md);
    font-size: var(--sg-text-sm);
    background: var(--sg-color-bg-primary, var(--sg-bg));
    margin: var(--sg-space-2) 0;
    transition: border-color var(--sg-duration-fast);
  }

  .phil-channel-msg {
    font-size: var(--sg-text-sm);
    display: block;
  }

  .phil-enforce-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: var(--sg-gap-related);
  }

  .phil-coga-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--sg-gap-related);
  }

  @media (max-width: 768px) {
    .phil-stat-row { flex-direction: column; }
    .phil-channel-row { grid-template-columns: 1fr; }
    .phil-enforce-grid { grid-template-columns: 1fr; }
    .phil-coga-grid { grid-template-columns: 1fr; }
  }
</style>
