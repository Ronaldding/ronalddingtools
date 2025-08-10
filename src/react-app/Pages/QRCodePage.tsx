import { useState, useRef, useMemo, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { saveAs } from 'file-saver';
import Header from '../components/Header';
import Footer from '../components/Footer';

type Region = { label: string; code: string; cca2?: string };

const FALLBACK_REGIONS: Region[] = [
  { label: '+852', code: '852', cca2: 'HK' },
  { label: '+1', code: '1', cca2: 'US' },
  { label: '+44', code: '44', cca2: 'GB' },
  { label: '+886', code: '886', cca2: 'TW' },
  { label: '+81', code: '81', cca2: 'JP' },
  { label: '+65', code: '65', cca2: 'SG' },
];

function QRCodePage() {
  const [content, setContent] = useState('https://ronaldding.com');
  const [qrConfig, setQrConfig] = useState({
    size: 240,
    fgColor: '#111111',
    bgColor: '#FFFFFF',
    logo: null,
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleConfigChange = (key: string, value: string | number) => {
    setQrConfig((prev) => ({ ...prev, [key]: value }));
  };

  const downloadQRCode = () => {
    if (canvasRef.current) {
      canvasRef.current.toBlob((blob: Blob | null) => {
        if (blob) {
          saveAs(blob, 'my-qr-code.png');
        }
      });
    }
  };

  // ——— Regions (dynamic) ———
  const [regions, setRegions] = useState<Region[]>(FALLBACK_REGIONS);
  const [waRegion, setWaRegion] = useState('852');
  const [waLocal, setWaLocal] = useState('25554999');
  const [waMsg, setWaMsg] = useState('Hey there! I am using WhatsApp.');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('https://restcountries.com/v3.1/all?fields=idd');
        if (!res.ok) throw new Error('network');
        const json = await res.json();
        const codesSet = new Set<string>();
        for (const c of json) {
          const root: string | undefined = c?.idd?.root;
          const sufs: string[] | undefined = c?.idd?.suffixes;
          if (!root || !sufs || !Array.isArray(sufs)) continue;
          for (const s of sufs) {
            const code = `${(root || '').replace('+','')}${(s || '').replace(/^\+/,'')}`;
            if (code && code.length <= 3) codesSet.add(code);
          }
        }
        const list: Region[] = Array.from(codesSet)
          .sort((a, b) => Number(a) - Number(b))
          .map((code) => ({ label: `+${code}`, code }));
        setRegions(list.length ? list : FALLBACK_REGIONS);
        if (list.includes('852' as unknown as Region)) {
          setWaRegion('852');
        } else if (list.find((r) => r.code === '852')) {
          setWaRegion('852');
        }
      } catch {
        setRegions(FALLBACK_REGIONS);
        setWaRegion('852');
      }
    })();
  }, []);

  // ——— WhatsApp Click-to-Chat builder ———
  const waLink = useMemo(() => {
    const digits = `${waRegion}${(waLocal || '').replace(/\D/g, '')}`;
    const hasMsg = waMsg.trim().length > 0;
    if (!waRegion || !waLocal) return '';
    if (hasMsg) return `https://wa.me/${digits}?text=${encodeURIComponent(waMsg)}`;
    return `https://wa.me/${digits}`;
  }, [waRegion, waLocal, waMsg]);

  const copyText = async (text: string) => {
    try { await navigator.clipboard.writeText(text); } catch {}
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbfd] text-gray-900">
      <Header />

      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-6 sm:px-8 py-12">
          <div className="text-center mb-10">
            <h1 className="text-[clamp(2rem,6vw,3rem)] font-semibold tracking-tight">QR Code</h1>
            <p className="mt-3 text-gray-600">Generate clean, scannable codes with precise control.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <label className="block mb-2 text-sm font-medium text-gray-700">Content (URL / Text)</label>
                <input
                  type="text"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/20"
                  placeholder="https://example.com"
                />
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="rounded-2xl border border-gray-200 bg-white p-6">
                  <label className="block mb-2 text-sm font-medium text-gray-700">Size: {qrConfig.size}px</label>
                  <input type="range" min="100" max="600" value={qrConfig.size} onChange={(e) => handleConfigChange('size', Number(e.target.value))} className="w-full accent-black" />
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-6">
                  <label className="block mb-2 text-sm font-medium text-gray-700">QR Color</label>
                  <input type="color" value={qrConfig.fgColor} onChange={(e) => handleConfigChange('fgColor', e.target.value)} className="w-full h-10 rounded" />
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-6">
                  <label className="block mb-2 text-sm font-medium text-gray-700">Background</label>
                  <input type="color" value={qrConfig.bgColor} onChange={(e) => handleConfigChange('bgColor', e.target.value)} className="w-full h-10 rounded" />
                </div>
              </div>

              {/* WhatsApp Click-to-Chat builder */}
              <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
                <h2 className="text-lg font-semibold tracking-tight">WhatsApp Click to Chat</h2>
                <p className="mt-1 text-sm text-gray-600">Choose dialing code (up to 3 digits), enter local number, and optional message.</p>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Dialing code</label>
                    <select
                      value={waRegion}
                      onChange={(e) => setWaRegion(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/20"
                    >
                      {regions.map((r) => (
                        <option key={`${r.code}-${r.label}`} value={r.code}>{r.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block mb-2 text-sm font-medium text-gray-700">Phone number (local)</label>
                    <input
                      type="tel"
                      value={waLocal}
                      onChange={(e) => setWaLocal(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/20"
                      placeholder="25554999"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700">Pre-filled message (optional)</label>
                  <input
                    type="text"
                    value={waMsg}
                    onChange={(e) => setWaMsg(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/20"
                    placeholder="Hey there! I am using WhatsApp."
                  />
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => waLink && setContent(waLink)}
                    disabled={!waLink}
                    className="inline-flex items-center rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:shadow transition disabled:opacity-60"
                  >
                    Use link for QR
                  </button>
                  {waLink && (
                    <>
                      <span className="text-sm text-gray-600 break-all">{waLink}</span>
                      <button onClick={() => copyText(waLink)} className="text-sm text-gray-700 underline">Copy</button>
                    </>
                  )}
                </div>

                {/* Branded-like button preview (not altering brand) */}
                {waLink && (
                  <div className="mt-4">
                    <a aria-label="Chat on WhatsApp" href={waLink} target="_blank" rel="noreferrer" className="inline-block">
                      <img alt="Chat on WhatsApp" src="https://static.whatsapp.net/btn/v1/btn.png" className="h-10"/>
                    </a>
                  </div>
                )}

                <div className="mt-4 text-xs text-gray-500">
                  Examples: <code className="font-mono">https://wa.me/85225554999</code> · <code className="font-mono">https://wa.me/85225554999?text=Hey%20there!%20I%20am%20using%20WhatsApp.</code>
                </div>
              </div>
            </div>

            <div>
              <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center">
                <div className="inline-block p-4 rounded-xl border border-gray-200 bg-white">
                  <QRCodeCanvas ref={canvasRef} value={content} size={qrConfig.size} fgColor={qrConfig.fgColor} bgColor={qrConfig.bgColor} level="H" />
                </div>
                <button onClick={downloadQRCode} className="mt-6 inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-5 py-3 text-sm font-medium shadow-sm hover:shadow transition-all focus-visible:ring-2 focus-visible:ring-black/30">
                  Download PNG
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <div className="w-full"><Footer /></div>
    </div>
  );
}

export default QRCodePage;