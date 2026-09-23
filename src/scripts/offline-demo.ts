/** Offline demo interaction. No server-side data submission. */
const connection = document.querySelector<HTMLButtonElement>("#connection");
connection?.addEventListener("click", () => {
  const on = connection.getAttribute("aria-checked") !== "true";
  connection.setAttribute("aria-checked", String(on));
  document.querySelector("#connection-label")!.textContent =
    `Internet simulation: ${on ? "on" : "off"}`;
  document.querySelector("#phone-network")!.textContent = on
    ? "●●●"
    : "OFFLINE";
});
function demo(method: string) {
  const status = document.querySelector("#demo-status");
  if (status)
    status.textContent = `${method} complete. Contact details read from ${method === "Tap" ? "the chip" : "the QR"}${connection?.getAttribute("aria-checked") === "false" ? " — even with the internet simulation off" : ""}.`;
  document.querySelector("#save-contact")?.removeAttribute("hidden");
  document.querySelector(".phone")?.classList.add("connected");
}
document
  .querySelector("#tap-demo")
  ?.addEventListener("click", () => demo("Tap"));
document
  .querySelector("#qr-demo")
  ?.addEventListener("click", () => demo("Scan"));

export {};
