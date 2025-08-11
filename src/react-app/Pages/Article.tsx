import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface ArticleData {
  id: number;
  section: string;
  title: string;
  author: string;
  publishedAt: string;
  readMinutes: number;
  heroImage: {
    src: string;
    alt: string;
    caption: string;
  };
  blocks: any[];
  related: Array<{
    text: string;
    href: string;
  }>;
}

function Article() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setIsLoading(true);
        let articleId = id;
        
        // If no ID in params, try to get from location state
        if (!articleId && location.state?.articleId) {
          articleId = location.state.articleId;
        }
        
        // Default to article 1 if no ID provided
        if (!articleId) {
          articleId = "1";
        }

        const response = await fetch(`/src/react-app/Article/${articleId}.json`);
        if (!response.ok) {
          throw new Error(`Failed to fetch article: ${response.statusText}`);
        }
        
        const data: ArticleData = await response.json();
        setArticle(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load article");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [id, location.state]);

  const renderBlocks = (blocks: any[]) => {
    return blocks.map((block, index) => {
      switch (block.type) {
        case "paragraph":
          return <p key={index} className="mb-4 leading-relaxed">{block.text}</p>;
        case "heading":
          const level = block.level || 2;
          if (level === 1) {
            return <h1 key={index} className="text-3xl font-bold mb-4 mt-8">{block.text}</h1>;
          } else if (level === 2) {
            return <h2 key={index} className="text-2xl font-bold mb-4 mt-8">{block.text}</h2>;
          } else if (level === 3) {
            return <h3 key={index} className="text-xl font-bold mb-4 mt-8">{block.text}</h3>;
          } else {
            return <h4 key={index} className="text-lg font-bold mb-4 mt-8">{block.text}</h4>;
          }
        case "list":
          if (block.ordered) {
            return (
              <ol key={index} className="list-decimal list-inside mb-4 space-y-2">
                {block.items.map((item: string, itemIndex: number) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ol>
            );
          } else {
            return (
              <ul key={index} className="list-disc list-inside mb-4 space-y-2">
                {block.items.map((item: string, itemIndex: number) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            );
          }
        case "blockquote":
          return <blockquote key={index} className="border-l-4 border-gray-300 pl-4 italic text-gray-700 mb-4">{block.text}</blockquote>;
        case "table":
          return (
            <div key={index} className="overflow-x-auto mb-6">
              <table className="min-w-full border border-gray-300">
                {block.headers && (
                  <thead>
                    <tr>
                      {block.headers.map((header: string, headerIndex: number) => (
                        <th key={headerIndex} className="border border-gray-300 px-4 py-2 bg-gray-100 font-semibold">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                )}
                {block.rows && (
                  <tbody>
                    {block.rows.map((row: string[], rowIndex: number) => (
                      <tr key={rowIndex}>
                        {row.map((cell: string, cellIndex: number) => (
                          <td key={cellIndex} className="border border-gray-300 px-4 py-2">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                )}
              </table>
            </div>
          );
        default:
          return null;
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fbfbfd] text-gray-900">
        <Header />
        <main className="flex-1 pt-20">
          <div className="mx-auto max-w-4xl px-6 sm:px-8 py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading article...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-[#fbfbfd] text-gray-900">
        <Header />
        <main className="flex-1 pt-20">
          <div className="mx-auto max-w-4xl px-6 sm:px-8 py-12">
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-gray-900 mb-4">Article Not Found</h1>
              <p className="text-gray-600 mb-6">{error || "The article you're looking for doesn't exist."}</p>
              <a href="/articles" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                ← Back to Articles
              </a>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfbfd] text-gray-900">
      <Header />
      
      <main className="flex-1 pt-20">
        <article className="mx-auto max-w-4xl px-6 sm:px-8 py-12">
          {/* Article Header */}
          <header className="mb-12">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full">
                {article.section}
              </span>
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight mb-4">{article.title}</h1>
            
            <div className="flex items-center gap-6 text-gray-600 mb-8">
              <span>By {article.author}</span>
              <span>•</span>
              <span>{article.publishedAt}</span>
              <span>•</span>
              <span>{article.readMinutes} min read</span>
            </div>


          </header>

          {/* Hero Image */}
          {article.heroImage && (
            <figure className="mb-12">
              <img
                src={article.heroImage.src}
                alt={article.heroImage.alt}
                className="w-full h-64 object-cover rounded-lg"
              />
              <figcaption className="mt-2 text-sm text-gray-600 text-center">
                {article.heroImage.caption}
              </figcaption>
            </figure>
          )}

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            {renderBlocks(article.blocks)}
          </div>

          {/* Related Links */}
          {article.related && article.related.length > 0 && (
            <section className="mt-16 pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-semibold mb-6">Related Links</h2>
              <div className="space-y-3">
                {article.related.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {link.text} →
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Back to Articles */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <a
              href="/articles"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              ← Back to Articles
            </a>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}

export default Article; 