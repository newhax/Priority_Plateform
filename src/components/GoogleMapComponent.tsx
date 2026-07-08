import React, { useEffect, useState } from 'react';
import { Map, useMap, useMapsLibrary, AdvancedMarker } from '@vis.gl/react-google-maps';
import { Submission } from '../types';
import { Layers, MapPin } from 'lucide-react';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

interface GoogleMapComponentProps {
  cityName: string;
  submissions: Submission[];
  liveUserCoords?: google.maps.LatLngLiteral | null;
  language?: string;
}

const mapTranslations: Record<string, any> = {
  en: {
    keyRequired: "Google Maps API Key Required",
    keyDesc: "Get an API key from Google Cloud Console to unlock interactive spatial heatmaps and real-time division analysis.",
    howToAdd: "To add your API key:",
    getApiKey: "Get an API key: ",
    gmapsStart: "Google Maps Start",
    openSettings: "Open Settings (⚙️ gear icon, top-right corner)",
    goSecrets: "Go to Secrets",
    addSecret: "Add a secret named GOOGLE_MAPS_PLATFORM_KEY",
    rebuildDesc: "The app will rebuild automatically after saving the secret.",
    citywideAnalytics: "Citywide Analytics",
    visualizingSub: "Visualizing submission clusters and critical infrastructure needs across",
    urgency: "Grievance Urgency:",
    low: "Low",
    medium: "Medium",
    high: "High/Critical",
    need: "NEED"
  },
  ml: {
    keyRequired: "ഗൂഗിൾ മാപ്സ് API കീ ആവശ്യമാണ്",
    keyDesc: "തത്സമയ വിശകലന മാപ്പുകൾ കാണുന്നതിനായി ഗൂഗിൾ ക്ലൗഡ് കൺസോളിൽ നിന്ന് ലഭിക്കുന്ന എപിഐ കീ നൽകുക.",
    howToAdd: "എപിഐ കീ ചേർക്കാൻ ഉള്ള നിർദ്ദേശങ്ങൾ:",
    getApiKey: "കീ ലഭിക്കാൻ ഈ ലിങ്ക് സന്ദർശിക്കുക: ",
    gmapsStart: "ഗൂഗിൾ മാപ്സ് തുടക്കം",
    openSettings: "മുകളിൽ വലതുവശത്തുള്ള സെറ്റിങ്സ് (⚙️ ഗിയർ ഐക്കൺ) ക്ലിക്ക് ചെയ്യുക",
    goSecrets: "Secrets ക്ലിക്ക് ചെയ്യുക",
    addSecret: "GOOGLE_MAPS_PLATFORM_KEY എന്ന പേരിൽ കീ ചേർക്കുക",
    rebuildDesc: "കീ സേവ് ചെയ്തതിന് ശേഷം ആപ്പ് ഓട്ടോമാറ്റിക്കായി റീബിൽഡ് ചെയ്യപ്പെടും.",
    citywideAnalytics: "നഗരതല വിവരങ്ങൾ",
    visualizingSub: "നഗരത്തിലെ പരാതികളും അത്യാവശ്യ അടിസ്ഥാന സൗകര്യങ്ങളും മാപ്പിൽ രേഖപ്പെടുത്തുന്നു:",
    urgency: "പരാതികളുടെ തീവ്രത:",
    low: "കുറഞ്ഞത്",
    medium: "ഇടത്തരം",
    high: "കൂടിയത്/അടിയന്തിരം",
    need: "ആവശ്യം"
  },
  hi: {
    keyRequired: "गूगल मैप्स एपीआई की आवश्यक है",
    keyDesc: "इंटरैक्टिव स्थानिक हीटमैप और रीयल-टाइम विश्लेषण को अनलॉक करने के लिए Google क्लाउड कंसोल से एपीआई की प्राप्त करें।",
    howToAdd: "एपीआई की जोड़ने के लिए:",
    getApiKey: "एपीआई की प्राप्त करें: ",
    gmapsStart: "गूगल मैप्स प्रारंभ",
    openSettings: "सेटिंग्स खोलें (⚙️ गियर आइकन, ऊपरी दाएं कोने)",
    goSecrets: "Secrets पर जाएं",
    addSecret: "GOOGLE_MAPS_PLATFORM_KEY नाम से एक सीक्रेट जोड़ें",
    rebuildDesc: "सीक्रेट सहेजने के बाद ऐप स्वचालित रूप से फिर से बन जाएगा।",
    citywideAnalytics: "शहरव्यापी विश्लेषण",
    visualizingSub: "शिकायतों और महत्वपूर्ण बुनियादी ढाँचे की कमियों का चित्रण:",
    urgency: "शिकायत तात्कालिकता:",
    low: "निम्न",
    medium: "मध्यम",
    high: "उच्च/गंभीर",
    need: "आवश्यकता"
  },
  bn: {
    keyRequired: "গুগল ম্যাপস এপিআই কী প্রয়োজন",
    keyDesc: "ইন্টারেক্টিভ হিটম্যাপ এবং রিয়েল-টাইম বিভাগ বিশ্লেষণ আনলক করতে গুগল ক্লাউড কনসোল থেকে এপিআই কী নিন।",
    howToAdd: "আপনার এপিআই কী যোগ করতে:",
    getApiKey: "একটি এপিআই কী পান: ",
    gmapsStart: "গুগল ম্যাপস স্টার্ট",
    openSettings: "সেটিংস খুলুন (⚙️ গিয়ার আইকন, ডানদিকের কোণায়)",
    goSecrets: "Secrets-এ যান",
    addSecret: "GOOGLE_MAPS_PLATFORM_KEY নামে একটি সিক্রেট যোগ করুন",
    rebuildDesc: "সংরক্ষণের পরে অ্যাপটি স্বয়ংক্রিয়ভাবে পুনর্নির্মিত হবে।",
    citywideAnalytics: "শহরব্যাপী বিশ্লেষণ",
    visualizingSub: "অভিযোগ ক্লাস্টার এবং পরিকাঠামো ঘাটতি ম্যাপিং:",
    urgency: "অভিযোগের গুরুত্ব:",
    low: "কম",
    medium: "মাঝারি",
    high: "উচ্চ/জরুরী",
    need: "প্রয়োজন"
  },
  pa: {
    keyRequired: "ਗੂਗਲ ਮੈਪਸ API ਕੁੰਜੀ ਦੀ ਲੋੜ ਹੈ",
    keyDesc: "ਇੰਟਰਐਕਟਿਵ ਹੀਟਮੈਪ ਅਤੇ ਰੀਅਲ-ਟਾਈਮ ਵਿਸ਼ਲੇਸ਼ਣ ਨੂੰ ਅਨਲੌਕ ਕਰਨ ਲਈ ਗੂਗਲ ਕਲਾਉਡ ਕੰਸੋਲ ਤੋਂ API ਕੁੰਜੀ ਪ੍ਰਾਪਤ ਕਰੋ।",
    howToAdd: "ਆਪਣੀ API ਕੁੰਜੀ ਜੋੜਨ ਲਈ:",
    getApiKey: "ਇੱਕ API ਕੁੰਜੀ ਪ੍ਰਾਪਤ ਕਰੋ: ",
    gmapsStart: "ਗੂਗਲ ਮੈਪਸ ਸਟਾਰਟ",
    openSettings: "ਸੈਟਿੰਗਾਂ ਖੋਲ੍ਹੋ (⚙️ ਗੇਅਰ ਆਈਕਨ, ਉੱਪਰ ਸੱਜੇ ਕੋਨੇ)",
    goSecrets: "Secrets 'ਤੇ ਜਾਓ",
    addSecret: "GOOGLE_MAPS_PLATFORM_KEY ਨਾਮ ਨਾਲ ਇੱਕ ਸੀਕਰੇਟ ਜੋੜੋ",
    rebuildDesc: "ਸੀਕਰੇਟ ਸੁਰੱਖਿਅਤ ਕਰਨ ਤੋਂ ਬਾਅਦ ਐਪ ਆਪਣੇ ਆਪ ਮੁੜ ਬਣ ਜਾਵੇਗੀ।",
    citywideAnalytics: "ਸ਼ਹਿਰ ਵਿਆਪੀ ਵਿਸ਼ਲੇਸ਼ਣ",
    visualizingSub: "ਸ਼ਿਕਾਇਤ ਕਲੱਸਟਰਾਂ ਅਤੇ ਬੁਨਿਆਦੀ ਢਾਂਚੇ ਦੀਆਂ ਲੋੜਾਂ ਦੀ ਨਿਸ਼ਾਨਦੇਹੀ:",
    urgency: "ਸ਼ਿਕਾਇਤ ਦੀ ਗੰਭੀਰਤਾ:",
    low: "ਘੱਟ",
    medium: "ਦਰਮਿਆਨੀ",
    high: "ਉੱਚ/ਗੰਭੀਰ",
    need: "ਲੋੜ"
  },
  te: {
    keyRequired: "Google మ్యాప్స్ API కీ అవసరం",
    keyDesc: "ఇంటరాక్టివ్ హీట్‌మ్యాప్‌లు మరియు నిజ-సమయ విశ్లేషణను అన్‌లాక్ చేయడానికి Google క్లౌడ్ కన్సోల్ నుండి API కీని పొందండి.",
    howToAdd: "మీ API కీని జోడించడానికి:",
    getApiKey: "API కీని పొందండి: ",
    gmapsStart: "గూగుల్ మ్యాప్స్ స్టార్ట్",
    openSettings: "సెట్టింగ్‌లను తెరవండి (⚙️ గేర్ చిహ్నం, కుడి ఎగువ మూల)",
    goSecrets: "Secrets కు వెళ్ళండి",
    addSecret: "GOOGLE_MAPS_PLATFORM_KEY పేరుతో రహస్య కీ ని జోడించండి",
    rebuildDesc: "రహస్య కీ ని సేవ్ చేసిన తర్వాత యాప్ స్వయంచాలకంగా రీబిల్డ్ అవుతుంది.",
    citywideAnalytics: "నగరవ్యాప్త విశ్లేషణ",
    visualizingSub: "ఫిర్యాదు క్లస్టర్లు మరియు మౌలిక సదుపాయాల కొరతల మ్యాపింగ్:",
    urgency: "ఫిర్యాదు తీవ్రత:",
    low: "తక్కువ",
    medium: "మధ్యస్థం",
    high: "అత్యవసరం",
    need: "అవసరం"
  },
  ta: {
    keyRequired: "கூகுள் மேப்ஸ் ஏபிஐ கீ தேவை",
    keyDesc: "ஊடாடும் வரைபடம் மற்றும் நிகழ்நேர பகுப்பாய்வை இயக்க கூகுள் கிளவுட் கன்சோலில் இருந்து ஏபிஐ கீ பெறவும்.",
    howToAdd: "ஏபிஐ கீயைச் சேர்க்க:",
    getApiKey: "ஏபிஐ கீயைப் பெறவும்: ",
    gmapsStart: "கூகுள் மேப்ஸ் தொடக்கம்",
    openSettings: "அமைப்புகளைத் திறக்கவும் (⚙️ கியர் ஐகான், மேல் வலது மூலை)",
    goSecrets: "Secrets பக்கத்திற்குச் செல்லவும்",
    addSecret: "GOOGLE_MAPS_PLATFORM_KEY என்ற பெயரில் கீயைச் சேர்க்கவும்",
    rebuildDesc: "சேமித்தவுடன் செயலி தானாகவே மீண்டும் கட்டமைக்கப்படும்.",
    citywideAnalytics: "நகர அளவிலான பகுப்பாய்வு",
    visualizingSub: "புகார் பகுதிகள் மற்றும் உள்கட்டமைப்பு தேவைகளின் வரைபடம்:",
    urgency: "புகார் அவசரம்:",
    low: "குறைந்த",
    medium: "நடுத்தர",
    high: "அதிக/அவசர",
    need: "தேவை"
  }
};

interface CityCenterMarkerProps {
  cityName: string;
  onCenterResolved: (location: google.maps.LatLngLiteral) => void;
}

const CityCenterMarker: React.FC<CityCenterMarkerProps> = ({ cityName, onCenterResolved }) => {
  const map = useMap();
  const placesLib = useMapsLibrary('places');

  useEffect(() => {
    if (!placesLib || !cityName || !map) return;
    
    placesLib.Place.searchByText({
      textQuery: cityName,
      fields: ['location'],
      maxResultCount: 1,
    }).then(({ places }) => {
      if (places?.[0]?.location) {
        const location = places[0].location;
        const lat = typeof location.lat === 'function' ? (location.lat as any)() : (location.lat as any);
        const lng = typeof location.lng === 'function' ? (location.lng as any)() : (location.lng as any);
        
        const resolved = { lat, lng };
        onCenterResolved(resolved);
        map.setCenter(resolved);
        map.setZoom(12);
      }
    });
  }, [placesLib, cityName, map]);

  return null;
};

interface LiveLocationControllerProps {
  liveUserCoords: google.maps.LatLngLiteral | null | undefined;
  onCenterSet: (coords: google.maps.LatLngLiteral) => void;
}

const LiveLocationController: React.FC<LiveLocationControllerProps> = ({ liveUserCoords, onCenterSet }) => {
  const map = useMap();

  useEffect(() => {
    if (liveUserCoords && map) {
      onCenterSet(liveUserCoords);
      map.setCenter(liveUserCoords);
      map.setZoom(14);
    }
  }, [liveUserCoords, map, onCenterSet]);

  return null;
};

export const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({
  cityName,
  submissions,
  liveUserCoords,
  language = 'en',
}) => {
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral | null>(null);

  // Trigger coordinate search when city name changes
  useEffect(() => {
    setMapCenter(null);
  }, [cityName]);

  const t = mapTranslations[language] || mapTranslations['en'];

  if (!hasValidKey) {
    return (
      <div className="flex items-center justify-center h-[550px] bg-slate-900 border border-slate-800 rounded-2xl p-5 text-slate-400 font-sans text-sm text-center">
        <div className="max-w-md space-y-4">
          <h2 className="text-xl font-bold text-slate-100 flex items-center justify-center gap-2">
            <MapPin className="w-5 h-5 text-rose-500 animate-bounce" />
            {t.keyRequired}
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t.keyDesc}
          </p>
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 text-left space-y-2 text-xs">
            <p><strong>{t.howToAdd}</strong></p>
            <ol className="list-decimal list-inside space-y-1 text-slate-350">
              <li>{t.getApiKey}<a href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline hover:text-cyan-300">{t.gmapsStart}</a></li>
              <li>{t.openSettings}</li>
              <li>{t.goSecrets}</li>
              <li>{t.addSecret}</li>
            </ol>
          </div>
          <p className="text-[10px] text-slate-550">{t.rebuildDesc}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:relative md:h-[550px] w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl p-4 md:p-0 gap-4 md:gap-0">
      {/* Floating control panel */}
      <div className="md:absolute md:top-4 md:left-4 z-10 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-4 rounded-xl shadow-xl w-full md:w-60 space-y-3 font-sans text-xs">
        <div className="flex items-center gap-2 text-slate-100 font-bold text-xs uppercase tracking-wider">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>{t.citywideAnalytics}</span>
        </div>
        <div className="text-[10px] text-slate-400 leading-relaxed">
          {t.visualizingSub} {cityName}.
        </div>
      </div>

      {/* Legend */}
      <div className="md:absolute md:bottom-4 md:left-4 z-10 bg-slate-900/95 backdrop-blur border border-slate-800/80 px-3 py-2 rounded-xl shadow-lg flex flex-wrap items-center gap-3 text-[10px] font-sans text-slate-300">
        <span className="font-semibold text-slate-450 uppercase tracking-wide">{t.urgency}</span>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm bg-[#10b981]" />
          <span>{t.low}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm bg-[#f97316]" />
          <span>{t.medium}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm bg-[#ef4444]" />
          <span>{t.high}</span>
        </div>
      </div>

      {/* Map stage container */}
      <div className="relative h-[380px] md:h-full w-full rounded-xl md:rounded-none overflow-hidden border border-slate-800/60 md:border-none">
        <Map
          defaultCenter={{ lat: 20.5937, lng: 78.9629 }}
          defaultZoom={5}
          mapId="DEMO_MAP_ID"
          disableDefaultUI={true}
          style={{ width: '100%', height: '100%' }}
        >
          <CityCenterMarker cityName={cityName} onCenterResolved={setMapCenter} />
          <LiveLocationController liveUserCoords={liveUserCoords} onCenterSet={setMapCenter} />

          {liveUserCoords && (
            <AdvancedMarker position={liveUserCoords}>
              <div className="relative flex items-center justify-center z-50">
                <span className="absolute inline-flex h-8 w-8 rounded-full bg-cyan-400/40 opacity-75 animate-ping"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-500 border-2 border-slate-950 shadow-lg shadow-cyan-950"></span>
              </div>
            </AdvancedMarker>
          )}

          {submissions.map((sub) => {
            if (sub.latitude && sub.longitude) {
              const pinColor = sub.urgency === 'High' ? '#ef4444' : sub.urgency === 'Medium' ? '#f97316' : '#10b981';
              return (
                <AdvancedMarker key={`sub-pin-${sub.id}`} position={{ lat: sub.latitude, lng: sub.longitude }}>
                  <div className="group relative flex items-center justify-center cursor-pointer select-none">
                    {sub.urgency === 'High' && (
                      <span className="absolute inline-flex h-5 w-5 rounded-full bg-red-400/30 animate-pulse"></span>
                    )}
                    <div 
                      className="w-3.5 h-3.5 rounded-full border border-white shadow-md hover:scale-125 transition-all flex items-center justify-center"
                      style={{ backgroundColor: pinColor }}
                    >
                      <span className="w-1 h-1 bg-white rounded-full"></span>
                    </div>
                    
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-900/95 border border-slate-800 rounded-xl p-2.5 shadow-2xl z-50 text-xs w-48 space-y-1.5 backdrop-blur-sm pointer-events-none">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                        <span className="font-bold text-slate-200 truncate pr-1">{sub.name}</span>
                      </div>
                      <p className="text-[10px] text-slate-300 line-clamp-2 leading-relaxed">
                        "{sub.originalText}"
                      </p>
                      <div className="flex items-center justify-between text-[8px] font-mono font-bold pt-0.5">
                        <span className="text-cyan-400 uppercase">{sub.category}</span>
                        <span style={{ color: pinColor }}>{sub.urgency} {t.need}</span>
                      </div>
                    </div>
                  </div>
                </AdvancedMarker>
              );
            }
            return null;
          })}
        </Map>
      </div>
    </div>
  );
};
