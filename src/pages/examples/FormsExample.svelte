<script lang="ts">
  import ExamplesLayout from "./ExamplesLayout.svelte";

  // --- Card 1: Create Account ---
  let loginEmail = $state("");
  let loginPassword = $state("");
  let rememberMe = $state(false);

  // --- Card 2: Payment Method ---
  let paymentTab = $state("card");
  let cardNumber = $state("");
  let expiry = $state("");
  let cvc = $state("");

  // --- Card 3: Settings / Appearance ---
  let themeValue = $state("system");
  let fontValue = $state("inter");
  let sidebarEnabled = $state(true);
  let notificationsEnabled = $state(false);

  // --- Card 4: Two-Factor Auth ---
  let otpValue = $state("");

  // --- Card 5: Report an Issue ---
  let issueArea = $state("team");
  let issueSubject = $state("");
  let issueDescription = $state("");

  // --- Card 6: Notification Preferences ---
  let pushEnabled = $state(true);
  let emailDigestEnabled = $state(true);
  let smsEnabled = $state(false);
</script>

<ExamplesLayout>
  
    <div class="forms-grid">

      <!-- Card 1: Create Account -->
      <sg-card elevation={1}>
        
          <sg-card-header>
            
              <sg-card-title>Create an account</sg-card-title>
              <sg-card-description>Enter your details below to get started.</sg-card-description>
            
          </sg-card-header>
          <sg-card-body>
            
              <div class="form-stack">
                <input class="sg-input" type="email" placeholder="you@example.com" value={loginEmail} oninput={(e) => { const el = e.currentTarget as any; loginEmail = (el.value ?? loginEmail); }} onchange={(e) => { const el = e.currentTarget as any; loginEmail = (el.value ?? loginEmail); }} onclick={(e) => { const el = e.currentTarget as any; loginEmail = (el.value ?? loginEmail); }} ontoggle={(e) => { const el = e.currentTarget as any; loginEmail = (el.value ?? loginEmail); }} />
                <input class="sg-input" type="password" placeholder="••••••••" value={loginPassword} oninput={(e) => { const el = e.currentTarget as any; loginPassword = (el.value ?? loginPassword); }} onchange={(e) => { const el = e.currentTarget as any; loginPassword = (el.value ?? loginPassword); }} onclick={(e) => { const el = e.currentTarget as any; loginPassword = (el.value ?? loginPassword); }} ontoggle={(e) => { const el = e.currentTarget as any; loginPassword = (el.value ?? loginPassword); }} />
                <div class="checkbox-row">
                  <input type="checkbox" class="sg-checkbox" checked={rememberMe} oninput={(e) => { const el = e.currentTarget as any; rememberMe = (el.checked ?? rememberMe); }} onchange={(e) => { const el = e.currentTarget as any; rememberMe = (el.checked ?? rememberMe); }} onclick={(e) => { const el = e.currentTarget as any; rememberMe = (el.checked ?? rememberMe); }} ontoggle={(e) => { const el = e.currentTarget as any; rememberMe = (el.checked ?? rememberMe); }} />
                </div>
              </div>
            
          </sg-card-body>
          <sg-card-footer>
            
              <div class="footer-stack">
                <button class="sg-button" data-color="primary" data-size="md" type="submit">
                  Create account
                </button>
                <p class="footer-hint">
                  Already have an account?
                  <a href="#sign-in" class="inline-link">Sign in</a>
                </p>
              </div>
            
          </sg-card-footer>
        
      </sg-card>

      <!-- Card 2: Payment Method -->
      <sg-card elevation={1}>
        
          <sg-card-header>
            
              <sg-card-title>Payment method</sg-card-title>
              <sg-card-description>Add a new payment method to your account.</sg-card-description>
            
          </sg-card-header>
          <sg-card-body>
            
              <sg-tabs-root value={paymentTab} oninput={(e) => { const el = e.currentTarget as any; paymentTab = (el.value ?? paymentTab); }} onchange={(e) => { const el = e.currentTarget as any; paymentTab = (el.value ?? paymentTab); }} onclick={(e) => { const el = e.currentTarget as any; paymentTab = (el.value ?? paymentTab); }} ontoggle={(e) => { const el = e.currentTarget as any; paymentTab = (el.value ?? paymentTab); }}>
                
                  <sg-tabs-list aria-label="Payment method type">
                    
                      <sg-tabs-trigger value="card">
                        Card
                      </sg-tabs-trigger>
                      <sg-tabs-trigger value="paypal">
                        PayPal
                      </sg-tabs-trigger>
                      <sg-tabs-trigger value="apple">
                        Apple Pay
                      </sg-tabs-trigger>
                    
                  </sg-tabs-list>

                  <sg-tabs-content value="card">
                    
                      <div class="form-stack tab-form-content">
                        <input class="sg-input" placeholder="1234 5678 9012 3456" value={cardNumber} oninput={(e) => { const el = e.currentTarget as any; cardNumber = (el.value ?? cardNumber); }} onchange={(e) => { const el = e.currentTarget as any; cardNumber = (el.value ?? cardNumber); }} onclick={(e) => { const el = e.currentTarget as any; cardNumber = (el.value ?? cardNumber); }} ontoggle={(e) => { const el = e.currentTarget as any; cardNumber = (el.value ?? cardNumber); }} />
                        <div class="two-col">
                          <input class="sg-input" placeholder="MM/YY" value={expiry} oninput={(e) => { const el = e.currentTarget as any; expiry = (el.value ?? expiry); }} onchange={(e) => { const el = e.currentTarget as any; expiry = (el.value ?? expiry); }} onclick={(e) => { const el = e.currentTarget as any; expiry = (el.value ?? expiry); }} ontoggle={(e) => { const el = e.currentTarget as any; expiry = (el.value ?? expiry); }} />
                          <input class="sg-input" placeholder="123" value={cvc} oninput={(e) => { const el = e.currentTarget as any; cvc = (el.value ?? cvc); }} onchange={(e) => { const el = e.currentTarget as any; cvc = (el.value ?? cvc); }} onclick={(e) => { const el = e.currentTarget as any; cvc = (el.value ?? cvc); }} ontoggle={(e) => { const el = e.currentTarget as any; cvc = (el.value ?? cvc); }} />
                        </div>
                      </div>
                    
                  </sg-tabs-content>

                  <sg-tabs-content value="paypal">
                    
                      <div class="tab-form-content tab-placeholder">
                        <p class="placeholder-text">You will be redirected to PayPal to complete payment.</p>
                      </div>
                    
                  </sg-tabs-content>

                  <sg-tabs-content value="apple">
                    
                      <div class="tab-form-content tab-placeholder">
                        <p class="placeholder-text">Apple Pay is available on supported devices.</p>
                      </div>
                    
                  </sg-tabs-content>
                
              </sg-tabs-root>
            
          </sg-card-body>
          <sg-card-footer>
            
              <button class="sg-button" data-color="primary" data-size="md">
                Continue
              </button>
            
          </sg-card-footer>
        
      </sg-card>

      <!-- Card 3: Appearance Settings -->
      <sg-card elevation={1}>
        
          <sg-card-header>
            
              <sg-card-title>Appearance</sg-card-title>
              <sg-card-description>Customize how the interface looks and feels.</sg-card-description>
            
          </sg-card-header>
          <sg-card-body>
            
              <div class="form-stack">
                <select class="sg-native-select" value={themeValue} oninput={(e) => { const el = e.currentTarget as any; themeValue = (el.value ?? themeValue); }} onchange={(e) => { const el = e.currentTarget as any; themeValue = (el.value ?? themeValue); }} onclick={(e) => { const el = e.currentTarget as any; themeValue = (el.value ?? themeValue); }} ontoggle={(e) => { const el = e.currentTarget as any; themeValue = (el.value ?? themeValue); }}>

                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>

                </select>
                <select class="sg-native-select" value={fontValue} oninput={(e) => { const el = e.currentTarget as any; fontValue = (el.value ?? fontValue); }} onchange={(e) => { const el = e.currentTarget as any; fontValue = (el.value ?? fontValue); }} onclick={(e) => { const el = e.currentTarget as any; fontValue = (el.value ?? fontValue); }} ontoggle={(e) => { const el = e.currentTarget as any; fontValue = (el.value ?? fontValue); }}>

                    <option value="inter">Inter</option>
                    <option value="roboto">Roboto</option>
                    <option value="manrope">Manrope</option>

                </select>
                <hr class="sg-separator" data-orientation="horizontal" aria-hidden="true" />
                <div class="switch-stack">
                  <input type="checkbox" class="sg-switch" role="switch" checked={sidebarEnabled} oninput={(e) => { const el = e.currentTarget as any; sidebarEnabled = (el.checked ?? sidebarEnabled); }} onchange={(e) => { const el = e.currentTarget as any; sidebarEnabled = (el.checked ?? sidebarEnabled); }} onclick={(e) => { const el = e.currentTarget as any; sidebarEnabled = (el.checked ?? sidebarEnabled); }} ontoggle={(e) => { const el = e.currentTarget as any; sidebarEnabled = (el.checked ?? sidebarEnabled); }} />
                  <input type="checkbox" class="sg-switch" role="switch" checked={notificationsEnabled} oninput={(e) => { const el = e.currentTarget as any; notificationsEnabled = (el.checked ?? notificationsEnabled); }} onchange={(e) => { const el = e.currentTarget as any; notificationsEnabled = (el.checked ?? notificationsEnabled); }} onclick={(e) => { const el = e.currentTarget as any; notificationsEnabled = (el.checked ?? notificationsEnabled); }} ontoggle={(e) => { const el = e.currentTarget as any; notificationsEnabled = (el.checked ?? notificationsEnabled); }} />
                </div>
              </div>
            
          </sg-card-body>
          <sg-card-footer>
            
              <button class="sg-button" data-color="primary" data-size="md">
                Update preferences
              </button>
            
          </sg-card-footer>
        
      </sg-card>

      <!-- Card 4: Two-Factor Auth -->
      <sg-card elevation={1}>
        
          <sg-card-header>
            
              <sg-card-title>Two-factor authentication</sg-card-title>
              <sg-card-description>Enter the 6-digit code sent to your phone to verify your identity.</sg-card-description>
            
          </sg-card-header>
          <sg-card-body>
            
              <div class="otp-area">
                <sg-input-otp-root value={otpValue} oninput={(e) => { const el = e.currentTarget as any; otpValue = (el.value ?? otpValue); }} onchange={(e) => { const el = e.currentTarget as any; otpValue = (el.value ?? otpValue); }} onclick={(e) => { const el = e.currentTarget as any; otpValue = (el.value ?? otpValue); }} ontoggle={(e) => { const el = e.currentTarget as any; otpValue = (el.value ?? otpValue); }} length={6} aria-label="One-time verification code">
                  
                    <sg-input-otp-group>
                      
                        <sg-input-otp-slot index={0} />
                        <sg-input-otp-slot index={1} />
                        <sg-input-otp-slot index={2} />
                      
                    </sg-input-otp-group>
                    <sg-input-otp-separator />
                    <sg-input-otp-group>
                      
                        <sg-input-otp-slot index={3} />
                        <sg-input-otp-slot index={4} />
                        <sg-input-otp-slot index={5} />
                      
                    </sg-input-otp-group>
                  
                </sg-input-otp-root>
              </div>
            
          </sg-card-body>
          <sg-card-footer>
            
              <div class="footer-stack">
                <button class="sg-button" data-color="primary" data-size="md">
                  Verify
                </button>
                <p class="footer-hint">
                  Didn't receive a code?
                  <button type="button" class="inline-link inline-link-button">Resend</button>
                </p>
              </div>
            
          </sg-card-footer>
        
      </sg-card>

      <!-- Card 5: Report an Issue -->
      <sg-card elevation={1}>
        
          <sg-card-header>
            
              <sg-card-title>Report an issue</sg-card-title>
              <sg-card-description>Tell us what went wrong so we can look into it.</sg-card-description>
            
          </sg-card-header>
          <sg-card-body>
            
              <div class="form-stack">
                <select class="sg-native-select" value={issueArea} oninput={(e) => { const el = e.currentTarget as any; issueArea = (el.value ?? issueArea); }} onchange={(e) => { const el = e.currentTarget as any; issueArea = (el.value ?? issueArea); }} onclick={(e) => { const el = e.currentTarget as any; issueArea = (el.value ?? issueArea); }} ontoggle={(e) => { const el = e.currentTarget as any; issueArea = (el.value ?? issueArea); }}>

                    <option value="team">Team</option>
                    <option value="billing">Billing</option>
                    <option value="account">Account</option>
                    <option value="security">Security</option>

                </select>
                <input class="sg-input" placeholder="Brief summary of the issue" value={issueSubject} oninput={(e) => { const el = e.currentTarget as any; issueSubject = (el.value ?? issueSubject); }} onchange={(e) => { const el = e.currentTarget as any; issueSubject = (el.value ?? issueSubject); }} onclick={(e) => { const el = e.currentTarget as any; issueSubject = (el.value ?? issueSubject); }} ontoggle={(e) => { const el = e.currentTarget as any; issueSubject = (el.value ?? issueSubject); }} />
                <textarea class="sg-textarea" placeholder="Describe the issue in detail..." rows={4} value={issueDescription} oninput={(e) => { const el = e.currentTarget as any; issueDescription = (el.value ?? issueDescription); }} onchange={(e) => { const el = e.currentTarget as any; issueDescription = (el.value ?? issueDescription); }} onclick={(e) => { const el = e.currentTarget as any; issueDescription = (el.value ?? issueDescription); }} ontoggle={(e) => { const el = e.currentTarget as any; issueDescription = (el.value ?? issueDescription); }}></textarea>
              </div>
            
          </sg-card-body>
          <sg-card-footer>
            
              <div class="footer-actions">
                <button class="sg-button" data-color="ghost" data-size="md">
                  Cancel
                </button>
                <button class="sg-button" data-color="primary" data-size="md">
                  Submit
                </button>
              </div>
            
          </sg-card-footer>
        
      </sg-card>

      <!-- Card 6: Notification Preferences -->
      <sg-card elevation={1}>
        
          <sg-card-header>
            
              <sg-card-title>Notification preferences</sg-card-title>
              <sg-card-description>Choose how and when you want to be notified.</sg-card-description>
            
          </sg-card-header>
          <sg-card-body>
            
              <div class="notification-list">

                <div class="notification-item">
                  <div class="notification-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                    </svg>
                  </div>
                  <div class="notification-text">
                    <span class="notification-title">Push notifications</span>
                    <span class="notification-desc">Receive alerts directly on your device.</span>
                  </div>
                  <input type="checkbox" class="sg-switch" role="switch" aria-label="Toggle push notifications" checked={pushEnabled} oninput={(e) => { const el = e.currentTarget as any; pushEnabled = (el.checked ?? pushEnabled); }} onchange={(e) => { const el = e.currentTarget as any; pushEnabled = (el.checked ?? pushEnabled); }} onclick={(e) => { const el = e.currentTarget as any; pushEnabled = (el.checked ?? pushEnabled); }} ontoggle={(e) => { const el = e.currentTarget as any; pushEnabled = (el.checked ?? pushEnabled); }} />
                </div>

                <hr class="sg-separator" data-orientation="horizontal" aria-hidden="true" />

                <div class="notification-item">
                  <div class="notification-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2"/>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                  </div>
                  <div class="notification-text">
                    <span class="notification-title">Email digest</span>
                    <span class="notification-desc">Weekly summary of your activity.</span>
                  </div>
                  <input type="checkbox" class="sg-switch" role="switch" aria-label="Toggle email digest" checked={emailDigestEnabled} oninput={(e) => { const el = e.currentTarget as any; emailDigestEnabled = (el.checked ?? emailDigestEnabled); }} onchange={(e) => { const el = e.currentTarget as any; emailDigestEnabled = (el.checked ?? emailDigestEnabled); }} onclick={(e) => { const el = e.currentTarget as any; emailDigestEnabled = (el.checked ?? emailDigestEnabled); }} ontoggle={(e) => { const el = e.currentTarget as any; emailDigestEnabled = (el.checked ?? emailDigestEnabled); }} />
                </div>

                <hr class="sg-separator" data-orientation="horizontal" aria-hidden="true" />

                <div class="notification-item">
                  <div class="notification-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.92 1.13h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  </div>
                  <div class="notification-text">
                    <span class="notification-title">SMS alerts</span>
                    <span class="notification-desc">Critical updates sent via text message.</span>
                  </div>
                  <input type="checkbox" class="sg-switch" role="switch" aria-label="Toggle SMS alerts" checked={smsEnabled} oninput={(e) => { const el = e.currentTarget as any; smsEnabled = (el.checked ?? smsEnabled); }} onchange={(e) => { const el = e.currentTarget as any; smsEnabled = (el.checked ?? smsEnabled); }} onclick={(e) => { const el = e.currentTarget as any; smsEnabled = (el.checked ?? smsEnabled); }} ontoggle={(e) => { const el = e.currentTarget as any; smsEnabled = (el.checked ?? smsEnabled); }} />
                </div>

              </div>
            
          </sg-card-body>
          <sg-card-footer>
            
              <button class="sg-button" data-color="primary" data-size="md">
                Save preferences
              </button>
            
          </sg-card-footer>
        
      </sg-card>

    </div>
  
</ExamplesLayout>

<style>
  .forms-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--sg-space-6);
    padding: 0 var(--sg-space-6);
    max-width: 900px;
    margin: 0 auto;
  }

  @media (max-width: 640px) {
    .forms-grid {
      grid-template-columns: 1fr;
      padding: 0 var(--sg-space-4);
    }
  }

  /* Shared form layout */
  .form-stack {
    display: flex;
    flex-direction: column;
    gap: var(--sg-gap-grouped);
  }

  .two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--sg-space-3);
  }

  .checkbox-row {
    display: flex;
    align-items: center;
  }

  .switch-stack {
    display: flex;
    flex-direction: column;
    gap: var(--sg-space-3);
  }

  /* Footer patterns */
  .footer-stack {
    display: flex;
    flex-direction: column;
    gap: var(--sg-space-3);
    width: 100%;
  }

  .footer-actions {
    display: flex;
    gap: var(--sg-space-3);
    justify-content: flex-end;
    width: 100%;
  }

  .footer-hint {
    font-size: var(--sg-text-sm);
    color: var(--text-3);
    margin: 0;
    text-align: center;
  }

  .inline-link {
    color: var(--sg-color-border-focus);
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  .inline-link:hover {
    color: var(--sg-color-link);
  }

  .inline-link-button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    font-size: inherit;
    font-family: inherit;
  }

  /* Tabs content spacing */
  .tab-form-content {
    margin-top: var(--sg-space-4);
  }

  .tab-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100px;
  }

  .placeholder-text {
    font-size: var(--sg-text-sm);
    color: var(--text-3);
    text-align: center;
    margin: 0;
  }

  /* OTP layout */
  .otp-area {
    display: flex;
    justify-content: center;
    padding: var(--sg-space-4) 0;
  }

  /* Notification list */
  .notification-list {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .notification-item {
    display: flex;
    align-items: center;
    gap: var(--sg-space-3);
    padding: var(--sg-space-3) 0;
  }

  .notification-icon {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    border-radius: var(--sg-radius-md);
    background: var(--sg-surface-container-high);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--sg-color-text-secondary);
  }

  .notification-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--sg-gap-tight);
    min-width: 0;
  }

  .notification-title {
    font-size: var(--sg-text-sm);
    font-weight: var(--sg-weight-medium);
    color: var(--sg-color-text);
    line-height: 1.3;
  }

  .notification-desc {
    font-size: var(--sg-text-xs);
    color: var(--text-3);
    line-height: 1.4;
  }
</style>
