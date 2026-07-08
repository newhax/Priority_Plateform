import React, { useState } from 'react';
import { ProposedProject } from '../types';
import { FileText, Languages, Sparkles, Copy, CheckCircle } from 'lucide-react';

interface ReportGeneratorProps {
  project: ProposedProject | null;
  language?: string;
}

const generatorTranslations: Record<string, any> = {
  en: {
    title: "AI Security & Proposal Desk",
    subtitle: "Generate formal administrative requisition papers, itemized cost estimates, and legislative drafts for public work approvals.",
    activeSelection: "ACTIVE PIPELINE SELECTION",
    budgetScope: "Budget Scope",
    priorityRank: "PRIORITY RANK",
    legislativeDirectives: "LEGISLATIVE DIRECTIVES / CUSTOM GUIDELINES",
    directivesPlaceholder: "e.g., Target immediate water security, ensure alignment with District Collector, add state environment safeguards...",
    draftingDialect: "DRAFTING DIALECT",
    generateBtn: "GENERATE RECOMMENDATION DOSSIER",
    draftingWithAi: "Drafting administrative clearance files with Gemini AI...",
    secureDraftLedger: "SECURE DRAFT OUTPUT LEDGER",
    copied: "COPIED",
    copyText: "COPY TEXT",
    noProject: "No Project Selected",
    noProjectDesc: "Please choose a project in the **Prioritization Decision Deck** by clicking \"Build Proposal\" to load telemetry and write administrative request filings."
  },
  ml: {
    title: "എഐ സെക്യൂരിറ്റി & പ്രൊപ്പോസൽ ഡെസ്ക്",
    subtitle: "പൊതുമരാమത്ത് അനുമതികൾക്കായി ഔദ്യോഗിക ഭരണപരമായ നിർദ്ദേശங்கள், ചെലവ് കണക്കുകൾ, നിയമനിർമ്മാണ കരടുകൾ എന്നിവ തയ്യാറാക്കുക.",
    activeSelection: "സജീവ പ്രൊജക്റ്റ് സെലക്ഷൻ",
    budgetScope: "ബജറ്റ് പരിധി",
    priorityRank: "മുൻഗണനാ റാങ്ക്",
    legislativeDirectives: "നിയമനിർമ്മാണ മാർഗ്ഗനിർദ്ദേശങ്ങൾ / പ്രത്യേക നിർദ്ദേശങ്ങൾ",
    directivesPlaceholder: "ഉദാഹരണത്തിന്: കുടിവെള്ള സുരക്ഷയ്ക്ക് മുൻഗണന നൽകുക, പരിസ്ഥിതി സംരക്ഷണ നടപടികൾ ഉൾപ്പെടുത്തുക...",
    draftingDialect: "രചന ഭാഷ",
    generateBtn: "പ്രൊപ്പോസൽ ഫയൽ തയ്യാറാക്കുക",
    draftingWithAi: "ജെമിനി എഐ ഉപയോഗിച്ച് ഡ്രാഫ്റ്റ് ഫയലുകൾ തയ്യാറാക്കുന്നു...",
    secureDraftLedger: "തയ്യാറാക്കിയ ഡ്രാഫ്റ്റ് ഫയൽ",
    copied: "പകർത്തി",
    copyText: "പകർത്തുക",
    noProject: "പ്രൊജക്റ്റ് തിരഞ്ഞെടുത്തിട്ടില്ല",
    noProjectDesc: "ഭരണപരമായ നിർദ്ദേശങ്ങൾ തയ്യാറാക്കുന്നതിനായി ദയവായി മുൻഗണനാ ഡെസ്കിൽ നിന്ന് ഒരു പ്രൊജക്റ്റ് തിരഞ്ഞെടുക്കുക."
  },
  hi: {
    title: "एआई सुरक्षा और प्रस्ताव डेस्क",
    subtitle: "सार्वजनिक कार्य स्वीकृतियों के लिए औपचारिक प्रशासनिक मांग पत्र, मदवार लागत अनुमान और विधायी मसौदे तैयार करें।",
    activeSelection: "सक्रिय पाइपलाइन चयन",
    budgetScope: "बजट दायरा",
    priorityRank: "प्राथमिकता रैंक",
    legislativeDirectives: "विधायी निर्देश / कस्टम दिशानिर्देश",
    directivesPlaceholder: "जैसे, तत्काल जल सुरक्षा को लक्षित करें, जिला कलेक्टर के साथ संरेखण सुनिश्चित करें...",
    draftingDialect: "मसौदा तैयार करने की भाषा",
    generateBtn: "सिफारिश डोजियर उत्पन्न करें",
    draftingWithAi: "जेमिनी एआई के साथ प्रशासनिक मंजूरी फाइलें तैयार की जा रही हैं...",
    secureDraftLedger: "सुरक्षित मसौदा आउटपुट बही",
    copied: "कॉपी किया गया",
    copyText: "टेक्स्ट कॉपी करें",
    noProject: "कोई परियोजना चयनित नहीं",
    noProjectDesc: "प्रशासनिक अनुरोध फाइलें लिखने के लिए कृपया 'प्राथमिकता निर्णय डेक' में 'प्रस्ताव बनाएँ' पर क्लिक करके एक परियोजना चुनें।"
  },
  bn: {
    title: "এআই সুরক্ষা ও প্রস্তাব ডেস্ক",
    subtitle: "সরকারি কাজের অনুমোদনের জন্য আনুষ্ঠানিক প্রশাসনিক চাহিদাপত্র, আইটেমাইজড খরচ অনুমান এবং আইনি খসড়া তৈরি করুন।",
    activeSelection: "সক্রিয় পাইপলাইন নির্বাচন",
    budgetScope: "বাজেট পরিসর",
    priorityRank: "অগ্রাধিকার র্যাঙ্ক",
    legislativeDirectives: "আইনি নির্দেশিকা / কাস্টম গাইডলাইন",
    directivesPlaceholder: "যেমন, অবিলম্বে পানীয় জলের নিরাপত্তা লক্ষ্য করা, জেলা প্রশাসকের সাথে সমন্বয় নিশ্চিত করা...",
    draftingDialect: "খসড়া লেখার ভাষা",
    generateBtn: "অনুমোদন ডসিয়ার তৈরি করুন",
    draftingWithAi: "জেমিনি এআই-এর সাহায্যে প্রশাসনিক খসড়া ফাইল তৈরি করা হচ্ছে...",
    secureDraftLedger: "সুরক্ষিত খसড়া আউটপুট লেজার",
    copied: "কপি করা হয়েছে",
    copyText: "লেখা কপি করুন",
    noProject: "কোনো প্রজেক্ট নির্বাচিত নেই",
    noProjectDesc: "অনুগ্রহ করে প্রশাসনিক খসড়া ফাইলগুলি লেখার জন্য অগ্রাধিকার সিদ্ধান্ত ডেক থেকে একটি প্রজেক্ট নির্বাচন করুন।"
  },
  pa: {
    title: "AI ਸੁਰੱਖਿਆ ਅਤੇ ਪ੍ਰਸਤਾਵ ਡੈਸਕ",
    subtitle: "ਸਰਕਾਰੀ ਕੰਮਾਂ ਦੀ ਪ੍ਰਵਾਨਗੀ ਲਈ ਰਸਮੀ ਪ੍ਰਸ਼ਾਸਕੀ ਮੰਗ ਪੱਤਰ, ਲਾਗਤ ਅਨੁਮਾਨ ਅਤੇ ਕਾਨੂੰਨੀ ਖਰੜੇ ਤਿਆਰ ਕਰੋ।",
    activeSelection: "ਸਰਗਰਮ ਪਾਈਪਲਾਈਨ ਚੋਣ",
    budgetScope: "ਬਜਟ ਦਾਇਰਾ",
    priorityRank: "ਪ੍ਰਾਥਮਿਕਤਾ ਰੈਂਕ",
    legislativeDirectives: "ਕਾਨੂੰਨੀ ਦਿਸ਼ਾ-ਨਿਰਦੇਸ਼ / ਕਸਟਮ ਗਾਈਡਲਾਈਨਜ਼",
    directivesPlaceholder: "ਉਦਾਹਰਨ ਲਈ, ਤੁਰੰਤ ਪਾਣੀ ਦੀ ਸੁਰੱਖਿਆ ਨੂੰ ਨਿਸ਼ਾਨਾ ਬਣਾਓ, ਜ਼ਿਲ੍ਹਾ ਕੁਲੈਕਟਰ ਨਾਲ ਤਾਲਮੇਲ ਯਕੀਨੀ ਬਣਾਓ...",
    draftingDialect: "ਖਰੜਾ ਤਿਆਰ ਕਰਨ ਦੀ ਭਾਸ਼า",
    generateBtn: "ਸਿਫਾਰਸ਼ ਦਸਤਾਵੇਜ਼ ਤਿਆਰ ਕਰੋ",
    draftingWithAi: "ਜੇਮਿਨੀ AI ਨਾਲ ਪ੍ਰਸ਼ਾਸਕੀ ਮਨਜ਼ੂਰੀ ਫਾਈਲਾਂ ਤਿਆਰ ਕੀਤੀਆਂ ਜਾ ਰਹੀਆਂ ਹਨ...",
    secureDraftLedger: "ਸੁਰੱਖਿਅਤ ਖਰੜਾ ਆਉਟਪੁੱਟ ਖਾਤਾ",
    copied: "ਕਾਪੀ ਕੀਤਾ ਗਿਆ",
    copyText: "ਟੈਕਸਟ ਕਾਪੀ ਕਰੋ",
    noProject: "ਕੋਈ ਪ੍ਰੋਜੈਕਟ ਚੁਣਿਆ ਨਹੀਂ ਗਿਆ",
    noProjectDesc: "ਪ੍ਰਸ਼ਾਸਕੀ ਬੇਨਤੀ ਫਾਈਲਾਂ ਲਿਖਣ ਲਈ ਕਿਰਪา ਕਰਕੇ 'ਤਰਜੀਹੀ ਫੈਸਲਾ ਡੈੱਕ' ਵਿੱਚ 'ਪ੍ਰਸਤਾਵ ਬਣਾਓ' ਤੇ ਕਲਿੱक ਕਰਕੇ ਇੱਕ ਪ੍ਰੋਜੈਕਟ ਚੁਣੋ।"
  },
  te: {
    title: "AI సెక్యూరిటీ & ప్రపోజల్ డెస్క్",
    subtitle: "ప్రజా పనుల ఆమోదం కోసం అధికారిక పరిపాలనా పత్రాలు, అంచనా వ్యయాలు మరియు శాసన ముసాయిదాలను సిద్ధం చేయండి.",
    activeSelection: "సక్రియ పైప్‌లైన్ ఎంపిక",
    budgetScope: "బడ్జెట్ పరిధి",
    priorityRank: "ప్రాధాన్యత ర్యాంక్",
    legislativeDirectives: "శాసన నిబంధనలు / ప్రత్యేక మార్గదర్శకాలు",
    directivesPlaceholder: "ఉదాహరణకు, తక్షణ నీటి భద్రతను లక్ష్యంగా చేసుకోండి, జిల్లా కలెక్టర్ సమన్వయం ఉండేలా చూసుకోండి...",
    draftingDialect: "ముసాయిదా భాష",
    generateBtn: "సిఫార్సు పత్రాన్ని రూపొందించండి",
    draftingWithAi: "జెమిని AI సహాయంతో ముసాయిదాలను సిద్ధం చేస్తోంది...",
    secureDraftLedger: "భద్రపరచబడిన ముసాయిదా అవుట్‌పుట్ లెడ్జర్",
    copied: "కాపీ చేయబడింది",
    copyText: "కాపీ చేయండి",
    noProject: "ఏ ప్రాజెక్ట్ ఎంపిక కాలేదు",
    noProjectDesc: "పరిపాలనా పత్రాలను రాయడానికి దయచేసి ప్రాధాన్యత నిర్ణయాల డెక్ నుండి 'ప్రపోజల్ బిల్డ్ చేయి' పై క్లిక్ చేసి ఒక ప్రాజెక్ట్‌ను ఎంచుకోండి."
  },
  ta: {
    title: "செயற்கை நுண்ணறிவு பாதுகாப்பு மற்றும் திட்ட வரைவு போர்டல்",
    subtitle: "பொதுப்பணி ஒப்புதல்களுக்கான முறையான நிர்வாகக் கோரிக்கைகள், திட்டமிடப்பட்ட செலவு மதிப்பீடுகள் மற்றும் சட்டமன்ற வரைவுகளை உருவாக்கவும்.",
    activeSelection: "செயலில் உள்ள திட்டத் தேர்வு",
    budgetScope: "திட்ட வரவுசெலவு",
    priorityRank: "முன்னுரிமை எண்",
    legislativeDirectives: "சட்டமன்ற வழிகாட்டுதல்கள் / தனிப்பயன் வழிகாட்டுதல்கள்",
    directivesPlaceholder: "எ.கா., உடனடி நீர் பாதுகாப்பை இலக்காகக் கொள்ளவும், மாவட்ட ஆட்சியரின் ஒப்புதலைப் பெறவும்...",
    draftingDialect: "வரைவு மொழி",
    generateBtn: "பரிந்துரை கோப்பை உருவாக்கு",
    draftingWithAi: "ஜெமினி செயற்கை நுண்ணறிவைப் பயன்படுத்தி நிர்வாக ஒப்புதல் கோப்புகளை உருவாக்குகிறது...",
    secureDraftLedger: "பாதுகாக்கப்பட்ட வரைவுக்  கோப்பு",
    copied: "நகலெடுக்கப்பட்டது",
    copyText: "உரையை நகலெடு",
    noProject: "எந்த திட்டமும் தேர்ந்தெடுக்கப்படவில்லை",
    noProjectDesc: "நிர்வாகக் கோரிக்கைகளை எழுத முன்னுரிமை முடிவு டெக்கிலிருந்து ஒரு திட்டத்தைத் தேர்ந்தெடுக்கவும்."
  }
};

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({ project, language = 'en' }) => {
  const [customFocus, setCustomFocus] = useState('');
  const [draftDialect, setDraftDialect] = useState<'en' | 'ml' | 'hi' | 'ta'>('en');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const t = generatorTranslations[language] || generatorTranslations['en'];

  const handleGenerate = async () => {
    if (!project) return;
    setLoading(true);
    setReport(null);

    try {
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project,
          customFocus,
          language: draftDialect,
        }),
      });

      const data = await response.json();
      if (data.report) {
        setReport(data.report);
      } else {
        setReport("Failed to generate report. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setReport("Connection failed. Check development server is online.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!report) return;
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple, highly robust Markdown-to-JSX custom parser that matches bullet points, titles, and separators
  const renderMarkdown = (md: string) => {
    const lines = md.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('# ')) {
        return <h1 key={idx} className="text-base font-extrabold text-cyan-400 font-display mt-4 mb-2 tracking-wide border-b border-slate-800 pb-2 uppercase">{trimmed.substring(2)}</h1>;
      }
      if (trimmed.startsWith('## ')) {
        return <h2 key={idx} className="text-sm font-bold text-cyan-300 font-display mt-4 mb-2 uppercase tracking-wide">{trimmed.substring(3)}</h2>;
      }
      if (trimmed.startsWith('### ')) {
        return <h3 key={idx} className="text-xs font-semibold text-slate-200 font-mono mt-3 mb-1">{trimmed.substring(4)}</h3>;
      }
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return <li key={idx} className="ml-4 list-disc text-xs text-slate-300 font-sans mb-1 leading-relaxed">{trimmed.substring(2)}</li>;
      }
      if (trimmed === '---') {
        return <hr key={idx} className="border-slate-800 my-4" />;
      }
      if (trimmed === '') {
        return <div key={idx} className="h-2" />;
      }
      return <p key={idx} className="text-xs text-slate-300 font-sans mb-2 leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className="bg-slate-900/65 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 shadow-2xl shadow-cyan-950/10 space-y-5">
      <div className="border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2 text-cyan-400 font-display font-bold uppercase tracking-wide">
          <FileText className="w-5 h-5 text-cyan-400" />
          {t.title}
        </div>
        <p className="text-xs text-slate-400 font-sans mt-0.5 leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      {project ? (
        <div className="space-y-4">
          {/* Active project header card */}
          <div className="bg-slate-955 border border-slate-800/80 rounded-xl p-4 flex items-center justify-between gap-4 shadow-inner">
            <div>
              <span className="text-[9px] bg-cyan-950/50 text-cyan-400 px-2 py-0.5 border border-cyan-800/40 rounded font-mono uppercase font-bold tracking-wider">
                {t.activeSelection}
              </span>
              <h4 className="text-sm font-extrabold text-slate-100 mt-2 font-display tracking-wide">{project.title}</h4>
              <p className="text-xs text-slate-400 mt-1 font-sans">
                {t.budgetScope}: <strong className="text-yellow-500">₹{project.estimatedCost} Lakhs</strong> | Region: <strong className="text-slate-200">{project.constituency?.toUpperCase() || 'GENERAL'}</strong>
              </p>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-slate-500 block uppercase font-mono">{t.priorityRank}</span>
              <span className="text-lg font-black font-mono text-cyan-400">{project.demandIndex}/100</span>
            </div>
          </div>

          {/* Configuration Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Guidelines box */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block font-mono uppercase tracking-wide">
                {t.legislativeDirectives}
              </label>
              <textarea
                id="report-custom-focus"
                rows={2}
                value={customFocus}
                onChange={(e) => setCustomFocus(e.target.value)}
                placeholder={t.directivesPlaceholder}
                className="w-full text-xs bg-slate-950/60 border border-slate-800 focus:border-cyan-500/50 rounded-xl p-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
              />
            </div>

            {/* Language Box */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block font-mono uppercase tracking-wide">
                {t.draftingDialect}
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { code: 'en', label: 'English' },
                  { code: 'ml', label: 'Malayalam' },
                  { code: 'hi', label: 'Hindi' },
                  { code: 'ta', label: 'Tamil' },
                ].map((l) => (
                  <button
                    key={l.code}
                    id={`lang-btn-${l.code}`}
                    onClick={() => setDraftDialect(l.code as any)}
                    className={`px-2.5 py-1.5 text-xs rounded-lg border font-bold font-mono uppercase tracking-wide flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      draftDialect === l.code
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 border-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-cyan-400 hover:bg-slate-900'
                    }`}
                  >
                    <Languages className="w-3.5 h-3.5 opacity-60" />
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Trigger */}
          <button
            id="btn-trigger-generation"
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 border border-cyan-500/30 text-white font-display font-bold text-xs py-2.5 px-4 rounded-xl shadow-lg shadow-cyan-500/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
                {t.draftingWithAi}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 animate-pulse text-cyan-300" />
                {t.generateBtn}
              </>
            )}
          </button>

          {/* Report Viewer */}
          {report && (
            <div className="border border-slate-800 bg-slate-950/80 rounded-2xl overflow-hidden shadow-2xl relative">
              {/* Header bar of the report viewer */}
              <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between gap-4">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5 font-bold">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block animate-ping"></span>
                  {t.secureDraftLedger}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    id="btn-copy-report"
                    onClick={handleCopy}
                    className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-slate-400 hover:text-cyan-300 transition-all flex items-center gap-1.5 text-[10px] font-mono cursor-pointer"
                    title="Copy Report To Clipboard"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                        {t.copied}
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        {t.copyText}
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Scrollable Document container */}
              <div className="p-6 max-h-[500px] overflow-y-auto space-y-2 bg-slate-950 text-slate-100 border border-t-0 border-slate-800 rounded-b-2xl">
                {renderMarkdown(report)}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-slate-950/40 border border-dashed border-slate-800 rounded-2xl p-8 text-center animate-fade-in">
          <FileText className="w-10 h-10 text-slate-700 mx-auto mb-2.5" />
          <p className="text-sm font-semibold text-slate-300 font-sans">{t.noProject}</p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto font-sans leading-relaxed">
            {t.noProjectDesc}
          </p>
        </div>
      )}
    </div>
  );
};
