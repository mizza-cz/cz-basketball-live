(function () {
  const header = document.querySelector(".main-header");

  if (!header) return;

  const html = document.documentElement;
  const body = document.body;
  const collapse = header.querySelector(".menu-collapse");
  const toggle = header.querySelector(".menu-toggle");
  const links = header.querySelectorAll(".menu-link, .submenu-link");
  const desktop = window.matchMedia("(min-width: 992px)");

  if (!collapse || !toggle) return;

  const updateHeight = () => {
    header.style.setProperty(
      "--header-height",
      `${Math.max(0, header.getBoundingClientRect().bottom)}px`
    );
  };

  const closeOpenedSubmenu = () => {
    header.querySelectorAll(".submenu.is-active").forEach((submenu) => {
      submenu.classList.remove("is-active");
    });

    links.forEach((link) => {
      if (link.hasAttribute("aria-expanded")) {
        link.setAttribute("aria-expanded", "false");
      }
    });
  };

  const open = () => {
    updateHeight();

    toggle.classList.add("is-active");
    toggle.setAttribute("aria-expanded", "true");
    collapse.classList.add("is-active");

    html.classList.add("overflow");
    body.classList.add("overflow");
    header.classList.add("is-open");
  };

  const close = () => {
    toggle.classList.remove("is-active");
    toggle.setAttribute("aria-expanded", "false");
    collapse.classList.remove("is-active");

    html.classList.remove("overflow");
    body.classList.remove("overflow");
    header.classList.remove("is-open");

    closeOpenedSubmenu();
  };

  toggle.addEventListener("click", (e) => {
    e.preventDefault();

    if (desktop.matches) return;

    if (toggle.getAttribute("aria-expanded") === "true") {
      close();
    } else {
      open();
    }
  });

  links.forEach((link) => {
    const submenu = link.nextElementSibling;

    if (!submenu || !submenu.classList.contains("submenu")) {
      return;
    }

    link.addEventListener("click", (e) => {
      if (desktop.matches) return;

      e.preventDefault();

      const isOpened = submenu.classList.contains("is-active");

      const parent = link.parentElement.parentElement;

      Array.from(parent.children).forEach((item) => {
        item.querySelectorAll(".submenu.is-active").forEach((el) => {
          el.classList.remove("is-active");
        });

        item.querySelectorAll('[aria-expanded="true"]').forEach((el) => {
          el.setAttribute("aria-expanded", "false");
        });
      });

      if (!isOpened) {
        submenu.classList.add("is-active");
        link.setAttribute("aria-expanded", "true");
      }
    });

    link.addEventListener("focus", () => {
      if (!desktop.matches) return;

      closeOpenedSubmenu();

      submenu.classList.add("is-active");
      link.setAttribute("aria-expanded", "true");
    });
  });

  document.addEventListener("click", (e) => {
    if (!header.contains(e.target)) {
      close();
    }
  });

  header.addEventListener("focusout", (e) => {
    if (desktop.matches && !header.contains(e.relatedTarget)) {
      closeOpenedSubmenu();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      close();
    }
  });

  window.addEventListener("resize", () => {
    if (desktop.matches) {
      close();
    }

    updateHeight();
  });
})();
