import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ChequeConverterPage() {
  const [inputValue, setInputValue] = useState("1234567.89");
  const [amount, setAmount] = useState<number | null>(1234567.89);
  const [hint, setHint] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [payee, setPayee] = useState("甲乙丙丁有限公司 ABCD Co. Ltd.");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [accountNo, setAccountNo] = useState("123-456789-001"); // New: Account number
  const [branchCode, setBranchCode] = useState("002-345"); // New: Branch code
  const [signer, setSigner] = useState("MR CHAN TAI MAN"); // New: Signer name

  // ========== PARSER & FORMATTING FUNCTIONS (Unchanged) ==========
  const parseFromNumber = (raw: string): number | null => {
    if (!raw) return null;
    const s = raw.replace(/[,\s]/g, '').replace(/[０-９．]/g, (ch: string) => 
      String.fromCharCode(ch.charCodeAt(0) - 0xFEE0)
    );
    if (!/^\d*\.?\d*$/.test(s)) return null;
    let v = Number(s || '0');
    if (!isFinite(v) || v < 0) return null;
    v = Math.round(v * 100) / 100;
    return v > 9999999999999.99 ? null : v;
  };

  const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
    'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const THOUS = ['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion'];
  
  const chunkToWords = (n: number): string => {
    let s: string[] = [];
    if (n >= 100) {
      s.push(ONES[Math.floor(n / 100)] + ' hundred');
      n %= 100;
    }
    if (n >= 20) {
      s.push(TENS[Math.floor(n / 10)] + (n % 10 ? '-' + ONES[n % 10] : ''));
    } else if (n > 0) {
      s.push(ONES[n]);
    }
    return s.join(' ');
  };
  
  const intToWords = (n: number): string => {
    if (n === 0) return 'zero';
    let i = 0, parts: string[] = [];
    while (n > 0) {
      const c = n % 1000;
      if (c) parts.unshift(chunkToWords(c) + (THOUS[i] ? ' ' + THOUS[i] : ''));
      n = Math.floor(n / 1000);
      i++;
    }
    return parts.join(' ');
  };
  
  const englishNoCcy = (v: number): string => {
    const d = Math.floor(v), c = Math.round((v - d) * 100);
    const tail = ` and ${String(c).padStart(2, '0')}/100`;
    return ((d > 0 ? intToWords(d) : 'zero') + tail + ' HONG KONG DOLLARS only').toUpperCase();
  };
  
  const chineseNoPrefix = (v: number): string => {
    const D = ['零', '壹', '貳', '參', '肆', '伍', '陸', '柒', '捌', '玖'];
    const U1 = ['', '拾', '佰', '仟'];
    const U2 = ['', '萬', '億', '兆'];
    
    let fen = Math.round(v * 100) % 10;
    let jiao = Math.floor(Math.round(v * 100) / 10) % 10;
    let int = Math.floor(v);
    
    const part = (n: number): string => {
      let str = '', u = 0, zero = false;
      while (n > 0) {
        const d = n % 10;
        if (d === 0) {
          if (!zero && str !== '') str = '零' + str;
          zero = true;
        } else {
          str = D[d] + U1[u] + str;
          zero = false;
        }
        u++;
        n = Math.floor(n / 10);
      }
      return str || '零';
    };
    
    let sec = 0, intStr = '';
    if (int === 0) intStr = '零';
    else {
      while (int > 0) {
        const p = int % 10000;
        if (p !== 0) intStr = part(p) + U2[sec] + intStr;
        else if (!intStr.startsWith('零')) intStr = '零' + intStr;
        int = Math.floor(int / 10000);
        sec++;
      }
      intStr = intStr.replace(/^零+/, '').replace(/零+/g, '零').replace(/零$/, '');
    }
    
    let out = intStr + '元';
    if (jiao === 0 && fen === 0) out += '整';
    else {
      if (jiao !== 0) out += D[jiao] + '角';
      else if (fen !== 0) out += '零';
      if (fen !== 0) out += D[fen] + '分';
    }
    return out;
  };

  // ========== EVENT HANDLERS & EXPORT (Unchanged) ==========
  const handleInputKeyPress = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      await processInput();
    }
  };

  const processInput = async () => {
    if (!inputValue.trim()) return;
    
    setHint("Processing...");
    
    try {
      const v = parseFromNumber(inputValue);
      if (v == null) {
        setHint("❗ Invalid input format. Please enter a valid number.");
        setAmount(null);
      } else {
        setHint("✅ Successfully processed!");
        setAmount(v);
      }
    } catch (error) {
      setHint("❗ Error occurred during processing");
      setAmount(null);
    }
  };

  const downloadPNG = () => {
    const svg = document.getElementById('chequeSvg');
    if (!svg || !(svg instanceof SVGElement)) {
      alert('Cheque preview not found');
      return;
    }
    
    const src = new XMLSerializer().serializeToString(svg);
    const url = URL.createObjectURL(new Blob([src], { type: 'image/svg+xml;charset=utf-8' }));
    const img = new Image();
    const scale = 2;
    
    // Use the viewBox dimensions from the new component
    const w = 1400;
    const h = 720;
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = w * scale;
      canvas.height = h * scale;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `cheque-${amount?.toFixed(2) || '0'}.png`;
            a.click();
            URL.revokeObjectURL(a.href);
          }
        }, 'image/png', 0.98);
      }
      URL.revokeObjectURL(url);
    };
    
    img.onerror = () => {
      alert('Failed to export image');
      URL.revokeObjectURL(url);
    };
    
    img.src = url;
  };

  useEffect(() => {
    setInputValue('1234567.89');
    setAmount(1234567.89);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/90 via-blue-100/80 to-gray-50">
      <Header />
      
      <main className="flex-1 pt-20">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
              Cheque Converter
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Convert amounts to cheque format. Enter a number and see it displayed in cheque format with customizable payee and date.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg">
            <div className="grid gap-6">
              {/* Input Section (Unchanged) */}
              <div className="max-w-2xl mx-auto">
                <label htmlFor="inputValue" className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide text-center">
                  Enter Amount (Numbers Only)
                </label>
                <input
                  id="inputValue"
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleInputKeyPress}
                  placeholder="Enter amount (e.g., 1234567.89)"
                  className="w-full px-6 py-4 border border-gray-300 rounded-xl bg-white/90 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-center text-lg"
                />
                {hint && (
                  <div className="mt-3 text-sm text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      hint.includes('✅') ? 'bg-green-100 text-green-800' :
                      hint.includes('❗') ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {hint}
                    </span>
                  </div>
                )}
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={processInput}
                    disabled={!inputValue.trim()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Process Input
                  </button>
                </div>
                <div className="mt-2 text-xs text-gray-500 text-center">
                  Press Enter key or click button to process input
                </div>
                
                {/* Expanded Options with Account/Branch */}
                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={() => setShowOptions(!showOptions)}
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    {showOptions ? 'Hide Options' : 'Show Options'}
                  </button>
                </div>
                
                {showOptions && (
                  <div className="mt-6 p-6 bg-white/50 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Cheque Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="payee" className="block text-sm font-medium text-gray-700 mb-2">
                          Pay to
                        </label>
                        <input
                          id="payee"
                          type="text"
                          value={payee}
                          onChange={(e) => setPayee(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          placeholder="Enter payee name"
                        />
                      </div>
                      <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                          Date
                        </label>
                        <input
                          id="date"
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label htmlFor="accountNo" className="block text-sm font-medium text-gray-700 mb-2">
                          Account Number
                        </label>
                        <input
                          id="accountNo"
                          type="text"
                          value={accountNo}
                          onChange={(e) => setAccountNo(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          placeholder="e.g., 123-456789-001"
                        />
                      </div>
                                              <div>
                          <label htmlFor="branchCode" className="block text-sm font-medium text-gray-700 mb-2">
                            Branch Code
                          </label>
                          <input
                            id="branchCode"
                            type="text"
                            value={branchCode}
                            onChange={(e) => setBranchCode(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            placeholder="e.g., 002-345"
                          />
                        </div>
                        <div>
                          <label htmlFor="signer" className="block text-sm font-medium text-gray-700 mb-2">
                            Signer Name
                          </label>
                          <input
                            id="signer"
                            type="text"
                            value={signer}
                            onChange={(e) => setSigner(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            placeholder="e.g., MR CHAN TAI MAN"
                          />
                        </div>
                      </div>
                    </div>
                  )}
              </div>

              {/* Output Fields (Unchanged) */}
              {amount && (
                <div className="space-y-4 max-w-4xl mx-auto">
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                        Chinese Amount (Copyable)
                      </label>
                      <button
                        onClick={() => navigator.clipboard.writeText(chineseNoPrefix(amount))}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Copy to clipboard"
                      >
                        📋
                      </button>
                    </div>
                    <div className="text-center text-gray-900 break-words leading-relaxed">
                      {chineseNoPrefix(amount)}
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                        English Amount (Copyable)
                      </label>
                      <button
                        onClick={() => navigator.clipboard.writeText(englishNoCcy(amount))}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Copy to clipboard"
                      >
                        📋
                      </button>
                    </div>
                    <div className="text-center text-gray-900 break-words leading-relaxed">
                      {englishNoCcy(amount)}
                    </div>
                  </div>
                </div>
              )}

              {/* Updated Cheque Preview SVG */}
              <div className="bg-gray-50/50 border border-gray-200 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm text-gray-600">Cheque Preview (HKD)</div>
                  <button
                    onClick={downloadPNG}
                    className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Save as PNG
                  </button>
                </div>
                
                <div className="flex justify-center items-center p-4 bg-white rounded-xl border border-gray-200 overflow-x-auto">
                  <svg
                    id="chequeSvg"
                    viewBox="0 0 1400 720"
                    width="100%"
                    role="img"
                    aria-label="Hong Kong cheque preview"
                    style={{ background: "#fff" }}
                  >
                    <defs>
                      <linearGradient id="paper" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#ffffff" />
                        <stop offset="1" stopColor="#f6f7fb" />
                      </linearGradient>
                      <pattern id="micro" width="8" height="8" patternUnits="userSpaceOnUse">
                        <path d="M0 8 L8 0" stroke="#e5e7eb" strokeWidth="0.7" />
                      </pattern>
                      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.2" />
                      </filter>
                    </defs>

                    {/* Paper */}
                    <rect x="10" y="10" rx="16" ry="16" width="1380" height="700" fill="url(#paper)" stroke="#d1d5db" />

                    {/* Header bar */}
                    <g>
                      {/* Fake logo block */}
                      <rect x="30" y="28" width="84" height="44" rx="2" fill="#0b3a6e" />
                      <circle cx="72" cy="50" r="10" fill="#fff" opacity="0.85" />
                      <text x="128" y="52" fontSize="28" fill="#0b3a6e" fontWeight={800}>
                        WIKI BANK
                      </text>
                      <text x="128" y="76" fontSize="16" fill="#0b3a6e">維基銀行有限公司</text>
                      <text x="30" y="106" fontSize="12" fill="#6b7280">The Wikipedia Banking Corporation Limited • Hong Kong SAR 香港特別行政區</text>

                      {/* "樣本 Sample" mark (top-right) */}
                      <text x="1360" y="58" fontSize="34" fill="#111827" textAnchor="end" opacity="0.9">
                        樣本 Sample
                      </text>
                    </g>

                    {/* Date triple boxes */}
                    <g transform="translate(985,30)">
                      <text x="0" y="24" fontSize="12" fill="#374151" fontWeight={600}>DAY</text>
                      <text x="140" y="24" fontSize="12" fill="#374151" fontWeight={600}>MONTH</text>
                      <text x="290" y="24" fontSize="12" fill="#374151" fontWeight={600}>YEAR</text>

                      <rect x="0" y="30" width="110" height="64" rx="6" fill="#fff" stroke="#cbd5e1" />
                      <rect x="140" y="30" width="110" height="64" rx="6" fill="#fff" stroke="#cbd5e1" />
                      <rect x="290" y="30" width="110" height="64" rx="6" fill="#fff" stroke="#cbd5e1" />
                      <text x="55" y="76" fontSize="42" textAnchor="middle" fontWeight={800} fill="#111827">{new Date(date).getDate().toString().padStart(2, '0')}</text>
                      <text x="195" y="76" fontSize="42" textAnchor="middle" fontWeight={800} fill="#111827">{String(new Date(date).getMonth() + 1).padStart(2, '0')}</text>
                      <text x="345" y="76" fontSize="42" textAnchor="middle" fontWeight={800} fill="#111827">{new Date(date).getFullYear()}</text>
                      <text x="0" y="108" fontSize="12" fill="#6b7280">日</text>
                      <text x="140" y="108" fontSize="12" fill="#6b7280">月</text>
                      <text x="290" y="108" fontSize="12" fill="#6b7280">年</text>
                    </g>

                    {/* Payee line */}
                    <g transform="translate(30,150)">
                      <text x="0" y="0" fontSize="12" fill="#374151" fontWeight={600}>PAY</text>
                      <text x="34" y="0" fontSize="12" fill="#6b7280">祈付</text>
                      <rect x="0" y="14" width="1160" height="56" rx="6" fill="#fff" stroke="#cbd5e1" />
                      <text x="16" y="50" fontSize="26" fill="#111827">{payee}</text>
                      <text x="1180" y="52" fontSize="14" fill="#6b7280">or bearer 或持票人</text>
                    </g>

                    {/* Amount numeric box (right) */}
                    <g transform="translate(1180,150)">
                      <text x="0" y="0" fontSize="12" fill="#374151" fontWeight={600}>HK $</text>
                      <rect x="0" y="14" width="190" height="56" rx="6" fill="#fff" stroke="#cbd5e1" />
                      <text x="12" y="52" fontSize="34" fill="#111827" fontWeight={800}>
                        {amount ? Math.floor(amount).toLocaleString() : '0'}
                        <tspan dx="6" fontWeight={500} fontSize="18">.{amount ? Math.round((amount % 1) * 100).toString().padStart(2, "0") : '00'}</tspan>
                      </text>
                    </g>

                    {/* Amount in words strip */}
                    <g transform="translate(30,240)">
                      <text x="0" y="0" fontSize="12" fill="#374151" fontWeight={600}>HK dollars</text>
                      <text x="92" y="0" fontSize="12" fill="#6b7280">港幣</text>
                      <rect x="0" y="14" width="1340" height="56" rx="6" fill="#fff" stroke="#cbd5e1" />
                      <text x="16" y="51" fontSize="24" fill="#111827">{amount ? englishNoCcy(amount) : 'Zero Hong Kong Dollars Only'}</text>
                      {amount && (
                        <text x="16" y="86" fontSize="20" fill="#374151">{chineseNoPrefix(amount)}</text>
                      )}
                    </g>

                    {/* Signature area */}
                    <g transform="translate(30,360)">
                      <text x="0" y="0" fontSize="12" fill="#374151" fontWeight={600}>SIGNATURE</text>
                      <rect x="0" y="14" width="520" height="86" rx="6" fill="#fff" stroke="#cbd5e1" />
                      <text x="10" y="108" fontSize="14" fill="#6b7280">簽名</text>
                    </g>
                    <g transform="translate(580,360)">
                      <text x="0" y="0" fontSize="12" fill="#374151" fontWeight={600}>NAME</text>
                      <rect x="0" y="14" width="380" height="40" rx="6" fill="#fff" stroke="#e5e7eb" />
                      <text x="12" y="42" fontSize="18" fill="#111827">{signer}</text>
                    </g>

                    {/* MICR line */}
                    <g transform="translate(20,560)">
                      <rect x="0" y="0" width="1360" height="44" fill="url(#micro)" />
                      <text
                        x="20"
                        y="30"
                        fontSize="22"
                        fill="#000"
                        fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
                      >
                        Ⓢ{branchCode.replace(/-/g, "")}Ⓢ  {accountNo.replace(/-/g, "")}Ⓣ  {amount ? Math.floor(amount).toString().padStart(8,"0") : '00000000'}Ⓢ
                      </text>
                    </g>

                    {/* Bottom-right watermark */}
                    <g opacity="0.25">
                      <text x="1360" y="680" fontSize="44" textAnchor="end" fontWeight={800} fill="#9ca3af">SAMPLE</text>
                      <text x="1360" y="708" fontSize="24" textAnchor="end" fill="#9ca3af">樣本</text>
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
    
  );
}