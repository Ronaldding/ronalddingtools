import React from "react";
import Header from "../components/Header";

/** 
 * Fx‑50FHII outline (no D‑pad): 6×5 + 5×4 grids only.
 * TailwindCSS required.
 */

const palette = {
  dark: "#3b4149",   // number keys
  mid: "#676d77",    // function ovals
  light: "#f1f2f4",  // EXIT style
  orange: "#ff8a17", // Prog/FMLA/DEL/AC
};

type KeySpec = {
  label?: React.ReactNode;
  sub?: React.ReactNode;
  kind?: "dark" | "mid" | "light" | "orange";
  textColor?: string;
};

/** One key style that works for both grids (size switch). */
const Key: React.FC<
  KeySpec & { size?: "sm" | "lg"; className?: string }
> = ({ label, sub, kind = "mid", textColor, size = "sm", className }) => {
  const bg =
    kind === "dark"
      ? palette.dark
      : kind === "mid"
      ? palette.mid
      : kind === "light"
      ? palette.light
      : palette.orange;

  return (
    <div
      className={[
        "relative rounded-[16px] grid place-items-center select-none",
        "shadow-[inset_0_1px_0_rgba(255,255,255,.55),0_1px_0_rgba(0,0,0,.14),0_8px_24px_rgba(0,0,0,.06)]",
        size === "sm" ? "h-10 px-2" : "h-12 px-3",
        className || "",
      ].join(" ")}
      style={{ background: bg, color: textColor ?? "#fff" }}
    >
      <div className="text-center leading-[1.05]">
        {label && (
          <div className={size === "sm" ? "text-[12px] font-semibold" : "text-[14px] font-semibold"}>
            {label}
          </div>
        )}
        {sub && (
          <div className="text-[10px] opacity-85 -mt-0.5">{sub}</div>
        )}
      </div>
    </div>
  );
};

const Spacer: React.FC<{ size?: "sm" | "lg" }> = ({ size = "sm" }) => (
  <div className={size === "sm" ? "h-10" : "h-12"} />
);

/** ---- 6×5 (top) + 5×4 (bottom) data ---- */
const TOP_ROWS: KeySpec[][] = [
  // row 1
  [
    { label: "EXIT", kind: "light", textColor: "#222" },
    { label: "Prog", kind: "orange" },
    { label: "FMLA", kind: "orange" },
    { label: "x⁻¹" },
    { label: "x²" },
    { label: "x³" },
  ],
  // row 2
  [
    { label: "a/bc" },
    { label: "xʸ" },
    { label: "log" },
    { label: "ln" },
    { label: "(" },
    { label: ")" },
  ],
  // row 3
  [
    { label: "◦" },
    { label: "hyp" },
    { label: "sin" },
    { label: "cos" },
    { label: "tan" },
    { label: "•" },
  ],
  // row 4
  [
    { label: "RCL" },
    { label: "ENG" },
    { label: "●" },
    { label: "CLR", textColor: "#101417" },
    { label: "M+" },
    { label: "M-" },
  ],
  // row 5
  [
    { label: "DEC" },
    { label: "HEX" },
    { label: "BIN" },
    { label: "OCT" },
    { label: "d/c" },
    { label: "∑" },
  ],
];

// 5×4 numeric block (EXE parked on far right; one spacer before it)
const BOTTOM_ROWS: (KeySpec | "spacer")[][] = [
  [
    { label: "7", kind: "dark" },
    { label: "8", kind: "dark" },
    { label: "9", kind: "dark" },
    { label: "DEL", kind: "orange", textColor: "#c52222" },
    { label: "AC", kind: "orange", textColor: "#c52222" },
  ],
  [
    { label: "4", kind: "dark" },
    { label: "5", kind: "dark" },
    { label: "6", kind: "dark" },
    { label: "×", kind: "dark" },
    { label: "•", kind: "dark" },
  ],
  [
    { label: "1", kind: "dark" },
    { label: "2", kind: "dark" },
    { label: "3", kind: "dark" },
    { label: "+", kind: "dark" },
    { label: "−", kind: "dark" },
  ],
  [
    { label: "0", kind: "dark" },
    { label: "EXP", kind: "dark" },
    { label: "Ans", kind: "dark" },
    "spacer",
    { label: "EXE", kind: "dark" },
  ],
];

const KeypadOnly: React.FC = () => (
  <div className="mx-auto max-w-sm w-full p-4">
    {/* 6×5 */}
    <div className="rounded-[26px] border border-neutral-300 bg-neutral-100 shadow-[inset_0_2px_10px_rgba(0,0,0,.08)] p-3">
      <div className="grid grid-cols-6 gap-2">
        {TOP_ROWS.flat().map((k, i) =>
          k ? <Key key={`t-${i}`} {...k} size="sm" /> : <Spacer key={`tsp-${i}`} size="sm" />
        )}
      </div>

      {/* spacing between blocks */}
      <div className="h-3" />

      {/* 5×4 */}
      <div className="grid grid-cols-5 gap-2">
        {BOTTOM_ROWS.flat().map((k, i) =>
          k === "spacer" ? (
            <Spacer key={`bsp-${i}`} size="lg" />
          ) : (
            <Key key={`b-${i}`} {...k} size="lg" />
          )
        )}
      </div>
    </div>
  </div>
);

export default function CalculatorPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <KeypadOnly />
    </div>
  );
}
