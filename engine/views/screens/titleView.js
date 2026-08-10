import { navigateTo } from '../../router.js';
import {
  clearActiveSave,
  hasActiveSave,
  isTutorialCompleted,
} from '../../storage.js';
import { showResumeDialog } from '../components/resumeDialog.js';
import {
  renderOnboardingIdentity,
  renderOnboardingTitleGuide,
} from '../../onboarding/onboardingScreens.js';
import { startOnboarding } from '../../onboarding/onboardingFlow.js';

export function renderTitleScreen({ onboardingGuide = false } = {}) {
  const app = document.getElementById("app");
  app.className = "app flex-center"; // 중앙 정렬 스타일 부여
  app.innerHTML = `
    <div class="eyebrow" style="letter-spacing:0.4em; font-size:12px; color:var(--navy-soft); font-weight:600;">DEEP SPACE ANOMALY RESPONSE</div>
    <h1 class="main-title">Star-Seeker</h1>
    <button class="choice-btn" id="startBtn" style="text-align:center; padding: 15px 50px; font-size: 15px; border-radius: 999px; background: var(--glass-strong);">
      시스템 접속 (START)
    </button>
  `;

  if (onboardingGuide) {
    renderOnboardingTitleGuide();
    return;
  }

  document.getElementById("startBtn").onclick = () => {
    if (!isTutorialCompleted()) {
      startOnboarding();
      renderOnboardingIdentity();
      return;
    }

    if (!hasActiveSave()) {
      navigateTo('menu');
      return;
    }

    showResumeDialog({
      onResume: () => navigateTo('game', { mode: 'resume' }),
      onNewGame: () => {
        clearActiveSave();
        navigateTo('menu');
      },
    });
  };
}