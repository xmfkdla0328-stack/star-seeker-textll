let activeDialog = null;

export function showResumeDialog({ onResume, onNewGame }) {
  closeResumeDialog();

  const backdrop = document.createElement('div');
  backdrop.className = 'resume-dialog-backdrop';
  backdrop.innerHTML = `
    <section class="resume-dialog" role="dialog" aria-modal="true" aria-labelledby="resumeDialogTitle">
      <div class="tp-label">SYSTEM NOTICE</div>
      <h2 id="resumeDialogTitle">진행 중인 기록을 확인했습니다</h2>
      <p>진행 중이었던 챕터에서부터 계속 이어 하시겠습니까?</p>
      <div class="resume-dialog-actions">
        <button class="choice-btn resume-btn-primary" type="button" data-resume>예, 이어하기</button>
        <button class="restart-btn" type="button" data-new-game>아니요, 콘텐츠 선택</button>
      </div>
    </section>
  `;

  backdrop.querySelector('[data-resume]').onclick = () => {
    closeResumeDialog();
    onResume();
  };
  backdrop.querySelector('[data-new-game]').onclick = () => {
    closeResumeDialog();
    onNewGame();
  };

  document.body.appendChild(backdrop);
  activeDialog = backdrop;
}

export function closeResumeDialog() {
  activeDialog?.remove();
  activeDialog = null;
}