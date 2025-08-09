import { useEffect, useMemo, useState } from "react";
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
// 規則表（擴充；受限於現有 step 字母）
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
  "m.m.m": "外曾祖母",

  // ── 父系叔伯姑 + 配偶 ──
  "f.ob": "伯父",
  "f.lb": "叔叔",
  "f.os": "姑姑",
  "f.ob.w": "伯母",
  "f.lb.w": "嬸嬸",
  "f.os.h": "姑丈",

  // ── 母系舅姨 + 配偶 ──
  "m.ob": "舅舅",
  "m.os": "阿姨",
  "m.ob.w": "舅媽",
  "m.os.h": "姨丈",

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
  "m.ob.s": (ctx) =>
    ctx.older === "older" ? "表哥" : ctx.older === "younger" ? "表弟" : "表兄弟",
  "m.ob.d": (ctx) =>
    ctx.older === "older" ? "表姐" : ctx.older === "younger" ? "表妹" : "表姐妹",
  "m.os.s": (ctx) =>
    ctx.older === "older" ? "表哥" : ctx.older === "younger" ? "表弟" : "表兄弟",
  "m.os.d": (ctx) =>
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
  "m.ob.s.w": (ctx) =>
    ctx.older === "older" ? "表嫂" : ctx.older === "younger" ? "表弟妹" : "表兄弟之妻",
  "f.os.d.h": (ctx) =>
    ctx.older === "older" ? "表姊夫" : ctx.older === "younger" ? "表妹夫" : "表姐妹之夫",
  "m.ob.d.h": (ctx) =>
    ctx.older === "older" ? "表姊夫" : ctx.older === "younger" ? "表妹夫" : "表姐妹之夫",

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
  "h.ob.w": "伯嫂/伯母",
  "h.lb.w": "嬸嬸/叔母",
  "h.os.h": "姑丈/姑父",
  "h.ls.h": "姑丈/姑父",
  "w.ob.w": "舅媽/舅母",
  "w.lb.w": "舅媽/舅母",
  "w.os.h": "姨丈/姨父",
  "w.ls.h": "姨丈/姨父",

  // 兒女的配偶之父母（親家）
  "s.w.f": "親家公",
  "s.w.m": "親家母",
  "d.h.f": "親家公",
  "d.h.m": "親家母",

  // ── 父母的子女（需分長幼！）──
  // * 修正點：以前固定回「兄弟/姊妹」，現在改成依 older → 哥哥/弟弟、姐姐/妹妹；
  //   若 older 未選，給中性詞以提示（並會高亮「年長／年幼」）。
  "f.s": (ctx) =>
    ctx.older === "older" ? "哥哥" : ctx.older === "younger" ? "弟弟" : "兄弟",
  "m.s": (ctx) =>
    ctx.older === "older" ? "哥哥" : ctx.older === "younger" ? "弟弟" : "兄弟",
  "f.d": (ctx) =>
    ctx.older === "older" ? "姐姐" : ctx.older === "younger" ? "妹妹" : "姊妹",
  "m.d": (ctx) =>
    ctx.older === "older" ? "姐姐" : ctx.older === "younger" ? "妹妹" : "姊妹",

  // ── 規範化等價鏈 ──
  // 母親的丈夫 → 父親；父親的妻子 → 母親
  "m.h": "爸爸",
  "f.w": "媽媽",
};

// ---------- 路徑簡化（Normalization） ----------
function normalizePath(path: Step[]): Step[] {
  const stack: Step[] = [];
  for (const step of path) {
    const prev = stack[stack.length - 1];

    // 母親的丈夫 → 父親
    if (prev === "m" && step === "h") {
      stack.pop();
      stack.push("f");
      continue;
    }
    // 父親的妻子 → 母親
    if (prev === "f" && step === "w") {
      stack.pop();
      stack.push("m");
      continue;
    }
    // 配偶互相抵銷（h + w / w + h）
    if ((prev === "h" && step === "w") || (prev === "w" && step === "h")) {
      stack.pop();
      continue;
    }
    stack.push(step);
  }
  return stack;
}

// ---------- 推斷路徑末端性別（若有） ----------
function terminalGenderFromStep(s?: Step): Gender | undefined {
  switch (s) {
    case "f":
    case "h":
    case "s":
    case "ob":
    case "lb":
      return "male";
    case "m":
    case "w":
    case "d":
    case "os":
    case "ls":
      return "female";
    default:
      return undefined;
  }
}

// ---------- 核心運算 ----------
function renderTerm(path: Step[], ctx: RenderCtx): string {
  const key = path.join(".");
  const rule = DICT[key];
  if (path.length === 0) return "—";
  if (!rule) return `未定義(${key})`;
  return typeof rule === "function" ? (rule as any)(ctx) : rule;
}

// 檢測規則是否真的「依賴 older」：比較 older=older 與 older=younger 的輸出是否不同
function ruleUsesOlder(key: string): boolean {
  const rule = DICT[key];
  if (typeof rule !== "function") return false;
  const baseCtx: RenderCtx = { me: "male", target: "male", older: "older" };
  const a = (rule as any)({ ...baseCtx, older: "older" });
  const b = (rule as any)({ ...baseCtx, older: "younger" });
  return a !== b;
}

// 該路徑是否需要 older
function needsOlderChoice(path: Step[]): boolean {
  if (!path.length) return false;
  return ruleUsesOlder(path.join("."));
}

// 該路徑是否需要 target 性別（末端不可推斷且規則非依 older 的函式）
function needsTargetGenderChoice(path: Step[], currentTarget: Gender | "unknown"): boolean {
  if (!path.length) return false;
  const last = path[path.length - 1];
  const inferred = terminalGenderFromStep(last);
  if (inferred) return false;
  const rule = DICT[path.join(".")];
  if (typeof rule !== "function") return false;
  // 若非依 older（已由上面處理），則當 target 未指定時提示
  if (!ruleUsesOlder(path.join(".")) && currentTarget === "unknown") return true;
  return false;
}

// ─────────────────────────────────────────────────────────────
// UI（Tailwind）
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

  useEffect(() => {
    document.title = path.length ? `${term}｜親戚關係計算` : "親戚關係計算";
  }, [term, path.length]);

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
        case "f":
        case "h":
        case "s":
        case "ob":
        case "lb":
          next = "male";
          break;
        case "m":
        case "w":
        case "d":
        case "os":
        case "ls":
          next = "female";
          break;
      }
      genders.push(next);
    }
    return genders;
  }

  function invertStep(step: Step, otherGender: Gender): Step {
    switch (step) {
      case "f":
      case "m":
        return otherGender === "male" ? "s" : "d";
      case "s":
      case "d":
        return otherGender === "male" ? "f" : "m";
      case "h":
        return "w";
      case "w":
        return "h";
      case "ob":
        return otherGender === "male" ? "lb" : "ls";
      case "lb":
        return otherGender === "male" ? "ob" : "os";
      case "os":
        return otherGender === "male" ? "lb" : "ls";
      case "ls":
        return otherGender === "male" ? "ob" : "os";
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
  }

  return (
    // 背景：柔和漸層 + 光暈；內容垂直置中
    <div className="min-h-dvh bg-gradient-to-br from-indigo-950 via-slate-900 to-rose-900 relative overflow-hidden">
      <Header />

      {/* decorative blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-indigo-600/25 blur-3xl" />
        <div className="absolute -bottom-16 -right-16 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-cyan-400/10 blur-2xl" />
      </div>

      <div className="relative z-10 min-h-dvh flex items-center justify-center px-4 py-8">
        <main className={`${Wrap}`}>
          {/* 螢幕 */}
          <section className={ScreenWrap}>
            <div className={Title}>親戚關係計算</div>
            <div className={ScreenBig}>{showReverse ? revTerm : term}</div>
            <div className={ScreenSmall}>
              {showReverse ? (
                <>反向路徑：{revPath.join(".") || "—"}</>
              ) : (
                <>路徑：{path.join(".") || "—"}</>
              )}
            </div>

            {(needOlder || needTarget) && (
              <div className="mt-2 inline-flex items-center gap-2 text-xs text-yellow-300">
                <span className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
                {needOlder ? "需要選擇「年長 / 年幼」以更精確" : "需要選擇「對方性別」以更精確"}
              </div>
            )}
          </section>

          {/* 鍵盤（iOS 計算機風格）*/}
          <section className={Pad}>
            {/* Row 1 */}
            <button className={BtnLight} onClick={clearAll}>AC</button>
            <button className={BtnLight} onClick={backspace}>⌫</button>
            <button
              className={BtnLight}
              onClick={() => setShowReverse((v) => !v)}
              aria-pressed={showReverse}
            >
              {showReverse ? "顯示正向" : "顯示反向"}
            </button>

            {/* 我是男/女：男藍 女粉 */}
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

            {/* Row 2 */}
            <button className={BtnDark} onClick={() => tapStep("f")}>爸爸</button>
            <button className={BtnDark} onClick={() => tapStep("m")}>媽媽</button>
            <button className={BtnDark} onClick={() => tapStep("h")}>老公</button>
            <button className={BtnDark} onClick={() => tapStep("w")}>老婆</button>

            {/* Row 3 */}
            <button className={BtnDark} onClick={() => tapStep("ob")}>哥哥</button>
            <button className={BtnDark} onClick={() => tapStep("os")}>姐姐</button>
            <button className={BtnDark} onClick={() => tapStep("lb")}>弟弟</button>
            <button className={BtnDark} onClick={() => tapStep("ls")}>妹妹</button>

            {/* Row 4 */}
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
              title="對方比我年長"
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
              title="對方比我年幼"
            >
              年幼
            </button>

            {/* Row 5 */}
            <button
              className={BtnZero}
              onClick={() => {
                setTargetGender("unknown");
                setOlder("unknown");
              }}
              title="重置年齡/性別條件"
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
              aria-pressed={targetGender === "male"}
              title="指定對方為男性"
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
              aria-pressed={targetGender === "female"}
              title="指定對方為女性"
            >
              對方女
            </button>
          </section>

          {/* 小提示區 */}
          <p className="text-center text-xs text-white/70 mt-4">
            提示：未覆蓋的路徑會顯示 <code className="text-white/90">未定義(…)</code>。如需更多古禮用語或「從父/從母」等分支，可擴充 Step 與規則。
          </p>
        </main>
      </div>
    </div>
  );
}
