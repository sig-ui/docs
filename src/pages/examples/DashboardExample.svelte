<script lang="ts">
  import ExamplesLayout from "./ExamplesLayout.svelte";

  // Notification switches
  let pushNotifications = $state(true);
  let emailNotifications = $state(true);
  let smsNotifications = $state(false);
  let marketingNotifications = $state(false);

  // Chart data
  const revenueData = [
    { label: "Jan", value: 4200 },
    { label: "Feb", value: 3800 },
    { label: "Mar", value: 5100 },
    { label: "Apr", value: 4600 },
    { label: "May", value: 6200 },
    { label: "Jun", value: 5800 },
  ];

  const analyticsData = [
    { label: "Jan", value: 3100 },
    { label: "Feb", value: 4400 },
    { label: "Mar", value: 3900 },
    { label: "Apr", value: 5700 },
    { label: "May", value: 5200 },
    { label: "Jun", value: 6800 },
  ];

  function chartMax(data: typeof revenueData) {
    return Math.max(...data.map(d => d.value));
  }

  const revenueMax = chartMax(revenueData);
  const analyticsMax = chartMax(analyticsData);

  // Recent sales list
  const recentSales = [
    { initials: "OM", name: "Olivia Martin", email: "olivia.martin@email.com", amount: "+$1,999.00" },
    { initials: "JL", name: "Jackson Lee", email: "jackson.lee@email.com", amount: "+$39.00" },
    { initials: "IN", name: "Isabella Nguyen", email: "isabella.nguyen@email.com", amount: "+$299.00" },
    { initials: "WK", name: "William Kim", email: "will@email.com", amount: "+$99.00" },
    { initials: "SD", name: "Sofia Davis", email: "sofia.davis@email.com", amount: "+$39.00" },
  ];

  // Stat cards
  const stats = [
    {
      title: "Total Revenue",
      value: "$45,231.89",
      change: "+20.1% from last month",
      icon: `<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>`,
    },
    {
      title: "Active Users",
      value: "+2,350",
      change: "+180.1% from last month",
      icon: `<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`,
    },
    {
      title: "Conversion Rate",
      value: "12.5%",
      change: "+4.2% from last month",
      icon: `<line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>`,
    },
  ];

  // Team members
  const teamMembers = [
    { initials: "OM", name: "Olivia Martin", email: "m@example.com", role: "Owner", color: "primary" as const },
    { initials: "JL", name: "Jackson Lee", email: "p@example.com", role: "Developer", color: "info" as const },
    { initials: "IN", name: "Isabella Nguyen", email: "i@example.com", role: "Developer", color: "info" as const },
    { initials: "WK", name: "William Kim", email: "w@example.com", role: "Viewer", color: "ghost" as const },
  ];

  // Activity feed
  const activities = [
    { text: "Project Alpha deployed to production", time: "2 hours ago", type: "success" },
    { text: "New user registered: emma.wilson@corp.com", time: "4 hours ago", type: "info" },
    { text: "Database backup completed", time: "5 hours ago", type: "success" },
    { text: "API rate limit warning on /v2/users", time: "6 hours ago", type: "warning" },
    { text: "SSL certificate renewed for api.example.com", time: "8 hours ago", type: "info" },
    { text: "Payment service latency spike detected", time: "12 hours ago", type: "warning" },
  ];

  // Progress goals
  const goals = [
    { label: "Monthly Revenue", current: 45231, target: 60000, color: "primary" as const },
    { label: "New Customers", current: 234, target: 300, color: "success" as const },
    { label: "Support Tickets Resolved", current: 87, target: 100, color: "info" as const },
  ];

  const goalProgress = $derived(
    goals.map((g) => ({
      ...g,
      pct: Math.round((g.current / g.target) * 100),
    }))
  );
</script>

<ExamplesLayout>
  
    <div class="dash-root">
      <!-- Welcome header -->
      <div class="dash-header">
        <div class="dash-header-text">
          <h1 class="dash-title">Welcome back!</h1>
          <p class="dash-subtitle">Here's what's happening with your projects today.</p>
        </div>
        <div class="dash-header-actions">
          <button class="sg-button" data-color="secondary" data-size="sm">
            Download Report
          </button>
          <button class="sg-button" data-color="primary" data-size="sm">
            New Project
          </button>
        </div>
      </div>

      <!-- Row 1: Revenue chart (2 cols) + Recent Sales (1 col) -->
      <div class="dash-grid dash-grid--3col">
        <div class="dash-span2">
          <sg-card elevation={1}>
            
              <sg-card-header>
                
                  <div class="dash-card-header-row">
                    <sg-card-title as="h3">Revenue Overview</sg-card-title>
                  </div>
                
              </sg-card-header>
              <sg-card-body>
                
                  <sg-tabs-root defaultValue="overview">
                    
                      <sg-tabs-list aria-label="Revenue view">
                        
                          <sg-tabs-trigger value="overview">Overview</sg-tabs-trigger>
                          <sg-tabs-trigger value="analytics">Analytics</sg-tabs-trigger>
                        
                      </sg-tabs-list>
                      <sg-tabs-content value="overview">

                          <div class="dash-chart-wrap">
                            <svg class="dash-bar-chart" viewBox="0 0 360 200" aria-label="Monthly revenue bar chart" role="img">
                              {#each revenueData as d, i}
                                {@const barH = (d.value / revenueMax) * 160}
                                <rect
                                  x={i * 60 + 12}
                                  y={180 - barH}
                                  width="36"
                                  height={barH}
                                  rx="4"
                                  fill="var(--sg-color-link)"
                                  opacity="0.85"
                                />
                                <text x={i * 60 + 30} y="196" text-anchor="middle" class="dash-chart-label">{d.label}</text>
                              {/each}
                            </svg>
                          </div>

                      </sg-tabs-content>
                      <sg-tabs-content value="analytics">

                          <div class="dash-chart-wrap">
                            <svg class="dash-bar-chart" viewBox="0 0 360 200" aria-label="Revenue trend area chart" role="img">
                              <defs>
                                <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stop-color="var(--sg-color-link)" stop-opacity="0.3" />
                                  <stop offset="100%" stop-color="var(--sg-color-link)" stop-opacity="0.02" />
                                </linearGradient>
                              </defs>
                              <path
                                d="M{analyticsData.map((d, i) => `${i * 60 + 30},${180 - (d.value / analyticsMax) * 160}`).join(' L')} L{(analyticsData.length - 1) * 60 + 30},180 L30,180 Z"
                                fill="url(#area-grad)"
                              />
                              <polyline
                                points={analyticsData.map((d, i) => `${i * 60 + 30},${180 - (d.value / analyticsMax) * 160}`).join(' ')}
                                fill="none"
                                stroke="var(--sg-color-link)"
                                stroke-width="2.5"
                                stroke-linejoin="round"
                              />
                              {#each analyticsData as d, i}
                                <text x={i * 60 + 30} y="196" text-anchor="middle" class="dash-chart-label">{d.label}</text>
                              {/each}
                            </svg>
                          </div>

                      </sg-tabs-content>
                    
                  </sg-tabs-root>
                
              </sg-card-body>
            
          </sg-card>
        </div>

        <div>
          <sg-card elevation={1}>
            
              <sg-card-header>
                
                  <sg-card-title as="h3">Recent Sales</sg-card-title>
                  <sg-card-description>You made 265 sales this month.</sg-card-description>
                
              </sg-card-header>
              <sg-card-body>
                
                  <div class="dash-sales-list">
                    {#each recentSales as sale}
                      <div class="dash-sale-row">
                        <sg-avatar size="sm" fallback={sale.initials} alt={sale.name} />
                        <div class="dash-sale-info">
                          <span class="dash-sale-name">{sale.name}</span>
                          <span class="dash-sale-email">{sale.email}</span>
                        </div>
                        <span class="dash-sale-amount">{sale.amount}</span>
                      </div>
                    {/each}
                  </div>
                
              </sg-card-body>
            
          </sg-card>
        </div>
      </div>

      <!-- Row 2: Three stat cards -->
      <div class="dash-grid dash-grid--3col">
        {#each stats as stat}
          <sg-card elevation={1}>
            
              <sg-card-header>
                
                  <div class="dash-stat-header">
                    <sg-card-title as="h4">{stat.title}</sg-card-title>
                    <svg
                      class="dash-stat-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                    >{@html stat.icon}</svg>
                  </div>
                
              </sg-card-header>
              <sg-card-body>
                
                  <div class="dash-stat-value">{stat.value}</div>
                  <p class="dash-stat-change">{stat.change}</p>
                
              </sg-card-body>
            
          </sg-card>
        {/each}
      </div>

      <!-- Row 3: Team Members + Notifications + Activity -->
      <div class="dash-grid dash-grid--3col">
        <sg-card elevation={1}>
          
            <sg-card-header>
              
                <sg-card-title as="h3">Team Members</sg-card-title>
                <sg-card-description>Invite your team members to collaborate.</sg-card-description>
              
            </sg-card-header>
            <sg-card-body>
              
                <div class="dash-team-list">
                  {#each teamMembers as member, i}
                    {#if i > 0}
                      <hr class="sg-separator" data-orientation="horizontal" aria-hidden="true" />
                    {/if}
                    <div class="dash-team-row">
                      <sg-avatar size="sm" fallback={member.initials} alt={member.name} />
                      <div class="dash-team-info">
                        <span class="dash-team-name">{member.name}</span>
                        <span class="dash-team-email">{member.email}</span>
                      </div>
                      <sg-badge color={member.color} size="sm">
                        {member.role}
                      </sg-badge>
                    </div>
                  {/each}
                </div>
              
            </sg-card-body>
          
        </sg-card>

        <sg-card elevation={1}>
          
            <sg-card-header>
              
                <sg-card-title as="h3">Notifications</sg-card-title>
                <sg-card-description>Choose what notifications you receive.</sg-card-description>
              
            </sg-card-header>
            <sg-card-body>
              
                <div class="dash-notifications-list">
                  <label class="dash-notification-row">
                    <span class="dash-notification-label">Push Notifications</span>
                    <input type="checkbox" class="sg-switch" role="switch" checked={pushNotifications} onchange={(e) => { pushNotifications = (e.currentTarget as HTMLInputElement).checked; }} />
                  </label>
                  <label class="dash-notification-row">
                    <span class="dash-notification-label">Email Notifications</span>
                    <input type="checkbox" class="sg-switch" role="switch" checked={emailNotifications} onchange={(e) => { emailNotifications = (e.currentTarget as HTMLInputElement).checked; }} />
                  </label>
                  <label class="dash-notification-row">
                    <span class="dash-notification-label">SMS Notifications</span>
                    <input type="checkbox" class="sg-switch" role="switch" checked={smsNotifications} onchange={(e) => { smsNotifications = (e.currentTarget as HTMLInputElement).checked; }} />
                  </label>
                  <label class="dash-notification-row">
                    <span class="dash-notification-label">Marketing</span>
                    <input type="checkbox" class="sg-switch" role="switch" checked={marketingNotifications} onchange={(e) => { marketingNotifications = (e.currentTarget as HTMLInputElement).checked; }} />
                  </label>
                </div>
              
            </sg-card-body>
          
        </sg-card>

        <sg-card elevation={1}>
          
            <sg-card-header>
              
                <sg-card-title as="h3">Activity</sg-card-title>
                <sg-card-description>Recent activity across your projects.</sg-card-description>
              
            </sg-card-header>
            <sg-card-body>
              
                <div class="dash-activity-list">
                  {#each activities as activity}
                    <div class="dash-activity-row">
                      <span class="dash-activity-dot dash-activity-dot--{activity.type}"></span>
                      <div class="dash-activity-info">
                        <span class="dash-activity-text">{activity.text}</span>
                        <span class="dash-activity-time">{activity.time}</span>
                      </div>
                    </div>
                  {/each}
                </div>
              
            </sg-card-body>
          
        </sg-card>
      </div>

      <!-- Row 4: Goals Progress (full width) -->
      <div class="dash-grid dash-grid--1col">
        <sg-card elevation={1}>
          
            <sg-card-header>
              
                <sg-card-title as="h3">Goals &amp; Progress</sg-card-title>
                <sg-card-description>Track how your team is performing against monthly targets.</sg-card-description>
              
            </sg-card-header>
            <sg-card-body>
              
                <div class="dash-goals-list">
                  {#each goalProgress as goal}
                    <div class="dash-goal-row">
                      <div class="dash-goal-meta">
                        <span class="dash-goal-label">{goal.label}</span>
                        <span class="dash-goal-pct">{goal.pct}%</span>
                      </div>
                      <progress class="sg-progress" value={goal.pct} max={100} data-color={goal.color} data-size="md"></progress>
                      <div class="dash-goal-numbers">
                        <span class="dash-goal-current">{goal.current.toLocaleString()}</span>
                        <span class="dash-goal-divider">of</span>
                        <span class="dash-goal-target">{goal.target.toLocaleString()}</span>
                      </div>
                    </div>
                  {/each}
                </div>
              
            </sg-card-body>
          
        </sg-card>
      </div>
    </div>
  
</ExamplesLayout>

<style>
  .dash-root {
    padding: var(--sg-space-8) var(--sg-space-8);
    display: flex;
    flex-direction: column;
    gap: var(--sg-space-6);
    max-width: 1200px;
    margin: 0 auto;
  }

  /* ---- Welcome Header ---- */
  .dash-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: var(--sg-gap-grouped);
    flex-wrap: wrap;
  }

  .dash-title {
    font-size: var(--sg-text-2xl);
    font-weight: var(--sg-weight-bold);
    color: var(--sg-color-text);
    letter-spacing: -0.02em;
    line-height: 1.2;
  }

  .dash-subtitle {
    font-size: var(--sg-text-sm);
    color: var(--text-3);
    margin-top: var(--sg-space-1);
  }

  .dash-header-actions {
    display: flex;
    align-items: center;
    gap: var(--sg-space-3);
    flex-shrink: 0;
  }

  /* ---- Grid layouts ---- */
  .dash-grid {
    display: grid;
    gap: var(--sg-space-5);
  }

  .dash-grid--3col {
    grid-template-columns: repeat(3, 1fr);
  }

  .dash-grid--1col {
    grid-template-columns: 1fr;
  }

  .dash-span2 {
    grid-column: span 2;
  }

  /* ---- Card header utility ---- */
  .dash-card-header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  /* ---- Chart ---- */
  .dash-chart-wrap {
    margin-top: var(--sg-space-4);
  }

  .dash-bar-chart {
    width: 100%;
    height: 200px;
  }

  .dash-chart-label {
    font-size: 11px;
    fill: var(--sg-color-text-muted, #888);
    font-family: var(--sg-font-sans, sans-serif);
  }

  /* ---- Recent Sales ---- */
  .dash-sales-list {
    display: flex;
    flex-direction: column;
    gap: var(--sg-gap-grouped);
  }

  .dash-sale-row {
    display: flex;
    align-items: center;
    gap: var(--sg-space-3);
  }

  .dash-sale-info {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
  }

  .dash-sale-name {
    font-size: var(--sg-text-sm);
    font-weight: var(--sg-weight-medium);
    color: var(--sg-color-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .dash-sale-email {
    font-size: var(--sg-text-xs);
    color: var(--text-3);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .dash-sale-amount {
    font-size: var(--sg-text-sm);
    font-weight: var(--sg-weight-semibold);
    color: var(--sg-color-text);
    white-space: nowrap;
  }

  /* ---- Stat cards ---- */
  .dash-stat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .dash-stat-icon {
    width: 16px;
    height: 16px;
    color: var(--text-3);
    flex-shrink: 0;
  }

  .dash-stat-value {
    font-size: var(--sg-text-2xl);
    font-weight: var(--sg-weight-bold);
    letter-spacing: -0.02em;
    color: var(--sg-color-text);
    margin-top: var(--sg-space-1);
  }

  .dash-stat-change {
    font-size: var(--sg-text-xs);
    color: var(--text-3);
    margin-top: var(--sg-space-1);
  }

  /* ---- Team Members ---- */
  .dash-team-list {
    display: flex;
    flex-direction: column;
    gap: var(--sg-space-3);
  }

  .dash-team-row {
    display: flex;
    align-items: center;
    gap: var(--sg-space-3);
  }

  .dash-team-info {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
  }

  .dash-team-name {
    font-size: var(--sg-text-sm);
    font-weight: var(--sg-weight-medium);
    color: var(--sg-color-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .dash-team-email {
    font-size: var(--sg-text-xs);
    color: var(--text-3);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* ---- Notifications ---- */
  .dash-notifications-list {
    display: flex;
    flex-direction: column;
    gap: var(--sg-gap-grouped);
  }

  .dash-notification-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--sg-space-3);
    cursor: pointer;
  }

  .dash-notification-label {
    font-size: var(--sg-text-sm);
    color: var(--sg-color-text);
  }

  /* ---- Activity Feed ---- */
  .dash-activity-list {
    display: flex;
    flex-direction: column;
    gap: var(--sg-gap-grouped);
  }

  .dash-activity-row {
    display: flex;
    align-items: flex-start;
    gap: var(--sg-space-3);
  }

  .dash-activity-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-top: var(--sg-space-1-5);
    flex-shrink: 0;
  }

  .dash-activity-dot--success {
    background: oklch(0.72 0.19 142);
  }

  .dash-activity-dot--info {
    background: oklch(0.7 0.15 250);
  }

  .dash-activity-dot--warning {
    background: oklch(0.75 0.17 70);
  }

  .dash-activity-info {
    display: flex;
    flex-direction: column;
    gap: var(--sg-gap-micro);
    min-width: 0;
  }

  .dash-activity-text {
    font-size: var(--sg-text-sm);
    color: var(--sg-color-text);
    line-height: 1.4;
  }

  .dash-activity-time {
    font-size: var(--sg-text-xs);
    color: var(--text-3);
  }

  /* ---- Goals & Progress ---- */
  .dash-goals-list {
    display: flex;
    flex-direction: column;
    gap: var(--sg-space-6);
  }

  .dash-goal-row {
    display: flex;
    flex-direction: column;
    gap: var(--sg-gap-related);
  }

  .dash-goal-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .dash-goal-label {
    font-size: var(--sg-text-sm);
    font-weight: var(--sg-weight-medium);
    color: var(--sg-color-text);
  }

  .dash-goal-pct {
    font-size: var(--sg-text-sm);
    font-weight: var(--sg-weight-semibold);
    color: var(--sg-color-text-secondary);
  }

  .dash-goal-numbers {
    display: flex;
    align-items: center;
    gap: var(--sg-gap-tight);
    font-size: var(--sg-text-xs);
  }

  .dash-goal-current {
    font-weight: var(--sg-weight-semibold);
    color: var(--sg-color-text-secondary);
  }

  .dash-goal-divider {
    color: var(--text-3);
  }

  .dash-goal-target {
    color: var(--text-3);
  }

  /* ---- Responsive ---- */
  @media (max-width: 768px) {
    .dash-root {
      padding: var(--sg-space-5) var(--sg-space-4);
      gap: var(--sg-gap-grouped);
    }

    .dash-grid--3col {
      grid-template-columns: 1fr;
    }

    .dash-span2 {
      grid-column: span 1;
    }

    .dash-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .dash-header-actions {
      width: 100%;
      justify-content: flex-start;
    }

    .dash-stat-value {
      font-size: var(--sg-text-xl);
    }
  }
</style>
