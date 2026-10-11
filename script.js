(function () {
  "use strict";

  // Mobile nav toggle
  var navToggle = document.getElementById("navToggle");
  var siteNav = document.getElementById("siteNav");

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = siteNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    siteNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        siteNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Smooth, natural scroll reveal (fires once per element, no stagger tricks)
  var revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  // Menu category tabs
  var tabButtons = document.querySelectorAll(".tab-btn");
  var panels = document.querySelectorAll(".menu-panel");

  tabButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = btn.getAttribute("data-target");

      tabButtons.forEach(function (b) {
        b.classList.remove("is-active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-selected", "true");

      panels.forEach(function (panel) {
        panel.classList.toggle("is-active", panel.id === target);
      });
    });
  });

  // Parallax sutil del fondo del hero (solo escritorio y sin "reducir movimiento")
  var heroEl = document.getElementById("hero");
  var heroImg = heroEl ? heroEl.querySelector(".hero-bg img") : null;
  var canParallax =
    heroImg &&
    window.matchMedia &&
    window.matchMedia("(min-width: 900px)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (canParallax) {
    var ticking = false;

    var updateParallax = function () {
      var heroH = heroEl.offsetHeight;
      var y = window.pageYOffset || 0;
      if (y <= heroH) {
        var offset = Math.min(y * 0.12, heroH * 0.07);
        heroImg.style.transform = "translate3d(0," + offset.toFixed(1) + "px,0)";
      }
      ticking = false;
    };

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(updateParallax);
        }
      },
      { passive: true }
    );
  }

  // Botón "Pedir" por WhatsApp en cada plato del menú.
  // Se inyecta dentro de cada <li> existente: no se modifica la estructura del menú.
  var WHATSAPP_NUMBER = "584249516868";

  function cleanText(text) {
    return text.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
  }

  function buildOrderUrl(dish, category) {
    var message =
      "Hola Alta Gama, quiero hacer un pedido:\n\n" +
      "\u2022 " + dish + "\n" +
      (category ? "Categoría: " + category + "\n" : "") +
      "\nNombre y apellido: ";
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
  }

  function createOrderLink(dish, category) {
    var link = document.createElement("a");
    link.className = "dish-order";
    link.href = buildOrderUrl(dish, category);
    link.target = "_blank";
    link.rel = "noopener";
    link.setAttribute("aria-label", "Pedir " + dish + " por WhatsApp");

    var icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    icon.setAttribute("viewBox", "0 0 24 24");
    icon.setAttribute("width", "16");
    icon.setAttribute("height", "16");
    icon.setAttribute("aria-hidden", "true");
    icon.setAttribute("focusable", "false");
    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("fill", "currentColor");
    path.setAttribute(
      "d",
      "M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.25-.12-1.45-.72-1.68-.8-.22-.08-.39-.12-.55.12-.16.25-.63.8-.77.96-.14.17-.28.18-.53.06a6.7 6.7 0 0 1-1.97-1.22 7.4 7.4 0 0 1-1.36-1.69c-.14-.25-.02-.38.1-.5.11-.11.25-.28.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47c-.17 0-.43.06-.65.31-.22.25-.85.83-.85 2.03s.87 2.35.99 2.52c.12.16 1.71 2.62 4.15 3.67.58.25 1.03.4 1.39.51.58.19 1.11.16 1.53.1.47-.07 1.45-.59 1.65-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.47-.28z"
    );
    icon.appendChild(path);

    var label = document.createElement("span");
    label.className = "dish-order-text";
    label.textContent = "Pedir";

    link.appendChild(icon);
    link.appendChild(label);
    return link;
  }

  document.querySelectorAll(".menu-panel").forEach(function (panel) {
    var tab = document.querySelector('.tab-btn[data-target="' + panel.id + '"]');
    var category = tab ? cleanText(tab.textContent) : "";

    panel.querySelectorAll(".dish-list li").forEach(function (item) {
      var nameEl = item.querySelector(".dish-name");
      if (!nameEl) return;

      var dish = cleanText(nameEl.textContent);
      var priceEl = item.querySelector(".dish-price");
      var price = priceEl ? cleanText(priceEl.textContent) : "";
      var summary = price ? dish + " \u2014 " + price : dish;

      item.appendChild(createOrderLink(summary, category));
    });
  });
})();
