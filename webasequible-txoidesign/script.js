/* ============================================================
   txoidesign · Web Asequible — Interacciones
   ============================================================ */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    /* Año dinámico en el footer */
    var year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();

    /* Header con fondo al hacer scroll */
    var header = document.getElementById("siteHeader");
    function onScroll() {
      if (window.scrollY > 20) header.classList.add("scrolled");
      else header.classList.remove("scrolled");
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    /* Menú móvil */
    var toggle = document.getElementById("navToggle");
    var navList = document.getElementById("navList");
    if (toggle) {
      toggle.addEventListener("click", function () {
        var open = header.classList.toggle("menu-open");
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
      });
      navList.addEventListener("click", function (e) {
        if (e.target.tagName === "A") {
          header.classList.remove("menu-open");
          toggle.setAttribute("aria-expanded", "false");
        }
      });
    }

    /* Revelado al hacer scroll */
    var revealEls = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );
      revealEls.forEach(function (el, i) {
        el.style.transitionDelay = (i % 4) * 0.06 + "s";
        io.observe(el);
      });
    } else {
      revealEls.forEach(function (el) { el.classList.add("in"); });
    }

    /* Contador de estadísticas */
    var counters = document.querySelectorAll(".stat-num[data-count]");
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function animateCount(el) {
      var target = parseFloat(el.getAttribute("data-count")) || 0;
      var prefix = (el.getAttribute("data-prefix") || "").replace("&lt;", "<");
      var suffix = el.getAttribute("data-suffix") || "";
      if (reduce || target === 0) {
        el.textContent = prefix + target + suffix;
        return;
      }
      var start = null;
      var duration = 1400;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    if ("IntersectionObserver" in window) {
      var cio = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateCount(entry.target);
              cio.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.6 }
      );
      counters.forEach(function (c) { cio.observe(c); });
    } else {
      counters.forEach(animateCount);
    }

    /* Resaltar enlace de navegación activo */
    var sections = document.querySelectorAll("main section[id]");
    var navLinks = document.querySelectorAll(".nav-list a");
    if ("IntersectionObserver" in window && navLinks.length) {
      var sio = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var id = entry.target.getAttribute("id");
              navLinks.forEach(function (link) {
                link.classList.toggle(
                  "active",
                  link.getAttribute("href") === "#" + id
                );
              });
            }
          });
        },
        { rootMargin: "-45% 0px -50% 0px" }
      );
      sections.forEach(function (s) { sio.observe(s); });
    }

    /* Validación del formulario de contacto */
    var form = document.getElementById("contactForm");
    if (form) {
      var success = document.getElementById("formSuccess");

      function setError(field, msg) {
        var wrap = field.closest(".field");
        var small = wrap.querySelector(".error");
        wrap.classList.toggle("invalid", !!msg);
        if (small) small.textContent = msg || "";
      }

      function validateField(field) {
        var value = field.value.trim();
        if (field.hasAttribute("required") && !value) {
          setError(field, "Este campo es obligatorio.");
          return false;
        }
        if (field.type === "email" && value) {
          var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
          if (!ok) {
            setError(field, "Introduce un email válido.");
            return false;
          }
        }
        setError(field, "");
        return true;
      }

      var required = form.querySelectorAll("[required]");
      required.forEach(function (f) {
        f.addEventListener("blur", function () { validateField(f); });
        f.addEventListener("input", function () {
          if (f.closest(".field").classList.contains("invalid")) validateField(f);
        });
      });

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var valid = true;
        required.forEach(function (f) {
          if (!validateField(f)) valid = false;
        });
        if (!valid) {
          var firstInvalid = form.querySelector(".field.invalid input, .field.invalid textarea");
          if (firstInvalid) firstInvalid.focus();
          return;
        }
        /* Envío simulado: aquí conectarías tu backend o servicio de email */
        form.querySelectorAll("input, select, textarea, button").forEach(function (el) {
          el.disabled = true;
        });
        if (success) {
          success.hidden = false;
          success.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      });
    }
  });
})();
