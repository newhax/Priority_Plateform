import { Footer } from './Footer';
import React, { useState } from 'react';
import { signInWithGoogle } from '../firebase';
import { motion, AnimatePresence } from 'motion/react';
import { ShootingStars } from './ShootingStars';
import { PointStars } from './PointStars';
import { 
  Eye, 
  EyeOff, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Lock, 
  Info,
  Loader2
} from 'lucide-react';
import { ALL_INDIAN_STATES, INDIAN_STATES_CITIES } from '../seedData';

// Custom SVG for Google
const GoogleIcon = () => (
  <svg className="w-4 h-4 mr-2 inline-block" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
  </svg>
);

interface AuthScreenProps {
  onAuthSuccess: (user: any) => void;
  language?: string;
}

const authTranslations: Record<string, any> = {
  en: {
    headerSubLabel: "National Constituency Engine",
    title: "CITIZEN DEVELOPMENT PORTAL",
    description: "AI-driven collaborative pipeline linking members of parliament and local residents.",
    signInAccount: "Sign In Account",
    signInDesc: "Enter your credentials to manage your constituency portal.",
    emailLabel: "Email Address",
    passwordLabel: "Password",
    demoAccess: "Demo Access?",
    signInBtn: "Sign In",
    signingIn: "Signing In...",
    noAccount: "Don't have an account?",
    signUp: "Sign up",
    signUpAccount: "Sign Up Account",
    signUpDesc: "Enter your personal data to create your account.",
    firstName: "First Name",
    lastName: "Last Name",
    emailId: "Email ID",
    phone: "Phone Number",
    gender: "Gender",
    selectGender: "Select Gender",
    male: "Male",
    female: "Female",
    other: "Other",
    preferNotToSay: "Prefer not to say",
    dob: "DOB",
    state: "State",
    selectState: "Select State",
    city: "City",
    selectCity: "Select City",
    selectStateFirst: "Select State First",
    passwordHint: "Must be at least 8 characters.",
    signUpBtn: "Sign Up",
    creatingAccount: "Creating Account...",
    alreadyAccount: "Already have an account?",
    login: "Log in",
    secureNotice: "Secure, direct-action biometric identity matching & session tracking.",
    or: "Or",
    enterPassword: "Enter your password",
    fillCredentials: "Please fill in all credentials.",
    fillFields: "Please fill in all fields to complete registration.",
    passwordLength: "Password must be at least 8 characters long.",
    duplicateEmail: "An account with this email address already exists.",
    authError: "An error occurred during authentication.",
    signUpError: "An error occurred during sign up.",
    invalidCredentials: "Invalid email or password combination."
  },
  ml: {
    headerSubLabel: "ദേശീയ മണ്ഡല എഞ്ചിൻ",
    title: "ജനസമ്പർക്ക വികസന പോർട്ടൽ",
    description: "എംപിമാരെയും പ്രദേശവാസികളെയും ബന്ധിപ്പിക്കുന്ന എ ഐ പ്ലാറ്റ്ഫോം.",
    signInAccount: "ലോഗിൻ ചെയ്യുക",
    signInDesc: "നിങ്ങളുടെ പോർട്ടൽ മാനേജ് ചെയ്യുന്നതിനായി ലോഗിൻ ചെയ്യുക.",
    emailLabel: "ഇമെയിൽ വിലാസം",
    passwordLabel: "പാസ്‌വേഡ്",
    demoAccess: "ഡെമോ പ്രവേശനം?",
    signInBtn: "ലോഗിൻ ചെയ്യുക",
    signingIn: "ലോഗിൻ ചെയ്യുന്നു...",
    noAccount: "അക്കൗണ്ട് ഇല്ലേ?",
    signUp: "രജിസ്റ്റർ ചെയ്യുക",
    signUpAccount: "പുതിയ അക്കൗണ്ട് തുറക്കുക",
    signUpDesc: "രജിസ്റ്റർ ചെയ്യുന്നതിനായി വിവരങ്ങൾ നൽകുക.",
    firstName: "ആദ്യ പേര്",
    lastName: "അവസാന പേര്",
    emailId: "ഇമെയിൽ ഐഡി",
    phone: "ഫോൺ നമ്പർ",
    gender: "ലിംഗഭേദം",
    selectGender: "ലിംഗഭേദം തിരഞ്ഞെടുക്കുക",
    male: "പുരുഷൻ",
    female: "സ്ത്രീ",
    other: "മറ്റുള്ളവ",
    preferNotToSay: "വ്യക്തമാക്കാൻ താല്പര്യമില്ല",
    dob: "ജനന തീയതി",
    state: "സംസ്ഥാനം",
    selectState: "സംസ്ഥാനം തിരഞ്ഞെടുക്കുക",
    city: "നഗരം",
    selectCity: "നഗരം തിരഞ്ഞെടുക്കുക",
    selectStateFirst: "ആദ്യം സംസ്ഥാനം തിരഞ്ഞെടുക്കുക",
    passwordHint: "കുറഞ്ഞത് 8 അക്ഷരങ്ങൾ വേണം.",
    signUpBtn: "രജിസ്റ്റർ ചെയ്യുക",
    creatingAccount: "അക്കൗണ്ട് നിർമ്മിക്കുന്നു...",
    alreadyAccount: "അക്കൗണ്ട് ഉണ്ടോ?",
    login: "ലോഗിൻ ചെയ്യുക",
    secureNotice: "സുരക്ഷിതവും നേരിട്ടുള്ളതുമായ വിവര ശേഖരണവും ലോഗിൻ ട്രാക്കിംഗും.",
    or: "അല്ലെങ്കിൽ",
    enterPassword: "പാസ്‌വേഡ് നൽകുക",
    fillCredentials: "ദയവായി എല്ലാ വിവരങ്ങളും നൽകുക.",
    fillFields: "രജിസ്ട്രേഷൻ പൂർത്തിയാക്കാൻ ദയവായി എല്ലാ വിവരങ്ങളും നൽകുക.",
    passwordLength: "പാസ്‌വേഡിന് കുറഞ്ഞത് 8 അക്ഷരങ്ങൾ നീളം ഉണ്ടായിരിക്കണം.",
    duplicateEmail: "ഈ ഇമെയിൽ വിലാസത്തിലുള്ള ഒരു അക്കൗണ്ട് നിലവിലുണ്ട്.",
    authError: "ലോഗിൻ ചെയ്യുന്നതിൽ പരാജയപ്പെട്ടു.",
    signUpError: "രജിസ്റ്റർ ചെയ്യുന്നതിൽ പരാജയപ്പെട്ടു.",
    invalidCredentials: "തെറ്റായ ഇമെയിൽ അല്ലെങ്കിൽ പാസ്‌വേഡ്."
  },
  hi: {
    headerSubLabel: "राष्ट्रीय निर्वाचन क्षेत्र इंजन",
    title: "सांसद-नागरिक विकास पोर्टल",
    description: "सांसदों और स्थानीय निवासियों को जोड़ने वाली एआई-संचालित सहयोगी प्रणाली।",
    signInAccount: "खाते में साइन इन करें",
    signInDesc: "अपने निर्वाचन क्षेत्र पोर्टल का प्रबंधन करने के लिए क्रेडेंशियल दर्ज करें।",
    emailLabel: "ईमेल पता",
    passwordLabel: "पासवर्ड",
    demoAccess: "डेमो एक्सेस?",
    signInBtn: "साइन इन करें",
    signingIn: "साइन इन किया जा रहा है...",
    noAccount: "खाता नहीं है?",
    signUp: "साइन अप करें",
    signUpAccount: "खाता बनाएं",
    signUpDesc: "अपना खाता बनाने के लिए अपना व्यक्तिगत डेटा दर्ज करें।",
    firstName: "पहला नाम",
    lastName: "अंतिम नाम",
    emailId: "ईमेल आईडी",
    phone: "फ़ोन नंबर",
    gender: "लिंग",
    selectGender: "लिंग चुनें",
    male: "पुरुष",
    female: "महिला",
    other: "अन्य",
    preferNotToSay: "बताना नहीं चाहते",
    dob: "जन्म तिथि",
    state: "राज्य",
    selectState: "राज्य चुनें",
    city: "शहर",
    selectCity: "शहर चुनें",
    selectStateFirst: "पहले राज्य चुनें",
    passwordHint: "कम से कम 8 अक्षर होने चाहिए।",
    signUpBtn: "साइन अप करें",
    creatingAccount: "खाता बनाया जा रहा है...",
    alreadyAccount: "पहले से ही एक खाता है?",
    login: "लॉग इन करें",
    secureNotice: "सुरक्षित, प्रत्यक्ष-कार्रवाई पहचान मिलान और सत्र ट्रैकिंग।",
    or: "या",
    enterPassword: "अपना पासवर्ड दर्ज करें",
    fillCredentials: "कृपया सभी क्रेडेंशियल भरें।",
    fillFields: "पंजीकरण पूरा करने के लिए कृपया सभी फ़ील्ड भरें।",
    passwordLength: "पासवर्ड कम से कम 8 अक्षर लंबा होना चाहिए।",
    duplicateEmail: "इस ईमेल पते वाला खाता पहले से मौजूद है।",
    authError: "प्रमाणीकरण के दौरान एक त्रुटि हुई।",
    signUpError: "साइन अप के दौरान एक त्रुटि हुई।",
    invalidCredentials: "अमान्य ईमेल या पासवर्ड संयोजन।"
  },
  bn: {
    headerSubLabel: "জাতীয় নির্বাচনী এলাকা ইঞ্জিন",
    title: "নাগরিক উন্নয়ন পোর্টাল",
    description: "এমপি এবং স্থানীয় বাসিন্দাদের সংযোগকারী এআই-চালিত সহযোগী পাইপলাইন।",
    signInAccount: "অ্যাকাউন্টে সাইন ইন করুন",
    signInDesc: "আপনার নির্বাচনী এলাকা পোর্টাল পরিচালনা করতে শংসাপত্র লিখুন।",
    emailLabel: "ইমেল ঠিকানা",
    passwordLabel: "পাসওয়ার্ড",
    demoAccess: "ডেমো অ্যাক্সেস?",
    signInBtn: "সাইন ইন করুন",
    signingIn: "সাইন ইন হচ্ছে...",
    noAccount: "অ্যাকাউন্ট নেই?",
    signUp: "সাইন আপ করুন",
    signUpAccount: "অ্যাকাউন্ট তৈরি করুন",
    signUpDesc: "আপনার অ্যাকাউন্ট তৈরি করতে আপনার ব্যক্তিগত বিবরণ লিখুন।",
    firstName: "প্রথম নাম",
    lastName: "শেষ নাম",
    emailId: "ইমেল আইডি",
    phone: "ফোন নম্বর",
    gender: "লিঙ্গ",
    selectGender: "লিঙ্গ নির্বাচন করুন",
    male: "পুরুষ",
    female: "মহিলা",
    other: "অন্যান্য",
    preferNotToSay: "বলতে অনিচ্ছুক",
    dob: "জন্ম তারিখ",
    state: "রাজ্য",
    selectState: "রাজ্য নির্বাচন করুন",
    city: "শহর",
    selectCity: "শহর নির্বাচন করুন",
    selectStateFirst: "প্রথমে রাজ্য নির্বাচন করুন",
    passwordHint: "কমপক্ষে ৮টি অক্ষর হতে হবে।",
    signUpBtn: "সাইন আপ করুন",
    creatingAccount: "অ্যাকাউন্ট তৈরি হচ্ছে...",
    alreadyAccount: "ইতিমধ্যে একটি অ্যাকাউন্ট আছে?",
    login: "লগ ইন করুন",
    secureNotice: "সুরক্ষিত, সরাসরি-অ্যাকশন পরিচয় ম্যাচিং এবং সেশন ট্র্যাকিং।",
    or: "অথবা",
    enterPassword: "আপনার পাসওয়ার্ড লিখুন",
    fillCredentials: "দয়া করে সব বিবরণ পূরণ করুন।",
    fillFields: "নিবন্ধন সম্পূর্ণ করতে সব ক্ষেত্র পূরণ করুন।",
    passwordLength: "পাসওয়ার্ড কমপক্ষে ৮টি অক্ষর দীর্ঘ হতে হবে।",
    duplicateEmail: "এই ইমেল ঠিকানা সহ একটি অ্যাকাউন্ট ইতিমধ্যে বিদ্যমান।",
    authError: "প্রমাণীকরণের সময় একটি ত্রুটি ঘটেছে।",
    signUpError: "সাইন আপ করার সময় একটি ত্রুটি ঘটেছে।",
    invalidCredentials: "অবৈধ ইমেল বা পাসওয়ার্ডের সমন্বয়।"
  },
  pa: {
    headerSubLabel: "ਰਾਸ਼ਟਰੀ ਹਲਕਾ ਇੰਜਨ",
    title: "ਨਾਗਰਿਕ ਵਿਕਾਸ ਪੋਰਟਲ",
    description: "ਸੰਸਦ ਮੈਂਬਰਾਂ ਅਤੇ ਸਥਾਨਕ ਨਿਵਾਸੀਆਂ ਨੂੰ ਜੋੜਨ ਵਾਲਾ AI-ਸੰਚਾਲਿਤ ਸਹਿਯੋਗੀ ਪੋਰਟਲ।",
    signInAccount: "ਖਾਤੇ ਵਿੱਚ ਸਾਈਨ ਇਨ ਕਰੋ",
    signInDesc: "ਆਪਣੇ ਹਲਕੇ ਦੇ ਪੋਰਟਲ ਦਾ ਪ੍ਰਬੰਧਨ ਕਰਨ ਲਈ ਕ੍ਰੈਡੈਂਸ਼ੀਅਲ ਦਰਜ ਕਰੋ।",
    emailLabel: "ਈਮੇਲ ਪਤਾ",
    passwordLabel: "ਪਾਸਵਰਡ",
    demoAccess: "ਡੈਮੋ ਐਕਸੈਸ?",
    signInBtn: "ਸਾਈਨ ਇਨ ਕਰੋ",
    signingIn: "ਸਾਈਨ ਇਨ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...",
    noAccount: "ਕੀ ਖਾਤਾ ਨਹੀਂ ਹੈ?",
    signUp: "ਸਾਈਨ ਅੱਪ ਕਰੋ",
    signUpAccount: "ਖਾਤਾ ਬਣਾਓ",
    signUpDesc: "ਆਪਣਾ ਖਾਤਾ ਬਣਾਉਣ ਲਈ ਆਪਣਾ ਨਿੱਜੀ ਡੇਟਾ ਦਰਜ ਕਰੋ।",
    firstName: "ਪਹਿਲਾ ਨਾਮ",
    lastName: "ਆਖਰੀ ਨਾਮ",
    emailId: "ਈਮੇਲ ਆਈਡੀ",
    phone: "ਫ਼ੋਨ ਨੰਬਰ",
    gender: "ਲਿੰਗ",
    selectGender: "ਲਿੰਗ ਚੁਣੋ",
    male: "ਪੁਰਸ਼",
    female: "ਮਹਿਲਾ",
    other: "ਹੋਰ",
    preferNotToSay: "ਦੱਸਣਾ ਨਹੀਂ ਚਾਹੁੰਦੇ",
    dob: "ਜਨਮ ਤਾਰੀਖ",
    state: "ਰਾਜ",
    selectState: "ਰਾਜ ਚੁਣੋ",
    city: "ਸ਼ਹਿਰ",
    selectCity: "ਸ਼ਹਿਰ ਚੁਣੋ",
    selectStateFirst: "ਪਹਿਲਾਂ ਰਾਜ ਚੁਣੋ",
    passwordHint: "ਘੱਟੋ-ਘੱਟ 8 ਅੱਖਰ ਹੋਣੇ ਚਾਹੀਦੇ ਹਨ।",
    signUpBtn: "ਸਾਈਨ ਅੱਪ ਕਰੋ",
    creatingAccount: "ਖਾਤਾ ਬਣਾਇਆ ਜਾ ਰਿਹਾ ਹੈ...",
    alreadyAccount: "ਪਹਿਲਾਂ ਹੀ ਖਾਤਾ ਹੈ?",
    login: "ਲੌਗ ਇਨ ਕਰੋ",
    secureNotice: "ਸੁਰੱਖਿਅਤ, ਸਿੱਧੀ-ਕਾਰਵਾਈ ਪਛਾਣ ਮੇਲ ਅਤੇ ਸੈਸ਼ਨ ਟਰੈਕਿੰਗ।",
    or: "ਜਾਂ",
    enterPassword: "ਆਪਣਾ ਪਾਸਵਰਡ ਦਰਜ ਕਰੋ",
    fillCredentials: "ਕਿਰਪਾ ਕਰਕੇ ਸਾਰੇ ਕ੍ਰੈਡੈਂਸ਼ੀਅਲ ਭਰੋ।",
    fillFields: "ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਪੂਰੀ ਕਰਨ ਲਈ ਕਿਰਪਾ ਕਰਕੇ ਸਾਰੇ ਖੇਤਰ ਭਰੋ।",
    passwordLength: "ਪਾਸਵਰਡ ਘੱਟੋ-ਘੱਟ 8 ਅੱਖਰ ਹੋਣੇ ਚਾਹੀਦੇ ਹਨ।",
    duplicateEmail: "ਇਸ ਈਮੇਲ ਪਤੇ ਵਾਲਾ ਖਾਤਾ ਪਹਿਲਾਂ ਹੀ ਮੌਜੂਦ ਹੈ।",
    authError: "ਪ੍ਰਮਾਣਿਕਤਾ ਦੌਰਾਨ ਇੱਕ ਗਲਤੀ ਆਈ।",
    signUpError: "ਸਾਈਨ ਅੱਪ ਦੌਰਾਨ ਇੱਕ ਗਲਤੀ ਆਈ।",
    invalidCredentials: "ਗਲਤ ਈਮੇਲ ਜਾਂ ਪਾਸਵਰਡ ਦਾ ਸੁਮੇਲ।"
  },
  te: {
    headerSubLabel: "జాతీయ నియోజకవర్గ ఇంజన్",
    title: "పౌరుల అభివృద్ధి పోర్టల్",
    description: "ఎంపీలు మరియు స్థానిక నివాసితులను అనుసంధానించే AI- ఆధారిత సహకార వ్యవస్థ.",
    signInAccount: "ఖాతాలోకి సైన్ ఇన్ చేయండి",
    signInDesc: "మీ నియోజకవర్గ పోర్టల్‌ను నిర్వహించడానికి మీ ఆధారాలను నమోదు చేయండి.",
    emailLabel: "ఇమెయిల్ చిరునామా",
    passwordLabel: "పాస్‌వర్డ్",
    demoAccess: "డెమో యాక్సెస్?",
    signInBtn: "సైన్ ఇన్",
    signingIn: "సైన్ ఇన్ అవుతోంది...",
    noAccount: "ఖాతా లేదా?",
    signUp: "సైన్ అప్",
    signUpAccount: "ఖాతాను సృష్టించండి",
    signUpDesc: "మీ ఖాతాను సృష్టించడానికి మీ వ్యక్తిగత డేటాను నమోదు చేయండి.",
    firstName: "మొదటి పేరు",
    lastName: "చివరి పేరు",
    emailId: "ఇమెయిల్ ఐడి",
    phone: "ఫోన్ నంబర్",
    gender: "లింగం",
    selectGender: "లింగాన్ని ఎంచుకోండి",
    male: "పురుషుడు",
    female: "స్త్రీ",
    other: "ఇతర",
    preferNotToSay: "చెప్పడానికి ఇష్టపడలేదు",
    dob: "పుట్టిన తేదీ",
    state: "రాష్ట్రం",
    selectState: "రాష్ట్రాన్ని ఎంచుకోండి",
    city: "నగరం",
    selectCity: "నగరాన్ని ఎంచుకోండి",
    selectStateFirst: "ముందుగా రాష్ట్రాన్ని ఎంచుకోండి",
    passwordHint: "కనీసం 8 అక్షరాలు ఉండాలి.",
    signUpBtn: "సైన్ అప్",
    creatingAccount: "ఖాతా సృష్టించబడుతోంది...",
    alreadyAccount: "ఇప్పటికే ఖాతా ఉందా?",
    login: "లాగిన్ చేయండి",
    secureNotice: "సురక్షితమైన, ప్రత్యక్ష గుర్తింపు సరిపోలిక మరియు సెషన్ ట్రాకింగ్.",
    or: "లేదా",
    enterPassword: "మీ పాస్‌వర్డ్‌ను నమోదు చేయండి",
    fillCredentials: "దయచేసి అన్ని వివరాలను పూరించండి.",
    fillFields: "నమోదును పూర్తి చేయడానికి దయచేసి అన్ని ఫీల్డ్‌లను పూరించండి.",
    passwordLength: "పాస్‌వర్డ్ కనీసం 8 అక్షరాల పొడవు ఉండాలి.",
    duplicateEmail: "ఈ ఇమెయిల్ చిరునామాతో ఇప్పటికే ఒక ఖాతా ఉంది.",
    authError: "ధృవీకరణ సమయంలో లోపం సంభవించింది.",
    signUpError: "నమోదు సమయంలో లోపం సంభవించింది.",
    invalidCredentials: "చెల్లని ఇమెయిల్ లేదా పాస్‌వర్డ్ కలయిక."
  },
  ta: {
    headerSubLabel: "தேசிய தொகுதி எஞ்சின்",
    title: "நாடாளுமன்ற தொகுதி மேம்பாட்டு போர்டல்",
    description: "எம்பிக்களையும் உள்ளூர் மக்களையும் இணைக்கும் செயற்கை நுண்ணறிவு சார்ந்த மேம்பாட்டு தளம்.",
    signInAccount: "உள்நுழையவும்",
    signInDesc: "உங்கள் தொகுதி போர்ட்டலை நிர்வகிக்க உங்கள் சான்றுகளை உள்ளிடவும்.",
    emailLabel: "மின்னஞ்சல் முகவரி",
    passwordLabel: "கடவுச்சொல்",
    demoAccess: "டெமோ அணுகல்?",
    signInBtn: "உள்நுழை",
    signingIn: "உள்நுழைகிறது...",
    noAccount: "கணக்கு இல்லையா?",
    signUp: "பதிவு செய்க",
    signUpAccount: "புதிய கணக்கு உருவாக்கவும்",
    signUpDesc: "உங்கள் கணக்கை உருவாக்க உங்கள் தனிப்பட்ட விவரங்களை உள்ளிடவும்.",
    firstName: "முதல் பெயர்",
    lastName: "கடைசி பெயர்",
    emailId: "மின்னஞ்சல் ஐடி",
    phone: "தொலைபேசி எண்",
    gender: "பாலினம்",
    selectGender: "பாலினத்தைத் தேர்ந்தெடுக்கவும்",
    male: "ஆண்",
    female: "பெண்",
    other: "மற்றவை",
    preferNotToSay: "குறிப்பிட விரும்பவில்லை",
    dob: "பிறந்த தேதி",
    state: "மாநிலம்",
    selectState: "மாநிலத்தைத் தேர்ந்தெடுக்கவும்",
    city: "நகரம்",
    selectCity: "நகரத்தைத் தேர்ந்தெடுக்கவும்",
    selectStateFirst: "முதலில் மாநிலத்தைத் தேர்ந்தெடுக்கவும்",
    passwordHint: "குறைந்தது 8 எழுத்துக்கள் இருக்க வேண்டும்.",
    signUpBtn: "பதிவு செய்க",
    creatingAccount: "கணக்கு உருவாக்கப்படுகிறது...",
    alreadyAccount: "ஏற்கனவே கணக்கு உள்ளதா?",
    login: "உள்நுழைக",
    secureNotice: "பாதுகாப்பான, நேரடி அடையாள சரிபார்ப்பு மற்றும் அமர்வு கண்காணிப்பு.",
    or: "அல்லது",
    enterPassword: "கடவுச்சொல்லை உள்ளிடவும்",
    fillCredentials: "அனைத்து விவரங்களையும் பூர்த்தி செய்யவும்.",
    fillFields: "பதிவை முடிக்க அனைத்து புலங்களையும் நிரப்பவும்.",
    passwordLength: "கடவுச்சொல் குறைந்தபட்சம் 8 எழுத்துக்கள் கொண்டதாக இருக்க வேண்டும்.",
    duplicateEmail: "இந்த மின்னஞ்சல் முகவரியில் ஏற்கனவே ஒரு கணக்கு உள்ளது.",
    authError: "உள்நுழைவின் போது பிழை ஏற்பட்டது.",
    signUpError: "பதிவு செய்வதில் பிழை ஏற்பட்டது.",
    invalidCredentials: "தவறான மின்னஞ்சல் அல்லது கடவுச்சொல்."
  }
};

export function AuthScreen({ onAuthSuccess, language = 'en' }: AuthScreenProps) {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Sign In State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign Up State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');

  const t = authTranslations[language] || authTranslations['en'];

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail || !signInPassword) {
      setError(t.fillCredentials);
      return;
    }
    setError(null);
    setLoading(true);

    try {
      // Fetch users from localStorage
      const users = JSON.parse(localStorage.getItem('mp_portal_users') || '[]');
      const user = users.find((u: any) => u.email.toLowerCase() === signInEmail.toLowerCase());

      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 850));

      if (user && user.password === signInPassword) {
        localStorage.setItem('mp_portal_current_user', JSON.stringify(user));
        onAuthSuccess(user);
      } else if (signInEmail.toLowerCase() === 'admin@mp.gov.in' && signInPassword === 'admin123') {
        // Default master account
        const defaultUser = {
          firstName: 'Abhinav',
          lastName: 'Srivastava',
          email: 'admin@mp.gov.in',
          phone: '+91 94471 01234',
          gender: 'Male',
          dob: '1990-01-01',
          state: 'Kerala',
          city: 'Thiruvananthapuram',
          isAdmin: true
        };
        localStorage.setItem('mp_portal_current_user', JSON.stringify(defaultUser));
        onAuthSuccess(defaultUser);
      } else {
        setError(t.invalidCredentials);
      }
    } catch (err) {
      setError(t.authError);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!firstName || !lastName || !phone || !email || !gender || !dob || !state || !city || !password) {
      setError(t.fillFields);
      return;
    }

    if (password.length < 8) {
      setError(t.passwordLength);
      return;
    }

    setLoading(true);

    try {
      const users = JSON.parse(localStorage.getItem('mp_portal_users') || '[]');
      
      // Check duplicate
      const exists = users.some((u: any) => u.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        setError(t.duplicateEmail);
        setLoading(false);
        return;
      }

      const newUser = {
        id: `usr_${Date.now()}`,
        firstName,
        lastName,
        phone,
        email,
        gender,
        dob,
        state,
        city,
        password,
        isAdmin: false
      };

      // Push and save
      users.push(newUser);
      localStorage.setItem('mp_portal_users', JSON.stringify(users));

      // Simulate server save
      await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      }).catch(err => console.log('Silent server register sync fallback: ', err));

      // Simulate loading state
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Auto login after sign up
      localStorage.setItem('mp_portal_current_user', JSON.stringify(newUser));
      onAuthSuccess(newUser);
    } catch (err) {
      setError(t.signUpError);
    } finally {
      setLoading(false);
    }
  };

  // Quick preset demo login

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const user = await signInWithGoogle();
      const citizen = {
        firstName: user.displayName?.split(' ')[0] || 'User',
        lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phoneNumber || '',
        gender: 'Not specified',
        dob: '2000-01-01',
        state: 'Kerala',
        city: 'Thiruvananthapuram',
        isAdmin: false
      };
      localStorage.setItem('mp_portal_current_user', JSON.stringify(citizen));
      setLoading(false);
      onAuthSuccess(citizen);
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Failed to sign in with Google');
    }
  };

  const handleQuickDemoLogin = (role: 'mp' | 'citizen') => {

    if (role === 'mp') {
      const demoMP = {
        firstName: 'Abhinav',
        lastName: 'Srivastava',
        email: 'admin@mp.gov.in',
        phone: '+91 94471 01234',
        gender: 'Male',
        dob: '1990-01-01',
        state: 'Kerala',
        city: 'Thiruvananthapuram',
        isAdmin: true
      };
      localStorage.setItem('mp_portal_current_user', JSON.stringify(demoMP));
      onAuthSuccess(demoMP);
    } else {
      const demoCitizen = {
        firstName: 'Harish',
        lastName: 'Kumar',
        email: 'harish.kumar@gmail.com',
        phone: '+91 98456 78901',
        gender: 'Male',
        dob: '1995-05-15',
        state: 'Kerala',
        city: 'Thiruvananthapuram',
        isAdmin: false
      };
      localStorage.setItem('mp_portal_current_user', JSON.stringify(demoCitizen));
      onAuthSuccess(demoCitizen);
    }
  };

  return (
    <div id="auth-screen-container" className="min-h-screen bg-[#060608] flex flex-col justify-between items-center text-slate-100 font-sans p-4 relative overflow-hidden">
      <PointStars />
      <ShootingStars />
      
      {/* Decorative vector background meshes */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-fuchsia-900/30 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-900/30 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-900/20 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* Header section with Portal Branding */}
      <div className="w-full max-w-md text-center pt-8 space-y-2 relative z-10">
        <div className="inline-flex items-center gap-2">
          
          <span className="text-[10px] font-mono tracking-wider font-extrabold text-cyan-400 uppercase">
            {t.headerSubLabel}
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight font-display bg-gradient-to-r from-violet-400 via-fuchsia-300 to-cyan-400 bg-clip-text text-transparent">
          {t.title}
        </h1>
        <p className="text-[11px] sm:text-xs text-slate-500 font-sans max-w-xs mx-auto">
          {t.description}
        </p>
      </div>

      {/* Main card box */}
      <div className="w-full max-w-xl my-6 relative z-10">
        <div className="bg-[#09090b]/95 border border-zinc-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/90 relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            {!isSignUp ? (
              /* SIGN IN PAGE VIEW */
              <motion.div
                key="signin-view"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="text-center space-y-1">
                  <h2 className="text-xl font-bold text-white tracking-tight">{t.signInAccount}</h2>
                  <p className="text-xs text-slate-400">{t.signInDesc}</p>
                </div>

                {/* Social Login preset */}
                <div className="grid grid-cols-1 gap-3">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="flex items-center justify-center py-2.5 px-4 rounded-xl border border-zinc-800 bg-[#0f0f11] hover:bg-zinc-800 hover:-translate-y-1 hover:scale-105 hover:rotate-2 hover:shadow-lg hover:shadow-cyan-500/30 active:scale-95 duration-300 text-[11px] font-bold text-slate-200 transition-all cursor-pointer"
                  >
                    <GoogleIcon />
                    Google
                  </button>
                </div>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-zinc-800/60"></div>
                  <span className="flex-shrink mx-4 text-[10px] font-mono text-slate-500 uppercase font-bold tracking-widest">{t.or}</span>
                  <div className="flex-grow border-t border-zinc-800/60"></div>
                </div>

                <form onSubmit={handleSignInSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-red-400 text-xs">
                      {error}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-cyan-400" />
                      {t.emailLabel}
                    </label>
                    <input
                      type="email"
                      required
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      placeholder="eg. johnfrans@gmail.com"
                      className="w-full text-xs bg-[#0f0f12] border border-zinc-800 focus:border-zinc-600 rounded-xl p-3.5 text-slate-100 placeholder-zinc-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-cyan-400" />
                      {t.passwordLabel}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        placeholder={t.enterPassword}
                        className="w-full text-xs bg-[#0f0f12] border border-zinc-800 focus:border-zinc-600 rounded-xl p-3.5 pr-11 text-slate-100 placeholder-zinc-600 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-slate-350 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 hover:from-violet-500 hover:via-fuchsia-400 hover:to-cyan-400 text-white font-extrabold text-xs py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(217,70,239,0.3)] hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(217,70,239,0.6)] active:scale-[0.98] active:translate-y-0"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        {t.signingIn}
                      </>
                    ) : (
                      t.signInBtn
                    )}
                  </button>
                </form>

                <div className="text-center pt-2">
                  <p className="text-xs text-slate-400">
                    {t.noAccount}{' '}
                    <button
                      type="button"
                      onClick={() => { setIsSignUp(true); setError(null); }}
                      className="text-white font-bold hover:underline cursor-pointer"
                    >
                      {t.signUp}
                    </button>
                  </p>
                </div>
              </motion.div>
            ) : (
              /* SIGN UP PAGE VIEW */
              <motion.div
                key="signup-view"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div className="text-center space-y-1">
                  <h2 className="text-xl font-bold text-white tracking-tight">{t.signUpAccount}</h2>
                  <p className="text-xs text-slate-400">{t.signUpDesc}</p>
                </div>



                <form onSubmit={handleSignUpSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-red-400 text-xs">
                      {error}
                    </div>
                  )}

                  {/* Name fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1">
                        <User className="w-3 h-3 text-cyan-400" />
                        {t.firstName}
                      </label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="eg. John"
                        className="w-full text-xs bg-[#0f0f12] border border-zinc-800 focus:border-zinc-600 rounded-xl p-3 text-slate-100 placeholder-zinc-650 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1">
                        <User className="w-3 h-3 text-cyan-400" />
                        {t.lastName}
                      </label>
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="eg. Francisco"
                        className="w-full text-xs bg-[#0f0f12] border border-zinc-800 focus:border-zinc-600 rounded-xl p-3 text-slate-100 placeholder-zinc-650 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Contact details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-cyan-400" />
                        {t.emailId}
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="eg. johnfrans@gmail.com"
                        className="w-full text-xs bg-[#0f0f12] border border-zinc-800 focus:border-zinc-600 rounded-xl p-3 text-slate-100 placeholder-zinc-650 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-cyan-400" />
                        {t.phone}
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="eg. +91 94471 01234"
                        className="w-full text-xs bg-[#0f0f12] border border-zinc-800 focus:border-zinc-600 rounded-xl p-3 text-slate-100 placeholder-zinc-650 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Demographics */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">
                        {t.gender}
                      </label>
                      <select
                        required
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full text-xs bg-[#0f0f12] border border-zinc-800 focus:border-zinc-600 rounded-xl p-3 text-slate-100 focus:outline-none cursor-pointer"
                        style={{ colorScheme: 'dark' }}
                      >
                        <option value="">{t.selectGender}</option>
                        <option value="Male">{t.male}</option>
                        <option value="Female">{t.female}</option>
                        <option value="Other">{t.other}</option>
                        <option value="Prefer not to say">{t.preferNotToSay}</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-cyan-400" />
                        {t.dob}
                      </label>
                      <input
                        type="date"
                        required
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        onClick={(e) => {
                          try {
                            e.currentTarget.showPicker();
                          } catch (err) {
                            // Fallback
                          }
                        }}
                        className="w-full text-xs bg-[#0f0f12] border border-zinc-800 focus:border-zinc-600 rounded-xl p-3 text-slate-100 focus:outline-none cursor-pointer text-slate-300"
                        style={{ colorScheme: 'dark' }}
                      />
                    </div>
                  </div>

                  {/* Geography */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">
                        {t.state}
                      </label>
                      <select
                        required
                        value={state}
                        onChange={(e) => {
                          const nextState = e.target.value;
                          setState(nextState);
                          const match = INDIAN_STATES_CITIES.find(item => item.state === nextState);
                          if (match && match.cities.length > 0) {
                            setCity(match.cities[0]);
                          } else {
                            setCity('');
                          }
                        }}
                        className="w-full text-xs bg-[#0f0f12] border border-zinc-800 focus:border-zinc-600 rounded-xl p-3 text-slate-100 focus:outline-none cursor-pointer"
                        style={{ colorScheme: 'dark' }}
                      >
                        <option value="">{t.selectState}</option>
                        {ALL_INDIAN_STATES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-cyan-400" />
                        {t.city}
                      </label>
                      <select
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        disabled={!state}
                        className="w-full text-xs bg-[#0f0f12] border border-zinc-800 focus:border-zinc-600 rounded-xl p-3 text-slate-100 focus:outline-none cursor-pointer disabled:opacity-50"
                        style={{ colorScheme: 'dark' }}
                      >
                        <option value="">
                          {state ? t.selectCity : t.selectStateFirst}
                        </option>
                        {(state ? (INDIAN_STATES_CITIES.find(item => item.state === state)?.cities || []) : []).map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-cyan-400" />
                      {t.passwordLabel}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t.enterPassword}
                        className="w-full text-xs bg-[#0f0f12] border border-zinc-800 focus:border-zinc-600 rounded-xl p-3.5 pr-11 text-slate-100 placeholder-zinc-600 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-slate-350 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-500 block leading-relaxed font-sans pl-1">
                      {t.passwordHint}
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 hover:from-violet-500 hover:via-fuchsia-400 hover:to-cyan-400 text-white font-extrabold text-xs py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(217,70,239,0.3)] hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(217,70,239,0.6)] active:scale-[0.98] active:translate-y-0"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        {t.creatingAccount}
                      </>
                    ) : (
                      t.signUpBtn
                    )}
                  </button>
                </form>

                <div className="text-center pt-1">
                  <p className="text-xs text-slate-400">
                    {t.alreadyAccount}{' '}
                    <button
                      type="button"
                      onClick={() => { setIsSignUp(false); setError(null); }}
                      className="text-white font-bold hover:underline cursor-pointer"
                    >
                      {t.login}
                    </button>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

      {/* Developer notice */}
      <div className="w-full max-w-md text-center pb-6 space-y-2 relative z-10">
        <p className="text-[10px] text-slate-600 flex items-center justify-center gap-1">
          <Info className="w-3.5 h-3.5 text-cyan-500/60" />
          {t.secureNotice}
        </p>
      </div>

    </div>
  );
}
