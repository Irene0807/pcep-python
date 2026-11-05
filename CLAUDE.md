# PCEP Python 入門講義 — 專案說明

## 專案概述
PCEP（Python 入門證照）的線上講義，一課一頁，照官方 4 個 Block 排。
內容整理自 Irene 的 PCEP 課程講義（PDF / pptx），受眾是高中、大學初學者。
純 HTML + CSS + Vanilla JS，無框架依賴，可直接用瀏覽器開啟，部署在 GitHub Pages。

## 檔案架構

```
pcep-python/
├── index.html           ← 首頁（依 Block 列出課程卡片）
├── lessons/
│   ├── _template.html   ← 新課程的範本
│   ├── lesson-01.html   ← Python 基礎（Block 1）
│   ├── lesson-02.html   ← 判斷與迴圈（Block 2）
│   └── lesson-03.html   ← 資料集合（Block 3）
├── data/
│   └── lessons.js       ← 課程清單（BLOCKS、LESSONS）
├── assets/
│   ├── css/style.css    ← 全站樣式，顏色在最上面的 CSS 變數
│   └── js/main.js       ← 導覽列、首頁卡片、目錄、測驗、執行 Python（IIFE，非 ES module）
└── .claude/commands/add-lesson.md
```

## 開發指令

```bash
python3 -m http.server 8000   # 本地預覽，或直接點開 index.html
```

## 修改指引

### 新增一課
使用 `/add-lesson <講義檔或主題>` 指令，或照以下步驟：
1. 複製 `lessons/_template.html` 為 `lessons/lesson-XX.html`（XX 兩位數）
2. 把 `<body data-lesson="lesson-XX">` 改成同一個 id
3. 在 `data/lessons.js` 的 `LESSONS` 最後加一筆：
   ```js
   { id: "lesson-04", block: 4, title: "函式與例外",
     summary: "一行簡介", topics: ["def", "return", "try"] }
   ```
4. 首頁卡片、導覽列、上一課/下一課、目錄都由 `main.js` 自動產生，不用改其他頁
5. 用 `python3` 跑過每段範例，確認輸出跟測驗答案一致

### 每課固定結構
依序：`lesson-head`（標題）→ `goals`（學習目標 3-5 點）→ 觀念（`h2` 小節 `sec-1`、`h3` 觀念 `sec-1-1`）→ `traps`（常見陷阱，至少 3 個）→ `quiz`（小測驗，至少 5 題）→ `pager`（留空）。

### 元件寫法（class 照用，不要新增）
- 只顯示的程式：`<pre class="py">...</pre>`
- 可改、可執行的程式：`<pre class="py run">...</pre>`，裡面的 `<` 要寫成 `&lt;`
- 陷阱：`<div class="trap"><h4>標題</h4><p>說明</p><pre class="py run">...</pre></div>`
- 測驗：`<div class="quiz" data-answer="B">`，內含 `p.q`、`ol.options > li[data-key]`（A-D）、`p.explain`

### 新增 Block
在 `data/lessons.js` 的 `BLOCKS` 加一筆 `{ no, en, zh }`（例如之後延伸到 PCAP）。

### 修改配色
所有顏色透過 `assets/css/style.css` 頂部的 CSS Variables 統一控制。
風格仿 Python 官方文件：白底、導覽列 `#2b5b84`、連結 `#0072aa`、程式框淺綠 `#eeffcc`、陷阱橘色 Warning 框 `#f0b37e`。
不用陰影、漸層、大圓角、卡片，維持文件感。

### 執行 Python
`main.js` 在第一次按「執行」時才從 jsDelivr 載入 Pyodide（v0.26.4），每段程式獨立執行。
`input()` 會跳瀏覽器 prompt，範例盡量不要用。

## 設計原則
- 內容不超出 PCEP 範圍，講義有錯要改正
- 每個觀念都要有可執行的範例，測驗答案要分散在 A-D
- 不加框架、套件、API key
- 不用 `fetch()`，資料放在 `.js` 檔，維持 `file://` 可開
- 表格使用 `scope` 屬性，按鈕要有 `aria-label`
- 響應式設計，800px 以下隱藏目錄
