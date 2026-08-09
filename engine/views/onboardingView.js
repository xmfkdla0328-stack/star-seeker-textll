import {
  getCurrentOnboardingStep,
  getOnboardingState,
  moveToNextOnboardingStep,
  setOnboardingCodename,
  startOnboarding,
} from '../onboarding/onboardingFlow.js';
import { formatOnboardingText } from '../onboarding/onboardingFlow.js';

let scanAnimationFrame = null;

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

    moveToNextOnboardingStep();
    renderOnboardingScan();
  });
}

export function renderOnboardingScan() {
  cancelScanAnimation();

  const state = getOnboardingState();
  const step = getCurrentOnboardingStep();
  if (!state || !step) return;

  const app = getApp();
  app.className = 'app onboarding-app';
  app.innerHTML = `
    <main class="onboarding-screen" aria-labelledby="scanTitle">
      <section class="onboarding-script-window onboarding-scan-window">
        <div class="onboarding-label" id="scanTitle">BIOMETRIC SCAN</div>
        <div class="onboarding-script" id="scanScript"></div>

        <div class="scan-progress-area" aria-live="polite">
          <div class="scan-progress-meta">
            <span id="scanStatus">${step.loading.label}</span>
            <span id="scanPercentage">0%</span>
          </div>
          <div class="scan-progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" aria-label="신체 스캔 진행률">
            <div class="scan-progress-bar" id="scanProgressBar"></div>
          </div>
        </div>

        <button class="onboarding-confirm-btn scan-complete-btn" id="scanCompleteBtn" type="button" disabled>
          ${step.loading.completeLabel}
        </button>
      </section>
    </main>
  `;

  renderScriptLines(
    document.getElementById('scanScript'),
    step.scripts,
    state.codename
  );

  startScanAnimation(step.loading.durationMs);
}

function startScanAnimation(durationMs) {
  const startedAt = performance.now();
  const bar = document.getElementById('scanProgressBar');
  const percentage = document.getElementById('scanPercentage');
  const status = document.getElementById('scanStatus');
  const progressTrack = bar?.parentElement;
  const completeButton = document.getElementById('scanCompleteBtn');
  if (!bar || !percentage || !status || !progressTrack || !completeButton) return;

  const update = now => {
    const progress = Math.min((now - startedAt) / durationMs, 1);
    const percent = Math.round(progress * 100);

    bar.style.width = `${percent}%`;
    percentage.textContent = `${percent}%`;
    progressTrack.setAttribute('aria-valuenow', String(percent));

    if (progress < 1) {
      scanAnimationFrame = requestAnimationFrame(update);
      return;
    }

    status.textContent = '스캔 완료';
    completeButton.disabled = false;
    completeButton.classList.add('is-ready');
    completeButton.focus();
    completeButton.onclick = () => {
      completeButton.disabled = true;
      moveToNextOnboardingStep();
      // #3 화면은 다음 작업에서 연결합니다.
      status.textContent = '다음 프로토콜을 준비합니다...';
    };
  };

  scanAnimationFrame = requestAnimationFrame(update);
}

function cancelScanAnimation() {
  if (scanAnimationFrame !== null) {
    cancelAnimationFrame(scanAnimationFrame);
    scanAnimationFrame = null;
  }
}