export class StoryEngine {
    constructor(storyData, keywordsData, gameState) {
      this.story = storyData;       
      this.keywords = keywordsData; 
      this.state = gameState;       
      this.currentNode = null;
    }
  
    start() {
      const startNodeId = this.story.startNode || Object.keys(this.story.nodes)[0];
      return this.loadNode(startNodeId);
    }
  
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
  
    parseNodeText(node) {
      let parsedText = node.text;
  
      const keywordRegex = /\[(.*?)\]/g;
      parsedText = parsedText.replace(keywordRegex, (match, keywordName) => {
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
  
    getAvailableChoices(node) {
      if (!node.choices) return [];
  
      return node.choices.map(choice => {
        let isLocked = false;
        
        if (choice.requiredKeywords && choice.requiredKeywords.length > 0) {
          isLocked = choice.requiredKeywords.some(kw => !this.state.hasKeyword(kw));
        }
  
        return {
          ...choice,
          isLocked
        };
      });
    }
  
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