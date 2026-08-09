/**
 * 게임 첫 진입 온보딩 데이터입니다.
 *
 * 화면 렌더링은 engine/onboarding/onboardingFlow.js를 통해 이 데이터를
 * 읽도록 분리해 둡니다. 문장 안의 {codename}은 저장된 코드 네임으로
 * 치환됩니다.
 */
export const ONBOARDING_STEP_IDS = {
  IDENTITY: 'identity',
  SCAN: 'scan',
  ACTIVATION: 'activation',
  TITLE_GUIDE: 'titleGuide',
  MENU_INTRO: 'menuIntro',
  FACILITY_GUIDE: 'facilityGuide',
  MISSION_GUIDE: 'missionGuide',
  CHAPTER_GUIDE: 'chapterGuide',
};

export const ONBOARDING_STEPS = {
  [ONBOARDING_STEP_IDS.IDENTITY]: {
    id: ONBOARDING_STEP_IDS.IDENTITY,
    type: 'codename',
    screen: 'onboarding',
    background: 'dark',
    scripts: [
      '대상자의 자아 각성을 확인.',
      '자아 형태의 확인을 위해, 정보를 수집합니다.',
      '당신의 코드 네임은 무엇입니까?',
    ],
    defaultCodename: 'N03L',
    next: ONBOARDING_STEP_IDS.SCAN,
  },

  [ONBOARDING_STEP_IDS.SCAN]: {
    id: ONBOARDING_STEP_IDS.SCAN,
    type: 'scan',
    screen: 'onboarding',
    background: 'dark',
    scripts: [
      '코드네임 ‘{codename}’, 확인하였습니다.',
      '당신의 신체적, 외형적 특이 사항을 스캔, 확인합니다.',
    ],
    loading: {
      durationMs: 2400,
      label: '스캔 중...',
      completeLabel: '스캔 완료',
    },
    next: ONBOARDING_STEP_IDS.ACTIVATION,
  },

  [ONBOARDING_STEP_IDS.ACTIVATION]: {
    id: ONBOARDING_STEP_IDS.ACTIVATION,
    type: 'script',
    screen: 'onboarding',
    background: 'dark',
    scripts: [
      '확인 완료. 스캔 결과, 오류 사항은 발견되지 않았습니다.',
      '따라서 제 88회차, 프로젝트 <T■■ N■■■v■■■>를 가동합니다.',
    ],
    next: ONBOARDING_STEP_IDS.TITLE_GUIDE,
  },

  [ONBOARDING_STEP_IDS.TITLE_GUIDE]: {
    id: ONBOARDING_STEP_IDS.TITLE_GUIDE,
    type: 'script',
    screen: 'title',
    background: 'reveal',
    anchor: 'start',
    scripts: [
      '무탈한 자아의 각성을 축하합니다, 코드네임: ‘{codename}’님.',
      '이곳은 당신이 주축이 되어 수행하게 될 프로젝트 <T■■ N■■■v■■■>의 중심지인 별 관측소, 바야 폴라리스 Via Polaris입니다.',
      '당신은 바야 폴라리스의 88대 ‘관측자’로서, 프로젝트 <T■■ N■■■v■■■>의 궁극적 목표인 ‘인류 생존권 확대’를 위해 많은 별을 관측하고, 탐사하고, 지원해야 합니다.',
      '자, 일단 바야 폴라리스로 진입하기 위해 Start 버튼을 눌러봅시다.',
    ],
    requiredAction: 'start',
    next: ONBOARDING_STEP_IDS.MENU_INTRO,
  },

  [ONBOARDING_STEP_IDS.MENU_INTRO]: {
    id: ONBOARDING_STEP_IDS.MENU_INTRO,
    type: 'script',
    screen: 'menu',
    background: 'light',
    anchor: 'menu',
    scripts: [
      '프로젝트 <T■■ N■■■v■■■>의 재개방을 확인했습니다.',
      '프로토콜 <헤카톤케팔로스> 활성 완료.',
    ],
    next: ONBOARDING_STEP_IDS.FACILITY_GUIDE,
  },

  [ONBOARDING_STEP_IDS.FACILITY_GUIDE]: {
    id: ONBOARDING_STEP_IDS.FACILITY_GUIDE,
    type: 'characterScript',
    screen: 'menu',
    background: 'light',
    character: {
      id: 'echidna',
      name: '에키드나',
      image: 'images/characters/echidna.png',
    },
    scripts: [
      '바야 폴라리스에 어서오십시오.',
      '저는 바야 폴라리스의 관리와 유지를 도맡고 있는 가상 인격체, 에키드나입니다.',
      '간단히 바야 폴라리스의 시설 및 기능에 대해 안내해드리겠습니다.',
      '바야 폴라리스에는 프로젝트 <T■■ N■■■v■■■>의 성공적인 수행을 위한 각종 시설과 기능이 갖춰져 있습니다.',
      ''관측' 기능을 수행하는 구체 형태의 방인 흘리드스키알프, 특정된 좌표로 정신체를 쏘아보내는 '투사' 기능을 수행하는 통로인 프시코폼포스, '구축' 기능을 수행하는 정팔면체 형태의 도구인 케러 안시크 등이 그 예시입니다.',
    ],
    next: ONBOARDING_STEP_IDS.MISSION_GUIDE,
  },

  [ONBOARDING_STEP_IDS.MISSION_GUIDE]: {
    id: ONBOARDING_STEP_IDS.MISSION_GUIDE,
    type: 'script',
    screen: 'menu',
    background: 'light',
    anchor: 'mission',
    enabledTargets: ['mission'],
    lockedTargets: ['archive', 'waiting'],
    scripts: [
      '처음부터 모든 것을 알려 하면 어려울 테니, 지금은 일단 제가 미리 ‘관측’해둔 인근의 인류 생존 위협권으로 향하여 해야 하고 할 수 있는 것들을 하나씩 배우도록 합시다.',
      '위험도가 낮은 곳으로 지정해두었으니, 걱정 말고 좌측의 <임무 개시>로 진입해봅시다.',
    ],
    requiredAction: 'mission',
    next: ONBOARDING_STEP_IDS.CHAPTER_GUIDE,
  },

  [ONBOARDING_STEP_IDS.CHAPTER_GUIDE]: {
    id: ONBOARDING_STEP_IDS.CHAPTER_GUIDE,
    type: 'script',
    screen: 'chapter',
    background: 'light',
    anchor: 'chapter0',
    enabledTargets: ['chapter0'],
    lockedTargets: ['chapter1'],
    scripts: [
      '제가 찾아둔 인류 생존 위협권의 좌표가 좌측에 있습니다.',
      '‘케일런-9’ 좌표를 선택하여, 프시코폼포스를 지나 영혼 투사를 진행해봅시다.',
    ],
    requiredAction: 'chapter0',
    // chapter0 선택 시 실제 케일런-9 스토리로 진입하면서 완료 처리합니다.
    next: 'kailun9',
  },
};

export function getOnboardingStep(stepId) {
  return ONBOARDING_STEPS[stepId] || null;
}