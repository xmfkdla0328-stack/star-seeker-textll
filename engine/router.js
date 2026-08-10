import { renderTitleScreen } from './views/titleView.js';
import { renderMenuScreen } from './views/menuView.js';
import { renderChapterScreen } from './views/chapterView.js';
import { setupGameplayLayout } from './views/gameView.js';

export function navigateTo(screen, options = {}) {
  const app = document.getElementById("app");
  if (!app) return;

  // 화면이 바뀔 때마다 중심 박스의 스타일 클래스를 기본값으로 초기화합니다.
  app.className = "app";

  switch (screen) {
    case 'title':
      renderTitleScreen();
      break;
    case 'menu':
      renderMenuScreen();
      break;
    case 'chapter':
      renderChapterScreen();
      break;
    case 'game':
      setupGameplayLayout(options);
      break;
  }
}