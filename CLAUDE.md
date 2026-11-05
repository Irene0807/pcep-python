# PCEP Python 入門講義 — 專案規則

AI 修改或新增內容前先讀完這份。所有規則以這份為準，跟這份衝突的寫法都不要用

## 1. 專案目的

- PCEP (Python 入門證照) 的線上講義，一課一頁
- 受眾：高中 / 大學初學者，第一次學程式
- 內容來源：Irene 自己的 PCEP 課程講義 (PDF / pptx)，照官方 4 個 Block 排
- 重點：看完能直接在網頁上改程式、按執行、做測驗，不用裝 Python
- 長期目標：Block 1-4 都有課，之後可以照同一套規則延伸到 PCAP

## 2. 技術限制

- 純 HTML + CSS + Vanilla JS，不用任何框架、不用 build、不用 npm
- JS 用 IIFE，不用 ES module (要能直接點開 `file://` 跑)
- 不用 `fetch()` 讀資料，資料放 `.js` 檔掛在 `window` 上 (同樣是為了 `file://`)
- 外部資源只有 Pyodide (`cdn.jsdelivr.net/pyodide/v0.26.4`)，而且第一次按「執行」才載入
- 不放任何 API key、帳號密碼、後端
- 部署：GitHub Pages，從 repo 根目錄 (`main` branch / root)

## 3. 檔案結構

```
pcep-python/
├── CLAUDE.md               # 本檔
├── README.md
├── CHANGELOG.md            # 每次新增/修改都記一行
├── index.html              # 首頁：依 Block 列課程卡片 (JS 自動產生)
├── lessons/
│   ├── _template.html      # 新課程一律從這裡複製
│   ├── lesson-01.html
│   └── lesson-02.html ...
├── data/
│   └── lessons.js          # 課程清單 (BLOCKS、LESSONS)
├── assets/
│   ├── css/style.css       # 全站唯一 CSS
│   └── js/main.js          # 全站唯一 JS
└── .claude/commands/
    └── add-lesson.md       # /add-lesson 指令
```

- 不要新增其他 CSS / JS 檔，要加樣式就加在 `style.css`，要加功能就加在 `main.js`
- 圖片如果真的需要，放 `assets/img/lesson-XX-名稱.png`

## 4. 命名規則

- 課程檔：`lessons/lesson-XX.html`，XX 兩位數 (`lesson-03`、`lesson-12`)
- 課程 id = 檔名去掉 `.html`，三個地方要一樣：
  - 檔名 `lesson-03.html`
  - `<body data-lesson="lesson-03">`
  - `data/lessons.js` 的 `id: "lesson-03"`
- 標題 id：小節 `sec-1`、`sec-2`；小節底下 `sec-1-1`、`sec-1-2`；固定段落用 `traps`、`quiz`
- CSS class 用小寫加 `-` (`code-box`、`lesson-head`)

## 5. 課程清單 (data/lessons.js)

首頁卡片、導覽列、上一課/下一課、頁面標題都從這裡產生，**不要手動在 HTML 裡寫這些連結**

```js
{
  id: "lesson-03",          // 跟檔名一樣
  block: 3,                 // 屬於哪個 Block (1-4)
  title: "資料集合",         // 4-8 個字
  summary: "list、tuple、dict、string 的操作跟差別",  // 一行，30 字以內
  topics: ["list", "tuple", "dict", "string"]          // 3-5 個，首頁卡片的 tag
}
```

- 新的一課加在陣列最後，順序 = 課程編號
- 要開新的 Block (例如 PCAP)，在 `BLOCKS` 加一筆 `{ no, en, zh }`

## 6. 講義頁結構

每一課都固定這個順序，不能少、不能換位置：

1. `lesson-head`：`h1` 標題 + 一句話說這課在幹嘛 (`block-tag` 留空，JS 會填)
2. `goals`：「這課學完會」，3-5 點，動詞開頭 (「會寫」「分得出」「知道」)
3. 觀念：照講義的小節分 `h2`，標題格式「X.Y 小節名稱」(X = 課號)，底下每個觀念一個 `h3`
4. `traps`：常見陷阱，至少 3 個
5. `quiz`：小測驗，至少 5 題
6. `pager`：留空，JS 會填上一課/下一課

## 7. 內容寫法

- 繁體中文，程式碼、變數、輸出都用英文
- 像筆記，不像課本：每個觀念用 `ul` 列 2-5 點短句，不寫長段落
- 不用 emoji，箭頭用 `->`
- 專有名詞第一次出現可以中英並列 (「編譯 Compilation」)，之後擇一
- 每個 `h3` 觀念底下至少一段程式範例，盡量用 `run`
- 範例要短：5-10 行，一段只示範一件事，用 `print()` 把結果印出來
- 可以執行的範例不要用 `input()`，真的要示範 input 就單獨一段 (網頁會跳 prompt 視窗)
- 比較型的內容 (A vs B) 可以用 `table`，`th` 一定要有 `scope`
- 內容不能超出 PCEP 範圍，講義沒教的不要自己加
- 講義有錯的地方要改成正確的 (例如 CPython 是 C 寫的，不是 C++)

## 8. HTML 元件

直接複製用，不要自己發明新的 class

程式範例 (只顯示)：
```html
<pre class="py">
print("hello")
</pre>
```

程式範例 (可以改、可以執行)：
```html
<pre class="py run">
for i in range(3):
    print(i)
</pre>
```
- `<pre>` 裡的 `<` 一定要寫成 `&lt;`、`&` 寫成 `&amp;`，`>` 可以直接寫
- 程式從 `<pre>` 下一行開始寫，不要縮排 (JS 會把開頭換行去掉)

常見陷阱：
```html
<div class="trap">
  <h4>陷阱標題 (10 字內)</h4>
  <p>一句話說哪裡會錯</p>
  <pre class="py run">
print(-7 // 2)
</pre>
</div>
```
- 挑 PCEP 考試真的會考、初學者最常錯的
- 每個陷阱都要附一段能跑的程式，讓學生自己按按看

小測驗：
```html
<div class="quiz" data-answer="B">
  <p class="q">1. 下面程式會印出什麼？</p>
  <pre class="py">
print(2 ** 3 ** 2)
</pre>
  <ol class="options">
    <li data-key="A">64</li>
    <li data-key="B">512</li>
    <li data-key="C">81</li>
    <li data-key="D">Error</li>
  </ol>
  <p class="explain">解析：** 由右往左，3 ** 2 = 9，2 ** 9 = 512</p>
</div>
```
- 一律 4 個選項 A-D，`data-answer` 填正確的那個
- 題目裡的程式用 `<pre class="py">` (不能執行，不然就直接看到答案)
- 答案不要全部都是同一個字母，A-D 分散
- 錯的選項要是「初學者真的會選的錯」，不要放明顯亂掰的
- `explain` 用「解析：」開頭，一兩句說為什麼
- 測驗區上面固定放 `<p class="score">點選項作答，會直接顯示對錯</p>`

行內程式碼用 `<code>`，例如 `<code>range()</code>`

## 9. 風格

改顏色、字型只改 `style.css` 最上面的 CSS 變數，不要在別的地方寫死顏色

- 深色主題，底色 `#0f172a`、卡片 `#1e293b`、程式碼底 `#0b1220`、邊框 `#334155`
- 文字 `#f1f5f9`、次要文字 `#94a3b8`
- 主色 Python 藍 `#3b82f6` (連結、按鈕、清單點點)、強調色 Python 黃 `#facc15` (h3、行內 code、Block 編號)
- 陷阱 `#f59e0b` 橘色框、測驗答對 `#10b981` 綠、答錯 `#ef4444` 紅
- 字型：中文 PingFang TC / Microsoft JhengHei；程式碼 JetBrains Mono / Menlo
- 圓角 10px (卡片、程式框)、6px (按鈕、選項)、999px (tag)
- 不用陰影分層，用 1px 邊框
- 動畫只有 hover 換邊框色、卡片上移 2px，要支援 `prefers-reduced-motion`
- 手機 (800px 以下) 隱藏左邊目錄，內容單欄

## 10. 新增一課的流程

使用者給講義 PDF / pptx (或只給主題) 時，照這個順序做：

1. 讀講義，列出小節跟重點，先給使用者看大綱
2. 複製 `lessons/_template.html` -> `lessons/lesson-XX.html`
3. 改 `data-lesson`，照第 6、7、8 節填內容
4. `data/lessons.js` 的 `LESSONS` 最後加一筆
5. 每段程式範例都用 `python3` 實際跑過，確認輸出跟講義、測驗答案一致
6. 用瀏覽器開首頁跟新頁面檢查：卡片有出現、目錄連得到、執行按鈕會跑、測驗會判對錯
7. `CHANGELOG.md` 加一行

也可以直接用 `/add-lesson <講義檔或主題>`

## 11. AI 不能做的事

- 不要改 `main.js`、`style.css` 的既有行為，除非使用者明確要求
- 不要為了某一課加專用的 CSS / JS
- 不要動其他課的內容 (只改使用者指定的那課)
- 不要刪 `_template.html`，要改版型時先改 template，再同步到每一課
- 不要加框架、套件、追蹤碼、廣告
- 不要寫「待補」「coming soon」這種佔位內容，沒寫完就不要加進 `lessons.js`
- 不確定講義意思就問，不要猜
