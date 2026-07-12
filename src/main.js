import { prologueData } from './data/stories/prologue.js';
import { keywordsData } from './data/keywords.js';
import { GameState } from './engine/GameState.js';
import { StoryEngine } from './engine/StoryEngine.js';
import { ScreenRenderer } from './ui/ScreenRenderer.js';

class GameController {
  async init() {
    try {
      const elements = {
        title: document.getElementById("story-title"),
        text: document.getElementById("story-text"),
        choices: document.getElementById("choice-container"),
        health: document.getElementById("stat-health"),
        fuel: document.getElementById("stat-fuel"),
        credits: document.getElementById("stat-credits"),
        keywords: document.getElementById("keyword-list")
      };

      this.state = new GameState();
      this.renderer = new ScreenRenderer(elements);
      this.engine = new StoryEngine(prologueData, keywordsData, this.state);

      this.state.subscribe((snapshot) => this.renderer.renderStats(snapshot));

      this.state.notify(); 
      const startNode = this.engine.start();
      this.updateView(startNode);

    } catch (error) {
      console.error("초기화 중 치명적인 에러 발생:", error);
      document.body.innerHTML = `
        <div class="flex flex-col items-center justify-center h-screen bg-slate-950 text-slate-100 p-6">
          <h1 class="text-2xl font-bold text-red-500 mb-2">통신 두절</h1>
          <p class="text-slate-400">데이터를 정상적으로 로드할 수 없거나 모듈 경로 에러가 발생했습니다.</p>
          <code class="mt-4 bg-slate-900 p-2 rounded text-xs text-slate-300 font-mono">${error.message}</code>
        </div>
      `;
    }
  }

  updateView(node) {
    if (!node) return;
    
    this.renderer.renderStory(node, (selectedChoice) => {
      const nextNode = this.engine.selectChoice(selectedChoice);
      this.updateView(nextNode);
    });
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const controller = new GameController();
  controller.init();
});