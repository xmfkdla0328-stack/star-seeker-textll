import { STAT_KEYS, ORIGINS } from '../story/constants.js';

export let state = {
  stats: {체력:1, 솜씨:1, 지력:1, 매력:1, 직감:1},
  keywords: new Set(),
  currentNode: "origin"
};

export function resetState() {
  state.stats = {체력:1, 솜씨:1, 지력:1, 매력:1, 직감:1};
  state.keywords = new Set();
  state.currentNode = "origin";
}

export function addStat(key, val){
  state.stats[key] = (state.stats[key]||0) + val;
  if(state.stats[key] < 0) state.stats[key] = 0;
}

export function addKeyword(kw){ 
  state.keywords.add(kw); 
}

export function hasKeyword(kw){ 
  return state.keywords.has(kw); 
}

export function statSummary(){
  return STAT_KEYS.map(k => `${k} ${state.stats[k]}`).join(" · ");
}

export function applyOrigin(key){
  const o = ORIGINS[key];
  Object.entries(o.stats).forEach(([k,v]) => addStat(k, v));
  addKeyword(o.keyword);
}