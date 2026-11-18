// Tiny helpers shared by the apps: saved state, backup/restore, a toast, and a bottom sheet.
// Data lives in this browser's localStorage only. Safari can clear it for sites that aren't
// on the home screen, so each app offers a JSON backup.
(function () {
  function Store(key, defaults) {
    this.key = key;
    this.defaults = defaults;
  }
  Store.prototype.load = function () {
    try {
      var raw = localStorage.getItem(this.key);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return JSON.parse(JSON.stringify(this.defaults));
  };
  Store.prototype.save = function (data) {
    try { localStorage.setItem(this.key, JSON.stringify(data)); } catch (e) {}
  };
  // Download the data as a .json file.
  Store.prototype.backup = function (data, name) {
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name + "-" + new Date().toISOString().slice(0, 10) + ".json";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  };
  // Ask for a .json file and hand its parsed contents to cb.
  Store.prototype.restore = function (cb) {
    var input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json,.json";
    input.onchange = function () {
      var f = input.files && input.files[0];
      if (!f) return;
      f.text().then(function (t) {
        try { cb(JSON.parse(t)); } catch (e) { alert("That file isn't a valid backup."); }
      });
    };
    input.click();
  };

  var toastEl, toastTimer;
  function toast(msg, actionLabel, action) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      toastEl.setAttribute("role", "status");
      document.body.appendChild(toastEl);
    }
    toastEl.innerHTML = "";
    var span = document.createElement("span");
    span.textContent = msg;
    toastEl.appendChild(span);
    if (actionLabel) {
      var b = document.createElement("button");
      b.textContent = actionLabel;
      b.onclick = function () { toastEl.classList.remove("show"); action(); };
      toastEl.appendChild(b);
    }
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, actionLabel ? 5000 : 2200);
  }

  // A bottom sheet. render(sheetEl, close) fills it.
  function sheet(render) {
    var wrap = document.createElement("div");
    wrap.className = "sheet-wrap open";
    wrap.innerHTML = '<div class="scrim"></div><div class="sheet" role="dialog" aria-modal="true"></div>';
    document.body.appendChild(wrap);
    document.body.style.overflow = "hidden";
    function close() { wrap.remove(); document.body.style.overflow = ""; }
    wrap.querySelector(".scrim").onclick = close;
    render(wrap.querySelector(".sheet"), close);
    var first = wrap.querySelector("input, textarea, select");
    if (first && matchMedia("(hover: hover)").matches) first.focus();
    return close;
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function uid() { return Math.random().toString(36).slice(2, 9); }

  window.Kit = { Store: Store, toast: toast, sheet: sheet, esc: esc, uid: uid };
})();
