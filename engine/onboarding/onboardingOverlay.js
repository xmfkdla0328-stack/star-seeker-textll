import {
  completeOnboarding,
  getOnboardingState,
  moveToNextOnboardingStep,
  formatOnboardingText,
} from './onboardingFlow.js';
import { ONBOARDING_STEP_IDS } from '../../story/data/onboarding.js';
import { showPopup, showCharacterPopup } from '../views/components/tutorialPopup.js';

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
    // 두 문장을 한 창에 합쳐서 표시, 에키드나 팝업과 동일한 하단 위치
    showPopup({
      scripts: [formatted(step.scripts).join('\n')],
      anchor: 'bottom',
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
 * chapterView.js에서 렌더링 직후 호출합니다.
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
