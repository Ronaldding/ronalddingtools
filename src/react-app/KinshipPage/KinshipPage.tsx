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
  // ... (完整規則表，與之前相同)
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
  "f.f": "爺爺",
  "f.m": "奶奶",
  "m.f": "外公",
  "m.m": "外婆",
  // ... (其餘規則保持不變)
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
    const prev = stack[stack.length - 1];
    const prevPrev = stack.length >= 2 ? stack[stack.length - 2] : null;

    // 已有的基礎簡化
    if (prev === "m" && step === "h") { stack.pop(); stack.push("f"); continue; }
    if (prev === "f" && step === "w") { stack.pop(); stack.push("m"); continue; }
    if ((prev === "h" && step === "w") || (prev === "w" && step === "h")) { stack.pop(); continue; }

    // 新增：兄弟姐妹延伸路徑簡化
    if ((prev === "s" && prevPrev === "f") || (prev === "s" && prevPrev === "m")) {
      if (step === "ob" || step === "lb") {
        stack.pop(); stack.pop(); // 移除 "f.s" 或 "m.s"
        stack.push(step); // 直接保留 "ob" 或 "lb"
        continue;
      }
    }
    if ((prev === "d" && prevPrev === "f") || (prev === "d" && prevPrev === "m")) {
      if (step === "os" || step === "ls") {
        stack.pop(); stack.pop(); // 移除 "f.d" 或 "m.d"
        stack.push(step); // 直接保留 "os" 或 "ls"
        continue;
      }
    }

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

          {/* 按鈕鍵盤 */}
          <section className={Pad}>
            {/* 第一行 */}
            <button className={BtnLight} onClick={clearAll}>AC</button>
            <button className={BtnLight} onClick={backspace}>⌫</button>
            <button
              className={BtnLight}
              onClick={() => setShowReverse((v) => !v)}
              aria-pressed={showReverse}
            >
              {showReverse ? "顯示正向" : "顯示反向"}
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
