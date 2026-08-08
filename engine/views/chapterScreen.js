import { navigateTo } from '../router.js';

export function renderChapterScreen() {
  const app = document.getElementById("app");
  
  app.innerHTML = `
    <div class="titlebar">
      <div class="eyebrow">OPERATIONAL AREA SELECTION</div>
      <h1>작전 구역 선택</h1>
    </div>
    <div class="chapter-list">
      <div class="glass chapter-card" id="chap0">
        <div class="story-tag" style="margin-bottom: 10px;">CHAPTER 00</div>
        <div class="chap-title">케일런-9</div>
        <div class="chap-desc">생명체를 찾아보기 힘든, 산소가 희박한 행성입니다.</div>
        <img src="images/chapter00.png" class="chap-icon" alt="Chapter 00 Icon">
      </div>
      
      <div class="glass chapter-card" style="opacity: 0.45; cursor: not-allowed;">
        <div class="story-tag" style="margin-bottom: 10px; color: #8098b8;">CHAPTER 01</div>
        <div class="chap-title" style="color: #8098b8;">잠겨진 성궤</div>
        <div class="chap-desc" style="color: #8098b8;">심연 기지 차단 구역 해제 및<br>프롤로그 완수 후 개방됩니다.</div>
      </div>
    </div>
    <div style="text-align: center; margin-top: 20px;">
      <button class="restart-btn" id="btnBackToMenu">이전 화면으로</button>
    </div>
    <div class="footer-note" style="margin-top: 16px;">파견을 원하는 구역의 유리 패널을 활성화하십시오.</div>
  `;

  document.getElementById("chap0").onclick = () => {
    navigateTo('game', { mode: 'new' });
  };
  
  document.getElementById("btnBackToMenu").onclick = () => navigateTo('menu');
}