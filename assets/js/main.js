/* Autohaus Brütsch — interactions */
(function () {
  "use strict";

  // Sticky nav background on scroll
  const nav = document.querySelector(".nav");
  const onScroll = () => {
    if (window.scrollY > 24) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu toggle
  const toggle = document.querySelector(".nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => nav.classList.toggle("open"));
    nav.querySelectorAll(".nav-links a").forEach((a) =>
      a.addEventListener("click", () => nav.classList.remove("open"))
    );
  }

  // Reveal on scroll
  const reveals = document.querySelectorAll(".reveal");
  const showAll = () =>
    reveals.forEach((el) => {
      // Force the final visible state without depending on a transition
      // advancing — bulletproof even on non-compositing renderers.
      el.style.transition = "none";
      el.style.opacity = "1";
      el.style.transform = "none";
      el.classList.add("in");
    });
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
    // Safety net: if the observer never fires (e.g. non-compositing/offscreen
    // renderers), guarantee everything becomes visible.
    setTimeout(showAll, 2600);
  } else {
    showAll();
  }

  // Animated stat counters
  const counters = document.querySelectorAll("[data-count]");
  const runCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const dur = 1400;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ("IntersectionObserver" in window) {
    const co = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            runCount(e.target);
            co.unobserve(e.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => co.observe(el));
    // Safety net for non-firing observers / frozen rAF: set the final value
    // directly so the number is never stuck at its starting state.
    setTimeout(() => {
      counters.forEach((el) => {
        if (el.textContent === "0" || el.textContent === "") {
          el.textContent = el.dataset.count + (el.dataset.suffix || "");
        }
      });
    }, 2600);
  } else {
    counters.forEach((el) => runCount(el));
  }

  // Footer year
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
