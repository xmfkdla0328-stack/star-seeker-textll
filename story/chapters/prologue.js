import { applyOrigin, addStat, addKeyword, statSummary } from '../../engine/state.js';

export const prologueStory = {

  tutorial_awareness: {
    tag: "SYSTEM · 자아 각성",
    text: "대상자의 자아 각성을 확인.\n자아 형상 고착을 위하여, 훈련 프로그램을 가동합니다.",
    tutorial: {
      scripts: ["선택지를 눌러 이야기를 진행합시다."],
      anchor: "choices",
    },
    choices: [
      { text: "훈련 프로그램에 응한다.", goto: "tutorial_training" }
    ]
  },

  tutorial_training: {
    tag: "SYSTEM · 훈련 프로그램",
    text: "훈련 프로그램 가동, 대상 기억: 케일런-9 수호전.\n케일런-9 진입 당시의 기억을 시뮬레이트 합니다.",
    onEnter: () => addKeyword("케일런-9"),
    tutorial: {
      scripts: [
        "'키워드'를 습득했습니다.",
        "키워드는 스토리 진행 중 특정 선택지를 선택할 수 있게 해주거나, 이후 스토리 진행을 위한 단서가 되어줍니다.",
        "획득한 키워드는 스토리 진행 중에는 이 곳에서, 컨텐츠 미진행 중에는 '아카이브' 화면에서 열람 가능합니다."
      ],
      anchor: "keywords",
    },
    choices: [
      { text: "케일런-9가 어디인지 묻는다.", goto: "tutorial_kailun" }
    ]
  },

  tutorial_kailun: {
    tag: "SIMULATION · 케일런-9",
    bg: "images/scenes/ch00_arrival_bg01.jpg",
    bgCaption: "케일런-9 · 폐허 지대",
    text: "케일런-9는 골디락스 존에 위치한 별로, 이파 은하 소속의 균류와 양치식물이 번성하였던 행성입니다.\n\n그러니 시뮬레이트 되는 기억 내에서, 케일런-9은 '재앙'의 영향으로 대기의 99%가 소멸.\n이로 인해 생물 종의 99.9%가 사멸하였습니다.",
    onEnter: () => addKeyword("재앙"),
    choices: [
      { text: "재앙이 무엇인지 묻는다.", goto: "tutorial_calamity" }
    ]
  },

  tutorial_calamity: {
    tag: "SIMULATION · 재앙",
    text: "재앙에 대한 데이터는 현재 심연 기지 최고 기밀로 분류되어 있습니다.\n\n『열람 권한 없음. 파견 임무 완수 후 갱신 예정.』\n\n훈련 프로그램이 종료됩니다. 이제 실제 파견을 준비하십시오.",
    choices: [
      { text: "파견 계열을 선택한다.", goto: "origin" }
    ]
  },

  origin: {
    tag: "PROLOGUE",
    text: "심연 기지, 정신 전송실.\n\n당신의 의식이 임시 육체에 정착하기까지 3초. 관리 AI '시빌'의 음성이 귓가에 울린다.\n\n『정신체 등록 완료. 파견 계열을 선택하십시오.』",
    choices: [
      { text: "강습형 — 전투 계열로 파견", goto: "briefing", onSelect: () => applyOrigin("combat") },
      { text: "분석형 — 연구 계열로 파견", goto: "briefing", onSelect: () => applyOrigin("research") },
      { text: "교섭형 — 외교 계열로 파견", goto: "briefing", onSelect: () => applyOrigin("diplomat") }
    ]
  },

  briefing: {
    tag: "브리핑",
    text: () => `시빌이 좌표 하나를 띄운다. 신호가 끊긴 관측 행성, '케일런-9'.\n\n『미증유 재앙 반응 감지. 생존자 신호 없음. 즉시 파견 권장.』\n\n당신은 임시 육체에 익숙해지려는 듯 손을 몇 번 쥐었다 편다.`,
    choices: [
      { text: "즉시 파견한다", goto: "arrival" },
      { text: "행성 자료를 조금 더 요청한다", goto: "arrival", onSelect: () => addStat("지력", 1) }
    ]
  },

  arrival: {
    tag: "케일런-9 · 폐허 지대",
    bg: "images/scenes/ch00_arrival_bg01.jpg",
    bgCaption: "케일런-9 · 폐허 지대",
    text: "붉은 모래바람 사이로 무너진 첨탑들이 서 있다. 발밑에는 이 세계의 것이 아닌 듯한 정체 불명의 비문이 새겨져 있다.\n\n당신은 정체 불명의 비문을 바라본다.",
    choices: [
      { text: "그냥 지나간다", goto: "signal" },
      { text: "비문을 해석한다", goto: "inscription_success",
        require: { keyword: "고대어 연구" } },
      { text: "직접 해독을 시도해본다", diceCheck: {
          stat: "지력", dc: 4,
          onSuccess: () => addKeyword("봉인 해제 지식"),
          success: "inscription_success",
          fail: "inscription_fail"
        } }
    ]
  },

  inscription_success: {
    tag: "케일런-9 · 폐허 지대",
    text: "비문의 의미가 머릿속에 흘러든다. 이것은 경고문이자 봉인의 열쇠였다.\n\n【키워드 획득: 봉인 해제 지식】\n\n무언가 거대한 것이 이 아래 잠들어 있다는 확신이 든다.",
    choices: [ { text: "계속 나아간다", goto: "signal" } ]
  },

  inscription_fail: {
    tag: "케일런-9 · 폐허 지대",
    text: "문자가 눈앞에서 뒤엉킨다. 해독은 실패했고, 비문 표면에서 뿜어져 나온 냉기에 육체가 상한다.\n\n【체력 -1】",
    onEnter: () => addStat("체력", -1),
    choices: [ { text: "계속 나아간다", goto: "signal" } ]
  },

  signal: {
    tag: "케일런-9 · 지하 통로",
    text: "지하로 이어지는 통로 저편에서 낡은 신호음이 반복된다. 동시에, 그림자 사이로 무언가 움직이는 기척이 느껴진다.",
    choices: [ { text: "기척 쪽으로 향한다", goto: "combat" } ]
  },

  combat: {
    tag: "조우",
    text: "변형된 생체 병기가 통로를 막아선다. 눈이 없는 얼굴이 당신 쪽으로 돌아간다.",
    choices: [
      { text: "정면으로 맞선다 [체력/솜씨]", diceCheck: {
          stat: "솜씨", dc: 4,
          success: "combat_win", fail: "combat_lose"
        } },
      { text: "빈틈을 노려 제압한다 [직감]", diceCheck: {
          stat: "직감", dc: 5,
          success: "combat_win", fail: "combat_lose"
        } }
    ]
  },

  combat_win: {
    tag: "조우 · 결과",
    text: "정확한 일격이 급소에 꽂힌다. 생체 병기가 경련하며 무너진다.\n\n【직감 +1】",
    onEnter: () => addStat("직감", 1),
    choices: [ { text: "지하 깊은 곳으로 향한다", goto: "beacon" } ]
  },

  combat_lose: {
    tag: "조우 · 결과",
    text: "일격을 허용했다. 임시 육체의 통증 신호가 격렬하게 울린다.\n\n【체력 -2】",
    onEnter: () => addStat("체력", -2),
    choices: [ { text: "몸을 추스르고 나아간다", goto: "beacon" } ]
  },

  beacon: {
    tag: "지하 성소",
    text: "통로 끝, 오래된 신호 발신기가 낮게 깜빡인다. 그 옆에 반쯤 묻힌 기록 장치가 있다.\n\n행운을 시험해본다.",
    choices: [
      { text: "기록 장치를 살펴본다 [직감 행운 판정]", diceCheck: {
          stat: "직감", dc: 3,
          onSuccess: () => addKeyword("잃어버린 항로"),
          success: "beacon_lucky", fail: "beacon_normal"
        } }
    ]
  },

  beacon_lucky: {
    tag: "지하 성소",
    text: "장치 안에서 예상치 못한 항로 데이터를 발견한다.\n\n【키워드 획득: 잃어버린 항로】",
    choices: [ { text: "성소 중심으로 향한다", goto: "core" } ]
  },

  beacon_normal: {
    tag: "지하 성소",
    text: "장치는 이미 오래전에 방전되어 아무 정보도 남아있지 않다.",
    choices: [ { text: "성소 중심으로 향한다", goto: "core" } ]
  },

  core: {
    tag: "성소 중심",
    text: "성소 중심에 거대한 봉인석이 놓여 있다. 재앙의 근원이 바로 이 아래 있다는 것을, 당신은 이제 안다.",
    choices: [
      { text: "봉인석을 해제한다", goto: "ending_truth",
        require: { keyword: "봉인 해제 지식" } },
      { text: "좌표만 기록하고 기지에 보고한다", goto: "ending_report" }
    ]
  },

  ending_truth: {
    tag: "ENDING · 진실",
    text: () => `당신은 봉인 해제 지식을 사용해 봉인석을 연다.\n\n안에서 드러난 것은 재앙의 근원이 아니라, 그것을 억누르고 있던 '경고'였다. 이 세계는 재앙의 원인이 아니라 재앙을 막던 최전선이었다.\n\n시빌에게 진실을 전송한다. 심연 기지의 다음 임무 방향이 이 순간부터 바뀐다.\n\n최종 스탯 — ${statSummary()}`,
    choices: [ { text: "새로운 정신체로 다시 시작한다", goto: "restart" } ]
  },

  ending_report: {
    tag: "ENDING · 임무 완수",
    text: () => `당신은 성급히 봉인을 건드리지 않고, 좌표와 기록만을 남긴 채 철수한다.\n\n시빌은 임무를 '완료'로 표시한다. 진실은 여전히 봉인석 아래 잠들어 있다.\n\n최종 스탯 — ${statSummary()}`,
    choices: [ { text: "새로운 정신체로 다시 시작한다", goto: "restart" } ]
  }
};