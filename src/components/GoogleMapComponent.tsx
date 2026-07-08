import React, { useEffect, useState, useMemo } from 'react';
import { Map, useMap, useMapsLibrary, AdvancedMarker } from '@vis.gl/react-google-maps';
import { Submission, ProposedProject } from '../types';
import { getDistance } from '../utils/geo';
import { 
  Layers, 
  MapPin, 
  Filter, 
  Activity, 
  Flame, 
  Wrench, 
  ChevronRight, 
  X, 
  Volume2, 
  Camera, 
  MessageSquare, 
  FileText, 
  Award, 
  TrendingUp, 
  Users, 
  AlertTriangle,
  Clock,
  Briefcase,
  HelpCircle,
  Sparkles
} from 'lucide-react';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';
const hasValidKey = Boolean(API_KEY) && 
                    API_KEY !== 'YOUR_API_KEY' && 
                    API_KEY !== 'YOUR_API_KEY_HERE' &&
                    API_KEY !== 'undefined' &&
                    API_KEY !== 'null' &&
                    API_KEY.startsWith('AIza');

interface GoogleMapComponentProps {
  cityName: string;
  submissions: Submission[];
  projects?: ProposedProject[];
  liveUserCoords?: google.maps.LatLngLiteral | null;
  detectingLocation?: boolean;
  onDetectLocation?: () => void;
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
    citywideAnalytics: "Spatial Grid Analytics",
    visualizingSub: "Visualizing citizen complaints and spatial infrastructure planning across",
    urgency: "Urgency Level:",
    low: "Low",
    medium: "Medium",
    high: "High/Critical",
    need: "NEED",
    liveLocFound: "Live Location Mapped",
    detectLocation: "Detect My Location",
    gpsAcquiring: "Acquiring GPS...",
    layers: "Display Modes",
    individualPins: "Grievance Pins",
    impactHotspots: "Impact Hotspots",
    proposedSolutions: "Proposed Projects",
    filters: "Filters",
    categories: "Departments",
    stats: "Live Map Statistics",
    mappedComplaints: "Mapped Grievances",
    estimatedImpact: "Est. Citizens Affected",
    criticalIssues: "Critical Issues",
    dominantDept: "Top Pain-point",
    selectedDetails: "Selected Item Details",
    noItemSelected: "Click any marker on the map to inspect live citizen reports or proposed public works.",
    viewFullFeed: "View in Citizen Feed",
    cost: "Budget Estimate",
    benefitScore: "Benefit Score",
    demandScore: "Demand Index",
    viewReport: "Generate Project Report",
    media: "Medium",
    aiSummary: "AI Translation & Summary",
    dept: "Assigned Department",
    voiceNote: "Voice Note",
    whatsappChat: "WhatsApp",
    photoReport: "Photo Upload",
    textPortal: "Web Portal",
    noneMapped: "No grievances matching filters in this view"
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
    citywideAnalytics: "പ്രാദേശിക വിവരങ്ങൾ",
    visualizingSub: "നഗരത്തിലെ പരാതികളും അത്യാവശ്യ അടിസ്ഥാന സൗകര്യങ്ങളും മാപ്പിൽ രേഖപ്പെടുത്തുന്നു:",
    urgency: "തീവ്രത:",
    low: "കുറഞ്ഞത്",
    medium: "ഇടത്തരം",
    high: "കൂടിയത്/അടിയന്തിരം",
    need: "ആവശ്യം",
    liveLocFound: "തത്സമയ സ്ഥാനം കണ്ടെത്തി",
    detectLocation: "എന്റെ സ്ഥാനം കണ്ടെത്തുക",
    gpsAcquiring: "ജിപിഎസ് കണ്ടെത്തുന്നു...",
    layers: "മാപ്പ് മോഡുകൾ",
    individualPins: "പരാതി അടയാളങ്ങൾ",
    impactHotspots: "തീവ്രത ഹോട്ട്സ്പോട്ടുകൾ",
    proposedSolutions: "നിർദ്ദിഷ്ട പ്രോജക്ടുകൾ",
    filters: "ഫിൽട്ടറുകൾ",
    categories: "വകുപ്പുകൾ",
    stats: "തത്സമയ മാപ്പ് വിവരങ്ങൾ",
    mappedComplaints: "രേഖപ്പെടുത്തിയ പരാതികൾ",
    estimatedImpact: "ബാധിക്കപ്പെടുന്ന ജനങ്ങൾ",
    criticalIssues: "അടിയന്തിര പ്രശ്നങ്ങൾ",
    dominantDept: "പ്രധാന പ്രശ്നം",
    selectedDetails: "വിശദവിവരങ്ങൾ",
    noItemSelected: "പരാതികളോ പ്രോജക്റ്റുകളോ പരിശോധിക്കാൻ മാപ്പിലെ ഏതെങ്കിലും അടയാളത്തിൽ ക്ലിക്ക് ചെയ്യുക.",
    viewFullFeed: "പരാതികളുടെ ഫീഡിൽ കാണുക",
    cost: "അനുമാനിക്കുന്ന ചിലവ്",
    benefitScore: "ഉപകാര സ്കോർ",
    demandScore: "ജനങ്ങളുടെ ആവശ്യം",
    viewReport: "പ്രോജക്ട് റിപ്പോർട്ട് തയാറാക്കുക",
    media: "മാധ്യമം",
    aiSummary: "AI സംഗ്രഹം & വിവർത്തനം",
    dept: "ചുമതലയുള്ള വകുപ്പ്",
    voiceNote: "ശബ്ദ സന്ദേശം",
    whatsappChat: "വാട്സാപ്പ്",
    photoReport: "ഫോട്ടോ സന്ദേശം",
    textPortal: "വെബ് പോർട്ടൽ",
    noneMapped: "ഫിൽട്ടറുകൾക്ക് അനുയോജ്യമായ പരാതികളില്ല"
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
    citywideAnalytics: "स्थानिक ग्रिड विश्लेषण",
    visualizingSub: "नागरिक शिकायतों और स्थानिक बुनियादी ढांचा योजना का चित्रण:",
    urgency: "तात्कालिकता:",
    low: "निम्न",
    medium: "मध्यम",
    high: "उच्च/गंभीर",
    need: "आवश्यकता",
    liveLocFound: "लाइव स्थान मिल गया",
    detectLocation: "मेरी स्थिति खोजें",
    gpsAcquiring: "जीपीएस प्राप्त कर रहा है...",
    layers: "डिस्प्ले मोड",
    individualPins: "शिकायत पिन",
    impactHotspots: "प्रभाव हॉटस्पॉट",
    proposedSolutions: "प्रस्तावित परियोजनाएं",
    filters: "फ़िल्टर",
    categories: "विभाग",
    stats: "लाइव मानचित्र आँकड़े",
    mappedComplaints: "मैप की गई शिकायतें",
    estimatedImpact: "अनुमानित प्रभावित नागरिक",
    criticalIssues: "गंभीर मामले",
    dominantDept: "शीर्ष समस्या बिंदु",
    selectedDetails: "चयनित आइटम का विवरण",
    noItemSelected: "नागरिक रिपोर्ट या प्रस्तावित लोक निर्माण की जांच के लिए मानचित्र पर किसी भी मार्कर पर क्लिक करें।",
    viewFullFeed: "सिटिजन फीड में देखें",
    cost: "बजट अनुमान",
    benefitScore: "लाभ स्कोर",
    demandScore: "मांग सूचकांक",
    viewReport: "परियोजना रिपोर्ट तैयार करें",
    media: "माध्यम",
    aiSummary: "एआई अनुवाद और सारांश",
    dept: "संबद्ध विभाग",
    voiceNote: "वॉयस नोट",
    whatsappChat: "व्हाट्सएप",
    photoReport: "फोटो अपलोड",
    textPortal: "वेब पोर्टल",
    noneMapped: "इस दृश्य में फ़िल्टर से मेल खाती कोई शिकायत नहीं है"
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
    citywideAnalytics: "স্থানীয় গ্রিড বিশ্লেষণ",
    visualizingSub: "নাগরিক অভিযোগ এবং পরিকাঠামো পরিকল্পনা মানচিত্রায়ণ:",
    urgency: "গুরুত্ব:",
    low: "কম",
    medium: "মাঝারি",
    high: "উচ্চ/জরুরী",
    need: "প্রয়োজন",
    liveLocFound: "লাইভ অবস্থান পাওয়া গেছে",
    detectLocation: "আমার অবস্থান খুঁজুন",
    gpsAcquiring: "জিপিএস সন্ধান করা হচ্ছে...",
    layers: "ডিসপ্লে মোড",
    individualPins: "অভিযোগ পিন",
    impactHotspots: "প্রভাব হটস্পট",
    proposedSolutions: "প্রস্তাবিত প্রকল্প",
    filters: "ফিল্টার",
    categories: "বিভাগসমূহ",
    stats: "লাইভ ম্যাপ পরিসংখ্যান",
    mappedComplaints: "মানচিত্রভুক্ত অভিযোগ",
    estimatedImpact: "আনুমানিক প্রভাবিত নাগরিক",
    criticalIssues: "জরুরী সমস্যা",
    dominantDept: "শীর্ষ সমস্যা বিভাগ",
    selectedDetails: "নির্বাচিত আইটেমের বিবরণ",
    noItemSelected: "নাগরিক রিপোর্ট বা প্রস্তাবিত সরকারি কাজ পরীক্ষা করতে ম্যাপের যেকোনো মার্কারের উপর ক্লিক করুন।",
    viewFullFeed: "সিটিজেন ফিডে দেখুন",
    cost: "বাজেট অনুমান",
    benefitScore: "সুবিধা স্কোর",
    demandScore: "চাহিদা সূচক",
    viewReport: "প্রকল্পের রিপোর্ট তৈরি করুন",
    media: "মাধ্যম",
    aiSummary: "এআই অনুবাদ ও সারসংক্ষেপ",
    dept: "বরাদ্দকৃত বিভাগ",
    voiceNote: "ভয়েস নোট",
    whatsappChat: "হোয়াটসঅ্যাপ",
    photoReport: "ফটো আপলোড",
    textPortal: "ওয়েব পোর্টাল",
    noneMapped: "এই ফিল্টারে কোনো অভিযোগ পাওয়া যায়নি"
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
    citywideAnalytics: "ਸਥਾਨਕ ਗ੍ਰਿਡ ਵਿਸ਼ਲੇਸ਼ਣ",
    visualizingSub: "ਸ਼ਹਿਰੀ ਸ਼ਿਕਾਇਤਾਂ ਅਤੇ ਬੁਨਿਆਦੀ ਢਾਂਚੇ ਦੇ ਪ੍ਰੋਜੈਕਟਾਂ ਦੀ ਮੈਪਿੰਗ:",
    urgency: "ਗੰਭੀਰਤਾ:",
    low: "ਘੱਟ",
    medium: "ਦਰਮਿਆਨੀ",
    high: "ਉੱਚ/ਗੰਭੀਰ",
    need: "ਲੋੜ",
    liveLocFound: "ਲਾਈਵ ਟਿਕਾਣਾ ਮਿਲ ਗਿਆ",
    detectLocation: "ਮੇਰਾ ਟਿਕਾਣਾ ਲੱਭੋ",
    gpsAcquiring: "ਜੀਪੀਐਸ ਲੱਭ ਰਿਹਾ ਹੈ...",
    layers: "ਡਿਸਪਲੇਅ ਮੋਡ",
    individualPins: "ਸ਼ਿਕਾਇਤ ਪਿੰਨ",
    impactHotspots: "ਪ੍ਰਭਾਵ ਹੌਟਸਪੌਟ",
    proposedSolutions: "ਪ੍ਰਸਤਾਵਿਤ ਪ੍ਰੋਜੈਕਟ",
    filters: "ਫਿਲਟਰ",
    categories: "ਵਿਭਾਗ",
    stats: "ਲਾਈਵ ਨਕਸ਼ਾ ਅੰਕੜੇ",
    mappedComplaints: "ਦਰਜ ਸ਼ਿਕਾਇਤਾਂ",
    estimatedImpact: "ਪ੍ਰਭਾਵਿਤ ਨਾਗਰਿਕ",
    criticalIssues: "ਗੰਭੀਰ ਮਾਮਲੇ",
    dominantDept: "ਮੁੱਖ ਸਮੱਸਿਆ ਵਿਭਾਗ",
    selectedDetails: "ਚੁਣੇ ਗਏ ਆਈਟਮ ਦਾ ਵੇਰਵਾ",
    noItemSelected: "ਨਾਗਰਿਕ ਰਿਪੋਰਟਾਂ ਜਾਂ ਪ੍ਰਸਤਾਵਿਤ ਸਰਕਾਰੀ ਕੰਮਾਂ ਦੀ ਜਾਂਚ ਲਈ ਨਕਸ਼ੇ 'ਤੇ ਕਿਸੇ ਵੀ ਮਾਰਕਰ 'ਤੇ ਕਲਿੱਕ ਕਰੋ।",
    viewFullFeed: "ਸਿਟੀਜ਼ਨ ਫੀਡ ਵਿੱਚ ਦੇਖੋ",
    cost: "ਬਜਟ ਅਨੁਮਾਨ",
    benefitScore: "ਲਾਭ ਸਕੋਰ",
    demandScore: "ਮੰਗ ਸੂਚਕਾਂਕ",
    viewReport: "ਪ੍ਰੋਜੈਕਟ ਰਿਪੋਰਟ ਤਿਆਰ ਕਰੋ",
    media: "ਮਾਧਿਅਮ",
    aiSummary: "AI ਅਨੁਵਾਦ ਅਤੇ ਸਾਰ",
    dept: "ਸੰਬੰਧਿਤ ਵਿਭਾਗ",
    voiceNote: "ਵੌਇਸ ਨੋਟ",
    whatsappChat: "ਵਟਸਐਪ",
    photoReport: "ਫ਼ੋਟੋ ਅਪਲੋਡ",
    textPortal: "ਵੈੱਬ ਪੋਰਟਲ",
    noneMapped: "ਇਸ ਫਿਲਟਰ ਵਿੱਚ ਕੋਈ ਸ਼ਿਕਾਇਤ ਨਹੀਂ ਮਿਲੀ"
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
    citywideAnalytics: "స్థానిక గ్రిడ్ విశ్లేషణ",
    visualizingSub: "పౌర ఫిర్యాదులు మరియు మౌలిక సదుపాయాల ప్రణాళికల చిత్రీకరణ:",
    urgency: "తీవ్రత:",
    low: "తక్కువ",
    medium: "మధ్యస్థం",
    high: "అత్యవసరం",
    need: "అవసరం",
    liveLocFound: "లైవ్ లొకేషన్ కనుగొనబడింది",
    detectLocation: "నా లొకేషన్ కనుగొనండి",
    gpsAcquiring: "జీపీఎస్ పొందుతోంది...",
    layers: "డిస్ప్లే మోడ్లు",
    individualPins: "ఫిర్యాదు పిన్లు",
    impactHotspots: "ప్రభావ హాట్‌స్పాట్లు",
    proposedSolutions: "ప్రతిపాదిత ప్రాజెక్టులు",
    filters: "ఫిల్టర్లు",
    categories: "శాఖలు",
    stats: "లైవ్ మ్యాప్ గణాంకాలు",
    mappedComplaints: "మ్యాప్ చేయబడిన ఫిర్యాదులు",
    estimatedImpact: "ప్రభావిత పౌరులు",
    criticalIssues: "తీవ్ర సమస్యలు",
    dominantDept: "ప్రధాన సమస్యల శాఖ",
    selectedDetails: "ఎంపిక చేసిన వివరాలు",
    noItemSelected: "పౌర నివేదికలు లేదా ప్రతిపాదిత పనులను తనిఖీ చేయడానికి మ్యాప్‌లోని ఏదైనా మార్కర్‌పై క్లిక్ చేయండి.",
    viewFullFeed: "సిటిజన్ ఫీడ్‌లో చూడండి",
    cost: "బడ్జెట్ అంచనా",
    benefitScore: "ప్రయోజన స్కోరు",
    demandScore: "డిమాండ్ సూచిక",
    viewReport: "ప్రాజెక్ట్ నివేదిక తయారు చేయండి",
    media: "మాధ్యమం",
    aiSummary: "AI అనువాదం & సారాంశం",
    dept: "కేటాయించిన శాఖ",
    voiceNote: "వాయిస్ నోట్",
    whatsappChat: "వాట్సాప్",
    photoReport: "ఫోటో అప్‌లోడ్",
    textPortal: "వెబ్ పోర్టల్",
    noneMapped: "ఈ ఫిల్టర్‌లో ఫిర్యాదులు ఏవీ లేవు"
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
    citywideAnalytics: "இருப்பிட பகுப்பாய்வு",
    visualizingSub: "குடிமக்கள் புகார்கள் மற்றும் கட்டமைப்பு திட்டமிடல் மேப்பிங்:",
    urgency: "புகார் அவசரம்:",
    low: "குறைந்த",
    medium: "நடுத்தர",
    high: "அதிக/அவசர",
    need: "தேவை",
    liveLocFound: "நேரடி இடம் கண்டறியப்பட்டது",
    detectLocation: "என் இருப்பிடத்தைக் கண்டறி",
    gpsAcquiring: "ஜிபிஎஸ் பெறப்படுகிறது...",
    layers: "காட்சி முறைகள்",
    individualPins: "புகார் குறியீடுகள்",
    impactHotspots: "பாதிப்பு ஹாட்ஸ்பாட்கள்",
    proposedSolutions: "முன்மொழியப்பட்ட திட்டங்கள்",
    filters: "வடிகட்டிகள்",
    categories: "துறைகள்",
    stats: "வரைபட புள்ளிவிவரங்கள்",
    mappedComplaints: "மேப் செய்யப்பட்ட புகார்கள்",
    estimatedImpact: "பாதிக்கப்படும் குடிமக்கள்",
    criticalIssues: "அதிதீவிர பிரச்சனைகள்",
    dominantDept: "முக்கிய பிரச்சனைத் துறை",
    selectedDetails: "தேர்ந்தெடுக்கப்பட்ட விவரங்கள்",
    noItemSelected: "குடிமக்கள் புகார்கள் அல்லது உள்கட்டமைப்பு பணிகளை ஆராய வரைபடத்தில் ஏதேனும் குறியீட்டின் மீது கிளிக் செய்க.",
    viewFullFeed: "குடிமக்கள் பிரிவில் காண்க",
    cost: "திட்ட மதிப்பீடு",
    benefitScore: "நன்மை மதிப்பீடு",
    demandScore: "தேவை குறியீடு",
    viewReport: "திட்ட அறிக்கை தயாரிக்கவும்",
    media: "ஊடகம்",
    aiSummary: "AI மொழிபெயர்ப்பு & சுருக்கம்",
    dept: "ஒதுக்கப்பட்ட துறை",
    voiceNote: "குரல் பதிவு",
    whatsappChat: "வாட்ஸ்அப்",
    photoReport: "புகைப்படம் பதிவேற்றம்",
    textPortal: "இணையதளம்",
    noneMapped: "இந்த வடிகட்டியில் புகார்கள் எதுவும் இல்லை"
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
  recenterTrigger: number;
}

const LiveLocationController: React.FC<LiveLocationControllerProps> = ({ 
  liveUserCoords, 
  onCenterSet,
  recenterTrigger
}) => {
  const map = useMap();

  useEffect(() => {
    if (liveUserCoords && map) {
      onCenterSet(liveUserCoords);
      map.setCenter(liveUserCoords);
      map.setZoom(14);
    }
  }, [liveUserCoords, map, onCenterSet]);

  useEffect(() => {
    if (liveUserCoords && map && recenterTrigger > 0) {
      map.setCenter(liveUserCoords);
      map.setZoom(14);
    }
  }, [recenterTrigger, liveUserCoords, map]);

  return null;
};

export const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({
  cityName,
  submissions,
  projects = [],
  liveUserCoords,
  detectingLocation = false,
  onDetectLocation,
  language = 'en',
}) => {
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral | null>(null);
  const [recenterTrigger, setRecenterTrigger] = useState(0);
  
  // Interactive filters & layers states
  const [showPins, setShowPins] = useState<boolean>(true);
  const [showHotspots, setShowHotspots] = useState<boolean>(true);
  const [showProjects, setShowProjects] = useState<boolean>(true);
  const [nearMeOnly, setNearMeOnly] = useState<boolean>(false);
  const [proximityRange, setProximityRange] = useState<number>(15);

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('All');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'submission' | 'project' | null>(null);

  // Trigger coordinate search when city name changes & reset selection
  useEffect(() => {
    setMapCenter(null);
    setSelectedItemId(null);
    setSelectedType(null);
  }, [cityName]);

  const t = mapTranslations[language] || mapTranslations['en'];

  const categoriesList = useMemo(() => {
    const list = new Set<string>();
    submissions.forEach(sub => {
      if (sub.category) list.add(sub.category);
    });
    return Array.from(list);
  }, [submissions]);

  // Compute positions of Proposed Projects dynamically based on average centroid of submissions in the same category
  const mappedProjects = useMemo(() => {
    return projects.map(proj => {
      // Find centroid of matching category submissions in the system
      const matchingSubs = submissions.filter(s => s.category === proj.category && s.latitude && s.longitude);
      let coords: google.maps.LatLngLiteral | null = null;
      
      if (matchingSubs.length > 0) {
        const latSum = matchingSubs.reduce((sum, s) => sum + (s.latitude || 0), 0);
        const lngSum = matchingSubs.reduce((sum, s) => sum + (s.longitude || 0), 0);
        
        // Add a small deterministic offset based on project ID to prevent overlay stacking
        const hash = proj.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const offsetLat = ((hash % 10) - 5) * 0.0006;
        const offsetLng = (((hash >> 2) % 10) - 5) * 0.0006;

        coords = {
          lat: (latSum / matchingSubs.length) + offsetLat,
          lng: (lngSum / matchingSubs.length) + offsetLng
        };
      } else if (mapCenter) {
        // Fallback scatter around city center
        const hash = proj.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const offsetLat = ((hash % 16) - 8) * 0.0015;
        const offsetLng = (((hash >> 3) % 16) - 8) * 0.0015;
        coords = {
          lat: mapCenter.lat + offsetLat,
          lng: mapCenter.lng + offsetLng
        };
      }
      return {
        ...proj,
        coords
      };
    });
  }, [projects, submissions, mapCenter]);

  // Filter submissions and assign stable fallback coordinates around mapCenter if missing
  const filteredSubmissions = useMemo(() => {
    return submissions
      .map((sub, idx) => {
        let lat = sub.latitude;
        let lng = sub.longitude;
        
        if ((!lat || !lng) && mapCenter) {
          // Generate a stable fallback offset based on the submission ID
          const seedStr = sub.id || String(idx);
          const hash = seedStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
          const offsetLat = ((hash % 20) - 10) * 0.0018;
          const offsetLng = (((hash >> 3) % 20) - 10) * 0.0018;
          lat = mapCenter.lat + offsetLat;
          lng = mapCenter.lng + offsetLng;
        }
        
        return {
          ...sub,
          latitude: lat,
          longitude: lng
        };
      })
      .filter(sub => {
        if (!sub.latitude || !sub.longitude) return false;
        const matchCat = selectedCategory === 'All' || sub.category === selectedCategory;
        const matchUrg = selectedUrgency === 'All' || sub.urgency === selectedUrgency;
        
        if (nearMeOnly && liveUserCoords) {
          const dist = getDistance(liveUserCoords.lat, liveUserCoords.lng, sub.latitude, sub.longitude);
          if (dist > proximityRange) return false;
        }

        return matchCat && matchUrg;
      });
  }, [submissions, selectedCategory, selectedUrgency, mapCenter, nearMeOnly, liveUserCoords, proximityRange]);

  // Filter projects by selected category (as projects don't have urgency)
  const filteredProjects = useMemo(() => {
    return mappedProjects.filter(p => {
      if (!p.coords) return false;
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;

      if (nearMeOnly && liveUserCoords) {
        const dist = getDistance(liveUserCoords.lat, liveUserCoords.lng, p.coords.lat, p.coords.lng);
        if (dist > proximityRange) return false;
      }

      return matchCat;
    });
  }, [mappedProjects, selectedCategory, nearMeOnly, liveUserCoords, proximityRange]);

  // Map statistics based on filtered submissions
  const statistics = useMemo(() => {
    const total = filteredSubmissions.length;
    const impact = filteredSubmissions.reduce((sum, s) => sum + (s.impactCount || 0), 0);
    const critical = filteredSubmissions.filter(s => s.urgency === 'High').length;
    
    // Find dominant department
    const depts: Record<string, number> = {};
    filteredSubmissions.forEach(s => {
      depts[s.category] = (depts[s.category] || 0) + 1;
    });
    let topDept = 'N/A';
    let maxCount = 0;
    Object.entries(depts).forEach(([dept, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topDept = dept;
      }
    });

    return {
      total,
      impact,
      critical,
      topDept
    };
  }, [filteredSubmissions]);

  const handleRecenterClick = () => {
    if (liveUserCoords) {
      setRecenterTrigger(prev => prev + 1);
    } else if (onDetectLocation) {
      onDetectLocation();
    }
  };

  const handleMarkerClick = (id: string, type: 'submission' | 'project') => {
    setSelectedItemId(id);
    setSelectedType(type);
  };

  // Find currently selected item details
  const selectedItemData = useMemo(() => {
    if (!selectedItemId || !selectedType) return null;
    if (selectedType === 'submission') {
      return submissions.find(s => s.id === selectedItemId) || null;
    } else {
      return mappedProjects.find(p => p.id === selectedItemId) || null;
    }
  }, [selectedItemId, selectedType, submissions, mappedProjects]);

  const getMediumIcon = (type?: string) => {
    switch (type) {
      case 'voice':
        return <Volume2 className="w-4 h-4 text-rose-400" />;
      case 'photo':
        return <Camera className="w-4 h-4 text-emerald-400" />;
      case 'whatsapp':
        return <MessageSquare className="w-4 h-4 text-green-400" />;
      default:
        return <FileText className="w-4 h-4 text-cyan-400" />;
    }
  };

  const getMediumLabel = (type?: string) => {
    switch (type) {
      case 'voice':
        return t.voiceNote;
      case 'photo':
        return t.photoReport;
      case 'whatsapp':
        return t.whatsappChat;
      default:
        return t.textPortal;
    }
  };

  if (!hasValidKey) {
    return (
      <div className="flex items-center justify-center h-[580px] bg-slate-950 border border-slate-900 rounded-2xl p-5 text-slate-400 font-sans text-sm text-center shadow-2xl">
        <div className="max-w-md space-y-4 p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl">
          <h2 className="text-xl font-bold text-slate-100 flex items-center justify-center gap-2">
            <MapPin className="w-6 h-6 text-rose-500 animate-pulse" />
            {t.keyRequired}
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t.keyDesc}
          </p>
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 text-left space-y-2 text-xs">
            <p className="text-slate-200 font-semibold"><strong>{t.howToAdd}</strong></p>
            <ol className="list-decimal list-inside space-y-1 text-slate-300">
              <li>{t.getApiKey}<a href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">{t.gmapsStart}</a></li>
              <li>{t.openSettings}</li>
              <li>{t.goSecrets}</li>
              <li>{t.addSecret}</li>
            </ol>
          </div>
          <p className="text-[10px] text-slate-550 italic">{t.rebuildDesc}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 w-full rounded-2xl overflow-hidden border border-slate-800/80 bg-slate-950 shadow-2xl font-sans" id="spatial-map-container">
      
      {/* 1. LEFT CONTROL PANEL (4 Columns on large screen) */}
      <div className="lg:col-span-4 flex flex-col bg-slate-900/60 border-b lg:border-b-0 lg:border-r border-slate-800/60 p-4 space-y-4 max-h-[580px] overflow-y-auto custom-scrollbar">
        
        {/* Header Title */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-slate-100 font-bold text-sm uppercase tracking-wide">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>{t.citywideAnalytics}</span>
          </div>
          <div className="text-[11px] text-slate-450 leading-relaxed">
            {t.visualizingSub} <span className="text-cyan-300 font-semibold">{cityName}</span>.
          </div>
        </div>

        {/* Display Modes Layer Switcher */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">{t.layers}</span>
            <button 
              onClick={() => { setShowPins(true); setShowHotspots(true); setShowProjects(true); }}
              className="text-[9px] text-cyan-400 hover:text-cyan-300 font-mono font-bold"
            >
              Show All
            </button>
          </div>
          <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-850">
            <button
              onClick={() => { setShowPins(!showPins); }}
              className={`py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all flex flex-col items-center gap-1 cursor-pointer select-none ${showPins ? 'bg-slate-850 text-cyan-400 border border-cyan-500/20 shadow-md' : 'text-slate-500 hover:text-slate-450'}`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{t.individualPins}</span>
            </button>
            <button
              onClick={() => { setShowHotspots(!showHotspots); }}
              className={`py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all flex flex-col items-center gap-1 cursor-pointer select-none ${showHotspots ? 'bg-slate-850 text-rose-400 border border-rose-500/20 shadow-md' : 'text-slate-500 hover:text-slate-450'}`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>{t.impactHotspots}</span>
            </button>
            <button
              onClick={() => { setShowProjects(!showProjects); }}
              className={`py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all flex flex-col items-center gap-1 cursor-pointer select-none ${showProjects ? 'bg-slate-850 text-amber-400 border border-amber-500/20 shadow-md' : 'text-slate-500 hover:text-slate-450'}`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>{t.proposedSolutions}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Filters */}
        <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-850 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-850 pb-1.5">
            <span className="text-[10px] font-bold text-slate-350 uppercase tracking-wider flex items-center gap-1">
              <Filter className="w-3 h-3 text-cyan-400" />
              {t.filters}
            </span>
            {(selectedCategory !== 'All' || selectedUrgency !== 'All' || nearMeOnly) && (
              <button 
                onClick={() => { setSelectedCategory('All'); setSelectedUrgency('All'); setNearMeOnly(false); }}
                className="text-[9px] text-rose-400 hover:text-rose-300 font-mono flex items-center gap-0.5"
              >
                Reset
              </button>
            )}
          </div>

          {/* Category selection */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-450 block font-medium">{t.categories}</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1 px-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
            >
              <option value="All">🌐 {t.all}</option>
              {categoriesList.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Urgency Selection (active when grievance layers are visible) */}
          {(showPins || showHotspots) && (
            <div className="space-y-1">
              <label className="text-[10px] text-slate-450 block font-medium">{t.urgency}</label>
              <div className="flex gap-1">
                {['All', 'High', 'Medium', 'Low'].map((urg) => (
                  <button
                    key={`urg-btn-${urg}`}
                    onClick={() => setSelectedUrgency(urg)}
                    className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-all border cursor-pointer select-none ${
                      selectedUrgency === urg 
                        ? 'bg-slate-800 text-slate-100 border-slate-700' 
                        : 'bg-slate-900/50 text-slate-450 hover:text-slate-300 border-transparent'
                    }`}
                  >
                    {urg === 'All' ? t.all : urg === 'High' ? t.high.split('/')[0] : urg === 'Medium' ? t.medium : t.low}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* User GPS Proximity Filter */}
          {liveUserCoords && (
            <div className="space-y-1.5 pt-1.5 border-t border-slate-850/60">
              <div className="flex items-center justify-between">
                <label className="text-[10px] text-slate-450 block font-medium flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-400 animate-pulse" />
                  <span>GPS Proximity Filter</span>
                </label>
                <button
                  onClick={() => setNearMeOnly(!nearMeOnly)}
                  className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono transition-all select-none cursor-pointer ${
                    nearMeOnly 
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-slate-900 text-slate-450 border border-slate-800 hover:text-slate-300'
                  }`}
                >
                  {nearMeOnly ? "ACTIVE" : "OFF"}
                </button>
              </div>

              {nearMeOnly && (
                <div className="space-y-1.5 animate-fadeIn">
                  <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono">
                    <span>Max Distance:</span>
                    <span className="font-bold text-emerald-400">{proximityRange} km</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    step="1"
                    value={proximityRange}
                    onChange={(e) => setProximityRange(Number(e.target.value))}
                    className="w-full accent-emerald-500 bg-slate-900 h-1 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[8px] text-slate-500 font-mono">
                    <span>1 km</span>
                    <span>25 km</span>
                    <span>50 km</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Live Map Statistics Panel */}
        <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-850 space-y-2.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            {t.stats}
          </span>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-900/50 p-2 rounded-lg border border-slate-850/60">
              <span className="text-[9px] text-slate-450 block">{t.mappedComplaints}</span>
              <span className="text-sm font-bold text-slate-200">{statistics.total}</span>
            </div>
            <div className="bg-slate-900/50 p-2 rounded-lg border border-slate-850/60">
              <span className="text-[9px] text-slate-450 block">{t.estimatedImpact}</span>
              <span className="text-sm font-bold text-cyan-400 flex items-center gap-1">
                <Users className="w-3 h-3 text-cyan-500" />
                {statistics.impact}
              </span>
            </div>
            <div className="bg-slate-900/50 p-2 rounded-lg border border-slate-850/60">
              <span className="text-[9px] text-slate-450 block">{t.criticalIssues}</span>
              <span className="text-sm font-bold text-rose-500 flex items-center gap-1">
                <Flame className="w-3 h-3 text-rose-500" />
                {statistics.critical}
              </span>
            </div>
            <div className="bg-slate-900/50 p-2 rounded-lg border border-slate-850/60">
              <span className="text-[9px] text-slate-450 block">{t.dominantDept}</span>
              <span className="text-[10px] font-bold text-emerald-400 truncate block mt-0.5">{statistics.topDept}</span>
            </div>
          </div>
        </div>

      </div>

      {/* 2. MAP & DETAILED SIDE PANEL / BOTTOM DRAWER (8 Columns on large screen) */}
      <div className="lg:col-span-8 flex flex-col h-[580px] md:relative">
        
        {/* Map Stage Window */}
        <div className="relative flex-1 bg-slate-950 overflow-hidden min-h-[350px]">
          <Map
            defaultCenter={{ lat: 20.5937, lng: 78.9629 }}
            defaultZoom={5}
            mapId="DEMO_MAP_ID"
            disableDefaultUI={true}
            style={{ width: '100%', height: '100%' }}
          >
            <CityCenterMarker cityName={cityName} onCenterResolved={setMapCenter} />
            <LiveLocationController 
              liveUserCoords={liveUserCoords} 
              onCenterSet={setMapCenter} 
              recenterTrigger={recenterTrigger}
            />

            {/* Live user coords marker */}
            {liveUserCoords && (
              <AdvancedMarker position={liveUserCoords}>
                <div className="relative flex items-center justify-center z-50">
                  <span className="absolute inline-flex h-8 w-8 rounded-full bg-cyan-400/30 opacity-75 animate-ping"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-500 border-2 border-slate-950 shadow-lg shadow-cyan-950"></span>
                </div>
              </AdvancedMarker>
            )}

            {/* LAYER 1: Grievance Pins */}
            {showPins && filteredSubmissions.map((sub) => {
              const pinColor = sub.urgency === 'High' ? '#ef4444' : sub.urgency === 'Medium' ? '#f97316' : '#10b981';
              const isSelected = selectedItemId === sub.id && selectedType === 'submission';
              return (
                <AdvancedMarker key={`sub-pin-${sub.id}`} position={{ lat: sub.latitude!, lng: sub.longitude! }}>
                  <div 
                    onClick={() => handleMarkerClick(sub.id, 'submission')}
                    className="relative flex items-center justify-center cursor-pointer group"
                  >
                    {sub.urgency === 'High' && (
                      <span className="absolute inline-flex h-5 w-5 rounded-full bg-rose-500/20 animate-pulse"></span>
                    )}
                    <div 
                      className={`rounded-full border shadow-lg transition-all flex items-center justify-center ${
                        isSelected 
                          ? 'w-6 h-6 border-white scale-110 ring-4 ring-cyan-400/40 z-30' 
                          : 'w-4 h-4 border-slate-900 group-hover:scale-125 z-10'
                      }`}
                      style={{ backgroundColor: pinColor }}
                    >
                      <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                    </div>

                    {/* Standard Hover tooltips */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-900/95 border border-slate-800 rounded-xl p-2.5 shadow-2xl z-40 text-xs w-48 space-y-1.5 backdrop-blur-sm pointer-events-none">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                        <span className="font-bold text-slate-200 truncate pr-1">{sub.name}</span>
                        {liveUserCoords && (
                          <span className="text-[9px] text-emerald-400 font-mono font-bold flex items-center gap-0.5 shrink-0">
                            <MapPin className="w-2.5 h-2.5" />
                            {getDistance(liveUserCoords.lat, liveUserCoords.lng, sub.latitude!, sub.longitude!) < 1
                              ? `${(getDistance(liveUserCoords.lat, liveUserCoords.lng, sub.latitude!, sub.longitude!) * 1000).toFixed(0)}m`
                              : `${getDistance(liveUserCoords.lat, liveUserCoords.lng, sub.latitude!, sub.longitude!).toFixed(1)}km`
                            }
                          </span>
                        )}
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
            })}

            {/* LAYER 2: Hotspots Glow Layer */}
            {showHotspots && filteredSubmissions.map((sub) => {
              const radiusSize = Math.max(25, Math.min(65, (sub.impactCount || 100) / 4));
              const ringColor = sub.urgency === 'High' 
                ? 'rgba(239, 68, 68, 0.15)' 
                : sub.urgency === 'Medium' 
                  ? 'rgba(249, 115, 22, 0.15)' 
                  : 'rgba(16, 185, 129, 0.12)';
              const borderColor = sub.urgency === 'High' ? '#f43f5e' : sub.urgency === 'Medium' ? '#f97316' : '#10b981';
              const isSelected = selectedItemId === sub.id && selectedType === 'submission';

              return (
                <AdvancedMarker key={`sub-hotspot-${sub.id}`} position={{ lat: sub.latitude!, lng: sub.longitude! }}>
                  <div 
                    onClick={() => handleMarkerClick(sub.id, 'submission')}
                    className="relative flex items-center justify-center cursor-pointer group"
                  >
                    {/* Centered tiny point */}
                    <div className="w-2.5 h-2.5 rounded-full border border-slate-950 bg-white shadow-md z-20"></div>
                    
                    {/* Hotspot ring radius */}
                    <div 
                      className={`absolute rounded-full border border-dashed transition-all duration-300 flex items-center justify-center hover:scale-110 ${
                        isSelected ? 'animate-pulse border-cyan-400 scale-105 z-30' : 'border-opacity-60'
                      }`}
                      style={{ 
                        width: `${radiusSize * 2}px`, 
                        height: `${radiusSize * 2}px`, 
                        backgroundColor: ringColor,
                        borderColor: isSelected ? '#22d3ee' : borderColor,
                        boxShadow: `0 0 15px ${borderColor}33`
                      }}
                    >
                      {/* Pulse rings inside */}
                      <span className="absolute inset-0 rounded-full border border-white/5 animate-ping"></span>
                    </div>

                    {/* Quick overlay tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 hidden group-hover:block bg-slate-900 border border-slate-850 p-2.5 rounded-lg shadow-xl z-50 text-[10px] w-44 space-y-1">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-1 font-bold text-slate-200">
                        <span>Impact Area</span>
                        {liveUserCoords && (
                          <span className="text-emerald-400 font-mono text-[9px] flex items-center gap-0.5">
                            <MapPin className="w-2.5 h-2.5" />
                            {getDistance(liveUserCoords.lat, liveUserCoords.lng, sub.latitude!, sub.longitude!) < 1
                              ? `${(getDistance(liveUserCoords.lat, liveUserCoords.lng, sub.latitude!, sub.longitude!) * 1000).toFixed(0)}m`
                              : `${getDistance(liveUserCoords.lat, liveUserCoords.lng, sub.latitude!, sub.longitude!).toFixed(1)}km`
                            }
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400">{sub.impactCount} citizens affected</p>
                    </div>
                  </div>
                </AdvancedMarker>
              );
            })}

            {/* LAYER 3: Proposed Infrastructure Solutions */}
            {showProjects && (
              <>
                {/* Background submissions in a dimmed pin display only when active pins layer is turned off */}
                {!showPins && filteredSubmissions.map((sub) => (
                  <AdvancedMarker key={`dim-sub-${sub.id}`} position={{ lat: sub.latitude!, lng: sub.longitude! }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-700/65 border border-slate-900/60" />
                  </AdvancedMarker>
                ))}

                {/* Proposed Project stars */}
                {filteredProjects.map((proj) => {
                  const isSelected = selectedItemId === proj.id && selectedType === 'project';
                  return (
                    <AdvancedMarker key={`proj-star-${proj.id}`} position={proj.coords!}>
                      <div 
                        onClick={() => handleMarkerClick(proj.id, 'project')}
                        className={`group relative flex items-center justify-center cursor-pointer transition-all duration-300 p-1.5 rounded-full border shadow-2xl ${
                          isSelected 
                            ? 'bg-slate-900 border-amber-400 text-amber-400 ring-4 ring-amber-400/20 scale-110 z-30' 
                            : 'bg-slate-950 hover:bg-slate-900 border-slate-800 text-cyan-400 hover:scale-125 z-20'
                        }`}
                      >
                        <Award className={`w-4 h-4 ${isSelected ? 'animate-bounce text-amber-400' : 'text-amber-500'}`} />
                        
                        {/* Pulse glow background */}
                        <span className="absolute inset-0 rounded-full border border-amber-500/25 animate-ping opacity-60"></span>

                        {/* Quick hover info */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 hidden group-hover:block bg-slate-900/95 border border-slate-800 rounded-xl p-2.5 shadow-2xl z-40 text-xs w-48 space-y-1 backdrop-blur-sm pointer-events-none">
                          <div className="flex items-center justify-between">
                            <span className="text-[8px] font-mono text-amber-400 font-bold uppercase tracking-wider block">PROPOSED WORK</span>
                            {liveUserCoords && proj.coords && (
                              <span className="text-[9px] text-emerald-400 font-mono font-bold flex items-center gap-0.5 shrink-0">
                                <MapPin className="w-2.5 h-2.5" />
                                {getDistance(liveUserCoords.lat, liveUserCoords.lng, proj.coords.lat, proj.coords.lng) < 1
                                  ? `${(getDistance(liveUserCoords.lat, liveUserCoords.lng, proj.coords.lat, proj.coords.lng) * 1000).toFixed(0)}m`
                                  : `${getDistance(liveUserCoords.lat, liveUserCoords.lng, proj.coords.lat, proj.coords.lng).toFixed(1)}km`
                                }
                              </span>
                            )}
                          </div>
                          <span className="font-bold text-slate-200 line-clamp-1">{proj.title}</span>
                          <div className="flex items-center justify-between text-[9px] pt-1">
                            <span className="text-slate-400 font-bold">₹{proj.estimatedCost} Lakhs</span>
                            <span className="text-emerald-400 font-bold">{proj.infrastructureBenefitScore}/100</span>
                          </div>
                        </div>
                      </div>
                    </AdvancedMarker>
                  );
                })}
              </>
            )}
          </Map>

          {/* Floating live location recenter / auto-detect button */}
          {(onDetectLocation || liveUserCoords) && (
            <div className="absolute bottom-3 right-3 z-10">
              <button
                id="map-recenter-btn"
                onClick={handleRecenterClick}
                disabled={detectingLocation}
                className="flex items-center gap-1.5 bg-slate-900/95 hover:bg-slate-800 border border-slate-800/80 hover:border-slate-700 text-slate-100 font-bold px-3.5 py-2 rounded-xl shadow-2xl transition-all active:scale-95 text-[10px] select-none disabled:opacity-60 cursor-pointer"
              >
                {detectingLocation ? (
                  <>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                    </span>
                    <span>{t.gpsAcquiring}</span>
                  </>
                ) : liveUserCoords ? (
                  <>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span>{t.liveLocFound}</span>
                  </>
                ) : (
                  <>
                    <MapPin className="w-3.5 h-3.5 text-rose-500 animate-bounce" />
                    <span>{t.detectLocation}</span>
                  </>
                )}
              </button>
            </div>
          )}
          
          {/* Layer Indicator Banner */}
          <div className="absolute top-3 right-3 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 border border-slate-800 rounded-lg text-[8px] font-mono text-slate-300 tracking-wider font-bold flex flex-wrap gap-1.5 max-w-[200px] sm:max-w-none">
            {showPins && <span className="text-cyan-400">[PINS]</span>}
            {showHotspots && <span className="text-rose-400">[HOTSPOTS]</span>}
            {showProjects && <span className="text-amber-400">[PROJECTS]</span>}
            {nearMeOnly && liveUserCoords && <span className="text-emerald-400">[NEAR ME: {proximityRange}km]</span>}
            {!showPins && !showHotspots && !showProjects && <span className="text-slate-500">[ALL LAYERS HIDDEN]</span>}
          </div>
        </div>

        {/* 3. SELECTED ITEM BOTTOM DETAIL SHEET */}
        <div className="border-t border-slate-800/80 bg-slate-900/40 p-4 h-48 flex items-center justify-center transition-all">
          {!selectedItemData ? (
            <div className="flex flex-col items-center justify-center text-center space-y-2 p-4 text-slate-500">
              <Layers className="w-6 h-6 text-slate-700 animate-pulse" />
              <p className="text-xs max-w-md font-sans leading-relaxed">
                {t.noItemSelected}
              </p>
            </div>
          ) : selectedType === 'submission' ? (
            // SUBMISSION DETAIL GRID
            <div className="w-full h-full flex flex-col justify-between space-y-2" id="map-selected-submission-card">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-100 font-sans">
                      {(selectedItemData as Submission).name}
                    </span>
                    <span className="text-[9px] font-mono font-bold bg-slate-800/80 border border-slate-750 text-slate-400 px-1.5 py-0.5 rounded uppercase flex items-center gap-1">
                      {getMediumIcon((selectedItemData as Submission).inputType)}
                      {getMediumLabel((selectedItemData as Submission).inputType)}
                    </span>
                    <span className="text-[9px] font-mono font-bold text-slate-500">
                      {new Date((selectedItemData as Submission).timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-350 line-clamp-2 mt-1 leading-relaxed">
                    "{(selectedItemData as Submission).translatedText}"
                  </p>
                </div>
                <button 
                  onClick={() => { setSelectedItemId(null); setSelectedType(null); }}
                  className="text-slate-500 hover:text-slate-300 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Bottom properties bar */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 border-t border-slate-850 pt-2 text-[10px] items-center">
                <div className="md:col-span-3 flex items-center gap-1.5">
                  <span className="text-slate-500">{t.dept}:</span>
                  <span className="font-bold text-cyan-400 truncate font-mono uppercase">
                    {(selectedItemData as Submission).category}
                  </span>
                </div>
                
                <div className="md:col-span-2 flex items-center gap-1.5">
                  <span className="text-slate-500">{t.urgency}</span>
                  <span 
                    className="font-bold font-mono uppercase px-1.5 py-0.5 rounded-sm"
                    style={{
                      color: (selectedItemData as Submission).urgency === 'High' ? '#ef4444' : (selectedItemData as Submission).urgency === 'Medium' ? '#f97316' : '#10b981',
                      backgroundColor: (selectedItemData as Submission).urgency === 'High' ? 'rgba(239, 68, 68, 0.1)' : (selectedItemData as Submission).urgency === 'Medium' ? 'rgba(249, 115, 22, 0.1)' : 'rgba(16, 185, 129, 0.1)'
                    }}
                  >
                    {(selectedItemData as Submission).urgency}
                  </span>
                </div>

                <div className="md:col-span-2 flex items-center gap-1.5">
                  <span className="text-slate-500">{t.estimatedImpact}:</span>
                  <span className="font-bold text-slate-200 font-mono flex items-center gap-0.5">
                    <Users className="w-3.5 h-3.5 text-cyan-500" />
                    {(selectedItemData as Submission).impactCount}
                  </span>
                </div>

                <div className="md:col-span-3 flex items-center gap-1.5">
                  {liveUserCoords && (selectedItemData as Submission).latitude && (selectedItemData as Submission).longitude && (
                    <>
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                      <span className="font-bold text-emerald-400 font-mono">
                        {getDistance(liveUserCoords.lat, liveUserCoords.lng, (selectedItemData as Submission).latitude!, (selectedItemData as Submission).longitude!) < 1
                          ? `${(getDistance(liveUserCoords.lat, liveUserCoords.lng, (selectedItemData as Submission).latitude!, (selectedItemData as Submission).longitude!) * 1000).toFixed(0)}m away`
                          : `${getDistance(liveUserCoords.lat, liveUserCoords.lng, (selectedItemData as Submission).latitude!, (selectedItemData as Submission).longitude!).toFixed(1)} km away`
                        }
                      </span>
                    </>
                  )}
                </div>

                <div className="md:col-span-2 flex justify-end">
                  <span className="text-[10px] font-bold text-emerald-400/90 hover:text-emerald-300 transition-all font-mono tracking-tight uppercase flex items-center gap-0.5 border border-emerald-500/20 px-2 py-1 rounded bg-emerald-500/5">
                    <Clock className="w-3 h-3" />
                    {(selectedItemData as Submission).status}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            // PROPOSED PROJECT DETAIL GRID
            <div className="w-full h-full flex flex-col justify-between space-y-2" id="map-selected-project-card">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded tracking-wide uppercase flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      ALIGNED SOLUTION
                    </span>
                    <span className="text-sm font-bold text-slate-100 font-sans">
                      {(selectedItemData as ProposedProject).title}
                    </span>
                  </div>
                  <p className="text-xs text-slate-350 line-clamp-2 mt-1 leading-relaxed">
                    {(selectedItemData as ProposedProject).description}
                  </p>
                </div>
                <button 
                  onClick={() => { setSelectedItemId(null); setSelectedType(null); }}
                  className="text-slate-500 hover:text-slate-300 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Bottom project metrics bar */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2 border-t border-slate-850 pt-2 text-[10px] items-center">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">{t.cost}:</span>
                  <span className="font-bold text-amber-400 font-mono">
                    ₹{(selectedItemData as ProposedProject).estimatedCost} Lakhs
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">{t.benefitScore}:</span>
                  <span className="font-bold text-emerald-400 font-mono">
                    {(selectedItemData as ProposedProject).infrastructureBenefitScore}/100
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">{t.demandScore}:</span>
                  <span className="font-bold text-cyan-400 font-mono flex items-center gap-0.5">
                    <TrendingUp className="w-3.5 h-3.5 text-cyan-500" />
                    {(selectedItemData as ProposedProject).demandIndex}%
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {liveUserCoords && (selectedItemData as any).coords && (
                    <>
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                      <span className="font-bold text-emerald-400 font-mono">
                        {getDistance(liveUserCoords.lat, liveUserCoords.lng, (selectedItemData as any).coords!.lat, (selectedItemData as any).coords!.lng) < 1
                          ? `${(getDistance(liveUserCoords.lat, liveUserCoords.lng, (selectedItemData as any).coords!.lat, (selectedItemData as any).coords!.lng) * 1000).toFixed(0)}m`
                          : `${getDistance(liveUserCoords.lat, liveUserCoords.lng, (selectedItemData as any).coords!.lat, (selectedItemData as any).coords!.lng).toFixed(1)} km`
                        }
                      </span>
                    </>
                  )}
                </div>

                <div className="flex justify-end gap-1 font-mono text-[9px]">
                  <span className="bg-slate-950 text-slate-400 border border-slate-850 px-2 py-1 rounded">
                    {(selectedItemData as ProposedProject).citizenSubmissionsCount} REPORTS
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
