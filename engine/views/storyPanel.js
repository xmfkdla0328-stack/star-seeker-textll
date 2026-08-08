import { STORY } from '../../story/storyHub.js';
import { state, resetState, hasKeyword } from '../state.js';
import { renderStats, renderKeywords } from './statPanel.js';
import { renderScene } from './scenePanel.js';
import { runDiceCheck } from './diceOverlay.js';
import { setupGameplayLayout } from './gameView.js';
import { showPopup } from './tutorialPopup.js';
import { hidePopup } from './tutorialPopup.js';
import { isTutorialCompleted, saveActiveGame } from '../storage.js';

export function renderNode(id, { skipOnEnter = false } = {}) {
  hidePopup();

  if (id === "restart") {
    resetState();
    setupGameplayLayout();
    return;
  }

  const node = STORY[id];
  if (!node) {
    console.error(`스토리 노드를 찾을 수 없습니다: ${id}`);
    return;
  }

  state.currentNode = id;
  if (!skipOnEnter && node.onEnter) node.onEnter();

  renderStats();
  renderKeywords();
  renderScene(node);

  const panel = document.getElementById("storyPanel");
  const text = typeof node.text === "function" ? node.text() : node.text;

  panel.innerHTML = `
    <div class="story-tag">${node.tag}</div>
    <div class="story-text">${text}</div>
    <div class="choices" id="choicesBox"></div>
  `;

  if (node.tutorial && !isTutorialCompleted()) {
    requestAnimationFrame(() => showPopup(node.tutorial));
  }

  const box = document.getElementById("choicesBox");
  node.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";

    let locked = false;
    if (choice.require && choice.require.keyword && !hasKeyword(choice.require.keyword)) {
      locked = true;
    }

    btn.innerHTML = choice.text +
      (choice.require
        ? `<span class="choice-req ${locked ? 'missing' : ''}">${locked ? '🔒 필요 키워드: ' : '✔ 보유 키워드: '}${choice.require.keyword}</span>`
        : "");

    if (locked) {
      btn.disabled = true;
    } else {
      btn.onclick = () => handleChoice(choice);
    }
    box.appendChild(btn);
  });

  if (!node.tutorial && isTutorialCompleted()) {
    saveActiveGame({
      chapterId: 'prologue',
      currentNode: state.currentNode,
      stats: { ...state.stats },
      keywords: [...state.keywords],
    });
  }
}

function handleChoice(choice) {
  if (choice.onSelect) choice.onSelect();

  if (choice.diceCheck) {
    runDiceCheck(choice.diceCheck, renderNode);
    return;
  }
  renderNode(choice.goto);
}
