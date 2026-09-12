(function () {
  "use strict";

  var header = document.getElementById("siteHeader");
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-link, .brand, .mobile-link"));
  var sections = Array.prototype.slice.call(document.querySelectorAll("main .section, .hero"));
  var navToggle = document.getElementById("navToggle");
  var mobileMenu = document.getElementById("mobileMenu");

  /* ---- Footer year ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Smooth scroll for every element carrying data-target ---- */
  document.querySelectorAll("[data-target]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      var id = el.getAttribute("data-target");
      var target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      closeMobileMenu();
    });
  });

  /* ---- Mobile menu toggle ---- */
  function closeMobileMenu() {
    mobileMenu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  }
  function openMobileMenu() {
    mobileMenu.classList.add("open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close menu");
  }
  if (navToggle) {
    navToggle.addEventListener("click", function () {
      var isOpen = mobileMenu.classList.contains("open");
      if (isOpen) { closeMobileMenu(); } else { openMobileMenu(); }
    });
  }

  /* ---- Header background solid after leaving hero ---- */
  var heroEl = document.getElementById("home");
  var headerObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          header.classList.remove("solid");
        } else {
          header.classList.add("solid");
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  if (heroEl) headerObserver.observe(heroEl);

  /* ---- Active nav link tracking ---- */
  var idToLinks = {};
  navLinks.forEach(function (link) {
    var id = link.getAttribute("data-target");
    if (!id) return;
    idToLinks[id] = idToLinks[id] || [];
    idToLinks[id].push(link);
  });

  function setActive(id) {
    navLinks.forEach(function (l) { l.classList.remove("active"); });
    (idToLinks[id] || []).forEach(function (l) { l.classList.add("active"); });
  }

  var sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    },
    { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
  );
  sections.forEach(function (s) { sectionObserver.observe(s); });

  /* ---- Reveal on scroll ---- */
  var revealObserver = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach(function (el) { revealObserver.observe(el); });

  /* ---- Contact form ---- */
  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");
  var CONTACT_EMAIL = "info@gmail.com";

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = document.getElementById("contactEmail").value.trim();
      var message = document.getElementById("contactMessage").value.trim();
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(email)) {
        showStatus("Please enter a valid email address.", true);
        return;
      }
      if (!message) {
        showStatus("Please write a message before sending.", true);
        return;
      }

      var subject = encodeURIComponent("New inquiry from " + email);
      var body = encodeURIComponent(message + "\n\n— sent from the Talatek website contact form");
      var mailtoUrl = "mailto:" + CONTACT_EMAIL + "?subject=" + subject + "&body=" + body;

      window.location.href = mailtoUrl;
      showStatus("Opening your email client…", false);
    });
  }

  function showStatus(text, isError) {
    status.textContent = text;
    status.classList.toggle("error", !!isError);
  }
})();
