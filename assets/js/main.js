// 全站共用：導覽列、首頁卡片、目錄、上一課/下一課、測驗、執行 Python
// 不用 ES module，直接點開 file:// 也能跑
(function () {
  var body = document.body;
  var root = body.dataset.root || ".";
  var lessons = window.LESSONS || [];
  var blocks = window.BLOCKS || [];
  var current = body.dataset.lesson;

  function lessonNo(l) { return lessons.indexOf(l) + 1; }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function href(l) { return root + "/lessons/" + l.id + ".html"; }

  // ===== navbar =====
  var nav = document.querySelector(".nav-links");
  if (nav) {
    var html = '<a href="' + root + '/index.html"' + (current ? "" : ' class="active"') + ">首頁</a>";
    lessons.forEach(function (l) {
      html += '<a href="' + href(l) + '"' + (l.id === current ? ' class="active"' : "") + ">L" + lessonNo(l) + " " + l.title + "</a>";
    });
    nav.innerHTML = html;
  }

  // ===== 首頁：依 Block 分組列卡片 =====
  var home = document.getElementById("blocks");
  if (home) {
    home.innerHTML = blocks.map(function (b) {
      var list = lessons.filter(function (l) { return l.block === b.no; });
      var cards = list.map(function (l) {
        return '<a class="card" href="' + href(l) + '">' +
          '<div class="num">Lesson ' + pad(lessonNo(l)) + "</div>" +
          "<h3>" + l.title + "</h3><p>" + l.summary + "</p>" +
          '<div class="tags">' + l.topics.map(function (t) { return '<span class="tag">' + t + "</span>"; }).join("") + "</div></a>";
      }).join("");
      if (!list.length) cards = '<div class="card empty">還沒開課</div>';
      return '<section class="block"><div class="block-head">' +
        '<span class="no">Block ' + b.no + "</span><h2>" + b.zh + '</h2><span class="en">' + b.en + "</span></div>" +
        '<div class="grid">' + cards + "</div></section>";
    }).join("");
  }

  // ===== 講義頁：標題、目錄、上一課/下一課 =====
  if (current) {
    var me = lessons.filter(function (l) { return l.id === current; })[0];
    var i = lessons.indexOf(me);
    var head = document.querySelector(".lesson-head .block-tag");
    if (head && me) head.textContent = "Lesson " + pad(i + 1) + " / Block " + me.block;
    if (me) document.title = "L" + (i + 1) + " " + me.title + " | PCEP Python";

    var toc = document.querySelector(".toc");
    var heads = document.querySelectorAll(".lesson-body h2[id], .lesson-body h3[id]");
    if (toc) {
      toc.innerHTML = "<p>本課目錄</p>" + Array.prototype.map.call(heads, function (h) {
        return '<a href="#' + h.id + '"' + (h.tagName === "H3" ? ' class="sub"' : "") + ">" + h.textContent + "</a>";
      }).join("");
      var links = toc.querySelectorAll("a");
      window.addEventListener("scroll", function () {
        var idx = 0;
        heads.forEach(function (h, k) { if (h.getBoundingClientRect().top < 120) idx = k; });
        links.forEach(function (a, k) { a.classList.toggle("active", k === idx); });
      }, { passive: true });
    }

    var pager = document.querySelector(".pager");
    if (pager) {
      var prev = lessons[i - 1], next = lessons[i + 1];
      pager.innerHTML =
        (prev ? '<a href="' + href(prev) + '"><small>上一課</small>L' + i + " " + prev.title + "</a>" : '<a href="' + root + '/index.html"><small>回到</small>首頁</a>') +
        (next ? '<a class="next" href="' + href(next) + '"><small>下一課</small>L' + (i + 2) + " " + next.title + "</a>" : '<a class="next" href="' + root + '/index.html"><small>回到</small>首頁</a>');
    }
  }

  // ===== 小測驗 =====
  var quizzes = document.querySelectorAll(".quiz");
  var score = document.querySelector(".score");
  var right = 0, done = 0;
  quizzes.forEach(function (q) {
    q.querySelectorAll(".options li").forEach(function (li) {
      li.addEventListener("click", function () {
        if (q.classList.contains("done")) return;
        var ok = li.dataset.key === q.dataset.answer;
        li.classList.add(ok ? "right" : "wrong");
        q.querySelector('li[data-key="' + q.dataset.answer + '"]').classList.add("right");
        q.classList.add("done");
        done++; if (ok) right++;
        if (score) score.textContent = "答對 " + right + " / " + quizzes.length + (done === quizzes.length ? "，全部做完了" : "");
      });
    });
  });

  // ===== 程式碼框：<pre class="py"> 只顯示，<pre class="py run"> 可以改、可以執行 =====
  document.querySelectorAll("pre.py").forEach(function (pre) {
    var run = pre.classList.contains("run");
    var box = document.createElement("div");
    box.className = "code-box";
    pre.parentNode.insertBefore(box, pre);
    var code = document.createElement("code");
    code.textContent = pre.textContent.replace(/^\n/, "").replace(/\s+$/, "");
    pre.textContent = "";
    pre.appendChild(code);
    var bar = document.createElement("div");
    bar.className = "code-bar";
    bar.innerHTML = "<span>" + (run ? "Python (可以直接改)" : "Python") + "</span>";
    box.appendChild(bar);
    box.appendChild(pre);
    if (!run) return;

    code.contentEditable = "true";
    code.spellcheck = false;
    var btn = document.createElement("button");
    btn.className = "run-btn";
    btn.textContent = "執行";
    btn.setAttribute("aria-label", "執行這段 Python");
    bar.appendChild(btn);
    var out = document.createElement("div");
    out.className = "output";
    box.appendChild(out);

    btn.addEventListener("click", function () {
      btn.disabled = true;
      out.className = "output";
      out.textContent = pyReady ? "" : "第一次執行要載入 Python，等幾秒...";
      runPython(code.innerText).then(function (r) {
        out.className = "output" + (r.err ? " err" : "");
        out.textContent = r.text || "(沒有輸出)";
        btn.disabled = false;
      });
    });
  });

  // ===== Pyodide：第一次按執行才載入 =====
  var PYODIDE = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/";
  var pyReady = null, pyPromise = null;

  function loadPy() {
    if (pyPromise) return pyPromise;
    pyPromise = new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = PYODIDE + "pyodide.js";
      s.onload = function () { window.loadPyodide({ indexURL: PYODIDE }).then(resolve, reject); };
      s.onerror = reject;
      document.head.appendChild(s);
    }).then(function (py) { pyReady = py; return py; });
    return pyPromise;
  }

  function runPython(src) {
    return loadPy().then(function (py) {
      var bytes = [];
      var push = function (c) { bytes.push(c); };
      py.setStdout({ raw: push });
      py.setStderr({ raw: push });
      py.setStdin({ stdin: function () { var v = window.prompt("input()"); return v === null ? "" : v; } });
      var ns = py.globals.get("dict")();
      var text = function () { return new TextDecoder().decode(new Uint8Array(bytes)).replace(/\s+$/, ""); };
      return py.runPythonAsync(src, { globals: ns }).then(function () {
        ns.destroy();
        return { text: text() };
      }, function (e) {
        ns.destroy();
        var lines = String(e.message).trim().split("\n");
        var before = text();
        return { text: (before ? before + "\n" : "") + lines[lines.length - 1], err: true };
      });
    }, function () {
      pyPromise = null;
      return { text: "Python 載入失敗，檢查網路再試一次", err: true };
    });
  }
})();
