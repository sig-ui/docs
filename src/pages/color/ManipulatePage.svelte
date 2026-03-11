<script lang="ts">
  import ManipulateSection from "../../sections/ManipulateSection.svelte";
  import AlphaBlendingSection from "../../sections/AlphaBlendingSection.svelte";
</script>

<div class="page">
  <div class="page-header">
    <sg-heading level={1}>Color Manipulation</sg-heading>
    <sg-text size="lg" color="secondary">Lighten, darken, saturate, desaturate, and shift hues in OKLCH color space for perceptually accurate results.</sg-text>
  </div>

  <sg-code-block
    title="Usage"
    language="typescript"
    code={`import { lighten, darken, saturate, desaturate, adjustHue } from "@sig-ui/core/color";
import { computeAlphaEquivalent, generateBlackAlphaScale } from "@sig-ui/core/alpha";

lighten("#6366f1", 0.2);    // 20% lighter in OKLCH
darken("#6366f1", 0.2);     // 20% darker
saturate("#6366f1", 0.3);   // boost chroma
adjustHue("#6366f1", 30);   // shift hue +30°

// Alpha blending: back-solve sRGBA over a background
computeAlphaEquivalent(target, background, 0.5);
// → { alpha: 0.5, rgba, css: "rgba(…)", exact: true }

// Perceptually uniform overlay scales
generateBlackAlphaScale();  // 12-step black overlay
generateWhiteAlphaScale();  // 12-step white overlay`}
  />

  <ManipulateSection />
  <AlphaBlendingSection />
</div>
