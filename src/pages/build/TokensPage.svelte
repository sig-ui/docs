<script lang="ts">
  import TokensSection from "../../sections/TokensSection.svelte";
</script>

<div class="page">
  <div class="page-header">
    <sg-heading level={1}>Design Tokens & Theming</sg-heading>
    <sg-text size="lg" color="secondary">DTCG-compliant token pipeline - build CSS custom properties, JSON, or TypeScript from a theme definition with validation and diff detection.</sg-text>
  </div>

  <sg-code-block
    title="Configuration"
    language="typescript"
    code={`// sigui.config.ts – define your theme
import type { SiguiConfig } from "@sig-ui/theme";

export default {
  brand: { primary: "#6366f1" },
  output: { css: true, json: true, typescript: true },
} satisfies SiguiConfig;

// Build with the CLI:
// bunx sigui build       → generates CSS, JSON, and TypeScript tokens
// bunx sigui build --watch  → rebuilds on config changes
// bunx sigui check       → validates contrast, tokens, touch targets`}
  />

  <sg-code-block
    title="Runtime Usage"
    language="typescript"
    code={`import { generatePalette, themeToDTCG } from "@sig-ui/core";
import { resolveTheme } from "@sig-ui/theme";

// Generate a palette at runtime
const palette = generatePalette("#6366f1", { background: "#fff" });
const tree = themeToDTCG({ palette: { primary: palette.ramp } });

// Or resolve a full theme from config
const resolved = resolveTheme(config);
// → palettes, typography, spacing, elevation, motion, surfaces`}
  />

  <TokensSection />
</div>
