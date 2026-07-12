export class GameState {
    constructor() {
      this.health = 100;
      this.fuel = 5;
      this.credits = 50;
      this.acquiredKeywords = new Set();
      this.listeners = [];
    }
  
    reset() {
      this.health = 100;
      this.fuel = 5;
      this.credits = 50;
      this.acquiredKeywords.clear();
      this.notify();
    }
  
    subscribe(listener) {
      this.listeners.push(listener);
    }
  
    notify() {
      this.listeners.forEach(listener => listener(this.getSnapshot()));
    }
  
    getSnapshot() {
      return {
        health: this.health,
        fuel: this.fuel,
        credits: this.credits,
        keywords: Array.from(this.acquiredKeywords)
      };
    }
  
    updateHealth(amount) {
      this.health = Math.max(0, Math.min(100, this.health + amount));
      this.notify();
    }
  
    updateFuel(amount) {
      this.fuel = Math.max(0, this.fuel + amount);
      this.notify();
    }
  
    updateCredits(amount) {
      this.credits = Math.max(0, this.credits + amount);
      this.notify();
    }
  
    acquireKeyword(keywordId) {
      if (!this.acquiredKeywords.has(keywordId)) {
        this.acquiredKeywords.add(keywordId);
        this.notify();
        return true;
      }
      return false;
    }
  
    hasKeyword(keywordId) {
      return this.acquiredKeywords.has(keywordId);
    }
  }