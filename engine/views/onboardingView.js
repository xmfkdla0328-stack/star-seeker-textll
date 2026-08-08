import {
  getOnboardingState,
  setOnboardingCodename,
  startOnboarding,
} from '../onboarding/onboardingFlow.js';
import { formatOnboardingText } from '../onboarding/onboardingFlow.js';

function getApp() {
  return document.getElementById('app');
}

function renderScriptLines(container, scripts, codename) {
  scripts.forEach(script => {
    const paragraph = document.createElement('p');
    paragraph.className = 'onboarding-script-line';
    paragraph.textContent = formatOnboardingText(script, codename);
    container.appendChild(paragraph);
  });
}

export function renderOnboardingIdentity() {
  const state = getOnboardingState() || startOnboarding();
  const step = state?.step;
  if (!step) return;

  const app = getApp();
  app.className = 'app onboarding-app';
  app.innerHTML = `
    <main class="onboarding-screen" aria-labelledby="onboardingTitle">
      <section class="onboarding-script-window">
        <div class="onboarding-label" id="onboardingTitle">SYSTEM INITIALIZATION</div>
        <div class="onboarding-script" id="onboardingScript"></div>

        <form class="codename-form" id="codenameForm">
          <label class="codename-label" for="codenameInput">CODE NAME</label>
          <input
            id="codenameInput"
            class="codename-input"
            name="codename"
            type="text"
            maxlength="24"
            autocomplete="off"
            spellcheck="false"
            aria-describedby="codenameError"
          >
          <p class="codename-error" id="codenameError" role="alert"></p>
          <button class="onboarding-confirm-btn" type="submit">확인</button>
        </form>
      </section>
    </main>
  `;

  const script = document.getElementById('onboardingScript');
  renderScriptLines(script, step.scripts, state.codename);

  const input = document.getElementById('codenameInput');
  input.value = state.codename || step.defaultCodename;

  document.getElementById('codenameForm').addEventListener('submit', event => {
    event.preventDefault();

    const error = document.getElementById('codenameError');
    const saved = setOnboardingCodename(input.value);
    if (!saved) {
      error.textContent = '코드 네임을 입력해주십시오. (최대 24자)';
      input.focus();
      return;
    }

    error.textContent = '';
    input.value = getOnboardingState().codename;
    input.setAttribute('aria-readonly', 'true');
    input.readOnly = true;

    const button = event.currentTarget.querySelector('button');
    button.textContent = '확인 완료';
    button.disabled = true;
  });
}