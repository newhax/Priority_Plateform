import React, { useState, useEffect } from 'react';
import { ProposedProject, PrioritizationWeights } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Sliders, Layers, ArrowUp, ArrowDown, FileText, CheckCircle, MapPin } from 'lucide-react';
import { getDistance } from '../utils/geo';

interface PrioritySandboxProps {
  projects: ProposedProject[];
  onSelectProjectForReport: (project: ProposedProject) => void;
  selectedProject: ProposedProject | null;
  language?: string;
  liveUserCoords?: { lat: number; lng: number } | null;
}

const sandboxTranslations: Record<string, any> = {
  en: {
    title: "Prioritization Decision Deck",
    subtitle: "Adjust strategic weights below to compute real-time priority scores and re-rank development proposals in real-time.",
    coreActive: "DECISION CORE ACTIVE",
    citizenDensity: "Citizen Density",
    citizenDensityDesc: "Citizen submission frequency & urgency",
    infraDeficit: "Infrastructure Deficit",
    infraDeficitDesc: "Physical school, clinic, or utility shortfalls",
    demoNeed: "Demographic Need",
    demoNeedDesc: "Emphasis on students, elderly & low-income layers",
    costEfficiency: "Cost Efficiency",
    costEfficiencyDesc: "Prioritizes high public benefit per budget Lakh",
    rankedAllocations: "RANKED DEVELOPMENT ALLOCATIONS",
    stable: "STABLE",
    general: "GENERAL",
    feedbacks: "CITIZEN FEEDBACKS:",
    demandRank: "DEMAND RANK:",
    gapReduction: "GAP REDUCTION BENEFIT:",
    estimatedCost: "ESTIMATED COST:",
    lakhs: "LAKHS",
    priorityIndex: "Priority Index",
    selected: "Selected",
    buildProposal: "Build Proposal"
  },
  ml: {
    title: "മുൻഗണനാ നിർണ്ണയ ഡെക്ക്",
    subtitle: "തത്സമയ മുൻഗണനാ സ്‌കോറുകൾ കണക്കാക്കുന്നതിനും വികസന നിർദ്ദേശങ്ങൾ തരംതിരിക്കുന്നതിനും തന്ത്രപരമായ മുൻഗണനകൾ ക്രമീകരിക്കുക.",
    coreActive: "തീരുമാന കേന്ദ്രം സജീവം",
    citizenDensity: "ജനസാന്ദ്രത",
    citizenDensityDesc: "പൗരന്മാരുടെ നിർദ്ദേശങ്ങളുടെ ആവൃത്തിയും അടിയന്തിരതയും",
    infraDeficit: "അടിസ്ഥാന സൗകര്യ കമ്മി",
    infraDeficitDesc: "സ്കൂൾ, ക്ലിനിക് അല്ലെങ്കിൽ യൂട്ടിലിറ്റി എന്നിവയിലെ കുറവുകൾ",
    demoNeed: "ജനസംഖ്യാപരമായ ആവശ്യം",
    demoNeedDesc: "വിദ്യാർത്ഥികൾ, പ്രായമായവർ, കുറഞ്ഞ വരുമാനമുള്ളവർ എന്നിവർക്ക് മുൻഗണന",
    costEfficiency: "ചെലവ് കാര്യക്ഷമത",
    costEfficiencyDesc: "കുറഞ്ഞ ചെലവിൽ കൂടുതൽ പൗരന്മാർക്ക് പ്രയോജനപ്പെടുന്ന പദ്ധതികൾ",
    rankedAllocations: "മുൻഗണനാ ക്രമത്തിലുള്ള വികസന പദ്ധതികൾ",
    stable: "സ്ഥിരതയുള്ളത്",
    general: "പൊതുവായത്",
    feedbacks: "പൗരന്മാരുടെ പ്രതികരണങ്ങൾ:",
    demandRank: "ആവശ്യകതാ റാങ്ക്:",
    gapReduction: "കുറവുകൾ പരിഹരിക്കുന്ന തോത്:",
    estimatedCost: "പ്രതീക്ഷിക്കുന്ന ചെലവ്:",
    lakhs: "ലക്ഷം രൂപ",
    priorityIndex: "മുൻഗണനാ സൂചിക",
    selected: "തിരഞ്ഞെടുത്തു",
    buildProposal: "റിപ്പോർട്ട് തയ്യാറാക്കുക"
  },
  hi: {
    title: "प्राथमिकता निर्धारण निर्णय डेक",
    subtitle: "वास्तविक समय में प्राथमिकता स्कोर की गणना करने और विकास प्रस्तावों को फिर से रैंक करने के लिए रणनीतिक भार को समायोजित करें।",
    coreActive: "निर्णय कोर सक्रिय",
    citizenDensity: "नागरिक घनत्व",
    citizenDensityDesc: "नागरिक सबमिशन आवृत्ति और तात्कालिकता",
    infraDeficit: "बुनियादी ढांचा घाटा",
    infraDeficitDesc: "भौतिक स्कूल, क्लिनिक, या उपयोगिता की कमी",
    demoNeed: "जनसांख्यिकीय आवश्यकता",
    demoNeedDesc: "छात्रों, बुजुर्गों और कम आय वाले स्तरों पर जोर",
    costEfficiency: "लागत दक्षता",
    costEfficiencyDesc: "बजट लाख प्रति उच्च सार्वजनिक लाभ को प्राथमिकता देता है",
    rankedAllocations: "रैंक वाले विकास आवंटन",
    stable: "स्थिर",
    general: "सामान्य",
    feedbacks: "नागरिक प्रतिक्रियाएं:",
    demandRank: "मांग रैंक:",
    gapReduction: "घाटा कमी लाभ:",
    estimatedCost: "अनुमानित लागत:",
    lakhs: "लाख",
    priorityIndex: "प्राथमिकता सूचकांक",
    selected: "चयनित",
    buildProposal: "प्रस्ताव बनाएं"
  },
  bn: {
    title: "অগ্রাধিকার নির্ধারণ সিদ্ধান্ত ডেক",
    subtitle: "রিয়েল-টাইমে অগ্রাধিকার স্কোর গণনা করতে এবং উন্নয়ন প্রস্তাবগুলি পুনরায় র্যাঙ্ক করতে কৌশলগত অনুপাতগুলি সামঞ্জস্য করুন।",
    coreActive: "সিদ্ধান্ত কোর সক্রিয়",
    citizenDensity: "নাগরিক ঘনত্ব",
    citizenDensityDesc: "নাগরিক আবেদন ফ্রিকোয়েন্সি এবং জরুরীতা",
    infraDeficit: "অবকাঠামো ঘাটতি",
    infraDeficitDesc: "স্কুল, ক্লিনিক বা ইউটিলিটি ঘাটতি",
    demoNeed: "জনসংখ্যাতাত্ত্বিক প্রয়োজন",
    demoNeedDesc: "ছাত্র, বয়স্ক এবং নিম্ন আয়ের স্তরের উপর জোর",
    costEfficiency: "ব্যয় দক্ষতা",
    costEfficiencyDesc: "বাজেট লাখ প্রতি উচ্চ জনস্বার্থ অগ্রাধিকার দেয়",
    rankedAllocations: "র‍্যাঙ্কযুক্ত উন্নয়ন বরাদ্দ",
    stable: "স্থির",
    general: "সাধারণ",
    feedbacks: "নাগরিক প্রতিক্রিয়া:",
    demandRank: "চাহিদা র‍্যাঙ্ক:",
    gapReduction: "ঘাটতি হ্রাস সুবিধা:",
    estimatedCost: "আনুমানিক ব্যয়:",
    lakhs: "লক্ষ",
    priorityIndex: "অগ্রাধিকার সূচক",
    selected: "নির্বাচিত",
    buildProposal: "প্রস্তাব তৈরি করুন"
  },
  pa: {
    title: "ਪ੍ਰਾਥਮਿਕਤਾ ਨਿਰਧਾਰਨ ਡੈੱਕ",
    subtitle: "ਰੀਅਲ-ਟਾਈਮ ਵਿੱਚ ਪ੍ਰਾਥਮਿਕਤਾ ਸਕੋਰ ਦੀ ਗਣਨਾ ਕਰਨ ਅਤੇ ਵਿਕਾਸ ਪ੍ਰਸਤਾਵਾਂ ਨੂੰ ਦੁਬਾਰਾ ਰੈਂਕ ਦੇਣ ਲਈ ਰਣਨੀਤਕ ਭਾਰ ਨੂੰ ਵਿਵਸਥਿਤ ਕਰੋ।",
    coreActive: "ਫੈਸਲਾ ਕੋਰ ਸਰਗਰਮ",
    citizenDensity: "ਨਾਗਰਿਕ ਘਣਤਾ",
    citizenDensityDesc: "ਨਾਗਰਿਕ ਸਬਮਿਸ਼ਨ ਬਾਰੰਬਾਰਤਾ ਅਤੇ ਜ਼ਰੂਰੀਤਾ",
    infraDeficit: "ਬੁਨਿਆਦੀ ਢਾਂਚਾ ਘਾਟਾ",
    infraDeficitDesc: "ਸਕੂਲ, ਕਲੀਨਿਕ, ਜਾਂ ਸਹੂਲਤਾਂ ਦੀ ਕਮੀ",
    demoNeed: "ਜਨਸੰਖਿਆ ਦੀ ਲੋੜ",
    demoNeedDesc: "ਵਿਦਿਆਰਥੀਆਂ, ਬਜ਼ੁਰਗਾਂ ਅਤੇ ਘੱਟ ਆਮਦਨੀ ਵਾਲੇ ਵਰਗਾਂ 'ਤੇ ਜ਼ੋਰ",
    costEfficiency: "ਲਾਗਤ ਕੁਸ਼ਲਤਾ",
    costEfficiencyDesc: "ਪ੍ਰਤੀ ਬਜਟ ਲੱਖ ਉੱਚ ਜਨਤਕ ਲਾਭ ਨੂੰ ਤਰਜੀਹ ਦਿੰਦਾ ਹੈ",
    rankedAllocations: "ਰੈਂਕ ਵਾਲੇ ਵਿਕਾਸ ਅਲਾਟਮੈਂਟ",
    stable: "ਸਥਿਰ",
    general: "ਆਮ",
    feedbacks: "ਨਾਗਰਿਕ ਪ੍ਰਤੀਕਿਰਿਆਵਾਂ:",
    demandRank: "ਮੰਗ ਰੈਂਕ:",
    gapReduction: "ਘਾਟਾ ਘਟਾਉਣ ਦਾ ਲਾਭ:",
    estimatedCost: "ਅਨੁਮਾਨਿਤ ਲਾਗਤ:",
    lakhs: "ਲੱਖ",
    priorityIndex: "ਪ੍ਰਾਥਮਿਕਤਾ ਸੂਚਕਾਂਕ",
    selected: "ਚੁਣਿਆ ਗਿਆ",
    buildProposal: "ਪ੍ਰਸਤਾਵ ਬਣਾਓ"
  },
  te: {
    title: "ప్రాధాన్యత నిర్ణయ డెక్",
    subtitle: "రియల్-టైమ్‌లో ప్రాధాన్యత స్కోర్‌లను లెక్కించడానికి మరియు అభివృద్ధి ప్రతిపాదనలను మళ్లీ ర్యాంక్ చేయడానికి వ్యూహాత్మక ప్రాధాన్యతలను సర్దుబాటు చేయండి.",
    coreActive: "నిర్ణయ కేంద్రం క్రియాశీలంగా ఉంది",
    citizenDensity: "పౌరుల సాంద్రత",
    citizenDensityDesc: "పౌరుల ప్రతిపాదనల ఫ్రీక్వెన్సీ & అత్యవసరత",
    infraDeficit: "మౌలిక సదుపాయాల లోటు",
    infraDeficitDesc: "పాఠశాల, క్లినిక్ లేదా యుటిలిటీ కొరతలు",
    demoNeed: "జనాభా అవసరం",
    demoNeedDesc: "విద్యార్థులు, వృద్ధులు & తక్కువ ఆదాయ వర్గాలపై ప్రాధాన్యత",
    costEfficiency: "ఖర్చు సామర్థ్యం",
    costEfficiencyDesc: "బడ్జెట్ లక్షకు అధిక ప్రజా ప్రయోజనాలకు ప్రాధాన్యత ఇస్తుంది",
    rankedAllocations: "ర్యాంక్ చేయబడిన అభివృద్ధి కేటాయింపులు",
    stable: "స్థిరంగా ఉంది",
    general: "సాధారణం",
    feedbacks: "పౌరుల అభిప్రాయాలు:",
    demandRank: "డిమాండ్ ర్యాంక్:",
    gapReduction: "లోటు తగ్గింపు ప్రయోజనం:",
    estimatedCost: "అంచనా ఖర్చు:",
    lakhs: "లక్షలు",
    priorityIndex: "ప్రాధాన్యత సూచిక",
    selected: "ఎంపిక చేయబడింది",
    buildProposal: "ప్రతిపాదనను రూపొందించండి"
  },
  ta: {
    title: "முன்னுரிமை முடிவு தளம்",
    subtitle: "உண்மையான நேரத்தில் முன்னுரிமை மதிப்பெண்களைக் கணக்கிடவும் மற்றும் வளர்ச்சி முன்மொழிவுகளை வரிசைப்படுத்தவும் முன்னுரிமைகளை மாற்றியமைக்கவும்.",
    coreActive: "முடிவு மையம் செயலில் உள்ளது",
    citizenDensity: "குடிமக்கள் அடர்த்தி",
    citizenDensityDesc: "குடிமக்கள் சமர்ப்பிப்புகளின் அதிர்வெண் மற்றும் அவசரம்",
    infraDeficit: "கட்டமைப்பு பற்றாக்குறை",
    infraDeficitDesc: "பள்ளி, மருத்துவமனை அல்லது பொது பயன்பாட்டு பற்றாக்குறைகள்",
    demoNeed: "மக்கள்தொகை தேவை",
    demoNeedDesc: "மாணவர்கள், முதியவர்கள் மற்றும் குறைந்த வருமானம் கொண்ட பிரிவினருக்கு முக்கியத்துவம்",
    costEfficiency: "செலவு திறன்",
    costEfficiencyDesc: "குறைந்த செலவில் அதிக பொதுமக்களுக்கு பயனளிக்கும் திட்டங்களுக்கு முன்னுரிமை",
    rankedAllocations: "முன்னுரிமை வரிசைப்படுத்தப்பட்ட வளர்ச்சி ஒதுக்கீடுகள்",
    stable: "மாற்றമില്ലாதது",
    general: "பொதுவானது",
    feedbacks: "குடிமக்கள் கருத்துக்கள்:",
    demandRank: "தேவை தரவரிசை:",
    gapReduction: "பற்றாக்குறை குறைப்பு பலன்:",
    estimatedCost: "மதிப்பிடப்பட்ட செலவு:",
    lakhs: "லட்சம்",
    priorityIndex: "முன்னுரிமை குறியீடு",
    selected: "தேர்ந்தெடுக்கப்பட்டது",
    buildProposal: "முன்மொழிவை உருவாக்கு"
  }
};

export const PrioritySandbox: React.FC<PrioritySandboxProps> = ({
  projects,
  onSelectProjectForReport,
  selectedProject,
  language = 'en',
  liveUserCoords = null
}) => {
  const t = sandboxTranslations[language] || sandboxTranslations['en'];

  const [weights, setWeights] = useState<PrioritizationWeights>({
    citizenDemand: 0.4,
    infrastructureGap: 0.3,
    demographicNeed: 0.2,
    costEfficiency: 0.1,
  });

  const [sortByProximity, setSortByProximity] = useState(false);
  const [sortedProjects, setSortedProjects] = useState<(ProposedProject & { score: number; rankChange: number })[]>([]);

  // Keep track of original ranks (sorted by demandIndex desc as baseline)
  const baselineIds = [...projects]
    .sort((a, b) => b.demandIndex - a.demandIndex)
    .map(p => p.id);

  useEffect(() => {
    // Recalculate scores based on weights
    const calculated = projects.map(proj => {
      // cost factor: lower cost is better efficiency. Normalized out of 100 (range 40 - 120 Lakhs)
      const costFactor = Math.max(0, 100 - ((proj.estimatedCost - 40) / 80) * 100);

      const score = Math.round(
        weights.citizenDemand * proj.demandIndex * 100 +
        weights.infrastructureGap * proj.infrastructureBenefitScore * 100 +
        weights.demographicNeed * proj.demographicNeedScore * 100 +
        weights.costEfficiency * costFactor * 100
      ) / 100;

      return {
        ...proj,
        score,
      };
    });

    // Sort by calculated score desc, or proximity if toggled
    let sorted = [...calculated];
    if (sortByProximity && liveUserCoords) {
      sorted = calculated.sort((a, b) => {
        const distA = a.latitude && a.longitude ? getDistance(liveUserCoords.lat, liveUserCoords.lng, a.latitude, a.longitude) : 9999;
        const distB = b.latitude && b.longitude ? getDistance(liveUserCoords.lat, liveUserCoords.lng, b.latitude, b.longitude) : 9999;
        return distA - distB;
      });
    } else {
      sorted = calculated.sort((a, b) => b.score - a.score);
    }

    // Calculate rank differences from baseline
    const finalSorted = sorted.map((proj, idx) => {
      const baselineIdx = baselineIds.indexOf(proj.id);
      const currentIdx = idx;
      const rankChange = baselineIdx - currentIdx; // positive is rank improved, negative is rank dropped

      return {
        ...proj,
        rankChange,
      };
    });

    setSortedProjects(finalSorted);
  }, [weights, projects, sortByProximity, liveUserCoords]);

  const handleWeightChange = (key: keyof PrioritizationWeights, value: number) => {
    // Normalize weights so they sum up to 1 approximately, or just update the raw ratio and normalize on fly
    setWeights(prev => {
      const next = { ...prev, [key]: value };
      // Keep it simple: let them slide, and we'll normalize them to sum to 1 before calculating
      const total = next.citizenDemand + next.infrastructureGap + next.demographicNeed + next.costEfficiency;
      if (total === 0) return prev;
      
      return {
        citizenDemand: next.citizenDemand / total,
        infrastructureGap: next.infrastructureGap / total,
        demographicNeed: next.demographicNeed / total,
        costEfficiency: next.costEfficiency / total,
      };
    });
  };

  return (
    <div className="bg-slate-900/65 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 shadow-2xl shadow-cyan-950/10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-display font-bold uppercase tracking-wide">
            <Sliders className="w-5 h-5 text-cyan-400" />
            {t.title}
          </div>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            {t.subtitle}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 self-start">
          {liveUserCoords && (
            <button
              onClick={() => setSortByProximity(!sortByProximity)}
              className={`px-3 py-1 border text-[10px] font-bold rounded-full transition-all flex items-center gap-1 cursor-pointer select-none ${
                sortByProximity
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-500 shadow-md shadow-emerald-950/20'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>{sortByProximity ? "Sorted: Near GPS First" : "Sort by Proximity"}</span>
            </button>
          )}
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            {t.coreActive}
          </div>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-slate-950/60 p-4 border border-slate-800 rounded-xl">
        {/* Slider 1 */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 font-mono uppercase tracking-wide">
            <span>{t.citizenDensity}</span>
            <span className="font-mono text-cyan-400 font-bold">{Math.round(weights.citizenDemand * 100)}%</span>
          </div>
          <input
            id="slider-demand"
            type="range"
            min="0"
            max="100"
            value={weights.citizenDemand * 100}
            onChange={(e) => handleWeightChange('citizenDemand', Number(e.target.value) / 100)}
            className="w-full h-1.5 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <p className="text-[10px] text-slate-500 font-sans">{t.citizenDensityDesc}</p>
        </div>

        {/* Slider 2 */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 font-mono uppercase tracking-wide">
            <span>{t.infraDeficit}</span>
            <span className="font-mono text-cyan-400 font-bold">{Math.round(weights.infrastructureGap * 100)}%</span>
          </div>
          <input
            id="slider-gap"
            type="range"
            min="0"
            max="100"
            value={weights.infrastructureGap * 100}
            onChange={(e) => handleWeightChange('infrastructureGap', Number(e.target.value) / 100)}
            className="w-full h-1.5 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <p className="text-[10px] text-slate-500 font-sans">{t.infraDeficitDesc}</p>
        </div>

        {/* Slider 3 */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 font-mono uppercase tracking-wide">
            <span>{t.demoNeed}</span>
            <span className="font-mono text-cyan-400 font-bold">{Math.round(weights.demographicNeed * 100)}%</span>
          </div>
          <input
            id="slider-demo"
            type="range"
            min="0"
            max="100"
            value={weights.demographicNeed * 100}
            onChange={(e) => handleWeightChange('demographicNeed', Number(e.target.value) / 100)}
            className="w-full h-1.5 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <p className="text-[10px] text-slate-500 font-sans">{t.demoNeedDesc}</p>
        </div>

        {/* Slider 4 */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 font-mono uppercase tracking-wide">
            <span>{t.costEfficiency}</span>
            <span className="font-mono text-cyan-400 font-bold">{Math.round(weights.costEfficiency * 100)}%</span>
          </div>
          <input
            id="slider-cost"
            type="range"
            min="0"
            max="100"
            value={weights.costEfficiency * 100}
            onChange={(e) => handleWeightChange('costEfficiency', Number(e.target.value) / 100)}
            className="w-full h-1.5 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <p className="text-[10px] text-slate-500 font-sans">{t.costEfficiencyDesc}</p>
        </div>
      </div>

      {/* Ranked Proposals List */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          {t.rankedAllocations} ({sortedProjects.length})
        </h4>

        <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
          <AnimatePresence mode="popLayout">
            {sortedProjects.map((proj, idx) => {
              const isSelected = selectedProject?.id === proj.id;
              
              return (
                <motion.div
                  key={proj.id}
                  id={`project-card-${proj.id}`}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className={`border rounded-xl p-4 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-950/20 to-blue-950/20 border-cyan-500/40 shadow-lg shadow-cyan-500/5'
                      : 'bg-slate-950/40 hover:bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  {/* Rank Badge & Project Info */}
                  <div className="flex items-start gap-3.5 flex-1">
                    {/* Rank Circle */}
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-sm font-black text-cyan-400 font-mono shadow-inner">
                        #{idx + 1}
                      </div>
                      
                      {/* Rank shift indicator */}
                      {proj.rankChange > 0 && (
                        <span className="text-[9px] text-cyan-400 font-bold flex items-center mt-1 font-mono">
                          <ArrowUp className="w-2.5 h-2.5 mr-0.5" /> +{proj.rankChange}
                        </span>
                      )}
                      {proj.rankChange < 0 && (
                        <span className="text-[9px] text-rose-500 font-bold flex items-center mt-1 font-mono">
                          <ArrowDown className="w-2.5 h-2.5 mr-0.5" /> {proj.rankChange}
                        </span>
                      )}
                      {proj.rankChange === 0 && (
                        <span className="text-[8px] text-slate-500 font-semibold mt-1 font-mono">
                          {t.stable}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-slate-100 font-display tracking-wide">
                          {proj.title}
                        </span>
                        <span className="text-[9px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                          {proj.constituency?.toUpperCase() || t.general}
                        </span>
                        <span className="text-[9px] bg-cyan-950/50 text-cyan-400 px-2 py-0.5 border border-cyan-800/40 rounded font-mono uppercase font-bold">
                          {proj.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-sans leading-relaxed line-clamp-2">
                        {proj.description}
                      </p>
                      
                      {/* Core Metrics Summary row */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1.5 text-[10px] text-slate-500 font-mono">
                        <span>{t.feedbacks} <strong className="text-slate-300">{proj.citizenSubmissionsCount}</strong></span>
                        <span>{t.demandRank} <strong className="text-cyan-400 font-bold">{proj.demandIndex}/100</strong></span>
                        <span>{t.gapReduction} <strong className="text-slate-300">{proj.infrastructureBenefitScore}/100</strong></span>
                        <span>{t.estimatedCost} <strong className="text-yellow-500 font-bold">₹{proj.estimatedCost} {t.lakhs}</strong></span>
                        {liveUserCoords && proj.latitude && proj.longitude && (
                          <span className="text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-900/30 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-emerald-500 animate-pulse" />
                            {getDistance(liveUserCoords.lat, liveUserCoords.lng, proj.latitude, proj.longitude).toFixed(1)} km away
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Priority score & action btn */}
                  <div className="flex md:flex-col items-center justify-between md:items-end gap-3 md:justify-center pl-10 md:pl-0 border-t md:border-t-0 md:border-l border-slate-800/80 md:pl-4 pt-3 md:pt-0">
                    <div className="text-left md:text-right">
                      <span className="text-[9px] text-slate-500 uppercase tracking-wider font-mono">{t.priorityIndex}</span>
                      <p className="text-2xl font-black font-mono text-cyan-400 leading-none">
                        {proj.score.toFixed(1)}
                      </p>
                    </div>

                    <button
                      id={`btn-action-report-${proj.id}`}
                      onClick={() => onSelectProjectForReport(proj)}
                      className={`px-3 py-1.5 text-[11px] font-sans font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/10'
                          : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5 text-cyan-300" />
                          {t.selected}
                        </>
                      ) : (
                        <>
                          <FileText className="w-3.5 h-3.5" />
                          {t.buildProposal}
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
