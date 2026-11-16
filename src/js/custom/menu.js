(function () {
  const header = document.querySelector(".main-header");
  const html = document.documentElement;
  const body = document.body;
  const collapse = document.querySelector(".menu-collapse");
  const toggle = document.querySelector(".menu-toggle");

  if (!header || !collapse || !toggle) return;

  const links = document.querySelectorAll(".menu-link");
  const submenuLinks = document.querySelectorAll(".submenu-link");
  const lastSubmenuLinks = document.querySelectorAll(
    ".submenu-item:last-child a"
  );

  const cssKeys = {
    active: "is-active",
    overflow: "overflow",
    open: "is-open",
  };

  // Open main menu
  const open = () => {
    toggle.classList.add(cssKeys.active);
    toggle.setAttribute("aria-expanded", "true");

    collapse.classList.add(cssKeys.active);
    html.classList.add(cssKeys.overflow);
    body.classList.add(cssKeys.overflow);
    header.classList.add(cssKeys.open);
  };

  // Close main menu
  const close = () => {
    toggle.classList.remove(cssKeys.active);
    toggle.setAttribute("aria-expanded", "false");

    collapse.classList.remove(cssKeys.active);
    html.classList.remove(cssKeys.overflow);
    body.classList.remove(cssKeys.overflow);
    header.classList.remove(cssKeys.open);

    closeOpenedSubmenu();
  };

  // Close opened submenus
  const closeOpenedSubmenu = () => {
    document.querySelectorAll(".submenu.is-active").forEach((submenu) => {
      submenu.classList.remove(cssKeys.active);
    });

    document
      .querySelectorAll(
        '.menu-link[aria-expanded="true"], .submenu-link[aria-expanded="true"]'
      )
      .forEach((link) => {
        link.setAttribute("aria-expanded", "false");
      });
  };

  // Toggle main menu
  toggle.addEventListener("click", (e) => {
    e.preventDefault();

    const isOpened = toggle.getAttribute("aria-expanded") === "true";

    if (isOpened) {
      close();
    } else {
      open();
    }
  });

  // Open submenu
  const openSubmenu = (link) => {
    const submenu = link.nextElementSibling;

    if (!submenu || !submenu.classList.contains("submenu")) return;

    closeOpenedSubmenu();

    link.setAttribute("aria-expanded", "true");
    submenu.classList.add(cssKeys.active);
  };

  // Toggle submenu
  const toggleSubmenu = (e) => {
    const link = e.currentTarget;
    const submenu = link.nextElementSibling;

    if (!submenu || !submenu.classList.contains("submenu")) return;

    e.preventDefault();

    const isOpened = link.getAttribute("aria-expanded") === "true";

    if (isOpened) {
      submenu.classList.remove(cssKeys.active);
      link.setAttribute("aria-expanded", "false");
    } else {
      openSubmenu(link);
    }
  };

  // Focus handlers
  links.forEach((link) => {
    link.addEventListener("focus", () => {
      const submenu = link.nextElementSibling;

      if (submenu && submenu.classList.contains("submenu")) {
        openSubmenu(link);
      }
    });

    link.addEventListener("touchstart", toggleSubmenu, {
      passive: false,
    });
  });

  submenuLinks.forEach((link) => {
    link.addEventListener("touchstart", toggleSubmenu, {
      passive: false,
    });
  });

  // Close submenu when leaving last link
  lastSubmenuLinks.forEach((link) => {
    link.addEventListener("blur", (e) => {
      const submenu = link.closest(".submenu");

      if (submenu && !submenu.contains(e.relatedTarget)) {
        closeOpenedSubmenu();
      }
    });
  });

  // Click outside menu
  document.addEventListener("click", (e) => {
    if (!header.contains(e.target)) {
      closeOpenedSubmenu();
    }
  });

  // Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      close();
      toggle.focus();
    }
  });
})();
