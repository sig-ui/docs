<script lang="ts">
  let pushNotifications = $state(true);
  let emailNotifications = $state(true);
  let smsNotifications = $state(false);

  const revenueData = [
    { label: "Jan", value: 4200, color: "var(--sg-color-link)" },
    { label: "Feb", value: 3800, color: "var(--sg-color-link)" },
    { label: "Mar", value: 5100, color: "var(--sg-color-link)" },
    { label: "Apr", value: 4600, color: "var(--sg-color-link)" },
    { label: "May", value: 6200, color: "var(--sg-color-link)" },
    { label: "Jun", value: 5800, color: "var(--sg-color-link)" },
  ];

  const recentSales = [
    { initials: "OM", name: "Olivia Martin", email: "olivia.martin@email.com", amount: "+$1,999.00" },
    { initials: "JL", name: "Jackson Lee", email: "jackson.lee@email.com", amount: "+$39.00" },
    { initials: "IN", name: "Isabella Nguyen", email: "isabella.nguyen@email.com", amount: "+$299.00" },
    { initials: "WK", name: "William Kim", email: "will@email.com", amount: "+$99.00" },
    { initials: "SD", name: "Sofia Davis", email: "sofia.davis@email.com", amount: "+$39.00" },
  ];

  const teamMembers = [
    { initials: "OM", name: "Olivia Martin", email: "m@example.com", role: "Owner", color: "primary" as const },
    { initials: "JL", name: "Jackson Lee", email: "p@example.com", role: "Developer", color: "info" as const },
    { initials: "IN", name: "Isabella Nguyen", email: "i@example.com", role: "Developer", color: "info" as const },
    { initials: "WK", name: "William Kim", email: "w@example.com", role: "Viewer", color: "ghost" as const },
  ];

  const activities = [
    { text: "Project Alpha deployed to production", time: "2 hours ago", type: "success" },
    { text: "New user registered: emma.wilson@corp.com", time: "4 hours ago", type: "info" },
    { text: "Database backup completed", time: "5 hours ago", type: "success" },
    { text: "API rate limit warning on /v2/users", time: "6 hours ago", type: "warning" },
    { text: "SSL certificate renewed for api.example.com", time: "8 hours ago", type: "info" },
    { text: "Payment service latency spike detected", time: "12 hours ago", type: "warning" },
  ];
</script>

<section class="examples-section" id="examples">
  <sg-container size="lg">
    <div class="landing-section-header">
      <span class="landing-section-label">Examples</span>
      <h2 class="landing-section-title">Build <em>anything</em></h2>
      <p class="landing-section-desc">
        Production-ready components that compose into real applications. Here's what a dashboard looks like with SigUI.
      </p>
    </div>

    <div class="examples-grid">
      <!-- Row 1: Revenue Overview (2 cols) + Recent Sales (1 col) -->
      <div class="examples-revenue">
        <sg-card elevation={1}>
          
            <sg-card-header>
              
                <div class="examples-revenue-header">
                  <sg-card-title as="h3">Revenue Overview</sg-card-title>
                </div>
              
            </sg-card-header>
            <sg-card-body>
              
                <sg-tabs-root defaultValue="overview">
                  
                    <sg-tabs-list>
                      
                        <sg-tabs-trigger value="overview">Overview</sg-tabs-trigger>
                        <sg-tabs-trigger value="analytics">Analytics</sg-tabs-trigger>
                      
                    </sg-tabs-list>
                    <sg-tabs-content value="overview">
                      
                        <div class="examples-chart-wrap">
                          <sg-chart
                            type="bar"
                            data={revenueData}
                            height="260px"
                            showGrid={true}
                            showLabels={true}
                            label="Monthly revenue"
                          />
                        </div>
                      
                    </sg-tabs-content>
                    <sg-tabs-content value="analytics">
                      
                        <div class="examples-chart-wrap">
                          <sg-chart
                            type="area"
                            data={revenueData}
                            height="260px"
                            showGrid={true}
                            showLabels={true}
                            label="Revenue trend"
                          />
                        </div>
                      
                    </sg-tabs-content>
                  
                </sg-tabs-root>
              
            </sg-card-body>
          
        </sg-card>
      </div>

      <div class="examples-sales">
        <sg-card elevation={1}>
          
            <sg-card-header>
              
                <sg-card-title as="h3">Recent Sales</sg-card-title>
                <sg-card-description>You made 265 sales this month.</sg-card-description>
              
            </sg-card-header>
            <sg-card-body>
              
                <div class="examples-sales-list">
                  {#each recentSales as sale}
                    <div class="examples-sale-row">
                      <sg-avatar size="sm" fallback={sale.initials} alt={sale.name} />
                      <div class="examples-sale-info">
                        <span class="examples-sale-name">{sale.name}</span>
                        <span class="examples-sale-email">{sale.email}</span>
                      </div>
                      <span class="examples-sale-amount">{sale.amount}</span>
                    </div>
                  {/each}
                </div>
              
            </sg-card-body>
          
        </sg-card>
      </div>

      <!-- Row 2: Three Stats Cards -->
      <div class="examples-stat">
        <sg-card elevation={1}>
          
            <sg-card-header>
              
                <div class="examples-stat-header">
                  <sg-card-title as="h4">Total Revenue</sg-card-title>
                  <svg class="examples-stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
              
            </sg-card-header>
            <sg-card-body>
              
                <div class="examples-stat-value">$45,231.89</div>
                <p class="examples-stat-change">+20.1% from last month</p>
              
            </sg-card-body>
          
        </sg-card>
      </div>

      <div class="examples-stat">
        <sg-card elevation={1}>
          
            <sg-card-header>
              
                <div class="examples-stat-header">
                  <sg-card-title as="h4">Active Users</sg-card-title>
                  <svg class="examples-stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
              
            </sg-card-header>
            <sg-card-body>
              
                <div class="examples-stat-value">+2,350</div>
                <p class="examples-stat-change">+180.1% from last month</p>
              
            </sg-card-body>
          
        </sg-card>
      </div>

      <div class="examples-stat">
        <sg-card elevation={1}>
          
            <sg-card-header>
              
                <div class="examples-stat-header">
                  <sg-card-title as="h4">Conversion Rate</sg-card-title>
                  <svg class="examples-stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>
                </div>
              
            </sg-card-header>
            <sg-card-body>
              
                <div class="examples-stat-value">12.5%</div>
                <p class="examples-stat-change">+4.2% from last month</p>
              
            </sg-card-body>
          
        </sg-card>
      </div>

      <!-- Row 3: Team Members + Notifications + Activity -->
      <div class="examples-team">
        <sg-card elevation={1}>
          
            <sg-card-header>
              
                <sg-card-title as="h3">Team Members</sg-card-title>
                <sg-card-description>Invite your team members to collaborate.</sg-card-description>
              
            </sg-card-header>
            <sg-card-body>
              
                <div class="examples-team-list">
                  {#each teamMembers as member, i}
                    {#if i > 0}
                      <hr class="sg-separator" data-orientation="horizontal" aria-hidden="true" />
                    {/if}
                    <div class="examples-team-row">
                      <sg-avatar size="sm" fallback={member.initials} alt={member.name} />
                      <div class="examples-team-info">
                        <span class="examples-team-name">{member.name}</span>
                        <span class="examples-team-email">{member.email}</span>
                      </div>
                      <sg-badge color={member.color} size="sm">{member.role}</sg-badge>
                    </div>
                  {/each}
                </div>
              
            </sg-card-body>
          
        </sg-card>
      </div>

      <div class="examples-notifications">
        <sg-card elevation={1}>
          
            <sg-card-header>
              
                <sg-card-title as="h3">Notifications</sg-card-title>
                <sg-card-description>Choose what notifications you receive.</sg-card-description>
              
            </sg-card-header>
            <sg-card-body>
              
                <div class="examples-notifications-list">
                  <input class="sg-switch" role="switch" type="checkbox" checked={pushNotifications} oninput={(e) => { const el = e.currentTarget as any; pushNotifications = (el.checked ?? pushNotifications); }} onchange={(e) => { const el = e.currentTarget as any; pushNotifications = (el.checked ?? pushNotifications); }} onclick={(e) => { const el = e.currentTarget as any; pushNotifications = (el.checked ?? pushNotifications); }} ontoggle={(e) => { const el = e.currentTarget as any; pushNotifications = (el.checked ?? pushNotifications); }} />
                  <input class="sg-switch" role="switch" type="checkbox" checked={emailNotifications} oninput={(e) => { const el = e.currentTarget as any; emailNotifications = (el.checked ?? emailNotifications); }} onchange={(e) => { const el = e.currentTarget as any; emailNotifications = (el.checked ?? emailNotifications); }} onclick={(e) => { const el = e.currentTarget as any; emailNotifications = (el.checked ?? emailNotifications); }} ontoggle={(e) => { const el = e.currentTarget as any; emailNotifications = (el.checked ?? emailNotifications); }} />
                  <input class="sg-switch" role="switch" type="checkbox" checked={smsNotifications} oninput={(e) => { const el = e.currentTarget as any; smsNotifications = (el.checked ?? smsNotifications); }} onchange={(e) => { const el = e.currentTarget as any; smsNotifications = (el.checked ?? smsNotifications); }} onclick={(e) => { const el = e.currentTarget as any; smsNotifications = (el.checked ?? smsNotifications); }} ontoggle={(e) => { const el = e.currentTarget as any; smsNotifications = (el.checked ?? smsNotifications); }} />
                </div>
              
            </sg-card-body>
          
        </sg-card>
      </div>

      <div class="examples-activity">
        <sg-card elevation={1}>
          
            <sg-card-header>
              
                <sg-card-title as="h3">Activity</sg-card-title>
                <sg-card-description>Recent activity across your projects.</sg-card-description>
              
            </sg-card-header>
            <sg-card-body>
              
                <div class="examples-activity-list">
                  {#each activities as activity}
                    <div class="examples-activity-row">
                      <span class="examples-activity-dot examples-activity-dot--{activity.type}"></span>
                      <div class="examples-activity-info">
                        <span class="examples-activity-text">{activity.text}</span>
                        <span class="examples-activity-time">{activity.time}</span>
                      </div>
                    </div>
                  {/each}
                </div>
              
            </sg-card-body>
          
        </sg-card>
      </div>
    </div>
  </sg-container>
</section>

<style>
.examples-section {
  padding: var(--sg-space-24) 0;
}

.examples-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--sg-space-5);
}

.examples-revenue {
  grid-column: span 2;
}

.examples-chart-wrap {
  margin-top: var(--sg-space-4);
}

/* Recent Sales */
.examples-sales-list {
  display: flex;
  flex-direction: column;
  gap: var(--sg-gap-grouped);
}

.examples-sale-row {
  display: flex;
  align-items: center;
  gap: var(--sg-space-3);
}

.examples-sale-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.examples-sale-name {
  font-size: var(--sg-text-sm);
  font-weight: var(--sg-weight-medium);
  color: var(--sg-color-text);
}

.examples-sale-email {
  font-size: var(--sg-text-xs);
  color: var(--text-3);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.examples-sale-amount {
  font-size: var(--sg-text-sm);
  font-weight: var(--sg-weight-semibold);
  color: var(--sg-color-text);
  white-space: nowrap;
}

/* Stats */
.examples-stat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.examples-stat-icon {
  width: 16px;
  height: 16px;
  color: var(--text-3);
}

.examples-stat-value {
  font-size: var(--sg-text-2xl);
  font-weight: var(--sg-weight-bold);
  letter-spacing: -0.02em;
  color: var(--sg-color-text);
}

.examples-stat-change {
  font-size: var(--sg-text-xs);
  color: var(--text-3);
  margin-top: var(--sg-space-1);
}

/* Team Members */
.examples-team-list {
  display: flex;
  flex-direction: column;
  gap: var(--sg-space-3);
}

.examples-team-row {
  display: flex;
  align-items: center;
  gap: var(--sg-space-3);
}

.examples-team-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.examples-team-name {
  font-size: var(--sg-text-sm);
  font-weight: var(--sg-weight-medium);
  color: var(--sg-color-text);
}

.examples-team-email {
  font-size: var(--sg-text-xs);
  color: var(--text-3);
}

/* Notifications */
.examples-notifications-list {
  display: flex;
  flex-direction: column;
  gap: var(--sg-space-5);
}

/* Activity */
.examples-activity-list {
  display: flex;
  flex-direction: column;
  gap: var(--sg-gap-grouped);
}

.examples-activity-row {
  display: flex;
  align-items: flex-start;
  gap: var(--sg-space-3);
}

.examples-activity-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: var(--sg-space-1-5);
  flex-shrink: 0;
}

.examples-activity-dot--success {
  background: oklch(0.72 0.19 142);
}

.examples-activity-dot--info {
  background: oklch(0.7 0.15 250);
}

.examples-activity-dot--warning {
  background: oklch(0.75 0.17 70);
}

.examples-activity-info {
  display: flex;
  flex-direction: column;
  gap: var(--sg-gap-micro);
  min-width: 0;
}

.examples-activity-text {
  font-size: var(--sg-text-sm);
  color: var(--sg-color-text);
  line-height: 1.4;
}

.examples-activity-time {
  font-size: var(--sg-text-xs);
  color: var(--text-3);
}

@media (max-width: 768px) {
  .examples-grid {
    grid-template-columns: 1fr;
  }

  .examples-revenue {
    grid-column: span 1;
  }
}
</style>
