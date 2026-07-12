import { GameState } from './engine/GameState.js';
import { StoryEngine } from './engine/StoryEngine.js';
import { ScreenRenderer } from './ui/ScreenRenderer.js';

// 게임의 전체 라이프사이클을 매니징하는 메인 컨트롤러 클래스
class GameController {
  async init() {
    try {
      // 1. 서버로부터 순수 스토리 데이터와 키워드 정보를 비동기 로드
      const [storyRes, keywordsRes] = await Promise.all([
        fetch('./src/data/stories/prologue.json'),
        fetch('./src/data/keywords.json')
      ]);

      if (!storyRes.ok || !keywordsRes.ok) {
        throw new Error("게임 리소스 파일을 로드하지 못했습니다.");
      }

      const storyData = await storyRes.json();
      const keywordsData = await keywordsRes.json();

      // 2. DOM 요소 매핑 및 탐색
      const elements = {
        title: document.getElementById("story-title"),
        text: document.getElementById("story-text"),
        choices: document.getElementById("choice-container"),
        health: document.getElementById("stat-health"),
        fuel: document.getElementById("stat-fuel"),
        credits: document.getElementById("stat-credits"),
        keywords: document.getElementById("keyword-list")
      };

      // 3. 각 모듈 인스턴스 생성 및 연계
      this.state = new GameState();
      this.renderer = new ScreenRenderer(elements);
      this.engine = new StoryEngine(storyData, keywordsData, this.state);

      // 4. 이벤트 및 리스너 연결
      this.state.subscribe((snapshot) => this.renderer.renderStats(snapshot));

      // 5. 첫 로딩 및 초기 렌더링 개시
      this.state.notify(); // 초기 스탯 표시
      const startNode = this.engine.start();
      this.updateView(startNode);

    } catch (error) {
      console.error("초기화 중 치명적인 에러 발생:", error);
      document.body.innerHTML = `
        <div class="flex flex-col items-center justify-center h-screen bg-slate-950 text-slate-100 p-6">
          <h1 class="text-2xl font-bold text-red-500 mb-2">통신 두절</h1>
          <p class="text-slate-400">데이터를 정상적으로 파싱할 수 없거나 서버가 실행되지 않았습니다.</p>
          <code class="mt-4 bg-slate-900 p-2 rounded text-xs text-slate-300 font-mono">${error.message}</code>
        </div>
      `;
    }
  }

  // 선택지 변경에 맞춰 뷰 레이어를 재렌더링
  updateView(node) {
    if (!node) return;
    
    this.renderer.renderStory(node, (selectedChoice) => {
      const nextNode = this.engine.selectChoice(selectedChoice);
      this.updateView(nextNode);
    });
  }
}

// 브라우저 돔 로드 완료 시 부트스트랩 작동
window.addEventListener("DOMContentLoaded", () => {
  const controller = new GameController();
  controller.init();
});