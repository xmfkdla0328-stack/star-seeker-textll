export function renderScene(node) {
  const panel = document.getElementById("scenePanel");
  const img = document.getElementById("sceneImg");
  const caption = document.getElementById("sceneCaption");
  if (!panel || !img || !caption) return;

  if (!node.bg) {
    panel.classList.add("is-empty");
    img.removeAttribute("src");
    caption.textContent = "";
    return;
  }

  panel.classList.remove("is-empty");
  img.src = node.bg;
  img.alt = node.bgCaption || node.tag || "";
  caption.textContent = node.bgCaption || "";
}
