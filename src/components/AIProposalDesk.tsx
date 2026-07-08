import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, Sparkles, Mic, Upload, Camera, Trash2, Download, X, 
  Play, Pause, Square, Loader2, Clock, CheckCircle2, Send, Eye, FileEdit, HelpCircle
} from 'lucide-react';
import jsPDF from 'jspdf';
import { motion, AnimatePresence } from 'motion/react';

interface AIProposalDeskProps {
  state: string;
  city: string;
  language: string;
  currentUser?: any;
  onProposalSubmitted?: () => void;
}

const deskTranslations: Record<string, any> = {
  en: {
    title: "PROPOSAL DESK",
    subtitle: "OFFICIAL LEGISLATIVE LOBBYING & CIVIC DRAFTS",
    originalTab: "Submit Original Proposal",
    aiTab: "AI Generated Proposal",
    successTitle: "Draft Filed Successfully",
    originalGuideTitle: "Direct Original Draft Submission:",
    originalGuideDesc: "Draft your own citizen proposal from scratch in the workspace. Upload supporting images and voice dictation, preview your document in our formal letter layout, and post it straight to the constituency grievance catalog.",
    aiGuideTitle: "Gemini AI Smart Draftsman:",
    aiGuideDesc: (city: string, state: string) => `Describe your local problem in basic points. The AI automatically compiles a legally structured formal legislative petition addressed to the MP of ${city} (${state}), inserting your details as the signatory, which you can customize and submit.`,
    draftLabel: "Draft Proposal Content (Write manually below)",
    describeLabel: "Describe Local Issue / Problem Points (For AI Draft generation)",
    draftPlaceholder: "To,\nMember of Parliament (MP),\n...\n\nState the development or civic proposal in a formal manner...",
    describePlaceholder: "E.g. The main bypass road has several massive potholes that cause massive traffic jams and accidents daily near the central school. We need urgent repaving and stormwater drainage...",
    photoEvidence: "Photo Evidence (Optional)",
    clickOrDrag: "Click or drag photos",
    visualProof: "Adds visual proof to document",
    voiceEvidence: "Voice Evidence / Dictation (Optional)",
    recordVoiceInput: "Record Voice Input",
    transcribesDirectly: "Transcribes directly into description",
    reviewVoice: "Review Recorded Note",
    aiTranscribing: "AI TRANSCRIBING...",
    compilingFormal: "COMPILING FORMAL PROPOSAL FOR MP...",
    generateFormal: "GENERATE FORMAL LEGISLATIVE PROPOSAL",
    aiDraftTitle: "AI Generated Draft (Editable)",
    downloadPdf: "DOWNLOAD PDF",
    editDraftHint: "✍️ Feel free to edit this formal draft directly",
    previewDraft: "PREVIEW DRAFT LAYOUT",
    submitToMp: "SUBMIT FINAL PROPOSAL TO MP",
    submittingPetition: "SUBMITTING PETITION...",
    officialPetitionReview: "OFFICIAL PETITION LAYOUT REVIEW",
    govInitiative: "Government MP Portal Initiative",
    citizenPetition: "CITIZEN DRIVEN CONSTITUENCY PETITION",
    refNo: "Ref No:",
    dateLabel: "Date:",
    toLabel: "To,",
    theMp: "The Member of Parliament (MP),",
    constituencyLabel: "Constituency,",
    subjectLabel: "Subject:",
    subjectText: (city: string) => `Formal petition regarding local development needs and civic problem resolution in ${city}`,
    supportingEvidence: "Supporting Evidence:",
    attachedPhotos: "Attached Photos:",
    attachedAudio: "Attached Audio:",
    voiceRecord: "Voice Record",
    noneLabel: "None",
    sincerelyYours: "Sincerely Yours,",
    anonymousCitizen: "Anonymous Citizen",
    telLabel: "Tel:",
    constituentOf: (city: string) => `Constituent of ${city}`,
    downloadPdfCopy: "Download PDF copy",
    returnToEditor: "Return to editor",
    confirmAndSubmit: "CONFIRM & SUBMIT TO MP",
    submittingLabel: "SUBMITTING...",
    micAccessRequired: "Microphone access is required to record voice notes.",
    emptyContentError: "Please describe the issue or record a voice note to let AI generate a proposal.",
    genFailError: "Failed to generate formal proposal. Please try again.",
    emptyProposalError: "Your proposal content is empty. Please enter text or generate a draft first.",
    emptySubmitError: "Cannot submit an empty proposal.",
    subSuccessPrefix: "Proposal successfully submitted to the Hon'ble MP of ",
    subSuccessSuffix: "! It has been posted to the live dispatch feed.",
    submitFailError: "Failed to submit proposal to MP Portal. Please try again."
  },
  ml: {
    title: "പ്രൊപ്പോസൽ ഡെസ്ക്",
    subtitle: "ഔദ്യോഗിക നിയമനിർമ്മാണ നിർദ്ദേശങ്ങളും ജനകീയ കരടുകളും",
    originalTab: "യഥാർത്ഥ നിർദ്ദേശം സമർപ്പിക്കുക",
    aiTab: "AI തയ്യാറാക്കിയ നിർദ്ദേശം",
    successTitle: "ഡ്രാഫ്റ്റ് വിജയകരമായി ഫയൽ ചെയ്തു",
    originalGuideTitle: "നേരിട്ടുള്ള ഒറിജിനൽ ഡ്രാഫ്റ്റ് സമർപ്പണം:",
    originalGuideDesc: "നിങ്ങളുടെ സ്വന്തം നിർദ്ദേശം ഇവിടെ എഴുതുക. ചിത്രങ്ങളും ശബ്ദ സന്ദേശങ്ങളും സമർപ്പിച്ച്, ഔദ്യോഗിക ഫോർമാറ്റിൽ പ്രിവ്യൂ കണ്ട് എംപി പോർട്ടലിലേക്ക് നേരിട്ട് സമർപ്പിക്കാം.",
    aiGuideTitle: "ജെമിനി AI സ്മാർട്ട് ഡ്രാഫ്റ്റ്‌സ്മാൻ:",
    aiGuideDesc: (city: string, state: string) => `നിങ്ങളുടെ പ്രാദേശിക പ്രശ്നം ലളിതമായി എഴുതുക. AI അത് നിയമപരമായി തിട്ടപ്പെടുത്തിയ ഒരു ഹർജിയായി രൂപപ്പെടുത്തി ${city} (${state}) ലെ എംപിക്കായി സമർപ്പിക്കും.`,
    draftLabel: "പ്രൊപ്പോസൽ ഉള്ളടക്കം (താഴെ എഴുതുക)",
    describeLabel: "പ്രാദേശിക പ്രശ്നങ്ങൾ വിശദീകരിക്കുക (AI നിർദ്ദേശം തയാറാക്കാൻ)",
    draftPlaceholder: "ബഹുമാനപ്പെട്ട പാർലമെന്റ് അംഗത്തിന് (എംപി),\n...\n\nനിങ്ങളുടെ വികസന നിർദ്ദേശം ഔദ്യോഗികമായി എഴുതുക...",
    describePlaceholder: "ഉദാഹരണത്തിന്: സ്കൂളിന് സമീപമുള്ള പ്രധാന റോഡിൽ വലിയ കുഴികളുള്ളതിനാൽ ദിവസവും ഗതാഗതക്കുരുക്കും അപകടങ്ങളും ഉണ്ടാകുന്നു. റോഡ് എത്രയും വേഗം റീടാറിംഗ് ചെയ്യണം...",
    photoEvidence: "ഫോട്ടോ തെളിവുകൾ (ഓപ്ഷണൽ)",
    clickOrDrag: "ഫോട്ടോകൾ തിരഞ്ഞെടുക്കുക അല്ലെങ്കിൽ ഡ്രാഗ് ചെയ്യുക",
    visualProof: "രേഖയ്ക്ക് ദൃശ്യമായ തെളിവ് നൽകുന്നു",
    voiceEvidence: "ശബ്ദ തെളിവുകൾ / നിർദ്ദേശം (ഓപ്ഷണൽ)",
    recordVoiceInput: "വോയ്സ് ഇൻപുട്ട് റെക്കോർഡ് ചെയ്യുക",
    transcribesDirectly: "നേരിട്ട് എഴുത്തിലേക്ക് പരിവർത്തനം ചെയ്യും",
    reviewVoice: "റെക്കോർഡ് ചെയ്ത ശബ്ദം കേൾക്കുക",
    aiTranscribing: "AI എഴുതുന്നു...",
    compilingFormal: "എംപിക്കായുള്ള ഔദ്യോഗിക ഡ്രാഫ്റ്റ് തയ്യാറാക്കുന്നു...",
    generateFormal: "ഔദ്യോഗിക വികസന നിർദ്ദേശം തയ്യാറാക്കുക",
    aiDraftTitle: "AI തയ്യാറാക്കിയ കരട് (തിരുത്താവുന്നതാണ്)",
    downloadPdf: "പിഡിഎഫ് ഡൗൺലോഡ് ചെയ്യുക",
    editDraftHint: "✍️ ഈ കരട് നിങ്ങൾക്ക് നേരിട്ട് തിരുത്താവുന്നതാണ്",
    previewDraft: "ഡ്രാഫ്റ്റ് പ്രിവ്യൂ കാണുക",
    submitToMp: "എംപിക്ക് സമർപ്പിക്കുക",
    submittingPetition: "ഹർജി സമർപ്പിക്കുന്നു...",
    officialPetitionReview: "ഔദ്യോഗിക ഹർജി പ്രിവ്യൂ",
    govInitiative: "ഗവൺമെന്റ് എംപി പോർട്ടൽ മുൻകൈ",
    citizenPetition: "പൗരൻമാർ സമർപ്പിക്കുന്ന ഹർജി",
    refNo: "റഫറൻസ് നമ്പർ:",
    dateLabel: "തീയതി:",
    toLabel: "സ്വീകർത്താവ്,",
    theMp: "ബഹുമാനപ്പെട്ട പാർലമെന്റ് അംഗം (എംപി),",
    constituencyLabel: "മണ്ഡലം,",
    subjectLabel: "വിഷയം:",
    subjectText: (city: string) => `${city} മണ്ഡലത്തിലെ വികസന ആവശ്യങ്ങളും ജനകീയ പ്രശ്നങ്ങളും പരിഹരിക്കുന്നത് സംബന്ധിച്ച്`,
    supportingEvidence: "തെളിവുകൾ:",
    attachedPhotos: "ചേർത്തിട്ടുള്ള ഫോട്ടോകൾ:",
    attachedAudio: "ചേർത്തിട്ടുള്ള ഓഡിയോ:",
    voiceRecord: "ശബ്ദ റെക്കോർഡ്",
    noneLabel: "ഒന്നുമില്ല",
    sincerelyYours: "വിശ്വസ്തതയോടെ,",
    anonymousCitizen: "പേര് വെളിപ്പെടുത്താത്ത പൗരൻ",
    telLabel: "ഫോൺ:",
    constituentOf: (city: string) => `${city} മണ്ഡലത്തിലെ വോട്ടർ`,
    downloadPdfCopy: "പിഡിഎഫ് ഡൗൺലോഡ് ചെയ്യുക",
    returnToEditor: "തിരികെ പോവുക",
    confirmAndSubmit: "ഉറപ്പിച്ചു സമർപ്പിക്കുക",
    submittingLabel: "സമർപ്പിക്കുന്നു...",
    micAccessRequired: "ശബ്ദം റെക്കോർഡ് ചെയ്യുന്നതിന് മൈക്രോഫോൺ അനുമതി ആവശ്യമാണ്.",
    emptyContentError: "AI വഴി നിർദ്ദേശം തയാറാക്കാൻ പ്രശ്നം വിശദീകരിക്കുകയോ ശബ്ദം നൽകുകയോ ചെയ്യുക.",
    genFailError: "ഔദ്യോഗിക ഹർജി തയാറാക്കാൻ സാധിച്ചില്ല. ദയവായി വീണ്ടും ശ്രമിക്കുക.",
    emptyProposalError: "നിർദ്ദേശം ശൂന്യമാണ്. ദയവായി എഴുതുകയോ കരട് തയ്യാറാക്കുകയോ ചെയ്യുക.",
    emptySubmitError: "ശൂന്യമായ ഹർജി സമർപ്പിക്കാൻ സാധ്യമല്ല.",
    subSuccessPrefix: "നിർദ്ദേശം വിജയകരമായി ബഹുമാനപ്പെട്ട ",
    subSuccessSuffix: " എംപിക്ക് സമർപ്പിച്ചു! ഇത് ലൈവ് ഫീഡിൽ കാണാവുന്നതാണ്.",
    submitFailError: "എംപി പോർട്ടലിലേക്ക് ഹർജി സമർപ്പിക്കാൻ കഴിഞ്ഞില്ല. വീണ്ടും ശ്രമിക്കുക."
  },
  hi: {
    title: "प्रस्ताव डेस्क",
    subtitle: "आधिकारिक विधायी पैरवी और नागरिक ड्राफ्ट",
    originalTab: "मूल प्रस्ताव प्रस्तुत करें",
    aiTab: "AI जनित प्रस्ताव",
    successTitle: "मस्यौदा सफलतापूर्वक दर्ज किया गया",
    originalGuideTitle: "सीधा मूल मस्यौदा प्रस्तुत करना:",
    originalGuideDesc: "कार्यक्षेत्र में अपना नागरिक प्रस्ताव खुद तैयार करें। सहायक चित्र और वॉयस डिक्टेशन अपलोड करें, औपचारिक पत्र लेआउट में अपने दस्तावेज़ का पूर्वावलोकन करें, और इसे सीधे निर्वाचन क्षेत्र शिकायत कैटलॉग में पोस्ट करें।",
    aiGuideTitle: "जेमिनी एआई स्मार्ट ड्राफ्ट्समैन:",
    aiGuideDesc: (city: string, state: string) => `मूल बिंदुओं में अपनी स्थानीय समस्या का वर्णन करें। AI स्वचालित रूप से ${city} (${state}) के सांसद को संबोधित एक कानूनी रूप से संरचित औपचारिक विधायी याचिका तैयार करता है।`,
    draftLabel: "प्रस्ताव की सामग्री (नीचे मैन्युअल रूप से लिखें)",
    describeLabel: "स्थानीय मुद्दे / समस्या बिंदुओं का वर्णन करें (AI ड्राफ्ट जनरेशन के लिए)",
    draftPlaceholder: "सेवा में,\nसांसद महोदय,\n...\n\nऔपचारिक तरीके से विकास या नागरिक प्रस्ताव बताएं...",
    describePlaceholder: "उदा. मुख्य बाईपास सड़क पर कई बड़े गड्ढे हैं जो प्रतिदिन केंद्रीय विद्यालय के पास भारी ट्रैफिक जाम और दुर्घटनाओं का कारण बनते हैं। तत्काल डामरीकरण की आवश्यकता है...",
    photoEvidence: "फोटो साक्ष्य (वैकल्पिक)",
    clickOrDrag: "फोटो क्लिक करें या खींचें",
    visualProof: "दस्तावेज़ में दृश्य प्रमाण जोड़ता है",
    voiceEvidence: "आवाज साक्ष्य / डिक्टेशन (वैकल्पिक)",
    recordVoiceInput: "आवाज रिकॉर्ड करें",
    transcribesDirectly: "सीधे विवरण में ट्रांसक्राइब करता है",
    reviewVoice: "रिकॉर्ड किए गए नोट की समीक्षा करें",
    aiTranscribing: "एआई ट्रांसक्राइबिंग...",
    compilingFormal: "सांसद के लिए औपचारिक प्रस्ताव संकलित किया जा रहा है...",
    generateFormal: "औपचारिक विधायी प्रस्ताव उत्पन्न करें",
    aiDraftTitle: "एआई जनित मसौदा (संपादन योग्य)",
    downloadPdf: "पीडीएफ डाउनलोड करें",
    editDraftHint: "✍️ इस औपचारिक मसौदे को सीधे संपादित करें",
    previewDraft: "पूर्वावलोकन लेआउट",
    submitToMp: "सांसद को अंतिम प्रस्ताव प्रस्तुत करें",
    submittingPetition: "याचिका प्रस्तुत की जा रही है...",
    officialPetitionReview: "आधिकारिक याचिका लेआउट समीक्षा",
    govInitiative: "सरकारी सांसद पोर्टल पहल",
    citizenPetition: "नागरिक संचालित निर्वाचन क्षेत्र याचिका",
    refNo: "संदर्भ संख्या:",
    dateLabel: "दिनांक:",
    toLabel: "सेवा में,",
    theMp: "माननीय सांसद महोदय,",
    constituencyLabel: "निर्वाचन क्षेत्र,",
    subjectLabel: "विषय:",
    subjectText: (city: string) => `${city} में स्थानीय विकास आवश्यकताओं और नागरिक समस्या समाधान के संबंध में औपचारिक याचिका`,
    supportingEvidence: "सहायक साक्ष्य:",
    attachedPhotos: "संलग्न तस्वीरें:",
    attachedAudio: "संलग्न ऑडियो:",
    voiceRecord: "वॉयस रिकॉर्ड",
    noneLabel: "कोई नहीं",
    sincerelyYours: "भवदीय,",
    anonymousCitizen: "अनाम नागरिक",
    telLabel: "दूरभाष:",
    constituentOf: (city: string) => `${city} के घटक`,
    downloadPdfCopy: "पीडीएफ कॉपी डाउनलोड करें",
    returnToEditor: "संपादक पर लौटें",
    confirmAndSubmit: "पुष्टि करें और सांसद को सबमिट करें",
    submittingLabel: "सबमिट किया जा रहा है...",
    micAccessRequired: "आवाज नोट्स रिकॉर्ड करने के लिए माइक्रोफोन एक्सेस आवश्यक है।",
    emptyContentError: "एआई को प्रस्ताव उत्पन्न करने के लिए कृपया समस्या का वर्णन करें या वॉयस नोट रिकॉर्ड करें।",
    genFailError: "औपचारिक प्रस्ताव उत्पन्न करने में विफल। कृपया पुन: प्रयास करें।",
    emptyProposalError: "आपकी प्रस्ताव सामग्री खाली है। कृपया पहले टेक्स्ट दर्ज करें या ड्राफ्ट जनरेट करें।",
    emptySubmitError: "खाली प्रस्ताव प्रस्तुत नहीं किया जा सकता।",
    subSuccessPrefix: "प्रस्ताव सफलतापूर्वक माननीय सांसद ",
    subSuccessSuffix: " को प्रस्तुत किया गया! इसे लाइव डिस्पैच फीड में पोस्ट कर दिया गया है।",
    submitFailError: "सांसद पोर्टल पर प्रस्ताव सबमिट करने में विफल। कृपया पुनः प्रयास करें।"
  },
  bn: {
    title: "প্রস্তাব ডেস্ক",
    subtitle: "অফিসিয়াল আইনি তদবির এবং নাগরিক ড্রাফট",
    originalTab: "মূল প্রস্তাব জমা দিন",
    aiTab: "AI দ্বারা তৈরিকৃত প্রস্তাব",
    successTitle: "খসড়া সফলভাবে দাখিল করা হয়েছে",
    originalGuideTitle: "সরাসরি মূল ড্রাফট জমা:",
    originalGuideDesc: "আপনার নিজের নাগরিক প্রস্তাব ড্রাফট করুন। সহায়ক ছবি এবং ভয়েস ডিক্টেশন আপলোড করুন, অফিশিয়াল লেটার লেআউটে পূর্বরূপ দেখুন এবং সরাসরি পোস্ট করুন।",
    aiGuideTitle: "জেমিনি এআই স্মার্ট ড্রাফটসম্যান:",
    aiGuideDesc: (city: string, state: string) => `আপনার স্থানীয় সমস্যা ব্যাখ্যা করুন। এআই স্বয়ংক্রিয়ভাবে ${city} (${state}) এর এমপির কাছে পেশ করার জন্য আইনি খসড়া তৈরি করে দেবে।`,
    draftLabel: "প্রস্তাব বিষয়বস্তু (নিচে লিখুন)",
    describeLabel: "স্থানীয় সমস্যা ব্যাখ্যা করুন (AI ড্রাফটের জন্য)",
    draftPlaceholder: "বরাবর,\nমাননীয় সংসদ সদস্য (এমপি),\n...\n\nআনুষ্ঠানিকভাবে আপনার উন্নয়ন প্রস্তাব লিখুন...",
    describePlaceholder: "উদা: স্কুল সংলগ্ন মূল বাইপাস রাস্তায় বড় বড় গর্ত রয়েছে, যার কারণে প্রতিনিয়ত যানজট ও দুর্ঘটনা ঘটছে। অবিলম্বে রাস্তা সংস্কার প্রয়োজন...",
    photoEvidence: "ছবি প্রমাণ (ঐচ্ছিক)",
    clickOrDrag: "ক্লিক করুন বা ছবি টেনে আনুন",
    visualProof: "নথিতে দৃশ্যমান প্রমাণ যুক্ত করে",
    voiceEvidence: "কণ্ঠ প্রমাণ / নির্দেশাবলী (ঐচ্ছিক)",
    recordVoiceInput: "ভয়েস রেকর্ড করুন",
    transcribesDirectly: "সরাসরি লেখায় রূপান্তরিত হবে",
    reviewVoice: "রেকর্ডকৃত ওডিও শুনুন",
    aiTranscribing: "এআই রূপান্তর করছে...",
    compilingFormal: "এমপির জন্য অফিশিয়াল প্রস্তাব সংকলন করা হচ্ছে...",
    generateFormal: "আনুষ্ঠানিক প্রস্তাব তৈরি করুন",
    aiDraftTitle: "এআই দ্বারা তৈরিকৃত খসড়া (সম্পাদনাযোগ্য)",
    downloadPdf: "পিডিএফ ডাউনলোড",
    editDraftHint: "✍️ এই অফিশিয়াল খসড়াটি সরাসরি সম্পাদনা করুন",
    previewDraft: "খসড়া লেআউট পূর্বরূপ",
    submitToMp: "এমপির কাছে চূড়ান্ত প্রস্তাব জমা দিন",
    submittingPetition: "আবেদন জমা দেওয়া হচ্ছে...",
    officialPetitionReview: "অফিসিয়াল আবেদন লেআউট পর্যালোচনা",
    govInitiative: "সরকারি এমপি পোর্টাল উদ্যোগ",
    citizenPetition: "নাগরিক চালিত নির্বাচনী এলাকা পিটিশন",
    refNo: "রেফারেন্স নং:",
    dateLabel: "তারিখ:",
    toLabel: "বরাবর,",
    theMp: "মাননীয় সংসদ সদস্য (এমপি),",
    constituencyLabel: "নির্বাচনী এলাকা,",
    subjectLabel: "বিষয়:",
    subjectText: (city: string) => `${city}-তে স্থানীয় উন্নয়ন ও নাগরিক সমস্যা সমাধানের জন্য অফিশিয়াল পিটিশন`,
    supportingEvidence: "সহায়ক প্রমাণ:",
    attachedPhotos: "সংযুক্ত ছবি:",
    attachedAudio: "সংযুক্ত অডিও:",
    voiceRecord: "ভয়েস রেকর্ড",
    noneLabel: "নেই",
    sincerelyYours: "বিনীত,",
    anonymousCitizen: "বেনামী নাগরিক",
    telLabel: "ফোন:",
    constituentOf: (city: string) => `${city}-এর ভোটার`,
    downloadPdfCopy: "পিডিএফ কপি ডাউনলোড করুন",
    returnToEditor: "সম্পাদকে ফিরে যান",
    confirmAndSubmit: "নিশ্চিত করুন এবং এমপির কাছে জমা দিন",
    submittingLabel: "জমা দেওয়া হচ্ছে...",
    micAccessRequired: "ভয়েস নোট রেকর্ড করার জন্য মাইক্রোফোন অ্যাক্সেস প্রয়োজন।",
    emptyContentError: "এআই প্রস্তাব তৈরি করার জন্য সমস্যা ব্যাখ্যা করুন বা ভয়েস নোট রেকর্ড করুন।",
    genFailError: "আনুষ্ঠানিক প্রস্তাব তৈরি করা যায়নি। আবার চেষ্টা করুন।",
    emptyProposalError: "আপনার প্রস্তাবটি খালি। দয়া করে কিছু লিখুন বা খসড়া তৈরি করুন।",
    emptySubmitError: "খালি প্রস্তাব জমা দেওয়া যাবে না।",
    subSuccessPrefix: "প্রস্তাবটি সফলভাবে মাননীয় এমপির কার্যালয় ",
    subSuccessSuffix: "-এ জমা দেওয়া হয়েছে! এটি লাইভ ফিডে যুক্ত হয়েছে।",
    submitFailError: "এমপি পোর্টালে প্রস্তাব জমা দেওয়া যায়নি। আবার চেষ্টা করুন।"
  },
  pa: {
    title: "ਪ੍ਰਸਤਾਵ ਡੈਸਕ",
    subtitle: "ਅਧਿਕਾਰਤ ਵਿਧਾਨਕ ਲਾਬਿੰਗ ਅਤੇ ਨਾਗਰਿਕ ਡਰਾਫਟ",
    originalTab: "ਮੂਲ ਪ੍ਰਸਤਾਵ ਜਮ੍ਹਾਂ ਕਰੋ",
    aiTab: "AI ਜਨਿਤ ਪ੍ਰਸਤਾਵ",
    successTitle: "ਡਰਾਫਟ ਸਫਲਤਾਪੂਰਵਕ ਦਰਜ ਕੀਤਾ ਗਿਆ",
    originalGuideTitle: "ਸਿੱਧਾ ਮੂਲ ਡਰਾਫਟ ਜਮ੍ਹਾਂ ਕਰਨਾ:",
    originalGuideDesc: "ਆਪਣਾ ਨਾਗਰਿਕ ਪ੍ਰਸਤਾਵ ਖੁਦ ਤਿਆਰ ਕਰੋ। ਸਹਾਇਕ ਤਸਵੀਰਾਂ ਅਤੇ ਵੌਇਸ ਡਿਕਟੇਸ਼ਨ ਅਪਲੋਡ ਕਰੋ, ਰਸਮੀ ਪੱਤਰ ਲੇਆਉਟ ਵਿੱਚ ਆਪਣੇ ਦਸਤਾਵੇਜ਼ ਦਾ ਪੂਰਵਦਰਸ਼ਨ ਕਰੋ, ਅਤੇ ਇਸਨੂੰ ਸਿੱਧਾ ਜਮ੍ਹਾਂ ਕਰੋ।",
    aiGuideTitle: "ਜੇਮਿਨੀ ਏਆਈ ਸਮਾਰਟ ਡਰਾਫਟਸਮੈਨ:",
    aiGuideDesc: (city: string, state: string) => `ਆਪਣੀ ਸਥਾਨਕ ਸਮੱਸਿਆ ਦਾ ਵਰਣਨ ਕਰੋ। AI ਆਪਣੇ ਆਪ ਹੀ ${city} (${state}) ਦੇ ਸੰਸਦ ਮੈਂਬਰ (MP) ਨੂੰ ਸੰਬੋਧਿਤ ਇੱਕ ਕਾਨੂੰਨੀ ਤੌਰ 'ਤੇ ਰਸਮੀ ਪਟੀਸ਼ਨ ਤਿਆਰ ਕਰਦਾ ਹੈ।`,
    draftLabel: "ਪ੍ਰਸਤਾਵ ਦੀ ਸਮੱਗਰੀ (ਹੇਠਾਂ ਹੱਥੀਂ ਲਿਖੋ)",
    describeLabel: "ਸਥਾਨਕ ਸਮੱਸਿਆ ਦੇ ਮੁੱਖ ਬਿੰਦੂ ਦੱਸੋ (AI ਡਰਾਫਟ ਲਈ)",
    draftPlaceholder: "ਸੇਵਾ ਵਿਖੇ,\nਸੰਸਦ ਮੈਂਬਰ (MP) ਸਾਹਿਬ,\n...\n\nਰਸਮੀ ਤਰੀਕੇ ਨਾਲ ਵਿਕਾਸ ਜਾਂ ਨਾਗਰਿਕ ਪ੍ਰਸਤਾਵ ਦੱਸੋ...",
    describePlaceholder: "ਉਦਾਹਰਨ ਲਈ: ਮੁੱਖ ਬਾਈਪਾਸ ਰੋਡ 'ਤੇ ਕਈ ਵੱਡੇ ਟੋਏ ਹਨ ਜੋ ਰੋਜ਼ਾਨਾ ਭਾਰੀ ਟ੍ਰੈਫਿਕ ਜਾਮ ਅਤੇ ਹਾਦਸਿਆਂ ਦਾ ਕਾਰਨ ਬਣਦੇ ਹਨ। ਤੁਰੰਤ ਸੜਕ ਬਣਾਉਣ ਦੀ ਲੋੜ ਹੈ...",
    photoEvidence: "ਤਸਵੀਰ ਸਬੂਤ (ਵਿਕਲਪਿਕ)",
    clickOrDrag: "ਤਸਵੀਰਾਂ ਕਲਿੱਕ ਕਰੋ ਜਾਂ ਖਿੱਚੋ",
    visualProof: "ਦਸਤਾਵੇਜ਼ ਵਿੱਚ ਦ੍ਰਿਸ਼ਟੀਗਤ ਸਬੂਤ ਜੋੜਦਾ ਹੈ",
    voiceEvidence: "ਆਵਾਜ਼ ਸਬੂਤ / ਡਿਕਟੇਸ਼ਨ (ਵਿਕਲਪਿਕ)",
    recordVoiceInput: "ਆਵਾਜ਼ ਰਿਕਾਰਡ ਕਰੋ",
    transcribesDirectly: "ਸਿੱਧੇ ਵੇਰਵੇ ਵਿੱਚ ਅਨੁਵਾਦ ਕਰਦਾ ਹੈ",
    reviewVoice: "ਰਿਕਾਰਡ ਕੀਤੇ ਨੋਟ ਦੀ ਸਮੀਖਿਆ ਕਰੋ",
    aiTranscribing: "ਏਆਈ ਟ੍ਰਾਂਸਕ੍ਰਾਈਬਿੰਗ...",
    compilingFormal: "ਸੰਸਦ ਮੈਂਬਰ ਲਈ ਰਸਮੀ ਪ੍ਰਸਤਾਵ ਤਿਆਰ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...",
    generateFormal: "ਰਸਮੀ ਵਿਧਾਨਕ ਪ੍ਰਸਤਾਵ ਤਿਆਰ ਕਰੋ",
    aiDraftTitle: "ਏਆਈ ਜਨਿਤ ਡਰਾਫਟ (ਸੋਧਣ ਯੋਗ)",
    downloadPdf: "PDF ਡਾਊਨਲੋਡ ਕਰੋ",
    editDraftHint: "✍️ ਇਸ ਰਸਮੀ ਡਰਾਫਟ ਨੂੰ ਸਿੱਧਾ ਸੋਧੋ",
    previewDraft: "ਪੂਰਵਦਰਸ਼ਨ ਲੇਆਉਟ",
    submitToMp: "ਸੰਸਦ ਮੈਂਬਰ ਨੂੰ ਅੰਤਿਮ ਪ੍ਰਸਤਾਵ ਭੇਜੋ",
    submittingPetition: "ਪਟੀਸ਼ਨ ਭੇਜੀ ਜਾ ਰਹੀ ਹੈ...",
    officialPetitionReview: "ਅਧਿਕਾਰਤ ਪਟੀਸ਼ਨ ਲੇਆਉਟ ਸਮੀਖਿਆ",
    govInitiative: "ਸਰਕਾਰੀ ਐਮਪੀ ਪੋਰਟਲ ਪਹਿਲਕਦਮੀ",
    citizenPetition: "ਨਾਗਰਿਕ ਸੰਚਾਲਿਤ ਹਲਕਾ ਪਟੀਸ਼ਨ",
    refNo: "ਹਵਾਲਾ ਨੰਬਰ:",
    dateLabel: "ਮਿਤੀ:",
    toLabel: "ਸੇਵਾ ਵਿਖੇ,",
    theMp: "ਮਾਨਯੋਗ ਸੰਸਦ ਮੈਂਬਰ (MP),",
    constituencyLabel: "ਹਲਕਾ,",
    subjectLabel: "ਵਿਸ਼ਾ:",
    subjectText: (city: string) => `${city} ਵਿੱਚ ਸਥਾਨਕ ਵਿਕਾਸ ਲੋੜਾਂ ਅਤੇ ਸਮੱਸਿਆਵਾਂ ਦੇ ਹੱਲ ਲਈ ਰਸਮੀ ਪਟੀਸ਼ਨ`,
    supportingEvidence: "ਸਹਾਇਕ ਸਬੂਤ:",
    attachedPhotos: "ਨਾਲ ਨੱਥੀ ਤਸਵੀਰਾਂ:",
    attachedAudio: "ਨਾਲ ਨੱਥੀ ਆਡੀਓ:",
    voiceRecord: "ਆਵਾਜ਼ ਰਿਕਾਰਡ",
    noneLabel: "ਕੋਈ ਨਹੀਂ",
    sincerelyYours: "ਆਪ ਜੀ ਦਾ ਵਿਸ਼ਵਾਸਪਾਤਰ,",
    anonymousCitizen: "ਗੁਮਨਾਮ ਨਾਗਰਿਕ",
    telLabel: "ਫ਼ੋਨ:",
    constituentOf: (city: string) => `${city} ਦਾ ਨਿਵਾਸੀ`,
    downloadPdfCopy: "PDF ਕਾਪੀ ਡਾਊਨਲੋਡ ਕਰੋ",
    returnToEditor: "ਸੰਪਾਦਕ 'ਤੇ ਵਾਪਸ ਜਾਓ",
    confirmAndSubmit: "ਪੁਸ਼ਟੀ ਕਰੋ ਅਤੇ ਸੰਸਦ ਮੈਂਬਰ ਨੂੰ ਭੇਜੋ",
    submittingLabel: "ਭੇਜਿਆ ਜਾ ਰਿਹਾ ਹੈ...",
    micAccessRequired: "ਆਵਾਜ਼ ਨੋਟਸ ਰਿਕਾਰਡ ਕਰਨ ਲਈ ਮਾਈਕ੍ਰੋਫੋਨ ਦੀ ਇਜਾਜ਼ਤ ਲੋੜੀਂਦੀ ਹੈ।",
    emptyContentError: "ਏਆਈ ਦੁਆਰਾ ਪ੍ਰਸਤਾਵ ਤਿਆਰ ਕਰਨ ਲਈ ਕਿਰਪਾ ਕਰਕੇ ਸਮੱਸਿਆ ਦਾ ਵਰਣਨ ਕਰੋ ਜਾਂ ਆਵਾਜ਼ ਰਿਕਾਰਡ ਕਰੋ।",
    genFailError: "ਰਸਮੀ ਪ੍ਰਸਤਾਵ ਤਿਆਰ ਕਰਨ ਵਿੱਚ ਅਸਫਲ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
    emptyProposalError: "ਤੁਹਾਡਾ ਪ੍ਰਸਤਾਵ ਖਾਲੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਪਹਿਲਾਂ ਲਿਖੋ ਜਾਂ ਡਰਾਫਟ ਤਿਆਰ ਕਰੋ।",
    emptySubmitError: "ਖਾਲੀ ਪ੍ਰਸਤਾਵ ਭੇਜਿਆ ਨਹੀਂ ਜਾ ਸਕਦਾ।",
    subSuccessPrefix: "ਪ੍ਰਸਤਾਵ ਸਫਲਤਾਪੂਰਵਕ ਮਾਨਯੋਗ ਸੰਸਦ ਮੈਂਬਰ ",
    subSuccessSuffix: " ਨੂੰ ਭੇਜਿਆ ਗਿਆ! ਇਹ ਲਾਈਵ ਫੀਡ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋ ਗਿਆ ਹੈ।",
    submitFailError: "ਪੋਰਟਲ 'ਤੇ ਪ੍ਰਸਤਾਵ ਭੇਜਣ ਵਿੱਚ ਅਸਫਲ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।"
  },
  te: {
    title: "ప్రతిపాదన డెస్క్",
    subtitle: "అధికారిక శాసన లాబీయింగ్ & పౌర డ్రాఫ్ట్‌లు",
    originalTab: "అసలు ప్రతిపాదనను సమర్పించండి",
    aiTab: "AI రూపొందించిన ప్రతిపాదన",
    successTitle: "డ్రాఫ్ట్ విజయవంతంగా దాఖలైంది",
    originalGuideTitle: "నేరుగా అసలు డ్రాఫ్ట్ సమర్పణ:",
    originalGuideDesc: "మీ స్వంత పౌర ప్రతిపాదనను ఇక్కడ రాయండి. సహాయక చిత్రాలు మరియు వాయిస్ రికార్డింగ్‌ను అప్‌లోడ్ చేయండి, అధికారిక లేఖ లేఅవుట్‌లో మీ పత్రాన్ని ప్రివ్యూ చేయండి మరియు నేరుగా పంపండి.",
    aiGuideTitle: "గెమిని AI స్మార్ట్ డ్రాఫ్ట్స్‌మన్:",
    aiGuideDesc: (city: string, state: string) => `మీ స్థానిక సమస్యను సాధారణ పాయింట్లలో వివరించండి. ${city} (${state}) ఎంపీ గారికి సమర్పించడానికి AI స్వయంచాలకంగా ఒక అధికారిక పిటిషన్‌ను తయారు చేస్తుంది.`,
    draftLabel: "ప్రతిపాదన విషయాలు (క్రింద రాయండి)",
    describeLabel: "స్థానిక సమస్యలను వివరించండి (AI డ్రాఫ్ట్ జనరేషన్ కోసం)",
    draftPlaceholder: "గౌరవనీయులైన పార్లమెంటు సభ్యునికి (MP),\n...\n\nమీ ప్రతిపాదనను అధికారిక పద్ధతిలో రాయండి...",
    describePlaceholder: "ఉదా: పాఠశాల సమీపంలోని బైపాస్ రోడ్డుపై పెద్ద గుంతలు పడటం వల్ల నిత్యం ట్రాఫిక్ జామ్, ప్రమాదాలు జరుగుతున్నాయి. రోడ్డు మరమ్మతులు చేయాలి...",
    photoEvidence: "ఫోటో సాక్ష్యం (ఐచ్ఛికం)",
    clickOrDrag: "ఫోటోలపై క్లిక్ చేయండి లేదా డ్రాగ్ చేయండి",
    visualProof: "పత్రానికి దృశ్యమాన రుజువును జోడిస్తుంది",
    voiceEvidence: "వాయిస్ సాక్ష్యం / నిర్దేశం (ఐచ్ఛికం)",
    recordVoiceInput: "వాయిస్ ఇన్‌పుట్ రికార్డ్ చేయండి",
    transcribesDirectly: "నేరుగా వచనంలోకి మారుస్తుంది",
    reviewVoice: "రికార్డ్ చేసిన ఆడియోను వినండి",
    aiTranscribing: "AI వచనంలోకి మారుస్తోంది...",
    compilingFormal: "ఎంపీ గారి కోసం అధికారిక ప్రతిపాదనను సిద్ధం చేస్తోంది...",
    generateFormal: "అధికారిక ప్రతిపాదనను రూపొందించండి",
    aiDraftTitle: "AI రూపొందించిన డ్రాఫ్ట్ (సవరించవచ్చు)",
    downloadPdf: "PDF డౌన్‌లోడ్",
    editDraftHint: "✍️ ఈ అధికారిక డ్రాఫ్ట్‌ను నేరుగా సవరించవచ్చు",
    previewDraft: "ప్రివ్యూ లేఅవుట్",
    submitToMp: "ఎంపీ గారికి తుది ప్రతిపాదనను సమర్పించండి",
    submittingPetition: "పిటిషన్ సమర్పిస్తోంది...",
    officialPetitionReview: "అధికారిక పిటిషన్ లేఅవుట్ సమీక్ష",
    govInitiative: "ప్రభుత్వ ఎంపీ పోర్టల్ చొరవ",
    citizenPetition: "పౌర ఆధారిత నియోజకవర్గ పిటిషన్",
    refNo: "రెఫరెన్స్ నంబర్:",
    dateLabel: "తేదీ:",
    toLabel: "గౌరవనీయులైన,",
    theMp: "పార్లమెంటు సభ్యుడు (MP) గారికి,",
    constituencyLabel: "నియోజకవర్గం,",
    subjectLabel: "విషయం:",
    subjectText: (city: string) => `${city}-లో స్థానిక అభివృద్ధి అవసరాలు మరియు పౌర సమస్యల పరిష్కారం కోసం అధికారిక పిటిషన్`,
    supportingEvidence: "సహాయక సాక్ష్యం:",
    attachedPhotos: "జతపరచిన ఫోటోలు:",
    attachedAudio: "జతపరచిన ఆడియో:",
    voiceRecord: "వాయిస్ రికార్డ్",
    noneLabel: "ఏదీ లేదు",
    sincerelyYours: "భవదీయుడు/భవదీయురాలూ,",
    anonymousCitizen: "పేరు లేని పౌరుడు",
    telLabel: "ఫోన్:",
    constituentOf: (city: string) => `${city} నియోజకవర్గ ఓటరు`,
    downloadPdfCopy: "PDF కాపీని డౌన్‌లోడ్ చేయండి",
    returnToEditor: "మళ్ళీ ఎడిటర్ కి వెళ్ళండి",
    confirmAndSubmit: "ధృవీకరించి ఎంపీ గారికి సమర్పించండి",
    submittingLabel: "సమర్పిస్తోంది...",
    micAccessRequired: "వాయిస్ నోట్ రికార్డ్ చేయడానికి మైక్రోఫోన్ అనుమతి అవసరం.",
    emptyContentError: "AI ప్రతిపాదనను రూపొందించడానికి దయచేసి సమస్యను వివరించండి లేదా వాయిస్ రికార్డ్ చేయండి.",
    genFailError: "అధికారిక ప్రతిపాదనను రూపొందించడం విఫలమైంది. దయచేసి మళ్లీ ప్రయత్నించండి.",
    emptyProposalError: "మీ ప్రతిపాదన ఖాళీగా ఉంది. దయచేసి టెక్స్ట్ రాయండి లేదా డ్రాఫ్ట్ జనరేట్ చేయండి.",
    emptySubmitError: "ఖాళీగా ఉన్న ప్రతిపాదనను సమర్పించలేరు.",
    subSuccessPrefix: "ప్రతిపాదన విజయవంతంగా గౌరవనీయులైన ",
    subSuccessSuffix: " ఎంపీ గారికి సమర్పించబడింది! ఇది లైవ్ ఫీడ్‌లో చేర్చబడింది.",
    submitFailError: "పోర్టల్‌కు ప్రతిపాదనను సమర్పించడం విఫలమైంది. మళ్లీ ప్రయత్నించండి."
  },
  ta: {
    title: "முன்மொழிவு மேசை",
    subtitle: "அதிகாரப்பூர்வ சட்டமன்ற பரப்புரை மற்றும் குடிமக்கள் வரைவுகள்",
    originalTab: "அசல் முன்மொழிவை சமர்ப்பிக்கவும்",
    aiTab: "AI உருவாக்கிய முன்மொழிவு",
    successTitle: "வரைவு வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது",
    originalGuideTitle: "நேரடி அசல் வரைவு சமர்ப்பிப்பு:",
    originalGuideDesc: "உங்களது சொந்த முன்மொழிவை இங்கே எழுதுங்கள். புகைப்படங்கள் மற்றும் குரல் பதிவை பதிவேற்றி, அதிகாரப்பூர்வ கடித வடிவில் மாதிரியைப் பார்த்து நேரடியாக அனுப்பலாம்.",
    aiGuideTitle: "ஜெமினி AI ஸ்மார்ட் வரைவாளர்:",
    aiGuideDesc: (city: string, state: string) => `உங்கள் உள்ளூர் பிரச்சனையை எளிய புள்ளிகளில் விவரிக்கவும். ${city} (${state}) எம்பிக்கு சமர்ப்பிக்க சட்டப்பூர்வமான ஒரு மனுவை AI தானாகவே தயார் செய்யும்.`,
    draftLabel: "முன்மொழிவு உள்ளடக்கம் (கீழே எழுதவும்)",
    describeLabel: "உள்ளூர் பிரச்சினைகளை விவரிக்கவும் (AI வரைவு உருவாக்கத்திற்காக)",
    draftPlaceholder: "மதிப்பிற்குரிய நாடாளுமன்ற உறுப்பினர் (எம்பி) அவர்களுக்கு,\n...\n\nமுன்மொழிவை அதிகாரப்பூர்வ முறையில் எழுதவும்...",
    describePlaceholder: "எ.கா: பள்ளிக்கு அருகிலுள்ள முக்கிய சாலையில் பெரிய பள்ளங்கள் உள்ளன, இதனால் தினமும் போக்குவரத்து நெரிசலும் விபத்துகளும் ஏற்படுகின்றன. சாலை சீரமைப்பு உடனடியாக தேவை...",
    photoEvidence: "புகைப்பட சான்று (விருப்பத்திற்குரியது)",
    clickOrDrag: "புகைப்படங்களை கிளிக் செய்யவும் அல்லது இழுக்கவும்",
    visualProof: "ஆவணத்திற்கு காட்சி ஆதாரத்தை சேர்க்கிறது",
    voiceEvidence: "குரல் சான்று / அறிவுறுத்தல் (விருப்பத்திற்குரியது)",
    recordVoiceInput: "குரல் பதிவை தொடங்கவும்",
    transcribesDirectly: "நேரடியாக உரையாக மாற்றப்படும்",
    reviewVoice: "பதிவு செய்யப்பட்ட ஆடியோவைக் கேட்கவும்",
    aiTranscribing: "AI உரையாக மாற்றுகிறது...",
    compilingFormal: "நாடாளுமன்ற உறுப்பினருக்கான அதிகாரப்பூர்வ வரைவைத் தயாரிக்கிறது...",
    generateFormal: "அதிகாரப்பூர்வ முன்மொழிவை உருவாக்கு",
    aiDraftTitle: "AI உருவாக்கிய வரைவு (திருத்தக்கூடியது)",
    downloadPdf: "PDF பதிவிறக்கம்",
    editDraftHint: "✍️ இந்த வரைவை நீங்கள் நேரடியாக திருத்தலாம்",
    previewDraft: "வரைவு மாதிரியைப் பார்",
    submitToMp: "நாடாளுமன்ற உறுப்பினருக்கு இறுதி முன்மொழிவை அனுப்புக",
    submittingPetition: "மனு சமர்ப்பிக்கப்படுகிறது...",
    officialPetitionReview: "அதிகாரப்பூர்வ மனு மாதிரி ஆய்வு",
    govInitiative: "அரசு எம்பி போர்டல் முயற்சி",
    citizenPetition: "குடிமக்கள் தொகுதி மனு",
    refNo: "குறிப்பு எண்:",
    dateLabel: "தேதி:",
    toLabel: "பெறுநர்,",
    theMp: "மதிப்பிற்குரிய நாடாளுமன்ற உறுப்பினர் (எம்பி),",
    constituencyLabel: "தொகுதி,",
    subjectLabel: "பொருள்:",
    subjectText: (city: string) => `${city}-யில் உள்ளூர் வளர்ச்சித் தேவைகள் மற்றும் குடிமக்கள் பிரச்சினை தீர்வுக்கான அதிகாரப்பூர்வ மனு`,
    supportingEvidence: "ஆதாரங்கள்:",
    attachedPhotos: "இணைக்கப்பட்ட புகைப்படங்கள்:",
    attachedAudio: "இணைக்கப்பட்ட ஆடியோ:",
    voiceRecord: "குரல் பதிவு",
    noneLabel: "ஏதுமில்லை",
    sincerelyYours: "இப்படிக்கு,",
    anonymousCitizen: "பெயர் குறிப்பிடாத குடிமகன்",
    telLabel: "தொலைபேசி:",
    constituentOf: (city: string) => `${city} தொகுதி வாக்காளர்`,
    downloadPdfCopy: "PDF நகலை பதிவிறக்கவும்",
    returnToEditor: "திரும்பவும்",
    confirmAndSubmit: "உறுதி செய்து சமர்ப்பிக்கவும்",
    submittingLabel: "சமர்ப்பிக்கப்படுகிறது...",
    micAccessRequired: "குரல் குறிப்புகளை பதிவு செய்ய மைக்ரோஃபோன் அணுகல் தேவை.",
    emptyContentError: "AI முன்மொழிவை உருவாக்க பிரச்சினையை விவரிக்கவும் அல்லது குரல் பதிவு செய்யவும்.",
    genFailError: "அதிகாரப்பூர்வ வரைவை உருவாக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
    emptyProposalError: "முன்மொழிவு காலியாக உள்ளது. தயவுசெய்து எழுதவும் அல்லது வரைவை உருவாக்கவும்.",
    emptySubmitError: "காலியான முன்மொழிவை சமர்ப்பிக்க முடியாது.",
    subSuccessPrefix: "முன்மொழிவு வெற்றிகரமாக மதிப்பிற்குரிய ",
    subSuccessSuffix: " எம்பி அவர்களிடம் சமர்ப்பிக்கப்பட்டது! இது நேரடி பதிவில் சேர்க்கப்பட்டுள்ளது.",
    submitFailError: "போர்டலுக்கு முன்மொழிவை சமர்ப்பிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்."
  }
};

export const AIProposalDesk: React.FC<AIProposalDeskProps> = ({ 
  state, 
  city, 
  language = 'en', 
  currentUser,
  onProposalSubmitted
}) => {
  const t = deskTranslations[language] || deskTranslations['en'];

  // Option state: 'original' for user-written proposal, 'ai' for AI-generated proposal
  const [activeOption, setActiveOption] = useState<'original' | 'ai'>('original');
  
  // Inputs
  const [textInput, setTextInput] = useState(''); // Original text input or description
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [voiceData, setVoiceData] = useState<string | null>(null);
  const [voiceTranscription, setVoiceTranscription] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  
  // AI Generation States
  const [aiGeneratedDraft, setAiGeneratedDraft] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Preview and Submission States
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Recording State variables
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  
  // Audio playback variables
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [voicePlaybackDuration, setVoicePlaybackDuration] = useState(0);
  const [voicePlaybackCurrentTime, setVoicePlaybackCurrentTime] = useState(0);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<any>(null);

  // Clear states when user switches options
  useEffect(() => {
    setSubmissionSuccess(null);
    setError(null);
  }, [activeOption]);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file: File) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPhotoPreviews(prev => [...prev, reader.result as string]);
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files) {
      Array.from(files).forEach((file: File) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPhotoPreviews(prev => [...prev, reader.result as string]);
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const transcribeAudioBlob = async (blob: Blob) => {
    setIsTranscribing(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        try {
          const res = await fetch("/api/transcribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              audio: base64data,
              language: language,
              mimeType: blob.type
            }),
          });
          const data = await res.json();
          if (data.success && data.transcription) {
            setVoiceTranscription(data.transcription);
            setTextInput(prev => prev ? prev + "\n\n" + data.transcription : data.transcription);
          }
        } catch (err) {
          console.error("Transcription error:", err);
        } finally {
          setIsTranscribing(false);
        }
      };
    } catch (err) {
      console.error(err);
      setIsTranscribing(false);
    }
  };

  const startRecording = async () => {
    setVoiceData(null);
    setIsAudioPlaying(false);
    setVoicePlaybackCurrentTime(0);
    setVoicePlaybackDuration(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          setVoiceData(reader.result as string);
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach(track => track.stop());
        transcribeAudioBlob(audioBlob);
      };

      recorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Mic access denied:", err);
      setError(t.micAccessRequired);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    clearInterval(timerRef.current);
    setRecordingSeconds(0);
  };

  const handlePlayVoiceNote = () => {
    if (!voiceData) return;

    if (!audioPlayerRef.current || audioPlayerRef.current.src !== voiceData) {
      const audio = new Audio(voiceData);
      audioPlayerRef.current = audio;
      audio.onloadedmetadata = () => setVoicePlaybackDuration(audio.duration || 0);
      audio.ontimeupdate = () => setVoicePlaybackCurrentTime(audio.currentTime || 0);
      audio.onended = () => {
        setIsAudioPlaying(false);
        setVoicePlaybackCurrentTime(0);
      };
    }

    if (isAudioPlaying) {
      audioPlayerRef.current.pause();
      setIsAudioPlaying(false);
    } else {
      audioPlayerRef.current.play();
      setIsAudioPlaying(true);
    }
  };

  // Generate Formal AI Proposal
  const handleGenerateAIProposal = async () => {
    if (!textInput.trim() && !voiceData) {
      setError(t.emptyContentError);
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    setAiGeneratedDraft(null);

    try {
      const response = await fetch('/api/generate-proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state,
          city,
          problemText: textInput,
          language,
          photoData: photoPreviews[0], // pass first photo
          allPhotos: photoPreviews,
          voiceData,
          currentUser
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate proposal');
      }

      const data = await response.json();
      if (data.proposal) {
        setAiGeneratedDraft(data.proposal);
      } else {
        throw new Error("Empty proposal received from server");
      }
    } catch (err) {
      console.error(err);
      setError(t.genFailError);
    } finally {
      setIsGenerating(false);
    }
  };

  // Get current finalized text
  const getFinalizedText = () => {
    if (activeOption === 'ai') {
      return aiGeneratedDraft || '';
    } else {
      return textInput;
    }
  };

  // Trigger preview of proposal
  const handlePreview = () => {
    const text = getFinalizedText();
    if (!text.trim()) {
      setError(t.emptyProposalError);
      return;
    }
    setError(null);
    setShowPreview(true);
  };

  // Final submit to MP database (POST /api/submissions)
  const handleFinalSubmission = async () => {
    const proposalContent = getFinalizedText();
    if (!proposalContent.trim()) {
      setError(t.emptySubmitError);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const citizenName = currentUser 
        ? `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() 
        : t.anonymousCitizen;
      
      const citizenPhone = currentUser?.phone || '';

      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: citizenName,
          phone: citizenPhone,
          language: language,
          inputType: activeOption === 'ai' ? 'ai' : 'text',
          originalText: proposalContent,
          state: state,
          constituency: city,
          photoUrls: photoPreviews,
          audioUrl: voiceData,
          latitude: null,
          longitude: null,
          locationVerified: false,
          isProposal: true
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setSubmissionSuccess(`${t.subSuccessPrefix}${city}${t.subSuccessSuffix}`);
        setShowPreview(false);
        
        // Reset states
        setTextInput('');
        setAiGeneratedDraft(null);
        setPhotoPreviews([]);
        setVoiceData(null);
        setVoiceTranscription('');
        
        // Call parent trigger to update live feeds
        if (onProposalSubmitted) {
          onProposalSubmitted();
        }
      } else {
        throw new Error(data.error || "Submission endpoint returned error");
      }
    } catch (err) {
      console.error("Proposal submission error:", err);
      setError(t.submitFailError);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to download PDF of current finalized proposal
  const handleDownloadPDF = () => {
    const content = getFinalizedText();
    if (!content) return;
    
    const doc = new jsPDF();
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxWidth = pageWidth - (margin * 2);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    
    // Split text into lines for PDF
    const splitText = doc.splitTextToSize(content, maxWidth);
    
    let y = margin;
    const pageHeight = doc.internal.pageSize.getHeight();
    
    for (let i = 0; i < splitText.length; i++) {
      if (y > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(splitText[i], margin, y);
      y += 7;
    }
    
    doc.save(`MP_Proposal_${city.replace(/\s+/g, '_')}.pdf`);
  };

  const hasContent = getFinalizedText().trim().length > 0;

  return (
    <div id="proposal-desk" className="bg-slate-900/65 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 shadow-2xl space-y-6 animate-fade-in relative">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800/80 pb-4 gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-xl shadow-inner">
            <FileText className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-100 tracking-tight font-sans">{t.title}</h2>
            <span className="text-[9px] text-slate-400 font-mono font-bold tracking-wider block">{t.subtitle}</span>
          </div>
        </div>
        
        {/* OPTION SELECTOR TABS */}
        <div className="flex bg-slate-950 p-1 border border-slate-850 rounded-xl shadow-inner max-w-full overflow-x-auto">
          <button
            onClick={() => setActiveOption('original')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeOption === 'original'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-slate-100 shadow-md font-sans'
                : 'text-slate-400 hover:text-slate-200 font-sans'
            }`}
          >
            <FileEdit className="w-3.5 h-3.5" />
            <span>{t.originalTab}</span>
          </button>
          
          <button
            onClick={() => setActiveOption('ai')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeOption === 'ai'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-slate-100 shadow-md font-sans'
                : 'text-slate-400 hover:text-slate-200 font-sans'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.aiTab}</span>
          </button>
        </div>
      </div>

      {/* FEEDBACK STATUS ALERTS */}
      {error && (
        <div className="bg-rose-950/40 border border-rose-500/30 rounded-xl p-3 text-xs text-rose-350 font-sans leading-relaxed flex items-start gap-2 animate-fade-in">
          <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {submissionSuccess && (
        <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-4 text-xs text-emerald-350 font-sans leading-relaxed flex items-start gap-2.5 animate-fade-in shadow-md shadow-emerald-950/20">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-slate-100 block">{t.successTitle}</span>
            <span>{submissionSuccess}</span>
          </div>
        </div>
      )}

      {/* OPTION GUIDES */}
      <div className="bg-slate-950/45 border border-slate-850 rounded-xl p-3 flex gap-2.5 items-start">
        <HelpCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <div className="text-[11px] leading-relaxed text-slate-400 font-sans">
          {activeOption === 'original' ? (
            <p>
              <strong>{t.originalGuideTitle}</strong> {t.originalGuideDesc}
            </p>
          ) : (
            <p>
              <strong>{t.aiGuideTitle}</strong> {t.aiGuideDesc(city, state)}
            </p>
          )}
        </div>
      </div>

      {/* INPUT EDITOR OR DESCRIPTION AREA */}
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 font-mono">
            <FileText className="w-3.5 h-3.5 text-amber-500" />
            {activeOption === 'original' 
              ? t.draftLabel 
              : t.describeLabel}
          </label>
          
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder={activeOption === 'original' 
              ? t.draftPlaceholder 
              : t.describePlaceholder}
            className="w-full text-xs bg-slate-950/60 border border-slate-800 focus:border-amber-500/40 rounded-xl p-4 text-slate-100 placeholder-slate-650 focus:outline-none transition-all resize-y"
            rows={activeOption === 'original' ? 8 : 4}
          />
        </div>

        {/* EVIDENCE ATTACHMENT TOOLS (AVAILABLE FOR BOTH FLOWS) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PHOTO EVIDENCE CONTAINER */}
          <div className="space-y-3">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 font-mono">
              <Camera className="w-3.5 h-3.5 text-amber-500" />
              {t.photoEvidence}
            </label>
            <div 
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group ${
                dragActive ? 'border-amber-500 bg-amber-500/5' : 'border-slate-800 bg-slate-950/30 hover:border-slate-700 hover:bg-slate-950/50'
              }`}
            >
              <input 
                ref={fileInputRef} 
                type="file" 
                multiple 
                onChange={handlePhotoUpload} 
                className="hidden" 
                accept="image/*" 
              />
              <Upload className={`w-5 h-5 ${dragActive ? 'text-amber-400' : 'text-slate-500 group-hover:text-slate-400'}`} />
              <div className="text-center">
                <span className="text-[11px] font-semibold text-slate-300 block">{t.clickOrDrag}</span>
                <p className="text-[9px] text-slate-500 italic">{t.visualProof}</p>
              </div>
            </div>

            {photoPreviews.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {photoPreviews.map((preview, index) => (
                  <div key={index} className="relative aspect-video rounded-lg overflow-hidden border border-slate-850 bg-slate-950 group/img">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
                      }} 
                      className="absolute top-1.5 right-1.5 p-1 bg-slate-950/80 rounded-full text-slate-400 hover:text-rose-400 hover:bg-rose-950 transition-all opacity-0 group-hover/img:opacity-100"
                    >
                      <X size={12}/>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* VOICE TRANSCRIBER CONTAINER */}
          <div className="space-y-3">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 font-mono">
              <Mic className="w-3.5 h-3.5 text-amber-500" />
              {t.voiceEvidence}
            </label>
            
            {!voiceData && !isRecording && (
              <button 
                onClick={startRecording}
                className="w-full border-2 border-dashed border-slate-800 bg-slate-950/30 hover:border-slate-700 hover:bg-slate-950/50 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group"
              >
                <Mic className="w-5 h-5 text-slate-500 group-hover:text-amber-400 transition-colors" />
                <div className="text-center">
                  <span className="text-[11px] font-semibold text-slate-300 block">{t.recordVoiceInput}</span>
                  <p className="text-[9px] text-slate-500 italic">{t.transcribesDirectly}</p>
                </div>
              </button>
            )}

            {isRecording && (
              <div className="bg-rose-950/20 border border-rose-500/30 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1 items-center">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className={`w-1 bg-rose-500 rounded-full animate-bounce`} style={{ height: `${Math.random() * 20 + 10}px`, animationDelay: `${i * 0.1}s` }} />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-rose-400 font-mono">00:{recordingSeconds.toString().padStart(2, '0')} REC</span>
                </div>
                <button 
                  onClick={stopRecording}
                  className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-4 py-1.5 rounded-full text-[10px] font-bold transition-all"
                >
                  <Square className="w-3 h-3 fill-white" /> STOP RECORDING
                </button>
              </div>
            )}

            {voiceData && !isRecording && (
              <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handlePlayVoiceNote}
                      className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white hover:bg-amber-500 transition-all shadow-lg"
                    >
                      {isAudioPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} className="ml-0.5" fill="currentColor" />}
                    </button>
                    <div>
                      <span className="text-[11px] font-bold text-slate-200 block">{t.reviewVoice}</span>
                      <div className="w-32 h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                        <div 
                          className="h-full bg-amber-500 transition-all duration-100" 
                          style={{ width: `${(voicePlaybackCurrentTime / (voicePlaybackDuration || 1)) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setVoiceData(null)} className="text-slate-500 hover:text-rose-400 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
                {isTranscribing ? (
                  <div className="flex items-center gap-2 text-[10px] text-amber-400 font-mono animate-pulse">
                    <Loader2 size={12} className="animate-spin" /> {t.aiTranscribing}
                  </div>
                ) : voiceTranscription ? (
                  <p className="text-[10px] text-slate-400 italic line-clamp-2 leading-relaxed">"{voiceTranscription}"</p>
                ) : null}
              </div>
            )}
          </div>
        </div>

        {/* AI GENERATION TRIGGER BUTTON (OPTION 2 ONLY) */}
        {activeOption === 'ai' && (
          <button
            onClick={handleGenerateAIProposal}
            disabled={isGenerating || (!textInput.trim() && !voiceData)}
            className={`w-full py-3.5 rounded-xl font-bold text-xs shadow-xl transition-all flex items-center justify-center gap-2 relative overflow-hidden ${
              isGenerating || (!textInput.trim() && !voiceData)
                ? 'bg-slate-850 text-slate-500 border border-slate-800 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:scale-[1.01] active:scale-[0.99] shadow-cyan-500/25 cursor-pointer'
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t.compilingFormal}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-cyan-200" />
                <span>{t.generateFormal}</span>
              </>
            )}
            {isGenerating && <div className="absolute bottom-0 left-0 h-1 bg-cyan-400 animate-progress-indefinite w-full" />}
          </button>
        )}
      </div>

      {/* EDITABLE DRAFT BOX (REVEALS IN AI OPTION ONCE GENERATED) */}
      {activeOption === 'ai' && aiGeneratedDraft !== null && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4 pt-6 border-t border-slate-800/80 animate-fade-in"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-500" />
              <h3 className="font-extrabold text-slate-200 text-xs uppercase tracking-tight">{t.aiDraftTitle}</h3>
            </div>
            
            <button 
              onClick={handleDownloadPDF}
              className="flex items-center gap-1.5 text-[10px] font-bold bg-slate-950/80 hover:bg-slate-900 text-cyan-400 border border-cyan-500/30 px-3 py-1.5 rounded-lg transition-all"
            >
              <Download size={14} /> {t.downloadPdf}
            </button>
          </div>
          
          <div className="relative group">
            <textarea
              value={aiGeneratedDraft}
              onChange={(e) => setAiGeneratedDraft(e.target.value)}
              className="w-full h-80 p-5 bg-slate-950/80 border border-slate-800 focus:border-cyan-500/30 rounded-2xl text-slate-300 text-[13px] font-sans whitespace-pre-wrap leading-relaxed shadow-inner focus:outline-none transition-colors scrollbar-thin scrollbar-thumb-slate-800"
            />
            <div className="absolute bottom-3 right-4 text-[9px] font-mono text-slate-500 uppercase font-bold bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
              {t.editDraftHint}
            </div>
          </div>
        </motion.div>
      )}

      {/* FINAL INTERACTIVE ACTIONS BAR (PREVIEW & SUBMIT) */}
      {hasContent && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-center gap-3 pt-6 border-t border-slate-800/60"
        >
          <button
            onClick={handlePreview}
            className="w-full sm:w-1/2 py-3 bg-slate-950 hover:bg-slate-900 border border-slate-850 text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-inner cursor-pointer"
          >
            <Eye className="w-4 h-4 text-slate-400" />
            <span>{t.previewDraft}</span>
          </button>
          
          <button
            onClick={handleFinalSubmission}
            disabled={isSubmitting}
            className="w-full sm:w-1/2 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t.submittingPetition}</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 text-amber-200" />
                <span>{t.submitToMp}</span>
              </>
            )}
          </button>
        </motion.div>
      )}

      {/* PORTAL OFFICIAL DOCUMENT PREVIEW MODAL */}
      <AnimatePresence>
        {showPreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-8"
            >
              {/* MODAL CONTROL HEADER */}
              <div className="bg-slate-900 text-slate-100 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-wider">{t.officialPetitionReview}</span>
                </div>
                <button 
                  onClick={() => setShowPreview(false)}
                  className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* DOCUMENT BODY */}
              <div className="p-8 md:p-12 space-y-8 max-h-[70vh] overflow-y-auto font-serif">
                
                {/* NATIONAL EMBLEM SEAL MOCKUP */}
                <div className="flex flex-col items-center justify-center text-center space-y-1.5 border-b border-double border-slate-300 pb-6">
                  <div className="w-12 h-12 rounded-full border-2 border-slate-800 flex items-center justify-center font-bold text-base text-slate-800 tracking-widest font-sans shadow-sm">
                    GP
                  </div>
                  <span className="text-[10px] font-sans font-extrabold tracking-widest text-slate-500 uppercase">{t.govInitiative}</span>
                  <span className="text-[9px] font-sans text-slate-400">{t.citizenPetition}</span>
                </div>

                {/* META INFO */}
                <div className="flex justify-between text-xs font-sans text-slate-600 font-medium">
                  <div>
                    <strong>{t.refNo}</strong> PR-{Date.now().toString().substring(6)}
                  </div>
                  <div>
                    <strong>{t.dateLabel}</strong> {new Date().toLocaleDateString('en-IN', {day: 'numeric', month: 'long', year: 'numeric'})}
                  </div>
                </div>

                {/* ADDRESS HEADERS */}
                <div className="space-y-4 text-sm leading-relaxed text-slate-800">
                  <div className="space-y-0.5">
                    <p className="font-bold">{t.toLabel}</p>
                    <p className="font-bold">{t.theMp}</p>
                    <p>{city} {t.constituencyLabel}</p>
                    <p className="capitalize">{state}, India.</p>
                  </div>

                  <div className="pt-2">
                    <p className="font-bold">{t.subjectLabel} <span className="font-normal underline">{t.subjectText(city)}</span></p>
                  </div>
                </div>

                {/* PROPOSAL CORE CONTENT */}
                <div className="text-sm text-slate-900 leading-relaxed space-y-4 whitespace-pre-wrap font-serif border-l-2 border-slate-300 pl-4 py-1 italic">
                  {getFinalizedText()}
                </div>

                {/* SIGNATURE SECTION */}
                <div className="border-t border-slate-200 pt-6 flex justify-between items-end text-xs font-sans text-slate-600">
                  <div className="space-y-1">
                    <p className="font-bold text-slate-800">{t.supportingEvidence}</p>
                    <p>📸 {t.attachedPhotos} {photoPreviews.length} files</p>
                    <p>🎙️ {t.attachedAudio} {voiceData ? `1 ${t.voiceRecord}` : t.noneLabel}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="italic">{t.sincerelyYours}</p>
                    <p className="font-bold text-slate-900 text-sm">
                      {currentUser ? `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() : t.anonymousCitizen}
                    </p>
                    {currentUser?.phone && <p>{t.telLabel} {currentUser.phone}</p>}
                    <p className="text-[9px] text-slate-400 font-mono">{t.constituentOf(city)}</p>
                  </div>
                </div>
              </div>

              {/* MODAL ACTION BAR */}
              <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-end">
                <button
                  onClick={handleDownloadPDF}
                  className="w-full sm:w-auto px-4 py-2 border border-slate-300 text-slate-700 bg-white hover:bg-slate-100 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-slate-500" />
                  <span>{t.downloadPdfCopy}</span>
                </button>
                
                <button
                  onClick={() => setShowPreview(false)}
                  className="w-full sm:w-auto px-4 py-2 border border-slate-200 text-slate-600 hover:text-slate-850 hover:bg-slate-50 font-bold text-xs rounded-xl transition-all flex items-center justify-center cursor-pointer"
                >
                  {t.returnToEditor}
                </button>

                <button
                  onClick={handleFinalSubmission}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{t.submittingLabel}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>{t.confirmAndSubmit}</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
