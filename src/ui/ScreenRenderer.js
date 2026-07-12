/**
 * 게임의 상태 데이터와 스토리 텍스트를 DOM에 주입하고 제어하는 UI 전담 클래스입니다.
 */
export class ScreenRenderer {
    constructor(elements) {
      this.elements = elements; 
    }
  
    // 상단 스탯 표시줄 바인딩 및 업데이트
    renderStats(stateSnapshot) {
      if (this.elements.health) {
        this.elements.health.textContent = `${stateSnapshot.health}%`;
        if (stateSnapshot.health <= 20) {
          this.elements.health.className = "text-red-500 font-bold animate-pulse";
        } else {
          this.elements.health.className = "text-emerald-400 font-bold";
        }
      }
      if (this.elements.fuel) this.elements.fuel.textContent = stateSnapshot.fuel;
      if (this.elements.credits) this.elements.credits.textContent = `${stateSnapshot.credits}G`;
  
      // 획득한 키워드 리스트 렌더링
      if (this.elements.keywords) {
        this.elements.keywords.innerHTML = "";
        if (stateSnapshot.keywords.length === 0) {
          this.elements.keywords.innerHTML = `<span class="text-slate-500 text-sm">획득한 주요 단서 없음</span>`;
        } else {
          stateSnapshot.keywords.forEach(keywordName => {
            const badge = document.createElement("span");
            badge.className = "bg-amber-950/50 border border-amber-600/50 text-amber-300 px-2 py-1 rounded text-xs font-mono shadow-sm";
            badge.textContent = `🔑 ${keywordName}`;
            this.elements.keywords.appendChild(badge);
          });
        }
      }
    }
  
    // 메인 텍스트 로그 및 선택지 목록 렌더링
    renderStory(parsedNode, onChoiceSelected) {
      // 1. 타이틀 및 메인 대사 연출
      if (this.elements.title) this.elements.title.textContent = parsedNode.title;
      if (this.elements.text) {
        this.elements.text.innerHTML = parsedNode.text;
      }
  
      // 2. 선택지 버튼 리스트 구축
      if (this.elements.choices) {
        this.elements.choices.innerHTML = "";
        
        parsedNode.choices.forEach((choice, index) => {
          const button = document.createElement("button");
          
          if (choice.isLocked) {
            button.className = "w-full text-left p-3 rounded bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed opacity-60";
            button.innerHTML = `<span class="text-red-500 mr-2">[잠김]</span> ${choice.text} <span class="text-xs text-slate-600">(필요한 단서가 부족합니다)</span>`;
            button.disabled = true;
          } else {
            button.className = "w-full text-left p-3 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-amber-500 text-slate-100 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500";
            button.innerHTML = `<span class="text-amber-500 font-mono mr-2">${index + 1}.</span> ${choice.text}`;
            
            // 클릭 이벤트 전달
            button.addEventListener("click", () => {
              onChoiceSelected(choice);
            });
          }
          
          this.elements.choices.appendChild(button);
        });
      }
    }
  }
  