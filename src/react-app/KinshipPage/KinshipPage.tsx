import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import Header from "../components/Header";

// --- 型別與資料結構 ---
export type Step =
  | "f" // 爸爸
  | "m" // 媽媽
  | "h" // 老公
  | "w" // 老婆
  | "s" // 兒子
  | "d" // 女兒
  | "ob" // 單步：哥哥
  | "lb" // 單步：弟弟
  | "os" // 單步：姐姐
  | "ls"; // 單步：妹妹

type Gender = "male" | "female";
type OlderYounger = "older" | "younger" | "unknown";

interface RenderCtx {
  me: Gender;
  target: Gender | "unknown";
  older: OlderYounger;
}

// ─────────────────────────────────────────────────────────────
// 規則表（保持不變）
const DICT: Record<string, string | ((ctx: RenderCtx) => string)> = {
  // ── 單步（末端已定性別） ──
  f: "爸爸",
  m: "媽媽",
  h: "老公",
  w: "老婆",
  s: "兒子",
  d: "女兒",
  ob: "哥哥",
  lb: "弟弟",
  os: "姐姐",
  ls: "妹妹",

  // ── 直系 ──
  "f.f": "爺爺",
  "f.m": "奶奶",
  "m.f": "外公",
  "m.m": "外婆",

  // 曾祖
  "f.f.f": "曾祖父",
  "f.f.m": "曾祖母",
  "f.m.f": "曾外祖父",
  "f.m.m": "曾外祖母",
  "m.f.f": "外曾祖父",
  "m.f.m": "外曾祖母",
  "m.m.f": "外曾祖父",
  "m.m.m": "外曾外祖母",

  // 高祖（曾祖的父母）
  "f.f.f.f": "高祖父",
  "f.f.f.m": "高祖母",
  "f.f.m.f": "高外祖父",
  "f.f.m.m": "高外祖母",
  "f.m.f.f": "高外祖父",
  "f.m.f.m": "高外祖母",
  "f.m.m.f": "高外祖父",
  "f.m.m.m": "高外祖母",
  "m.f.f.f": "外高祖父",
  "m.f.f.m": "外高祖母",
  "m.f.m.f": "外高外祖父",
  "m.f.m.m": "外高外祖母",
  "m.m.f.f": "外高祖父",
  "m.m.f.m": "外高祖母",
  "m.m.m.f": "外高外祖父",
  "m.m.m.m": "外高外祖母",

  // ── 父系叔伯姑 + 配偶 ──
  "f.ob": "伯父",
  "f.lb": "叔叔",
  "f.os": "姑姑",
  "f.ls": "姑姑", // 新增：父親的妹妹（與姐姐同稱謂）
  "f.ob.w": "伯母",
  "f.lb.w": "嬸嬸",
  "f.os.h": "姑丈",
  "f.ls.h": "姑丈", // 新增：父親妹妹的丈夫（與姐姐丈夫同稱謂）

  // ── 母系舅姨 + 配偶 ──
  "m.ob": "舅舅",
  "m.lb": "舅舅", // 新增：母親的弟弟（與哥哥同稱謂）
  "m.os": "阿姨",
  "m.ls": "阿姨", // 新增：母親的妹妹（與姐姐同稱謂）
  "m.ob.w": "舅媽",
  "m.lb.w": "舅媽", // 新增：母親弟弟的妻子（與哥哥妻子同稱謂）
  "m.os.h": "姨丈",
  "m.ls.h": "姨丈", // 新增：母親妹妹的丈夫（與姐姐丈夫同稱謂）

  // ── 兄姊 + 配偶 ──
  "ob.w": "嫂嫂",
  "lb.w": "弟妹",
  "os.h": "姐夫",
  "ls.h": "妹夫",

  // ── 子女 + 配偶 ──
  "s.w": "媳婦",
  "d.h": "女婿",

  // ── 侄／外甥 + 配偶 ──
  "ob.s": "侄子",
  "ob.d": "侄女",
  "lb.s": "侄子",
  "lb.d": "侄女",
  "os.s": "外甥",
  "os.d": "外甥女",
  "ls.s": "外甥",
  "ls.d": "外甥女",
  "ob.s.w": "侄媳婦",
  "ob.d.h": "侄女婿",
  "lb.s.w": "侄媳婦",
  "lb.d.h": "侄女婿",
  "os.s.w": "外甥媳婦",
  "os.d.h": "外甥女婿",
  "ls.s.w": "外甥媳婦",
  "ls.d.h": "外甥女婿",

  // ── 孫／外孫 + 配偶 ──
  "s.s": "孫子",
  "s.d": "孫女",
  "d.s": "外孫",
  "d.d": "外孫女",
  "s.s.w": "孫媳婦",
  "s.d.h": "孫女婿",
  "d.s.w": "外孫媳婦",
  "d.d.h": "外孫女婿",

  // 曾孫
  "s.s.s": "曾孫",
  "s.s.d": "曾孫女",
  "s.d.s": "曾外孫",
  "s.d.d": "曾外孫女",
  "d.s.s": "曾外孫",
  "d.s.d": "曾外孫女",
  "d.d.s": "曾外孫",
  "d.d.d": "曾外孫女",

  // 玄孫（曾孫的子女）
  "s.s.s.s": "玄孫",
  "s.s.s.d": "玄孫女",
  "s.s.d.s": "玄外孫",
  "s.s.d.d": "玄外孫女",
  "s.d.s.s": "玄外孫",
  "s.d.s.d": "玄外孫女",
  "s.d.d.s": "玄外孫",
  "s.d.d.d": "玄外孫女",
  "d.s.s.s": "玄外孫",
  "d.s.s.d": "玄外孫女",
  "d.s.d.s": "玄外孫",
  "d.s.d.d": "玄外孫女",
  "d.d.s.s": "玄外孫",
  "d.d.s.d": "玄外孫女",
  "d.d.d.s": "玄外孫",
  "d.d.d.d": "玄外孫女",

  // ── 堂／表兄弟姊妹（依 older） ──
  // 父系堂
  "f.ob.s": (ctx) =>
    ctx.older === "older" ? "堂哥" : ctx.older === "younger" ? "堂弟" : "堂兄弟",
  "f.ob.d": (ctx) =>
    ctx.older === "older" ? "堂姐" : ctx.older === "younger" ? "堂妹" : "堂姐妹",
  "f.lb.s": (ctx) =>
    ctx.older === "older" ? "堂哥" : ctx.older === "younger" ? "堂弟" : "堂兄弟",
  "f.lb.d": (ctx) =>
    ctx.older === "older" ? "堂姐" : ctx.older === "younger" ? "堂妹" : "堂姐妹",

  // 表（父姑、母舅、母姨）
  "f.os.s": (ctx) =>
    ctx.older === "older" ? "表哥" : ctx.older === "younger" ? "表弟" : "表兄弟",
  "f.os.d": (ctx) =>
    ctx.older === "older" ? "表姐" : ctx.older === "younger" ? "表妹" : "表姐妹",
  "f.ls.s": (ctx) => // 新增：父親妹妹的兒子（與姐姐兒子同稱謂）
    ctx.older === "older" ? "表哥" : ctx.older === "younger" ? "表弟" : "表兄弟",
  "f.ls.d": (ctx) => // 新增：父親妹妹的女兒（與姐姐女兒同稱謂）
    ctx.older === "older" ? "表姐" : ctx.older === "younger" ? "表妹" : "表姐妹",
  "m.ob.s": (ctx) =>
    ctx.older === "older" ? "表哥" : ctx.older === "younger" ? "表弟" : "表兄弟",
  "m.ob.d": (ctx) =>
    ctx.older === "older" ? "表姐" : ctx.older === "younger" ? "表妹" : "表姐妹",
  "m.lb.s": (ctx) => // 新增：母親弟弟的兒子（與哥哥兒子同稱謂）
    ctx.older === "older" ? "表哥" : ctx.older === "younger" ? "表弟" : "表兄弟",
  "m.lb.d": (ctx) => // 新增：母親弟弟的女兒（與哥哥女兒同稱謂）
    ctx.older === "older" ? "表姐" : ctx.older === "younger" ? "表妹" : "表姐妹",
  "m.os.s": (ctx) =>
    ctx.older === "older" ? "表哥" : ctx.older === "younger" ? "表弟" : "表兄弟",
  "m.os.d": (ctx) =>
    ctx.older === "older" ? "表姐" : ctx.older === "younger" ? "表妹" : "表姐妹",
  "m.ls.s": (ctx) => // 新增：母親妹妹的兒子（與姐姐兒子同稱謂）
    ctx.older === "older" ? "表哥" : ctx.older === "younger" ? "表弟" : "表兄弟",
  "m.ls.d": (ctx) => // 新增：母親妹妹的女兒（與姐姐女兒同稱謂）
    ctx.older === "older" ? "表姐" : ctx.older === "younger" ? "表妹" : "表姐妹",

  // 堂／表配偶
  "f.ob.s.w": (ctx) =>
    ctx.older === "older" ? "堂嫂" : ctx.older === "younger" ? "堂弟妹" : "堂兄弟之妻",
  "f.lb.s.w": (ctx) =>
    ctx.older === "older" ? "堂嫂" : ctx.older === "younger" ? "堂弟妹" : "堂兄弟之妻",
  "f.ob.d.h": (ctx) =>
    ctx.older === "older" ? "堂姊夫" : ctx.older === "younger" ? "堂妹夫" : "堂姐妹之夫",
  "f.lb.d.h": (ctx) =>
    ctx.older === "older" ? "堂姊夫" : ctx.older === "younger" ? "堂妹夫" : "堂姐妹之夫",
  "f.os.s.w": (ctx) =>
    ctx.older === "older" ? "表嫂" : ctx.older === "younger" ? "表弟妹" : "表兄弟之妻",
  "f.ls.s.w": (ctx) => // 新增：父親妹妹兒子的妻子（與姐姐兒子妻子同稱謂）
    ctx.older === "older" ? "表嫂" : ctx.older === "younger" ? "表弟妹" : "表兄弟之妻",
  "m.ob.s.w": (ctx) =>
    ctx.older === "older" ? "表嫂" : ctx.older === "younger" ? "表弟妹" : "表兄弟之妻",
  "m.lb.s.w": (ctx) => // 新增：母親弟弟兒子的妻子（與哥哥兒子妻子同稱謂）
    ctx.older === "older" ? "表嫂" : ctx.older === "younger" ? "表弟妹" : "表兄弟之妻",
  "f.os.d.h": (ctx) =>
    ctx.older === "older" ? "表姊夫" : ctx.older === "younger" ? "表妹夫" : "表姐妹之夫",
  "f.ls.d.h": (ctx) => // 新增：父親妹妹女兒的丈夫（與姐姐女兒丈夫同稱謂）
    ctx.older === "older" ? "表姊夫" : ctx.older === "younger" ? "表妹夫" : "表姐妹之夫",
  "m.ob.d.h": (ctx) =>
    ctx.older === "older" ? "表姊夫" : ctx.older === "younger" ? "表妹夫" : "表姐妹之夫",
  "m.lb.d.h": (ctx) => // 新增：母親弟弟女兒的丈夫（與哥哥女兒丈夫同稱謂）
    ctx.older === "older" ? "表姊夫" : ctx.older === "younger" ? "表妹夫" : "表姐妹之夫",
  "m.os.d.h": (ctx) => // 新增：母親姐姐女兒的丈夫（原缺失）
    ctx.older === "older" ? "表姊夫" : ctx.older === "younger" ? "表妹夫" : "表姐妹之夫",
  "m.ls.d.h": (ctx) => // 新增：母親妹妹女兒的丈夫（與姐姐女兒丈夫同稱謂）
    ctx.older === "older" ? "表姊夫" : ctx.older === "younger" ? "表妹夫" : "表姐妹之夫",

  // 堂／表侄輩
  "f.ob.s.s": "堂侄",
  "f.ob.s.d": "堂侄女",
  "f.lb.s.s": "堂侄",
  "f.lb.s.d": "堂侄女",
  "f.os.s.s": "表侄",
  "f.os.s.d": "表侄女",
  "f.ls.s.s": "表侄", // 新增：父親妹妹兒子的兒子
  "f.ls.s.d": "表侄女", // 新增：父親妹妹兒子的女兒
  "m.ob.s.s": "表侄",
  "m.ob.s.d": "表侄女",
  "m.lb.s.s": "表侄", // 新增：母親弟弟兒子的兒子
  "m.lb.s.d": "表侄女", // 新增：母親弟弟兒子的女兒
  "m.os.s.s": "表侄",
  "m.os.s.d": "表侄女",
  "m.ls.s.s": "表侄", // 新增：母親妹妹兒子的兒子
  "m.ls.s.d": "表侄女", // 新增：母親妹妹兒子的女兒

  // 堂／表孫輩
  "f.ob.s.s.s": "堂孫",
  "f.ob.s.s.d": "堂孫女",
  "f.os.s.s.s": "表孫",
  "f.os.s.s.d": "表孫女",
  "f.ls.s.s.s": "表孫", // 新增：父親妹妹兒子的孫子
  "f.ls.s.s.d": "表孫女", // 新增：父親妹妹兒子的孫女
  "m.ob.s.s.s": "表孫",
  "m.ob.s.s.d": "表孫女",
  "m.lb.s.s.s": "表孫", // 新增：母親弟弟兒子的孫子
  "m.lb.s.s.d": "表孫女", // 新增：母親弟弟兒子的孫女

  // ── 姻親（配偶直系） ──
  "h.f": "公公",
  "h.m": "婆婆",
  "w.f": "岳父",
  "w.m": "岳母",

  // 配偶祖父母（常見）
  "h.f.f": "祖公",
  "h.f.m": "祖婆",
  "h.m.f": "祖公",
  "h.m.m": "祖婆",
  "w.f.f": "祖丈人",
  "w.f.m": "祖丈母",
  "w.m.f": "祖丈人",
  "w.m.m": "祖丈母",

  // 配偶高祖輩
  "h.f.f.f": "高祖父",
  "h.f.f.m": "高祖母",
  "w.f.f.f": "外高祖父",
  "w.f.f.m": "外高祖母",

  // 配偶兄弟姊妹（依 older）
  "h.ob": (ctx) =>
    ctx.older === "older" ? "大伯子" : ctx.older === "younger" ? "小叔子" : "伯叔子",
  "h.lb": "小叔子",
  "h.os": (ctx) =>
    ctx.older === "older" ? "大姑子" : ctx.older === "younger" ? "小姑子" : "姑子",
  "h.ls": "小姑子",
  "w.ob": (ctx) =>
    ctx.older === "older" ? "大舅子" : ctx.older === "younger" ? "小舅子" : "舅子",
  "w.lb": "小舅子",
  "w.os": (ctx) =>
    ctx.older === "older" ? "大姨子" : ctx.older === "younger" ? "小姨子" : "姨子",
  "w.ls": "小姨子",

  // 配偶兄弟姊妹的配偶（常見）
  "h.ob.w": "伯嫂",
  "h.lb.w": "叔母",
  "h.os.h": "姑丈",
  "h.ls.h": "姑丈",
  "w.ob.w": "舅媽",
  "w.lb.w": "舅媽",
  "w.os.h": "姨丈",
  "w.ls.h": "姨丈",

  // 配偶的叔伯姑舅姨
  "h.f.ob": "大伯公",
  "h.f.lb": "小叔公",
  "h.f.os": "大姑婆",
  "h.f.ls": "小姑婆", // 新增：丈夫父親的妹妹
  "h.m.ob": "大舅公",
  "h.m.lb": "小舅公", // 新增：丈夫母親的弟弟
  "h.m.os": "大姨婆",
  "h.m.ls": "小姨婆", // 新增：丈夫母親的妹妹
  "w.f.ob": "大伯丈人",
  "w.f.lb": "小叔丈人", // 新增：妻子父親的弟弟
  "w.f.os": "大姑丈母",
  "w.f.ls": "小姑丈母", // 新增：妻子父親的妹妹
  "w.m.ob": "大舅丈人",
  "w.m.lb": "小舅丈人", // 新增：妻子母親的弟弟
  "w.m.os": "大姨丈母",
  "w.m.ls": "小姨丈母", // 新增：妻子母親的妹妹

  // 兒女的配偶之父母（親家）
  "s.w.f": "親家公",
  "s.w.m": "親家母",
  "d.h.f": "親家公",
  "d.h.m": "親家母",

  // 孫輩配偶之父母
  "s.s.w.f": "孫親家公",
  "s.s.w.m": "孫親家母",
  "d.s.w.f": "外孫親家公",
  "d.s.w.m": "外孫親家母",

  // ── 父母的子女（需分長幼！）──
  "f.s": (ctx) =>
    ctx.older === "older" ? "哥哥" : ctx.older === "younger" ? "弟弟" : "兄弟",
  "m.s": (ctx) =>
    ctx.older === "older" ? "哥哥" : ctx.older === "younger" ? "弟弟" : "兄弟",
  "f.d": (ctx) =>
    ctx.older === "older" ? "姐姐" : ctx.older === "younger" ? "妹妹" : "姊妹",
  "m.d": (ctx) =>
    ctx.older === "older" ? "姐姐" : ctx.older === "younger" ? "妹妹" : "姊妹",

  // 兄弟姐妹的孫輩
  "ob.s.s": "侄孫",
  "ob.d.s": "侄外孫",
  "lb.s.s": "侄孫", // 新增：弟弟兒子的兒子
  "lb.d.s": "侄外孫", // 新增：弟弟女兒的兒子
  "os.s.s": "甥孫",
  "os.d.s": "甥外孫",
  "ls.s.s": "甥孫", // 新增：妹妹兒子的兒子
  "ls.d.s": "甥外孫", // 新增：妹妹女兒的兒子

  // ── 規範化等價鏈 ──
  "m.h": "爸爸",
  "f.w": "媽媽",
  "h前妻.s": "繼子",
  "w前夫.d": "繼女",
  "f.h": "繼父",
  "m.w": "繼母",
};


// ---------- Ridiculous Input Detection ----------
interface RidiculousPattern {
  check: (path: Step[]) => boolean;
  message: string;
}

const RIDICULOUS_PATTERNS: RidiculousPattern[] = [
  // 1. 過長路徑 (8+ 步驟)
  {
    check: (path) => path.length >= 8,
    message: "哇！這親戚關係快長成家族史小說了～ 建議先喝杯茶再數，小心數到頭暈哦！😵"
  },
  // 2. 所有步驟相同 (例如 "f.f.f.f.f...")
  {
    check: (path) => path.length >= 6 && new Set(path).size === 1,
    message: "你這是在疊羅漢嗎？全是「爸爸的爸爸的爸爸...」再數下去該叫「祖宗十八代限定版」啦！👴👵"
  },
  // 3. 配偶循環 (h.w.h.w...)
  {
    check: (path) => {
      const subPath = path.join(".");
      return /(h\.w|w\.h){3,}/.test(subPath);
    },
    message: "夫妻互換循環中... 最後發現數到自己了？建議直接叫「親愛的」更省事～ 💑"
  },
  // 4. 親子循環 (f.s.f.s... 或 m.d.m.d...)
  {
    check: (path) => {
      const subPath = path.join(".");
      return /(f\.s|s\.f|m\.d|d\.m){3,}/.test(subPath);
    },
    message: "爺爺→爸爸→爺爺→爸爸... 這是在玩家族時光機嗎？小心穿越到古代當太子哦！👑"
  },
  // 5. 兄弟姐妹無限循環 (ob.lb.ob.lb...)
  {
    check: (path) => {
      const subPath = path.join(".");
      return /(ob\.lb|lb\.ob|os\.ls|ls\.os){3,}/.test(subPath);
    },
    message: "哥哥→弟弟→哥哥→弟弟... 你家是在開兄弟連續劇嗎？下集該輪到「哥哥的弟弟的表哥」登場了！👬"
  },
  // 6. 性別矛盾步驟
  {
    check: (path) => {
      for (let i = 0; i < path.length - 1; i++) {
        const current = path[i];
        const next = path[i + 1];
        if ((current === "os" || current === "ls") && (next === "ob" || next === "lb") && path.length > 5) {
          return true;
        }
      }
      return false;
    },
    message: "姐姐的哥哥的妹妹的弟弟... 你家兄弟姐妹是在玩接力賽嗎？建議直接建個家族運動會～ 🏃"
  },
  // 7. 自我參照循環
  {
    check: (path) => {
      const subPath = path.join(".");
      return /(s\.f|d\.m){4,}/.test(subPath);
    },
    message: "兒子的爸爸→我→兒子的爸爸→我... 你這是在跟自己認親嗎？建議給自己發個「最佳親屬獎」🏆"
  },
  // 8. 不合理的輩分跳躍
  {
    check: (path) => {
      const generations = path.filter(step => ["f", "m", "s", "d"].includes(step));
      return generations.length > 6 && new Set(generations).size > 3;
    },
    message: "爺爺的外婆的兒子的女兒... 這輩分亂得像拼圖！建議先畫張家族樹，再來挑戰～ 🎨"
  }
];

function detectRidiculousPath(path: Step[]): string | null {
  for (const pattern of RIDICULOUS_PATTERNS) {
    if (pattern.check(path)) {
      return pattern.message;
    }
  }
  return null;
}

// ---------- 自定義防抖函數 (替代 Lodash 的 debounce) ----------
function useDebounce(callback: (...args: any[]) => void, delay: number) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback((...args: any[]) => {
    // 如果已有定時器，清除它
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // 設置新的定時器
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
}

// ---------- 路徑簡化（Normalization） ----------
function normalizePath(path: Step[]): Step[] {
  const stack: Step[] = [];
  for (const step of path) {
    const prev = stack[stack.length - 1]; // 上一步驟
    const prevPrev = stack.length >= 2 ? stack[stack.length - 2] : null; // 上上个步驟

    // 1. 基礎等價關係簡化
    // 母親的丈夫 → 父親；父親的妻子 → 母親
    if (prev === "m" && step === "h") {
      stack.pop();
      stack.push("f");
      continue;
    }
    if (prev === "f" && step === "w") {
      stack.pop();
      stack.push("m");
      continue;
    }
    // 配偶互消（丈夫的妻子/妻子的丈夫 = 自己）
    if ((prev === "h" && step === "w") || (prev === "w" && step === "h")) {
      stack.pop();
      continue;
    }

    // 2. 父母子女的兄弟姐妹 → 自己的兄弟姐妹（通用化）
    // 例：f.s.ob → ob（父親的兒子的哥哥 = 自己的哥哥）；m.d.lb → lb（母親的女兒的弟弟 = 自己的弟弟）
    if (
      (prevPrev === "f" || prevPrev === "m") && // 前兩步是父母
      (prev === "s" || prev === "d") && // 前一步是子女（即自己的兄弟姐妹）
      ["ob", "lb", "os", "ls"].includes(step) // 當前步是兄弟姐妹的長幼關係
    ) {
      stack.pop(); // 移除「子女」步驟（s/d）
      stack.pop(); // 移除「父母」步驟（f/m）
      stack.push(step); // 保留長幼關係（ob/lb/os/ls）
      continue;
    }

    // 3. 子女的父母 → 自己的親屬（取消多餘的「子女」步驟）
    // 例：ob.s.f → ob（哥哥的兒子的父親 = 哥哥）；os.d.m → os（姐姐的女兒的母親 = 姐姐）
    if ((prev === "s" && step === "f") || (prev === "d" && step === "m")) {
      stack.pop(); // 移除「子女」步驟（s/d）
      continue;
    }

    if ((prev === "ls" && step === "ls") || (prev === "os" && step === "os") || (prev === "ob" && step === "ob") || (prev === "lb" && step === "lb")) {
      stack.pop();
      stack.push(step);
      continue;
    }

    // 無簡化則保留當前步驟
    stack.push(step);
  }
  return stack;
}

// ---------- 其餘工具函數（保持不變） ----------
function terminalGenderFromStep(s?: Step): Gender | undefined {
  switch (s) {
    case "f": case "h": case "s": case "ob": case "lb": return "male";
    case "m": case "w": case "d": case "os": case "ls": return "female";
    default: return undefined;
  }
}

function renderTerm(path: Step[], ctx: RenderCtx): string {
  const key = path.join(".");
  const rule = DICT[key];
  if (path.length === 0) return "—";
  if (!rule) return `未定義(${key})`;
  return typeof rule === "function" ? (rule as any)(ctx) : rule;
}

function ruleUsesOlder(key: string): boolean {
  const rule = DICT[key];
  if (typeof rule !== "function") return false;
  const baseCtx: RenderCtx = { me: "male", target: "male", older: "older" };
  const a = (rule as any)({ ...baseCtx, older: "older" });
  const b = (rule as any)({ ...baseCtx, older: "younger" });
  return a !== b;
}

function needsOlderChoice(path: Step[]): boolean {
  if (!path.length) return false;
  return ruleUsesOlder(path.join("."));
}

function needsTargetGenderChoice(path: Step[], currentTarget: Gender | "unknown"): boolean {
  if (!path.length) return false;
  const last = path[path.length - 1];
  const inferred = terminalGenderFromStep(last);
  if (inferred) return false;
  const rule = DICT[path.join(".")];
  if (typeof rule !== "function") return false;
  if (!ruleUsesOlder(path.join(".")) && currentTarget === "unknown") return true;
  return false;
}

// ─────────────────────────────────────────────────────────────
// UI 樣式常量（保持不變）
const Wrap = "w-full max-w-sm";
const ScreenWrap =
  "rounded-3xl p-6 text-right text-white/90 bg-black/40 backdrop-blur shadow-2xl ring-1 ring-white/10";
const Title = "text-xs text-white/70 mb-1";
const ScreenBig = "text-4xl font-semibold tracking-tight";
const ScreenSmall = "text-sm text-white/60 mt-1";
const Pad = "grid grid-cols-4 gap-3 mt-4";
const BtnBase =
  "h-14 rounded-full flex items-center justify-center text-lg active:scale-95 transition border";
const BtnLight = `${BtnBase} bg-neutral-200 text-black border-white/10`;
const BtnDark = `${BtnBase} bg-neutral-700/90 text-white border-white/10`;
const BtnOp = `${BtnBase} bg-orange-500 text-white border-orange-600`;
const BtnWarn = `${BtnBase} bg-yellow-400 text-black border-yellow-500 animate-pulse`;
const BtnZero = `${BtnDark} col-span-2 justify-start pl-6`;

export default function KinshipPage() {
  const [meGender, setMeGender] = useState<Gender>("male");
  const [targetGender, setTargetGender] = useState<Gender | "unknown">("unknown");
  const [older, setOlder] = useState<OlderYounger>("unknown");
  const [rawPath, setRawPath] = useState<Step[]>([]);
  const [showReverse, setShowReverse] = useState(false);
  const [showRidiculousWarning, setShowRidiculousWarning] = useState(false);
  const [ridiculousMessage, setRidiculousMessage] = useState("");
  const [lastWarnedPath, setLastWarnedPath] = useState("");

  // 規範化路徑
  const path = useMemo(() => normalizePath(rawPath), [rawPath]);

  // 若末端步驟已隱含性別，覆蓋 target
  const inferredTarget = terminalGenderFromStep(path[path.length - 1]);
  const effectiveTarget: Gender | "unknown" = inferredTarget ?? targetGender;

  // 顯示稱謂
  const term = renderTerm(path, { me: meGender, target: effectiveTarget, older });
  const revPath = invertPath(path, meGender);
  const revTerm = renderTerm(revPath, {
    me: forwardGenders(path, meGender).slice(-1)[0] as Gender,
    target: meGender,
    older: flipOlder(older),
  });

  const showingPath = showReverse ? revPath : path;
  const needOlder = needsOlderChoice(showingPath) && older === "unknown";
  const needTarget = needsTargetGenderChoice(showingPath, effectiveTarget);

  // 使用自定義的防抖鉤子（替代 Lodash 的 debounce）
  const debouncedCheck = useDebounce((path: Step[]) => {
    const pathStr = path.join(".");
    if (pathStr === lastWarnedPath) return; // 避免重複警告
    
    const message = detectRidiculousPath(path);
    if (message) {
      setRidiculousMessage(message);
      setShowRidiculousWarning(true);
      setLastWarnedPath(pathStr);
    }
  }, 500); // 500ms 延遲

  useEffect(() => {
    document.title = path.length ? `${term}｜親戚關係計算` : "親戚關係計算";
  }, [term, path.length]);

  useEffect(() => {
    if (path.length > 0) {
      debouncedCheck(path);
    } else {
      setShowRidiculousWarning(false);
    }
  }, [path, debouncedCheck]);

  // 其餘方法（保持不變）
  function flipOlder(v: OlderYounger): OlderYounger {
    if (v === "older") return "younger";
    if (v === "younger") return "older";
    return "unknown";
  }

  function forwardGenders(path: Step[], me: Gender): Gender[] {
    const genders: Gender[] = [me];
    for (const step of path) {
      let next: Gender = "male";
      switch (step) {
        case "f": case "h": case "s": case "ob": case "lb": next = "male"; break;
        case "m": case "w": case "d": case "os": case "ls": next = "female"; break;
      }
      genders.push(next);
    }
    return genders;
  }

  function invertStep(step: Step, otherGender: Gender): Step {
    switch (step) {
      case "f": case "m": return otherGender === "male" ? "s" : "d";
      case "s": case "d": return otherGender === "male" ? "f" : "m";
      case "h": return "w";
      case "w": return "h";
      case "ob": return otherGender === "male" ? "lb" : "ls";
      case "lb": return otherGender === "male" ? "ob" : "os";
      case "os": return otherGender === "male" ? "lb" : "ls";
      case "ls": return otherGender === "male" ? "ob" : "os";
    }
  }

  function invertPath(path: Step[], me: Gender): Step[] {
    const genders = forwardGenders(path, me);
    const rev: Step[] = [];
    for (let i = path.length - 1; i >= 0; i--) {
      rev.push(invertStep(path[i], genders[i]));
    }
    return rev;
  }

  function tapStep(step: Step) {
    setRawPath((p) => [...p, step]);
  }
  function backspace() {
    setRawPath((p) => p.slice(0, -1));
  }
  function clearAll() {
    setRawPath([]);
    setOlder("unknown");
    setTargetGender("unknown");
    setShowRidiculousWarning(false);
  }

  // 警告彈窗組件
  const RidiculousWarningModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-amber-100">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-amber-700">🤪 親戚關係超綱警告！</h3>
          <button 
            onClick={() => setShowRidiculousWarning(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        <p className="text-gray-700 mb-6">{ridiculousMessage}</p>
        <button
          onClick={() => setShowRidiculousWarning(false)}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-lg transition"
        >
          知道啦，不鬧了～
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-dvh bg-gradient-to-br from-indigo-950 via-slate-900 to-rose-900 relative overflow-hidden">
      <Header />

      {/* 裝飾元素 */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-indigo-600/25 blur-3xl" />
        <div className="absolute -bottom-16 -right-16 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-cyan-400/10 blur-2xl" />
      </div>

      <div className="relative z-10 min-h-dvh flex items-center justify-center px-4 py-8">
        <main className={`${Wrap}`}>
          {/* 顯示屏幕 */}
          <section className={ScreenWrap}>
            <div className={Title}>親戚關係計算</div>
            <div className={ScreenBig}>{showReverse ? revTerm : term}</div>
            <div className={ScreenSmall}>
              {showReverse ? (
                <>他/她叫我：{revPath.join(".") || "—"}</>
              ) : (
                <>我叫他/她：{path.join(".") || "—"}</>
              )}
            </div>

            {(needOlder || needTarget) && (
              <div className="mt-2 inline-flex items-center gap-2 text-xs text-yellow-300">
                <span className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
                {needOlder ? "需要選擇「年長 / 年幼」以更精確" : "需要選擇「對方性別」以更精確"}
              </div>
            )}
          </section>

          {/* 按鈕鍵盤 */}
          <section className={Pad}>
            {/* 第一行 */}
            <button className={BtnLight} onClick={clearAll}>AC</button>
            <button className={BtnLight} onClick={backspace}>⌫</button>
            <button
              className={`${BtnLight} ${
                showReverse ? "" : "bg-pink-400 text-white"
              }`}
              onClick={() => setShowReverse((v) => !v)}
              aria-pressed={showReverse}
            >
              {showReverse ? "他叫我" : "我叫他"}
            </button>

            {/* 性別切換 */}
            <button
              className={`${BtnBase} ${
                meGender === "male"
                  ? "bg-blue-500 text-white border-blue-600"
                  : "bg-pink-400 text-white border-pink-500"
              }`}
              onClick={() => setMeGender((g) => (g === "male" ? "female" : "male"))}
              title="切換我的性別"
            >
              {meGender === "male" ? "我是男" : "我是女"}
            </button>

            {/* 第二行 */}
            <button className={BtnDark} onClick={() => tapStep("f")}>爸爸</button>
            <button className={BtnDark} onClick={() => tapStep("m")}>媽媽</button>
            <button className={BtnDark} onClick={() => tapStep("h")}>老公</button>
            <button className={BtnDark} onClick={() => tapStep("w")}>老婆</button>

            {/* 第三行 */}
            <button className={BtnDark} onClick={() => tapStep("ob")}>哥哥</button>
            <button className={BtnDark} onClick={() => tapStep("os")}>姐姐</button>
            <button className={BtnDark} onClick={() => tapStep("lb")}>弟弟</button>
            <button className={BtnDark} onClick={() => tapStep("ls")}>妹妹</button>

            {/* 第四行 */}
            <button className={BtnDark} onClick={() => tapStep("s")}>兒子</button>
            <button className={BtnDark} onClick={() => tapStep("d")}>女兒</button>
            <button
              className={
                older === "older"
                  ? BtnOp
                  : needOlder
                  ? BtnWarn
                  : BtnLight
              }
              onClick={() => setOlder("older")}
              aria-pressed={older === "older"}
            >
              年長
            </button>
            <button
              className={
                older === "younger"
                  ? BtnOp
                  : needOlder
                  ? BtnWarn
                  : BtnLight
              }
              onClick={() => setOlder("younger")}
              aria-pressed={older === "younger"}
            >
              年幼
            </button>

            {/* 第五行 */}
            <button
              className={BtnZero}
              onClick={() => {
                setTargetGender("unknown");
                setOlder("unknown");
              }}
            >
              條件重置
            </button>
            <button
              className={`${BtnBase} ${
                (effectiveTarget === "male" || (needTarget && targetGender === "male"))
                  ? "bg-blue-500 text-white border-blue-600"
                  : "bg-neutral-200 text-black border-white/10"
              } ${needTarget && targetGender === "unknown" ? "animate-pulse" : ""}`}
              onClick={() => setTargetGender("male")}
            >
              對方男
            </button>
            <button
              className={`${BtnBase} ${
                (effectiveTarget === "female" || (needTarget && targetGender === "female"))
                  ? "bg-pink-400 text-white border-pink-500"
                  : "bg-neutral-200 text-black border-white/10"
              } ${needTarget && targetGender === "unknown" ? "animate-pulse" : ""}`}
              onClick={() => setTargetGender("female")}
            >
              對方女
            </button>
          </section>

          {/* 提示文字 */}
          <p className="text-center text-xs text-white/70 mt-4">
            提示：未覆蓋的路徑會顯示 <code className="text-white/90">未定義(…)</code>。如需更多用語，可擴充 Step 與規則。
          </p>
        </main>
      </div>

      {/* 警告彈窗 */}
      {showRidiculousWarning && <RidiculousWarningModal />}
    </div>
  );
}
