/** Navigation interaction. No server-side data submission. */
const menu = document.querySelector<HTMLButtonElement>(".menu-toggle");
menu?.addEventListener("click", () => {
  const expanded = menu.getAttribute("aria-expanded") === "true";
  menu.setAttribute("aria-expanded", String(!expanded));
  document.querySelector("#navigation")?.classList.toggle("open", !expanded);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    menu?.setAttribute("aria-expanded", "false");
    document.querySelector("#navigation")?.classList.remove("open");
  }
});

export {};
