/**
 * 플레이어의 실시간 상태 및 획득한 키워드 등을 관리하는 클래스입니다.
 */
export class GameState {
    constructor() {
      this.health = 100;
      this.fuel = 5;
      this.credits = 50;
      this.acquiredKeywords = new Set(); // 중복 방지를 위한 Set 사용
      this.listeners = []; // 상태 변경 감지용 리스너 목록
    }
  
    // 초기 상태로 리셋
    reset() {
      this.health = 100;
      this.fuel = 5;
      this.credits = 50;
      this.acquiredKeywords.clear();
      this.notify();
    }
  
    // 상태 변화 구독 기능 (UI 업데이트 연동용)
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
  
    // 상태 변경 헬퍼 메서드들
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
        return true; // 새로 획득함
      }
      return false; // 이미 보유 중
    }
  
    hasKeyword(keywordId) {
      return this.acquiredKeywords.has(keywordId);
    }
  }
  