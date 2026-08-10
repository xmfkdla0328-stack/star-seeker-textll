import { navigateTo } from './engine/router.js';
import { isTutorialCompleted, resetStorageForDevelopment } from './engine/storage.js';
import { startOnboarding } from './engine/onboarding/onboardingFlow.js';
import { renderOnboardingIdentity } from './engine/onboarding/onboardingScreens.js';

// 개발 프리뷰에서는 새로고침마다 완전히 처음 상태로 되돌려
// 첫 접속 튜토리얼을 반복 테스트할 수 있도록 합니다.
if (import.meta.env.DEV) {
  resetStorageForDevelopment();
}

if (!isTutorialCompleted()) {
  startOnboarding();
  renderOnboardingIdentity();
} else {
  navigateTo('title');
}