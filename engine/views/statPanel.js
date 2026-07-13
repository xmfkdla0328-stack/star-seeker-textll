import { STAT_KEYS, KEYWORD_DATA } from '../../story/constants.js';
import { state } from '../state.js';

export function renderStats() {
  const row = document.getElementById("statRow");
  if (!row) return;
  row.innerHTML = "";
  STAT_KEYS.forEach(k => {
    const chip = document.createElement("div");
    chip.className = "stat-chip";
    chip.innerHTML = `<div class="label">${k}</div><div class="value">${state.stats[k]}</div>`;
    row.appendChild(chip);
  });
}

export function renderKeywords() {
  const row = document.getElementById("keywordRow");
  if (!row) return;
  row.innerHTML = `<span class="kw-label">키워드</span>`;
  if (state.keywords.size === 0) {
    row.innerHTML += `<span class="kw-empty">없음</span>`;
    return;
  }
  state.keywords.forEach(kw => {
    const tag = document.createElement("span");
    tag.className = "kw-tag";
    tag.textContent = kw;
    const desc = KEYWORD_DATA[kw];
    if (desc) tag.dataset.tooltip = desc;
    row.appendChild(tag);
  });
}
