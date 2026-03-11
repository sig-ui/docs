<script lang="ts">
  import { apcaContrast, wcag2Contrast, meetsWCAG_AA, meetsWCAG_AAA } from "../../../packages/core/src/index.js";
  import { round } from "../utils.ts";
  let contrastText = $state("#1e1b4b");
  let contrastBg = $state("#e0e7ff");

  let contrastResult = $derived.by(() => {
    try {
      return {
        apca: apcaContrast(contrastText, contrastBg),
        wcag: wcag2Contrast(contrastText, contrastBg),
        aa: meetsWCAG_AA(contrastText, contrastBg),
        aaa: meetsWCAG_AAA(contrastText, contrastBg),
        aaLarge: meetsWCAG_AA(contrastText, contrastBg, true),
        aaaLarge: meetsWCAG_AAA(contrastText, contrastBg, true),
      };
    } catch {
      return null;
    }
  });
</script>

<sg-section id="contrast" title="Contrast Checker" description="Check APCA Lc and WCAG 2.x contrast ratios in real time. Both metrics are computed from perceptual luminance.">

    <div class="controls">
      <div class="control-group">
        <span class="card-label">Text Color</span>
        <sg-color-picker value={contrastText} oninput={(e) => { const el = e.currentTarget as any; contrastText = (el.value ?? contrastText); }} onchange={(e) => { const el = e.currentTarget as any; contrastText = (el.value ?? contrastText); }} onclick={(e) => { const el = e.currentTarget as any; contrastText = (el.value ?? contrastText); }} ontoggle={(e) => { const el = e.currentTarget as any; contrastText = (el.value ?? contrastText); }} mode="popover" input label="Color" />
      </div>
      <div class="control-group">
        <span class="card-label">Background</span>
        <sg-color-picker value={contrastBg} oninput={(e) => { const el = e.currentTarget as any; contrastBg = (el.value ?? contrastBg); }} onchange={(e) => { const el = e.currentTarget as any; contrastBg = (el.value ?? contrastBg); }} onclick={(e) => { const el = e.currentTarget as any; contrastBg = (el.value ?? contrastBg); }} ontoggle={(e) => { const el = e.currentTarget as any; contrastBg = (el.value ?? contrastBg); }} mode="popover" input label="Color" />
      </div>
      <button class="sg-button" onclick={() => { const t = contrastText; contrastText = contrastBg; contrastBg = t; }}>
        Swap
      </button>
    </div>

    <div class="contrast-layout">
      <div>
        <div class="contrast-preview" style="background: {contrastBg}; color: {contrastText}">
          <p class="preview-large">Large Heading</p>
          <p class="preview-body">The quick brown fox jumps over the lazy dog. This sample text demonstrates how your chosen color pair reads at body size.</p>
          <p class="preview-small">Small caption text &mdash; 12px / fine print</p>
        </div>
      </div>

      {#if contrastResult}
        <div>
          <div class="scores">
            <div class="score-card">
              <div class="score-label">APCA Lc</div>
              <div class="score-value" style="color: {Math.abs(contrastResult.apca) >= 60 ? '#4ade80' : Math.abs(contrastResult.apca) >= 45 ? '#fbbf24' : '#f87171'}">
                {round(contrastResult.apca, 1)}
              </div>
            </div>
            <div class="score-card">
              <div class="score-label">WCAG 2 Ratio</div>
              <div class="score-value" style="color: {contrastResult.wcag >= 4.5 ? '#4ade80' : contrastResult.wcag >= 3 ? '#fbbf24' : '#f87171'}">
                {round(contrastResult.wcag, 2)}:1
              </div>
            </div>
          </div>
          <div class="badges">
            <sg-badge color={contrastResult.aa ? "success" : "danger"}>AA Normal</sg-badge>
            <sg-badge color={contrastResult.aaa ? "success" : "danger"}>AAA Normal</sg-badge>
            <sg-badge color={contrastResult.aaLarge ? "success" : "danger"}>AA Large</sg-badge>
            <sg-badge color={contrastResult.aaaLarge ? "success" : "danger"}>AAA Large</sg-badge>
          </div>
        </div>
      {/if}
    </div>
</sg-section>
