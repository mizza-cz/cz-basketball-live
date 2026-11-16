document.querySelectorAll(".js-search-inline-toggle").forEach((toggle) => {
  toggle.addEventListener("click", function (e) {
    e.preventDefault();

    const wrapper = document.querySelector(".js-search-inline-wrapper");

    if (!wrapper) return;

    wrapper.classList.toggle("d-none");

    if (!wrapper.classList.contains("d-none")) {
      const input = wrapper.querySelector('input[type="search"]');

      if (input) {
        input.focus();
      }
    }
  });
});
