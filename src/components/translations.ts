export interface TranslationDict {
  title: string;
  subtitle: string;
  constituency: string;
  submitSuggestion: string;
  citizenName: string;
  phoneOptional: string;
  selectArea: string;
  suggestionPlaceholder: string;
  submitBtn: string;
  processing: string;
  submitting: string;
  successMsg: string;
  voiceNote: string;
  recordStart: string;
  recordStop: string;
  photoUpload: string;
  photoDragDrop: string;
  whatsAppSync: string;
  whatsAppDesc: string;
  mpDashboard: string;
  rankingSandbox: string;
  sandboxDesc: string;
  sliderDemand: string;
  sliderGap: string;
  sliderDemo: string;
  sliderCost: string;
  rankedProjects: string;
  generateReport: string;
  customFocus: string;
  customFocusPlaceholder: string;
  selectLanguage: string;
  demographics: string;
  population: string;
  income: string;
  elderlyRatio: string;
  studentRatio: string;
  infraDeficit: string;
  schools: string;
  clinics: string;
  waterAccess: string;
  roadQuality: string;
  activeFeed: string;
  category: string;
  urgency: string;
  actionStatus: string;
  original: string;
  aiTranslation: string;
  aiSummary: string;
  impactScale: string;
  officialReport: string;
  printingReport: string;
  generateReportBtn: string;
  liveFeedLabel: string;
  liveFeedMsg1: string;
  liveFeedMsg2: string;
  liveFeedMsg3: string;
  liveFeedMsg4: string;
  myHistory: string;
  pdfReceipt: string;
  noHistory: string;
  noSubmissions: string;
}

export const translations: Record<string, any> = {
  en: {
    title: "Citizen Development Portal",
    subtitle: "Consolidating public demand with dynamic civic planning",
    constituency: "Thiruvananthapuram Constituency",
    submitSuggestion: "Submit New Suggestion",
    citizenName: "Citizen Name",
    phoneOptional: "Phone Number (Optional)",
    selectArea: "Select Area",
    suggestionPlaceholder: "Describe your suggestion or grievance (e.g., We need water pipelines or school upgrades)...",
    submitBtn: "Submit Grievance",
    processing: "AI Analyzing Submission...",
    submitting: "Submitting...",
    successMsg: "Submission processed successfully with Gemini AI!",
    voiceNote: "Voice Suggestion",
    recordStart: "Start Recording",
    recordStop: "Stop & Process",
    photoUpload: "Photo Attachment",
    photoDragDrop: "Drag and drop a photo of the issue or click to select",
    whatsAppSync: "WhatsApp Live Sync",
    whatsAppDesc: "See how citizens submit issues instantly via WhatsApp channels",
    mpDashboard: "Citizen Decision Support Dashboard",
    rankingSandbox: "Dynamic Prioritization Sandbox",
    sandboxDesc: "Adjust weights to automatically rank proposed projects based on objective demand data:",
    sliderDemand: "Citizen Demand Density",
    sliderGap: "Infrastructure Gap Deficit",
    sliderDemo: "Demographic Needs Weight",
    sliderCost: "Cost-to-Benefit Efficiency",
    rankedProjects: "Ranked Development Proposals",
    generateReport: "AI Civic Report Builder",
    customFocus: "Additional Civic Guidelines (Optional)",
    customFocusPlaceholder: "e.g., Prioritize local youth employment, fast-track environmental clearance...",
    selectLanguage: "Output Report Language",
    demographics: "Constituency Demographics",
    population: "Population",
    income: "Avg Income",
    elderlyRatio: "Elderly Population",
    studentRatio: "Student Population",
    infraDeficit: "Infrastructure Deficit Metrics",
    schools: "School Deficit",
    clinics: "Healthcare Clinic Deficit",
    waterAccess: "Water Scarcity (% Unpiped)",
    roadQuality: "Road Transit Deficit",
    activeFeed: "Consolidated Citizen Suggestion Feed",
    category: "Category",
    urgency: "AI Urgency",
    actionStatus: "Status Action",
    original: "Original Language",
    aiTranslation: "AI English Translation",
    aiSummary: "AI-Generated Summary",
    impactScale: "Estimated Affected Citizens",
    officialReport: "Official Legislative Project Proposal",
    printingReport: "Drafting government proposal via Gemini...",
    generateReportBtn: "Generate Recommendation Proposal",
    liveFeedLabel: "LIVE SYSTEM FEED",
    liveFeedMsg1: "CITIZEN DEVELOPMENT PORTAL: AUTOMATED CIVIC DEMAND INTAKE & SYSTEM INTERPRETER LIVE",
    liveFeedMsg2: "MULTI-LINGUAL SUPPORT PARSING VOICE & DIGITAL IMAGES IN REAL-TIME",
    liveFeedMsg3: "REAL-TIME CONSTITUENCY PLANNING: INTEGRATING PUBLIC DEMAND + SPATIAL DECISION MAKING",
    liveFeedMsg4: "AI AUTO-SUMMARIZATION AND PROPOSAL DESK GENERATES CONSTITUENCY DRAFTS SECURELY",
    myHistory: "My Submitted Grievances",
    pdfReceipt: "PDF Receipt",
    noHistory: "No grievances submitted yet.",
    noSubmissions: "No submissions currently recorded for {city}, {state}."
  },
  ml: {
    title: "ജനസമ്പർക്ക വികസന പോർട്ടൽ",
    subtitle: "പൊതുജന ആവശ്യങ്ങളും ജനാധിപത്യപരമായ വികസന ആസൂത്രണവും",
    constituency: "തിരുവനന്തപുരം പാർലമെന്റ് മണ്ഡലം",
    submitSuggestion: "പുതിയ വികസന നിർദ്ദേശം സമർപ്പിക്കുക",
    citizenName: "നിങ്ങളുടെ പേര്",
    phoneOptional: "ഫോൺ നമ്പർ (നിർബന്ധമില്ല)",
    selectArea: "പ്രദേശം തിരഞ്ഞെടുക്കുക",
    suggestionPlaceholder: "നിങ്ങളുടെ വികസന നിർദ്ദേശമോ പരാതിയോ വിവരിക്കുക (ഉദാഹരണത്തിന്: സ്കൂൾ വികസനം അല്ലെങ്കിൽ റോഡ് അറ്റകുറ്റപ്പണി)...",
    submitBtn: "നിർദ്ദേശം സമർപ്പിക്കുക",
    processing: "എ ഐ വിശകലനം ചെയ്യുന്നു...",
    submitting: "സമർപ്പിക്കുന്നു...",
    successMsg: "നിർദ്ദേശം ജെമിനി എ ഐ വിജയകരമായി വിശകലനം ചെയ്തു!",
    voiceNote: "വോയ്‌സ് സന്ദേശം",
    recordStart: "റെക്കോർഡിംഗ് ആരംഭിക്കുക",
    recordStop: "നിർത്തുക, വിശകലനം ചെയ്യുക",
    photoUpload: "ചിത്രം ചേർക്കുക",
    photoDragDrop: "ഫോട്ടോ ഇവിടെ ഡ്രാഗ് ചെയ്യുക അല്ലെങ്കിൽ ക്ലിക്ക് ചെയ്യുക",
    whatsAppSync: "വാട്സാപ്പ് ലൈവ് സിങ്ക്",
    whatsAppDesc: "പൗരന്മാർ വാട്സാപ്പ് വഴി അയക്കുന്ന നിർദ്ദേശങ്ങൾ ഇവിടെ തത്സമയം കാണാം",
    mpDashboard: "ജനക്ഷേമ വികസന ഡാഷ്‌ബോർഡ്",
    rankingSandbox: "ഡൈനാമിക് പ്രയോറിറ്റി സാൻഡ്‌ബോക്‌സ്",
    sandboxDesc: "അടിസ്ഥാന ഡാറ്റ അടിസ്ഥാനമാക്കി പദ്ധതികൾ റാങ്ക് ചെയ്യുന്നതിന് മുൻഗണനാ ക്രമങ്ങൾ മാറ്റുക:",
    sliderDemand: "പൗരന്മാരുടെ ആവശ്യം (സാന്ദ്രത)",
    sliderGap: "അടിസ്ഥാന സൗകര്യ കുറവ്",
    sliderDemo: "ജനസംഖ്യാ മുൻഗണന",
    sliderCost: "ചെലവ് ചുരുക്കൽ കാര്യക്ഷമത",
    rankedProjects: "റാങ്ക് ചെയ്യപ്പെട്ട വികസന നിർദ്ദേശങ്ങൾ",
    generateReport: "എ ഐ ഔദ്യോഗിക റിപ്പോർട്ട് നിർമ്മിതി",
    customFocus: "പ്രത്യേക നിർദ്ദേശങ്ങൾ (നിർബന്ധമില്ല)",
    customFocusPlaceholder: "ഉദാഹരണത്തിന്: പ്രാദേശിക തൊഴിൽ അവസരങ്ങൾ, പരിസ്ഥിതി അനുമതി...",
    selectLanguage: "റിപ്പോർട്ടിന്റെ ഭാഷ",
    demographics: "മേഖലയിലെ ജനസംഖ്യാ വിവരങ്ങൾ",
    population: "ജനസംഖ്യ",
    income: "ശരാശരി വരുമാനം",
    elderlyRatio: "മുതിർന്ന പൗരന്മാർ",
    studentRatio: "വിദ്യാർത്ഥികൾ",
    infraDeficit: "അടിസ്ഥാന സൗകര്യ കുറവുകൾ",
    schools: "സ്കൂളുകളുടെ കുറവ്",
    clinics: "ആശുപത്രികളുടെ കുറവ്",
    waterAccess: "കുടിവെള്ള ക്ഷാമം (% കണക്ഷൻ ഇല്ലാത്തത്)",
    roadQuality: "റോഡുകളുടെ അവസ്ഥ",
    activeFeed: "ക്രോഡീകരിച്ച ജനകീയ നിർദ്ദേശങ്ങൾ",
    category: "വിഭാഗം",
    urgency: "മുൻഗണന നില",
    actionStatus: "നടപടി ക്രമം",
    original: "യഥാർത്ഥ സന്ദേശം",
    aiTranslation: "ഇംഗ്ലീഷ് പരിഭാഷ (എ ഐ)",
    aiSummary: "ലഘു സംഗ്രഹം (എ ഐ)",
    impactScale: "ప్రയോജనం ലഭിക്കുന്ന ജനങ്ങൾ",
    officialReport: "ഔദ്യോഗിക വികസന പദ്ധതി റിപ്പോർട്ട്",
    printingReport: "ജെമിനി റിപ്പോർട്ട് തയ്യാറാക്കുന്നു...",
    generateReportBtn: "ശുപാർശ കത്തും റിപ്പോർട്ടും തയ്യാറാക്കുക",
    liveFeedLabel: "തത്സമയ സിസ്റ്റം ഫീഡ്",
    liveFeedMsg1: "പൗരക്ഷേമ വികസന പോർട്ടൽ: ഓട്ടോമേറ്റഡ് സിവിക് ഡിമാൻഡ് ഇൻടേക്കും സിസ്റ്റം ഇന്റർപ്രെറ്ററും പ്രവർത്തനക്ഷമമാണ്",
    liveFeedMsg2: "വോയ്‌സും ഡിജിറ്റൽ ചിത്രങ്ങളും തത്സമയം വിശകലനം ചെയ്യാനുള്ള ബഹുഭാഷാ പിന്തുണ ലഭ്യമാണ്",
    liveFeedMsg3: "തത്സമയ നിയോജകമണ്ഡല ആസൂത്രണം: ജനങ്ങളുടെ ആവശ്യങ്ങളും സ്ഥലസംബന്ധിയായ തീരുമാനങ്ങളും സമന്വയിപ്പിക്കുന്നു",
    liveFeedMsg4: "എ ഐ ഓട്ടോ-സംഗ്രഹവും നിർദ്ദേശ ഡെസ്കും നിയോജകമണ്ഡല ഡ്രാഫ്റ്റുകൾ സുരക്ഷിതമായി നിർമ്മിക്കുന്നു",
    myHistory: "എന്റെ പരാതികൾ",
    pdfReceipt: "പി ഡി എഫ് റെസീപ്റ്റ്",
    noHistory: "പരാതികൾ ഒന്നും സമർപ്പിച്ചിട്ടില്ല.",
    noSubmissions: "{city}, {state} മേഖലയിൽ നിലവിൽ നിർദ്ദേശങ്ങളൊന്നുമില്ല."
  },
  hi: {
    title: "सांसद-नागरिक विकास पोर्टल",
    subtitle: "लोकतांत्रिक योजना के साथ जन मांग का एकीकरण",
    constituency: "तिरुवनंतपुरम लोकसभा निर्वाचन क्षेत्र",
    submitSuggestion: "नया सुझाव दर्ज करें",
    citizenName: "नागरिक का नाम",
    phoneOptional: "फ़ोन नंबर (वैकल्पिक)",
    selectArea: "क्षेत्र चुनें",
    suggestionPlaceholder: "अपने सुझाव या शिकायत का विवरण दें (जैसे स्कूल अपग्रेड या पेयजल पाइपलाइन)...",
    submitBtn: "सुझाव दर्ज करें",
    processing: "एआई सुझाव का विश्लेषण कर रहा है...",
    submitting: "दर्ज किया जा रहा है...",
    successMsg: "जेमिनी एआई द्वारा सुझाव का सफलतापूर्वक विश्लेषण किया गया!",
    voiceNote: "आवाज संदेश",
    recordStart: "रिकॉर्डिंग शुरू करें",
    recordStop: "रोकें और विश्लेषित करें",
    photoUpload: "फोटो संलग्न करें",
    photoDragDrop: "समस्या का फोटो यहाँ खींचें या चुनने के लिए क्लिक करें",
    whatsAppSync: "व्हाट्सएप लाइव सिंक",
    whatsAppDesc: "देखें कि नागरिक व्हाट्सएप हेल्पलाइन के माध्यम से तुरंत समस्या कैसे दर्ज करते हैं",
    mpDashboard: "सांसद निर्णय सहायता डैशबोर्ड",
    rankingSandbox: "गतिशील प्राथमिकता सैंडबॉक्स",
    sandboxDesc: "वस्तुनिष्ठ मांग डेटा के आधार पर प्रस्तावित परियोजनाओं को स्वचालित रूप से रैंक करने के लिए प्राथमिकताएं बदलें:",
    sliderDemand: "नागरिक मांग घनत्व",
    sliderGap: "बुनियादी ढांचा अंतर घाटा",
    sliderDemo: "जनसांख्यिकीय आवश्यकता",
    sliderCost: "लागत-लाभ दक्षता",
    rankedProjects: "रैंक किए गए विकास प्रस्ताव",
    generateReport: "एआई नागरिक रिपोर्ट निर्माता",
    customFocus: "अतिरिक्त नागरिक दिशानिर्देश (वैकल्पिक)",
    customFocusPlaceholder: "जैसे, स्थानीय युवाओं को रोजगार, त्वरित पर्यावरणीय मंजूरी...",
    selectLanguage: "आउटपुट रिपोर्ट भाषा",
    demographics: "निर्वाचन क्षेत्र जनसांख्यिकी",
    population: "जनसंख्या",
    income: "औसत आय",
    elderlyRatio: "बुजुर्ग जनसंख्या",
    studentRatio: "छात्र जनसंख्या",
    infraDeficit: "बुनियादी ढांचा अंतर मेट्रिक्स",
    schools: "स्कूलों की कमी",
    clinics: "स्वास्थ्य क्लिनिक की कमी",
    waterAccess: "पानी की कमी (% बिना पाइप के)",
    roadQuality: "सड़क पारगमन घाटा",
    activeFeed: "समेकित नागरिक सुझाव फ़ीड",
    category: "श्रेणी",
    urgency: "एआई तात्कालिकता",
    actionStatus: "स्थिति कार्रवाई",
    original: "मूल भाषा",
    aiTranslation: "एआई अंग्रेजी अनुवाद",
    aiSummary: "एआई-जनित सारांश",
    impactScale: "अनुमानित प्रभावित नागरिक",
    officialReport: "आधिकारिक विधायी परियोजना प्रस्ताव",
    printingReport: "जेमिनी के माध्यम से सरकारी प्रस्ताव तैयार किया जा रहा है...",
    generateReportBtn: "सिफारिश प्रस्ताव उत्पन्न करें",
    liveFeedLabel: "लाइव सिस्टम फीड",
    liveFeedMsg1: "नागरिक विकास पोर्टल: स्वचालित नागरिक मांग प्रग्रहण और दुभाषिया प्रणाली लाइव है",
    liveFeedMsg2: "आवाज और डिजिटल छवियों को वास्तविक समय में पार्स करने के लिए बहुभाषी सहायता उपलब्ध है",
    liveFeedMsg3: "वास्तविक समय निर्वाचन क्षेत्र योजना: जन मांग + स्थानिक निर्णय प्रक्रिया का एकीकरण",
    liveFeedMsg4: "एआई ऑटो-समरी और प्रस्ताव डेस्क निर्वाचन क्षेत्र ड्राफ्ट को सुरक्षित रूप से तैयार करता है",
    myHistory: "मेरी शिकायतें",
    pdfReceipt: "पीडीएफ रसीद",
    noHistory: "अभी तक कोई शिकायत दर्ज नहीं की गई हैा",
    noSubmissions: "{city}, {state} के लिए वर्तमान में कोई सुझाव दर्ज नहीं है।"
  },
  bn: {
    title: "নাগরিক উন্নয়ন পোর্টাল",
    subtitle: "গণতান্ত্রিক পরিকল্পনার সাথে জনগণের চাহিদার সমন্বয়",
    constituency: "তিরুবনন্তপুরম কেন্দ্র",
    submitSuggestion: "নতুন পরামর্শ জমা দিন",
    citizenName: "নাগরিকের নাম",
    phoneOptional: "ফোন নম্বর (ঐচ্ছিক)",
    selectArea: "অঞ্চল নির্বাচন করুন",
    suggestionPlaceholder: "আপনার পরামর্শ বা অভিযোগের বিবরণ দিন (যেমন: আমাদের জলের পাইপলাইন বা স্কুল আপগ্রেড প্রয়োজন)...",
    submitBtn: "অভিযোগ জমা দিন",
    processing: "এআই পরামর্শ বিশ্লেষণ করছে...",
    submitting: "জমা দেওয়া হচ্ছে...",
    successMsg: "জেমিনি এআই দ্বারা পরামর্শ সফলভাবে বিশ্লেষণ করা হয়েছে!",
    voiceNote: "ভয়েস বার্তা",
    recordStart: "রেকর্ডিং শুরু করুন",
    recordStop: "বন্ধ করুন এবং বিশ্লেষণ করুন",
    photoUpload: "ছবি সংযুক্ত করুন",
    photoDragDrop: "সমস্যার ছবি এখানে টেনে আনুন বা নির্বাচন করতে ক্লিক করুন",
    whatsAppSync: "হোয়াটসঅ্যাপ লাইভ সিঙ্ক",
    whatsAppDesc: "নাগরিকরা কীভাবে হোয়াটসঅ্যাপ হেল্পলাইনের মাধ্যমে তাত্ক্ষণিকভাবে অভিযোগ জমা দেয় তা দেখুন",
    mpDashboard: "নাগরিক সিদ্ধান্ত সহায়তা ড্যাশবোর্ড",
    rankingSandbox: "গতিশীল অগ্রাধিকার স্যান্ডবক্স",
    sandboxDesc: "উদ্বেগজনক চাহিদার তথ্যের ভিত্তিতে প্রস্তাবিত প্রকল্পগুলিকে স্বয়ংক্রিয়ভাবে র্যাঙ্ক করার জন্য অগ্রাধিকারগুলি পরিবর্তন করুন:",
    sliderDemand: "নাগরিক চাহিদার ঘনত্ব",
    sliderGap: "পরিকাঠামো ঘাটতি",
    sliderDemo: "জনসংখ্যার প্রয়োজনীয়তা",
    sliderCost: "ব্যয়-সুবিধা দক্ষতা",
    rankedProjects: "র্যাঙ্ক করা উন্নয়ন প্রস্তাব",
    generateReport: "এআই নাগরিক প্রস্তাব প্রস্তুতকারক",
    customFocus: "অতিরিক্ত নাগরিক নির্দেশিকা (ঐচ্ছিক)",
    customFocusPlaceholder: "যেমন: স্থানীয় যুবকদের কর্মসংস্থান, দ্রুত পরিবেশগত ছাড়পত্র...",
    selectLanguage: "রিপোর্টের ভাষা",
    demographics: "অঞ্চলের জনসংখ্যা",
    population: "জনসংখ্যা",
    income: "গড় আয়",
    elderlyRatio: "বয়স্ক জনসংখ্যা",
    studentRatio: "ছাত্র জনসংখ্যা",
    infraDeficit: "পরিকাঠামো ঘাটতি মেট্রিক্স",
    schools: "স্কুলের অভাব",
    clinics: "স্বাস্থ্য ক্লিনিকের অভাব",
    waterAccess: "জলের অভাব (% কভারেজহীন)",
    roadQuality: "সড়ক পরিবহন ঘাটতি",
    activeFeed: "একত্রিত নাগরিক অভিযোগ ফিড",
    category: "বিভাগ",
    urgency: "এআই জরুরীতা",
    actionStatus: "অবস্থা পদক্ষেপ",
    original: "মূল বার্তা",
    aiTranslation: "এআই ইংরেজি অনুবাদ",
    aiSummary: "এআই-উত্পন্ন সারাংশ",
    impactScale: "সম্ভাব্য প্রভাবিত নাগরিক",
    officialReport: "অফিসিয়াল আইনী উন্নয়ন প্রস্তাব",
    printingReport: "জেমিনি দ্বারা প্রস্তাব তৈরি করা হচ্ছে...",
    generateReportBtn: "উন্নয়ন প্রস্তাব তৈরি করুন",
    liveFeedLabel: "লাইভ সিস্টেম ফিড",
    liveFeedMsg1: "নাগরিক উন্নয়ন পোর্টাল: স্বয়ংক্রিয় নাগরিক চাহিদা সংগ্রহ ও সিস্টেম ইন্টারপ্রেটার লাইভ",
    liveFeedMsg2: "ভয়েস এবং ডিজিটাল ছবি রিয়েল-টাইমে বিশ্লেষণ করার জন্য বহুভাষিক সহায়তা উপলব্ধ",
    liveFeedMsg3: "রিয়েল-টাইম নির্বাচনী এলাকা পরিকল্পনা: গণ চাহিদা + স্থানিক সিদ্ধান্ত গ্রহণের সমন্বয়",
    liveFeedMsg4: "এআই অটো-সামারি এবং প্রস্তাব ডেস্ক নিরাপদে নির্বাচনী এলাকার খসড়া তৈরি করে",
    noSubmissions: "{city}, {state} এর জন্য বর্তমানে কোনো পরামর্শ রেকর্ড করা নেই।"
  },
  pa: {
    title: "ਨਾਗਰਿਕ ਵਿਕਾਸ ਪੋਰਟਲ",
    subtitle: "ਲੋਕਤੰਤਰੀ ਯੋਜਨਾਬੰਦੀ ਨਾਲ ਜਨਤਕ ਮੰਗ ਦਾ ਏਕੀਕਰਨ",
    constituency: "ਤਿਰੂਵਨੰਤਪੁਰਮ ਹਲਕਾ",
    submitSuggestion: "ਨਵਾਂ ਸੁਝਾਅ ਦਰਜ ਕਰੋ",
    citizenName: "ਨਾਗਰਿਕ ਦਾ ਨਾਮ",
    phoneOptional: "ਫ਼ੋਨ ਨੰਬਰ (ਵਿਕਲਪਿਕ)",
    selectArea: "ਖੇਤਰ ਚੁਣੋ",
    suggestionPlaceholder: "ਆਪਣੇ ਸੁਝਾਅ ਜਾਂ ਸ਼ਿਕਾਇਤ ਦਾ ਵੇਰਵਾ ਦਿਓ (ਜਿਵੇਂ ਕਿ ਸਾਨੂੰ ਪਾਣੀ ਦੀਆਂ ਪਾਈਪਲਾਈਨਾਂ ਜਾਂ ਸਕੂਲ ਅੱਪਗ੍ਰੇਡ ਦੀ ਲੋੜ ਹੈ)...",
    submitBtn: "ਸੁਝਾਅ ਦਰਜ ਕਰੋ",
    processing: "AI ਸੁਝਾਅ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰ ਰਿਹਾ ਹੈ...",
    submitting: "ਦਰਜ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...",
    successMsg: "ਜੈਮਿਨੀ AI ਦੁਆਰਾ ਸੁਝਾਅ ਦਾ ਸਫਲਤਾਪੂਰਵਕ ਵਿਸ਼ਲੇਣ ਕੀਤਾ ਗਿਆ!",
    voiceNote: "ਆਵਾਜ਼ ਸੁਝਾਅ",
    recordStart: "ਰਿਕਾਰਡਿੰਗ ਸ਼ੁਰੂ ਕਰੋ",
    recordStop: "ਰੋਕੋ ਅਤੇ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ",
    photoUpload: "ਫੋਟੋ ਨੱਥੀ ਕਰੋ",
    photoDragDrop: "ਸਮੱਸਿਆ ਦੀ ਫੋਟੋ ਇੱਥੇ ਖਿੱਚੋ ਜਾਂ ਚੁਣਨ ਲਈ ਕਲਿੱਕ ਕਰੋ",
    whatsAppSync: "ਵਟਸਐਪ ਲਾਈਵ ਸਿੰਕ",
    whatsAppDesc: "ਦੇਖੋ ਕਿ ਨਾਗਰਿਕ ਵਟਸਐਪ ਹੈਲਪਲਾਈਨ ਰਾਹੀਂ ਤੁਰੰਤ ਸਮੱਸਿਆਵਾਂ ਕਿਵੇਂ ਦਰਜ ਕਰਦੇ ਹਨ",
    mpDashboard: "ਨਾਗਰਿਕ ਫੈਸਲਾ ਸਹਾਇਤਾ ਡੈਸ਼ਬੋਰਡ",
    rankingSandbox: "ਡਾਇਨਾਮਿਕ ਤਰਜੀਹ ਸੈਂਡਬਾਕਸ",
    sandboxDesc: "ਮੰਗ ਦੇ ਅਧਾਰ 'ਤੇ ਪ੍ਰਸਤਾਵਿਤ ਪ੍ਰੋਜੈਕਟਾਂ ਨੂੰ ਆਪਣੇ ਆਪ ਰੈਂਕ ਦੇਣ ਲਈ ਤਰਜੀਹਾਂ ਬਦਲੋ:",
    sliderDemand: "ਨਾਗਰਿਕ ਮੰਗ ਦੀ ਘਣਤਾ",
    sliderGap: "ਬੁਨਿਆਦੀ ਢਾਂਚੇ ਦੀ ਘਾਟ",
    sliderDemo: "ਜਨਸੰਖਿਆ ਲੋੜਾਂ",
    sliderCost: "ਲਾਗਤ-ਤੋਂ-ਲਾਭ ਕੁਸ਼ਲਤਾ",
    rankedProjects: "ਰੈਂਕ ਕੀਤੇ ਵਿਕਾਸ ਪ੍ਰਸਤਾਵ",
    generateReport: "AI ਨਾਗਰਿਕ ਪ੍ਰਸਤਾਵ ਨਿਰਮਾਤਾ",
    customFocus: "ਵਾਧੂ ਨਾਗਰਿਕ ਦਿਸ਼ਾ-ਨਿਰਦੇਸ਼ (ਵਿਕਲਪਿਕ)",
    customFocusPlaceholder: "ਜਿਵੇਂ ਕਿ, ਸਥਾਨਕ ਨੌਜਵਾਨਾਂ ਨੂੰ ਰੁਜ਼ਗਾਰ, ਤੇਜ਼ ਵਾਤਾਵਰਣ ਮਨਜ਼ੂਰੀ...",
    selectLanguage: "ਰਿਪੋਰਟ ਦੀ ਭਾਸ਼า",
    demographics: "ਖੇਤਰ ਦੀ ਜਨਸੰਖਿਆ ਜਾਣਕਾਰੀ",
    population: "ਆਬਾਦੀ",
    income: "ਔਸਤ ਆਮਦਨ",
    elderlyRatio: "ਬਜ਼ੁਰਗਾਂ ਦੀ ਆਬਾਦੀ",
    studentRatio: "ਵਿਦਿਆਰਥੀਆਂ ਦਾ ਅਨੁਪਾਤ",
    infraDeficit: "ਬੁਨਿਆਦੀ ਢਾਂਚੇ ਦੇ ਘਾਟੇ ਦੇ ਮੈਟ੍ਰਿਕਸ",
    schools: "ਸਕੂਲਾਂ ਦੀ ਘਾਟ",
    clinics: "ਸਿਹਤ ਕਲੀਨਿਕਾਂ ਦੀ ਘਾਟ",
    waterAccess: "ਪਾਣੀ ਦੀ ਘਾਟ (% ਬਿਨਾਂ ਪਾਈਪ ਕਵਰੇਜ)",
    roadQuality: "ਸੜਕ ਆਵਾਜਾਈ ਦੀ ਘਾਟ",
    activeFeed: "ਸੰਯੁਕਤ ਨਾਗਰਿਕ ਸ਼ਿਕਾਇਤ ਫੀਡ",
    category: "ਸ਼੍ਰੇਣੀ",
    urgency: "AI ਤਰਜੀਹ",
    actionStatus: "ਸਥਿਤੀ ਕਾਰਵਾਈ",
    original: "ਮੂਲ ਸੁਨੇਹਾ",
    aiTranslation: "AI ਅੰਗਰੇਜ਼ੀ ਅਨੁਵਾਦ",
    aiSummary: "AI-ਦੁਆਰਾ ਤਿਆਰ ਕੀਤਾ ਸਾਰਾਂਸ਼",
    impactScale: "ਸੰਭਾਵਤ ਪ੍ਰਭਾਵਿਤ ਨਾਗਰਿਕ",
    officialReport: "ਅਧਿਕਾਰਤ ਵਿਧਾਨਕ ਵਿਕਾਸ ਪ੍ਰਸਤਾਵ",
    printingReport: "ਜੈਮਿਨੀ ਦੁਆਰਾ ਪ੍ਰਸਤਾਵ ਤਿਆਰ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...",
    generateReportBtn: "ਵਿਕਾਸ ਪ੍ਰਸਤਾਵ ਤਿਆਰ ਕਰੋ",
    liveFeedLabel: "ਲਾਈਵ ਸਿਸਟਮ ਫੀਡ",
    liveFeedMsg1: "ਨਾਗਰਿਕ ਵਿਕਾਸ ਪੋਰਟਲ: ਸਵੈਚਾਲਿਤ ਨਾਗਰਿਕ ਮੰਗ ਪ੍ਰਾਪਤੀ ਅਤੇ ਸਿਸਟਮ ਦੁਭਾਸ਼ੀਆ ਲਾਈਵ",
    liveFeedMsg2: "ਆਵਾਜ਼ ਅਤੇ ਡਿਜੀਟਲ ਚਿੱਤਰਾਂ ਨੂੰ ਅਸਲ ਸਮੇਂ ਵਿੱਚ ਪਾਰਸ ਕਰਨ ਲਈ ਬਹੁ-ਭਾਸ਼ਾਈ ਸਹਾਇਤਾ ਉਪਲਬਧ",
    liveFeedMsg3: "ਰੀਅਲ-ਟਾਈਮ ਹਲਕਾ ਯੋਜਨਾਬੰਦੀ: ਲੋਕ ਮੰਗ + ਸਥਾਨਿਕ ਫੈਸਲੇ ਲੈਣ ਦੀ ਪ੍ਰਕਿਰਿਆ ਦਾ ਏਕੀਕਰਨ",
    liveFeedMsg4: "AI ਆਟੋ-ਸੰਖੇਪ ਅਤੇ ਪ੍ਰਸਤਾਵ ਡੈਸਕ ਹਲਕੇ ਦੇ ਖਰੜੇ ਨੂੰ ਸੁਰੱਖਿਅਤ ਢੰਗ ਨਾਲ ਤਿਆਰ ਕਰਦਾ ਹੈ",
    noSubmissions: "{city}, {state} ਲਈ ਵਰਤਮਾਨ ਵਿੱਚ ਕੋਈ ਸੁਝਾਅ ਦਰਜ ਨਹੀਂ ਹੈ।"
  },
  te: {
    title: "పౌరుల అభివృద్ధి పోర్టల్",
    subtitle: "ప్రజా డిమాండ్‌ను ప్రజాస్వామ్య ప్రణాళికతో ఏకీకృతం చేయడం",
    constituency: "తిరువనంతపురం నియోజకవర్గం",
    submitSuggestion: "కొత్త సూచనను సమర్పించండి",
    citizenName: "పౌరుడి పేరు",
    phoneOptional: "ఫోన్ నంబర్ (ఐచ్ఛికం)",
    selectArea: "ప్రాంతాన్ని ఎంచుకోండి",
    suggestionPlaceholder: "మీ సూచన లేదా ఫిర్యాదును వివరించండి (ఉదా. మాకు నీటి పైప్‌లైన్లు లేదా పాఠశాల నవీకరణలు అవసరం)...",
    submitBtn: "ఫిర్యాదును సమర్పించండి",
    processing: "AI విశ్లేషిస్తోంది...",
    submitting: "సమర్పిస్తోంది...",
    successMsg: "జెమిని AI తో సూచన విజయవంతంగా విశ్లేషించబడింది!",
    voiceNote: "వాయిస్ సూచన",
    recordStart: "రికార్డింగ్ ప్రారంభించండి",
    recordStop: "ఆపి విశ్లేషించండి",
    photoUpload: "ఫోటో అటాచ్‌మెంట్",
    photoDragDrop: "సమస్య యొక్క ఫోటోను ఇక్కడ లాగండి లేదా ఎంచుకోవడానికి క్లిక్ చేయండి",
    whatsAppSync: "వాట్సాప్ లైవ్ సింక్",
    whatsAppDesc: "పౌరులు వాట్సాప్ హెల్ప్‌లైన్ ద్వారా తక్షణమే సమస్యలను ఎలా సమర్పిస్తారో చూడండి",
    mpDashboard: "పౌరుల నిర్ణయ మద్దతు డాష్‌బోర్డ్",
    rankingSandbox: "డైనమిక్ ప్రాధాన్యత శాండ్‌బాక్స్",
    sandboxDesc: "ఆబ్జెక్టివ్ డిమాండ్ డేటా ఆధారంగా ప్రతిపాదిత ప్రాజెక్టులను స్వయంచాలకంగా ర్యాంక్ చేయడానికి ప్రాధాన్యతలను సర్దుబాటు చేయండి:",
    sliderDemand: "పౌరుల డిమాండ్ సాంద్రత",
    sliderGap: "సౌకర్యాల కొరత",
    sliderDemo: "జనాభా అవసరాలు",
    sliderCost: "ఖర్చు-ప్రయోజన సామర్థ్యం",
    rankedProjects: "ర్యాంక్ చేయబడిన అభివృద్ధి ప్రతిపాదనలు",
    generateReport: "AI పౌరుల నివేదిక బిల్డర్",
    customFocus: "అదనపు పౌరుల మార్గదర్శకాలు (ఐచ్ఛికం)",
    customFocusPlaceholder: "ఉదా. స్థానిక యువతకు ఉపాధి, వేగవంతమైన పర్యావరణ అనుమతి...",
    selectLanguage: "నివేదిక భాష",
    demographics: "నియోజకవర్గ జనాభా వివరాలు",
    population: "జనాభా",
    income: "సగటు ఆదాయం",
    elderlyRatio: "వృద్ధుల జనాభా",
    studentRatio: "విద్యార్థుల నిష్పత్తి",
    infraDeficit: "సౌకర్యాల కొరత కొలమానాలు",
    schools: "పాఠశాలల కొరత",
    clinics: "ఆరోగ్య క్లినిక్‌ల కొరత",
    waterAccess: "నీటి కొరత (% కవరేజ్ లేనిది)",
    roadQuality: "రోడ్డు రవాణా కొరత",
    activeFeed: "పౌరుల సూచనల ఫీడ్",
    category: "వర్గం",
    urgency: "AI అత్యవసరం",
    actionStatus: "స్థితి చర్య",
    original: "అసలు భాష",
    aiTranslation: "AI ఇంగ్లీష్ అనువాదం",
    aiSummary: "AI రూపొందించిన సారాంశం",
    impactScale: "ప్రభావితమయ్యే పౌరులు",
    officialReport: "అధికారిక అభివృద్ధి ప్రతిపాదన",
    printingReport: "జెమిని ద్వారా ప్రతిపాదన సిద్ధమవుతోంది...",
    generateReportBtn: "సిఫార్సు నివేదికను రూపొందించండి",
    liveFeedLabel: "లైవ్ సిస్టమ్ ఫీడ్",
    liveFeedMsg1: "పౌరుల అభివృద్ధి పోర్టల్: ఆటోమేటెడ్ సివిక్ డిమాండ్ ఇన్‌టేక్ & సిస్టమ్ ఇంటర్‌ప్రెటర్ లైవ్",
    liveFeedMsg2: "వాయిస్ & డిజిటల్ చిత్రాలను నిజ సమయంలో పార్సింగ్ చేయడానికి బహుభాషా మద్దతు ఉంది",
    liveFeedMsg3: "నిజ-సమయ నియోజకవర్గ ప్రణాళిక: ప్రజా డిమాండ్ + ప్రాspatial నిర్ణయ ప్రక్రియ సమన్వయం",
    liveFeedMsg4: "AI ఆటో-సారాంశం మరియు ప్రతిపాదన డెస్క్ నియోజకవర్గ ముసాయిదాలను సురક્ષితంగా రూపొందిస్తుంది",
    noSubmissions: "{city}, {state} కోసం ప్రస్తుతం ఎటువంటి సూచనలు నమోదు కాలేదు."
  }
};

const fallbacks: Record<string, string> = {
  ur: 'hi', as: 'hi', or: 'hi', sa: 'hi', ks: 'hi', ne: 'hi', sd: 'hi', kok: 'mr', doi: 'hi', mni: 'en', brx: 'hi', mai: 'hi', sat: 'hi'
};

export function getTranslation(langCode: string): TranslationDict {
  if (translations[langCode]) {
    return translations[langCode];
  }
  const fb = fallbacks[langCode];
  if (fb && translations[fb]) {
    return translations[fb];
  }
  return translations.en;
}
