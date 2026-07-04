import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { Submission, ProposedProject, WardData } from './types';
import { translations, getTranslation } from './components/translations';
import { GoogleMapComponent } from './components/GoogleMapComponent';
import { WhatsAppPreview } from './components/WhatsAppPreview';
import { ReportGenerator } from './components/ReportGenerator';
import { PrioritySandbox } from './components/PrioritySandbox';
import { AIProposalDesk } from './components/AIProposalDesk';
import { INDIAN_STATES_CITIES, ALL_INDIAN_STATES } from './seedData';
import { AuthScreen } from './components/AuthScreen';
import { LanguageGreetingModal } from './components/LanguageGreetingModal';
import { 
  Languages, 
  User, 
  Phone, 
  MapPin, 
  FileText, 
  Check, 
  Upload, 
  Mic, 
  MicOff, 
  Sparkles, 
  MessageSquare, 
  Building2, 
  AlertTriangle, 
  TrendingUp, 
  ThumbsUp, 
  Users, 
  Grid, 
  CheckCircle2, 
  Inbox,
  Clock,
  Clock3,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [lang, setLang] = useState<string>('en');
  const [showGreeting, setShowGreeting] = useState<boolean>(false);
  const [selectedState, setSelectedState] = useState<string>('Kerala');
  const [selectedCity, setSelectedCity] = useState<string>('Thiruvananthapuram');
  const [formState, setFormState] = useState<string>('Kerala');
  const [formCity, setFormCity] = useState<string>('Thiruvananthapuram');
  const [customCity, setCustomCity] = useState<string>('');
  const [selectedWardId, setSelectedWardId] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [projects, setProjects] = useState<ProposedProject[]>([]);
  const [wards, setWards] = useState<WardData[]>([]);
  const [selectedProjectForReport, setSelectedProjectForReport] = useState<ProposedProject | null>(null);
  const [activeTab, setActiveTab] = useState<'intake' | 'map' | 'proposals' | 'feed'>('intake');

  // User Authentication State
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showProfileCard, setShowProfileCard] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('mp_portal_current_user');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        setCurrentUser(u);
        if (u) {
          setFormName(`${u.firstName} ${u.lastName}`);
          setFormPhone(u.phone || '');
        }
      } catch (err) {
        console.error("Error reading saved user session:", err);
      }
    }
  }, []);

  // Automatically update location based on user profile
  useEffect(() => {
    if (currentUser?.state) {
      setSelectedState(currentUser.state);
      if (currentUser.city) {
        setSelectedCity(currentUser.city);
      }
    }
  }, [currentUser?.state, currentUser?.city]);

  // Load saved language and welcome status on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('mp_portal_selected_lang');
    if (savedLang) {
      setLang(savedLang);
    }
    const hasWelcomed = localStorage.getItem('mp_portal_has_welcomed');
    if (!hasWelcomed) {
      setShowGreeting(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('mp_portal_current_user');
    setCurrentUser(null);
    setShowProfileCard(false);
  };

  // Form State
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formWard, setFormWard] = useState('Kazhakkoottam');
  const [formText, setFormText] = useState('');
  const [formInputType, setFormInputType] = useState<Submission['inputType']>('text');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [generatedLetter, setGeneratedLetter] = useState<string | null>(null);
  const [generatingLetter, setGeneratingLetter] = useState(false);

  // Interactive States
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const t = getTranslation(lang);
  const timerRef = useRef<any>(null);

  // Load submissions and projects from our Express API on mount or region change
  const loadData = async (stateVal: string, cityVal: string) => {
    try {
      const subRes = await fetch(`/api/submissions?state=${encodeURIComponent(stateVal)}&city=${encodeURIComponent(cityVal)}`);
      const subData = await subRes.json();
      if (subData.submissions) setSubmissions(subData.submissions);

      const projRes = await fetch(`/api/projects?state=${encodeURIComponent(stateVal)}&city=${encodeURIComponent(cityVal)}`);
      const projData = await projRes.json();
      if (projData.projects) setProjects(projData.projects);
      if (projData.wards) {
        setWards(projData.wards);
        // Default form ward to the first available ward of this city
        if (projData.wards.length > 0) {
          setFormWard(projData.wards[0].name);
        }
      }
    } catch (err) {
      console.error("Error loading server data:", err);
    }
  };

  useEffect(() => {
    loadData(selectedState, selectedCity);
    setSelectedWardId(null); // Clear map filter when changing region
  }, [selectedState, selectedCity]);

  // Sync ward selections from the interactive map to the form dropdown
  const handleMapSelectWard = (wardId: string | null) => {
    setSelectedWardId(wardId);
    if (wardId) {
      // Find matching ward name to auto-fill the form
      const matched = wards.find(w => w.id === wardId);
      if (matched) {
        setFormWard(matched.name);
      }
    }
  };

  // WhatsApp Sync simulation
  const handleWhatsAppSelect = (text: string, ward: string, language: 'en' | 'ml' | 'hi' | 'ta', sender: string) => {
    setFormInputType('whatsapp');
    setFormText(text);
    setFormWard(ward);
    setFormName(`${sender} (via WhatsApp)`);
    setLang(language);
    setActiveTab('intake');
    // Scroll to form smoothly
    setTimeout(() => {
      document.getElementById('suggestion-intake-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Simulated Voice Recording handler
  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording
      clearInterval(timerRef.current);
      setIsRecording(false);
      setRecordingSeconds(0);
      setFormInputType('voice');

      // Populate realistic Malayalam or Hindi voice text based on language
      if (lang === 'ml') {
        setFormText('മെഡിക്കൽ കോളേജ് കാമ്പസിൽ പുതിയ ശുദ്ധജല കിയോസ്കുകൾ അടിയന്തിരമായി സ്ഥാപിക്കണമെന്ന് അഭ്യർത്ഥിക്കുന്നു.');
      } else if (lang === 'hi') {
        setFormText('नेमम प्राथमिक स्वास्थ्य केंद्र में मातृत्व वार्ड का विस्तार आवश्यक है। रोगियों की संख्या बढ़ रही है।');
      } else if (lang === 'ta') {
        setFormText('கோவளம் கடற்கரையில் புதிய வடிகால் குழாய் அமைக்க பொதுமக்கள் கோரிக்கை விடுக்கின்றனர்.');
      } else {
        setFormText('We urgently request pedestrian crossing systems and solar streetlights near Kazhakkoottam main road lanes.');
      }
    } else {
      // Start recording
      setIsRecording(true);
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    }
  };

  // Photo template click simulator
  const handlePhotoTemplate = (imageUrl: string, description: string, ward: string) => {
    setFormInputType('photo');
    setPhotoPreview(imageUrl);
    setFormText(description);
    setFormWard(ward);
  };

  // Generate Letter to MP
  const handleGenerateLetter = async () => {
    if (!formText.trim()) return;
    setGeneratingLetter(true);
    try {
      const response = await fetch('/api/generate-mp-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state: formState,
          city: formCity,
          ward: formWard,
          problemText: formText,
          language: lang
        }),
      });
      const data = await response.json();
      if (data.letter) {
        setGeneratedLetter(data.letter);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to generate letter.");
    } finally {
      setGeneratingLetter(false);
    }
  };

  // Form Submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formText.trim()) return;

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName || 'Anonymous Citizen',
          phone: formPhone,
          language: lang,
          inputType: formInputType,
          originalText: formText,
          ward: formWard,
          photoUrl: formInputType === 'photo' ? (photoPreview || '/assets/pothole.jpg') : undefined,
          audioUrl: formInputType === 'voice' ? '#audio-waveform' : undefined,
          state: selectedState,
          constituency: selectedCity
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSuccess(t.successMsg);
        // Clear intake fields
        setFormText('');
        setFormName('');
        setFormPhone('');
        setPhotoPreview(null);
        setFormInputType('text');

        // Reload lists to show the new submission processed in real-time
        await loadData(selectedState, selectedCity);
      } else {
        setError("Error processing submission. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to backend AI server.");
    } finally {
      setSubmitting(false);
    }
  };

  // Status Action toggles (MPs changing citizen status Received -> Approved -> Actioned)
  const handleStatusToggle = async (subId: string, currentStatus: Submission['status']) => {
    const statuses: Submission['status'][] = ['Received', 'Reviewed', 'Approved', 'Actioned'];
    const nextIdx = (statuses.indexOf(currentStatus) + 1) % statuses.length;
    const nextStatus = statuses[nextIdx];

    try {
      const response = await fetch(`/api/submissions/${subId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (response.ok) {
        // Optimistically update frontend state
        setSubmissions(prev =>
          prev.map(s => (s.id === subId ? { ...s, status: nextStatus } : s))
        );
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  // Count submissions by Ward to compute live heatmap metrics
  const getSubmissionCounts = () => {
    const counts: Record<string, number> = {};
    submissions.forEach(sub => {
      const wardId = sub.ward.toLowerCase().replace(' ', '_');
      counts[wardId] = (counts[wardId] || 0) + 1;
    });
    return counts;
  };

  // Filter submissions list based on selected Ward from interactive Map
  const filteredSubmissions = selectedWardId
    ? (() => {
        const selectedWardName = wards.find(w => w.id === selectedWardId)?.name.toLowerCase();
        return submissions.filter(sub => sub.ward.toLowerCase() === selectedWardName);
      })()
    : submissions;

  // Key Aggregation Stats
  const totalSubmissions = submissions.length;
  const highUrgencyCount = submissions.filter(s => s.urgency === 'High').length;
  const actionedCount = submissions.filter(s => s.status === 'Actioned' || s.status === 'Approved').length;
  const estimatedImpactSum = submissions.reduce((sum, s) => sum + s.impactCount, 0);

  if (showGreeting) {
    return (
      <LanguageGreetingModal 
        onLanguageSelect={(selectedLangCode) => {
          setLang(selectedLangCode);
          setShowGreeting(false);
        }} 
      />
    );
  }

  if (!currentUser) {
    return (
      <AuthScreen 
        onAuthSuccess={(user) => { 
          setCurrentUser(user); 
          setFormName(`${user.firstName} ${user.lastName}`);
          setFormPhone(user.phone || '');
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#070b19] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black relative overflow-x-hidden cyber-grid">
      
      {/* 1. GOVERNMENT BRANDING HEADER BAR */}
      <header className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 py-4 sm:px-6 shadow-2xl relative z-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Emblem + Core Title */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-950 border-2 border-cyan-500/80 flex items-center justify-center p-1 shadow-lg shadow-cyan-500/10">
              <div className="w-full h-full rounded border border-cyan-800/40 flex flex-col items-center justify-center text-[7px] font-mono text-cyan-400 font-extrabold leading-none tracking-tighter">
                <span>SANSAD</span>
                <span className="text-amber-500 text-[6px] my-0.5 font-sans">INDIA</span>
                <span>PORTAL</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-black font-display text-slate-100 tracking-wider uppercase bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
                  {t.title}
                </h1>
                <span className="hidden sm:inline-block text-[9px] bg-cyan-950/50 text-cyan-400 px-2 py-0.5 border border-cyan-500/30 rounded-full font-mono font-bold uppercase tracking-wider animate-pulse">
                  AI CORE OPERATIONAL
                </span>
              </div>
              
              {/* Dynamic State & Constituency selector */}
              <div className="mt-2 flex flex-wrap items-center gap-2.5 bg-slate-900/45 p-1.5 rounded-xl border border-slate-800/60 max-w-fit">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                
                {/* State dropdown */}
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">State/UT:</span>
                  <select
                    id="state-select"
                    value={selectedState}
                    onChange={(e) => {
                      const nextState = e.target.value;
                      setSelectedState(nextState);
                      // Auto-select the first city of the next state
                      const match = INDIAN_STATES_CITIES.find(item => item.state === nextState);
                      if (match && match.cities.length > 0) {
                        setSelectedCity(match.cities[0]);
                      } else {
                        setSelectedCity('Custom');
                      }
                    }}
                    className="bg-slate-950 text-slate-200 text-[11px] font-sans font-bold py-0.5 px-1.5 rounded border border-slate-800 focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    {ALL_INDIAN_STATES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* City dropdown */}
                <div className="flex items-center gap-1 border-l border-slate-800 pl-2.5">
                  <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">City:</span>
                  {(() => {
                    const match = INDIAN_STATES_CITIES.find(item => item.state === selectedState);
                    const list = match ? match.cities : [];
                    return (
                      <select
                        id="city-select"
                        value={list.includes(selectedCity) ? selectedCity : 'Custom'}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === 'Custom') {
                            setSelectedCity('Custom');
                            setCustomCity('');
                          } else {
                            setSelectedCity(val);
                          }
                        }}
                        className="bg-slate-950 text-slate-200 text-[11px] font-sans font-bold py-0.5 px-1.5 rounded border border-slate-800 focus:outline-none focus:border-cyan-500 cursor-pointer"
                      >
                        {list.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                        <option value="Custom">Custom / Other...</option>
                      </select>
                    );
                  })()}
                </div>

                {/* Custom input box if custom/other selected */}
                {(selectedCity === 'Custom' || !INDIAN_STATES_CITIES.flatMap(item => item.cities).includes(selectedCity)) && (
                  <div className="flex items-center gap-1.5 border-l border-slate-800 pl-2.5">
                    <input
                      id="custom-city-input"
                      type="text"
                      placeholder="Enter city..."
                      value={customCity}
                      onChange={(e) => setCustomCity(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && customCity.trim()) {
                          setSelectedCity(customCity.trim());
                        }
                      }}
                      onBlur={() => {
                        if (customCity.trim()) {
                          setSelectedCity(customCity.trim());
                        }
                      }}
                      className="bg-slate-950 text-slate-200 text-[11px] font-sans py-0.5 px-2 rounded border border-cyan-500/30 focus:outline-none focus:border-cyan-400 placeholder:text-slate-600 max-w-[120px]"
                    />
                    <button
                      id="save-custom-city-btn"
                      onClick={() => {
                        if (customCity.trim()) {
                          setSelectedCity(customCity.trim());
                        }
                      }}
                      className="px-1.5 py-0.5 text-[9px] bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded font-bold cursor-pointer font-sans"
                    >
                      APPLY
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Time, Region & Multi-Language Selectors */}
          <div className="flex flex-wrap items-center gap-4">
            
            {/* UTC Real-Time Display */}
            <div className="hidden lg:flex items-center gap-2 text-right bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-300">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <div>
                <span className="text-[10px] text-slate-500 block leading-none uppercase font-bold">Local Standard Time</span>
                <span className="font-semibold">2026-07-03 00:20 UTC</span>
              </div>
            </div>

            {/* User Profile Badge & Dropdown */}
            <div className="relative">
              <button
                id="user-profile-badge-btn"
                onClick={() => setShowProfileCard(!showProfileCard)}
                className="flex items-center gap-2 bg-slate-900/60 hover:bg-slate-850/80 p-1.5 px-3 border border-slate-800 rounded-xl transition-all cursor-pointer"
              >
                <div className="w-6 h-6 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-xs font-bold text-cyan-400">
                  {currentUser.firstName ? currentUser.firstName[0] : ''}{currentUser.lastName ? currentUser.lastName[0] : ''}
                </div>
                <div className="text-left hidden sm:block">
                  <span className="text-[10px] text-slate-500 block leading-none font-mono">
                    {currentUser.isAdmin ? 'REPRESENTATIVE (MP)' : 'CITIZEN'}
                  </span>
                  <span className="text-xs font-extrabold text-slate-200">
                    {currentUser.firstName} {currentUser.lastName}
                  </span>
                </div>
              </button>

              <AnimatePresence>
                {showProfileCard && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2.5 w-72 bg-[#09090b] border border-zinc-800/80 rounded-2xl p-4.5 shadow-2xl z-50 space-y-4 backdrop-blur-md"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-800/60">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center font-bold text-sm text-white">
                          {currentUser.firstName ? currentUser.firstName[0] : ''}{currentUser.lastName ? currentUser.lastName[0] : ''}
                        </div>
                        <div>
                          <h4 className="text-sm font-extrabold text-white">
                            {currentUser.firstName} {currentUser.lastName}
                          </h4>
                          <span className="text-[10px] font-mono uppercase bg-cyan-950 border border-cyan-800/30 px-2 py-0.5 rounded text-cyan-400">
                            {currentUser.isAdmin ? 'Member of Parliament' : 'Verified Citizen'}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (isEditing) {
                            localStorage.setItem('mp_portal_current_user', JSON.stringify(currentUser));
                          }
                          setIsEditing(!isEditing);
                        }}
                        className="text-xs font-bold text-cyan-400 hover:text-cyan-300"
                      >
                        {isEditing ? 'Save' : 'Edit'}
                      </button>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      {[
                        { label: 'Email', key: 'email' },
                        { label: 'Phone', key: 'phone' },
                        { label: 'Gender', key: 'gender' },
                        { label: 'DOB', key: 'dob' },
                        { label: 'State', key: 'state' },
                        { label: 'City', key: 'city' },
                      ].map(field => (
                        <div key={field.key} className="flex justify-between items-center">
                          <span className="text-slate-500 font-medium">{field.label}:</span>
                          {isEditing ? (
                            <input
                              type="text"
                              value={currentUser[field.key]}
                              onChange={(e) => setCurrentUser({...currentUser, [field.key]: e.target.value})}
                              className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200"
                            />
                          ) : (
                            <span className="text-slate-300 font-semibold">{currentUser[field.key]}</span>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4 pt-4 border-t border-zinc-800/60">
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Language</div>
                      <div className="flex items-center gap-1 bg-slate-900/60 p-1 border border-slate-800 rounded-xl">
                        <Languages className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
                        {[
                          { code: 'en', label: 'EN' },
                          { code: 'ml', label: 'മലയാളം' },
                          { code: 'hi', label: 'हिन्दी' },
                          { code: 'ta', label: 'தமிழ்' },
                          ...(!['en', 'ml', 'hi', 'ta'].includes(lang) ? [{
                            code: lang,
                            label: lang === 'bn' ? 'বাংলা' :
                                   lang === 'te' ? 'తెలుగు' :
                                   lang === 'mr' ? 'मराठी' :
                                   lang === 'gu' ? 'ગુજરાતી' :
                                   lang === 'kn' ? 'ಕನ್ನಡ' :
                                   lang === 'pa' ? 'ਪੰਜਾਬੀ' : lang.toUpperCase()
                          }] : [])
                        ].map((langObj) => (
                          <button
                            key={langObj.code}
                            onClick={() => setLang(langObj.code)}
                            className={`px-2 py-1 text-[11px] font-sans font-bold rounded-lg transition-all cursor-pointer ${
                              lang === langObj.code
                                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                                : 'text-slate-400 hover:text-cyan-400'
                            }`}
                          >
                            {langObj.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      id="header-logout-btn"
                      onClick={handleLogout}
                      className="w-full py-2.5 bg-rose-950/40 border border-rose-500/30 hover:bg-rose-900/40 text-rose-400 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-[0.98]"
                    >
                      Log Out Session
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>


          </div>
        </div>
      </header>

      {/* 2. LEGISLATIVE STATS HEADER ACCORDION */}
      <section className="bg-slate-950/40 border-b border-slate-900/80 py-4 px-4 sm:px-6 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-850 p-3.5 rounded-xl flex items-center gap-3 shadow-lg shadow-black/20">
            <div className="p-2 bg-cyan-950/40 border border-cyan-800/30 rounded-lg">
              <Inbox className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block font-mono uppercase font-semibold">Total Submissions</span>
              <strong className="text-sm font-sans font-extrabold text-slate-200">{totalSubmissions} Suggestion(s)</strong>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-850 p-3.5 rounded-xl flex items-center gap-3 shadow-lg shadow-black/20">
            <div className="p-2 bg-rose-950/40 border border-rose-900/30 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block font-mono uppercase font-semibold">AI Critical Urgency</span>
              <strong className="text-sm font-sans font-extrabold text-rose-400">{highUrgencyCount} High Need</strong>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-850 p-3.5 rounded-xl flex items-center gap-3 shadow-lg shadow-black/20">
            <div className="p-2 bg-amber-950/40 border border-amber-900/30 rounded-lg">
              <Building2 className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block font-mono uppercase font-semibold">Approved Actions</span>
              <strong className="text-sm font-sans font-extrabold text-amber-400">{actionedCount} Sanctioned</strong>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-850 p-3.5 rounded-xl flex items-center gap-3 shadow-lg shadow-black/20">
            <div className="p-2 bg-cyan-950/40 border border-cyan-800/30 rounded-lg">
              <Users className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block font-mono uppercase font-semibold">Affected Citizens</span>
              <strong className="text-sm font-sans font-extrabold text-cyan-400">~{estimatedImpactSum.toLocaleString()}</strong>
            </div>
          </div>

        </div>
      </section>

      {/* 3. FEATURE NAVIGATION TABS */}
      <section className="max-w-7xl w-full mx-auto px-4 sm:px-6 mt-6 relative z-10 animate-fade-in">
        <div className="bg-slate-900/60 backdrop-blur-md p-1.5 border border-slate-800/80 rounded-2xl">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1.5">
            {[
              { id: 'intake', label: 'Intake Hub', icon: Sparkles, count: null },
              { id: 'map', label: 'Spatial Map', icon: MapPin, count: null },
              { id: 'proposals', label: 'AI Proposal Desk', icon: FileText, count: selectedProjectForReport ? 'Active' : null },
              { id: 'feed', label: 'Live Dispatch Feed', icon: Inbox, count: totalSubmissions }
            ].map((tabItem) => {
              const IconComp = tabItem.icon;
              const isActive = activeTab === tabItem.id;
              return (
                <button
                  key={tabItem.id}
                  id={`tab-btn-${tabItem.id}`}
                  onClick={() => setActiveTab(tabItem.id as any)}
                  className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer relative ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-xl shadow-cyan-500/15 border border-cyan-400/20'
                      : 'text-slate-400 hover:text-cyan-400 hover:bg-slate-950/40 border border-transparent'
                  }`}
                >
                  <IconComp className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{tabItem.label}</span>
                  {tabItem.count !== null && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-extrabold ${
                      isActive 
                        ? 'bg-cyan-900/40 text-cyan-200 border border-cyan-400/30' 
                        : 'bg-slate-950 text-slate-500 border border-slate-800'
                    }`}>
                      {tabItem.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. MAIN WORKSPACE */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 relative z-10">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: CITIZEN INTAKE & ENGAGEMENT HUB */}
          {activeTab === 'intake' && (
            <motion.div
              key="intake-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
            >
              {/* CITIZEN SUGGESTION INTAKE */}
              <div id="suggestion-intake-form" className="lg:col-span-6 space-y-6">
                <div className="bg-slate-900/65 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 shadow-2xl shadow-cyan-950/10 space-y-5">
                  <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
                    <div className="p-1.5 bg-cyan-950/50 border border-cyan-850/40 rounded-lg">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-100 font-display tracking-wide uppercase">
                        {t.submitSuggestion}
                      </h2>
                      <span className="text-[9px] text-slate-500 font-mono font-bold tracking-wider">SECURE CITIZEN DISPATCH</span>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                        <User className="w-3.5 h-3.5 text-cyan-400" />
                        {t.citizenName}
                      </label>
                      <input
                        id="citizen-name"
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="e.g., Harish Kumar"
                        className="w-full text-xs bg-slate-950/60 border border-slate-800 focus:border-cyan-500/50 rounded-xl p-3 text-slate-100 placeholder-slate-655 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                        <Phone className="w-3.5 h-3.5 text-cyan-400" />
                        {t.phoneOptional}
                      </label>
                      <input
                        id="citizen-phone"
                        type="text"
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        placeholder="e.g., +91 94471 XXXXX"
                        className="w-full text-xs bg-slate-950/60 border border-slate-800 focus:border-cyan-500/50 rounded-xl p-3 text-slate-100 placeholder-slate-655 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                        State & City
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={formState}
                          onChange={(e) => {
                            const nextState = e.target.value;
                            setFormState(nextState);
                            const match = INDIAN_STATES_CITIES.find(item => item.state === nextState);
                            if (match && match.cities.length > 0) {
                              setFormCity(match.cities[0]);
                            } else {
                              setFormCity('Custom');
                            }
                          }}
                          className="w-full text-xs bg-slate-950/60 border border-slate-800 focus:border-cyan-500/50 rounded-xl p-3 text-slate-100 focus:outline-none cursor-pointer"
                        >
                          {ALL_INDIAN_STATES.map(state => (
                            <option key={state} value={state} className="bg-slate-955 text-slate-100">
                              {state}
                            </option>
                          ))}
                        </select>
                        <select
                          value={formCity}
                          onChange={(e) => setFormCity(e.target.value)}
                          className="w-full text-xs bg-slate-950/60 border border-slate-800 focus:border-cyan-500/50 rounded-xl p-3 text-slate-100 focus:outline-none cursor-pointer"
                        >
                          {(INDIAN_STATES_CITIES.find(item => item.state === formState)?.cities || []).map(city => (
                            <option key={city} value={city} className="bg-slate-955 text-slate-100">
                              {city}
                            </option>
                          ))}
                          <option value="Custom">Custom</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                        {t.selectWard}
                      </label>
                      <select
                        id="ward-select"
                        value={formWard}
                        onChange={(e) => setFormWard(e.target.value)}
                        className="w-full text-xs bg-slate-950/60 border border-slate-800 focus:border-cyan-500/50 rounded-xl p-3 text-slate-100 focus:outline-none cursor-pointer"
                      >
                        {wards.map((ward) => (
                          <option key={ward.id} value={ward.name} className="bg-slate-955 text-slate-100">
                            {ward.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">
                        Input Format Selection
                      </span>
                      <div className="grid grid-cols-3 gap-1 bg-slate-955 p-1 border border-slate-850 rounded-xl">
                        {['text', 'voice', 'photo'].map((type) => (
                          <button
                            key={type}
                            type="button"
                            id={`input-type-${type}`}
                            onClick={() => {
                              setFormInputType(type as any);
                              setFormText('');
                              setPhotoPreview(null);
                            }}
                            className={`py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer font-mono uppercase tracking-wider ${
                              formInputType === type
                                ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/30 shadow-lg'
                                : 'text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            {type === 'voice' ? 'Voice Note' : type}
                          </button>
                        ))}
                      </div>
                    </div>

                    <AnimatePresence mode="wait">
                      {formInputType === 'text' && (
                        <motion.div
                          key="text-input"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="space-y-1"
                        >
                          <textarea
                            id="text-suggestion"
                            rows={4}
                            required
                            value={formText}
                            onChange={(e) => setFormText(e.target.value)}
                            placeholder={t.suggestionPlaceholder}
                            className="w-full text-xs bg-slate-950/60 border border-slate-800 focus:border-cyan-500/50 rounded-xl p-3 text-slate-100 placeholder-slate-650 focus:outline-none"
                          />
                        </motion.div>
                      )}

                      {formInputType === 'voice' && (
                        <motion.div
                          key="voice-input"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="p-4 bg-slate-950/60 border border-slate-850 rounded-xl text-center space-y-3"
                        >
                          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block">
                            {t.voiceNote} Recorder
                          </span>

                          <div className="flex items-center justify-center gap-3">
                            <button
                              type="button"
                              id="btn-voice-record"
                              onClick={toggleRecording}
                              className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                                isRecording
                                  ? 'bg-rose-950/30 border-rose-500/60 text-rose-500 animate-pulse'
                                  : 'bg-slate-900 border border-slate-850 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-450'
                              }`}
                            >
                              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                            </button>

                            {isRecording && (
                              <div className="text-left font-mono">
                                <span className="text-xs text-rose-500 font-bold block animate-pulse">
                                  ● Recording...
                                </span>
                                <span className="text-[10px] text-slate-500">
                                  Duration: {recordingSeconds}s
                                </span>
                              </div>
                            )}
                          </div>

                          {isRecording ? (
                            <div className="flex items-center justify-center gap-1.5 h-6">
                              {[0.8, 0.4, 0.95, 0.5, 0.7, 0.35, 0.85].map((val, i) => (
                                <span
                                  key={i}
                                  className="w-1 bg-cyan-500 rounded-full transition-all duration-150 animate-bounce"
                                  style={{
                                    height: `${val * 100}%`,
                                    animationDelay: `${i * 0.1}s`,
                                  }}
                                ></span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[10px] text-slate-500 italic font-sans px-2 leading-relaxed">
                              Click microphone to simulate a real-time speech-to-text voice representation in the target language.
                            </p>
                          )}

                          {formText && !isRecording && (
                            <div className="text-left border-t border-slate-850 pt-2.5 mt-2.5">
                              <span className="text-[9px] text-cyan-400 font-mono font-bold block uppercase tracking-wide">
                                AI Voice Transcription
                              </span>
                              <p className="text-xs text-slate-300 font-sans italic mt-1 bg-slate-950 p-3 rounded-xl border border-slate-850 shadow-inner">
                                "{formText}"
                              </p>
                            </div>
                          )}
                        </motion.div>
                      )}

                      {formInputType === 'photo' && (
                        <motion.div
                          key="photo-input"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="space-y-3"
                        >
                          <div className="border border-dashed border-slate-800 bg-slate-955/40 rounded-xl p-4 text-center cursor-pointer hover:border-cyan-500/40 hover:bg-slate-900/20 transition-all flex flex-col items-center justify-center gap-2">
                            <Upload className="w-6 h-6 text-slate-500" />
                            <span className="text-xs font-semibold text-slate-300">{t.photoUpload}</span>
                            <p className="text-[10px] text-slate-500">{t.photoDragDrop}</p>
                          </div>

                          <div className="space-y-1.5">
                            <span className="text-[10px] font-mono text-slate-500 block uppercase font-bold">
                              Choose Issue Photo Template:
                            </span>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                id="photo-temp-water"
                                onClick={() => handlePhotoTemplate('/assets/pipe_leak.jpg', 'ഉള്ളൂർ റോഡിൽ പ്രധാന കുടിവെള്ള പൈപ്പ് പൊട്ടി വെള്ളം പാഴാകുന്നു. അറ്റകുറ്റപ്പണികൾ ഉടൻ ചെയ്യണം.', 'Ulloor')}
                                className="text-left p-2.5 rounded-lg border border-slate-850 bg-slate-950 text-slate-300 text-[10px] hover:border-cyan-500/40 hover:bg-slate-900/60 font-sans transition-all cursor-pointer"
                              >
                                💧 Water Pipeline Burst
                              </button>
                              <button
                                type="button"
                                id="photo-temp-school"
                                onClick={() => handlePhotoTemplate('/assets/school_damage.jpg', 'കഴക്കൂട്ടം സ്കൂളിലെ കെട്ടിടത്തിന്റെ മേൽക്കൂര തകർന്നു വീഴാറായി കിടക്കുന്നു. കുട്ടികൾക്ക് അപകട ഭീഷണി ഉണ്ട്.', 'Kazhakkoottam')}
                                className="text-left p-2.5 rounded-lg border border-slate-855 bg-slate-950 text-slate-300 text-[10px] hover:border-cyan-500/40 hover:bg-slate-900/60 font-sans transition-all cursor-pointer"
                              >
                                🏫 Broken Classroom Roof
                              </button>
                              <button
                                type="button"
                                id="photo-temp-pothole"
                                onClick={() => handlePhotoTemplate('/assets/potholes.jpg', 'நெமம் சாலையில் பெரிய பள்ளங்கள் உள்ளன. போக்குவரத்து முடங்கி கிடக்கிறது.', 'Nemom')}
                                className="text-left p-2.5 rounded-lg border border-slate-850 bg-slate-955 text-slate-300 text-[10px] hover:border-cyan-500/40 hover:bg-slate-900/60 font-sans transition-all cursor-pointer"
                              >
                                🚗 Deep Highway Potholes
                              </button>
                              <button
                                type="button"
                                id="photo-temp-drain"
                                onClick={() => handlePhotoTemplate('/assets/clogged_drain.jpg', 'कोवलम बीच के पास जल निकासी व्यवस्था अवरुद्ध है। गंदा पानी सड़क पर आ रहा है।', 'Kovalam')}
                                className="text-left p-2.5 rounded-lg border border-slate-850 bg-slate-950 text-slate-300 text-[10px] hover:border-cyan-500/40 hover:bg-slate-900/60 font-sans transition-all cursor-pointer"
                              >
                                🌊 Clogged Drainage Canal
                              </button>
                            </div>
                          </div>

                          {photoPreview && (
                            <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950 p-2.5 space-y-1 shadow-sm">
                              <span className="text-[9px] text-cyan-400 font-mono font-semibold uppercase block tracking-wider">Template Attached Preview</span>
                              <div className="h-28 rounded-lg bg-slate-900/40 border border-slate-850 flex items-center justify-center relative overflow-hidden">
                                <span className="text-[10px] text-slate-400 font-mono z-10 text-center px-4 leading-relaxed">
                                  Simulated Attachment:<br/>
                                  <strong className="text-slate-200">{photoPreview}</strong>
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-350 font-sans italic p-2 bg-slate-950 border border-slate-850 rounded mt-1">"{formText}"</p>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {error && (
                      <div className="p-2.5 bg-rose-950/40 border border-rose-500/30 rounded-xl text-rose-400 text-[11px] leading-relaxed">
                        {error}
                      </div>
                    )}

                    {success && (
                      <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-emerald-400 text-[11px] leading-relaxed flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        {success}
                      </div>
                    )}

                    <button
                      type="submit"
                      id="btn-submit-form"
                      disabled={submitting || !formText.trim()}
                      className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 border border-cyan-500/30 text-white font-display font-bold text-xs py-3 px-4 rounded-xl shadow-lg shadow-cyan-500/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {submitting ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
                          {t.processing}
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 animate-pulse text-cyan-300" />
                          {t.submitBtn}
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      id="btn-generate-letter"
                      disabled={generatingLetter || !formText.trim()}
                      onClick={handleGenerateLetter}
                      className="w-full bg-slate-800 hover:bg-slate-700 disabled:bg-slate-800 disabled:text-slate-500 border border-slate-700 text-slate-200 font-display font-bold text-xs py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {generatingLetter ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-slate-400/30 border-t-slate-400 rounded-full animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <FileText className="w-3.5 h-3.5 text-cyan-300" />
                          Draft Letter to MP
                        </>
                      )}
                    </button>

                    {generatedLetter && (
                      <div className="mt-6 p-5 bg-slate-950 border border-cyan-500/30 rounded-2xl text-slate-300 text-xs font-sans whitespace-pre-wrap leading-relaxed shadow-inner">
                        <h3 className="font-bold text-cyan-400 mb-2">Drafted MP Letter</h3>
                        {generatedLetter}
                      </div>
                    )}
                  </form>
                </div>
              </div>

              {/* WHATSAPP HELPLINE SYNC */}
              <div className="lg:col-span-6">
                <WhatsAppPreview onSelectMessage={handleWhatsAppSelect} />
              </div>
            </motion.div>
          )}

          {/* TAB 2: SPATIAL ANALYTICS MAP */}
          {activeTab === 'map' && (
            <motion.div
              key="map-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-1 shadow-2xl">
                <GoogleMapComponent
                  cityName={selectedCity}
                  wards={wards}
                  submissions={submissions}
                  selectedWardId={selectedWardId}
                  onSelectWard={handleMapSelectWard}
                />
              </div>

              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-850 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-cyan-400 animate-bounce" />
                    Interactive Spatial Analysis Grid
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-2xl font-sans">
                    Each polygon represents a critical local division within {selectedCity}. Use the heatmap metric switcher on the map to filter division density by submissions, schools, healthcare clinics, or water pipeline conditions. Click on any sector to filter suggestions and target focal zones.
                  </p>
                </div>
                {selectedWardId ? (
                  <button
                    id="btn-view-filtered-feed"
                    onClick={() => setActiveTab('feed')}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/10 cursor-pointer font-sans shrink-0"
                  >
                    View Ward Feed ({filteredSubmissions.length}) →
                  </button>
                ) : (
                  <button
                    id="btn-view-all-feed"
                    onClick={() => setActiveTab('feed')}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-355 font-bold text-xs rounded-xl cursor-pointer font-sans shrink-0"
                  >
                    Browse Entire Feed ({submissions.length}) →
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 3: DYNAMIC PRIORITY SANDBOX */}
          {activeTab === 'sandbox' && (
            <motion.div
              key="sandbox-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <PrioritySandbox
                projects={projects}
                onSelectProjectForReport={(proj) => {
                  setSelectedProjectForReport(proj);
                  setActiveTab('proposals');
                  setTimeout(() => {
                    document.getElementById('ai-report-desk')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                selectedProject={selectedProjectForReport}
              />
            </motion.div>
          )}

          {/* TAB 4: LEGISLATIVE PROPOSAL GENERATOR DESK */}
          {activeTab === 'proposals' && (
            <motion.div
              key="proposals-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div id="ai-proposal-desk">
                <AIProposalDesk 
                  state={formState}
                  city={formCity}
                  ward={formWard}
                  language={lang}
                  currentUser={currentUser}
                />
              </div>
            </motion.div>
          )}

          {/* TAB 5: MULTILINGUAL CITIZEN FEED */}
          {activeTab === 'feed' && (
            <motion.div
              key="feed-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-850 pb-3 gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-100 font-sans tracking-tight">
                      {t.activeFeed}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-mono">
                      MULTILINGUAL CONSOLIDATED DISPATCH CENTER
                    </p>
                  </div>

                  {/* Reset ward filter if set */}
                  {selectedWardId && (
                    <div className="text-[11px] font-mono text-cyan-400 bg-cyan-950/30 border border-cyan-500/30 px-2.5 py-1 rounded-full flex items-center gap-1.5 self-start font-semibold">
                      Filter: {wards.find(w => w.id === selectedWardId)?.name}
                      <button
                        id="btn-remove-feed-filter"
                        onClick={() => setSelectedWardId(null)}
                        className="hover:text-cyan-350 font-bold ml-1 font-sans text-[10px] uppercase cursor-pointer"
                      >
                        [Clear]
                      </button>
                    </div>
                  )}
                </div>

                {/* Submissions Stream */}
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                  {filteredSubmissions.length > 0 ? (
                    filteredSubmissions.map((sub) => (
                      <div
                        key={sub.id}
                        id={`feed-card-${sub.id}`}
                        className="bg-slate-955/40 border border-slate-850 hover:border-cyan-500/30 rounded-xl p-4 transition-all duration-200 relative overflow-hidden space-y-3.5"
                      >
                        
                        {/* Badge header strip */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-855 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-200 font-sans">{sub.name}</span>
                            <span className="text-[9px] bg-slate-900 border border-slate-800 text-slate-350 px-2 py-0.5 rounded font-mono">
                              {sub.ward}
                            </span>
                            
                            {/* Source device/channel icon */}
                            {sub.inputType === 'whatsapp' && (
                              <span className="text-[9px] text-emerald-400 font-mono flex items-center gap-0.5 font-semibold" title="WhatsApp Channel">
                                <MessageSquare className="w-3 h-3 text-emerald-500" /> WhatsApp
                              </span>
                            )}
                            {sub.inputType === 'voice' && (
                              <span className="text-[9px] text-cyan-400 font-mono flex items-center gap-0.5 font-semibold" title="Voice Recorded Channel">
                                <Mic className="w-3 h-3 text-cyan-500" /> Voice
                              </span>
                            )}
                            {sub.inputType === 'photo' && (
                              <span className="text-[9px] text-amber-400 font-mono flex items-center gap-0.5 font-semibold" title="Photo Attachment Channel">
                                <Upload className="w-3 h-3 text-amber-500" /> Photo
                              </span>
                            )}
                          </div>

                          <span className="text-[10px] text-slate-500 font-mono">
                            {new Date(sub.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        {/* Original & translated content panels */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                          
                          {/* Original panel */}
                          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850 space-y-1">
                            <span className="text-[9px] font-bold font-mono text-slate-500 uppercase block tracking-wider">
                              {t.original} (Language: {sub.language.toUpperCase()})
                            </span>
                            <p className="text-xs text-slate-300 font-sans leading-relaxed">
                              "{sub.originalText}"
                            </p>
                          </div>

                          {/* AI Translation/Summarized panel */}
                          <div className="bg-cyan-950/20 p-2.5 rounded-lg border border-cyan-500/10 space-y-1">
                            <span className="text-[9px] font-bold font-mono text-cyan-400 uppercase block tracking-wider flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-cyan-400" />
                              {t.aiTranslation}
                            </span>
                            <p className="text-xs text-slate-200 font-sans leading-relaxed">
                              "{sub.translatedText}"
                            </p>
                          </div>

                        </div>

                        {/* AI metadata footer row */}
                        <div className="flex flex-wrap items-center justify-between gap-y-3 gap-x-4 border-t border-slate-855 pt-3 text-[10px] font-mono">
                          
                          <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2">
                            <span className="text-slate-500">
                              {t.category}: <strong className="text-slate-300">{sub.category}</strong>
                            </span>

                            <span className="flex items-center gap-1 text-slate-500">
                              {t.urgency}: 
                              <span className={`px-2 py-0.5 rounded font-bold text-[9px] uppercase ${
                                sub.urgency === 'High'
                                  ? 'bg-rose-950/40 text-rose-400 border border-rose-500/30'
                                  : sub.urgency === 'Medium'
                                  ? 'bg-amber-950/40 text-amber-400 border border-amber-500/30'
                                  : 'bg-slate-900 text-slate-400 border border-slate-800'
                              }`}>
                                {sub.urgency}
                              </span>
                            </span>

                            <span className="text-slate-500">
                              Affected citizens: <strong className="text-slate-300">~{sub.impactCount}</strong>
                            </span>
                          </div>

                          <button
                            id={`btn-feed-status-${sub.id}`}
                            onClick={() => handleStatusToggle(sub.id, sub.status)}
                            className={`px-2.5 py-1 rounded text-[10px] font-bold font-sans border transition-all flex items-center gap-1.5 cursor-pointer ${
                              sub.status === 'Received'
                                ? 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850'
                                : sub.status === 'Reviewed'
                                ? 'bg-cyan-950/40 border-cyan-500/30 text-cyan-400 hover:bg-cyan-950/60'
                                : sub.status === 'Approved'
                                ? 'bg-amber-950/40 border-amber-500/30 text-amber-400 hover:bg-amber-950/60'
                                : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400 hover:bg-emerald-950/60'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                            Status: {sub.status}
                          </button>

                        </div>

                      </div>
                    ))
                  ) : (
                    <div className="bg-slate-950/40 border border-dashed border-slate-850 rounded-xl p-8 text-center">
                      <Inbox className="w-8 h-8 text-slate-650 mx-auto mb-2" />
                      <p className="text-xs text-slate-500 font-sans italic leading-relaxed">
                        No submissions currently matching the selected ward filter. Click "All Wards" or select another ward on the map.
                      </p>
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* FOOTER COGNIZANCE */}
      <footer className="bg-slate-950 border-t border-slate-850 py-8 px-4 mt-12 text-center text-xs text-slate-500 font-sans space-y-2">
        <p>© 2026 Office of the Member of Parliament. All legislative datasets secured by AI clearance protocols.</p>
        <p className="text-[10px] font-mono text-cyan-400/40">
          Kerala Police Innovation Core Inspired Concept • Devised via Gemini-3.5-flash
        </p>
      </footer>

    </div>
  );
}
