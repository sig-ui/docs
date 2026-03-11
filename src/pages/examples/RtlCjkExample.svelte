<script lang="ts">
  import ExamplesLayout from "./ExamplesLayout.svelte";
  type ScriptTab = "arabic" | "japanese" | "chinese";

  let activeTab = $state<ScriptTab>("arabic");

  // Arabic RTL state
  let notifEmail = $state(true);
  let notifPush = $state(false);
  let notifSms = $state(true);

  // Japanese state
  // (static display only)

  // Chinese state
  // (static display only)

  const arabicMembers = [
    { name: "فاطمة أحمد", role: "مطورة رئيسية", initials: "فأ", color: "info" as const },
    { name: "محمد خالد", role: "مصمم واجهات", initials: "مخ", color: "success" as const },
    { name: "نور حسين", role: "مديرة منتج", initials: "نح", color: "warning" as const },
    { name: "سارة علي", role: "مهندسة بيانات", initials: "سع", color: "danger" as const },
  ];

  const japaneseTasks = [
    { label: "ユーザーインターフェースの設計", status: "進行中", color: "info" as const },
    { label: "バックエンドAPIの実装", status: "完了", color: "success" as const },
    { label: "パフォーマンステストの実施", status: "未着手", color: "secondary" as const },
    { label: "ドキュメントの更新", status: "レビュー中", color: "warning" as const },
  ];

  const chineseProjects = [
    { name: "移动端重新设计", progress: 78, status: "进行中", color: "info" as const },
    { name: "数据分析平台", progress: 100, status: "已完成", color: "success" as const },
    { name: "客户服务系统", progress: 32, status: "计划中", color: "warning" as const },
  ];
</script>

<ExamplesLayout>
  
    <div class="rtl-cjk-page">

      <!-- Intro banner -->
      <div class="intro-banner">
        <div class="intro-icon" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <div class="intro-text">
          <strong>CSS logical properties for automatic RTL support.</strong>
          SigUI uses CSS logical properties (<code>margin-inline-start</code>, <code>padding-block-end</code>, <code>border-inline-end</code>, etc.) throughout all components.
          Setting <code>dir="rtl"</code> on any ancestor element automatically mirrors layout, spacing, and borders without any additional code.
          CJK scripts benefit from correct <code>line-height</code>, <code>word-break</code>, and <code>font-feature-settings</code> handling.
        </div>
      </div>

      <!-- Script selector tabs -->
      <sg-tabs-root value={activeTab} oninput={(e) => { const el = e.currentTarget as any; activeTab = (el.value ?? activeTab); }} onchange={(e) => { const el = e.currentTarget as any; activeTab = (el.value ?? activeTab); }} onclick={(e) => { const el = e.currentTarget as any; activeTab = (el.value ?? activeTab); }} ontoggle={(e) => { const el = e.currentTarget as any; activeTab = (el.value ?? activeTab); }}>
        
          <sg-tabs-list aria-label="Script / language examples">
            
              <sg-tabs-trigger value="arabic">
                
                  <span class="tab-label">
                    <span class="tab-script" lang="ar">عر</span>
                    Arabic RTL
                  </span>
                
              </sg-tabs-trigger>
              <sg-tabs-trigger value="japanese">
                
                  <span class="tab-label">
                    <span class="tab-script" lang="ja">日</span>
                    Japanese
                  </span>
                
              </sg-tabs-trigger>
              <sg-tabs-trigger value="chinese">
                
                  <span class="tab-label">
                    <span class="tab-script" lang="zh-Hans">中</span>
                    Chinese
                  </span>
                
              </sg-tabs-trigger>
            
          </sg-tabs-list>

          <!-- ======================================================
               ARABIC RTL
          ====================================================== -->
          <sg-tabs-content value="arabic">
            
              <div class="tab-section">
                <div class="rtl-note">
                  <span class="rtl-badge">dir="rtl"</span>
                  The wrapper below has <code>dir="rtl" lang="ar"</code>. All child components flip automatically.
                </div>

                <div dir="rtl" lang="ar" class="script-grid">

                  <!-- Payment form -->
                  <sg-card elevation={2}>
                    
                      <sg-card-header>
                        
                          <sg-card-title>
                            طريقة الدفع
                          </sg-card-title>
                          <sg-card-description>
                            أدخل تفاصيل بطاقتك الائتمانية
                          </sg-card-description>
                        
                      </sg-card-header>
                      <sg-card-body>
                        
                          <div class="form-fields">
                            <input class="sg-input" placeholder="٤٢٤٢ ٤٢٤٢ ٤٢٤٢ ٤٢٤٢" />
                            <div class="form-row">
                              <input class="sg-input" placeholder="شش/سس" />
                              <input class="sg-input" placeholder="•••" />
                            </div>
                            <div class="form-footer">
                              <div class="secure-label">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                </svg>
                                <span>دفع آمن ومشفر</span>
                              </div>
                              <button class="sg-button" data-color="primary">
                                إتمام الدفع
                              </button>
                            </div>
                          </div>
                        
                      </sg-card-body>
                    
                  </sg-card>

                  <!-- Team members -->
                  <sg-card elevation={2}>
                    
                      <sg-card-header>
                        
                          <sg-card-title>
                            أعضاء الفريق
                          </sg-card-title>
                          <sg-card-description>
                            ٤ أعضاء نشطين في هذا المشروع
                          </sg-card-description>
                        
                      </sg-card-header>
                      <sg-card-body>
                        
                          <div class="member-list">
                            {#each arabicMembers as member, i}
                              {#if i > 0}
                                <hr class="sg-separator" data-orientation="horizontal" />
                              {/if}
                              <div class="member-row">
                                <sg-avatar alt={member.name} fallback={member.initials} size="md" />
                                <div class="member-info">
                                  <span class="member-name">{member.name}</span>
                                  <span class="member-role">{member.role}</span>
                                </div>
                                <sg-badge color={member.color}>
                                  نشط
                                </sg-badge>
                              </div>
                            {/each}
                          </div>
                        
                      </sg-card-body>
                    
                  </sg-card>

                  <!-- Notification settings -->
                  <sg-card elevation={2}>
                    
                      <sg-card-header>
                        
                          <sg-card-title>
                            إعدادات الإشعارات
                          </sg-card-title>
                          <sg-card-description>
                            تحكم في كيفية تلقي الإشعارات
                          </sg-card-description>
                        
                      </sg-card-header>
                      <sg-card-body>
                        
                          <div class="switch-list">
                            <div class="switch-row">
                              <div class="switch-desc">
                                <span class="switch-title">إشعارات البريد الإلكتروني</span>
                                <span class="switch-sub">استلم تحديثات على بريدك</span>
                              </div>
                              <input type="checkbox" class="sg-switch" role="switch" checked={notifEmail} oninput={(e) => { const el = e.currentTarget as any; notifEmail = (el.checked ?? notifEmail); }} onchange={(e) => { const el = e.currentTarget as any; notifEmail = (el.checked ?? notifEmail); }} onclick={(e) => { const el = e.currentTarget as any; notifEmail = (el.checked ?? notifEmail); }} ontoggle={(e) => { const el = e.currentTarget as any; notifEmail = (el.checked ?? notifEmail); }} />
                            </div>
                            <hr class="sg-separator" data-orientation="horizontal" />
                            <div class="switch-row">
                              <div class="switch-desc">
                                <span class="switch-title">الإشعارات الفورية</span>
                                <span class="switch-sub">إشعارات على المتصفح</span>
                              </div>
                              <input type="checkbox" class="sg-switch" role="switch" checked={notifPush} oninput={(e) => { const el = e.currentTarget as any; notifPush = (el.checked ?? notifPush); }} onchange={(e) => { const el = e.currentTarget as any; notifPush = (el.checked ?? notifPush); }} onclick={(e) => { const el = e.currentTarget as any; notifPush = (el.checked ?? notifPush); }} ontoggle={(e) => { const el = e.currentTarget as any; notifPush = (el.checked ?? notifPush); }} />
                            </div>
                            <hr class="sg-separator" data-orientation="horizontal" />
                            <div class="switch-row">
                              <div class="switch-desc">
                                <span class="switch-title">إشعارات الرسائل القصيرة</span>
                                <span class="switch-sub">استلم رسائل نصية مهمة</span>
                              </div>
                              <input type="checkbox" class="sg-switch" role="switch" checked={notifSms} oninput={(e) => { const el = e.currentTarget as any; notifSms = (el.checked ?? notifSms); }} onchange={(e) => { const el = e.currentTarget as any; notifSms = (el.checked ?? notifSms); }} onclick={(e) => { const el = e.currentTarget as any; notifSms = (el.checked ?? notifSms); }} ontoggle={(e) => { const el = e.currentTarget as any; notifSms = (el.checked ?? notifSms); }} />
                            </div>
                          </div>
                        
                      </sg-card-body>
                    
                  </sg-card>

                </div>
              </div>
            
          </sg-tabs-content>

          <!-- ======================================================
               JAPANESE
          ====================================================== -->
          <sg-tabs-content value="japanese">
            
              <div class="tab-section" lang="ja">
                <div class="script-grid">

                  <!-- Dashboard stats -->
                  <sg-card elevation={2}>
                    
                      <sg-card-header>
                        
                          <sg-card-title>
                            ダッシュボード
                          </sg-card-title>
                          <sg-card-description>
                            今月のパフォーマンス概要
                          </sg-card-description>
                        
                      </sg-card-header>
                      <sg-card-body>
                        
                          <div class="stats-grid">
                            <div class="stat-card">
                              <span class="stat-label">総収入</span>
                              <span class="stat-value">¥2,847,000</span>
                              <sg-badge color="success">
                                +12.4%
                              </sg-badge>
                            </div>
                            <div class="stat-card">
                              <span class="stat-label">アクティブユーザー</span>
                              <span class="stat-value">18,492</span>
                              <sg-badge color="info">
                                +8.1%
                              </sg-badge>
                            </div>
                            <div class="stat-card">
                              <span class="stat-label">コンバージョン率</span>
                              <span class="stat-value">3.67%</span>
                              <sg-badge color="warning">
                                -0.3%
                              </sg-badge>
                            </div>
                          </div>
                          <hr class="sg-separator" data-orientation="horizontal" />
                          <div class="chart-preview">
                            <span class="chart-label">月次収益推移</span>
                            <div class="bar-chart" aria-label="月次収益推移グラフ">
                              {#each [55, 72, 61, 88, 74, 95, 83, 100, 91, 78, 85, 92] as h, i}
                                <div class="bar" style:height="{h}%" title="{['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'][i]}"></div>
                              {/each}
                            </div>
                          </div>
                        
                      </sg-card-body>
                    
                  </sg-card>

                  <!-- Task list -->
                  <sg-card elevation={2}>
                    
                      <sg-card-header>
                        
                          <sg-card-title>
                            タスク一覧
                          </sg-card-title>
                          <sg-card-description>
                            現在のスプリントのタスク
                          </sg-card-description>
                        
                      </sg-card-header>
                      <sg-card-body>
                        
                          <div class="task-list">
                            {#each japaneseTasks as task, i}
                              {#if i > 0}
                                <hr class="sg-separator" data-orientation="horizontal" />
                              {/if}
                              <div class="task-row">
                                <div class="task-check" aria-hidden="true">
                                  {#if task.color === "success"}
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                      <path d="M20 6 9 17l-5-5"/>
                                    </svg>
                                  {:else}
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                      <circle cx="12" cy="12" r="9"/>
                                    </svg>
                                  {/if}
                                </div>
                                <span class="task-label" class:task-done={task.color === "success"}>{task.label}</span>
                                <sg-badge color={task.color}>
                                  {task.status}
                                </sg-badge>
                              </div>
                            {/each}
                          </div>
                          <div class="task-footer">
                            <button class="sg-button" data-color="ghost" data-size="sm">
                              + タスクを追加
                            </button>
                            <button class="sg-button" data-color="primary" data-size="sm">
                              レポートを見る
                            </button>
                          </div>
                        
                      </sg-card-body>
                    
                  </sg-card>

                </div>
              </div>
            
          </sg-tabs-content>

          <!-- ======================================================
               CHINESE
          ====================================================== -->
          <sg-tabs-content value="chinese">
            
              <div class="tab-section" lang="zh-Hans">
                <div class="script-grid">

                  <!-- User profile -->
                  <sg-card elevation={2}>
                    
                      <sg-card-header>
                        
                          <sg-card-title>
                            用户资料
                          </sg-card-title>
                          <sg-card-description>
                            管理您的个人信息和账户设置
                          </sg-card-description>
                        
                      </sg-card-header>
                      <sg-card-body>
                        
                          <div class="profile-hero">
                            <sg-avatar alt="王芳" size="lg" />
                            <div class="profile-meta">
                              <span class="profile-name">王芳</span>
                              <sg-badge color="success">
                                已验证
                              </sg-badge>
                            </div>
                          </div>
                          <hr class="sg-separator" data-orientation="horizontal" />
                          <div class="form-fields">
                            <input class="sg-input" placeholder="请输入您的姓名" />
                            <input class="sg-input" placeholder="example@company.com" type="email" />
                            <input class="sg-input" placeholder="例如：高级工程师" />
                            <div class="profile-actions">
                              <button class="sg-button" data-color="ghost">
                                取消
                              </button>
                              <button class="sg-button" data-color="primary">
                                保存更改
                              </button>
                            </div>
                          </div>
                        
                      </sg-card-body>
                    
                  </sg-card>

                  <!-- Project overview -->
                  <sg-card elevation={2}>
                    
                      <sg-card-header>
                        
                          <sg-card-title>
                            项目概览
                          </sg-card-title>
                          <sg-card-description>
                            当前季度所有项目的进度情况
                          </sg-card-description>
                        
                      </sg-card-header>
                      <sg-card-body>
                        
                          <div class="project-list">
                            {#each chineseProjects as project, i}
                              {#if i > 0}
                                <hr class="sg-separator" data-orientation="horizontal" />
                              {/if}
                              <div class="project-item">
                                <div class="project-header-row">
                                  <span class="project-name">{project.name}</span>
                                  <sg-badge color={project.color}>
                                    {project.status}
                                  </sg-badge>
                                </div>
                                <div class="progress-row">
                                  <progress class="sg-progress"
                                    value={project.progress}
                                    max={100}
                                    data-color={project.color}
                                    data-size="sm"
                                  ></progress>
                                  <span class="progress-pct">{project.progress}%</span>
                                </div>
                              </div>
                            {/each}
                          </div>
                          <div class="project-footer">
                            <button class="sg-button" data-color="ghost" data-size="sm">
                              查看全部项目
                            </button>
                            <button class="sg-button" data-color="primary" data-size="sm">
                              新建项目
                            </button>
                          </div>
                        
                      </sg-card-body>
                    
                  </sg-card>

                </div>
              </div>
            
          </sg-tabs-content>

        
      </sg-tabs-root>
    </div>
  
</ExamplesLayout>

<style>
  /* ─── Page shell ─────────────────────────────────────────── */
  .rtl-cjk-page {
    display: flex;
    flex-direction: column;
    gap: var(--sg-space-6);
    max-width: 960px;
    margin-inline: auto;
    padding-inline: var(--sg-space-6);
  }

  /* ─── Intro banner ───────────────────────────────────────── */
  .intro-banner {
    display: flex;
    align-items: flex-start;
    gap: var(--sg-space-3);
    padding: var(--sg-space-4) var(--sg-space-5);
    background: color-mix(in oklch, var(--sg-color-link) 8%, transparent);
    border: 1px solid color-mix(in oklch, var(--sg-color-link) 20%, transparent);
    border-radius: var(--sg-radius-md);
    font-size: var(--sg-text-sm);
    line-height: 1.65;
    color: var(--sg-color-text-secondary);
  }

  .intro-icon {
    flex-shrink: 0;
    margin-block-start: var(--sg-space-0-5);
    color: var(--sg-color-link);
  }

  .intro-text strong {
    display: block;
    margin-block-end: var(--sg-space-1);
    color: var(--sg-color-text);
    font-weight: var(--sg-weight-semibold);
  }

  .intro-text code {
    font-family: var(--sg-font-mono, monospace);
    font-size: 0.85em;
    padding: 0.1em 0.35em;
    background: color-mix(in oklch, var(--sg-color-text) 8%, transparent);
    border-radius: var(--sg-radius-sm);
  }

  /* ─── RTL note ───────────────────────────────────────────── */
  .rtl-note {
    display: flex;
    align-items: center;
    gap: var(--sg-gap-related);
    font-size: var(--sg-text-sm);
    color: var(--text-3);
    margin-block-end: var(--sg-space-4);
  }

  .rtl-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.15em 0.55em;
    font-family: var(--sg-font-mono, monospace);
    font-size: 0.8em;
    font-weight: var(--sg-weight-semibold);
    background: color-mix(in oklch, var(--sg-color-link) 15%, transparent);
    color: var(--sg-color-border-focus, var(--sg-color-link));
    border-radius: var(--sg-radius-sm);
    border: 1px solid color-mix(in oklch, var(--sg-color-link) 25%, transparent);
    white-space: nowrap;
  }

  /* ─── Tab label ─────────────────────────────────────────── */
  .tab-label {
    display: flex;
    align-items: center;
    gap: var(--sg-gap-related);
  }

  .tab-script {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.6em;
    height: 1.6em;
    font-size: 0.95em;
    background: color-mix(in oklch, var(--sg-color-text) 8%, transparent);
    border-radius: var(--sg-radius-sm);
    font-weight: var(--sg-weight-semibold);
  }

  /* ─── Tab section wrapper ───────────────────────────────── */
  .tab-section {
    padding-block-start: var(--sg-space-6);
  }

  /* ─── Card grid ─────────────────────────────────────────── */
  .script-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: var(--sg-space-5);
    align-items: start;
  }

  /* ─── Form fields ───────────────────────────────────────── */
  .form-fields {
    display: flex;
    flex-direction: column;
    gap: var(--sg-gap-grouped);
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--sg-space-3);
  }

  .form-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--sg-space-3);
    flex-wrap: wrap;
    padding-block-start: var(--sg-space-1);
  }

  .secure-label {
    display: flex;
    align-items: center;
    gap: var(--sg-gap-tight);
    font-size: var(--sg-text-xs);
    color: var(--text-3);
  }

  .profile-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--sg-gap-related);
    padding-block-start: var(--sg-space-2);
  }

  /* ─── Member list ───────────────────────────────────────── */
  .member-list {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .member-row {
    display: flex;
    align-items: center;
    gap: var(--sg-space-3);
    padding-block: var(--sg-space-3);
  }

  .member-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--sg-gap-micro);
    min-inline-size: 0;
  }

  .member-name {
    font-size: var(--sg-text-sm);
    font-weight: var(--sg-weight-medium);
    color: var(--sg-color-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .member-role {
    font-size: var(--sg-text-xs);
    color: var(--text-3);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* ─── Switch list ───────────────────────────────────────── */
  .switch-list {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .switch-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--sg-gap-grouped);
    padding-block: var(--sg-space-3);
  }

  .switch-desc {
    display: flex;
    flex-direction: column;
    gap: var(--sg-gap-micro);
    flex: 1;
    min-inline-size: 0;
  }

  .switch-title {
    font-size: var(--sg-text-sm);
    font-weight: var(--sg-weight-medium);
    color: var(--sg-color-text);
  }

  .switch-sub {
    font-size: var(--sg-text-xs);
    color: var(--text-3);
  }

  /* ─── Stats grid ────────────────────────────────────────── */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--sg-space-3);
    margin-block-end: var(--sg-space-4);
  }

  .stat-card {
    display: flex;
    flex-direction: column;
    gap: var(--sg-gap-tight);
    padding: var(--sg-pad-input, 0.75rem);
    background: color-mix(in oklch, var(--sg-color-text) 4%, transparent);
    border-radius: var(--sg-radius-md);
  }

  .stat-label {
    font-size: var(--sg-text-xs);
    color: var(--text-3);
    font-weight: var(--sg-weight-medium);
    line-height: 1.4;
  }

  .stat-value {
    font-size: var(--sg-text-lg);
    font-weight: var(--sg-weight-bold);
    color: var(--sg-color-text);
    line-height: 1.2;
  }

  /* ─── Bar chart preview ─────────────────────────────────── */
  .chart-preview {
    padding-block-start: var(--sg-space-2);
  }

  .chart-label {
    display: block;
    font-size: var(--sg-text-xs);
    color: var(--text-3);
    margin-block-end: var(--sg-space-2);
  }

  .bar-chart {
    display: flex;
    align-items: flex-end;
    gap: var(--sg-gap-tight);
    block-size: 64px;
  }

  .bar {
    flex: 1;
    background: color-mix(in oklch, var(--sg-color-link) 60%, transparent);
    border-radius: var(--sg-radius-sm) var(--sg-radius-sm) 0 0;
    min-block-size: 4px;
    transition: background var(--sg-duration-fast);
  }

  .bar:hover {
    background: var(--sg-color-link);
  }

  /* ─── Task list ─────────────────────────────────────────── */
  .task-list {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .task-row {
    display: flex;
    align-items: center;
    gap: var(--sg-space-3);
    padding-block: var(--sg-space-3);
  }

  .task-check {
    flex-shrink: 0;
    color: var(--text-3);
    display: flex;
    align-items: center;
  }

  .task-label {
    flex: 1;
    font-size: var(--sg-text-sm);
    color: var(--sg-color-text);
    line-height: 1.5;
  }

  .task-done {
    text-decoration: line-through;
    color: var(--text-3);
  }

  .task-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-block-start: var(--sg-space-3);
    gap: var(--sg-gap-related);
  }

  /* ─── Profile card ──────────────────────────────────────── */
  .profile-hero {
    display: flex;
    align-items: center;
    gap: var(--sg-gap-grouped);
    margin-block-end: var(--sg-space-4);
  }

  .profile-meta {
    display: flex;
    flex-direction: column;
    gap: var(--sg-gap-tight);
  }

  .profile-name {
    font-size: var(--sg-text-xl);
    font-weight: var(--sg-weight-bold);
    color: var(--sg-color-text);
  }

  /* ─── Project list ──────────────────────────────────────── */
  .project-list {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .project-item {
    display: flex;
    flex-direction: column;
    gap: var(--sg-gap-related);
    padding-block: var(--sg-space-3);
  }

  .project-header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--sg-gap-related);
  }

  .project-name {
    font-size: var(--sg-text-sm);
    font-weight: var(--sg-weight-medium);
    color: var(--sg-color-text);
  }

  .progress-row {
    display: flex;
    align-items: center;
    gap: var(--sg-space-3);
  }

  .progress-row :global(.sg-progress) {
    flex: 1;
  }

  .progress-pct {
    font-size: var(--sg-text-xs);
    color: var(--text-3);
    font-variant-numeric: tabular-nums;
    min-inline-size: 2.8em;
    text-align: end;
  }

  .project-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-block-start: var(--sg-space-3);
    gap: var(--sg-gap-related);
  }
</style>
