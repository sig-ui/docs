<script lang="ts">
  import { onMount } from "svelte";
  import { fromOklch } from "../../../packages/core/src/index.js";
  interface Props {
    onColorSelect: (hex: string) => void;
  }

  let { onColorSelect }: Props = $props();

  // Generate a rich hue wheel
  const hueWheel = Array.from({ length: 24 }, (_, i) => {
    const h = i * 15;
    return fromOklch({ l: 0.75, c: 0.16, h, alpha: 1 }, "hex")!;
  });

  let mounted = $state(false);

  onMount(() => {
    requestAnimationFrame(() => { mounted = true; });
  });
</script>

<header class="landing-hero" class:mounted>
  <div class="landing-hero-glow"></div>
  <div class="landing-hero-glow-2"></div>
  <div class="landing-hero-grid-bg"></div>

  <sg-container size="md">
    <div class="landing-hero-content">
      <div class="landing-hero-badge">
        <sg-badge color="primary"><span class="landing-hero-badge-dot"></span>Design System</sg-badge>
      </div>

      <h1 class="landing-hero-title">
        <span class="landing-hero-title-line">All you need is</span>
        <span class="landing-hero-title-accent">one color</span>
      </h1>

      <sg-text size="lg" color="secondary" class="landing-hero-subtitle">
        A mathematical design system implementing latest research in
        perceptual science. Every design detail is computed from
        our perception model.
      </sg-text>

      <div class="landing-hero-actions">
        <a href="/components" data-nav data-size="lg" data-color="primary" class="sg-button landing-btn-primary">
          Browse Docs &rarr;
        </a>
        <a href="/examples" data-nav data-size="lg" data-color="ghost" class="sg-button landing-btn-secondary">
          See Examples
        </a>
      </div>

    </div>
  </sg-container>

  <div class="landing-color-strip">
    <div class="landing-hero-hue-ring">
      <sg-text size="sm" color="muted" weight="semibold" class="landing-hue-label">
        Pick a color to begin
      </sg-text>
      <div class="landing-hue-wheel">
        {#each hueWheel as color, i}
          <button
            class="landing-hue-dot"
            style="background: {color}; --delay: {i * 20}ms"
            onclick={() => onColorSelect(color)}
            title={color}
            aria-label="Select color {color}"
          ></button>
        {/each}
      </div>
    </div>
  </div>
</header>

<style>
/* ===== HERO ===== */

.landing-hero {
  position: relative;
  padding: var(--sg-space-24) 0 0;
  overflow: hidden;
  text-align: center;
}

.landing-hero-glow {
  position: absolute;
  top: calc(-1 * var(--sg-space-96));
  left: 50%;
  transform: translateX(-50%);
  width: 62.5rem;
  height: 50rem;
  background: radial-gradient(
    ellipse at center,
    oklch(from var(--sg-color-border-focus) l c h / 0.14) 0%,
    oklch(from var(--sg-color-link) l c h / 0.06) 30%,
    transparent 70%
  );
  pointer-events: none;
  animation: landing-glow-pulse calc(var(--sg-duration-slower) * 16) var(--sg-ease-in-out) infinite;
}

.landing-hero-glow-2 {
  position: absolute;
  bottom: calc(-1 * var(--sg-space-48));
  right: calc(-1 * var(--sg-space-24));
  width: 37.5rem;
  height: 37.5rem;
  background: radial-gradient(
    ellipse at center,
    oklch(from var(--sg-color-emphasis) l c h / 0.08) 0%,
    transparent 60%
  );
  pointer-events: none;
  animation: landing-glow-pulse calc(var(--sg-duration-slower) * 24) var(--sg-ease-in-out) infinite reverse;
}

.landing-hero-grid-bg {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(oklch(from var(--sg-color-text) l c h / 0.03) var(--sg-border-thin), transparent var(--sg-border-thin)),
    linear-gradient(90deg, oklch(from var(--sg-color-text) l c h / 0.03) var(--sg-border-thin), transparent var(--sg-border-thin));
  background-size: var(--sg-space-14) var(--sg-space-14);
  mask-image: radial-gradient(ellipse 80% 60% at 50% 40%, black 20%, transparent 70%);
  -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 40%, black 20%, transparent 70%);
  pointer-events: none;
}

@keyframes landing-glow-pulse {
  0%, 100% { opacity: 1; transform: translateX(-50%) scale(1); }
  50% { opacity: 0.7; transform: translateX(-50%) scale(1.05); }
}

.landing-hero-content {
  position: relative;
  z-index: var(--sg-z-raised);
}

.landing-hero-badge {
  margin-bottom: var(--sg-space-8);
  opacity: 0;
  transform: translateY(var(--sg-space-2-5));
  animation: landing-fade-up var(--sg-duration-slow) var(--sg-ease-out) var(--sg-duration-fast) forwards;
}

.landing-hero-badge :global(.sg-badge) {
  padding: var(--sg-space-1-5) var(--sg-space-4);
  letter-spacing: var(--sg-tracking-xs);
}

.landing-hero-badge-dot {
  width: var(--sg-space-1-5);
  height: var(--sg-space-1-5);
  border-radius: var(--sg-radius-full);
  background: var(--sg-color-primary);
  animation: landing-dot-pulse calc(var(--sg-duration-slower) * 4) var(--sg-ease-in-out) infinite;
}

@keyframes landing-dot-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.landing-hero-title {
  font-family: var(--sg-font-display);
  font-size: clamp(var(--sg-text-7xl), 8vw, var(--sg-text-9xl));
  font-weight: var(--sg-weight-normal);
  font-style: italic;
  line-height: 1.05;
  letter-spacing: var(--sg-tracking-xl);
  margin-bottom: var(--sg-space-6);
  opacity: 0;
  transform: translateY(var(--sg-space-5));
  animation: landing-fade-up var(--sg-duration-slow) var(--sg-ease-out) var(--sg-duration-normal) forwards;
}

.landing-hero-title-line {
  display: block;
  color: var(--sg-color-text);
  -webkit-text-fill-color: var(--sg-color-text);
}

.landing-hero-title-accent {
  display: block;
  background: linear-gradient(
    135deg,
    var(--sg-color-link) 0%,
    var(--sg-color-emphasis) 35%,
    oklch(from var(--sg-color-emphasis) l c calc(h + 90)) 65%,
    oklch(from var(--sg-color-emphasis) l c calc(h + 150)) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.landing-hero-subtitle {
  font-size: clamp(var(--sg-text-base), 2.2vw, var(--sg-text-lg));
  color: var(--sg-color-text-secondary);
  max-width: var(--sg-container-lg);
  margin: 0 auto var(--sg-space-12);
  line-height: var(--sg-leading-lg);
  opacity: 0;
  transform: translateY(var(--sg-space-5));
  animation: landing-fade-up var(--sg-duration-slow) var(--sg-ease-out) var(--sg-duration-moderate) forwards;
}

.landing-hero-actions {
  display: flex;
  justify-content: center;
  gap: var(--sg-space-5);
  margin-bottom: var(--sg-space-8);
  flex-wrap: wrap;
  opacity: 0;
  transform: translateY(var(--sg-space-5));
  animation: landing-fade-up var(--sg-duration-slow) var(--sg-ease-out) var(--sg-duration-slow) forwards;
}

.landing-hero-hue-ring {
  padding: var(--sg-space-4) var(--sg-space-4) var(--sg-space-5);
  opacity: 0;
  transform: translateY(var(--sg-space-5));
  animation: landing-fade-up var(--sg-duration-slow) var(--sg-ease-out) calc(var(--sg-duration-slow) + var(--sg-duration-normal)) forwards;
}

.landing-color-strip {
  position: relative;
  z-index: var(--sg-z-raised);
  width: 100%;
  border-top: var(--sg-border-thin) solid var(--sg-color-border);
  margin-top: var(--sg-space-6);
}

:global(.landing-hue-label) {
  text-transform: uppercase;
  letter-spacing: var(--sg-tracking-sm);
  margin-bottom: var(--sg-space-3);
}

.landing-hue-wheel {
  display: flex;
  justify-content: center;
  gap: var(--sg-gap-related);
  flex-wrap: wrap;
  width: 100%;
  margin: 0;
}

.landing-hue-dot {
  width: var(--sg-space-5);
  height: var(--sg-space-5);
  border-radius: var(--sg-radius-full);
  border: none;
  cursor: pointer;
  padding: 0;
  transition: transform var(--sg-duration-normal) var(--sg-ease-default),
              box-shadow var(--sg-duration-normal) var(--sg-ease-default);
  opacity: 0;
  animation: landing-dot-appear var(--sg-duration-slow) var(--sg-ease-out) forwards;
  animation-delay: var(--delay);
}

.landing-hue-dot:hover {
  transform: scale(1.7);
  box-shadow: 0 0 var(--sg-space-4) currentColor;
  z-index: var(--sg-z-raised);
}

@keyframes landing-dot-appear {
  from { opacity: 0; transform: scale(0.5); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes landing-fade-up {
  from { opacity: 0; transform: translateY(var(--sg-space-5)); }
  to { opacity: 1; transform: translateY(0); }
}

/* ===== LANDING RESPONSIVE ===== */

@media (max-width: 768px) {
  .landing-hero {
    padding: var(--sg-space-16) 0 0;
  }

  .landing-hero-actions {
    flex-direction: column;
    align-items: center;
  }

  .landing-color-strip {
    margin-top: var(--sg-space-4);
  }
}

/* ===== REDUCE MOTION ===== */

@media (prefers-reduced-motion: reduce) {
  .landing-hero-badge,
  .landing-hero-title,
  .landing-hero-subtitle,
  .landing-hero-actions,
  .landing-hero-hue-ring,
  .landing-hue-dot {
    opacity: 1;
    transform: none;
    animation: none;
  }

  .landing-hero-glow,
  .landing-hero-glow-2 {
    animation: none;
  }

  .landing-hero-badge-dot {
    animation: none;
  }
}
</style>
