/* Reali Clean — site behavior */
(function () {
  "use strict";

  /*
   * Quote form delivery (live).
   * FORM_ENDPOINT is the Zapier "Catch Hook" URL and FORM_TOKEN a shared token the Zap
   * filters on. Both are filled in at deploy time by .github/workflows/pages.yml from the
   * repository secrets ZAPIER_HOOK_URL and FORM_TOKEN, so they are never committed.
   * If they haven't been filled in, the form falls back to opening the visitor's email app.
   */
  var FORM_ENDPOINT = "__ZAPIER_HOOK_URL__";
  var FORM_TOKEN = "__FORM_TOKEN__";
  var BUSINESS_EMAIL = "realiclean@gmail.com";
  var configured = FORM_ENDPOINT.indexOf("https://") === 0 && FORM_TOKEN.indexOf("__") !== 0;
  var loadedAt = Date.now();

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

  /* ---- Footer year ---- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---- Prefill quote form from area / service links ---- */
  var form = document.getElementById("quote-form");
  if (!form) return;
  var params = new URLSearchParams(window.location.search);
  if (params.get("area")) {
    var areaSelect = form.elements.area;
    var wantArea = params.get("area");
    if (!Array.prototype.some.call(areaSelect.options, function (o) { return o.value === wantArea; })) {
      areaSelect.add(new Option(wantArea, wantArea));
    }
    areaSelect.value = wantArea;
  }
  if (params.get("service")) {
    form.querySelectorAll('input[name="service"]').forEach(function (cb) {
      if (cb.value === params.get("service")) cb.checked = true;
    });
  }
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
      services: services.join(", ") || "None",
      area: form.elements.area.value || "None",
      frequency: form.elements.frequency.value || "None",
      message: form.elements.message.value.trim()
    };

    // Spam checks: the hidden field is only ever filled by bots, and nobody fills the
    // form in under 3 seconds. Pretend it worked so bots learn nothing.
    var honeypot = form.elements.company_website;
    if ((honeypot && honeypot.value) || Date.now() - loadedAt < 3000) {
      form.reset();
      setNote("Thank you! We got your request and will be in touch soon with your free quote.", "success");
      return;
    }
    var last = 0;
    try { last = Number(sessionStorage.getItem("rc-quote-sent") || 0); } catch (err) {}
    if (Date.now() - last < 60000) {
      setNote("We already have your request. We'll be in touch soon, or call (315) 804-4188.", "success");
      return;
    }

    if (configured) {
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      setNote("Sending...");
      var fields = {
        token: FORM_TOKEN,
        name: data.name,
        phone: data.phone,
        email: data.email,
        services: data.services,
        area: data.area,
        frequency: data.frequency,
        message: data.message,
        page: window.location.href,
        submitted_at: new Date().toISOString()
      };
      // Never send an empty field: anything blank goes to Zapier as "None".
      Object.keys(fields).forEach(function (key) {
        if (!String(fields[key] || "").trim()) fields[key] = "None";
      });
      var payload = new URLSearchParams(fields);
      // A form-encoded "simple" request needs no CORS preflight, which Zapier hooks don't answer.
      fetch(FORM_ENDPOINT, { method: "POST", mode: "no-cors", body: payload })
        .then(function () {
          try { sessionStorage.setItem("rc-quote-sent", String(Date.now())); } catch (err) {}
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

})();
