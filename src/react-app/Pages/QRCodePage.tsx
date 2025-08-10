import { useState, useRef, useMemo, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { saveAs } from 'file-saver';
import Header from '../components/Header';
import Footer from '../components/Footer';

type Region = { 
  label: string; 
  code: string; 
  country: string;
  flag: string;
};

// Country data with dialing codes, names, and flag emojis
const COUNTRY_DATA = [
  { code: '1', country: 'United States', flag: '🇺🇸' },
  { code: '7', country: 'Russia', flag: '🇷🇺' },
  { code: '20', country: 'Egypt', flag: '🇪🇬' },
  { code: '27', country: 'South Africa', flag: '🇿🇦' },
  { code: '30', country: 'Greece', flag: '🇬🇷' },
  { code: '31', country: 'Netherlands', flag: '🇳🇱' },
  { code: '32', country: 'Belgium', flag: '🇧🇪' },
  { code: '33', country: 'France', flag: '🇫🇷' },
  { code: '34', country: 'Spain', flag: '🇪🇸' },
  { code: '36', country: 'Hungary', flag: '🇭🇺' },
  { code: '39', country: 'Italy', flag: '🇮🇹' },
  { code: '40', country: 'Romania', flag: '🇷🇴' },
  { code: '41', country: 'Switzerland', flag: '🇨🇭' },
  { code: '43', country: 'Austria', flag: '🇦🇹' },
  { code: '44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '45', country: 'Denmark', flag: '🇩🇰' },
  { code: '46', country: 'Sweden', flag: '🇸🇪' },
  { code: '47', country: 'Norway', flag: '🇳🇴' },
  { code: '48', country: 'Poland', flag: '🇵🇱' },
  { code: '49', country: 'Germany', flag: '🇩🇪' },
  { code: '51', country: 'Peru', flag: '🇵🇪' },
  { code: '52', country: 'Mexico', flag: '🇲🇽' },
  { code: '53', country: 'Cuba', flag: '🇨🇺' },
  { code: '54', country: 'Argentina', flag: '🇦🇷' },
  { code: '55', country: 'Brazil', flag: '🇧🇷' },
  { code: '56', country: 'Chile', flag: '🇨🇱' },
  { code: '57', country: 'Colombia', flag: '🇨🇴' },
  { code: '58', country: 'Venezuela', flag: '🇻🇪' },
  { code: '60', country: 'Malaysia', flag: '🇲🇾' },
  { code: '61', country: 'Australia', flag: '🇦🇺' },
  { code: '62', country: 'Indonesia', flag: '🇮🇩' },
  { code: '63', country: 'Philippines', flag: '🇵🇭' },
  { code: '64', country: 'New Zealand', flag: '🇳🇿' },
  { code: '65', country: 'Singapore', flag: '🇸🇬' },
  { code: '66', country: 'Thailand', flag: '🇹🇭' },
  { code: '81', country: 'Japan', flag: '🇯🇵' },
  { code: '82', country: 'South Korea', flag: '🇰🇷' },
  { code: '84', country: 'Vietnam', flag: '🇻🇳' },
  { code: '86', country: 'China', flag: '🇨🇳' },
  { code: '90', country: 'Turkey', flag: '🇹🇷' },
  { code: '91', country: 'India', flag: '🇮🇳' },
  { code: '92', country: 'Pakistan', flag: '🇵🇰' },
  { code: '93', country: 'Afghanistan', flag: '🇦🇫' },
  { code: '94', country: 'Sri Lanka', flag: '🇱🇰' },
  { code: '95', country: 'Myanmar', flag: '🇲🇲' },
  { code: '98', country: 'Iran', flag: '🇮🇷' },
  { code: '212', country: 'Morocco', flag: '🇲🇦' },
  { code: '213', country: 'Algeria', flag: '🇩🇿' },
  { code: '216', country: 'Tunisia', flag: '🇹🇳' },
  { code: '218', country: 'Libya', flag: '🇱🇾' },
  { code: '220', country: 'Gambia', flag: '🇬🇲' },
  { code: '221', country: 'Senegal', flag: '🇸🇳' },
  { code: '222', country: 'Mauritania', flag: '🇲🇷' },
  { code: '223', country: 'Mali', flag: '🇲🇱' },
  { code: '224', country: 'Guinea', flag: '🇬🇳' },
  { code: '225', country: 'Ivory Coast', flag: '🇨🇮' },
  { code: '226', country: 'Burkina Faso', flag: '🇧🇫' },
  { code: '227', country: 'Niger', flag: '🇳🇪' },
  { code: '228', country: 'Togo', flag: '🇹🇬' },
  { code: '229', country: 'Benin', flag: '🇧🇯' },
  { code: '230', country: 'Mauritius', flag: '🇲🇺' },
  { code: '231', country: 'Liberia', flag: '🇱🇷' },
  { code: '232', country: 'Sierra Leone', flag: '🇸🇱' },
  { code: '233', country: 'Ghana', flag: '🇬🇭' },
  { code: '234', country: 'Nigeria', flag: '🇳🇬' },
  { code: '235', country: 'Chad', flag: '🇹🇩' },
  { code: '236', country: 'Central African Republic', flag: '🇨🇫' },
  { code: '237', country: 'Cameroon', flag: '🇨🇲' },
  { code: '238', country: 'Cape Verde', flag: '🇨🇻' },
  { code: '239', country: 'São Tomé and Príncipe', flag: '🇸🇹' },
  { code: '240', country: 'Equatorial Guinea', flag: '🇬🇶' },
  { code: '241', country: 'Gabon', flag: '🇬🇦' },
  { code: '242', country: 'Republic of the Congo', flag: '🇨🇬' },
  { code: '243', country: 'Democratic Republic of the Congo', flag: '🇨🇩' },
  { code: '244', country: 'Angola', flag: '🇦🇴' },
  { code: '245', country: 'Guinea-Bissau', flag: '🇬🇼' },
  { code: '246', country: 'British Indian Ocean Territory', flag: '🇮🇴' },
  { code: '248', country: 'Seychelles', flag: '🇸🇨' },
  { code: '249', country: 'Sudan', flag: '🇸🇩' },
  { code: '250', country: 'Rwanda', flag: '🇷🇼' },
  { code: '251', country: 'Ethiopia', flag: '🇪🇹' },
  { code: '252', country: 'Somalia', flag: '🇸🇴' },
  { code: '253', country: 'Djibouti', flag: '🇩🇯' },
  { code: '254', country: 'Kenya', flag: '🇰🇪' },
  { code: '255', country: 'Tanzania', flag: '🇹🇿' },
  { code: '256', country: 'Uganda', flag: '🇺🇬' },
  { code: '257', country: 'Burundi', flag: '🇧🇮' },
  { code: '258', country: 'Mozambique', flag: '🇲🇿' },
  { code: '260', country: 'Zambia', flag: '🇿🇲' },
  { code: '261', country: 'Madagascar', flag: '🇲🇬' },
  { code: '262', country: 'Réunion', flag: '🇷🇪' },
  { code: '263', country: 'Zimbabwe', flag: '🇿🇼' },
  { code: '264', country: 'Namibia', flag: '🇳🇦' },
  { code: '265', country: 'Malawi', flag: '🇲🇼' },
  { code: '266', country: 'Lesotho', flag: '🇱🇸' },
  { code: '267', country: 'Botswana', flag: '🇧🇼' },
  { code: '268', country: 'Eswatini', flag: '🇸🇿' },
  { code: '269', country: 'Comoros', flag: '🇰🇲' },
  { code: '290', country: 'Saint Helena', flag: '🇸🇭' },
  { code: '291', country: 'Eritrea', flag: '🇪🇷' },
  { code: '297', country: 'Aruba', flag: '🇦🇼' },
  { code: '298', country: 'Faroe Islands', flag: '🇫🇴' },
  { code: '299', country: 'Greenland', flag: '🇬🇱' },
  { code: '350', country: 'Gibraltar', flag: '🇬🇮' },
  { code: '351', country: 'Portugal', flag: '🇵🇹' },
  { code: '352', country: 'Luxembourg', flag: '🇱🇺' },
  { code: '353', country: 'Ireland', flag: '🇮🇪' },
  { code: '354', country: 'Iceland', flag: '🇮🇸' },
  { code: '355', country: 'Albania', flag: '🇦🇱' },
  { code: '356', country: 'Malta', flag: '🇲🇹' },
  { code: '357', country: 'Cyprus', flag: '🇨🇾' },
  { code: '358', country: 'Finland', flag: '🇫🇮' },
  { code: '359', country: 'Bulgaria', flag: '🇧🇬' },
  { code: '370', country: 'Lithuania', flag: '🇱🇹' },
  { code: '371', country: 'Latvia', flag: '🇱🇻' },
  { code: '372', country: 'Estonia', flag: '🇪🇪' },
  { code: '373', country: 'Moldova', flag: '🇲🇩' },
  { code: '374', country: 'Armenia', flag: '🇦🇲' },
  { code: '375', country: 'Belarus', flag: '🇧🇾' },
  { code: '376', country: 'Andorra', flag: '🇦🇩' },
  { code: '377', country: 'Monaco', flag: '🇲🇨' },
  { code: '378', country: 'San Marino', flag: '🇸🇲' },
  { code: '380', country: 'Ukraine', flag: '🇺🇦' },
  { code: '381', country: 'Serbia', flag: '🇷🇸' },
  { code: '382', country: 'Montenegro', flag: '🇲🇪' },
  { code: '385', country: 'Croatia', flag: '🇭🇷' },
  { code: '386', country: 'Slovenia', flag: '🇸🇮' },
  { code: '387', country: 'Bosnia and Herzegovina', flag: '🇧🇦' },
  { code: '389', country: 'North Macedonia', flag: '🇲🇰' },
  { code: '420', country: 'Czech Republic', flag: '🇨🇿' },
  { code: '421', country: 'Slovakia', flag: '🇸🇰' },
  { code: '423', country: 'Liechtenstein', flag: '🇱🇮' },
  { code: '500', country: 'Falkland Islands', flag: '🇫🇰' },
  { code: '501', country: 'Belize', flag: '🇧🇿' },
  { code: '502', country: 'Guatemala', flag: '🇬🇹' },
  { code: '503', country: 'El Salvador', flag: '🇸🇻' },
  { code: '504', country: 'Honduras', flag: '🇭🇳' },
  { code: '505', country: 'Nicaragua', flag: '🇳🇮' },
  { code: '506', country: 'Costa Rica', flag: '🇨🇷' },
  { code: '507', country: 'Panama', flag: '🇵🇦' },
  { code: '508', country: 'Saint Pierre and Miquelon', flag: '🇵🇲' },
  { code: '509', country: 'Haiti', flag: '🇭🇹' },
  { code: '590', country: 'Guadeloupe', flag: '🇬🇵' },
  { code: '591', country: 'Bolivia', flag: '🇧🇴' },
  { code: '592', country: 'Guyana', flag: '🇬🇾' },
  { code: '593', country: 'Ecuador', flag: '🇪🇨' },
  { code: '594', country: 'French Guiana', flag: '🇬🇫' },
  { code: '595', country: 'Paraguay', flag: '🇵🇾' },
  { code: '596', country: 'Martinique', flag: '🇲🇶' },
  { code: '597', country: 'Suriname', flag: '🇸🇷' },
  { code: '598', country: 'Uruguay', flag: '🇺🇾' },
  { code: '599', country: 'Curaçao', flag: '🇨🇼' },
  { code: '670', country: 'East Timor', flag: '🇹🇱' },
  { code: '672', country: 'Australian External Territories', flag: '🇦🇶' },
  { code: '673', country: 'Brunei', flag: '🇧🇳' },
  { code: '674', country: 'Nauru', flag: '🇳🇷' },
  { code: '675', country: 'Papua New Guinea', flag: '🇵🇬' },
  { code: '676', country: 'Tonga', flag: '🇹🇴' },
  { code: '677', country: 'Solomon Islands', flag: '🇸🇧' },
  { code: '678', country: 'Vanuatu', flag: '🇻🇺' },
  { code: '679', country: 'Fiji', flag: '🇫🇯' },
  { code: '680', country: 'Palau', flag: '🇵🇼' },
  { code: '681', country: 'Wallis and Futuna', flag: '🇼🇫' },
  { code: '682', country: 'Cook Islands', flag: '🇨🇰' },
  { code: '683', country: 'Niue', flag: '🇳🇺' },
  { code: '685', country: 'Samoa', flag: '🇼🇸' },
  { code: '686', country: 'Kiribati', flag: '🇰🇮' },
  { code: '687', country: 'New Caledonia', flag: '🇳🇨' },
  { code: '688', country: 'Tuvalu', flag: '🇹🇻' },
  { code: '689', country: 'French Polynesia', flag: '🇵🇫' },
  { code: '690', country: 'Tokelau', flag: '🇹🇰' },
  { code: '691', country: 'Micronesia', flag: '🇫🇲' },
  { code: '692', country: 'Marshall Islands', flag: '🇲🇭' },
  { code: '850', country: 'North Korea', flag: '🇰🇵' },
  { code: '852', country: 'Hong Kong', flag: '🇭🇰' },
  { code: '853', country: 'Macau', flag: '🇲🇴' },
  { code: '855', country: 'Cambodia', flag: '🇰🇭' },
  { code: '856', country: 'Laos', flag: '🇱🇦' },
  { code: '880', country: 'Bangladesh', flag: '🇧🇩' },
  { code: '886', country: 'Taiwan', flag: '🇹🇼' },
  { code: '960', country: 'Maldives', flag: '🇲🇻' },
  { code: '961', country: 'Lebanon', flag: '🇱🇧' },
  { code: '962', country: 'Jordan', flag: '🇯🇴' },
  { code: '963', country: 'Syria', flag: '🇸🇾' },
  { code: '964', country: 'Iraq', flag: '🇮🇶' },
  { code: '965', country: 'Kuwait', flag: '🇰🇼' },
  { code: '966', country: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '967', country: 'Yemen', flag: '🇾🇪' },
  { code: '968', country: 'Oman', flag: '🇴🇲' },
  { code: '970', country: 'Palestine', flag: '🇵🇸' },
  { code: '971', country: 'United Arab Emirates', flag: '🇦🇪' },
  { code: '972', country: 'Israel', flag: '🇮🇱' },
  { code: '973', country: 'Bahrain', flag: '🇧🇭' },
  { code: '974', country: 'Qatar', flag: '🇶🇦' },
  { code: '975', country: 'Bhutan', flag: '🇧🇹' },
  { code: '976', country: 'Mongolia', flag: '🇲🇳' },
  { code: '977', country: 'Nepal', flag: '🇳🇵' },
  { code: '992', country: 'Tajikistan', flag: '🇹🇯' },
  { code: '993', country: 'Turkmenistan', flag: '🇹🇲' },
  { code: '994', country: 'Azerbaijan', flag: '🇦🇿' },
  { code: '995', country: 'Georgia', flag: '🇬🇪' },
  { code: '996', country: 'Kyrgyzstan', flag: '🇰🇬' },
  { code: '998', country: 'Uzbekistan', flag: '🇺🇿' }
];

const REGIONS: Region[] = COUNTRY_DATA
  .map((item) => ({ 
    label: `+${item.code}`, 
    code: item.code,
    country: item.country,
    flag: item.flag
  }))
  .sort((a, b) => a.label.localeCompare(b.label, 'en'));

function QRCodePage() {
  const [content, setContent] = useState('https://ronaldding.com');
  const [qrConfig, setQrConfig] = useState({
    size: 240,
    fgColor: '#111111',
    bgColor: '#FFFFFF',
    logo: null,
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Custom dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedMessage, setCopiedMessage] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside or pressing escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setSearchTerm('');
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

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

  // ——— Region & WhatsApp Click-to-Chat builder ———
  const [waRegion, setWaRegion] = useState('852');
  const [waLocal, setWaLocal] = useState('25554999');
  const [waMsg, setWaMsg] = useState('Hey there! I am using WhatsApp.');

  const waLink = useMemo(() => {
    const digits = `${waRegion}${(waLocal || '').replace(/\D/g, '')}`;
    const hasMsg = waMsg.trim().length > 0;
    if (!waRegion || !waLocal) return '';
    if (hasMsg) return `https://wa.me/${digits}?text=${encodeURIComponent(waMsg)}`;
    return `https://wa.me/${digits}`;
  }, [waRegion, waLocal, waMsg]);

  const copyText = async (text: string) => {
    try { 
      await navigator.clipboard.writeText(text);
      setCopiedMessage('Copied!');
      setTimeout(() => setCopiedMessage(''), 800);
    } catch {}
  };

  // Custom dropdown component
  const CustomDropdown = () => {
    const filteredRegions = REGIONS.filter(region => 
      region.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      region.code.includes(searchTerm) ||
      region.label.includes(searchTerm)
    );

    const selectedRegion = REGIONS.find(r => r.code === waRegion);

    return (
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/20 flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            {selectedRegion && (
              <>
                <span className="text-xl">{selectedRegion.flag}</span>
                <span className="font-medium">{selectedRegion.label}</span>
                <span className="text-gray-500 text-sm">{selectedRegion.country}</span>
              </>
            )}
          </div>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isDropdownOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-hidden">
            <div className="p-3 border-b border-gray-200">
              <input
                type="text"
                placeholder="Search country or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20"
                autoFocus
              />
            </div>
            <div className="max-h-48 overflow-y-auto">
              {filteredRegions.map((region) => (
                <button
                  key={region.code}
                  onClick={() => {
                    setWaRegion(region.code);
                    setIsDropdownOpen(false);
                    setSearchTerm('');
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 border-b border-gray-100 last:border-b-0"
                >
                  <span className="text-xl">{region.flag}</span>
                  <span className="font-medium">{region.label}</span>
                  <span className="text-gray-500 text-sm">{region.country}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
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
                <p className="mt-1 text-sm text-gray-600">Select country with dialing code, enter local number, and optional message.</p>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Country & Dialing Code</label>
                    <CustomDropdown />
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
                    <button 
                      onClick={() => copyText(waLink)} 
                      className="text-sm text-gray-700 underline hover:text-gray-900 transition-colors"
                    >
                      {copiedMessage || waLink}
                    </button>
                  )}
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