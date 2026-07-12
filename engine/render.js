import { STAT_KEYS } from '../story/constants.js';
import { STORY } from '../story/storyHub.js';
import { state, resetState, hasKeyword } from './state.js';

export function renderStats(){
  const row = document.getElementById("statRow");
  row.innerHTML = "";
  STAT_KEYS.forEach(k => {
    const chip = document.createElement("div");
    chip.className = "stat-chip";
    chip.innerHTML = `<div class="label">${k}</div><div class="value">${state.stats[k]}</div>`;
    row.appendChild(chip);
  });
}

export function renderKeywords(){
  const row = document.getElementById("keywordRow");
  row.innerHTML = `<span class="kw-label">키워드</span>`;
  if(state.keywords.size === 0){
    row.innerHTML += `<span class="kw-empty">없음</span>`;
    return;
  }
  state.keywords.forEach(kw => {
    const tag = document.createElement("span");
    tag.className = "kw-tag";
    tag.textContent = kw;
    row.appendChild(tag);
  });
}

export function renderNode(id){
  if(id === "restart"){
    resetState();
    renderNode("origin");
    return;
  }

  const node = STORY[id];
  state.currentNode = id;
  if(node.onEnter) node.onEnter();

  renderStats();
  renderKeywords();

  const panel = document.getElementById("storyPanel");
  const text = typeof node.text === "function" ? node.text() : node.text;

  panel.innerHTML = `
    <div class="story-tag">${node.tag}</div>
    <div class="story-text">${text}</div>
    <div class="choices" id="choicesBox"></div>
  `;

  const box = document.getElementById("choicesBox");
  node.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";

    let locked = false;
    if(choice.require && choice.require.keyword && !hasKeyword(choice.require.keyword)){
      locked = true;
    }

    btn.innerHTML = choice.text +
      (choice.require ? `<span class="choice-req ${locked ? 'missing':''}">${locked ? '🔒 필요 키워드: ' : '✔ 보유 키워드: '}${choice.require.keyword}</span>` : "");

    if(locked){
      btn.disabled = true;
    } else {
      btn.onclick = () => handleChoice(choice);
    }
    box.appendChild(btn);
  });
}

function handleChoice(choice){
  if(choice.onSelect) choice.onSelect();

  if(choice.diceCheck){
    runDiceCheck(choice.diceCheck);
    return;
  }
  renderNode(choice.goto);
}

function runDiceCheck(check){
  const overlay = document.getElementById("diceOverlay");
  overlay.style.display = "flex";
  overlay.className = "dice-overlay";

  const mod = state.stats[check.stat] || 0;
  const roll = Math.floor(Math.random()*6) + 1; // d6
  const total = roll + mod;
  const success = total >= check.dc;

  overlay.innerHTML = `
    <div class="dice-card">
      <div class="dtitle">DICE CHECK · ${check.stat}</div>
      <div class="die">${roll}</div>
      <div class="dice-detail">주사위 ${roll} + ${check.stat} 보정 ${mod} = <b>${total}</b><br>목표 수치(DC): ${check.dc}</div>
      <div class="dice-result ${success ? 'success':'fail'}">${success ? 'SUCCESS' : 'FAIL'}</div>
      <button class="dice-continue" id="diceContinue">계속</button>
    </div>
  `;

  document.getElementById("diceContinue").onclick = () => {
    overlay.style.display = "none";
    if(success && check.onSuccess) check.onSuccess();
    renderNode(success ? check.success : check.fail);
  };
}