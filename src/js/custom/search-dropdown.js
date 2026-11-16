document.querySelectorAll(".js-search-dropdown-input").forEach((input) => {
  const target = input.dataset.target;

  if (!target) return;

  const dropdown = document.querySelector(target);

  if (!dropdown) return;

  let controller = null;

  const hideDropdown = () => {
    dropdown.classList.add("d-none");
    input.setAttribute("aria-expanded", "false");
  };

  input.addEventListener("keyup", function () {
    const value = this.value.trim();

    if (controller) {
      controller.abort();
      controller = null;
    }

    if (value.length < 3) {
      hideDropdown();
      return;
    }

    const url = dropdown.dataset.searchSuggestionsApi;

    if (!url) return;

    controller = new AbortController();

    fetch(`${url}?q=${encodeURIComponent(value)}`, {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Search request failed");
        }

        return response.json();
      })
      .then((data) => {
        if (input.value.trim() !== value) return;

        dropdown.innerHTML = "";

        (data.items || []).forEach((item) => {
          const li = document.createElement("li");

          li.setAttribute("role", "presentation");
          li.className =
            "d-block font-size-xnormal pt-1 pb-1 text-decoration-none js-dropdown-item";

          li.dataset.url = item.url || "";

          const link = document.createElement("a");

          link.href = "#";
          link.setAttribute("role", "option");
          link.className = "font-size-smaller text-primary js-dropdown-item";

          link.dataset.id = item.id;
          link.textContent = item.text;

          li.appendChild(link);
          dropdown.appendChild(li);
        });

        if (dropdown.children.length) {
          dropdown.classList.remove("d-none");
          input.setAttribute("aria-expanded", "true");
        } else {
          hideDropdown();
        }
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.error(error);
          hideDropdown();
        }
      });
  });

  dropdown.addEventListener("click", function (e) {
    const link = e.target.closest("a.js-dropdown-item");

    if (!link || !dropdown.contains(link)) return;

    e.preventDefault();

    input.value = link.textContent.trim();

    const hiddenInput = document.getElementById(`${dropdown.id}-id`);

    if (hiddenInput) {
      hiddenInput.value = link.dataset.id || "";
    }

    hideDropdown();
  });

  document.addEventListener("click", function (e) {
    if (!input.contains(e.target) && !dropdown.contains(e.target)) {
      hideDropdown();
    }
  });
});
