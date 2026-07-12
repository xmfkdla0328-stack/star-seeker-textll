export class ScreenRenderer {
    constructor(elements) {
      this.elements = elements; 
    }
  
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
  
    renderStory(parsedNode, onChoiceSelected) {
      if (this.elements.title) this.elements.title.textContent = parsedNode.title;
      if (this.elements.text) {
        this.elements.text.innerHTML = parsedNode.text;
      }
  
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
            
            button.addEventListener("click", () => {
              onChoiceSelected(choice);
            });
          }
          
          this.elements.choices.appendChild(button);
        });
      }
    }
  }