export { KEYWORD_DATA } from './data/keywords.js';

export const STAT_KEYS = ["체력","솜씨","지력","매력","직감"];

export const ORIGINS = {
  combat:   { label:"전투 계열 — 강습형 정신체", stats:{체력:2, 솜씨:1}, keyword:"군사 훈련" },
  research: { label:"연구 계열 — 분석형 정신체", stats:{지력:2, 직감:1}, keyword:"고대어 연구" },
  diplomat: { label:"외교 계열 — 교섭형 정신체", stats:{매력:2, 직감:1}, keyword:"사교계 인맥" },
};
