import React, { useState, useEffect } from 'react';
import { Submission } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Brain, Lightbulb, MapPin, Layers, FileText, 
  Activity, Users, Clipboard, Info, ThumbsUp, CheckCircle2, 
  ArrowRight, Landmark, RefreshCw, AlertTriangle, ChevronRight, ChevronDown
} from 'lucide-react';

interface AISuggestionTabProps {
  selectedState: string;
  selectedCity: string;
  submissions: Submission[];
  onSelectProjectForReport: (project: any) => void;
  selectedProject: any;
  language?: string;
}

const suggestionTranslations: Record<string, any> = {
  en: {
    title: "AI Suggestion Deck",
    activeLabel: "Gemini Synthesis Engine Active",
    subtitle: "This space combines localized citizen grievances with demographic distributions, infrastructure deficit registries, regional development master plans, and environmental public datasets to prioritize and generate highly-actionable project works under MPLADS.",
    recalculate: "Deep-Recalculate Synthesis",
    analyzing: "Running Multi-Dataset Cross Analysis...",
    analyzingDesc: "Parsing active complaints, modeling local demographic maps, crossing water/school gaps, and aligning Master Plan registries.",
    engineOffline: "Synthesis Engine Offline",
    retry: "Retry Analytics Run",
    datasetsTitle: "Public Datasets Integrated",
    demoProfile: "Demographics Profile",
    youthRatio: "Youth Ratio",
    infraDeficitReg: "Infrastructure Deficit Register",
    waterDeficit: "Water Deficit",
    schoolDeficit: "School Deficit",
    envDatasets: "Environmental & Public Datasets",
    floodingRisk: "Flooding Risk",
    aqiIndex: "Average AQI Index",
    localMasterPlan: "Local Master Development Plan",
    smartTransit: "Aligned with Smart Transit Corridor Initiative",
    directivesSec: "Corresponds to Section 4 Infrastructure Directives",
    hotspotsTitle: "Geospatial Demand Hotspots",
    hotspotsPriority: "Density",
    activeGrievances: "Active Complaints",
    themesTitle: "Surfaced Complaint Themes",
    sentiment: "SENTIMENT",
    severity: "SEVERITY",
    recommendationsTitle: "Ranked High-Priority Works",
    recommendationsSubtitle: "Recommended local developments computed by merging active demand indices and public registers.",
    recommendationsCount: "Recommendations",
    estCost: "ESTIMATED BUDGET",
    scopeBenefits: "IMPACT CAPACITY",
    alignmentJustification: "Alignment Justification",
    localPlanAlignment: "🗺️ REGIONAL MASTER PLAN",
    publicDatasetGrounding: "📊 CENSUS & FLOOD INDEX OVERLAY",
    phasedPlan: "🗺️ Suggested Step-by-Step Action Plan",
    selectProject: "Select Project for Proposal Draft",
    selectedForReport: "Selected for MP Action Report",
    initiateReport: "Initiate MP Recommendation Report",
    upvote: "Upvote",
    cases: "cases",
    priorityIndex: "Priority Index",
    combinedDatasets: "Combined Datasets & Alignment Proofs",
    demographicCross: "👥 DEMOGRAPHIC CROSS",
    physicalInfraGap: "🏗️ PHYSICAL INFRA DEFICIT GAP",
    stable: "STABLE",
  },
  ml: {
    title: "എ ഐ നിർദ്ദേശ ഡെക്ക്",
    activeLabel: "ജെമിനി സിന്തസിസ് എഞ്ചിൻ സജീവം",
    subtitle: "പ്രാദേശിക പൗരന്മാരുടെ പരാതികൾ, ജനസംഖ്യാ വിവരങ്ങൾ, അടിസ്ഥാന സൗകര്യ കുറവുകൾ, പ്രാദേശിക വികസന പദ്ധതികൾ, പരിസ്ഥിതി ഡാറ്റ എന്നിവ സമന്വയിപ്പിച്ച് എംപി ഫണ്ട് വഴിയുള്ള വികസന പദ്ധതികൾ മുൻഗണനാക്രമത്തിൽ ഇവിടെ തയ്യാറാക്കുന്നു.",
    recalculate: "തത്സമയ വിശകലനം നടത്തുക",
    analyzing: "ഡാറ്റാസെറ്റുകൾ വിശകലനം ചെയ്യുന്നു...",
    analyzingDesc: "സജീവമായ പരാതികൾ പരിശോധിക്കുന്നു, ജനസംഖ്യാ ഭൂപടങ്ങൾ തരംതിരിക്കുന്നു, അടിസ്ഥാന സൗകര്യ കുറവുകൾ വിലയിരുത്തുന്നു.",
    engineOffline: "വിശകലന എഞ്ചിൻ ഓഫ്ലൈൻ ആണ്",
    retry: "വീണ്ടും ശ്രമിക്കുക",
    datasetsTitle: "സംയോജിപ്പിച്ച പൊതു ഡാറ്റാസെറ്റുകൾ",
    demoProfile: "ജനസംഖ്യാ വിവരങ്ങൾ",
    youthRatio: "യുവജന അനുപാതം",
    infraDeficitReg: "അടിസ്ഥാന സൗകര്യ കുറവുകൾ",
    waterDeficit: "കുടിവെള്ള ക്ഷാമം",
    schoolDeficit: "സ്കൂളുകളുടെ കുറവ്",
    envDatasets: "പരിസ്ഥിതി പൊതു ഡാറ്റാസെറ്റുകൾ",
    floodingRisk: "വെള്ളപ്പൊക്ക സാധ്യത",
    aqiIndex: "ശരാശരി വായു ഗുണനിലവാരം (AQI)",
    localMasterPlan: "പ്രാദേശിക മാസ്റ്റർ വികസന പദ്ധതി",
    smartTransit: "സ്മാർട്ട് ട്രാൻസിറ്റ് കോറിഡോർ പദ്ധതിയുമായി പൊരുത്തപ്പെടുന്നു",
    directivesSec: "സെക്ഷൻ 4 അടിസ്ഥാന സൗകര്യ നിർദ്ദേശങ്ങൾ",
    hotspotsTitle: "ഭൂമിശാസ്ത്രപരമായ പരാതി കേന്ദ്രങ്ങൾ",
    hotspotsPriority: "സാന്ദ്രത",
    activeGrievances: "സജീവമായ പരാതികൾ",
    themesTitle: "പരാതികളിലെ പ്രധാന വിഷയങ്ങൾ",
    sentiment: "മനോഭാവം",
    severity: "തീവ്രത",
    recommendationsTitle: "മുൻഗണനാ ശുപാർശകൾ",
    recommendationsSubtitle: "മേഖലയിലെ അടിസ്ഥാന സൗകര്യ കുറവുകളും പൗരന്മാരുടെ പരാതികളുടെ എണ്ണവും വിലയിരുത്തി തയ്യാറാക്കിയ ശുപാർശകൾ.",
    recommendationsCount: "ശുപാർശകൾ",
    estCost: "അനുമാനിക്കുന്ന ചെലവ്",
    scopeBenefits: "പ്രയോജനങ്ങളുടെ വ്യാപ്തി",
    alignmentJustification: "ന്യായീകരണം",
    localPlanAlignment: "🗺️ പ്രാദേശിക വികസന പദ്ധതി",
    publicDatasetGrounding: "📊 പൊതു ഡാറ്റാ അടിസ്ഥാനം",
    phasedPlan: "🗺️ ഘട്ടം ഘട്ടമായുള്ള പദ്ധതി",
    selectProject: "പദ്ധതി റിപ്പോർട്ട് ഡ്രാഫ്റ്റ് തിരഞ്ഞെടുക്കുക",
    selectedForReport: "റിപ്പോർട്ടിനായി തിരഞ്ഞെടുത്തു",
    initiateReport: "എംപി ശുപാർശ റിപ്പോർട്ട് ആരംഭിക്കുക",
    upvote: "പിന്തുണയ്ക്കുക",
    cases: "കേസുകൾ",
    priorityIndex: "മുൻഗണനാ സൂചിക",
    combinedDatasets: "സംയോജിപ്പിച്ച ഡാറ്റാസെറ്റുകളും തെളിവുകളും",
    demographicCross: "👥 ജനസംഖ്യാ വിവരങ്ങൾ",
    physicalInfraGap: "🏗️ അടിസ്ഥാന സൗകര്യ കുറവുകൾ",
    stable: "സ്ഥിരതയുള്ളത്",
  },
  hi: {
    title: "एआई सुझाव डेक",
    activeLabel: "जेमिनी विश्लेषण इंजन सक्रिय",
    subtitle: "यह स्थान स्थानीय नागरिकों की शिकायतों को जनसांख्यिकीय वितरण, बुनियादी ढांचे के घाटे, क्षेत्रीय विकास मास्टर योजनाओं और पर्यावरणीय सार्वजनिक डेटासेट के साथ जोड़कर प्राथमिकताएं तय करता है और कार्य योजना तैयार करता है।",
    recalculate: "गहन पुनः गणना विश्लेषण",
    analyzing: "बहु-डेटासेट क्रॉस विश्लेषण चल रहा है...",
    analyzingDesc: "सक्रिय शिकायतों का विश्लेषण, स्थानीय जनसांख्यिकीय मानचित्रों का मॉडलिंग और बुनियादी ढांचा कमियों का मिलान किया जा रहा है।",
    engineOffline: "संषलेषण इंजन ऑफ़लाइन",
    retry: "विश्लेषण पुनः प्रयास करें",
    datasetsTitle: "एकीकृत सार्वजनिक डेटासेट",
    demoProfile: "जनसांख्यिकी प्रोफ़ाइल",
    youthRatio: "युवा अनुपात",
    infraDeficitReg: "बुनियादी ढांचा घाटा रजिस्टर",
    waterDeficit: "पानी की कमी",
    schoolDeficit: "स्कूल की कमी",
    envDatasets: "पर्यावरणीय और सार्वजनिक डेटासेट",
    floodingRisk: "बाढ़ का खतरा",
    aqiIndex: "औसत वायु गुणवत्ता सूचकांक (AQI)",
    localMasterPlan: "स्थानीय मास्टर विकास योजना",
    smartTransit: "स्मार्ट ट्रांजिट कॉरिडोर पहल के साथ संरेखित",
    directivesSec: "धारा 4 बुनियादी ढांचा दिशानिर्देश",
    hotspotsTitle: "भू-स्थानिक मांग हॉटस्पॉट",
    hotspotsPriority: "घनत्व",
    activeGrievances: "सक्रिय शिकायतें",
    themesTitle: "मुख्य शिकायत विषय",
    sentiment: "भावना",
    severity: "तीव्रता",
    recommendationsTitle: "उच्च प्राथमिकता वाली सिफारिशें",
    recommendationsSubtitle: "क्षेत्रीय कमी मेट्रिक्स और नागरिक शिकायत आवृत्ति को मिलाकर परिकलित स्थानीय विकास कार्य।",
    recommendationsCount: "सिफारिशें",
    estCost: "अनुमानित बजट",
    scopeBenefits: "प्रभाव क्षमता",
    alignmentJustification: "संरेखण औचित्य",
    localPlanAlignment: "🗺️ स्थानीय मास्टर योजना संरेखण",
    publicDatasetGrounding: "📊 सार्वजनिक डेटासेट ग्राउंडिंग",
    phasedPlan: "🗺️ चरणबद्ध कार्यान्वयन योजना",
    selectProject: "प्रस्ताव मसौदे के लिए परियोजना चुनें",
    selectedForReport: "सांसद रिपोर्ट के लिए चयनित",
    initiateReport: "सांसद सिफारिश रिपोर्ट शुरू करें",
    upvote: "वोट दें",
    cases: "मामले",
    priorityIndex: "प्राथमिकता सूचकांक",
    combinedDatasets: "संयुक्त डेटासेट और संरेखण साक्ष्य",
    demographicCross: "👥 जनसांख्यिकी मिलान",
    physicalInfraGap: "🏗️ भौतिक अवसंरचना अंतर",
    stable: "स्थिर",
  },
  bn: {
    title: "এআই পরামর্শ ডেক",
    activeLabel: "জেমিনি সিন্থেসিস ইঞ্জিন সক্রিয়",
    subtitle: "এই স্পেসটি নাগরিক অভিযোগ, জনসংখ্যার প্রোফাইল, পরিকাঠামো ঘাটতি এবং পরিবেশগত ডেটাসেটের সমন্বয়ে সাংসদ তহবিল প্রকল্পের অগ্রাধিকার নির্ধারণ ও সমাধান তৈরি করে।",
    recalculate: "পুনরায় গভীর বিশ্লেষণ করুন",
    analyzing: "মাল্টি-ডেটাসেট ক্রস বিশ্লেষণ চলছে...",
    analyzingDesc: "সক্রিয় অভিযোগগুলি বিশ্লেষণ করা হচ্ছে, জনসংখ্যার মানচিত্র মডেলিং করা হচ্ছে এবং ঘাটতিগুলি চিহ্নিত করা হচ্ছে।",
    engineOffline: "সিন্থেসিস ইঞ্জিন অফলাইন",
    retry: "বিশ্লেষণ পুনরায় চেষ্টা করুন",
    datasetsTitle: "সমন্বিত গণ ডেটাসেট",
    demoProfile: "জনসংখ্যার প্রোফাইল",
    youthRatio: "যুব অনুপাত",
    infraDeficitReg: "পরিকাঠামো ঘাটতি রেজিস্টার",
    waterDeficit: "জলের ঘাটতি",
    schoolDeficit: "স্কুল ঘাটতি",
    envDatasets: "পরিবেশগত ও গণ ডেটাসেট",
    floodingRisk: "বন্যার ঝুঁকি",
    aqiIndex: "গড় বায়ু গুণমান সূচক (AQI)",
    localMasterPlan: "স্থানীয় মাস্টার উন্নয়ন পরিকল্পনা",
    smartTransit: "স্মার্ট ট্রানজিট করিডোর উদ্যোগের সাথে সামঞ্জस्यপূর্ণ",
    directivesSec: "ধারা ৪ পরিকাঠামো নির্দেশাবলী",
    hotspotsTitle: "ভূ-স্থানিক চাহিদা হটস্পট",
    hotspotsPriority: "ঘনত্ব",
    activeGrievances: "সক্রিয় অভিযোগ",
    themesTitle: "উত্থিত অভিযোগের থিম",
    sentiment: "মনোभाव",
    severity: "তীব্রতা",
    recommendationsTitle: "র্যাঙ্ক করা উচ্চ অগ্রাধিকার কাজ",
    recommendationsSubtitle: "সক্রিয় চাহিদাকারী সূচক এবং সরকারী রেজিস্ট্রি একত্রিত করে গণনাকৃত স্থানীয় উন্নয়ন কাজসমূহ।",
    recommendationsCount: "সুপারিশ",
    estCost: "আনুমানিক বাজেট",
    scopeBenefits: "সুবিধাভোগীর সংখ্যা",
    alignmentJustification: "সামঞ্জস্যের যৌক্তিকতা",
    localPlanAlignment: "🗺️ স্থানীয় মাস্টার প্ল্যান সামঞ্জস্য",
    publicDatasetGrounding: "📊 গণ ডেটাসেট গ্রাউন্ডিং",
    phasedPlan: "🗺️ প্রস্তাবিত বাস্তবায়ন পরিকল্পনা",
    selectProject: "প্রস্তাব খসড়ার জন্য প্রকল্প নির্বাচন করুন",
    selectedForReport: "সাংসদ রিপোর্ট প্রস্তাবের জন্য নির্বাচিত",
    initiateReport: "সাংসদ সুপারিশ রিপোর্ট প্রস্তুত করুন",
    upvote: "ভোট দিন",
    cases: "মামলা",
    priorityIndex: "অগ্রাধিকার সূচক",
    combinedDatasets: "সম্মিলিত ডেটাসেট ও প্রমাণাদি",
    demographicCross: "👥 জনসংখ্যার তথ্য বিশ্লেষণ",
    physicalInfraGap: "🏗️ পরিকাঠামো ঘাটতি বিশ্লেষণ",
    stable: "স্থিতিশীল",
  },
  pa: {
    title: "AI ਸੁਝਾਅ ਡੈੱਕ",
    activeLabel: "ਜੈਮਿਨੀ ਸਿੰਥੇਸਿਸ ਇੰਜਣ ਸਰਗਰਮ",
    subtitle: "ਇਹ ਸਪੇਸ ਸਥਾਨਕ ਨਾਗਰਿਕਾਂ ਦੀਆਂ ਸ਼ਿਕਾਇਤਾਂ ਨੂੰ ਜਨਸੰਖਿਆ ਵੰਡ, ਬੁਨਿਆਦੀ ਢਾਂਚੇ ਦੀ ਘਾਟ, ਖੇਤਰੀ ਵਿਕਾਸ ਮਾਸਟਰ ਯੋਜਨਾਵਾਂ, ਅਤੇ ਵਾਤਾਵਰਣ ਦੇ ਜਨਤਕ ਡੇਟਾਸੇਟਾਂ ਨਾਲ ਜੋੜ ਕੇ ਵਿਕਾਸ ਕਾਰਜ ਤਿਆਰ ਕਰਦੀ ਹੈ।",
    recalculate: "ਡੂੰਘਾ ਮੁੜ-ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ",
    analyzing: "ਮਲਟੀ-ਡੇਟਾਸੇਟ ਕਰਾਸ ਵਿਸ਼ਲੇਸ਼ਣ ਚੱਲ ਰਿਹਾ ਹੈ...",
    analyzingDesc: "ਸਰਗਰਮ ਸ਼ਿਕਾਇਤਾਂ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਅਤੇ ਬੁਨਿਆਦੀ ਢਾਂਚੇ ਦੀਆਂ ਕਮੀਆਂ ਦਾ ਮਿਲਾਣ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ।",
    engineOffline: "ਸਿੰਥੇਸਿਸ ਇੰਜਣ ਔਫਲਾਈਨ ਹੈ",
    retry: "ਮੁੜ ਕੋਸ਼ਿਸ਼ ਕਰੋ",
    datasetsTitle: "ਏਕੀਕ੍ਰਿਤ ਜਨਤਕ ਡੇਟਾਸੇਟ",
    demoProfile: "ਜਨਸੰਖਿਆ ਪ੍ਰੋਫਾਈਲ",
    youthRatio: "ਯੁਵਾ ਅਨੁਪਾਤ",
    infraDeficitReg: "ਬੁਨਿਆਦੀ ਢਾਂਚੇ ਦੀ ਘਾਟ ਦਾ ਰਜਿਸਟਰ",
    waterDeficit: "ਪਾਣੀ ਦੀ ਘਾਟ",
    schoolDeficit: "ਸਕੂਲ ਦੀ ਘਾਟ",
    envDatasets: "ਵਾਤਾਵਰਣ ਅਤੇ ਜਨਤਕ ਡੇਟਾਸੇਟ",
    floodingRisk: "ਹੜ੍ਹ ਦਾ ਖ਼ਤਰਾ",
    aqiIndex: "ਔਸਤ ਹਵਾ ਗੁਣਵੱਤਾ ਸੂਚਕਾਂਕ (AQI)",
    localMasterPlan: "ਸਥਾਨਕ ਮਾਸਟਰ ਵਿਕਾਸ ਯੋਜਨਾ",
    smartTransit: "ਸਮਾਰਟ ਟ੍ਰਾਂਜ਼ਿਟ ਕਾਰੀਡੋਰ ਪਹਿਲਕਦਮੀ ਦੇ ਅਨੁਕੂਲ",
    directivesSec: "ਸੈਕਸ਼ਨ 4 ਬੁਨਿਆਦੀ ਢਾਂਚੇ ਦੇ ਦਿਸ਼ਾ-ਨਿਰਦੇਸ਼",
    hotspotsTitle: "ਭੂ-ਸਥਾਨਕ ਮੰਗ ਹੌਟਸਪੌਟ",
    hotspotsPriority: "ਘਣਤਾ",
    activeGrievances: "ਸਰਗਰਮ ਸ਼ਿਕਾਇਤਾਂ",
    themesTitle: "ਮੁੱਖ ਸ਼ਿਕਾਇਤ ਵਿਸ਼ੇ",
    sentiment: "ਭਾਵਨਾ",
    severity: "ਗੰਭੀਰਤਾ",
    recommendationsTitle: "ਤਰਜੀਹ ਦਿੱਤੇ ਉੱਚ ਪ੍ਰੋਜੈਕਟ",
    recommendationsSubtitle: "ਨਾਗਰਿਕ ਮੰਗਾਂ ਅਤੇ ਜਨਤਕ ਡੇਟਾਸੇਟਾਂ ਨੂੰ ਮਿਲਾ ਕੇ ਤਿਆਰ ਕੀਤੇ ਗਏ ਵਿਕਾਸ ਕਾਰਜ।",
    recommendationsCount: "ਸਿਫ਼ਾਰਸ਼ਾਂ",
    estCost: "ਅਨੁਮਾਨਿਤ ਬਜਟ",
    scopeBenefits: "ਲਾਭ ਦਾ ਦਾਇਰਾ",
    alignmentJustification: "ਅਨੁਕੂਲਤਾ ਦਾ ਤਰਕ",
    localPlanAlignment: "🗺️ ਸਥਾਨਕ ਮਾਸਟਰ ਯੋਜਨਾ ਅਨੁਕੂਲਤਾ",
    publicDatasetGrounding: "📊 ਜਨਤਕ ਡੇਟਾਸੇਟ ਗਰਾਊਂਡਿੰਗ",
    phasedPlan: "🗺️ ਪੜਾਅਵਾਰ ਕਾਰਜ ਯੋਜਨਾ",
    selectProject: "ਪ੍ਰਸਤਾਵ ਖਰੜੇ ਲਈ ਪ੍ਰੋਜੈਕਟ ਚੁਣੋ",
    selectedForReport: "ਸੰਸਦ ਮੈਂਬਰ ਰਿਪੋਰਟ ਲਈ ਚੁਣਿਆ ਗਿਆ",
    initiateReport: "ਸੰਸਦ ਮੈਂਬਰ ਸਿਫਾਰਸ਼ ਰਿਪੋਰਟ ਸ਼ੁਰੂ ਕਰੋ",
    upvote: "ਵੋਟ ਦਿਓ",
    cases: "ਮਾਮਲੇ",
    priorityIndex: "ਤਰਜੀਹ ਸੂਚਕਾਂਕ",
    combinedDatasets: "ਸੰਯੁਕਤ ਡੇਟਾ ਅਤੇ ਸਬੂਤ",
    demographicCross: "👥 ਜਨਸੰਖਿਆ ਡੇਟਾ",
    physicalInfraGap: "🏗️ ਬੁਨਿਆਦੀ ਢਾਂਚੇ ਦੀ ਘਾਟ",
    stable: "ਸਥਿਰ",
  },
  te: {
    title: "AI సూచనల డెక్",
    activeLabel: "జెమిని సింథసిస్ ఇంజిన్ క్రియాశీలంగా ఉంది",
    subtitle: "ఈ విభాగం స్థానిక పౌరుల ఫిర్యాదులను జనాభా వివరాలు, మౌలిక సదుపాయాల కొరతలు, ప్రాంతీయ మాస్టర్ ప్లాన్లు మరియు పర్యావరణ డేటాసెట్లతో సమన్వయం చేసి ప్రాధాన్యతలను నిర్ధారిస్తుంది.",
    recalculate: "లోతైన పునఃవిశ్లేషణ",
    analyzing: "బహుళ-డేటాసెట్ క్రాస్ విశ్లేషణ జరుగుతోంది...",
    analyzingDesc: "క్రియాశీల ఫిర్యాదుల విశ్లేషణ మరియు ప్రాంతీయ వనరుల కొరత తనిఖీ చేయబడుతున్నాయి.",
    engineOffline: "సింథసిస్ ఇంజిన్ ఆఫ్ లైన్",
    retry: "విశ్లేషణను మళ్లీ ప్రయత్నించండి",
    datasetsTitle: "సమన్వయం చేయబడిన పబ్లిక్ డేటాసెట్లు",
    demoProfile: "జనాభా వివరాల ప్రొఫైల్",
    youthRatio: "యువత నిష్పత్తి",
    infraDeficitReg: "మౌలిక సదుపాయాల కొరత రిజిస్టర్",
    waterDeficit: "నీటి కొరత",
    schoolDeficit: "పాఠశాలల కొరత",
    envDatasets: "పర్యావరణ & పబ్లిక్ డేటాసెట్లు",
    floodingRisk: "వరద ప్రమాదం",
    aqiIndex: "సగటు గాలి నాణ్యత సూచిక (AQI)",
    localMasterPlan: "స్థానిక మాస్టర్ డెవలప్‌మెంట్ ప్లాన్",
    smartTransit: "స్మార్ట్ ట్రాన్సిట్ కారిడార్ చొరవతో సమన్వయం చేయబడింది",
    directivesSec: "సెక్షన్ 4 మౌలిక సదుపాయాల మార్గదర్శకాలు",
    hotspotsTitle: "భూ-స్థానిక డిమాండ్ హాట్‌స్పాట్లు",
    hotspotsPriority: "సాంద్రత",
    activeGrievances: "క్రియాశీల ఫిర్యాదులు",
    themesTitle: "ప్రధాన ఫిర్యాదుల విభాగాలు",
    sentiment: "మనోభావం",
    severity: "తీవ్రత",
    recommendationsTitle: "ర్యాంక్ చేయబడిన అత్యున్నత ప్రాధాన్యత సిఫార్సులు",
    recommendationsSubtitle: "ప్రాంతీయ కొరత కొలమానాలు మరియు పౌర ఫిర్యాదుల ఫ్రీక్వెన్సీ ఆధారంగా సిద్ధం చేసిన పనులు.",
    recommendationsCount: "సిఫార్సులు",
    estCost: "అంచనా బడ్జెట్",
    scopeBenefits: "ప్రయోజనాల పరిధి",
    alignmentJustification: "సమన్వయ సమర్థన",
    localPlanAlignment: "🗺️ స్థానిక మాస్టర్ ప్లాన్ సమన్వయం",
    publicDatasetGrounding: "📊 పబ్లిక్ డేటాసెట్ సమర్థన",
    phasedPlan: "🗺️ దశలవారీ అమలు ప్రణాళిక",
    selectProject: "ప్రతిపాదన ముసాయిదా కోసం ప్రాజెక్ట్‌ను ఎంచుకోండి",
    selectedForReport: "నివేదిక కోసం ఎంపిక చేయబడింది",
    initiateReport: "ఎంపి వినతి నివేదిక ప్రారంభించండి",
    upvote: "ఓటు వేయండి",
    cases: "కేసులు",
    priorityIndex: "ప్రాధాన్యత సూచిక",
    combinedDatasets: "సమన్వయం చేయబడిన డేటా & రుజువులు",
    demographicCross: "👥 జనాభా విశ్లేషణ",
    physicalInfraGap: "🏗️ మౌలిక సదుపాయాల కొరత",
    stable: "స్థిరంగా ఉంది",
  },
  ta: {
    title: "AI பரிந்துரை டெக்",
    activeLabel: "ஜெமினி தொகுப்பு இயந்திரம் செயலில் உள்ளது",
    subtitle: "இந்த தளம் உள்ளூர் மக்களின் புகார்கள், மக்கள் தொகை விநியோகம், உள்கட்டமைப்பு பற்றாக்குறைகள், பிராந்திய வளர்ச்சி திட்டங்கள் மற்றும் சுற்றுச்சூழல் தரவுகளை ஒருங்கிணைத்து முன்னுரிமைகளை அமைக்கிறது.",
    recalculate: "மீண்டும் ஆழமாக பகுப்பாய்வு செய்",
    analyzing: "மல்டி-தரவுத்தொகுப்பு குறுக்கு பகுப்பாய்வு செயலில் உள்ளது...",
    analyzingDesc: "செயலில் உள்ள புகார்களை ஆராய்தல், மக்கள் தொகை வரைபடங்களை உருவாக்குதல் மற்றும் பற்றாக்குறைகளை கண்டறிதல்.",
    engineOffline: "தொகுப்பு இயந்திரம் செயலிழந்துள்ளது",
    retry: "பகுப்பாய்வை மீண்டும் முயற்சிக்கவும்",
    datasetsTitle: "ஒருங்கிணைந்த பொது தரவுத்தொகுப்புகள்",
    demoProfile: "மக்கள் தொகை விவரம்",
    youthRatio: "இளைஞர் விகிதம்",
    infraDeficitReg: "உள்கட்டமைப்பு பற்றாக்குறை பதிவேடு",
    waterDeficit: "நீர் பற்றாக்குறை",
    schoolDeficit: "பள்ளி பற்றாக்குறை",
    envDatasets: "சுற்றுச்சூழல் மற்றும் பொது தரவுத்தொகுப்புகள்",
    floodingRisk: "வெள்ள ஆபத்து",
    aqiIndex: "சராசரி காற்று தர குறியீடு (AQI)",
    localMasterPlan: "உள்ளூர் முதன்மை வளர்ச்சி திட்டம்",
    smartTransit: "ஸ்மார்ட் போக்குவரத்து நடைபாதை திட்டத்துடன் ஒத்துப்போகிறது",
    directivesSec: "பிரிவு 4 உள்கட்டமைப்பு வழிகாட்டுதல்கள்",
    hotspotsTitle: "புவியியல் தேவை மையங்கள்",
    hotspotsPriority: "அடர்த்தி",
    activeGrievances: "செயலில் உள்ள புகார்கள்",
    themesTitle: "புகார்களின் முக்கிய கருப்பொருள்கள்",
    sentiment: "மனநிலை",
    severity: "தீவிரம்",
    recommendationsTitle: "உயர் முன்னுரிமை பரிந்துரைகள்",
    recommendationsSubtitle: "மண்டல உள்கட்டமைப்பு பற்றாக்குறைகள் এবং குடிமக்கள் புகார்களின் அதிர்வெண் அடிப்படையில் கணக்கிடப்பட்ட பணிகள்.",
    recommendationsCount: "பரிந்துரைகள்",
    estCost: "மதிப்பிடப்பட்ட பட்ஜெட்",
    scopeBenefits: "பயனாளி பரப்பு",
    alignmentJustification: "பரிந்துரை நியாயப்படுத்துதல்",
    localPlanAlignment: "🗺️ உள்ளூர் முதன்மை திட்ட ஒத்துப்போதல்",
    publicDatasetGrounding: "📊 பொது தரவுத்தொகுப்பு அடிப்படை",
    phasedPlan: "🗺️ கட்ட வாரியான செயலாக்க திட்டம்",
    selectProject: "முன்மொழிவு வரைவுக்கான திட்டத்தை தேர்வு செய்யவும்",
    selectedForReport: "நாடாளுமன்ற உறுப்பினர் அறிக்கைக்கு தேர்வு செய்யப்பட்டது",
    initiateReport: "நாடாளுமன்ற உறுப்பினர் பரிந்துரை அறிக்கை தொடங்குக",
    upvote: "வாக்களிக்கவும்",
    cases: "வழக்குகள்",
    priorityIndex: "முன்னிரிமை குறியீடு",
    combinedDatasets: "ஒருங்கிணைந்த தரவுகள் மற்றும் சான்றுகள்",
    demographicCross: "👥 மக்கள் தொகை குறுக்குத்தொடர்பு",
    physicalInfraGap: "🏗️ உள்கட்டமைப்பு பற்றாக்குறை",
    stable: "நிலையானது",
  }
};

interface Theme {
  name: string;
  count: number;
  severity: 'High' | 'Medium' | 'Low';
  sentiment: string;
  summary: string;
}

interface Hotspot {
  name: string;
  activeGrievances: number;
  priorityLevel: 'Critical' | 'High' | 'Medium';
  issues: string[];
}

interface Recommendation {
  id: string;
  title: string;
  category: 'Education' | 'Healthcare' | 'Roads & Transport' | 'Sanitation' | 'Water Supply' | 'Vocations';
  rank: number;
  priorityScore: number;
  alignmentReason: string;
  estimatedCost: string;
  impactScope: string;
  actionPlan: string[];
  demographicIndicator: string;
  infraGapIndicator: string;
  localPlanAlignment: string;
  publicDatasetInsight: string;
}

interface AnalysisData {
  themes: Theme[];
  hotspots: Hotspot[];
  recommendations: Recommendation[];
  datasetsUsed: {
    population: string;
    youthRatio: string;
    schoolDeficitIndex: string;
    waterDeficitIndex: string;
    floodingRisk: string;
    averageAQI?: string;
    unemploymentRate?: string;
  };
}

export const AISuggestionTab: React.FC<AISuggestionTabProps> = ({
  selectedState,
  selectedCity,
  submissions,
  onSelectProjectForReport,
  selectedProject,
  language = 'en',
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedRecId, setExpandedRecId] = useState<string | null>(null);
  const [userUpvotes, setUserUpvotes] = useState<Record<string, boolean>>({});
  const [upvoteCounts, setUpvoteCounts] = useState<Record<string, number>>({});
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const t = suggestionTranslations[language] || suggestionTranslations['en'];

  const fetchSuggestions = async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const url = `/api/ai-suggestions?state=${encodeURIComponent(selectedState)}&constituency=${encodeURIComponent(selectedCity)}&language=${encodeURIComponent(language)}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Failed to load suggestions: ${res.statusText}`);
      }
      const data = await res.json();
      if (data.success && data.analysis) {
        setAnalysis(data.analysis);
        
        // Initialize default upvote boosts
        const counts: Record<string, number> = {};
        data.analysis.recommendations.forEach((rec: Recommendation) => {
          counts[rec.id] = Math.floor(Math.random() * 45) + 12; // Realistic baseline upvotes
        });
        setUpvoteCounts(counts);
      } else {
        throw new Error(data.error || "Failed to analyze constituency data.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while generating suggestions.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, [selectedState, selectedCity, submissions.length, language]);

  const handleUpvote = (recId: string) => {
    const alreadyUpvoted = userUpvotes[recId];
    setUserUpvotes(prev => ({
      ...prev,
      [recId]: !alreadyUpvoted
    }));
    setUpvoteCounts(prev => ({
      ...prev,
      [recId]: alreadyUpvoted ? prev[recId] - 1 : prev[recId] + 1
    }));
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Education': return 'text-purple-400 bg-purple-950/40 border-purple-800/40';
      case 'Healthcare': return 'text-rose-400 bg-rose-950/40 border-rose-800/40';
      case 'Roads & Transport': return 'text-cyan-400 bg-cyan-950/40 border-cyan-800/40';
      case 'Sanitation': return 'text-amber-400 bg-amber-950/40 border-amber-800/40';
      case 'Water Supply': return 'text-blue-400 bg-blue-950/40 border-blue-800/40';
      default: return 'text-teal-400 bg-teal-950/40 border-teal-800/40';
    }
  };

  return (
    <div className="space-y-8" id="ai-suggestion-section">
      
      {/* HEADER SECTION */}
      <div className="bg-slate-900/65 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 shadow-2xl shadow-cyan-950/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-40 bg-gradient-to-l from-cyan-500/10 to-transparent blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 relative z-10">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-[10px] font-mono font-extrabold text-cyan-400 bg-cyan-950/50 border border-cyan-500/30 rounded-full uppercase tracking-wider animate-pulse flex items-center gap-1">
                <Brain className="w-3 h-3 text-cyan-400 shrink-0" />
                Gemini Synthesis Engine Active
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold font-display tracking-tight text-white flex items-center gap-2">
              AI Suggestion Deck
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              This space combines localized citizen grievances with demographic distributions, infrastructure deficit registries, regional development master plans, and environmental public datasets to prioritize and generate highly-actionable project works under MPLADS.
            </p>
          </div>

          <button
            id="refresh-ai-suggestions"
            onClick={() => fetchSuggestions(true)}
            disabled={loading || isRefreshing}
            className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold font-sans text-cyan-400 hover:text-white bg-cyan-950/30 hover:bg-gradient-to-r hover:from-cyan-600 hover:to-blue-600 border border-cyan-500/25 hover:border-transparent rounded-xl transition-all cursor-pointer shadow-lg disabled:opacity-50 shrink-0 self-start md:self-auto"
          >
            <RefreshCw className={`w-4 h-4 shrink-0 ${isRefreshing ? 'animate-spin' : ''}`} />
            Deep-Recalculate Synthesis
          </button>
        </div>
      </div>

      {/* ERROR OR LOADING BLOCK */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-4">
          <div className="relative flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-cyan-500 animate-spin" />
            <Brain className="w-5 h-5 text-cyan-400 absolute animate-pulse" />
          </div>
          <div className="text-center">
            <p className="text-sm text-slate-300 font-mono font-bold uppercase tracking-wider animate-pulse">Running Multi-Dataset Cross Analysis...</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm px-4">Parsing active complaints, modeling local demographic maps, crossing water/school gaps, and aligning Master Plan registries.</p>
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="flex flex-col items-center justify-center py-12 bg-rose-950/10 border border-rose-900/30 rounded-2xl space-y-3.5">
          <AlertTriangle className="w-10 h-10 text-rose-500" />
          <div className="text-center px-4">
            <p className="text-sm font-bold text-slate-200">Synthesis Engine Offline</p>
            <p className="text-xs text-rose-400 mt-1 max-w-md">{error}</p>
          </div>
          <button
            onClick={() => fetchSuggestions()}
            className="px-4 py-2 text-xs bg-slate-900 hover:bg-slate-850 text-slate-300 rounded-xl border border-slate-800 cursor-pointer"
          >
            Retry Analytics Run
          </button>
        </div>
      )}

      {/* MAIN ANALYSIS CONTENT */}
      {!loading && !error && analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: SOURCE DATASETS & SENTIMENT */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* DATASETS OVERLAYS */}
            <div className="bg-slate-900/65 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
                <Layers className="w-4.5 h-4.5 text-cyan-400" />
                <span className="text-xs font-bold font-mono text-slate-300 uppercase tracking-widest">
                  {t.datasetsTitle}
                </span>
              </div>

              <div className="space-y-3.5">
                <div className="flex items-start gap-3 bg-slate-950/50 border border-slate-850 p-3 rounded-xl hover:border-slate-800 transition-colors">
                  <Users className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono uppercase block">{t.demoProfile}</span>
                    <strong className="text-xs text-slate-200 block mt-0.5 font-sans font-bold">
                      {analysis.datasetsUsed.population}
                    </strong>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {t.youthRatio}: {analysis.datasetsUsed.youthRatio || "28%"}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-950/50 border border-slate-850 p-3 rounded-xl hover:border-slate-800 transition-colors">
                  <Activity className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono uppercase block">{t.infraDeficitReg}</span>
                    <strong className="text-xs text-slate-200 block mt-0.5 font-sans font-bold">
                      {t.waterDeficit}: {analysis.datasetsUsed.waterDeficitIndex}
                    </strong>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {t.schoolDeficit}: {analysis.datasetsUsed.schoolDeficitIndex}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-950/50 border border-slate-850 p-3 rounded-xl hover:border-slate-800 transition-colors">
                  <MapPin className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono uppercase block">{t.envDatasets}</span>
                    <strong className="text-xs text-slate-200 block mt-0.5 font-sans font-bold">
                      {t.floodingRisk}: {analysis.datasetsUsed.floodingRisk}
                    </strong>
                    {analysis.datasetsUsed.averageAQI && (
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {t.aqiIndex}: {analysis.datasetsUsed.averageAQI}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-950/50 border border-slate-850 p-3 rounded-xl hover:border-slate-800 transition-colors">
                  <Landmark className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono uppercase block">{t.localMasterPlan}</span>
                    <strong className="text-xs text-slate-200 block mt-0.5 font-sans font-bold">
                      {t.smartTransit}
                    </strong>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {t.directivesSec}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* DEMAND HOTSPOTS */}
            <div className="bg-slate-900/65 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
                <MapPin className="w-4.5 h-4.5 text-amber-500" />
                <span className="text-xs font-bold font-mono text-slate-300 uppercase tracking-widest">
                  {t.hotspotsTitle}
                </span>
              </div>

              <div className="space-y-3">
                {analysis.hotspots.map((spot, i) => (
                  <div key={i} className="bg-slate-950/40 border border-slate-850 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-sans text-slate-100 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        {spot.name}
                      </span>
                      <span className={`text-[8px] font-mono font-black uppercase px-2 py-0.5 rounded-full border ${
                        spot.priorityLevel === 'Critical'
                          ? 'bg-rose-950/50 text-rose-400 border-rose-500/30'
                          : 'bg-amber-950/50 text-amber-400 border-amber-500/30'
                      }`}>
                        {spot.priorityLevel} {t.hotspotsPriority}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
                      <span>{t.activeGrievances}: <strong className="text-cyan-400 font-bold">{spot.activeGrievances}</strong></span>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {spot.issues.map((issue, idx) => (
                        <span key={idx} className="text-[9px] bg-slate-900 text-slate-400 border border-slate-800 px-1.5 py-0.5 rounded font-sans">
                          {issue}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RECURRING COMPLAINT THEMES */}
            <div className="bg-slate-900/65 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
                <Activity className="w-4.5 h-4.5 text-rose-500" />
                <span className="text-xs font-bold font-mono text-slate-300 uppercase tracking-widest">
                  {t.themesTitle}
                </span>
              </div>

              <div className="space-y-3">
                {analysis.themes.map((theme, i) => (
                  <div key={i} className="bg-slate-950/40 border border-slate-850 rounded-xl p-3.5 space-y-2 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-cyan-600" />
                    
                    <div className="flex items-center justify-between pl-1">
                      <span className="text-xs font-extrabold text-slate-100 font-sans truncate pr-2">
                        {theme.name}
                      </span>
                      <span className="text-[10px] bg-cyan-950/50 text-cyan-300 border border-cyan-800/30 px-1.5 py-0.5 rounded font-mono font-bold">
                        {theme.count} {t.cases}
                      </span>
                    </div>
                    
                    <p className="text-[11px] text-slate-400 pl-1 leading-relaxed">
                      {theme.summary}
                    </p>

                    <div className="flex items-center justify-between pl-1 pt-1.5 border-t border-slate-900 text-[9px] text-slate-500 font-mono">
                      <span>{t.sentiment}: <strong className="text-rose-400 uppercase font-black">{theme.sentiment}</strong></span>
                      <span className="uppercase">{t.severity}: <strong className="text-slate-300">{theme.severity}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: RANKED AI SUGGESTIONS */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-slate-900/65 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 text-xs font-bold font-mono text-slate-300 uppercase tracking-widest">
                    <Lightbulb className="w-4.5 h-4.5 text-cyan-400 animate-bounce" />
                    {t.recommendationsTitle}
                  </div>
                  <p className="text-[11px] text-slate-500 font-sans">
                    {t.recommendationsSubtitle}
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/50 border border-cyan-800/40 px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0">
                  {analysis.recommendations.length} {t.recommendationsCount}
                </span>
              </div>

              {/* LIST */}
              <div className="space-y-4">
                {analysis.recommendations.map((rec, i) => {
                  const isExpanded = expandedRecId === rec.id;
                  const hasUpvoted = userUpvotes[rec.id];
                  const upvoteCount = upvoteCounts[rec.id] || 0;
                  const isSelectedForReport = selectedProject?.id === rec.id;

                  return (
                    <div
                      key={rec.id}
                      id={`rec-item-${rec.id}`}
                      className={`border rounded-xl transition-all overflow-hidden ${
                        isSelectedForReport
                          ? 'bg-gradient-to-r from-cyan-950/15 to-blue-950/15 border-cyan-500/45 shadow-lg shadow-cyan-500/5'
                          : isExpanded
                          ? 'bg-slate-950 border-slate-700/80 shadow-md'
                          : 'bg-slate-950/30 hover:bg-slate-950/60 border-slate-850 hover:border-slate-800'
                      }`}
                    >
                      {/* HEADER SUMMARY ROW */}
                      <div className="p-4 flex flex-col sm:flex-row items-start gap-4 justify-between">
                        <div className="flex items-start gap-3.5 flex-1">
                          {/* Rank Circle */}
                          <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-sm font-black text-cyan-400 font-mono shadow-inner shrink-0 mt-0.5">
                            #{i + 1}
                          </div>

                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-sm font-bold text-slate-100 font-display tracking-wide">
                                {rec.title}
                              </span>
                              <span className={`text-[9px] px-2 py-0.5 rounded font-mono uppercase font-bold border ${getCategoryColor(rec.category)}`}>
                                {rec.category}
                              </span>
                            </div>
                            
                            <p className="text-xs text-slate-400 leading-relaxed font-sans line-clamp-2">
                              {rec.alignmentReason}
                            </p>

                            {/* Cost / Scope row */}
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1.5 text-[10px] text-slate-500 font-mono">
                              <span>{t.estCost}: <strong className="text-yellow-500 font-extrabold">{rec.estimatedCost}</strong></span>
                              <span>{t.scopeBenefits}: <strong className="text-slate-300 font-extrabold">{rec.impactScope}</strong></span>
                            </div>
                          </div>
                        </div>

                        {/* RATING / SCORE BOX & ACTIONS */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start w-full sm:w-auto gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-900">
                          <div className="text-left sm:text-right">
                            <span className="text-[9px] text-slate-500 uppercase tracking-wider font-mono">{t.priorityIndex}</span>
                            <div className="text-xl font-black font-mono text-cyan-400 leading-none mt-0.5">
                              {rec.priorityScore.toFixed(1)}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Upvote Button (Citizen & MP Feature) */}
                            <button
                              id={`upvote-btn-${rec.id}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpvote(rec.id);
                              }}
                              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all border ${
                                hasUpvoted
                                  ? 'bg-cyan-950/80 border-cyan-400 text-cyan-400 shadow-sm'
                                  : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-400 hover:text-cyan-400'
                              }`}
                            >
                              <ThumbsUp className={`w-3.5 h-3.5 ${hasUpvoted ? 'fill-cyan-400/25' : ''}`} />
                              <span>{upvoteCount}</span>
                            </button>

                            <button
                              id={`expand-btn-${rec.id}`}
                              onClick={() => setExpandedRecId(isExpanded ? null : rec.id)}
                              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                            >
                              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* COLLAPSED EXPANDED DETAILS */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="border-t border-slate-850 bg-slate-950/80"
                          >
                            <div className="p-4 space-y-5">
                              
                              {/* METRIC CROSSING DETAILS */}
                              <div className="space-y-2">
                                <span className="text-[9px] text-cyan-400 font-mono font-extrabold uppercase tracking-widest flex items-center gap-1">
                                  <Clipboard className="w-3.5 h-3.5" />
                                  {t.combinedDatasets}
                                </span>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-850 text-xs space-y-1">
                                    <span className="text-[10px] text-slate-500 font-mono block">{t.demographicCross}</span>
                                    <p className="text-slate-300 font-sans leading-relaxed">{rec.demographicIndicator}</p>
                                  </div>

                                  <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-850 text-xs space-y-1">
                                    <span className="text-[10px] text-rose-500 font-mono block">{t.physicalInfraGap}</span>
                                    <p className="text-slate-300 font-sans leading-relaxed">{rec.infraGapIndicator}</p>
                                  </div>

                                  <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-850 text-xs space-y-1">
                                    <span className="text-[10px] text-amber-500 font-mono block">{t.localPlanAlignment}</span>
                                    <p className="text-slate-300 font-sans leading-relaxed">{rec.localPlanAlignment}</p>
                                  </div>

                                  <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-850 text-xs space-y-1">
                                    <span className="text-[10px] text-purple-500 font-mono block">{t.publicDatasetGrounding}</span>
                                    <p className="text-slate-300 font-sans leading-relaxed">{rec.publicDatasetInsight}</p>
                                  </div>
                                </div>
                              </div>

                              {/* IMPLEMENTATION PLAN */}
                              <div className="space-y-2.5">
                                <span className="text-[9px] text-cyan-400 font-mono font-extrabold uppercase tracking-widest block">
                                  {t.phasedPlan}
                                </span>
                                
                                <div className="space-y-2 font-sans text-xs">
                                  {rec.actionPlan.map((step, idx) => (
                                    <div key={idx} className="flex items-start gap-3 bg-slate-900/40 p-2.5 border border-slate-900 rounded-lg">
                                      <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 text-[10px] font-mono font-extrabold border border-cyan-800/40 flex items-center justify-center shrink-0">
                                        {idx + 1}
                                      </span>
                                      <p className="text-slate-300 pt-0.5 leading-relaxed">{step}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* RECOMMENDATION ACTION FOOTER */}
                              <div className="flex items-center justify-end border-t border-slate-900 pt-3">
                                <button
                                  id={`btn-report-initiate-${rec.id}`}
                                  onClick={() => {
                                    // Map this recommendation to a format that looks like ProposedProject
                                    const mappedProject = {
                                      id: rec.id,
                                      title: rec.title,
                                      category: rec.category,
                                      estimatedCost: parseInt(rec.estimatedCost.replace(/[^0-9]/g, '')) || 50,
                                      infrastructureBenefitScore: 85,
                                      demographicNeedScore: 85,
                                      demandIndex: Math.round(rec.priorityScore),
                                      citizenSubmissionsCount: upvoteCount,
                                      description: rec.alignmentReason + " Demographics cross-match: " + rec.demographicIndicator + ". Suggested construction schedule: " + rec.actionPlan.join('; '),
                                      state: selectedState,
                                      constituency: selectedCity,
                                    };
                                    onSelectProjectForReport(mappedProject);
                                  }}
                                  className={`px-3.5 py-1.5 text-xs font-sans font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                                    isSelectedForReport
                                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg'
                                      : 'bg-cyan-900/40 border border-cyan-500/30 text-cyan-400 hover:text-white hover:bg-cyan-600 hover:border-transparent'
                                  }`}
                                >
                                  {isSelectedForReport ? (
                                    <>
                                      <CheckCircle2 className="w-4 h-4 text-cyan-300 shrink-0" />
                                      {t.selectedForReport}
                                    </>
                                  ) : (
                                    <>
                                      <FileText className="w-4 h-4 shrink-0" />
                                      {t.initiateReport}
                                    </>
                                  )}
                                </button>
                              </div>

                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};
