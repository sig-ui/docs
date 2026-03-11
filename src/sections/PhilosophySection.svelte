<script lang="ts">
</script>

<section class="landing-philosophy">
  <sg-container size="lg">
    <div class="landing-section-header">
      <sg-badge color="primary">Philosophy</sg-badge>
      <sg-heading level={2}>
        Design from <em>first principles</em>
      </sg-heading>
      <sg-text size="lg" color="secondary">
        SigUI doesn't guess. Every decision is grounded in perceptual science,
        mathematical relationships, and web platform fundamentals.
      </sg-text>
    </div>

    <div class="philosophy-grid">
      <div class="philosophy-card">
        <div class="philosophy-card-icon" style="--accent: var(--sg-color-link)">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
          </svg>
        </div>
        <sg-heading level={3}>Perceptual color science</sg-heading>
        <sg-text color="secondary" class="philosophy-card-desc">
          Colors live in OKLCH, where lightness means what your eyes see.
          Palette ramps are calibrated against APCA contrast targets, not
          arbitrary hex midpoints. Gamut mapping keeps P3 colors vivid
          without silent clipping.
        </sg-text>
        <code class="philosophy-card-code">oklch(0.72 0.19 264)</code>
      </div>

      <div class="philosophy-card">
        <div class="philosophy-card-icon" style="--accent: var(--sg-color-success)">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="9" y1="3" x2="9" y2="21" />
          </svg>
        </div>
        <sg-heading level={3}>Constraint-driven APIs</sg-heading>
        <sg-text color="secondary" class="philosophy-card-desc">
          Props use constrained unions, not open strings. A Button
          is either a <code>&lt;button&gt;</code> or an <code>&lt;a&gt;</code> &mdash;
          discriminated at the type level. You cannot forget
          <code>aria-label</code> on a modal.
        </sg-text>
        <code class="philosophy-card-code">Size = "sm" | "md" | "lg"</code>
      </div>

      <div class="philosophy-card">
        <div class="philosophy-card-icon" style="--accent: var(--sg-color-warning)">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
            <line x1="12" y1="22" x2="12" y2="15.5" />
            <polyline points="22 8.5 12 15.5 2 8.5" />
          </svg>
        </div>
        <sg-heading level={3}>Web platform first</sg-heading>
        <sg-text color="secondary" class="philosophy-card-desc">
          Dialogs use <code>&lt;dialog&gt;</code>. Popovers use the
          <code>popover</code> attribute. Focus trapping is native.
          No JavaScript reinventions of things the browser already does
          correctly. Progressive enhancement, not polyfill theater.
        </sg-text>
        <code class="philosophy-card-code">&lt;dialog popover&gt;</code>
      </div>

      <div class="philosophy-card">
        <div class="philosophy-card-icon" style="--accent: var(--sg-color-info)">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
          </svg>
        </div>
        <sg-heading level={3}>Mathematical foundations</sg-heading>
        <sg-text color="secondary" class="philosophy-card-desc">
          Spacing follows a modular scale. Motion uses spring physics.
          State machines are formal definitions, not ad-hoc booleans.
          Typography is fluid and clamped. Everything has a derivation
          you can trace.
        </sg-text>
        <code class="philosophy-card-code">createMachine(definition)</code>
      </div>
    </div>

    <div class="philosophy-principles">
      <div class="philosophy-principle">
        <span class="philosophy-principle-num">01</span>
        <div>
          <sg-heading level={4}>Tokens are derived, not chosen</sg-heading>
          <sg-text color="secondary">Every shade, every spacing step, every duration
          is computed from a small set of seed values through deterministic functions.</sg-text>
        </div>
      </div>
      <div class="philosophy-principle">
        <span class="philosophy-principle-num">02</span>
        <div>
          <sg-heading level={4}>Types prevent misuse</sg-heading>
          <sg-text color="secondary">Discriminated unions, constrained props, and required accessibility
          attributes mean the wrong thing won't compile.</sg-text>
        </div>
      </div>
      <div class="philosophy-principle">
        <span class="philosophy-principle-num">03</span>
        <div>
          <sg-heading level={4}>CSS does the styling</sg-heading>
          <sg-text color="secondary">Components use <code>data-*</code> attributes and <code>@layer</code>.
          No runtime style injection, no CSS-in-JS overhead, full cascade control.</sg-text>
        </div>
      </div>
    </div>
  </sg-container>
</section>

<style>
.landing-philosophy {
  padding: var(--sg-space-24) 0 var(--sg-space-20);
}

.philosophy-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--sg-gap-separated);
  margin-bottom: var(--sg-space-16);
}

.philosophy-card {
  background: var(--surface);
  border: 1px solid var(--sg-color-border);
  border-radius: var(--radius);
  padding: var(--sg-space-10);
  transition: border-color var(--sg-duration-normal), transform var(--sg-duration-normal), box-shadow var(--sg-duration-normal);
}

.philosophy-card:hover {
  border-color: oklch(from var(--sg-color-link) l c h / 0.25);
  transform: translateY(-2px);
  box-shadow: 0 8px 32px oklch(from var(--sg-color-link) l c h / 0.06);
}

.philosophy-card-icon {
  width: 52px;
  height: 52px;
  border-radius: var(--sg-radius-lg);
  background: oklch(from var(--accent, var(--sg-color-link)) l c h / 0.1);
  color: var(--accent, var(--sg-color-link));
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--sg-space-6);
}

.philosophy-card-title {
  font-size: var(--sg-text-lg);
  font-weight: var(--sg-weight-bold);
  letter-spacing: -0.02em;
  margin-bottom: var(--sg-space-3);
  color: var(--sg-color-text);
}

.philosophy-card-desc {
  font-size: var(--sg-text-base);
  color: var(--sg-color-text-secondary);
  line-height: 1.65;
  margin-bottom: var(--sg-space-5);
}

.philosophy-card-desc code {
  font-size: 0.8em;
  background: oklch(from var(--sg-color-link) l c h / 0.08);
  color: var(--sg-color-link);
  padding: var(--sg-space-px) var(--sg-space-1-5);
  border-radius: var(--sg-radius-xs);
}

.philosophy-card-code {
  display: inline-block;
  font-family: var(--sg-font-mono);
  font-size: var(--sg-text-xs);
  color: var(--text-3);
  background: var(--sg-surface-container-high);
  padding: var(--sg-space-1) var(--sg-space-2\.5);
  border-radius: var(--sg-radius-sm);
  border: 1px solid var(--sg-color-border);
}

.philosophy-principles {
  display: flex;
  flex-direction: column;
  gap: var(--sg-gap-related);
  max-width: 720px;
  margin: 0 auto;
}

.philosophy-principle {
  display: flex;
  gap: var(--sg-space-6);
  align-items: flex-start;
  padding: var(--sg-space-6) var(--sg-space-7);
  border-radius: var(--sg-radius-lg);
  transition: background var(--sg-duration-fast);
}

.philosophy-principle:hover {
  background: oklch(from var(--sg-color-text) l c h / 0.03);
}

.philosophy-principle-num {
  font-family: var(--sg-font-display);
  font-style: italic;
  font-size: var(--sg-text-xl);
  color: var(--sg-color-link);
  line-height: 1;
  flex-shrink: 0;
  margin-top: var(--sg-space-0-5);
}

.philosophy-principle h4 {
  font-size: var(--sg-text-lg);
  font-weight: var(--sg-weight-bold);
  letter-spacing: -0.01em;
  margin-bottom: var(--sg-space-1-5);
  color: var(--sg-color-text);
}

.philosophy-principle p {
  font-size: var(--sg-text-base);
  color: var(--sg-color-text-secondary);
  line-height: 1.6;
}

.philosophy-principle code {
  font-size: 0.8em;
  background: oklch(from var(--sg-color-link) l c h / 0.08);
  color: var(--sg-color-link);
  padding: var(--sg-space-px) var(--sg-space-1-5);
  border-radius: var(--sg-radius-xs);
}

@media (max-width: 768px) {
  .philosophy-grid {
    grid-template-columns: 1fr;
  }

  .philosophy-principle {
    padding: var(--sg-space-4);
  }
}
</style>
