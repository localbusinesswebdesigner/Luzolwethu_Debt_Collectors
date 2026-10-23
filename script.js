
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // Current year in the footer
  const currentYear = document.getElementById("currentYear");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // Mobile navigation
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  function closeMenu() {
    if (!menuToggle || !mainNav) return;

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    mainNav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  }

  function openMenu() {
    if (!menuToggle || !mainNav) return;

    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation menu");
    mainNav.classList.add("is-open");
    document.body.classList.add("menu-open");
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isExpanded =
        menuToggle.getAttribute("aria-expanded") === "true";

      if (isExpanded) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close the menu when a navigation link is selected
    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Close the menu when Escape is pressed
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    // Close the menu when the screen becomes desktop-sized
    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) {
        closeMenu();
      }
    });
  }

  // Show a text-based brand if the local logo cannot load
  document.querySelectorAll(".brand").forEach((brand) => {
    const logo = brand.querySelector(".brand-logo");

    if (!logo) return;

    logo.addEventListener("error", () => {
      brand.classList.add("logo-missing");
    });

    if (logo.complete && logo.naturalWidth === 0) {
      brand.classList.add("logo-missing");
    }
  });

  // Mark the currently visible navigation section
  const navLinks = document.querySelectorAll(
    '.main-nav a[href^="#"]:not(.nav-cta)'
  );

  const observedSections = Array.from(navLinks)
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && observedSections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          navLinks.forEach((link) => {
            const isCurrent =
              link.getAttribute("href") === `#${entry.target.id}`;

            if (isCurrent) {
              link.classList.add("active");
            } else {
              link.classList.remove("active");
            }
          });
        });
      },
      {
        rootMargin: "-25% 0px -60% 0px",
        threshold: 0
      }
    );

    observedSections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  // Reveal content gently as it enters the viewport
  const revealElements = document.querySelectorAll(
    ".intro-card, .service-card, .process-step, .partner-card, .gallery-item"
  );

  if (
    "IntersectionObserver" in window &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    document.documentElement.classList.add("js-ready");

    revealElements.forEach((element) => {
      element.classList.add("reveal");
    });

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  }

  // Contact form checks
  const contactForm = document.getElementById("contactForm");
  const formNotice = document.getElementById("formNotice");
  const submitButton = document.getElementById("submitButton");

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      // Honeypot spam check
      const honeypot = contactForm.querySelector('[name="_honey"]');

      if (honeypot && honeypot.value.trim() !== "") {
        event.preventDefault();

        if (formNotice) {
          formNotice.textContent =
            "Your enquiry could not be submitted. Please try again.";
          formNotice.classList.add("error");
        }

        return;
      }

      // Validate using the browser's built-in form validation
      if (!contactForm.checkValidity()) {
        event.preventDefault();
        contactForm.reportValidity();
        return;
      }

      // Prevent accidental double-clicks while the form submits
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Submitting...";
      }

      if (formNotice) {
        formNotice.textContent =
          "Submitting your enquiry. Please wait for FormSubmit to respond.";
        formNotice.classList.remove("error", "success");
      }

      // Do not prevent the normal submission:
      // FormSubmit handles the form and its response.
    });
  }

  // Provide a useful fallback when an online photo fails to load
  document.querySelectorAll("img").forEach((image) => {
    image.addEventListener("error", () => {
      image.classList.add("image-unavailable");
      image.setAttribute("data-image-unavailable", "true");
    });
  });
});
