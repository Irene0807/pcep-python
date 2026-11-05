---
description: 新增一課講義（HTML 頁面 + lessons.js 資料）
---

使用方式：`/add-lesson <講義檔或主題>`

例如：`/add-lesson PCEP_lesson4.pdf`

執行步驟：

1. 讀講義，列出小節與重點給使用者確認
2. 依 `CLAUDE.md`「修改指引 > 新增一課」建立 `lessons/lesson-XX.html` 並更新 `data/lessons.js`
3. 內容照「每課固定結構」與「元件寫法」
4. 用 `python3` 驗證所有範例輸出
