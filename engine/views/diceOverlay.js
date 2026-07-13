import { state } from '../state.js';

export function runDiceCheck(check, onComplete) {
  const overlay = document.getElementById("diceOverlay");
  overlay.style.display = "flex";
  overlay.className = "dice-overlay";

  const mod = state.stats[check.stat] || 0;
  const roll = Math.floor(Math.random() * 6) + 1;
  const total = roll + mod;
  const success = total >= check.dc;

  overlay.innerHTML = `
    <div class="dice-card">
      <div class="dtitle">DICE CHECK · ${check.stat}</div>
      <div class="die">${roll}</div>
      <div class="dice-detail">주사위 ${roll} + ${check.stat} 보정 ${mod} = <b>${total}</b><br>목표 수치(DC): ${check.dc}</div>
      <div class="dice-result ${success ? 'success' : 'fail'}">${success ? 'SUCCESS' : 'FAIL'}</div>
      <button class="dice-continue" id="diceContinue">계속</button>
    </div>
  `;

  document.getElementById("diceContinue").onclick = () => {
    overlay.style.display = "none";
    if (success && check.onSuccess) check.onSuccess();
    onComplete(success ? check.success : check.fail);
  };
}
