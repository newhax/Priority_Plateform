import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Languages, Search, Check, Globe, Sparkles, ArrowRight } from 'lucide-react';

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  isSupported: boolean;
  fallback?: string;
}

export const ALL_INDIAN_LANGUAGES: LanguageOption[] = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', isSupported: true },
  { code: 'en', name: 'English', nativeName: 'English', isSupported: true },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', isSupported: true },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', isSupported: true },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', isSupported: true },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', isSupported: true },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', isSupported: true },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', isSupported: true },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', isSupported: true },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', isSupported: true },
  { code: 'ur', name: 'Urdu', nativeName: 'اُردُو', isSupported: true, fallback: 'hi' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', isSupported: true, fallback: 'hi' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', isSupported: true, fallback: 'hi' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', isSupported: true, fallback: 'hi' },
  { code: 'ks', name: 'Kashmiri', nativeName: 'کٲшُر', isSupported: true, fallback: 'hi' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', isSupported: true, fallback: 'hi' },
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي', isSupported: true, fallback: 'hi' },
  { code: 'kok', name: 'Konkani', nativeName: 'कोंकणी', isSupported: true, fallback: 'mr' },
  { code: 'doi', name: 'Dogri', nativeName: 'डोगरी', isSupported: true, fallback: 'hi' },
  { code: 'mni', name: 'Manipuri', nativeName: 'মৈতৈলোন', isSupported: true, fallback: 'en' },
  { code: 'brx', name: 'Bodo', nativeName: 'बड़ो', isSupported: true, fallback: 'hi' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली', isSupported: true, fallback: 'hi' },
  { code: 'sat', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', isSupported: true, fallback: 'hi' }
];

interface LanguageGreetingModalProps {
  onLanguageSelect: (langCode: string) => void;
}

export function LanguageGreetingModal({ onLanguageSelect }: LanguageGreetingModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLang, setSelectedLang] = useState<string>('');
  const [isOpen, setIsOpen] = useState(true);

  // Filter languages based on search query
  const filteredLanguages = ALL_INDIAN_LANGUAGES.filter(lang => 
    lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = () => {
    if (!selectedLang) return;
    
    // Save language selected status in localStorage
    localStorage.setItem('mp_portal_has_welcomed', 'true');
    localStorage.setItem('mp_portal_selected_lang', selectedLang);
    
    onLanguageSelect(selectedLang);
    setIsOpen(false);
  };

  const greetings: Record<string, string> = {
    hi: 'नमस्ते और स्वागत है',
    en: 'Namaste & Welcome',
    ml: 'നമസ്കാരം, സ്വാഗതം',
    ta: 'வணக்கம் மற்றும் வரவேற்பு',
    bn: 'নমস্কার এবং স্বাগত',
    te: 'నమస్కారం మరియు స్వాగతం',
    mr: 'नमस्कार आणि स्वागत',
    gu: 'નમસ્તે અને સ્વાગત',
    kn: 'ನಮಸ್ಕಾರ ಮತ್ತು ಸ್ವಾಗತ',
    pa: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਅਤੇ ਸਵਾਗਤ ਹੈ'
  };

  const getGreetingText = () => {
    if (selectedLang && greetings[selectedLang]) {
      return greetings[selectedLang];
    }
    return 'Namaste & Welcome';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="language-greeting-backdrop" className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[9999] flex items-center justify-center p-4 overflow-y-auto">
          
          {/* Decorative floating grids */}
          <div className="absolute top-10 left-10 w-96 h-96 bg-cyan-900/15 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-900/15 rounded-full blur-[120px] pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 180 }}
            className="w-full max-w-2xl bg-[#09090b] border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
          >
            {/* Top Pattern design overlay */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-6">
              
              {/* Header Greeting Block */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full">
                  <Languages className="w-4 h-4 text-cyan-400" />
                  <span className="text-[10px] font-mono tracking-wider font-extrabold text-cyan-400 uppercase">
                    Select Portal Language
                  </span>
                </div>
                
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-white">
                  {getGreetingText()}
                </h2>
                
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                  Welcome to the MP-CITIZEN DEVELOPMENT PORTAL. Please select your primary language to personalize your dashboard, feedback tools, and AI generation services.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search your language... (उदा. हिन्दी, മലയാളം, English...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-zinc-900/60 border border-zinc-800 focus:border-zinc-700 focus:outline-none rounded-xl p-3 pl-11 text-white placeholder-zinc-550"
                />
              </div>

              {/* Languages Selection Scroll Grid */}
              <div className="max-h-72 overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-3 gap-2.5 custom-scrollbar">
                {filteredLanguages.length > 0 ? (
                  filteredLanguages.map((lang) => {
                    const isSelected = selectedLang === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => setSelectedLang(lang.code)}
                        className={`text-left p-3.5 rounded-xl border transition-all duration-250 cursor-pointer relative group flex flex-col justify-between h-20 ${
                          isSelected 
                            ? 'bg-white border-white text-black' 
                            : 'bg-zinc-900/30 border-zinc-800/80 hover:bg-zinc-900/80 hover:border-zinc-700 text-slate-300'
                        }`}
                      >
                        <div>
                          <div className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                            isSelected ? 'text-zinc-700' : 'text-zinc-500 group-hover:text-zinc-400'
                          }`}>
                            {lang.name}
                          </div>
                          <div className="text-xs sm:text-sm font-extrabold mt-1 font-sans">
                            {lang.nativeName}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-1">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                            isSelected 
                              ? 'bg-zinc-200 text-zinc-800' 
                              : lang.isSupported 
                                ? 'bg-cyan-950/40 text-cyan-400 border border-cyan-800/30' 
                                : 'bg-amber-950/40 text-amber-400 border border-amber-800/30'
                          }`}>
                            {lang.isSupported ? 'Native Support' : 'AI Powered'}
                          </span>

                          {isSelected && (
                            <Check className="w-4 h-4 text-black font-extrabold" />
                          )}
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="col-span-full py-8 text-center space-y-2">
                    <Globe className="w-8 h-8 text-zinc-650 mx-auto" />
                    <p className="text-xs text-zinc-500 font-sans italic">
                      No matching language found. Try searching another Indian language.
                    </p>
                  </div>
                )}
              </div>

              {/* Informative bottom label */}
              {selectedLang && (
                <div className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-xs text-slate-400 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-300">
                      {ALL_INDIAN_LANGUAGES.find(l => l.code === selectedLang)?.name}
                    </span> Selected. 
                    {!ALL_INDIAN_LANGUAGES.find(l => l.code === selectedLang)?.isSupported ? (
                      <span> This language is supported via real-time Gemini AI translation translation filters. The main UI widgets will fallback gracefully to translation parameters.</span>
                    ) : (
                      <span> Provides full-native localized dashboards and AI analysis.</span>
                    )}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={!selectedLang}
                  onClick={handleSubmit}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    selectedLang 
                      ? 'bg-white hover:bg-slate-100 text-black shadow-lg shadow-white/5 active:scale-[0.99]' 
                      : 'bg-zinc-850 text-zinc-500 border border-zinc-800 cursor-not-allowed'
                  }`}
                >
                  Confirm & Proceed to Portal
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
