<script lang="ts">
  import ExamplesLayout from "./ExamplesLayout.svelte";
  interface Email {
    id: string;
    sender: string;
    email: string;
    subject: string;
    preview: string;
    body: string[];
    date: string;
    tags: string[];
    read: boolean;
    replyTo?: string;
  }

  const emails: Email[] = [
    {
      id: "1",
      sender: "William Smith",
      email: "william.smith@example.com",
      subject: "Meeting Tomorrow",
      preview: "Hi, let's have a meeting tomorrow to discuss the project. I've been reviewing the latest milestone...",
      body: [
        "Hi team, let's have a meeting tomorrow to discuss the project progress and upcoming deliverables. I've been reviewing the latest milestone reports and I think we need to align on a few key areas before we proceed.",
        "Could everyone come prepared with a status update on their respective components? We'll also need to review the timeline for Q2 and address any blockers that are currently slowing us down.",
        "Please confirm your availability by end of day. The meeting is scheduled for 10 AM in Conference Room B. Looking forward to seeing everyone there.",
      ],
      date: "2h ago",
      tags: ["work", "important"],
      read: false,
      replyTo: "william.smith@example.com",
    },
    {
      id: "2",
      sender: "Alice Chen",
      email: "alice.chen@example.com",
      subject: "Re: Project Update",
      preview: "Thanks for the update! I'll review the documentation and get back to you with my thoughts by Friday...",
      body: [
        "Thanks for the thorough update on the project! I'll review the documentation you shared and get back to you with my detailed thoughts by Friday afternoon.",
        "A few initial observations: the API design looks solid, and the error handling strategy you've proposed aligns well with our existing patterns. I'll focus my review on the authentication flow and the data migration plan.",
        "Also, do you have bandwidth to pair program on the integration tests next week? I think it would be faster to tackle those together.",
      ],
      date: "4h ago",
      tags: ["work"],
      read: true,
      replyTo: "alice.chen@example.com",
    },
    {
      id: "3",
      sender: "Bob Johnson",
      email: "bob.johnson@acme.com",
      subject: "Weekend Plans",
      preview: "Hey! Are you free this weekend? A group of us are planning a hiking trip to the national park...",
      body: [
        "Hey! Are you free this weekend? A group of us are planning a hiking trip to the national park. Should be a fantastic time – the weather forecast looks great and the fall foliage is at its peak right now.",
        "We're planning to leave Saturday morning around 7 AM and be back by Sunday evening. Let me know if you're interested and I'll add you to the group chat.",
        "Bring good boots and pack light. We'll handle the food prep for the group.",
      ],
      date: "yesterday",
      tags: ["personal"],
      read: true,
    },
    {
      id: "4",
      sender: "Emily Parker",
      email: "emily@designco.io",
      subject: "New Design Mockups",
      preview: "I've finished the mockups for the new dashboard. Take a look and let me know what you think about the...",
      body: [
        "I've finished the mockups for the new dashboard. Take a look and let me know what you think about the layout and color choices. I tried to keep it consistent with our design system while giving it a fresh feel.",
        "The main changes are: a reorganized navigation structure that puts the most-used actions front and center, updated data visualization components with better accessibility contrast ratios, and a new notification center in the top right.",
        "I've uploaded everything to Figma. The link is in the shared drive. Hoping to get feedback by Thursday so we can finalize before the sprint review.",
      ],
      date: "yesterday",
      tags: ["work", "design"],
      read: false,
      replyTo: "emily@designco.io",
    },
    {
      id: "5",
      sender: "Travel Rewards",
      email: "noreply@travelrewards.com",
      subject: "Your points are expiring soon",
      preview: "You have 12,450 points that will expire on March 31. Redeem them now for flights, hotels, and more...",
      body: [
        "You have 12,450 reward points that will expire on March 31, 2026. Don't let them go to waste – redeem them now for flights, hotels, car rentals, and exclusive experiences.",
        "Log in to your account to see all available redemption options. Points can also be transferred to partner airlines and hotel chains at a 1:1 rate.",
        "Questions? Contact our support team at support@travelrewards.com or call 1-800-555-0199.",
      ],
      date: "2 days ago",
      tags: ["travel"],
      read: true,
    },
    {
      id: "6",
      sender: "Michael Torres",
      email: "m.torres@example.com",
      subject: "Q1 Financial Summary",
      preview: "Please find attached the Q1 financial summary. Revenue is up 14% YoY, with strong growth in the...",
      body: [
        "Please find attached the Q1 financial summary. Revenue is up 14% year-over-year, with particularly strong growth in the enterprise segment. Operating margins have improved by 2.3 percentage points compared to the same period last year.",
        "Key highlights: ARR reached $8.2M (up from $7.1M in Q1 2025), customer acquisition cost decreased by 18%, and net revenue retention stands at 112%.",
        "We'll review these results in detail at the board meeting on March 15. Please reach out if you have questions beforehand.",
      ],
      date: "3 days ago",
      tags: ["finance", "work"],
      read: true,
      replyTo: "m.torres@example.com",
    },
    {
      id: "7",
      sender: "Sarah Kim",
      email: "sarah.kim@example.com",
      subject: "Lunch tomorrow?",
      preview: "Hey! Are you free for lunch tomorrow? I wanted to catch up and hear how the new role is going...",
      body: [
        "Hey! Are you free for lunch tomorrow? I wanted to catch up – it's been a while since we've had a chance to talk properly. I heard about the new role and wanted to hear how it's going.",
        "How about the Mediterranean place on 5th? They have a great lunch special on Tuesdays. We could meet around noon.",
        "Let me know if that works or if another time is better. Hope to see you soon!",
      ],
      date: "3 days ago",
      tags: ["personal"],
      read: true,
    },
    {
      id: "8",
      sender: "GitHub",
      email: "noreply@github.com",
      subject: "PR review requested: feat/auth-refactor",
      preview: "David Chen has requested your review on pull request #247: Refactor authentication middleware to...",
      body: [
        "David Chen has requested your review on pull request #247: Refactor authentication middleware to support OAuth 2.0 token refresh flows.",
        "This PR updates the authentication middleware layer to properly handle token expiration and refresh. It also adds comprehensive test coverage for edge cases around concurrent refresh requests.",
        "Review the pull request on GitHub: github.com/yourorg/repo/pull/247",
      ],
      date: "4 days ago",
      tags: ["work"],
      read: false,
    },
    {
      id: "9",
      sender: "FinanceHub",
      email: "statements@financehub.com",
      subject: "Your February statement is ready",
      preview: "Your February account statement is now available. Total spending this month: $2,847.32 across...",
      body: [
        "Your February account statement is now available to view and download. Total spending this month: $2,847.32 across all categories.",
        "Top spending categories: Dining & Entertainment ($487.20), Travel ($1,204.00), Software & Subscriptions ($312.50), and Other ($843.62).",
        "Log in to your account to view the full statement, set spending alerts, or adjust your budget categories.",
      ],
      date: "5 days ago",
      tags: ["finance"],
      read: true,
    },
    {
      id: "10",
      sender: "James Liu",
      email: "james.liu@example.com",
      subject: "Conference speaking opportunity",
      preview: "Hi! I'm organizing FrontendConf 2026 and would love to invite you to speak. We're looking for talks on...",
      body: [
        "Hi! I'm organizing FrontendConf 2026 and would love to invite you to speak. We're looking for talks on modern web architecture, design systems, and developer experience – all topics you've written and spoken about extensively.",
        "The conference runs May 14-16 in San Francisco. We cover travel, accommodation, and provide an honorarium. The expected audience is 800–1,200 front-end engineers.",
        "If you're interested, please reply with a brief abstract proposal and we'll take it from there. The submission deadline is March 20.",
      ],
      date: "1 week ago",
      tags: ["work", "important"],
      read: true,
      replyTo: "james.liu@example.com",
    },
  ];

  const folders = [
    { id: "inbox", label: "Inbox", badge: 128 },
    { id: "drafts", label: "Drafts", badge: 9 },
    { id: "sent", label: "Sent", badge: null },
    { id: "junk", label: "Junk", badge: 23 },
    { id: "trash", label: "Trash", badge: null },
    { id: "archive", label: "Archive", badge: null },
  ];

  const labels = [
    { id: "work", label: "Work", color: "var(--sg-color-border-focus)" },
    { id: "personal", label: "Personal", color: "var(--tertiary-500)" },
    { id: "travel", label: "Travel", color: "var(--accent-500)" },
    { id: "finance", label: "Finance", color: "var(--secondary-500)" },
  ];

  const tagColorMap: Record<string, "primary" | "success" | "warning" | "secondary" | "info"> = {
    work: "primary",
    personal: "success",
    travel: "warning",
    finance: "secondary",
    design: "info",
    important: "secondary",
  };

  let selectedEmailId = $state("1");
  let searchQuery = $state("");
  let activeTab = $state("all");
  let activeFolder = $state("inbox");

  const selectedEmail = $derived(emails.find((e) => e.id === selectedEmailId) ?? emails[0]);

  const filteredEmails = $derived(
    emails.filter((email) => {
      const matchesSearch =
        searchQuery === "" ||
        email.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.preview.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTab = activeTab === "all" || (activeTab === "unread" && !email.read);

      return matchesSearch && matchesTab;
    })
  );

  function getInitials(name: string): string {
    return name
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }
</script>

<ExamplesLayout>
  
    <div class="mail-shell">
      <!-- Left Sidebar -->
      <aside class="mail-sidebar">
        <div class="mail-account">
          <sg-avatar size="sm" alt="Your Name" fallback="YN" />
          <div class="mail-account-info">
            <span class="mail-account-name">Your Name</span>
            <span class="mail-account-email">you@example.com</span>
          </div>
        </div>

        <hr class="sg-separator" data-orientation="horizontal" aria-hidden="true" />

        <nav class="mail-folders" aria-label="Mail folders">
          {#each folders as folder}
            <button
              class="mail-folder-btn"
              class:active={activeFolder === folder.id}
              onclick={() => (activeFolder = folder.id)}
              aria-current={activeFolder === folder.id ? "page" : undefined}
            >
              <span class="mail-folder-label">{folder.label}</span>
              {#if folder.badge !== null}
                <sg-badge color="primary" size="sm">
                  {folder.badge}
                </sg-badge>
              {/if}
            </button>
          {/each}
        </nav>

        <hr class="sg-separator" data-orientation="horizontal" aria-hidden="true" />

        <div class="mail-labels-section">
          <span class="mail-section-title">Labels</span>
          {#each labels as label}
            <button class="mail-label-btn" onclick={() => {}}>
              <span
                class="mail-label-dot"
                style="background-color: {label.color};"
                aria-hidden="true"
              ></span>
              <span>{label.label}</span>
            </button>
          {/each}
        </div>
      </aside>

      <!-- Middle Panel: Email List -->
      <section class="mail-list-panel" aria-label="Email list">
        <div class="mail-list-search">
          <input
            class="sg-input"
            placeholder="Search mail..."
            value={searchQuery} oninput={(e) => { const el = e.currentTarget as any; searchQuery = (el.value ?? searchQuery); }} onclick={(e) => { const el = e.currentTarget as any; searchQuery = (el.value ?? searchQuery); }} ontoggle={(e) => { const el = e.currentTarget as any; searchQuery = (el.value ?? searchQuery); }}
            onchange={(e) => { const v = ((e as CustomEvent<any>).detail ?? (e.currentTarget as any).value); (searchQuery = v) }}
            aria-label="Search mail"
          />
        </div>

        <sg-tabs-root value={activeTab} oninput={(e) => { const el = e.currentTarget as any; activeTab = (el.value ?? activeTab); }} onchange={(e) => { const el = e.currentTarget as any; activeTab = (el.value ?? activeTab); }} onclick={(e) => { const el = e.currentTarget as any; activeTab = (el.value ?? activeTab); }} ontoggle={(e) => { const el = e.currentTarget as any; activeTab = (el.value ?? activeTab); }}>
          <sg-tabs-list aria-label="Filter emails">
            <sg-tabs-trigger value="all">
              All Mail
            </sg-tabs-trigger>
            <sg-tabs-trigger value="unread">
              Unread
            </sg-tabs-trigger>
          </sg-tabs-list>

          <sg-tabs-content value="all">
            
              <sg-scroll-area-root type="hover">
                <sg-scroll-area-viewport>
                  <div class="mail-email-list" role="listbox" aria-label="Email messages">
                    {#each filteredEmails as email (email.id)}
                      <button
                        class="mail-email-item"
                        class:selected={selectedEmailId === email.id}
                        class:unread={!email.read}
                        role="option"
                        aria-selected={selectedEmailId === email.id}
                        onclick={() => (selectedEmailId = email.id)}
                      >
                        <div class="mail-email-item-header">
                          <span class="mail-email-sender">{email.sender}</span>
                          <span class="mail-email-date">{email.date}</span>
                        </div>
                        <div class="mail-email-subject">{email.subject}</div>
                        <div class="mail-email-preview">{email.preview}</div>
                        {#if email.tags.length > 0}
                          <div class="mail-email-tags">
                            {#each email.tags as tag}
                              <sg-badge color={tagColorMap[tag] ?? "primary"} size="sm">
                                {tag}
                              </sg-badge>
                            {/each}
                          </div>
                        {/if}
                      </button>
                    {/each}
                    {#if filteredEmails.length === 0}
                      <div class="mail-empty-state">
                        <sg-text size="sm" color="secondary">
                          No emails match your search.
                        </sg-text>
                      </div>
                    {/if}
                  </div>
                </sg-scroll-area-viewport>
                <sg-scroll-area-scrollbar orientation="vertical" />
              </sg-scroll-area-root>
            
          </sg-tabs-content>

          <sg-tabs-content value="unread">
            
              <sg-scroll-area-root type="hover">
                <sg-scroll-area-viewport>
                  <div class="mail-email-list" role="listbox" aria-label="Unread email messages">
                    {#each filteredEmails as email (email.id)}
                      <button
                        class="mail-email-item"
                        class:selected={selectedEmailId === email.id}
                        class:unread={!email.read}
                        role="option"
                        aria-selected={selectedEmailId === email.id}
                        onclick={() => (selectedEmailId = email.id)}
                      >
                        <div class="mail-email-item-header">
                          <span class="mail-email-sender">{email.sender}</span>
                          <span class="mail-email-date">{email.date}</span>
                        </div>
                        <div class="mail-email-subject">{email.subject}</div>
                        <div class="mail-email-preview">{email.preview}</div>
                        {#if email.tags.length > 0}
                          <div class="mail-email-tags">
                            {#each email.tags as tag}
                              <sg-badge color={tagColorMap[tag] ?? "primary"} size="sm">
                                {tag}
                              </sg-badge>
                            {/each}
                          </div>
                        {/if}
                      </button>
                    {/each}
                    {#if filteredEmails.length === 0}
                      <div class="mail-empty-state">
                        <sg-text size="sm" color="secondary">
                          No unread emails.
                        </sg-text>
                      </div>
                    {/if}
                  </div>
                </sg-scroll-area-viewport>
                <sg-scroll-area-scrollbar orientation="vertical" />
              </sg-scroll-area-root>
            
          </sg-tabs-content>
        </sg-tabs-root>
      </section>

      <!-- Right Panel: Email Detail -->
      <section class="mail-detail-panel" aria-label="Email detail">
        {#if selectedEmail}
          <sg-scroll-area-root type="hover">
            <sg-scroll-area-viewport>
              <div class="mail-detail-inner">
                <!-- Email Header -->
                <div class="mail-detail-header">
                  <div class="mail-detail-sender-row">
                    <sg-avatar size="md" alt={selectedEmail.sender} fallback={getInitials(selectedEmail.sender)} />
                    <div class="mail-detail-sender-info">
                      <div class="mail-detail-sender-name">
                        <sg-text size="base" weight="semibold">
                          {selectedEmail.sender}
                        </sg-text>
                        <span class="mail-detail-date">{selectedEmail.date}</span>
                      </div>
                      <sg-text size="sm" color="secondary">
                        {selectedEmail.email}
                      </sg-text>
                    </div>
                  </div>

                  <sg-heading level={3} size="xl">
                    {selectedEmail.subject}
                  </sg-heading>

                  {#if selectedEmail.replyTo}
                    <div class="mail-detail-reply-to">
                      <sg-text size="sm" color="secondary">
                        Reply-To: {selectedEmail.replyTo}
                      </sg-text>
                    </div>
                  {/if}
                </div>

                <hr class="sg-separator" data-orientation="horizontal" aria-hidden="true" />

                <!-- Email Body -->
                <div class="mail-detail-body">
                  {#each selectedEmail.body as paragraph}
                    <sg-text size="base" color="primary">
                      {paragraph}
                    </sg-text>
                  {/each}
                </div>

                <hr class="sg-separator" data-orientation="horizontal" aria-hidden="true" />

                <!-- Action Buttons -->
                <div class="mail-detail-actions">
                  <button class="sg-button" data-color="primary" data-size="md">
                    Reply
                  </button>
                  <button class="sg-button" data-color="secondary" data-size="md">
                    Reply All
                  </button>
                  <button class="sg-button" data-color="secondary" data-size="md">
                    Forward
                  </button>
                </div>
              </div>
            </sg-scroll-area-viewport>
            <sg-scroll-area-scrollbar orientation="vertical" />
          </sg-scroll-area-root>
        {/if}
      </section>
    </div>
  
</ExamplesLayout>

<style>
  .mail-shell {
    display: grid;
    grid-template-columns: 220px 320px 1fr;
    height: calc(100vh - 120px);
    min-height: 520px;
    border: var(--sg-border-thin) solid var(--sg-color-border);
    border-radius: var(--sg-radius-lg);
    overflow: hidden;
    background: var(--sg-color-surface, var(--sg-bg));
  }

  /* ---- Left Sidebar ---- */
  .mail-sidebar {
    display: flex;
    flex-direction: column;
    gap: var(--sg-gap-related);
    padding: var(--sg-space-4);
    border-right: var(--sg-border-thin) solid var(--sg-color-border);
    background: var(--sg-surface-container-low, var(--sg-color-surface));
    overflow: hidden;
  }

  .mail-account {
    display: flex;
    align-items: center;
    gap: var(--sg-space-3);
    padding: var(--sg-space-2) 0;
  }

  .mail-account-info {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .mail-account-name {
    font-size: var(--sg-text-sm);
    font-weight: var(--sg-weight-semibold);
    color: var(--sg-color-title);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mail-account-email {
    font-size: var(--sg-text-xs);
    color: var(--sg-color-text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mail-folders {
    display: flex;
    flex-direction: column;
    gap: var(--sg-gap-tight);
  }

  .mail-folder-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: var(--sg-space-2) var(--sg-space-3);
    border: none;
    border-radius: var(--sg-radius-md);
    background: transparent;
    cursor: pointer;
    font-size: var(--sg-text-sm);
    font-weight: var(--sg-weight-medium);
    color: var(--sg-color-text);
    text-align: left;
    transition: background var(--sg-duration-fast);
  }

  .mail-folder-btn:hover {
    background: var(--sg-surface-container-high, var(--sg-surface-container-high));
  }

  .mail-folder-btn.active {
    background: var(--sg-color-primary-subtle);
    color: var(--sg-color-primary);
    font-weight: var(--sg-weight-semibold);
  }

  .mail-folder-label {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .mail-section-title {
    font-size: var(--sg-text-xs);
    font-weight: var(--sg-weight-semibold);
    color: var(--sg-color-text-muted);
    text-transform: uppercase;
    letter-spacing: var(--sg-tracking-caps);
    padding: var(--sg-space-1) var(--sg-space-3);
  }

  .mail-labels-section {
    display: flex;
    flex-direction: column;
    gap: var(--sg-gap-tight);
  }

  .mail-label-btn {
    display: flex;
    align-items: center;
    gap: var(--sg-gap-related);
    width: 100%;
    padding: var(--sg-space-2) var(--sg-space-3);
    border: none;
    border-radius: var(--sg-radius-md);
    background: transparent;
    cursor: pointer;
    font-size: var(--sg-text-sm);
    color: var(--sg-color-text);
    text-align: left;
    transition: background var(--sg-duration-fast);
  }

  .mail-label-btn:hover {
    background: var(--sg-surface-container-high);
  }

  .mail-label-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  /* ---- Middle Panel ---- */
  .mail-list-panel {
    display: flex;
    flex-direction: column;
    border-right: var(--sg-border-thin) solid var(--sg-color-border);
    overflow: hidden;
    background: var(--sg-bg, var(--sg-color-surface));
  }

  .mail-list-search {
    padding: var(--sg-space-4) var(--sg-space-4) var(--sg-space-2);
  }

  /* Override Input label visibility – keep label for a11y, visually hidden */
  .mail-list-search :global(.sg-input-label) {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  .mail-list-panel :global(.sg-tabs-list) {
    padding: 0 var(--sg-space-4);
    border-bottom: var(--sg-border-thin) solid var(--sg-color-border);
  }

  .mail-list-panel :global(.sg-tabs-content) {
    flex: 1;
    min-height: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .mail-list-panel :global(.sg-scroll-area) {
    flex: 1;
    min-height: 0;
    height: 100%;
  }

  .mail-list-panel :global(.sg-scroll-area-viewport) {
    height: 100%;
    overflow-y: auto;
  }

  .mail-email-list {
    display: flex;
    flex-direction: column;
    padding: var(--sg-space-2);
  }

  .mail-email-item {
    display: flex;
    flex-direction: column;
    gap: var(--sg-gap-tight);
    width: 100%;
    padding: var(--sg-space-3) var(--sg-space-3);
    border: none;
    border-radius: var(--sg-radius-md);
    background: transparent;
    cursor: pointer;
    text-align: left;
    transition: background var(--sg-duration-fast);
    position: relative;
  }

  .mail-email-item:hover {
    background: var(--sg-surface-container, var(--sg-surface-container));
  }

  .mail-email-item.selected {
    background: var(--sg-color-primary-subtle);
    outline: 1.5px solid var(--sg-color-primary-subtle);
  }

  .mail-email-item.unread .mail-email-sender {
    font-weight: var(--sg-weight-bold);
  }

  .mail-email-item.unread .mail-email-subject {
    font-weight: var(--sg-weight-semibold);
  }

  .mail-email-item.unread::before {
    content: "";
    position: absolute;
    left: 4px;
    top: 50%;
    transform: translateY(-50%);
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--sg-color-border-focus);
  }

  .mail-email-item-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--sg-gap-related);
  }

  .mail-email-sender {
    font-size: var(--sg-text-sm);
    font-weight: var(--sg-weight-medium);
    color: var(--sg-color-title);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    min-width: 0;
  }

  .mail-email-date {
    font-size: var(--sg-text-xs);
    color: var(--sg-color-text-muted);
    white-space: nowrap;
    flex-shrink: 0;
  }

  .mail-email-subject {
    font-size: var(--sg-text-sm);
    font-weight: var(--sg-weight-medium);
    color: var(--sg-color-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mail-email-preview {
    font-size: var(--sg-text-xs);
    color: var(--sg-color-text-secondary);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.5;
  }

  .mail-email-tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--sg-gap-tight);
    margin-top: var(--sg-space-1);
  }

  .mail-empty-state {
    padding: var(--sg-space-8) var(--sg-space-4);
    text-align: center;
  }

  /* ---- Right Panel ---- */
  .mail-detail-panel {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: var(--sg-surface-container-lowest, var(--sg-color-surface));
  }

  .mail-detail-panel :global(.sg-scroll-area) {
    flex: 1;
    min-height: 0;
    height: 100%;
  }

  .mail-detail-panel :global(.sg-scroll-area-viewport) {
    height: 100%;
    overflow-y: auto;
  }

  .mail-detail-inner {
    display: flex;
    flex-direction: column;
    gap: var(--sg-space-6);
    padding: var(--sg-space-6) var(--sg-space-8);
    max-width: 720px;
  }

  .mail-detail-header {
    display: flex;
    flex-direction: column;
    gap: var(--sg-gap-grouped);
  }

  .mail-detail-sender-row {
    display: flex;
    align-items: flex-start;
    gap: var(--sg-space-3);
  }

  .mail-detail-sender-info {
    display: flex;
    flex-direction: column;
    gap: var(--sg-gap-tight);
    min-width: 0;
    flex: 1;
  }

  .mail-detail-sender-name {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--sg-gap-grouped);
  }

  .mail-detail-date {
    font-size: var(--sg-text-sm);
    color: var(--sg-color-text-muted);
    white-space: nowrap;
    flex-shrink: 0;
  }

  .mail-detail-reply-to {
    padding: var(--sg-space-2) var(--sg-space-3);
    background: var(--sg-surface-container);
    border-radius: var(--sg-radius-md);
    border-left: 3px solid var(--sg-color-emphasis);
  }

  .mail-detail-body {
    display: flex;
    flex-direction: column;
    gap: var(--sg-gap-grouped);
    line-height: 1.75;
  }

  .mail-detail-actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--sg-space-3);
    padding-bottom: var(--sg-space-4);
  }

  /* ---- Responsive ---- */
  @media (max-width: 768px) {
    .mail-shell {
      grid-template-columns: 1fr;
      height: auto;
    }

    .mail-sidebar {
      display: none;
    }

    .mail-detail-panel {
      display: none;
    }

    .mail-list-panel {
      border-right: none;
    }
  }
</style>
