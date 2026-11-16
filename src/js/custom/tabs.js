document.querySelectorAll(".boxscore-tabs").forEach((tabs) => {
  const buttons = tabs.querySelectorAll(".boxscore-tabs__button");

  const content = tabs.nextElementSibling;

  if (!content || !content.classList.contains("boxscore-tabs__content")) {
    return;
  }

  const panes = content.querySelectorAll(".tab-pane");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.getAttribute("data-bs-target");

      buttons.forEach((btn) => {
        const active = btn === button;

        btn.classList.toggle("active", active);
        btn.setAttribute("aria-selected", String(active));
      });

      panes.forEach((pane) => {
        const active = `#${pane.id}` === target;

        pane.classList.toggle("active", active);
        pane.classList.toggle("show", active);
      });
    });
  });
});
