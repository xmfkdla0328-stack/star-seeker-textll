import {
  advanceOnboardingScript,
  completeOnboarding,
  getCurrentOnboardingStep,
  getOnboardingState,
  moveToNextOnboardingStep,
  setOnboardingCodename,
  startOnboarding,
} from '../onboarding/onboardingFlow.js';
import { formatOnboardingText } from '../onboarding/onboardingFlow.js';
import { ONBOARDING_STEP_IDS } from '../../story/data/onboarding.js';
import { showPopup, showCharacterPopup } from './tutorialPopup.js';

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
      renderOnboardingActivation();
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

export function renderOnboardingActivation() {
  cancelScanAnimation();

  const state = getOnboardingState();
  const step = getCurrentOnboardingStep();
  if (!state || !step) return;

  const app = getApp();
  app.className = 'app onboarding-app';
  app.innerHTML = `
    <main class="onboarding-screen" aria-labelledby="activationTitle">
      <section class="onboarding-script-window onboarding-activation-window" id="activationWindow" tabindex="0">
        <div class="onboarding-label" id="activationTitle">PROJECT ACTIVATION</div>
        <div class="onboarding-script" id="activationScript"></div>
        <div class="onboarding-next-hint">클릭하여 계속</div>
      </section>
    </main>
  `;

  const script = document.getElementById('activationScript');
  renderScriptLines(script, step.scripts, state.codename);

  document.getElementById('activationWindow').addEventListener('click', () => {
    renderTitleGuide();
  }, { once: true });
}

function renderTitleGuide() {
  moveToNextOnboardingStep();
  renderOnboardingTitleGuide();
}

export function renderOnboardingTitleGuide() {
  const state = getOnboardingState();
  const step = getCurrentOnboardingStep();
  if (!state || !step) return;

  const app = getApp();
  app.className = 'app flex-center onboarding-title-app';
  app.innerHTML = `
    <div class="eyebrow" style="letter-spacing:0.4em; font-size:12px; color:var(--navy-soft); font-weight:600;">
      DEEP SPACE ANOMALY RESPONSE
    </div>
    <h1 class="main-title">Star-Seeker</h1>
    <button class="choice-btn" id="startBtn" disabled
      style="text-align:center; padding: 15px 50px; font-size: 15px; border-radius: 999px; background: var(--glass-strong);">
      시스템 접속 (START)
    </button>
    <button class="onboarding-title-script" id="titleGuideScript" type="button">
      <span class="onboarding-title-script-label">SYSTEM NOTICE</span>
      <span class="onboarding-title-script-text" id="titleGuideText"></span>
      <span class="onboarding-title-script-hint" id="titleGuideHint">클릭하여 계속</span>
    </button>
  `;

  const scriptButton = document.getElementById('titleGuideScript');
  const startButton = document.getElementById('startBtn');
  const text = document.getElementById('titleGuideText');
  const hint = document.getElementById('titleGuideHint');

  const renderCurrentScript = () => {
    const current = getOnboardingState();
    text.textContent = formatOnboardingText(
      step.scripts[current.scriptIndex],
      current.codename
    );
    hint.textContent = current.isLastScript
      ? '마지막 안내입니다. 클릭하여 Start 활성화'
      : '클릭하여 계속';
  };

  renderCurrentScript();

  scriptButton.addEventListener('click', () => {
    const current = getOnboardingState();
    if (current.isLastScript) {
      startButton.disabled = false;
      startButton.classList.add('is-ready');
      scriptButton.classList.add('is-complete');
      hint.textContent = '안내 완료';
      scriptButton.disabled = true;
      startButton.focus();
      return;
    }

    advanceOnboardingScript();
    renderCurrentScript();
  });

  startButton.addEventListener('click', () => {
    moveToNextOnboardingStep(); // → menuIntro
    // navigateTo는 순환 참조를 피하기 위해 동적으로 가져옵니다.
    import('../router.js').then(({ navigateTo }) => navigateTo('menu'));
  });
}

// ─── 메뉴 화면 온보딩 (#5 menuIntro → #6 facilityGuide → #7 missionGuide) ───

/**
 * menuView.js에서 렌더링 직후 호출합니다.
 * navigateFn: (screen, options?) => void  (router의 navigateTo)
 */
export function applyMenuOnboarding(navigateFn) {
  const state = getOnboardingState();
  if (!state) return;

  const step = state.step;
  const formatted = (arr) => arr.map(s => formatOnboardingText(s, state.codename));

  if (state.stepId === ONBOARDING_STEP_IDS.MENU_INTRO) {
    showPopup({
      scripts: formatted(step.scripts),
      anchor: 'center',
      onClose: () => {
        moveToNextOnboardingStep(); // → facilityGuide
        applyMenuOnboarding(navigateFn);
      },
    });

  } else if (state.stepId === ONBOARDING_STEP_IDS.FACILITY_GUIDE) {
    showCharacterPopup({
      character: step.character,
      scripts: formatted(step.scripts),
      onClose: () => {
        moveToNextOnboardingStep(); // → missionGuide
        applyMenuOnboarding(navigateFn);
      },
    });

  } else if (state.stepId === ONBOARDING_STEP_IDS.MISSION_GUIDE) {
    showPopup({
      scripts: formatted(step.scripts),
      anchor: 'mission',
      onClose: () => {
        // 팝업 닫힌 후 임무 개시 클릭 시 챕터로 진입
        const missionBtn = document.getElementById('btnMission');
        if (missionBtn) {
          missionBtn.onclick = () => {
            moveToNextOnboardingStep(); // → chapterGuide
            navigateFn('chapter');
          };
        }
      },
    });
  }
}

// ─── 챕터 화면 온보딩 (#8 chapterGuide) ───

/**
 * chapterScreen.js에서 렌더링 직후 호출합니다.
 * navigateFn: (screen, options?) => void
 */
export function applyChapterOnboarding(navigateFn) {
  const state = getOnboardingState();
  if (!state || state.stepId !== ONBOARDING_STEP_IDS.CHAPTER_GUIDE) return;

  const step = state.step;
  const formatted = step.scripts.map(s => formatOnboardingText(s, state.codename));

  showPopup({
    scripts: formatted,
    anchor: 'chapter0',
    onClose: () => {
      // 팝업 닫힌 후 케일런-9 클릭 시 온보딩 완료 후 게임 시작
      const chap0 = document.getElementById('chap0');
      if (chap0) {
        chap0.onclick = () => {
          completeOnboarding();
          navigateFn('game', { mode: 'new' });
        };
      }
    },
  });
}