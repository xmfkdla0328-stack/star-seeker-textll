import {
  ONBOARDING_STEP_IDS,
  getOnboardingStep,
} from '../../story/data/onboarding.js';
import {
  getCodename,
  isTutorialCompleted,
  markTutorialCompleted,
  saveCodename,
} from '../storage.js';

let session = null;

function createSession(onChange) {
  return {
    stepId: ONBOARDING_STEP_IDS.IDENTITY,
    scriptIndex: 0,
    codename: getCodename(),
    onChange,
  };
}

function notify() {
  if (session?.onChange) {
    session.onChange(getOnboardingState());
  }
}

function requireSession() {
  if (!session) {
    throw new Error('온보딩 세션이 시작되지 않았습니다.');
  }
  return session;
}

export function startOnboarding({ onChange } = {}) {
  if (isTutorialCompleted()) {
    return null;
  }

  session = createSession(onChange);
  notify();
  return getOnboardingState();
}

export function isOnboardingActive() {
  return session !== null;
}

export function getOnboardingState() {
  if (!session) return null;

  const step = getOnboardingStep(session.stepId);
  return {
    stepId: session.stepId,
    step,
    scriptIndex: session.scriptIndex,
    codename: session.codename,
    isFirstStep: session.stepId === ONBOARDING_STEP_IDS.IDENTITY,
    isLastScript: Boolean(step && session.scriptIndex === step.scripts.length - 1),
  };
}

export function getCurrentOnboardingStep() {
  const current = getOnboardingState();
  return current?.step || null;
}

export function setOnboardingCodename(codename) {
  const current = requireSession();
  if (!saveCodename(codename)) {
    return false;
  }

  current.codename = getCodename();
  notify();
  return true;
}

export function advanceOnboardingScript() {
  const current = requireSession();
  const step = getOnboardingStep(current.stepId);

  if (!step || current.scriptIndex >= step.scripts.length - 1) {
    return false;
  }

  current.scriptIndex += 1;
  notify();
  return true;
}

export function moveToNextOnboardingStep() {
  const current = requireSession();
  const step = getOnboardingStep(current.stepId);

  if (!step?.next || step.next === 'kailun9') {
    return false;
  }

  current.stepId = step.next;
  current.scriptIndex = 0;
  notify();
  return true;
}

export function goToOnboardingStep(stepId) {
  requireSession();

  if (!getOnboardingStep(stepId)) {
    return false;
  }

  session.stepId = stepId;
  session.scriptIndex = 0;
  notify();
  return true;
}

export function completeOnboarding() {
  requireSession();
  markTutorialCompleted();
  session = null;
}

export function cancelOnboarding() {
  session = null;
}

export function getOnboardingEntryState() {
  if (!isTutorialCompleted()) {
    return 'onboarding';
  }

  return 'game';
}

export function formatOnboardingText(text, codename = getCodename()) {
  if (typeof text !== 'string') return '';
  return text.replaceAll('{codename}', codename);
}