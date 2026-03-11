<script lang="ts">
  let emailValue = $state("");
  let checkboxChecked = $state(false);
  let checkboxIndeterminate = $state(false);
  let switchChecked = $state(false);
  let sliderValue = $state(50);
  let radioValue = $state("option1");
  let dialogOpen = $state(false);
  let popoverOpen = $state(false);
  let menuOpen = $state(false);
  let tabValue = $state("tab1");
  let alertDialogOpen = $state(false);
  let sheetOpen = $state(false);
  let drawerOpen = $state(false);
  let togglePressed = $state(false);
  let textareaValue = $state("");
</script>

<sg-section id="components" title="Component Library" description="All 58 sigui components - typed props, accessible defaults, token-driven styling. Designed for LLM agents building Svelte 5 apps.">

    <!-- Buttons -->
    <div class="component-group">
      <h3 class="component-group-title">Button</h3>
      <sg-stack direction="horizontal" gap="related" align="center" wrap={true}>
        
          <button class="sg-button" data-color="primary">Primary</button>
          <button class="sg-button" data-color="secondary">Secondary</button>
          <button class="sg-button" data-color="danger">Danger</button>
          <button class="sg-button" data-color="success">Success</button>
          <button class="sg-button" data-color="warning">Warning</button>
          <button class="sg-button" data-color="ghost">Ghost</button>
        
      </sg-stack>
      <div style="margin-top: var(--sg-space-3)">
        <sg-stack direction="horizontal" gap="related" align="center" wrap={true}>
          
            <button class="sg-button" data-size="sm" data-color="primary">Small</button>
            <button class="sg-button" data-size="md" data-color="primary">Medium</button>
            <button class="sg-button" data-size="lg" data-color="primary">Large</button>
            <button class="sg-button" data-loading data-color="primary">Loading</button>
            <button class="sg-button" disabled={true} data-color="primary">Disabled</button>
          
        </sg-stack>
      </div>
    </div>

    <!-- Badges -->
    <div class="component-group">
      <h3 class="component-group-title">Badge</h3>
      <sg-stack direction="horizontal" gap="related" align="center" wrap={true}>
        
          <sg-badge color="primary">Primary</sg-badge>
          <sg-badge color="danger">Error</sg-badge>
          <sg-badge color="success">Active</sg-badge>
          <sg-badge color="warning">Pending</sg-badge>
          <sg-badge color="info">Info</sg-badge>
          <sg-badge color="ghost">Draft</sg-badge>
        
      </sg-stack>
    </div>

    <!-- Cards -->
    <div class="component-group">
      <h3 class="component-group-title">Card</h3>
      <sg-stack direction="horizontal" gap="grouped" wrap={true}>
        
          <sg-card elevation={1}>
            
              <sg-card-body>
                
                  <h4 style="margin: 0 0 var(--sg-space-2)">Default Card</h4>
                  <p style="margin: 0; color: var(--sg-color-text-secondary)">Elevation level 1.</p>
                
              </sg-card-body>
            
          </sg-card>
          <sg-card elevation={3}>
            
              <sg-card-header>
                <h4 style="margin: 0">Elevated Card</h4>
              </sg-card-header>
              <sg-card-body>
                <p style="margin: 0; color: var(--sg-color-text-secondary)">Elevation 3 with header, body, footer.</p>
              </sg-card-body>
              <sg-card-footer>
                <button class="sg-button" data-size="sm" data-color="primary">Action</button>
              </sg-card-footer>
            
          </sg-card>
        
      </sg-stack>
    </div>

    <!-- Form Controls -->
    <div class="component-group">
      <h3 class="component-group-title">Input</h3>
      <sg-card elevation={1}>
        
          <sg-card-body>
            
              <sg-stack gap="grouped">
                
                  <input class="sg-input" type="email" placeholder="you@example.com" value={emailValue} oninput={(e) => { const el = e.currentTarget as any; emailValue = (el.value ?? emailValue); }} onchange={(e) => { const el = e.currentTarget as any; emailValue = (el.value ?? emailValue); }} onclick={(e) => { const el = e.currentTarget as any; emailValue = (el.value ?? emailValue); }} ontoggle={(e) => { const el = e.currentTarget as any; emailValue = (el.value ?? emailValue); }} />
                  <input class="sg-input" type="password" placeholder="Enter password" required={true} />
                  <input class="sg-input" type="text" />
                
              </sg-stack>
            
          </sg-card-body>
        
      </sg-card>
    </div>

    <!-- Checkbox & Switch -->
    <div class="component-group">
      <h3 class="component-group-title">Checkbox & Switch</h3>
      <sg-stack gap="grouped">
        
          <input class="sg-checkbox" type="checkbox" checked={checkboxChecked} oninput={(e) => { const el = e.currentTarget as any; checkboxChecked = (el.checked ?? checkboxChecked); }} onchange={(e) => { const el = e.currentTarget as any; checkboxChecked = (el.checked ?? checkboxChecked); }} onclick={(e) => { const el = e.currentTarget as any; checkboxChecked = (el.checked ?? checkboxChecked); }} ontoggle={(e) => { const el = e.currentTarget as any; checkboxChecked = (el.checked ?? checkboxChecked); }} />
          <input type="checkbox" class="sg-checkbox" checked={true} indeterminate={true} />
          <input type="checkbox" class="sg-checkbox" disabled={true} />
          <input class="sg-switch" role="switch" type="checkbox" checked={switchChecked} oninput={(e) => { const el = e.currentTarget as any; switchChecked = (el.checked ?? switchChecked); }} onchange={(e) => { const el = e.currentTarget as any; switchChecked = (el.checked ?? switchChecked); }} onclick={(e) => { const el = e.currentTarget as any; switchChecked = (el.checked ?? switchChecked); }} ontoggle={(e) => { const el = e.currentTarget as any; switchChecked = (el.checked ?? switchChecked); }} />
          <input type="checkbox" class="sg-switch" role="switch" disabled={true} />
        
      </sg-stack>
    </div>

    <!-- Radio Group -->
    <div class="component-group">
      <h3 class="component-group-title">RadioGroup</h3>
      <div class="sg-radio-group" onchange={(e) => { const el = (e.target as HTMLInputElement); if (el.checked) radioValue = el.value; }}>
        <label class="sg-radio-group-item">
          <input type="radio" class="sg-radio" name="components-radio" value="option1" checked={radioValue === "option1"}>
          <span class="sg-radio-content"><span class="sg-radio-label">Option 1</span></span>
        </label>
        <label class="sg-radio-group-item">
          <input type="radio" class="sg-radio" name="components-radio" value="option2" checked={radioValue === "option2"}>
          <span class="sg-radio-content"><span class="sg-radio-label">Option 2</span></span>
        </label>
        <label class="sg-radio-group-item">
          <input type="radio" class="sg-radio" name="components-radio" value="option3" checked={radioValue === "option3"}>
          <span class="sg-radio-content"><span class="sg-radio-label">Option 3</span></span>
        </label>
        <label class="sg-radio-group-item">
          <input type="radio" class="sg-radio" name="components-radio" value="disabled" disabled={true}>
          <span class="sg-radio-content"><span class="sg-radio-label">Disabled option</span></span>
        </label>
      </div>
      <p style="margin-top: var(--sg-space-2); color: var(--text-3); font-size: var(--sg-text-sm)">Selected: {radioValue}</p>
    </div>

    <!-- Slider -->
    <div class="component-group">
      <h3 class="component-group-title">Slider</h3>
      <input class="sg-slider" type="range" value={sliderValue} oninput={(e) => { const el = e.currentTarget as any; sliderValue = (el.value ?? sliderValue); }} onchange={(e) => { const el = e.currentTarget as any; sliderValue = (el.value ?? sliderValue); }} onclick={(e) => { const el = e.currentTarget as any; sliderValue = (el.value ?? sliderValue); }} ontoggle={(e) => { const el = e.currentTarget as any; sliderValue = (el.value ?? sliderValue); }} min={0} max={100} step={1} />
      <div style="margin-top: var(--sg-space-2)">
        <input type="range" class="sg-slider" value={30} min={0} max={100} disabled={true} />
      </div>
    </div>

    <!-- Avatar -->
    <div class="component-group">
      <h3 class="component-group-title">Avatar</h3>
      <sg-stack direction="horizontal" gap="related" align="center">
        
          <sg-avatar size="sm" alt="John Doe" />
          <sg-avatar size="md" alt="Jane Smith" />
          <sg-avatar size="lg" alt="Bob Wilson" fallback="BW" />
        
      </sg-stack>
    </div>

    <!-- Tabs -->
    <div class="component-group">
      <h3 class="component-group-title">Tabs</h3>
      <sg-tabs-root value={tabValue} oninput={(e) => { const el = e.currentTarget as any; tabValue = (el.value ?? tabValue); }} onchange={(e) => { const el = e.currentTarget as any; tabValue = (el.value ?? tabValue); }} onclick={(e) => { const el = e.currentTarget as any; tabValue = (el.value ?? tabValue); }} ontoggle={(e) => { const el = e.currentTarget as any; tabValue = (el.value ?? tabValue); }}>
        
          <sg-tabs-list>
            
              <sg-tabs-trigger value="tab1">Overview</sg-tabs-trigger>
              <sg-tabs-trigger value="tab2">Features</sg-tabs-trigger>
              <sg-tabs-trigger value="tab3">Settings</sg-tabs-trigger>
              <sg-tabs-trigger value="tab4" disabled={true}>Disabled</sg-tabs-trigger>
            
          </sg-tabs-list>
          <sg-tabs-content value="tab1">
            
              <p style="padding: var(--sg-space-4); color: var(--sg-color-text-secondary)">This is the overview panel. Tab components use compound pattern with shared context.</p>
            
          </sg-tabs-content>
          <sg-tabs-content value="tab2">
            
              <p style="padding: var(--sg-space-4); color: var(--sg-color-text-secondary)">Features panel content. Each TabsContent renders only when its value matches.</p>
            
          </sg-tabs-content>
          <sg-tabs-content value="tab3">
            
              <p style="padding: var(--sg-space-4); color: var(--sg-color-text-secondary)">Settings panel. Use TabsTrigger disabled prop to disable individual tabs.</p>
            
          </sg-tabs-content>
        
      </sg-tabs-root>
    </div>

    <!-- Accordion -->
    <div class="component-group">
      <h3 class="component-group-title">Accordion</h3>
      <sg-accordion-root>
        
          <sg-accordion-item value="item1">
            
              <sg-accordion-trigger>What is SigUI?</sg-accordion-trigger>
              <sg-accordion-content>
                
                  <p style="padding: var(--sg-space-3) 0; color: var(--sg-color-text-secondary)">SigUI is a comprehensive design system built on perceptual color science, fluid typography, and accessible interaction patterns.</p>
                
              </sg-accordion-content>
            
          </sg-accordion-item>
          <sg-accordion-item value="item2">
            
              <sg-accordion-trigger>How does it work?</sg-accordion-trigger>
              <sg-accordion-content>
                
                  <p style="padding: var(--sg-space-3) 0; color: var(--sg-color-text-secondary)">Core algorithms are pure TypeScript with no runtime dependencies. The Svelte layer provides reactive components with constrained typed props.</p>
                
              </sg-accordion-content>
            
          </sg-accordion-item>
          <sg-accordion-item value="item3" disabled={true}>
            
              <sg-accordion-trigger>Disabled Item</sg-accordion-trigger>
              <sg-accordion-content>
                <p>This won't open.</p>
              </sg-accordion-content>
            
          </sg-accordion-item>
        
      </sg-accordion-root>
    </div>

    <!-- Dialog -->
    <div class="component-group">
      <h3 class="component-group-title">Dialog</h3>
      <sg-dialog-root open={dialogOpen} oninput={(e) => { const el = e.currentTarget as any; dialogOpen = (el.open ?? dialogOpen); }} onchange={(e) => { const el = e.currentTarget as any; dialogOpen = (el.open ?? dialogOpen); }} onclick={(e) => { const el = e.currentTarget as any; dialogOpen = (el.open ?? dialogOpen); }} ontoggle={(e) => { const el = e.currentTarget as any; dialogOpen = (el.open ?? dialogOpen); }}>
        
          <sg-dialog-trigger>
            
              <button class="sg-button" data-color="primary" onclick={() => dialogOpen = true}>Open Dialog</button>
            
          </sg-dialog-trigger>
          <sg-dialog-content>
            
              <h3 style="margin: 0 0 var(--sg-space-2)">Dialog Title</h3>
              <p style="color: var(--sg-color-text-secondary); margin: 0 0 var(--sg-space-4)">This is a modal dialog. Press Escape or click the overlay to close.</p>
              <button class="sg-button" data-color="primary" onclick={() => dialogOpen = false}>Close</button>
            
          </sg-dialog-content>
        
      </sg-dialog-root>
    </div>

    <!-- Select -->
    <div class="component-group">
      <h3 class="component-group-title">Select</h3>
      <sg-select-root label="Choose a framework">
        
          <sg-select-trigger>Select a framework</sg-select-trigger>
          <sg-select-content>
            
              <sg-select-item value="svelte">Svelte</sg-select-item>
              <sg-select-item value="react">React</sg-select-item>
              <sg-select-item value="vue">Vue</sg-select-item>
              <sg-select-item value="angular" disabled={true}>Angular (disabled)</sg-select-item>
            
          </sg-select-content>
        
      </sg-select-root>
    </div>

    <!-- Popover -->
    <div class="component-group">
      <h3 class="component-group-title">Popover</h3>
      <sg-popover-root open={popoverOpen} oninput={(e) => { const el = e.currentTarget as any; popoverOpen = (el.open ?? popoverOpen); }} onchange={(e) => { const el = e.currentTarget as any; popoverOpen = (el.open ?? popoverOpen); }} onclick={(e) => { const el = e.currentTarget as any; popoverOpen = (el.open ?? popoverOpen); }} ontoggle={(e) => { const el = e.currentTarget as any; popoverOpen = (el.open ?? popoverOpen); }}>
        
          <sg-popover-trigger>
            
              <button class="sg-button" data-color="secondary">Toggle Popover</button>
            
          </sg-popover-trigger>
          <sg-popover-content>
            
              <div style="padding: var(--sg-pad-input, 0.75rem)">
                <h4 style="margin: 0 0 var(--sg-space-2)">Popover Content</h4>
                <p style="margin: 0; color: var(--sg-color-text-secondary); font-size: var(--sg-text-sm)">This popover appears relative to the trigger.</p>
              </div>
            
          </sg-popover-content>
        
      </sg-popover-root>
    </div>

    <!-- Tooltip -->
    <div class="component-group">
      <h3 class="component-group-title">Tooltip</h3>
      <sg-stack direction="horizontal" gap="grouped">
        
          <sg-tooltip-root content="This is a tooltip" delay={300}>
            
              <sg-tooltip-trigger>
                
                  <button class="sg-button" data-color="secondary">Hover me</button>
                
              </sg-tooltip-trigger>
              <sg-tooltip-content />
            
          </sg-tooltip-root>
          <sg-tooltip-root content="Another tooltip with longer text" delay={300}>
            
              <sg-tooltip-trigger>
                
                  <sg-badge color="info">Hover this badge</sg-badge>
                
              </sg-tooltip-trigger>
              <sg-tooltip-content />
            
          </sg-tooltip-root>
        
      </sg-stack>
    </div>

    <!-- Menu -->
    <div class="component-group">
      <h3 class="component-group-title">Menu</h3>
      <sg-menu-root open={menuOpen} oninput={(e) => { const el = e.currentTarget as any; menuOpen = (el.open ?? menuOpen); }} onchange={(e) => { const el = e.currentTarget as any; menuOpen = (el.open ?? menuOpen); }} onclick={(e) => { const el = e.currentTarget as any; menuOpen = (el.open ?? menuOpen); }} ontoggle={(e) => { const el = e.currentTarget as any; menuOpen = (el.open ?? menuOpen); }}>
        
          <sg-menu-trigger>
            
              <button class="sg-button" data-color="secondary">Open Menu</button>
            
          </sg-menu-trigger>
          <sg-menu-content>
            
              <sg-menu-item onselect={() => console.log("Edit")}>Edit</sg-menu-item>
              <sg-menu-item onselect={() => console.log("Copy")}>Copy</sg-menu-item>
              <sg-menu-item onselect={() => console.log("Delete")}>Delete</sg-menu-item>
              <sg-menu-item disabled={true}>Disabled Item</sg-menu-item>
            
          </sg-menu-content>
        
      </sg-menu-root>
    </div>

    <!-- Toast -->
    <div class="component-group">
      <h3 class="component-group-title">Toast</h3>
      <sg-stack direction="horizontal" gap="related" wrap={true}>
        
          <sg-toast color="primary">Info toast message</sg-toast>
          <sg-toast color="success">Success toast</sg-toast>
          <sg-toast color="danger">Error toast</sg-toast>
          <sg-toast color="warning">Warning toast</sg-toast>
        
      </sg-stack>
    </div>

    <!-- Stack -->
    <div class="component-group">
      <h3 class="component-group-title">Stack</h3>
      <sg-stack direction="horizontal" gap="grouped" wrap={true}>
        
          <div style="background: var(--sg-surface-container-high); padding: var(--sg-space-4); border-radius: var(--sg-radius-md); border: var(--sg-border-thin) solid var(--sg-color-border)">Item 1</div>
          <div style="background: var(--sg-surface-container-high); padding: var(--sg-space-4); border-radius: var(--sg-radius-md); border: var(--sg-border-thin) solid var(--sg-color-border)">Item 2</div>
          <div style="background: var(--sg-surface-container-high); padding: var(--sg-space-4); border-radius: var(--sg-radius-md); border: var(--sg-border-thin) solid var(--sg-color-border)">Item 3</div>
        
      </sg-stack>
    </div>

    <!-- Icon -->
    <div class="component-group">
      <h3 class="component-group-title">Icon</h3>
      <sg-stack direction="horizontal" gap="related" align="center" wrap={true}>
        
          <sg-icon name="star" size="xs" label="Extra small" />
          <sg-icon name="star" size="sm" label="Small" />
          <sg-icon name="star" size="default" label="Default" />
          <sg-icon name="star" size="lg" label="Large" />
          <sg-icon name="star" size="xl" label="Extra large" />
        
      </sg-stack>
      <div style="margin-top: var(--sg-space-3)">
        <sg-stack direction="horizontal" gap="related" align="center" wrap={true}>
          
            <sg-icon name="check" size="lg" color="success" label="Success" />
            <sg-icon name="warning" size="lg" color="warning" label="Warning" />
            <sg-icon name="close" size="lg" color="danger" label="Danger" />
            <sg-icon name="info" size="lg" color="info" label="Info" />
            <sg-icon name="favorite" size="lg" filled={true} label="Filled" />
          
        </sg-stack>
      </div>
    </div>

    <!-- Progress -->
    <div class="component-group">
      <h3 class="component-group-title">Progress</h3>
      <sg-stack gap="related">
        
          <progress class="sg-progress" value={25} max={100}></progress>
          <progress class="sg-progress" value={66} max={100}></progress>
          <progress class="sg-progress" value={100} max={100}></progress>
          <progress class="sg-progress"></progress>
        
      </sg-stack>
    </div>

    <!-- Separator -->
    <div class="component-group">
      <h3 class="component-group-title">Separator</h3>
      <div>
        <p style="margin: 0 0 var(--sg-space-3); color: var(--sg-color-text-secondary)">Content above</p>
        <hr class="sg-separator" data-orientation="horizontal" />
        <p style="margin: var(--sg-space-3) 0 0; color: var(--sg-color-text-secondary)">Content below</p>
      </div>
    </div>

    <!-- Skeleton -->
    <div class="component-group">
      <h3 class="component-group-title">Skeleton</h3>
      <sg-stack direction="horizontal" gap="related" align="center">
        
          <sg-skeleton width="48px" height="48px" circle={true} />
          <sg-stack gap="related">
            
              <sg-skeleton width="160px" height="16px" />
              <sg-skeleton width="100px" height="12px" />
            
          </sg-stack>
        
      </sg-stack>
    </div>

    <!-- Collapsible -->
    <div class="component-group">
      <h3 class="component-group-title">Collapsible</h3>
      <sg-collapsible-root>
        
          <sg-collapsible-trigger>
            
              <button class="sg-button" data-color="secondary">Toggle Content</button>
            
          </sg-collapsible-trigger>
          <sg-collapsible-content>
            
              <p style="padding: var(--sg-space-3) 0; color: var(--sg-color-text-secondary)">This content is revealed when the collapsible is open.</p>
            
          </sg-collapsible-content>
        
      </sg-collapsible-root>
    </div>

    <!-- AlertDialog -->
    <div class="component-group">
      <h3 class="component-group-title">AlertDialog</h3>
      <sg-alert-dialog-root open={alertDialogOpen} oninput={(e) => { const el = e.currentTarget as any; alertDialogOpen = (el.open ?? alertDialogOpen); }} onchange={(e) => { const el = e.currentTarget as any; alertDialogOpen = (el.open ?? alertDialogOpen); }} onclick={(e) => { const el = e.currentTarget as any; alertDialogOpen = (el.open ?? alertDialogOpen); }} ontoggle={(e) => { const el = e.currentTarget as any; alertDialogOpen = (el.open ?? alertDialogOpen); }}>
        
          <sg-alert-dialog-trigger>
            
              <button class="sg-button" data-color="danger" onclick={() => alertDialogOpen = true}>Delete Item</button>
            
          </sg-alert-dialog-trigger>
          <sg-alert-dialog-content aria-label="Delete confirmation">
            
              <h3 style="margin: 0 0 var(--sg-space-2)">Are you sure?</h3>
              <p style="color: var(--sg-color-text-secondary); margin: 0 0 var(--sg-space-4)">This action cannot be undone.</p>
              <sg-stack direction="horizontal" gap="related">
                
                  <button class="sg-button" data-color="secondary" onclick={() => alertDialogOpen = false}>Cancel</button>
                  <button class="sg-button" data-color="danger" onclick={() => alertDialogOpen = false}>Delete</button>
                
              </sg-stack>
            
          </sg-alert-dialog-content>
        
      </sg-alert-dialog-root>
    </div>

    <!-- Sheet -->
    <div class="component-group">
      <h3 class="component-group-title">Sheet</h3>
      <sg-sheet-root side="right" open={sheetOpen} oninput={(e) => { const el = e.currentTarget as any; sheetOpen = (el.open ?? sheetOpen); }} onchange={(e) => { const el = e.currentTarget as any; sheetOpen = (el.open ?? sheetOpen); }} onclick={(e) => { const el = e.currentTarget as any; sheetOpen = (el.open ?? sheetOpen); }} ontoggle={(e) => { const el = e.currentTarget as any; sheetOpen = (el.open ?? sheetOpen); }}>
        
          <sg-sheet-trigger>
            
              <button class="sg-button" data-color="primary" onclick={() => sheetOpen = true}>Open Sheet</button>
            
          </sg-sheet-trigger>
          <sg-sheet-content aria-label="Side panel">
            
              <div style="padding: var(--sg-pad-card, 1.5rem)">
                <h3 style="margin: 0 0 var(--sg-space-2)">Sheet Panel</h3>
                <p style="color: var(--sg-color-text-secondary); margin: 0 0 var(--sg-space-4)">Slide-in panel with focus trap and overlay.</p>
                <button class="sg-button" data-color="primary" onclick={() => sheetOpen = false}>Close</button>
              </div>
            
          </sg-sheet-content>
        
      </sg-sheet-root>
    </div>

    <!-- Alert -->
    <div class="component-group">
      <h3 class="component-group-title">Alert</h3>
      <sg-stack gap="related">
        
          <div class="sg-alert" role="alert" data-color="info"><div class="sg-alert-title">Informational message.</div></div>
          <div class="sg-alert" role="alert" data-color="success"><div class="sg-alert-title">Operation completed.</div></div>
          <div class="sg-alert" role="alert" data-color="warning"><div class="sg-alert-title">Please review.</div></div>
          <div class="sg-alert" role="alert" data-color="danger"><div class="sg-alert-title">Something went wrong.</div></div>
        
      </sg-stack>
    </div>

    <!-- Table -->
    <div class="component-group">
      <h3 class="component-group-title">Table</h3>
      <table class="sg-table" aria-label="Sample data">
        <thead class="sg-table-header">
          <tr class="sg-table-row">
            <th class="sg-table-head">Name</th>
            <th class="sg-table-head">Role</th>
          </tr>
        </thead>
        <tbody class="sg-table-body">
          <tr class="sg-table-row">
            <td class="sg-table-cell">Alice</td>
            <td class="sg-table-cell">Admin</td>
          </tr>
          <tr class="sg-table-row">
            <td class="sg-table-cell">Bob</td>
            <td class="sg-table-cell">Editor</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Spinner -->
    <div class="component-group">
      <h3 class="component-group-title">Spinner</h3>
      <sg-stack direction="horizontal" gap="grouped" align="center">
        
          <sg-spinner size="sm" label="Loading" />
          <sg-spinner size="md" label="Loading" />
          <sg-spinner size="lg" label="Loading" />
        
      </sg-stack>
    </div>

    <!-- Toggle -->
    <div class="component-group">
      <h3 class="component-group-title">Toggle</h3>
      <sg-stack direction="horizontal" gap="related" align="center">
        
          <button class="sg-toggle" aria-pressed={togglePressed} oninput={(e) => { const el = e.currentTarget as any; togglePressed = (el.pressed ?? togglePressed); }} onchange={(e) => { const el = e.currentTarget as any; togglePressed = (el.pressed ?? togglePressed); }} onclick={(e) => { const el = e.currentTarget as any; togglePressed = (el.pressed ?? togglePressed); }} ontoggle={(e) => { const el = e.currentTarget as any; togglePressed = (el.pressed ?? togglePressed); }} aria-label="Bold"><strong>B</strong></button>
          <button class="sg-toggle" aria-label="Italic"><em>I</em></button>
          <button class="sg-toggle" aria-label="Underline"><u>U</u></button>
        
      </sg-stack>
    </div>

    <!-- Breadcrumb -->
    <div class="component-group">
      <h3 class="component-group-title">Breadcrumb</h3>
      <sg-breadcrumb>
        
          <sg-breadcrumb-item href="/">Home</sg-breadcrumb-item>
          <sg-breadcrumb-separator />
          <sg-breadcrumb-item href="/components">Components</sg-breadcrumb-item>
          <sg-breadcrumb-separator />
          <sg-breadcrumb-item current={true}>Breadcrumb</sg-breadcrumb-item>
        
      </sg-breadcrumb>
    </div>

    <!-- Kbd -->
    <div class="component-group">
      <h3 class="component-group-title">Kbd</h3>
      <sg-stack direction="horizontal" gap="grouped" align="center">
        
          <span style="color: var(--sg-color-text-secondary); display: inline-flex; align-items: center; gap: var(--sg-gap-tight)"><kbd class="sg-kbd">Ctrl</kbd> + <kbd class="sg-kbd">S</kbd></span>
          <span style="color: var(--sg-color-text-secondary); display: inline-flex; align-items: center; gap: var(--sg-gap-tight)"><kbd class="sg-kbd">Cmd</kbd> + <kbd class="sg-kbd">K</kbd></span>
          <span style="color: var(--sg-color-text-secondary); display: inline-flex; align-items: center; gap: var(--sg-gap-tight)"><kbd class="sg-kbd">Esc</kbd></span>
        
      </sg-stack>
    </div>

    <!-- Textarea -->
    <div class="component-group">
      <h3 class="component-group-title">Textarea</h3>
      <textarea class="sg-textarea" placeholder="Type your message..." value={textareaValue} oninput={(e) => { const el = e.currentTarget as any; textareaValue = (el.value ?? textareaValue); }} onchange={(e) => { const el = e.currentTarget as any; textareaValue = (el.value ?? textareaValue); }} onclick={(e) => { const el = e.currentTarget as any; textareaValue = (el.value ?? textareaValue); }} ontoggle={(e) => { const el = e.currentTarget as any; textareaValue = (el.value ?? textareaValue); }}></textarea>
    </div>

    <!-- Pagination -->
    <div class="component-group">
      <h3 class="component-group-title">Pagination</h3>
      <sg-pagination-root total={50} perPage={10} aria-label="Pagination">
        
          <sg-pagination-previous />
          <sg-pagination-items />
          <sg-pagination-next />
        
      </sg-pagination-root>
    </div>

    <!-- Drawer -->
    <div class="component-group">
      <h3 class="component-group-title">Drawer</h3>
      <sg-drawer-root open={drawerOpen} oninput={(e) => { const el = e.currentTarget as any; drawerOpen = (el.open ?? drawerOpen); }} onchange={(e) => { const el = e.currentTarget as any; drawerOpen = (el.open ?? drawerOpen); }} onclick={(e) => { const el = e.currentTarget as any; drawerOpen = (el.open ?? drawerOpen); }} ontoggle={(e) => { const el = e.currentTarget as any; drawerOpen = (el.open ?? drawerOpen); }}>
        
          <sg-drawer-trigger>
            
              <button class="sg-button" data-color="primary" onclick={() => drawerOpen = true}>Open Drawer</button>
            
          </sg-drawer-trigger>
          <sg-drawer-content aria-label="Example drawer">
            
              <div style="padding: var(--sg-pad-card, 1.5rem)">
                <sg-drawer-handle />
                <h3 style="margin: var(--sg-space-4) 0 var(--sg-space-2)">Drawer Panel</h3>
                <p style="color: var(--sg-color-text-secondary); margin: 0 0 var(--sg-space-4)">A dialog-based sliding panel.</p>
                <button class="sg-button" data-color="primary" onclick={() => drawerOpen = false}>Close</button>
              </div>
            
          </sg-drawer-content>
        
      </sg-drawer-root>
    </div>

    <!-- Typewriter -->
    <div class="component-group">
      <h3 class="component-group-title">Typewriter</h3>
      <sg-stack gap="grouped">
        
          <div>
            <p style="margin: 0 0 var(--sg-space-2); color: var(--text-3); font-size: var(--sg-text-sm)">Default</p>
            <sg-typewriter text="Build beautiful interfaces with SigUI." speed={40} />
          </div>
          <div>
            <p style="margin: 0 0 var(--sg-space-2); color: var(--text-3); font-size: var(--sg-text-sm)">Slow, no cursor</p>
            <sg-typewriter text="Perceptually uniform color, fluid type, accessible by default." speed={80} cursor={false} />
          </div>
          <div>
            <p style="margin: 0 0 var(--sg-space-2); color: var(--text-3); font-size: var(--sg-text-sm)">Looping</p>
            <sg-typewriter text="Design tokens for every scale." speed={50} loop={true} pauseBetween={2000} />
          </div>
        
      </sg-stack>
    </div>
</sg-section>

<style>
.component-group {
  margin-bottom: var(--sg-space-8);
  padding-bottom: var(--sg-space-8);
  border-bottom: var(--sg-border-thin) solid var(--sg-color-border);
}

.component-group:last-child {
  border-bottom: none;
}

.component-group-title {
  font-size: var(--sg-text-base);
  font-weight: var(--sg-weight-semibold);
  margin-bottom: var(--sg-space-4);
  color: var(--sg-color-text-secondary);
}
</style>
