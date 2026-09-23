/** Card tilt interaction. No server-side data submission. */
if (
  matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)")
    .matches
) {
  document.querySelectorAll<HTMLElement>("[data-tilt]").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const box = card.getBoundingClientRect();
      const x = (e.clientX - box.left) / box.width - 0.5;
      const y = (e.clientY - box.top) / box.height - 0.5;
      card.style.transform = `perspective(1000px) rotateX(${-y * 9}deg) rotateY(${x * 12}deg) rotate(-10deg)`;
    });
    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}

export {};
