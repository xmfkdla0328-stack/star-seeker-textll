import { navigateTo } from '../router.js';
import { applyMenuOnboarding } from './onboardingView.js';
import { isOnboardingActive } from '../onboarding/onboardingFlow.js';

export function renderMenuScreen() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="titlebar">
      <div class="eyebrow">DEEP SPACE ANOMALY RESPONSE</div>
      <h1>Star-Seeker</h1>
    </div>
    <div class="menu-grid">
      
      <div class="glass menu-card" id="btnMission">
        <div class="menu-btn-title">임무 개시</div>
        <div class="menu-btn-subtitle">Mission Start</div>
        <div class="menu-btn-desc">지정된 이상 징후 행성으로 정신체를 파견하여 스토리 컨텐츠를 진행합니다.</div>
        <img src="images/mission_start.png" class="menu-icon" alt="Mission Start">
      </div>

      <div class="glass menu-card" id="btnArchive" style="opacity: 0.6; cursor: not-allowed;">
        <div class="menu-btn-title">아카이브</div>
        <div class="menu-btn-subtitle">Archive</div>
        <div class="menu-btn-desc">[기록 락 해제 대기 중] 획득한 키워드, 스토리 중 조우한 인물 정보 일람.</div>
        <img src="images/archive.png" class="menu-icon" alt="Archive">
      </div>

      <div class="glass menu-card" id="btnWaiting" style="opacity: 0.6; cursor: not-allowed;">
        <div class="menu-btn-title">대기실</div>
        <div class="menu-btn-subtitle">Waiting Room</div>
        <div class="menu-btn-desc">[동기화 장치 준비 중] 조력자를 세팅하여 고유 키워드 및 스탯 보너스를 얻습니다.</div>
        <img src="images/waiting.png" class="menu-icon" alt="Waiting Room">
      </div>

    </div>
    <div class="footer-note" style="margin-top: 24px;">정신체 파견 시스템 · 메인 터미널</div>
  `;

  document.getElementById("btnMission").onclick = () => navigateTo('chapter');
  document.getElementById("btnArchive").onclick = () => alert("아카이브 컴포넌트는 추후 데이터 보안 해제 후 업데이트 예정입니다.");
  document.getElementById("btnWaiting").onclick = () => alert("대기실 컴포넌트는 인물 동기화 장치 구현 후 업데이트 예정입니다.");

  if (isOnboardingActive()) {
    applyMenuOnboarding(navigateTo);
  }
}