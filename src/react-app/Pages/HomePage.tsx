import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ReactSVG } from "react-svg";

// Type definitions for component props
interface PanelProps {
  children: React.ReactNode;
}

interface FeatureCardProps {
  to: string;
  title: string;
  subtitle: string;
  iconEmoji: string;
}

interface DeviceCardProps {
  label: string;
  description: string;
  iconSrc: string;
}

// Load article metadata
const articleModules = import.meta.glob("../Article/*.json", { eager: true }) as Record<string, any>;
const allArticles = Object.values(articleModules)
  .map((m: any) => (m.default ?? m))
  .filter((a: any) => typeof a?.id === "number" && typeof a?.title === "string")
  .sort((a: any, b: any) => (a.publishedAt > b.publishedAt ? -1 : 1));
const latestTwo = allArticles.slice(0, 2);

/**
 * Apple.com-inspired redesign notes
 * — Minimal, airy layout; generous whitespace; monochrome palette with subtle tints
 * — Large typographic scale, tight tracking on display text
 * — Subtle dividers (border-gray-200), soft shadows only on hover
 * — Clear hierarchy; fewer colors; focus on content
 */

export default function HomePage() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("Click to fetch!");
  const [isLoading, setIsLoading] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Weather fetch
  const fetchName = async () => {
    setIsLoading(true);
    try {
      const url = "https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=en";
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: any = await res.json();
      const tempList = data?.temperature?.data ?? [];
      const hko = tempList.find((d: any) => d?.place === "Hong Kong Observatory") ?? tempList[0];
      const temp = hko?.value; const tempUnit = hko?.unit ?? "C";
      const rh = data?.humidity?.data?.[0]?.value;
      const t = data?.temperature?.recordTime ?? data?.updateTime ?? "";
      const time = typeof t === "string" ? t.replace(/.*T(\d{2}:\d{2}).*/, "$1") : "";
      const summary = [temp != null ? `${temp}°${tempUnit}` : null, rh != null ? `RH ${rh}%` : null, time ? `at ${time}` : null].filter(Boolean).join(" · ");
      setName(summary || "No data");
    } catch (err) { setName("Failed to fetch weather"); } finally { setIsLoading(false); }
  };

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbfd] text-gray-900 antialiased">
      {/* Global header */}
      <Header />

      {/* Hero */}
      <main className="flex-grow">
        <section className="mx-auto max-w-7xl px-6 sm:px-8 pt-16 pb-12 lg:pt-24 lg:pb-16">
          <div className="text-center">
            <h1 className="text-[clamp(2.25rem,7vw,4.5rem)] font-semibold tracking-tight leading-[1.05]">
              <span className="block">Ronald Ding</span>
              <span className="block text-gray-700">Tools that feel effortless.</span>
            </h1>
            <p className="mt-6 text-[clamp(1rem,2vw,1.25rem)] text-gray-600 max-w-2xl mx-auto">
              A focused set of utilities designed with clarity and care. No fluff—just what you need, beautifully engineered.
            </p>
          </div>
        </section>

        {/* Big Poster with Fade Colors */}
        <section className="w-full min-h-[80vh] flex items-center">
          <div className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-blue-100/30 to-white px-6 sm:px-8 w-full min-h-[80vh] flex items-center">
            <div className="mx-auto max-w-7xl text-center w-full">
              <h2 className="text-4xl lg:text-6xl font-semibold tracking-tight mb-8 text-gray-900">
                Build Something Amazing
              </h2>
              <p className="text-xl lg:text-3xl text-gray-600 max-w-4xl mx-auto mb-12">
                Every tool here is crafted with precision. From simple calculators to complex 3D games, 
                experience the power of thoughtful design.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <div className="bg-white/60 backdrop-blur-sm rounded-full px-8 py-4 text-base font-medium text-gray-700 border border-gray-200/50">
                  🚀 Fast Performance
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-full px-8 py-4 text-base font-medium text-gray-700 border border-gray-200/50">
                  🎨 Beautiful Design
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-full px-8 py-4 text-base font-medium text-gray-700 border border-gray-200/50">
                  📱 Mobile First
                </div>
              </div>
            </div>
            {/* Very subtle decorative elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-100/20 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-100/20 to-transparent rounded-full blur-3xl"></div>
          </div>
        </section>

        {/* Feature grid */}
        <section className="mx-auto max-w-7xl px-6 sm:px-8 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard to="/qr-code" title="QR Code Generator" subtitle="Create clean, scannable codes for any URL or text." iconEmoji="<i class='bi bi-qr-code-scan'></i>" />
            <FeatureCard to="/calculator" title="Calculator" subtitle="Fast, precise calculations with a crisp UI." iconEmoji="<i class='bi bi-calculator'></i>" />
            <FeatureCard to="/kinship" title="Kinship Calculator 親戚稱呼計算" subtitle="Work out family terms by paths like「f.ob.s」." iconEmoji="<i class='bi bi-people'></i>" />
            <FeatureCard to="/racing-game" title="3D Racing Game" subtitle="Race in a sleek 3D environment with realistic physics." iconEmoji="<i class='bi bi-speedometer2'></i>" />
            {latestTwo.map((a: any) => (
              <ArticleTeaser key={a.id} id={a.id} title={a.title} />
            ))}
          </div>
        </section>

        {/* Two-up interactive cards */}
        <section className="mx-auto max-w-7xl px-6 sm:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Counter */}
            <Panel>
              <h2 className="text-2xl font-semibold tracking-tight">Counter</h2>
              <p className="mt-2 text-gray-600">Click to increment and see React state in action.</p>
              <div className="mt-6">
                <button
                  onClick={() => setCount((c) => c + 1)}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-3 text-sm font-medium shadow-sm hover:shadow transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
                >
                  <span className="h-4 w-4 inline-block">+</span>
                  Counter: {count}
                </button>
              </div>
            </Panel>

            {/* API Call */}
            <Panel>
              <h2 className="text-2xl font-semibold tracking-tight">API Call</h2>
              <p className="mt-2 text-gray-600">Fetch sample data with a single tap (weather snapshot).</p>
              <div className="mt-6">
                <button
                  onClick={fetchName}
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-3 text-sm font-medium shadow-sm hover:shadow transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <span className="h-4 w-4 inline-block animate-spin">⏳</span>
                      Loading…
                    </>
                  ) : (
                    <>Weather: {name}</>
                  )}
                </button>
              </div>
            </Panel>
          </div>
        </section>

        {/* Responsive demo */}
        <section className="mx-auto max-w-7xl px-6 sm:px-8 pb-16">
          <div className="text-center">
            <h2 className="text-3xl font-semibold tracking-tight">Responsive Design</h2>
            <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
              Built to look great on every device. Current window width: <span className="font-medium text-gray-900">{windowWidth}px</span>
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <DeviceCard label="Mobile" description="Optimised for small screens." iconSrc="" />
            <DeviceCard label="Tablet" description="Adaptive for medium screens." iconSrc="" />
            <DeviceCard label="Desktop" description="Spacious layout for focus." iconSrc="" />
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

/* ——— Reusable components ——— */
function Panel({ children }: PanelProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8">
      {children}
    </div>
  );
}

function FeatureCard({ to, title, subtitle, iconEmoji }: FeatureCardProps) {
  return (
    <Link to={to} className="group block focus:outline-none">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 h-full transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:shadow-sm">
        <div className="flex justify-center mb-4 text-4xl" dangerouslySetInnerHTML={{__html: iconEmoji}} />
        <h3 className="text-lg font-semibold text-center tracking-tight">{title}</h3>
        <p className="mt-2 text-sm text-gray-600 text-center">{subtitle}</p>
      </div>
    </Link>
  );
}

function ArticleTeaser({ id, title }: { id: number; title: string }) {
  return (
    <Link to={`/article/id/${id}`} className="group block focus:outline-none col-span-1 sm:col-span-2 lg:col-span-2">
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-b from-white via-gray-50 to-gray-100 p-6 h-full text-gray-900">
        <div className="relative z-10 flex items-center gap-4">
          <div className="h-14 w-14 rounded-xl bg-white border border-gray-200 grid place-items-center shadow-sm">
            <div className="text-xl">📰</div>
          </div>
          <div>
            <h3 className="text-xl font-semibold tracking-tight truncate">{title}</h3>
            <p className="text-sm text-gray-600">最新文章</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

function DeviceCard({ label, description, iconSrc }: DeviceCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-sm">
      <div className="h-32 rounded-xl border border-dashed border-gray-200 mb-4 grid place-items-center">
        <div className="text-2xl">📱</div>
      </div>
      <h4 className="font-medium">{label}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}