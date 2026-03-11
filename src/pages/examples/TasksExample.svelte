<script lang="ts">
  import ExamplesLayout from "./ExamplesLayout.svelte";
  type TaskStatus = "Todo" | "In Progress" | "Done" | "Cancelled";
  type TaskPriority = "Low" | "Medium" | "High";
  type TaskType = "Bug" | "Feature" | "Documentation" | "Enhancement";

  interface Task {
    id: string;
    title: string;
    type: TaskType;
    status: TaskStatus;
    priority: TaskPriority;
  }

  const ALL_TASKS: Task[] = [
    { id: "TASK-1001", title: "Fix race condition in authentication middleware", type: "Bug", status: "In Progress", priority: "High" },
    { id: "TASK-1002", title: "Add multi-factor authentication support", type: "Feature", status: "Todo", priority: "High" },
    { id: "TASK-1003", title: "Write API reference for the token generation endpoint", type: "Documentation", status: "Done", priority: "Medium" },
    { id: "TASK-1004", title: "Improve pagination performance for large datasets", type: "Enhancement", status: "In Progress", priority: "Medium" },
    { id: "TASK-1005", title: "Resolve null pointer in user profile serializer", type: "Bug", status: "Done", priority: "High" },
    { id: "TASK-1006", title: "Implement CSV export for report tables", type: "Feature", status: "Todo", priority: "Medium" },
    { id: "TASK-1007", title: "Update onboarding guide with new dashboard layout", type: "Documentation", status: "In Progress", priority: "Low" },
    { id: "TASK-1008", title: "Refactor notification service to use event queue", type: "Enhancement", status: "Todo", priority: "Medium" },
    { id: "TASK-1009", title: "Dropdown closes unexpectedly on Safari iOS", type: "Bug", status: "In Progress", priority: "High" },
    { id: "TASK-1010", title: "Add keyboard shortcut overlay (press ? to open)", type: "Feature", status: "Cancelled", priority: "Low" },
    { id: "TASK-1011", title: "Document component theming API and token overrides", type: "Documentation", status: "Todo", priority: "Medium" },
    { id: "TASK-1012", title: "Reduce bundle size by lazy-loading chart library", type: "Enhancement", status: "Done", priority: "High" },
    { id: "TASK-1013", title: "Memory leak when unmounting calendar component", type: "Bug", status: "Todo", priority: "High" },
    { id: "TASK-1014", title: "Implement real-time collaboration cursors", type: "Feature", status: "Todo", priority: "Medium" },
    { id: "TASK-1015", title: "Add migration guide from v1 to v2", type: "Documentation", status: "Cancelled", priority: "Low" },
    { id: "TASK-1016", title: "Optimize image loading with intersection observer", type: "Enhancement", status: "Done", priority: "Low" },
    { id: "TASK-1017", title: "Focus trap broken inside nested dialogs", type: "Bug", status: "In Progress", priority: "High" },
    { id: "TASK-1018", title: "SSO integration with SAML 2.0 providers", type: "Feature", status: "Todo", priority: "High" },
    { id: "TASK-1019", title: "Write contributing guidelines for open-source repo", type: "Documentation", status: "Done", priority: "Low" },
    { id: "TASK-1020", title: "Add dark mode support to email notification templates", type: "Enhancement", status: "In Progress", priority: "Medium" },
  ];

  type StatusFilter = TaskStatus | "All";
  type PriorityFilter = TaskPriority | "All";

  let searchQuery = $state("");
  let selectedIds = $state(new Set<string>());
  let statusFilter: StatusFilter = $state("All");
  let priorityFilter: PriorityFilter = $state("All");

  const filteredTasks = $derived(
    ALL_TASKS.filter((task) => {
      const matchesSearch = searchQuery.trim() === "" ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || task.status === statusFilter;
      const matchesPriority = priorityFilter === "All" || task.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    })
  );

  const allFilteredSelected = $derived(
    filteredTasks.length > 0 && filteredTasks.every((t) => selectedIds.has(t.id))
  );

  const someFilteredSelected = $derived(
    filteredTasks.some((t) => selectedIds.has(t.id)) && !allFilteredSelected
  );

  function toggleSelectAll() {
    if (allFilteredSelected) {
      const next = new Set(selectedIds);
      filteredTasks.forEach((t) => next.delete(t.id));
      selectedIds = next;
    } else {
      const next = new Set(selectedIds);
      filteredTasks.forEach((t) => next.add(t.id));
      selectedIds = next;
    }
  }

  function toggleSelect(id: string) {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    selectedIds = next;
  }

  function statusColor(status: TaskStatus): "ghost" | "info" | "success" | "danger" {
    const map = { "Todo": "ghost", "In Progress": "info", "Done": "success", "Cancelled": "danger" } as const;
    return map[status];
  }

  function priorityColor(priority: TaskPriority): "ghost" | "warning" | "danger" {
    const map = { "Low": "ghost", "Medium": "warning", "High": "danger" } as const;
    return map[priority];
  }

  function typeColor(type: TaskType): "danger" | "primary" | "info" | "success" {
    const map = { "Bug": "danger", "Feature": "primary", "Documentation": "info", "Enhancement": "success" } as const;
    return map[type];
  }

  const statusFilters: StatusFilter[] = ["All", "Todo", "In Progress", "Done", "Cancelled"];
  const priorityFilters: PriorityFilter[] = ["All", "Low", "Medium", "High"];
</script>

<ExamplesLayout>
  
    <div class="tasks-page">
      <!-- Page Header -->
      <div class="tasks-header">
        <div class="tasks-header-text">
          <h1 class="tasks-title">Welcome back!</h1>
          <p class="tasks-subtitle">Here are your tasks for this month.</p>
        </div>
      </div>

      <!-- Main Card -->
      <sg-card elevation={1}>
        
          <sg-card-header>
            
              <div class="card-head-inner">
                <div class="card-head-left">
                  <sg-card-title>
                    Tasks
                  </sg-card-title>
                  <sg-card-description>
                    Manage and track your team's work items.
                  </sg-card-description>
                </div>
              </div>
            
          </sg-card-header>

          <sg-card-body>
            
              <!-- Toolbar -->
              <div class="toolbar">
                <div class="toolbar-search">
                  <span class="search-icon" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" stroke-width="1.5"/>
                      <path d="M10.5 10.5L14 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                  </span>
                  <input
                    class="search-input"
                    type="search"
                    placeholder="Filter tasks..."
                    value={searchQuery}
                    oninput={(e) => { searchQuery = (e.target as HTMLInputElement).value; }}
                    aria-label="Filter tasks by title or ID"
                  />
                </div>

                <div class="toolbar-filters">
                  <div class="filter-group">
                    <span class="filter-label">Status</span>
                    <div class="filter-chips">
                      {#each statusFilters as s}
                        <button
                          class="filter-chip"
                          class:active={statusFilter === s}
                          onclick={() => { statusFilter = s; }}
                          aria-pressed={statusFilter === s}
                        >{s}</button>
                      {/each}
                    </div>
                  </div>

                  <div class="filter-group">
                    <span class="filter-label">Priority</span>
                    <div class="filter-chips">
                      {#each priorityFilters as p}
                        <button
                          class="filter-chip"
                          class:active={priorityFilter === p}
                          onclick={() => { priorityFilter = p; }}
                          aria-pressed={priorityFilter === p}
                        >{p}</button>
                      {/each}
                    </div>
                  </div>
                </div>
              </div>

              <hr class="sg-separator" data-orientation="horizontal" aria-hidden="true" />

              <!-- Table -->
              <div class="table-wrap" role="region" aria-label="Task list">
                <table class="tasks-table" aria-label="Tasks">
                  <thead>
                    <tr>
                      <th class="col-check" scope="col">
                        <input type="checkbox" class="sg-checkbox"
                          checked={allFilteredSelected}
                          onchange={toggleSelectAll}
                          aria-label="Select all tasks"
                        />
                      </th>
                      <th class="col-id" scope="col">Task</th>
                      <th class="col-title" scope="col">Title</th>
                      <th class="col-type" scope="col">Type</th>
                      <th class="col-status" scope="col">Status</th>
                      <th class="col-priority" scope="col">Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {#if filteredTasks.length === 0}
                      <tr>
                        <td colspan="6" class="empty-row">
                          <div class="empty-state">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                              <rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" stroke-width="1.5"/>
                            </svg>
                            <span>No tasks match your filters.</span>
                          </div>
                        </td>
                      </tr>
                    {:else}
                      {#each filteredTasks as task (task.id)}
                        {@const isSelected = selectedIds.has(task.id)}
                        <tr
                          class="task-row"
                          class:selected={isSelected}
                          onclick={() => toggleSelect(task.id)}
                          aria-selected={isSelected}
                        >
                          <td class="col-check" onclick={(e) => e.stopPropagation()}>
                            <input type="checkbox" class="sg-checkbox"
                              checked={isSelected}
                              onchange={() => toggleSelect(task.id)}
                              aria-label={`Select ${task.id}`}
                            />
                          </td>
                          <td class="col-id">
                            <span class="task-id">{task.id}</span>
                          </td>
                          <td class="col-title">
                            <span class="task-title">{task.title}</span>
                          </td>
                          <td class="col-type">
                            <sg-badge color={typeColor(task.type)} size="sm">
                              {task.type}
                            </sg-badge>
                          </td>
                          <td class="col-status">
                            <sg-badge color={statusColor(task.status)} size="sm">
                              {task.status}
                            </sg-badge>
                          </td>
                          <td class="col-priority">
                            <sg-badge color={priorityColor(task.priority)} size="sm">
                              {task.priority}
                            </sg-badge>
                          </td>
                        </tr>
                      {/each}
                    {/if}
                  </tbody>
                </table>
              </div>

              <!-- Bottom Bar -->
              <div class="bottom-bar">
                <span class="row-count">
                  {selectedIds.size} of {ALL_TASKS.length} row{ALL_TASKS.length !== 1 ? "s" : ""} selected
                </span>
                <div class="pagination-info">
                  <span class="page-info">
                    Showing {filteredTasks.length} of {ALL_TASKS.length} tasks
                  </span>
                </div>
              </div>
            
          </sg-card-body>
        
      </sg-card>
    </div>
  
</ExamplesLayout>

<style>
  .tasks-page {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 var(--sg-space-6);
    display: flex;
    flex-direction: column;
    gap: var(--sg-space-6);
  }

  /* ===== Header ===== */

  .tasks-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: var(--sg-gap-grouped);
  }

  .tasks-title {
    font-size: var(--sg-text-2xl);
    font-weight: var(--sg-weight-bold);
    letter-spacing: -0.02em;
    color: var(--sg-color-text);
    line-height: 1.2;
    margin-bottom: var(--sg-space-1);
  }

  .tasks-subtitle {
    font-size: var(--sg-text-base);
    color: var(--text-3);
    margin: 0;
  }

  /* ===== Card internals ===== */

  .card-head-inner {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--sg-gap-grouped);
  }

  .card-head-left {
    display: flex;
    flex-direction: column;
    gap: var(--sg-gap-tight);
  }

  /* ===== Toolbar ===== */

  .toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: var(--sg-gap-grouped);
    padding: var(--sg-space-4) 0 var(--sg-space-3);
  }

  .toolbar-search {
    display: flex;
    align-items: center;
    gap: var(--sg-gap-related);
    background: var(--sg-surface-container-high);
    border: var(--sg-border-thin) solid var(--sg-color-border);
    border-radius: var(--sg-radius-md);
    padding: var(--sg-space-2) var(--sg-space-3);
    min-width: 220px;
    flex: 1;
    max-width: 320px;
    transition: border-color var(--sg-duration-fast);
  }

  .toolbar-search:focus-within {
    border-color: var(--sg-color-link);
  }

  .search-icon {
    color: var(--text-3);
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .search-input {
    flex: 1;
    border: none;
    background: transparent;
    color: var(--sg-color-text);
    font-size: var(--sg-text-sm);
    outline: none;
    min-width: 0;
  }

  .search-input::placeholder {
    color: var(--text-3);
  }

  .search-input::-webkit-search-cancel-button {
    -webkit-appearance: none;
    appearance: none;
  }

  .toolbar-filters {
    display: flex;
    flex-wrap: wrap;
    gap: var(--sg-gap-grouped);
    align-items: center;
  }

  .filter-group {
    display: flex;
    align-items: center;
    gap: var(--sg-gap-related);
  }

  .filter-label {
    font-size: var(--sg-text-xs);
    font-weight: var(--sg-weight-semibold);
    text-transform: uppercase;
    letter-spacing: var(--sg-tracking-caps);
    color: var(--text-3);
    white-space: nowrap;
  }

  .filter-chips {
    display: flex;
    gap: var(--sg-gap-tight);
    flex-wrap: wrap;
  }

  .filter-chip {
    padding: var(--sg-space-1) var(--sg-space-2-5);
    border: var(--sg-border-thin) solid var(--sg-color-border);
    border-radius: var(--sg-radius-full);
    background: transparent;
    color: var(--text-3);
    font-size: var(--sg-text-xs);
    font-weight: var(--sg-weight-medium);
    cursor: pointer;
    transition: all var(--sg-duration-fast);
    white-space: nowrap;
  }

  .filter-chip:hover {
    color: var(--sg-color-text);
    border-color: var(--border-hover);
    background: oklch(from var(--sg-color-text) l c h / 0.04);
  }

  .filter-chip.active {
    background: oklch(from var(--sg-color-link) l c h / 0.12);
    border-color: oklch(from var(--sg-color-link) l c h / 0.3);
    color: var(--sg-color-link);
  }

  /* ===== Table ===== */

  .table-wrap {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .tasks-table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--sg-text-sm);
    min-width: 640px;
  }

  .tasks-table thead {
    border-bottom: var(--sg-border-thin) solid var(--sg-color-border);
  }

  .tasks-table th {
    padding: var(--sg-space-2-5) var(--sg-space-3);
    text-align: left;
    font-size: var(--sg-text-xs);
    font-weight: var(--sg-weight-semibold);
    text-transform: uppercase;
    letter-spacing: var(--sg-tracking-caps);
    color: var(--text-3);
    white-space: nowrap;
    user-select: none;
  }

  .tasks-table tbody tr {
    border-bottom: var(--sg-border-thin) solid var(--sg-color-border);
  }

  .tasks-table tbody tr:last-child {
    border-bottom: none;
  }

  .task-row {
    cursor: pointer;
    transition: background var(--sg-duration-fast);
  }

  .task-row:hover {
    background: oklch(from var(--sg-color-text) l c h / 0.03);
  }

  .task-row.selected {
    background: oklch(from var(--sg-color-link) l c h / 0.06);
  }

  .task-row.selected:hover {
    background: oklch(from var(--sg-color-link) l c h / 0.09);
  }

  .tasks-table td {
    padding: var(--sg-space-3) var(--sg-space-3);
    vertical-align: middle;
  }

  /* Column sizing */

  .col-check {
    width: 44px;
    padding-left: var(--sg-space-4);
    padding-right: var(--sg-space-2);
  }

  .tasks-table th.col-check {
    padding-left: var(--sg-space-4);
  }

  .col-id {
    width: 120px;
    white-space: nowrap;
  }

  .col-title {
    /* stretches to fill */
  }

  .col-type {
    width: 130px;
    white-space: nowrap;
  }

  .col-status {
    width: 120px;
    white-space: nowrap;
  }

  .col-priority {
    width: 100px;
    white-space: nowrap;
    padding-right: var(--sg-space-4);
  }

  .tasks-table th.col-priority {
    padding-right: var(--sg-space-4);
  }

  /* Cell content */

  .task-id {
    font-family: var(--sg-font-mono);
    font-size: var(--sg-text-xs);
    color: var(--text-3);
    white-space: nowrap;
  }

  .task-title {
    color: var(--sg-color-text);
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* Empty state */

  .empty-row td {
    padding: var(--sg-space-12) var(--sg-space-4);
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--sg-space-3);
    color: var(--text-3);
    font-size: var(--sg-text-sm);
  }

  /* ===== Bottom Bar ===== */

  .bottom-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--sg-space-3) 0 var(--sg-space-1);
    gap: var(--sg-gap-grouped);
    flex-wrap: wrap;
  }

  .row-count {
    font-size: var(--sg-text-sm);
    color: var(--text-3);
  }

  .pagination-info {
    display: flex;
    align-items: center;
    gap: var(--sg-space-3);
  }

  .page-info {
    font-size: var(--sg-text-sm);
    color: var(--text-3);
  }

  /* ===== Responsive ===== */

  @media (max-width: 768px) {
    .tasks-page {
      padding: 0 var(--sg-space-4);
    }

    .toolbar {
      flex-direction: column;
      align-items: stretch;
    }

    .toolbar-search {
      max-width: none;
    }

    .toolbar-filters {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--sg-space-3);
    }

    .tasks-title {
      font-size: var(--sg-text-xl);
    }
  }
</style>
