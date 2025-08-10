import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import articlesData from "../data/articles.json";

interface Article {
  id: number;
  to: string;
  title: string;
  subtitle: string;
  iconEmoji: string;
  section: string;
  readMinutes: number;
  publishedAt: string;
  category: string;
  description: string;
}

interface FeatureCardProps {
  to: string;
  title: string;
  subtitle: string;
  iconEmoji: string;
  section: string;
  readMinutes: number;
  publishedAt: string;
}

function ArticlesPage() {

  const articles: Article[] = articlesData;

  return (
    <div className="min-h-screen bg-[#fbfbfd] text-gray-900">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-green-50 via-white to-white">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 py-20">
            <div className="text-center">
              <h1 className="text-[clamp(2.5rem,8vw,4rem)] font-semibold tracking-tight text-gray-900">
                Articles
              </h1>
              <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
                Thoughtful insights and literary explorations for curious minds.
              </p>
            </div>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="mx-auto max-w-7xl px-6 sm:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <FeatureCard key={index} {...article} />
            ))}
          </div>
          
          {/* Coming Soon Section */}
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">More Articles Coming Soon</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're working on more insightful articles and literary content. 
              Stay tuned for updates!
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function FeatureCard({ to, title, subtitle, iconEmoji, section, readMinutes, publishedAt }: FeatureCardProps) {
  return (
    <Link to={to} className="group block focus:outline-none">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 h-full transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
        <div className="flex justify-center mb-6 text-5xl">{iconEmoji}</div>
        <div className="text-center mb-4">
          <span className="inline-block px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full mb-2">
            {section}
          </span>
          <div className="text-sm text-gray-500">
            {publishedAt} • {readMinutes} min read
          </div>
        </div>
        <h3 className="text-xl font-semibold text-center tracking-tight mb-3">{title}</h3>
        <p className="text-gray-600 text-center leading-relaxed">{subtitle}</p>
      </div>
    </Link>
  );
}

export default ArticlesPage; 