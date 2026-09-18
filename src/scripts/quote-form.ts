/** Quote form interaction. No server-side data submission. */
const form = document.querySelector<HTMLFormElement>("#quote-form");
if (form) {
  const params = new URLSearchParams(location.search);
  if (params.get("item") === "non-nfc-card")
    (form.elements.namedItem("type") as HTMLSelectElement).value = "Non-NFC PVC";
  if (params.get("design") === "support")
    (form.elements.namedItem("design") as HTMLSelectElement).value =
      "Design support (quoted separately)";
  if (params.get("team") === "yes")
    (form.elements.namedItem("brief") as HTMLTextAreaElement).value =
      "I would like cards for my team.\n";
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const fields = [
      ["Name", "name"],
      ["Email", "email"],
      ["Company", "company"],
      ["Quantity", "quantity"],
      ["Card type", "type"],
      ["Print route", "print"],
      ["Design route", "design"],
      ["Contact QR", "qr"],
      ["Brief", "brief"],
    ];
    const body =
      "Hello Cardistry,\n\nPlease prepare a quote for:\n\n" +
      fields
        .map(([label, key]) => `${label}: ${data.get(key) || "Not supplied"}`)
        .join("\n") +
      "\n\nPlease confirm pricing, device compatibility and production timing. Thank you.";
    const link = document.querySelector<HTMLAnchorElement>("#email-link")!;
    link.href = `mailto:sales@cardistry.co.za?subject=${encodeURIComponent("Cardistry quote request")}&body=${encodeURIComponent(body)}`;
    (document.querySelector("#quote-text") as HTMLTextAreaElement).value = body;
    (document.querySelector("#email-preview") as HTMLElement).hidden = false;
    document.querySelector("#form-status")!.textContent =
      "Your request is ready—not sent. Use Open email app below, or copy it into an email.";
    link.focus();
  });
}
document.querySelector("#copy-quote")?.addEventListener("click", async () => {
  const field = document.querySelector<HTMLTextAreaElement>("#quote-text")!;
  try {
    await navigator.clipboard.writeText(field.value);
    document.querySelector("#form-status")!.textContent =
      "Copied. Paste into your email and send to sales@cardistry.co.za.";
  } catch {
    field.focus();
    field.select();
    document.querySelector("#form-status")!.textContent =
      "Select and copy the prepared text, then send it using your email app.";
  }
});

export {};
