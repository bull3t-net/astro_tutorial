/** Card preview interaction. No server-side data submission. */
for (const [input, output, fallback] of [
  ["card-name", "preview-name", "Make it personal."],
  ["card-brand", "preview-brand", "YOUR BRAND"],
])
  document.getElementById(input)?.addEventListener("input", (e) => {
    document.getElementById(output)!.textContent =
      (e.target as HTMLInputElement).value.trim() || fallback;
  });
document.querySelectorAll<HTMLButtonElement>("[data-theme]").forEach((button) =>
  button.addEventListener("click", () => {
    document
      .querySelectorAll("[data-theme]")
      .forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
    document
      .querySelector("#preview-card")
      ?.setAttribute("data-colour", button.dataset.theme!);
  }),
);

export {};
