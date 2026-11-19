/* Reali Clean — site behavior */
(function () {
  "use strict";

  /*
   * Quote form delivery.
   * Leave empty to open the visitor's email app with a pre-filled message to
   * BUSINESS_EMAIL. To receive submissions without an email app, paste a form
   * endpoint here (e.g. Formspree "https://formspree.io/f/xxxxxx"); the form
   * will POST to it as JSON instead.
   */
  var FORM_ENDPOINT = "";
  var BUSINESS_EMAIL = "realiclean@gmail.com";

  /*
   * Demo mode: submitting the quote form plays an animated preview of the
   * production automation (email, texts, QuickBooks customer + estimate, lead
   * log) using the visitor's own details. Nothing is sent. Set to false, and
   * remove the .demo-banner and .automation-card markup, when going live.
   */
  var DEMO_MODE = true;

  /* ---- Header shadow on scroll ---- */
  var header = document.querySelector(".site-header");
  var onScroll = function () {
    header.classList.toggle("scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Mobile nav ---- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  var setNav = function (open) {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  toggle.addEventListener("click", function () {
    setNav(!nav.classList.contains("open"));
  });
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) setNav(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setNav(false);
  });

  /* ---- Before / after sliders ---- */
  document.querySelectorAll(".ba").forEach(function (fig) {
    var range = fig.querySelector(".ba-range");
    var update = function () { fig.style.setProperty("--pos", range.value + "%"); };
    range.addEventListener("input", update);
    update();
  });

  /* ---- Reveal on scroll ---- */
  var revealTargets = document.querySelectorAll(
    ".service-card, .steps li, .ba, .review, .texts, .area, .faq details, .about-media, .about-copy, .pm-callout"
  );
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealTargets.forEach(function (el, i) {
      el.classList.add("reveal");
      el.style.transitionDelay = (i % 4) * 70 + "ms";
      io.observe(el);
    });
  }

  /* ---- Prefill quote form from area / service links ---- */
  var form = document.getElementById("quote-form");
  document.querySelectorAll("[data-area]").forEach(function (link) {
    link.addEventListener("click", function () {
      form.elements.area.value = link.getAttribute("data-area");
    });
  });
  document.querySelectorAll("[data-service]").forEach(function (link) {
    link.addEventListener("click", function () {
      var want = link.getAttribute("data-service");
      form.querySelectorAll('input[name="service"]').forEach(function (cb) {
        if (cb.value === want) cb.checked = true;
      });
    });
  });

  /* ---- Quote form ---- */
  var note = document.getElementById("form-note");
  var setNote = function (msg, kind) {
    note.textContent = msg;
    note.className = "form-note" + (kind ? " " + kind : "");
  };

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var required = ["name", "phone", "email"];
    var firstBad = null;
    required.forEach(function (name) {
      var el = form.elements[name];
      var ok = el.value.trim() !== "" && el.checkValidity();
      el.classList.toggle("invalid", !ok);
      el.setAttribute("aria-invalid", String(!ok));
      if (!ok && !firstBad) firstBad = el;
    });
    if (firstBad) {
      setNote("Please add your name, phone and a valid email so we can reach you.", "error");
      firstBad.focus();
      return;
    }

    var services = Array.prototype.map.call(
      form.querySelectorAll('input[name="service"]:checked'),
      function (cb) { return cb.value; }
    );
    var data = {
      name: form.elements.name.value.trim(),
      phone: form.elements.phone.value.trim(),
      email: form.elements.email.value.trim(),
      services: services.join(", ") || "Not specified",
      area: form.elements.area.value || "Not specified",
      frequency: form.elements.frequency.value || "Not specified",
      message: form.elements.message.value.trim()
    };

    if (DEMO_MODE) {
      runDemo(data);
      return;
    }

    if (FORM_ENDPOINT) {
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      setNote("Sending...");
      fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data)
      })
        .then(function (res) {
          if (!res.ok) throw new Error("Bad response");
          form.reset();
          setNote("Thank you! We got your request and will be in touch soon with your free quote.", "success");
        })
        .catch(function () {
          setNote("Something went wrong. Please call or text us at (315) 804-4188.", "error");
        })
        .then(function () { btn.disabled = false; });
      return;
    }

    var body =
      "Hi Reali Clean, I'd like a free quote.\n\n" +
      "Name: " + data.name + "\n" +
      "Phone: " + data.phone + "\n" +
      "Email: " + data.email + "\n" +
      "Services: " + data.services + "\n" +
      "Area: " + data.area + "\n" +
      "How often: " + data.frequency + "\n\n" +
      (data.message ? "About my space:\n" + data.message + "\n" : "");
    var href =
      "mailto:" + BUSINESS_EMAIL +
      "?subject=" + encodeURIComponent("Quote request from " + data.name) +
      "&body=" + encodeURIComponent(body);
    window.location.href = href;
    setNote("Opening your email app. If nothing happens, email us at " + BUSINESS_EMAIL + " or call (315) 804-4188.", "success");
  });

  form.addEventListener("input", function (e) {
    if (e.target.classList.contains("invalid") && e.target.checkValidity() && e.target.value.trim()) {
      e.target.classList.remove("invalid");
      e.target.removeAttribute("aria-invalid");
    }
  });

  /* ---- Demo automation preview ---- */
  var flow = document.getElementById("flow");
  var flowTimers = [];
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function runDemo(data) {
    var values = {
      first: data.name.split(/\s+/)[0],
      name: data.name,
      phone: data.phone,
      email: data.email,
      services: data.services === "Not specified" ? "Cleaning (details TBD)" : data.services,
      area: data.area === "Not specified" ? "area TBD" : data.area,
      frequency: data.frequency === "Not specified" ? "Frequency TBD" : data.frequency
    };
    flow.querySelectorAll("[data-f]").forEach(function (el) {
      el.textContent = values[el.getAttribute("data-f")];
    });

    var steps = flow.querySelectorAll(".flow-steps li");
    var done = flow.querySelector(".flow-done");
    steps.forEach(function (li) { li.className = ""; });
    done.hidden = true;

    form.hidden = true;
    flow.hidden = false;
    flow.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    flow.focus({ preventScroll: true });

    if (reduceMotion) {
      steps.forEach(function (li) { li.classList.add("done"); });
      done.hidden = false;
      return;
    }

    var STEP_MS = 900;
    steps.forEach(function (li, i) {
      flowTimers.push(setTimeout(function () {
        if (i > 0) steps[i - 1].classList.replace("active", "done");
        li.classList.add("active");
      }, 400 + i * STEP_MS));
    });
    flowTimers.push(setTimeout(function () {
      steps[steps.length - 1].classList.replace("active", "done");
      done.hidden = false;
    }, 400 + steps.length * STEP_MS));
  }

  document.getElementById("flow-reset").addEventListener("click", function () {
    flowTimers.forEach(clearTimeout);
    flowTimers = [];
    flow.hidden = true;
    form.hidden = false;
    form.reset();
    setNote("We’ll never share your information. Quotes are always free.");
    form.elements.name.focus({ preventScroll: true });
    document.getElementById("quote").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  });

  /* ---- Footer year ---- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
