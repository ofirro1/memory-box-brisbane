(function () {
  var form = document.getElementById("quote-form");
  var estimateView = document.getElementById("estimate");
  if (!form || !estimateView) return;

  var steps = Array.prototype.slice.call(form.querySelectorAll("[data-step]"));
  var bars = Array.prototype.slice.call(document.querySelectorAll("[data-bar]"));
  var stepLabel = document.getElementById("step-count");
  var stepName = document.getElementById("step-name");
  var backBtn = document.getElementById("back-btn");
  var nextBtn = document.getElementById("next-btn");
  var submitBtn = document.getElementById("submit-btn");
  var names = ["Photos", "Storage", "Quantity", "Location", "Details", "Review"];
  var index = 0;

  var rates = { prints: 0.55, negatives_slides: 0.95, albums: 0.9, mixed: 0.75 };
  var qtyBase = { "1-100": 50, "101-500": 300, "501-1000": 750, "1000+": 1500 };

  var labels = {
    photo_type: {
      prints: "Loose prints",
      negatives_slides: "Negatives & slides",
      albums: "Photo albums",
      mixed: "A mix of everything"
    },
    format_condition: {
      loose: "Loose in boxes or bags",
      in_albums: "Fixed in albums",
      boxed: "Organised in boxes",
      mixed_condition: "Mixed condition"
    },
    quantity_range: {
      "1-100": "1–100 photos",
      "101-500": "101–500 photos",
      "501-1000": "501–1,000 photos",
      "1000+": "1,000+ photos"
    },
    ready_when: {
      asap: "As soon as possible",
      this_week: "This week",
      next_few_weeks: "In the next few weeks",
      no_rush: "No rush"
    }
  };

  var bank = {
    accountName: "Memory Box Brisbane",
    bsb: "062-692",
    accountNumber: "4977 9920"
  };

  function selected(name) {
    var input = form.querySelector('input[name="' + name + '"]:checked');
    return input ? input.value : "";
  }

  function field(name) {
    var el = form.elements[name];
    return el ? String(el.value || "").trim() : "";
  }

  function answers() {
    return {
      photo_type: selected("photo_type"),
      format_condition: selected("format_condition"),
      quantity_range: selected("quantity_range"),
      state: field("state") || "QLD",
      suburb: field("suburb"),
      ready_when: selected("ready_when"),
      name: field("name"),
      email: field("email"),
      phone: field("phone"),
      notes: field("notes")
    };
  }

  function stepValid(i) {
    var data = answers();
    if (i === 0) return !!data.photo_type;
    if (i === 1) return !!data.format_condition;
    if (i === 2) return !!data.quantity_range;
    if (i === 3) return !!data.state && data.suburb.length > 0 && !!data.ready_when;
    if (i === 4) return data.name.length > 0 && /\S+@\S+\.\S+/.test(data.email);
    return true;
  }

  function showStep(i) {
    index = i;
    steps.forEach(function (step, n) {
      step.hidden = n !== i;
    });
    bars.forEach(function (bar, n) {
      bar.classList.toggle("is-on", n <= i);
    });
    stepLabel.textContent = "Step " + (i + 1) + " of 6";
    stepName.textContent = names[i];
    backBtn.disabled = i === 0;
    var last = i === steps.length - 1;
    nextBtn.hidden = last;
    submitBtn.hidden = !last;
    if (!last) nextBtn.disabled = !stepValid(i);
    if (i === 5) fillReview();
    var heading = steps[i].querySelector("h2");
    if (heading) heading.setAttribute("tabindex", "-1");
  }

  function fillReview() {
    var data = answers();
    setText("review-photos", labels.photo_type[data.photo_type]);
    setText("review-storage", labels.format_condition[data.format_condition]);
    setText("review-quantity", labels.quantity_range[data.quantity_range]);
    setText("review-location", [data.suburb, data.state].filter(Boolean).join(", "));
    setText("review-timing", labels.ready_when[data.ready_when]);
    setText("review-name", data.name);
    setText("review-email", data.email);
    setText("review-phone", data.phone || "—");
  }

  function setText(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value || "—";
  }

  function estimateFor(data) {
    var rate = rates[data.photo_type] == null ? rates.mixed : rates[data.photo_type];
    var base = qtyBase[data.quantity_range] == null ? 50 : qtyBase[data.quantity_range];
    var midBase = Math.max(base * rate, 100) * 0.85;
    var low = Math.round(midBase * 0.85);
    var high = Math.round(midBase * 1.15);
    var midpoint = Math.round((low + high) / 2);
    return { low: low, high: high, deposit: Math.round(midpoint * 0.5) };
  }

  function reference() {
    var alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    var code = "";
    for (var i = 0; i < 6; i++) code += alphabet[Math.floor(Math.random() * alphabet.length)];
    return "MB" + code;
  }

  function money(n) {
    return "$" + n;
  }

  function renderEstimate(record) {
    form.hidden = true;
    document.getElementById("quote-intro").hidden = true;
    estimateView.hidden = false;
    setText("est-range", money(record.low) + "–" + money(record.high));
    setText("est-deposit", money(record.deposit));
    setText("est-deposit-2", money(record.deposit));
    setText("est-type", labels.photo_type[record.photo_type]);
    setText("est-qty", labels.quantity_range[record.quantity_range]);
    setText("est-place", record.suburb + ", " + record.state);
    setText("bank-name", bank.accountName);
    setText("bank-bsb", bank.bsb);
    setText("bank-acc", bank.accountNumber);
    setText("bank-ref", record.reference);
    var mail = document.getElementById("email-quote");
    if (mail) {
      var body = [
        "Hello Lia,",
        "",
        "I'd like to go ahead with this photo digitisation estimate.",
        "",
        "Reference: " + record.reference,
        "Name: " + record.name,
        "Email: " + record.email,
        "Phone: " + (record.phone || "—"),
        "Photos: " + labels.photo_type[record.photo_type],
        "Storage: " + labels.format_condition[record.format_condition],
        "Quantity: " + labels.quantity_range[record.quantity_range],
        "Location: " + record.suburb + ", " + record.state,
        "Timing: " + labels.ready_when[record.ready_when],
        "Estimate: " + money(record.low) + "–" + money(record.high),
        "Deposit (50%): " + money(record.deposit),
        record.notes ? "Notes: " + record.notes : ""
      ].filter(Boolean).join("\n");
      mail.href = "mailto:memoryboxbrisbane@gmail.com?subject=" +
        encodeURIComponent("Quote " + record.reference) +
        "&body=" + encodeURIComponent(body);
    }
    document.getElementById("accepted-block").hidden = !record.accepted;
    document.getElementById("pending-block").hidden = !!record.accepted;
    estimateView.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function save(record) {
    sessionStorage.setItem("mbb-quote", JSON.stringify(record));
  }

  function load() {
    try {
      return JSON.parse(sessionStorage.getItem("mbb-quote") || "null");
    } catch (e) {
      return null;
    }
  }

  form.addEventListener("change", function () {
    if (index < 5) nextBtn.disabled = !stepValid(index);
  });

  form.addEventListener("input", function () {
    if (index < 5) nextBtn.disabled = !stepValid(index);
  });

  nextBtn.addEventListener("click", function () {
    if (!stepValid(index)) return;
    showStep(Math.min(index + 1, steps.length - 1));
  });

  backBtn.addEventListener("click", function () {
    showStep(Math.max(index - 1, 0));
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!stepValid(4)) {
      showStep(4);
      return;
    }
    var data = answers();
    var price = estimateFor(data);
    var record = Object.assign({}, data, price, {
      reference: reference(),
      accepted: false
    });
    save(record);
    if (history.replaceState) history.replaceState(null, "", "#plan");
    renderEstimate(record);
  });

  document.getElementById("accept-btn").addEventListener("click", function () {
    var record = load();
    if (!record) return;
    record.accepted = true;
    save(record);
    renderEstimate(record);
  });

  document.getElementById("restart-btn").addEventListener("click", function (event) {
    event.preventDefault();
    sessionStorage.removeItem("mbb-quote");
    form.hidden = false;
    document.getElementById("quote-intro").hidden = false;
    estimateView.hidden = true;
    form.reset();
    form.querySelectorAll(".choice").forEach(function (choice) {
      choice.classList.remove("is-selected");
    });
    var qld = form.querySelector('select[name="state"]');
    if (qld) qld.value = "QLD";
    if (history.replaceState) history.replaceState(null, "", location.pathname);
    showStep(0);
  });

  estimateView.querySelectorAll("[data-copy]").forEach(function (button) {
    button.addEventListener("click", function () {
      var id = button.getAttribute("data-copy");
      var node = document.getElementById(id);
      var value = node ? node.textContent : "";
      var done = function () {
        var original = button.getAttribute("data-label") || "Copy";
        button.innerHTML = '<svg class="icon icon-xs" aria-hidden="true"><use href="../icons.svg#i-check"></use></svg> Copied';
        window.setTimeout(function () {
          button.innerHTML = '<svg class="icon icon-xs" aria-hidden="true"><use href="../icons.svg#i-copy"></use></svg> ' + original;
        }, 1500);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(done, done);
      } else {
        done();
      }
    });
  });

  var existing = load();
  if (existing && location.hash === "#plan") {
    renderEstimate(existing);
  } else {
    showStep(0);
  }
})();
