import { useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

type ArticleJSON = {
  id: number;
  section: string;
  title: string;
  author: string;
  publishedAt: string;
  readMinutes?: number;
  heroImage?: { src: string; alt?: string; caption?: string };
  blocks: any[];
  related?: { text: string; href: string }[];
};

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function Article() {
  const params = useParams();
  const query = useQuery();

  // Eagerly load all JSON articles via Vite glob import
  const allModules = import.meta.glob("../Article/*.json", { eager: true }) as Record<string, any>;
  const articles: Record<number, ArticleJSON> = {};
  Object.values(allModules).forEach((mod: any) => {
    const json: ArticleJSON = mod.default ?? mod; // handle JSON module default
    if (json && typeof json.id === "number") {
      articles[json.id] = json;
    }
  });
  const availableIds = Object.keys(articles).map((x) => Number(x)).sort((a, b) => a - b);

  const idFromPath = params.id ? Number(params.id) : undefined;
  const idFromQuery = query.get("id") ? Number(query.get("id")) : undefined;
  const currentId = idFromPath || idFromQuery || availableIds[0];
  const data = currentId != null ? articles[currentId] : undefined;

  const currentIndex = availableIds.findIndex((n) => n === currentId);
  const prevId = currentIndex > 0 ? availableIds[currentIndex - 1] : undefined;
  const nextId = currentIndex >= 0 && currentIndex < availableIds.length - 1 ? availableIds[currentIndex + 1] : undefined;

  const [error] = useState<string | null>(!data ? "文章不存在" : null);

  return (
    <div className="min-h-screen bg-[#fbfbfd] text-gray-900">
      <Header />
      <main className="mx-auto max-w-4xl px-6 sm:px-8 py-10">
        {!data && !error && <p className="text-gray-600">載入中…</p>}
        {error && <p className="text-red-600">{error}</p>}
        {data && (
          <>
            <div className="text-sm text-gray-600 mb-3">{data.section}</div>
            <h1 className="text-[clamp(1.875rem,4vw,2.75rem)] font-bold leading-tight tracking-tight">{data.title}</h1>
            <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between text-sm text-gray-600">
              <div>
                <span className="mr-3">{data.author}</span>
                <span className="mr-3">發布：{data.publishedAt}</span>
                {data.readMinutes && <span>閱讀時間：約 {data.readMinutes} 分鐘</span>}
              </div>
            </div>
            <hr className="my-6 border-gray-200" />

            {data.heroImage && (
              <figure className="mx-auto rounded-2xl overflow-hidden border border-gray-200 bg-white">
                <img src={data.heroImage.src} alt={data.heroImage.alt || "article image"} className="w-full" />
                {data.heroImage.caption && (
                  <figcaption className="px-4 py-3 text-sm text-gray-600">{data.heroImage.caption}</figcaption>
                )}
              </figure>
            )}

            <article className="prose prose-zinc lg:prose-lg mt-8 leading-relaxed">
              {data.blocks.map((b, i) => {
                if (b.type === "paragraph") return <p key={i}>{b.text}</p>;
                if (b.type === "heading") {
                  const H = ("h" + (b.level || 2)) as any;
                  return <H key={i}>{b.text}</H>;
                }
                if (b.type === "list") {
                  return b.ordered ? (
                    <ol key={i}>{b.items.map((t: string, k: number) => <li key={k}>{t}</li>)}</ol>
                  ) : (
                    <ul key={i}>{b.items.map((t: string, k: number) => <li key={k}>{t}</li>)}</ul>
                  );
                }
                if (b.type === "blockquote") return <blockquote key={i}>{b.text}</blockquote>;
                if (b.type === "table") {
                  return (
                    <div key={i} className="not-prose mx-auto max-w-2xl">
                      <table className="w-full text-left">
                        <thead>
                          <tr>{b.headers.map((h: string, idx: number) => <th key={idx}>{h}</th>)}</tr>
                        </thead>
                        <tbody>
                          {b.rows.map((row: string[], rIdx: number) => (
                            <tr key={rIdx}>{row.map((cell, cIdx) => <td key={cIdx}>{cell}</td>)}</tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                }
                if (b.type === "video" && b.provider === "youtube" && b.youtubeId) {
                  return (
                    <div key={i} className="not-prose mx-auto max-w-2xl aspect-video w-full rounded-xl overflow-hidden border border-gray-200 bg-white">
                      <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${b.youtubeId}`} title="video" frameBorder={0} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
                    </div>
                  );
                }
                return null;
              })}
            </article>

            {data.related?.length ? (
              <>
                <hr className="my-8 border-gray-200" />
                <section>
                  <h3 className="text-lg font-semibold mb-3">相關閱讀</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    {data.related.map((l, i) => (
                      <li key={i}><a className="hover:underline" href={l.href} target="_blank" rel="noreferrer">{l.text}</a></li>
                    ))}
                  </ul>
                </section>
              </>
            ) : null}

            {/* Prev / Next Navigation */}
            <div className="mt-10 flex items-center justify-between">
              {prevId ? (
                <a href={`/article/id/${prevId}`} className="inline-flex items-center rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:shadow-sm">← 上一篇</a>
              ) : <span />}
              {nextId ? (
                <a href={`/article/id/${nextId}`} className="inline-flex items-center rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:shadow-sm">下一篇 →</a>
              ) : <span />}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
} 