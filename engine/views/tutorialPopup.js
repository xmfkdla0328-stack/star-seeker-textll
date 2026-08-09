const ANCHOR_IDS = {
  choices:  'choicesBox',
  keywords: 'keywordRow',
  mission:  'btnMission',
  chapter0: 'chap0',
};

let activePopup = null;
let activeCharacterPopup = null;

export function showPopup({ scripts, anchor = 'center', onClose } = {}) {
  hidePopup();
  let current = 0;
  const total = scripts.length;

  const popup = document.createElement('div');
  popup.className = 'tutorial-popup';

  const render = () => {
    const isLast = current === total - 1;

    let dotsHtml = '';
    if (total > 1) {
      dotsHtml = `<div class="tp-dots">${
        Array.from({ length: total }, (_, i) =>
          `<div class="tp-dot${i === current ? ' tp-dot-active' : ''}"></div>`
        ).join('')
      }</div>`;
    }

    popup.innerHTML = `
      <div class="tp-label">SYSTEM NOTICE</div>
      <div class="tp-text">${scripts[current]}</div>
      ${dotsHtml}
      <div class="tp-hint">${isLast ? '클릭하여 닫기' : '클릭하여 계속 ›'}</div>
    `;
  };

  popup.onclick = (e) => {
    e.stopPropagation();
    current++;
    if (current >= total) {
      popup.remove();
      activePopup = null;
      onClose?.();
    } else {
      popup.style.animation = 'none';
      render();
      positionPopup(popup, anchor);
    }
  };

  render();
  document.body.appendChild(popup);
  activePopup = popup;

  // 위치 계산은 DOM paint 이후에 실행
  requestAnimationFrame(() => positionPopup(popup, anchor));
}

export function showCharacterPopup({ character, scripts, onClose } = {}) {
  hideCharacterPopup();
  let current = 0;
  const total = scripts.length;

  const popup = document.createElement('div');
  popup.className = 'character-popup';

  const render = () => {
    const isLast = current === total - 1;

    let dotsHtml = '';
    if (total > 1) {
      dotsHtml = `<div class="tp-dots">${
        Array.from({ length: total }, (_, i) =>
          `<div class="tp-dot${i === current ? ' tp-dot-active' : ''}"></div>`
        ).join('')
      }</div>`;
    }

    popup.innerHTML = `
      <div class="cp-header">
        <img class="cp-portrait" src="${character.image}" alt="${character.name}">
        <div class="cp-name">${character.name}</div>
      </div>
      <div class="cp-text">${scripts[current]}</div>
      ${dotsHtml}
      <div class="tp-hint">${isLast ? '클릭하여 닫기' : '클릭하여 계속 ›'}</div>
    `;
  };

  popup.onclick = (e) => {
    e.stopPropagation();
    current++;
    if (current >= total) {
      popup.remove();
      activeCharacterPopup = null;
      onClose?.();
    } else {
      render();
    }
  };

  render();
  document.body.appendChild(popup);
  activeCharacterPopup = popup;
}

export function hidePopup() {
  activePopup?.remove();
  activePopup = null;
}

export function hideCharacterPopup() {
  activeCharacterPopup?.remove();
  activeCharacterPopup = null;
}

function positionPopup(popup, anchor) {
  if (anchor === 'center') {
    popup.classList.add('tp-center');
    return;
  }

  const anchorId = ANCHOR_IDS[anchor];
  const el = anchorId ? document.getElementById(anchorId) : null;

  if (!el) {
    popup.classList.add('tp-center');
    return;
  }

  const rect    = el.getBoundingClientRect();
  const pw      = popup.offsetWidth  || 224;
  const ph      = popup.offsetHeight || 120;
  const vw      = window.innerWidth;
  const vh      = window.innerHeight;
  const GAP     = 12;

  // 우측에 여백이 충분한지 확인
  const fitRight = rect.right + GAP + pw <= vw - 8;

  if (fitRight) {
    // 앵커 오른쪽에 배치, 앵커 상단 정렬
    let top = rect.top;
    if (top + ph > vh - 8) top = vh - ph - 8;
    popup.style.top  = `${top}px`;
    popup.style.left = `${rect.right + GAP}px`;
  } else {
    // 앵커 아래에 배치
    let left = rect.left;
    if (left + pw > vw - 8) left = vw - pw - 8;
    let top = rect.bottom + GAP;
    if (top + ph > vh - 8) top = rect.top - ph - GAP;
    popup.style.top  = `${top}px`;
    popup.style.left = `${left}px`;
  }
}
