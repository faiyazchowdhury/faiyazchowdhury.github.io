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
  // Save the data as a .json file (restorable with Restore).
  Store.prototype.backup = function (data, name) {
    saveFile(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }), name + "-" + today() + ".json");
  };

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function today() { var d = new Date(); return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  // Local date and time as "2026-11-21 14:05".
  function stamp(t) {
    var d = new Date(t);
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + " " + pad(d.getHours()) + ":" + pad(d.getMinutes());
  }

  // On phones, hand the file to the share sheet (Save to Files, Notes, AirDrop, Mail…):
  // downloads from a home-screen web app are unreliable on iPhone. Elsewhere, download it.
  function saveFile(blob, filename) {
    var file;
    try { file = new File([blob], filename, { type: blob.type }); } catch (e) {}
    var touch = window.matchMedia && matchMedia("(pointer: coarse)").matches;
    if (file && touch && navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({ files: [file], title: filename }).catch(function (e) {
        if (e && e.name !== "AbortError") download(blob, filename);
      });
      return;
    }
    download(blob, filename);
  }
  function download(blob, filename) {
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
  }

  // Rows (arrays) to CSV text. Quotes fields that need it; numbers stay numbers.
  function csv(rows) {
    return rows.map(function (r) {
      return r.map(function (v) {
        if (v == null) return "";
        var s = String(v);
        return /[",\n\r]/.test(s) || /^\s|\s$/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
      }).join(",");
    }).join("\r\n") + "\r\n";
  }

  // A minimal ZIP writer (files stored uncompressed), so an export is one file.
  var CRC = (function () {
    var t = new Uint32Array(256);
    for (var n = 0; n < 256; n++) { var c = n; for (var k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; }
    return t;
  })();
  function crc32(bytes) { var c = 0xFFFFFFFF; for (var i = 0; i < bytes.length; i++) c = CRC[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
  function zip(files) { // files: [{ name, text }]
    var enc = new TextEncoder(), parts = [], central = [], offset = 0, d = new Date();
    var time = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1);
    var date = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
    files.forEach(function (f) {
      var name = enc.encode(f.name), data = enc.encode(f.text), crc = crc32(data);
      var h = new DataView(new ArrayBuffer(30));
      h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true); h.setUint16(8, 0, true);
      h.setUint16(10, time, true); h.setUint16(12, date, true); h.setUint32(14, crc, true);
      h.setUint32(18, data.length, true); h.setUint32(22, data.length, true); h.setUint16(26, name.length, true); h.setUint16(28, 0, true);
      parts.push(h.buffer, name, data);
      var c = new DataView(new ArrayBuffer(46));
      c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x0800, true); c.setUint16(10, 0, true);
      c.setUint16(12, time, true); c.setUint16(14, date, true); c.setUint32(16, crc, true); c.setUint32(20, data.length, true); c.setUint32(24, data.length, true);
      c.setUint16(28, name.length, true); c.setUint32(42, offset, true);
      central.push(c.buffer, name);
      offset += 30 + name.length + data.length;
    });
    var size = central.reduce(function (a, p) { return a + (p.byteLength || p.length); }, 0);
    var e = new DataView(new ArrayBuffer(22));
    e.setUint32(0, 0x06054b50, true); e.setUint16(8, files.length, true); e.setUint16(10, files.length, true);
    e.setUint32(12, size, true); e.setUint32(16, offset, true);
    return new Blob(parts.concat(central, [e.buffer]), { type: "application/zip" });
  }

  // Export an app's data as one ZIP: CSV tables, a README.md summary, and the JSON backup.
  // tables: [{ name: "log.csv", rows: [[header…], [row…]…] }]
  function exportData(app, tables, readme, json) {
    var folder = app + "-" + today() + "/";
    var files = [{ name: folder + "README.md", text: readme }];
    tables.forEach(function (t) { files.push({ name: folder + t.name, text: "﻿" + csv(t.rows) }); });
    files.push({ name: folder + app + "-backup.json", text: JSON.stringify(json, null, 2) });
    saveFile(zip(files), app + "-export-" + today() + ".zip");
  }
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

  window.Kit = { Store: Store, toast: toast, sheet: sheet, esc: esc, uid: uid, csv: csv, zip: zip, stamp: stamp, today: today, saveFile: saveFile, exportData: exportData };
})();
