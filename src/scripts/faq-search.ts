/** Faq search interaction. No server-side data submission. */
document
  .querySelector<HTMLInputElement>("#faq-search")
  ?.addEventListener("input", (e) => {
    const query = (e.target as HTMLInputElement).value.toLowerCase().trim();
    let count = 0;
    document
      .querySelectorAll<HTMLDetailsElement>("[data-faq]")
      .forEach((item) => {
        item.hidden = !item.textContent?.toLowerCase().includes(query);
        if (!item.hidden) count++;
      });
    document.querySelector("#faq-count")!.textContent =
      `${count} matching question${count === 1 ? "" : "s"}.`;
    (document.querySelector("#faq-empty") as HTMLElement).hidden = count !== 0;
  });

export {};
