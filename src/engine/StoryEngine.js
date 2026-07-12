/**
 * JSON 스토리 데이터를 기반으로 다음 시나리오 진행 및 분기를 처리하는 엔진 클래스입니다.
 */
export class StoryEngine {
    constructor(storyData, keywordsData, gameState) {
      this.story = storyData;       // 로드된 스토리 JSON 데이터
      this.keywords = keywordsData; // 로드된 전역 키워드 사전
      this.state = gameState;       // GameState 인스턴스
      this.currentNode = null;
    }
  
    // 스토리 시작 노드 설정 및 로드
    start() {
      const startNodeId = this.story.startNode || Object.keys(this.story.nodes)[0];
      return this.loadNode(startNodeId);
    }
  
    // 특정 ID의 노드로 이동
    loadNode(nodeId) {
      const node = this.story.nodes[nodeId];
      if (!node) {
        console.error(`노드를 찾을 수 없습니다: ${nodeId}`);
        return null;
      }
      this.currentNode = node;
      this.currentNodeId = nodeId;
      return this.parseNodeText(node);
    }
  
    // 텍스트 분석 및 키워드 하이라이팅 마크업 변환
    parseNodeText(node) {
      let parsedText = node.text;
  
      // [키워드_이름] 형태의 텍스트를 감지하여 강조 HTML 태그로 자동 치환
      const keywordRegex = /\[(.*?)\]/g;
      parsedText = parsedText.replace(keywordRegex, (match, keywordName) => {
        // JSON 내 매칭되는 실제 키워드 ID 찾기
        const matchedKey = Object.keys(this.keywords).find(
          key => this.keywords[key].name === keywordName.replace('_', ' ')
        );
        
        if (matchedKey) {
          return `<span class="keyword-highlight border-b-2 border-amber-400 text-amber-300 font-semibold cursor-pointer relative group" data-keyword-id="${matchedKey}">${match}<span class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-slate-800 text-slate-100 text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-slate-700 shadow-lg">${this.keywords[matchedKey].description}</span></span>`;
        }
        return `<span class="text-amber-200 font-medium">${match}</span>`;
      });
  
      return {
        title: node.title,
        text: parsedText,
        choices: this.getAvailableChoices(node)
      };
    }
  
    // 조건(잠금 키워드) 충족 여부를 확인하여 선택지 목록 반환
    getAvailableChoices(node) {
      if (!node.choices) return [];
  
      return node.choices.map(choice => {
        let isLocked = false;
        
        // 만약 특정 키워드가 필요한 선택지라면
        if (choice.requiredKeywords && choice.requiredKeywords.length > 0) {
          isLocked = choice.requiredKeywords.some(kw => !this.state.hasKeyword(kw));
        }
  
        return {
          ...choice,
          isLocked
        };
      });
    }
  
    // 플레이어가 선택지를 눌렀을 때의 효과 반영 및 노드 전환 수행
    selectChoice(choice) {
      if (choice.isLocked) return null;
  
      const effects = choice.effects;
      if (effects) {
        if (effects.reset) {
          this.state.reset();
          return this.start();
        }
        if (effects.health) this.state.updateHealth(effects.health);
        if (effects.fuel) this.state.updateFuel(effects.fuel);
        if (effects.credits) this.state.updateCredits(effects.credits);
        if (effects.addKeyword) this.state.acquireKeyword(effects.addKeyword);
      }
  
      return this.loadNode(choice.nextNode);
    }
  }
  