// 課程清單：首頁卡片、導覽列、上一課/下一課都讀這裡
// 新增一課 = 在 LESSONS 最後加一筆
window.BLOCKS = [
  { no: 1, en: "Computer Programming and Python Fundamentals", zh: "程式基礎" },
  { no: 2, en: "Control Flow - Conditional Blocks and Loops", zh: "判斷與迴圈" },
  { no: 3, en: "Data Collections - Tuples, Dictionaries, Lists, and Strings", zh: "資料集合" },
  { no: 4, en: "Functions and Exceptions", zh: "函式與例外" }
];

window.LESSONS = [
  {
    id: "lesson-01",
    block: 1,
    title: "Python 基礎",
    summary: "編譯 vs 直譯、資料型態、進位、運算子優先級、print / input",
    topics: ["編譯/直譯", "資料型態", "進位", "運算子", "型態轉換"]
  },
  {
    id: "lesson-02",
    block: 2,
    title: "判斷與迴圈",
    summary: "if / elif / else、while、for + range、break / continue / pass",
    topics: ["if", "while", "for", "range", "break"]
  },
  {
    id: "lesson-03",
    block: 3,
    title: "資料集合",
    summary: "list、tuple、dict、string 的操作跟差別",
    topics: ["list", "tuple", "dict", "string"]
  }
];
