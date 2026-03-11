<script lang="ts">
  let emailValue = $state("");
  let checkboxChecked = $state(false);
  let switchChecked = $state(false);
  let sliderValue = $state(50);
</script>

<section class="section" id="components">
  <div class="container">
    <div class="section-header">
      <sg-heading level={2}>Component Library</sg-heading>
      <sg-text size="lg" color="secondary">
        sigui components - typed props, accessible defaults, token-driven styling.
        Designed for LLM agents building Svelte apps.
      </sg-text>
    </div>

    <!-- Buttons -->
    <div style="margin-bottom: var(--sg-space-8)">
      <sg-heading level={3} size="lg" style="margin-bottom: var(--sg-space-4)">Buttons</sg-heading>
      <sg-stack direction="horizontal" gap="related" align="center">
        
          <button class="sg-button" data-color="primary">Primary</button>
          <button class="sg-button" data-color="secondary">Secondary</button>
          <button class="sg-button" data-color="danger">Danger</button>
          <button class="sg-button" data-color="success">Success</button>
          <button class="sg-button" data-color="warning">Warning</button>
          <button class="sg-button" data-color="ghost">Ghost</button>
        
      </sg-stack>

      <div style="margin-top: var(--sg-space-4)">
        <sg-stack direction="horizontal" gap="related" align="center">
          
            <button class="sg-button" data-size="sm" data-color="primary">Small</button>
            <button class="sg-button" data-size="md" data-color="primary">Medium</button>
            <button class="sg-button" data-size="lg" data-color="primary">Large</button>
            <button class="sg-button" data-loading data-color="primary">Loading</button>
            <button class="sg-button" disabled={true} data-color="primary">Disabled</button>
          
        </sg-stack>
      </div>
    </div>

    <!-- Badges -->
    <div style="margin-bottom: var(--sg-space-8)">
      <sg-heading level={3} size="lg" style="margin-bottom: var(--sg-space-4)">Badges</sg-heading>
      <sg-stack direction="horizontal" gap="related" align="center">
        
          <sg-badge color="primary">Primary</sg-badge>
          <sg-badge color="danger">Error</sg-badge>
          <sg-badge color="success">Active</sg-badge>
          <sg-badge color="warning">Pending</sg-badge>
          <sg-badge color="info">Info</sg-badge>
          <sg-badge color="ghost">Draft</sg-badge>
        
      </sg-stack>
    </div>

    <!-- Cards -->
    <div style="margin-bottom: var(--sg-space-8)">
      <sg-heading level={3} size="lg" style="margin-bottom: var(--sg-space-4)">Cards</sg-heading>
      <sg-stack direction="horizontal" gap="grouped">
        
          <sg-card elevation={1}>
            
              <sg-card-body>
                
                  <sg-heading level={4} size="lg" style="margin: 0 0 var(--sg-space-2)">Default Card</sg-heading>
                  <sg-text color="secondary">Elevation level 1 with structured layout.</sg-text>
                
              </sg-card-body>
            
          </sg-card>

          <sg-card elevation={3}>
            
              <sg-card-header>
                
                  <sg-heading level={4} size="lg" style="margin: 0">Elevated Card</sg-heading>
                
              </sg-card-header>
              <sg-card-body>
                
                  <sg-text color="secondary">Elevation level 3 with header, body, footer.</sg-text>
                
              </sg-card-body>
              <sg-card-footer>
                
                  <button class="sg-button" data-size="sm" data-color="primary">Action</button>
                
              </sg-card-footer>
            
          </sg-card>
        
      </sg-stack>
    </div>

    <!-- Form Controls -->
    <div style="margin-bottom: var(--sg-space-8)">
      <sg-heading level={3} size="lg" style="margin-bottom: var(--sg-space-4)">Form Controls</sg-heading>
      <sg-card elevation={1}>
        
          <sg-card-body>
            
              <sg-stack gap="grouped">
                
                  <input class="sg-input" type="email" placeholder="you@example.com" value={emailValue} oninput={(e) => { const el = e.currentTarget as any; emailValue = (el.value ?? emailValue); }} onchange={(e) => { const el = e.currentTarget as any; emailValue = (el.value ?? emailValue); }} onclick={(e) => { const el = e.currentTarget as any; emailValue = (el.value ?? emailValue); }} ontoggle={(e) => { const el = e.currentTarget as any; emailValue = (el.value ?? emailValue); }} />
                  <input class="sg-input" type="password" placeholder="Enter password" required={true} />
                  <input class="sg-input" type="text" />
                  <input class="sg-checkbox" type="checkbox" checked={checkboxChecked} oninput={(e) => { const el = e.currentTarget as any; checkboxChecked = (el.checked ?? checkboxChecked); }} onchange={(e) => { const el = e.currentTarget as any; checkboxChecked = (el.checked ?? checkboxChecked); }} onclick={(e) => { const el = e.currentTarget as any; checkboxChecked = (el.checked ?? checkboxChecked); }} ontoggle={(e) => { const el = e.currentTarget as any; checkboxChecked = (el.checked ?? checkboxChecked); }} />
                  <input class="sg-switch" role="switch" type="checkbox" checked={switchChecked} oninput={(e) => { const el = e.currentTarget as any; switchChecked = (el.checked ?? switchChecked); }} onchange={(e) => { const el = e.currentTarget as any; switchChecked = (el.checked ?? switchChecked); }} onclick={(e) => { const el = e.currentTarget as any; switchChecked = (el.checked ?? switchChecked); }} ontoggle={(e) => { const el = e.currentTarget as any; switchChecked = (el.checked ?? switchChecked); }} />
                  <input class="sg-slider" type="range" value={sliderValue} oninput={(e) => { const el = e.currentTarget as any; sliderValue = (el.value ?? sliderValue); }} onchange={(e) => { const el = e.currentTarget as any; sliderValue = (el.value ?? sliderValue); }} onclick={(e) => { const el = e.currentTarget as any; sliderValue = (el.value ?? sliderValue); }} ontoggle={(e) => { const el = e.currentTarget as any; sliderValue = (el.value ?? sliderValue); }} min={0} max={100} step={1} />
                
              </sg-stack>
            
          </sg-card-body>
        
      </sg-card>
    </div>

    <!-- Avatar -->
    <div style="margin-bottom: var(--sg-space-8)">
      <sg-heading level={3} size="lg" style="margin-bottom: var(--sg-space-4)">Avatars</sg-heading>
      <sg-stack direction="horizontal" gap="related" align="center">
        
          <sg-avatar size="sm" alt="John Doe" />
          <sg-avatar size="md" alt="Jane Smith" />
          <sg-avatar size="lg" alt="Bob Wilson" fallback="BW" />
        
      </sg-stack>
    </div>
  </div>
</section>
