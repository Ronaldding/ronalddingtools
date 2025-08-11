import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

// Spend Simulator — inspired by neal.fun/spend, but original assets & UI
// Single-file React component. Uses Tailwind classes for styling.
// Drop this into any React app and render <SpendSimulator />.
// No external deps required.

export default function BillGatesMoneyPage() {
  // --- Config ---
  const STARTING_BALANCE = 100_000_000_000; // $100B

  const CURRENCY = useMemo(
    () => new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }),
    []
  );

  const items = useMemo(() => (
    [
      { id: "coffee", name: "Starbucks Coffee", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=100&h=100&fit=crop&crop=center", price: 4 },
      { id: "book", name: "Best Seller Book", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100&h=100&fit=crop&crop=center", price: 15 },
      { id: "headphones", name: "Sony WH-1000XM4", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop&crop=center", price: 199 },
      { id: "phone", name: "iPhone 15 Pro", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&h=100&fit=crop&crop=center", price: 999 },
      { id: "bike", name: "Electric Bike", image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=100&h=100&fit=crop&crop=center", price: 2200 },
      { id: "laptop", name: "MacBook Pro", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&h=100&fit=crop&crop=center", price: 2500 },
      { id: "sofa", name: "Designer Sofa", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&h=100&fit=crop&crop=center", price: 3800 },
      { id: "watch", name: "Rolex Submariner", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=100&h=100&fit=crop&crop=center", price: 12000 },
      { id: "car", name: "Tesla Model S", image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=100&h=100&fit=crop&crop=center", price: 240000 },
      { id: "house", name: "Suburban House", image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=100&h=100&fit=crop&crop=center", price: 650000 },
      { id: "yacht", name: "Luxury Yacht", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100&h=100&fit=crop&crop=center", price: 7500000 },
      { id: "jet", name: "Private Jet", image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=100&h=100&fit=crop&crop=center", price: 45000000 },
      { id: "team", name: "Pro Sports Team", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop&crop=center", price: 3200000000 },
      { id: "island", name: "Private Island", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop&crop=center", price: 60000000 },
      { id: "spaceshot", name: "Space Tourism", image: "https://images.unsplash.com/photo-1446776811953-b23d0bd8436c?w=100&h=100&fit=crop&crop=center", price: 450000 },
      { id: "diamond", name: "Diamond Ring", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=100&h=100&fit=crop&crop=center", price: 25000 },
      { id: "art", name: "Famous Painting", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop&crop=center", price: 15000000 },
      { id: "castle", name: "Medieval Castle", image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=100&h=100&fit=crop&crop=center", price: 25000000 },
      { id: "helicopter", name: "Helicopter", image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=100&h=100&fit=crop&crop=center", price: 1500000 },
      { id: "hotel", name: "Boutique Hotel", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100&h=100&fit=crop&crop=center", price: 8500000 },
      { id: "cruise", name: "Luxury Cruise Ship", image: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=100&h=100&fit=crop&crop=center", price: 1200000000 },
      { id: "stadium", name: "Sports Stadium", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop&crop=center", price: 1800000000 },
      { id: "mountain", name: "Mountain Resort", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop&crop=center", price: 95000000 },
      { id: "tech", name: "Tech Startup", image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=100&h=100&fit=crop&crop=center", price: 50000000 },
      { id: "oil", name: "Oil Company", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop&crop=center", price: 8500000000 },
    ]
  ), []);

  // --- State ---
  const [balance, setBalance] = useState(STARTING_BALANCE);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"asc" | "desc" | "name">("asc");

  // Persist to localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("spend-sim-state-v1");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.balance === "number" && parsed.cart && typeof parsed.cart === "object") {
          setBalance(parsed.balance);
          setCart(parsed.cart);
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("spend-sim-state-v1", JSON.stringify({ balance, cart }));
    } catch {}
  }, [balance, cart]);

  const spent = STARTING_BALANCE - balance;
  const spentPct = Math.min(100, Math.round((spent / STARTING_BALANCE) * 100));

  // --- Handlers ---
  const buy = (id: string, count = 1) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    const cost = item.price * count;
    if (balance < cost) return;
    setBalance(b => b - cost);
    setCart(c => ({ ...c, [id]: (c[id] || 0) + count }));
  };

  const sell = (id: string, count = 1) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    const current = cart[id] || 0;
    if (current <= 0) return;
    const actual = Math.min(count, current);
    setCart(c => ({ ...c, [id]: current - actual }));
    setBalance(b => b + item.price * actual);
  };

  const reset = () => {
    setCart({});
    setBalance(STARTING_BALANCE);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let arr = items.filter(i => i.name.toLowerCase().includes(q));
    if (sort === "name") arr = arr.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "asc") arr = arr.sort((a, b) => a.price - b.price);
    if (sort === "desc") arr = arr.sort((a, b) => b.price - a.price);
    return arr;
  }, [items, query, sort]);

  const receipt = useMemo(() => (
    Object.entries(cart)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => {
        const item = items.find(i => i.id === id)!;
        return { id, name: item.name, image: item.image, qty, total: item.price * qty };
      })
      .sort((a, b) => b.total - a.total)
  ), [cart, items]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-slate-900">
      <Header />
      
      {/* Hero Section with Bill Gates Image */}
      <section className="pt-20 pb-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-4">
                Spend Bill Gates' Money
              </h1>
              <p className="text-xl lg:text-2xl text-blue-100 mb-6">
                You have $100 billion to spend. How will you use it?
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <div className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-lg font-medium">
                  Starting: {CURRENCY.format(STARTING_BALANCE)}
                </div>
                <button 
                  onClick={reset} 
                  className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-lg font-medium transition-colors"
                >
                  Reset Game
                </button>
              </div>
            </div>
            <div className="flex-shrink-0">
              <img 
                src="https://imageio.forbes.com/specials-images/imageserve/62d599ede3ff49f348f9b9b4/0x0.jpg?format=jpg&crop=821,821,x155,y340,safe&height=416&width=416&fit=bounds" 
                alt="Bill Gates" 
                className="w-64 h-64 rounded-full object-cover shadow-2xl border-4 border-white/20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Progress Bar */}
      <section className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-20 z-20">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-lg font-semibold text-slate-700">
              Remaining: <span className="text-emerald-600">{CURRENCY.format(balance)}</span>
            </div>
            <div className="text-lg font-semibold text-slate-700">
              Spent: <span className="text-rose-600">{CURRENCY.format(spent)}</span>
            </div>
          </div>
          <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500 ease-out" 
              style={{ width: `${spentPct}%` }} 
            />
          </div>
          <p className="text-sm mt-2 text-slate-600 text-center">
            {spentPct}% of your fortune spent
          </p>
        </div>
      </section>

      {/* Controls */}
      <section className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex-1 max-w-md">
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search items…"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-slate-700">Sort by:</label>
            <select 
              value={sort} 
              onChange={e => setSort(e.target.value as any)} 
              className="px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
            >
              <option value="asc">Price (low → high)</option>
              <option value="desc">Price (high → low)</option>
              <option value="name">Name (A→Z)</option>
            </select>
          </div>
        </div>
      </section>

      {/* Main grid + receipt */}
      <main className="mx-auto max-w-7xl px-4 pb-16 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {filtered.map(item => {
              const qty = cart[item.id] || 0;
              const affordable = balance >= item.price;
              return (
                <article key={item.id} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-center mb-4">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-20 h-20 rounded-xl object-cover shadow-md group-hover:shadow-lg transition-shadow"
                      />
                    </div>
                    <div className="flex-1 text-center mb-4">
                      <h3 className="font-semibold text-lg mb-2 text-slate-800">{item.name}</h3>
                      <p className="text-2xl font-bold text-emerald-600">{CURRENCY.format(item.price)}</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => buy(item.id)}
                          disabled={!affordable}
                          className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                            affordable 
                              ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md hover:shadow-lg" 
                              : "bg-slate-200 text-slate-400 cursor-not-allowed"
                          }`}
                          aria-label={`Buy one ${item.name}`}
                        >
                          Buy 1
                        </button>
                        <button
                          onClick={() => buy(item.id, 10)}
                          disabled={balance < item.price * 10}
                          className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                            balance >= item.price * 10 
                              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200" 
                              : "bg-slate-100 text-slate-400 cursor-not-allowed"
                          }`}
                          title="Buy 10"
                        >
                          +10
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => sell(item.id)}
                          disabled={qty <= 0}
                          className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                            qty > 0 
                              ? "bg-rose-100 text-rose-800 hover:bg-rose-200" 
                              : "bg-slate-100 text-slate-400 cursor-not-allowed"
                          }`}
                          title="Sell 1"
                        >
                          −1
                        </button>
                        <span className="flex-1 px-3 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium text-center">
                          Owned: {qty}
                        </span>
                        <button
                          onClick={() => buy(item.id, 100)}
                          disabled={balance < item.price * 100}
                          className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                            balance >= item.price * 100 
                              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200" 
                              : "bg-slate-100 text-slate-400 cursor-not-allowed"
                          }`}
                          title="Buy 100"
                        >
                          +100
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Receipt */}
        <aside className="lg:col-span-1">
          <div className="sticky top-40 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-slate-800">Your Purchases</h2>
            {receipt.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🛒</div>
                <p className="text-slate-600">Nothing yet. Start buying! 🎉</p>
              </div>
            ) : (
              <div className="space-y-4">
                <ul className="divide-y divide-slate-200">
                  {receipt.map(row => (
                    <li key={row.id} className="py-4 flex items-center gap-3">
                      <img 
                        src={row.image} 
                        alt={row.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-medium text-slate-800">{row.qty} × {row.name}</p>
                        <p className="text-sm text-slate-600">{CURRENCY.format(row.total)}</p>
                      </div>
                      <button
                        onClick={() => sell(row.id, row.qty)}
                        className="px-3 py-1 rounded-lg text-sm bg-rose-100 text-rose-800 hover:bg-rose-200 transition-colors"
                        title="Sell all"
                      >
                        Sell all
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="border-t pt-4 space-y-2 text-sm">
                  <div className="flex justify-between font-medium">
                    <span>Total spent</span>
                    <span className="text-rose-600">{CURRENCY.format(spent)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Remaining</span>
                    <span className="text-emerald-600">{CURRENCY.format(balance)}</span>
                  </div>
                </div>
                <button 
                  onClick={reset} 
                  className="w-full px-4 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 transition-colors font-medium"
                >
                  Reset Game
                </button>
              </div>
            )}
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="mx-auto max-w-7xl px-4 pb-10 text-center text-sm text-slate-500">
        <p>
          Made with ❤️ — mechanics inspired by spending simulators. Prices and items are placeholders; tweak freely.
        </p>
      </footer>
      
      <Footer />
    </div>
  );
} 