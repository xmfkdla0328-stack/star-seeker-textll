import { resetState, restoreState, state } from '../state.js';
import { navigateTo } from '../router.js';
import { renderNode } from './storyPanel.js';
import { getActiveSave, isTutorialCompleted } from '../storage.js';

export function setupGameplayLayout({ mode = 'new' } = {}) {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="titlebar">
      <div class="eyebrow">DEEP SPACE ANOMALY RESPONSE</div>
      <h1>Star-Seeker</h1>
    </div>

    <div class="glass status-panel">
      <div class="stat-row" id="statRow"></div>
      <div class="keyword-row" id="keywordRow"></div>
    </div>

    <div class="glass scene-panel is-empty" id="scenePanel">
      <div class="scene-frame">
        <img class="scene-img" id="sceneImg" src="" alt="">
        <div class="scene-glass"></div>
        <div class="scene-hover">
          <div class="scene-caption" id="sceneCaption"></div>
        </div>
      </div>
    </div>

    <div class="glass story-panel" id="storyPanel"></div>

    <div style="text-align: center; margin-top: 4px;">
      <button class="restart-btn" id="btnBackToChapter">이전 화면으로</button>
    </div>

    <div class="footer-note" style="margin-top: 12px;">정신체 파견 시스템 · 키워드와 스탯이 선택지의 가능성을 결정합니다</div>
  `;

  document.getElementById("btnBackToChapter").onclick = () => {
    resetState();
    navigateTo('chapter');
  };

  if (mode === 'resume') {
    const saved = getActiveSave();
    if (saved && restoreState(saved)) {
      renderNode(state.currentNode, { skipOnEnter: true });
      return;
    }
  }

  resetState();
  renderNode(isTutorialCompleted() ? "origin" : "tutorial_awareness");
}
