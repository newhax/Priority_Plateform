import React, { useState, useEffect, useRef, useMemo, FormEvent } from 'react';
import { Submission, ProposedProject } from './types';
import { translations, getTranslation } from './components/translations';
import { GoogleMapComponent } from './components/GoogleMapComponent';
import { ReportGenerator } from './components/ReportGenerator';
import { PrioritySandbox } from './components/PrioritySandbox';
import { AIProposalDesk } from './components/AIProposalDesk';
import { GrievanceSentimentRadar } from './components/GrievanceSentimentRadar';

import { CitizenFeed } from './components/CitizenFeed';
import { INDIAN_STATES_CITIES, ALL_INDIAN_STATES } from './seedData';
import { AuthScreen } from './components/AuthScreen';
import { LanguageGreetingModal, ALL_INDIAN_LANGUAGES } from './components/LanguageGreetingModal';
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
  Globe,
  Download,
  X,
  Brain,
  Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { generateGrievancePDF } from './utils/pdfGenerator';
import { AISuggestionTab } from './components/AISuggestionTab';

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

export default function App() {
  if (hasValidKey) {
    return (
      <APIProvider apiKey={API_KEY} version="weekly">
        <AppContent />
      </APIProvider>
    );
  }
  return <AppContent />;
}

function AppContent() {
  const [lang, setLang] = useState<string>('en');
  const [showGreeting, setShowGreeting] = useState<boolean>(false);
  const [selectedState, setSelectedState] = useState<string>('Kerala');
  const [selectedCity, setSelectedCity] = useState<string>('Thiruvananthapuram');
  const [formState, setFormState] = useState<string>('Kerala');
  const [formCity, setFormCity] = useState<string>('Thiruvananthapuram');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [feedScope, setFeedScope] = useState<'local' | 'national' | 'mine' | 'near'>('local');
  const [projects, setProjects] = useState<ProposedProject[]>([]);
  const [userSubmissions, setUserSubmissions] = useState<Submission[]>([]);
  const [selectedProjectForReport, setSelectedProjectForReport] = useState<ProposedProject | null>(null);
  const [activeTab, setActiveTab] = useState<'intake' | 'map' | 'proposals' | 'feed' | 'history' | 'suggestions' | 'sandbox'>('intake');
  const [liveUserCoords, setLiveUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [detectingLocation, setDetectingLocation] = useState<boolean>(false);

  // Dynamically calculate coordinates of proposed projects based on their categories' submissions
  const enrichedProjects = useMemo(() => {
    return projects.map(proj => {
      // If project already has coordinates, use them
      if (proj.latitude && proj.longitude) return proj;

      const matchingSubs = submissions.filter(s => s.category === proj.category && s.latitude && s.longitude);
      let lat = proj.latitude;
      let lng = proj.longitude;

      if (matchingSubs.length > 0) {
        const latSum = matchingSubs.reduce((sum, s) => sum + (s.latitude || 0), 0);
        const lngSum = matchingSubs.reduce((sum, s) => sum + (s.longitude || 0), 0);
        
        // Add a small deterministic offset based on project ID to prevent overlay stacking
        const hash = proj.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const offsetLat = ((hash % 10) - 5) * 0.0006;
        const offsetLng = (((hash >> 2) % 10) - 5) * 0.0006;

        lat = (latSum / matchingSubs.length) + offsetLat;
        lng = (lngSum / matchingSubs.length) + offsetLng;
      } else {
        // Fallback scatter around a stable center (e.g. 8.508, 76.953 or Thiruvananthapuram)
        const hash = proj.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const offsetLat = ((hash % 16) - 8) * 0.0015;
        const offsetLng = (((hash >> 3) % 16) - 8) * 0.0015;
        const centerLat = liveUserCoords?.lat || 8.5241;
        const centerLng = liveUserCoords?.lng || 76.9366;
        lat = centerLat + offsetLat;
        lng = centerLng + offsetLng;
      }

      return {
        ...proj,
        latitude: lat,
        longitude: lng
      };
    });
  }, [projects, submissions, liveUserCoords]);

  const [headerCities, setHeaderCities] = useState<string[]>([]);
  const [formCities, setFormCities] = useState<string[]>([]);

  // Fetch cities for global header state
  useEffect(() => {
    const list = INDIAN_STATES_CITIES.find(item => item.state === selectedState)?.cities || [];
    setHeaderCities(list);
    if (list.length > 0 && !list.includes(selectedCity)) {
      setSelectedCity(list[0]);
    }
  }, [selectedState]);

  // Fetch cities for intake form state
  useEffect(() => {
    const list = INDIAN_STATES_CITIES.find(item => item.state === formState)?.cities || [];
    setFormCities(list);
    if (list.length > 0 && !list.includes(formCity)) {
      setFormCity(list[0]);
    }
  }, [formState]);

  // Synchronize intake form selection with global header selection
  useEffect(() => {
    setFormState(selectedState);
  }, [selectedState]);

  useEffect(() => {
    setFormCity(selectedCity);
  }, [selectedCity]);

  // User Authentication State
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showProfileCard, setShowProfileCard] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showNavMenu, setShowNavMenu] = useState<boolean>(false);

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

  const loadUserSubmissions = async () => {
    if (!currentUser) return;
    try {
      const nameParam = encodeURIComponent(`${currentUser.firstName} ${currentUser.lastName}`);
      const phoneParam = encodeURIComponent(currentUser.phone || '');
      const res = await fetch(`/api/submissions/user?name=${nameParam}&phone=${phoneParam}`);
      
      if (!res.ok) {
        const text = await res.text();
        console.error("Submission fetch failed:", text.substring(0, 200));
        return;
      }

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        if (data.submissions) {
          setUserSubmissions(data.submissions);
        }
      } else {
        const text = await res.text();
        console.error("Expected JSON but got HTML/Text. First 100 chars:", text.substring(0, 100));
      }
    } catch (err) {
      console.error("Error loading user submissions:", err);
    }
  };

  useEffect(() => {
    loadUserSubmissions();
  }, [currentUser]);

  useEffect(() => {
    if (activeTab === 'history') {
      loadUserSubmissions();
    }
  }, [activeTab]);

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
    setUserSubmissions([]);
    setShowProfileCard(false);
  };

  // Form State
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formTextDesc, setFormTextDesc] = useState('');
  const [formPhotoDesc, setFormPhotoDesc] = useState('');
  const [formVoiceDesc, setFormVoiceDesc] = useState('');
  const [formInputType, setFormInputType] = useState<Submission['inputType']>('text');
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

  // Grievance Preview Modal State
  const [showGrievanceModal, setShowGrievanceModal] = useState(false);
  const [pendingGrievance, setPendingGrievance] = useState<any>(null);
  const [submittingGrievance, setSubmittingGrievance] = useState(false);

  // Interactive States
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const [dragActive, setDragActive] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [voicePlaybackDuration, setVoicePlaybackDuration] = useState(0);
  const [voicePlaybackCurrentTime, setVoicePlaybackCurrentTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = getTranslation(lang);
  const timerRef = useRef<any>(null);

  const getFallbackTextForLang = (l: string) => {
    if (l === 'ml') return 'മെഡിക്കൽ കോളേജ് കാമ്പസിൽ പുതിയ ശുദ്ധജല കിയോസ്കുകൾ അടിയന്തിരമായി സ്ഥാപിക്കണമെന്ന് അഭ്യർത്ഥിക്കുന്നു.';
    if (l === 'hi') return 'नेमम प्राथमिक स्वास्थ्य केंद्र में मातृत्व वार्ड का विस्तार आवश्यक है। रोगियों की संख्या बढ़ रही है।';
    if (l === 'ta') return 'கோவளம் கடற்கரையில் புதிய வடிகால் குழாய் அமைக்க பொதுமக்கள் கோரிக்கை விடுக்கின்றனர்.';
    return 'We urgently request pedestrian crossing systems and solar streetlights near Kazhakkoottam main road lanes.';
  };

  const transcribeAudioBlob = async (blob: Blob) => {
    setIsTranscribing(true);
    setFormVoiceDesc('');
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
              language: lang,
              mimeType: blob.type
            }),
          });
          
          const responseText = await res.text();
          if (!res.ok) {
            console.error("Server error response:", responseText);
            throw new Error(`Server responded with ${res.status}: ${responseText}`);
          }
          
          let data;
          try {
            data = JSON.parse(responseText);
          } catch (e) {
            console.error("Failed to parse JSON response:", responseText);
            throw new Error("Invalid JSON response from server");
          }
          
          if (data.success && data.transcription) {
            setFormVoiceDesc(data.transcription);
            if (data.detectedLanguage && data.detectedLanguage !== lang) {
              setLang(data.detectedLanguage);
            }
          } else {
            throw new Error(data.error || "Failed to transcribe");
          }
        } catch (err) {
          console.error("Transcription API error:", err);
          setFormVoiceDesc(getFallbackTextForLang(lang));
        } finally {
          setIsTranscribing(false);
        }
      };
    } catch (err) {
      console.error("Error reading audio blob:", err);
      setFormVoiceDesc(getFallbackTextForLang(lang));
      setIsTranscribing(false);
    }
  };

  // Rich audio recording and playbacks for voice suggestions
  const startRecording = async () => {
    setAudioUrl(null);
    setIsAudioPlaying(false);
    setVoicePlaybackCurrentTime(0);
    setVoicePlaybackDuration(0);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          const url = URL.createObjectURL(audioBlob);
          setAudioUrl(url);
          // Stop all stream tracks to release the mic
          stream.getTracks().forEach(track => track.stop());
          transcribeAudioBlob(audioBlob);
        };

        mediaRecorder.start();
        setIsRecording(true);
        setRecordingSeconds(0);
        timerRef.current = setInterval(() => {
          setRecordingSeconds((prev) => prev + 1);
        }, 1000);
      } else {
        throw new Error("Navigator mediaDevices not supported");
      }
    } catch (err) {
      console.warn("Microphone access not available/denied. Falling back to simulated speech recording.", err);
      // Fallback simulated recording
      setIsRecording(true);
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      clearInterval(timerRef.current);
      setIsRecording(false);
      setRecordingSeconds(0);
      setFormInputType('voice');
    } else {
      // Simulated stop fallback
      clearInterval(timerRef.current);
      setIsRecording(false);
      setRecordingSeconds(0);
      setFormInputType('voice');
      // Create a simulated pleasant play URL
      setAudioUrl('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
      setFormVoiceDesc(getFallbackTextForLang(lang));
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handlePlayVoiceNote = () => {
    if (!audioUrl) return;

    if (!audioPlayerRef.current) {
      const audio = new Audio(audioUrl);
      audioPlayerRef.current = audio;
      
      audio.onloadedmetadata = () => {
        setVoicePlaybackDuration(audio.duration || 8);
      };

      audio.ontimeupdate = () => {
        setVoicePlaybackCurrentTime(audio.currentTime || 0);
      };

      audio.onended = () => {
        setIsAudioPlaying(false);
        setVoicePlaybackCurrentTime(0);
      };
    } else if (audioPlayerRef.current.src !== audioUrl) {
      audioPlayerRef.current.pause();
      const audio = new Audio(audioUrl);
      audioPlayerRef.current = audio;
      
      audio.onloadedmetadata = () => {
        setVoicePlaybackDuration(audio.duration || 8);
      };

      audio.ontimeupdate = () => {
        setVoicePlaybackCurrentTime(audio.currentTime || 0);
      };

      audio.onended = () => {
        setIsAudioPlaying(false);
        setVoicePlaybackCurrentTime(0);
      };
    }

    if (isAudioPlaying) {
      audioPlayerRef.current.pause();
      setIsAudioPlaying(false);
    } else {
      audioPlayerRef.current.play()
        .then(() => {
          setIsAudioPlaying(true);
        })
        .catch((err) => {
          console.error("Audio playback failed, starting simulated visual progress", err);
          setIsAudioPlaying(true);
          const simulatedDuration = 8;
          setVoicePlaybackDuration(simulatedDuration);
          
          let curTime = voicePlaybackCurrentTime;
          const interval = setInterval(() => {
            if (!isAudioPlaying) {
              clearInterval(interval);
              return;
            }
            curTime += 0.5;
            if (curTime >= simulatedDuration) {
              clearInterval(interval);
              setIsAudioPlaying(false);
              setVoicePlaybackCurrentTime(0);
            } else {
              setVoicePlaybackCurrentTime(curTime);
            }
          }, 500);
        });
    }
  };

  // Load submissions and projects from our Express API on mount or region change
  const loadData = async (stateVal: string, cityVal: string, scopeOverride?: 'local' | 'national' | 'mine') => {
    try {
      const activeScope = scopeOverride || feedScope;
      const subUrl = (activeScope === 'national' || activeScope === 'mine')
        ? `/api/submissions?all=true`
        : `/api/submissions?state=${encodeURIComponent(stateVal)}&city=${encodeURIComponent(cityVal)}`;
      
      const subRes = await fetch(subUrl);
      const subData = await subRes.json();
      if (subData.submissions) setSubmissions(subData.submissions);

      const projRes = await fetch(`/api/projects?state=${encodeURIComponent(stateVal)}&city=${encodeURIComponent(cityVal)}`);
      const projData = await projRes.json();
      if (projData.projects) setProjects(projData.projects);
    } catch (err) {
      console.error("Error loading server data:", err);
    }
  };

  useEffect(() => {
    loadData(selectedState, selectedCity, feedScope);
  }, [selectedState, selectedCity, feedScope]);

  // WhatsApp Sync simulation
  const handleWhatsAppSelect = (text: string, language: 'en' | 'ml' | 'hi' | 'ta', sender: string) => {
    setFormInputType('whatsapp');
    setFormTextDesc(text);
    setFormName(`${sender} (via WhatsApp)`);
    setLang(language);
    setActiveTab('intake');
    // Scroll to form smoothly
    setTimeout(() => {
      document.getElementById('suggestion-intake-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };





  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files as FileList).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotoPreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
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
      Array.from(files as FileList).forEach((file: File) => {
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


  // Auto detect user live location
  const handleAutoDetectLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setDetectingLocation(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const coords = { lat: latitude, lng: longitude };
        setLiveUserCoords(coords);
        setDetectingLocation(false);
        setSuccess(`Live GPS location verified: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);

        // Reverse geocoding if Google Maps API is loaded
        if (window.google?.maps?.Geocoder) {
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: coords }, (results, status) => {
            if (status === 'OK' && results?.[0]) {
              let stateName = '';
              let cityName = '';
              for (const component of results[0].address_components) {
                if (component.types.includes('administrative_area_level_1')) {
                  stateName = component.long_name;
                }
                if (component.types.includes('locality')) {
                  cityName = component.long_name;
                } else if (!cityName && component.types.includes('administrative_area_level_2')) {
                  cityName = component.long_name;
                }
              }

              if (stateName) {
                const matchState = ALL_INDIAN_STATES.find(s => s.toLowerCase() === stateName.toLowerCase());
                if (matchState) {
                  setSelectedState(matchState);
                  setFormState(matchState);
                  if (cityName) {
                    if (!headerCities.includes(cityName)) {
                      setHeaderCities(prev => [...prev, cityName].sort());
                    }
                    if (!formCities.includes(cityName)) {
                      setFormCities(prev => [...prev, cityName].sort());
                    }
                    setSelectedCity(cityName);
                    setFormCity(cityName);
                  }
                }
              }
            }
          });
        }
      },
      (err) => {
        console.error(err);
        setDetectingLocation(false);
        setError(`Failed to retrieve live location: ${err.message}. Please ensure location permissions are enabled.`);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Auto-detect live location on initial load
  useEffect(() => {
    handleAutoDetectLocation();
  }, []);

  // Auto-detect when switching to map tab if not already detected
  useEffect(() => {
    if (activeTab === 'map' && !liveUserCoords && !detectingLocation) {
      handleAutoDetectLocation();
    }
  }, [activeTab]);

  // Form Submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const parts = [];
    if (formTextDesc.trim()) parts.push(formTextDesc.trim());
    if (formPhotoDesc.trim()) parts.push(`[Photo Description]: ${formPhotoDesc.trim()}`);
    if (formVoiceDesc.trim()) parts.push(`[Voice Transcription]: ${formVoiceDesc.trim()}`);
    
    const combinedText = parts.join('\n\n');

    if (!combinedText) {
      setError("Please provide a description, photo, or voice message.");
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    // Instead of direct submission, call AI to generate formal grievance
    try {
      const response = await fetch('/api/submissions/generate-grievance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName || 'Anonymous Citizen',
          phone: formPhone,
          language: lang,
          inputType: photoPreviews.length > 0 ? 'photo' : (audioUrl ? 'voice' : 'text'),
          originalText: combinedText,
          photoUrls: photoPreviews,
          audioUrl: audioUrl,
          state: formState,
          constituency: formCity,
          latitude: liveUserCoords?.lat,
          longitude: liveUserCoords?.lng,
          locationVerified: !!liveUserCoords
        }),
      });

      const data = await response.json();
      if (data.grievance) {
        setPendingGrievance(data.grievance);
        setShowGrievanceModal(true);
      } else {
        throw new Error(data.error || "Failed to generate grievance");
      }
    } catch (err) {
      console.error("Error generating grievance:", err);
      setError("Failed to generate formal grievance. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinalSubmit = async () => {
    setSubmittingGrievance(true);
    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pendingGrievance),
      });

      const data = await response.json();
      if (data.success) {
        setSuccess(t.successMsg);
        // Clear intake fields
        setFormTextDesc('');
        setFormPhotoDesc('');
        setFormVoiceDesc('');
        if (currentUser) {
          setFormName(`${currentUser.firstName} ${currentUser.lastName}`);
          setFormPhone(currentUser.phone || '');
        } else {
          setFormName('');
          setFormPhone('');
        }
        setPhotoPreviews([]);
        setAudioUrl(null);
        setFormInputType('text');
        setLiveUserCoords(null);
        setSelectedState(formState);
        setSelectedCity(formCity);
        await loadData(formState, formCity, feedScope);
        await loadUserSubmissions();
        setShowGrievanceModal(false);
        setPendingGrievance(null);
        setActiveTab('history');
      } else {
        throw new Error(data.error || "Submission failed");
      }
    } catch (err) {
      setError("Final submission failed.");
    } finally {
      setSubmittingGrievance(false);
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

  // Filter submissions list based on selected area
  const filteredSubmissions = submissions;

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
        language={lang}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#070b19] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black relative overflow-x-hidden cyber-grid">
      
      {/* 0. SLIDE-OUT LEFT NAVIGATION DRAWER */}
      <AnimatePresence>
        {showNavMenu && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNavMenu(false)}
              className="fixed inset-0 bg-black/80 z-50 cursor-pointer backdrop-blur-xs"
            />
            {/* Sidebar Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="fixed top-0 left-0 bottom-0 w-80 bg-slate-950/98 border-r border-slate-800/80 z-50 flex flex-col p-6 shadow-2xl backdrop-blur-md"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center font-extrabold text-xs text-cyan-400 font-mono tracking-wider">
                    CP
                  </div>
                  <span className="text-sm font-black font-display text-slate-100 tracking-wider uppercase bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
                    CITIZEN PORTAL
                  </span>
                </div>
                <button
                  id="btn-close-navigation-menu"
                  onClick={() => setShowNavMenu(false)}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer hover:bg-slate-800/50 transition-all active:scale-95"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Items (All requested sections) */}
              <nav className="flex-1 py-6 space-y-2">
                {[
                  { id: 'intake', label: 'Intake Hub', icon: Sparkles, count: null },
                  { id: 'map', label: 'Spatial Map', icon: MapPin, count: null },
                  { id: 'suggestions', label: 'AI Suggestion', icon: Brain, count: null },
                  { id: 'feed', label: 'Live Dispatch', icon: Inbox, count: totalSubmissions },
                  { id: 'history', label: 'My History', icon: Clock, count: currentUser ? userSubmissions.length : null }
                ].map((item) => {
                  const IconComp = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`drawer-tab-btn-${item.id}`}
                      onClick={() => {
                        setActiveTab(item.id as any);
                        setShowNavMenu(false);
                      }}
                      className={`w-full flex items-center justify-between gap-3 py-3 px-4 rounded-xl text-sm font-bold font-sans transition-all cursor-pointer border relative group ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-950/60 to-blue-950/60 text-cyan-400 border-cyan-500/30 shadow-[inset_0_0_15px_rgba(6,182,212,0.15)] shadow-cyan-950/40'
                          : 'text-slate-400 hover:text-cyan-400 hover:bg-slate-900/40 border-transparent hover:border-slate-800/40'
                      }`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-3.5 bottom-3.5 w-1 rounded-r bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                      )}
                      <div className="flex items-center gap-3">
                        <IconComp className={`w-4 h-4 shrink-0 transition-all group-hover:scale-110 ${isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-cyan-400'}`} />
                        <span className="font-sans font-semibold tracking-wide text-xs">{item.label}</span>
                      </div>
                      {item.count !== null && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-extrabold transition-all ${
                          isActive 
                            ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/20' 
                            : 'bg-slate-900 text-slate-500 border border-slate-800'
                        }`}>
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Drawer Footer with User Context */}
              <div className="pt-6 border-t border-slate-800/80 space-y-4">
                <div className="flex items-center gap-3 bg-slate-900/40 p-3 border border-slate-800/60 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center font-bold text-xs text-cyan-400">
                    {currentUser?.firstName ? currentUser.firstName[0] : ''}{currentUser?.lastName ? currentUser.lastName[0] : ''}
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 block leading-none font-mono uppercase font-bold">
                      {currentUser?.isAdmin ? 'REPRESENTATIVE (MP)' : 'CITIZEN'}
                    </span>
                    <span className="text-xs font-extrabold text-slate-200 block">
                      {currentUser?.firstName} {currentUser?.lastName}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Dynamic Floating Marquee Bar */}
      <div className="bg-gradient-to-r from-cyan-950/90 via-slate-950/90 to-blue-950/90 border-b border-cyan-800/30 text-[10px] text-cyan-400 font-mono py-1.5 px-4 overflow-hidden relative z-50 flex items-center shadow-md">
        <div className="shrink-0 bg-cyan-950 px-2 py-0.5 border border-cyan-500/30 rounded text-[9px] font-bold uppercase mr-3 flex items-center gap-1.5 animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
          <span>{t.liveFeedLabel || "LIVE SYSTEM FEED"}</span>
        </div>
        <div className="relative w-full overflow-hidden flex items-center">
          <div className="animate-marquee-infinite whitespace-nowrap flex gap-12 font-semibold">
            <span>⚡ {t.liveFeedMsg1 || "CITIZEN DEVELOPMENT PORTAL: AUTOMATED CIVIC DEMAND INTAKE & SYSTEM INTERPRETER LIVE"}</span>
            <span>★ {t.liveFeedMsg2 || "MULTI-LINGUAL SUPPORT PARSING VOICE & DIGITAL IMAGES IN REAL-TIME"}</span>
            <span>⚡ {t.liveFeedMsg3 || "REAL-TIME CONSTITUENCY PLANNING: INTEGRATING PUBLIC DEMAND + SPATIAL DECISION MAKING"}</span>
            <span>★ {t.liveFeedMsg4 || "AI AUTO-SUMMARIZATION AND PROPOSAL DESK GENERATES CONSTITUENCY DRAFTS SECURELY"}</span>
            {/* Duplicate for infinite marquee wrap */}
            <span>⚡ {t.liveFeedMsg1 || "CITIZEN DEVELOPMENT PORTAL: AUTOMATED CIVIC DEMAND INTAKE & SYSTEM INTERPRETER LIVE"}</span>
            <span>★ {t.liveFeedMsg2 || "MULTI-LINGUAL SUPPORT PARSING VOICE & DIGITAL IMAGES IN REAL-TIME"}</span>
            <span>⚡ {t.liveFeedMsg3 || "REAL-TIME CONSTITUENCY PLANNING: INTEGRATING PUBLIC DEMAND + SPATIAL DECISION MAKING"}</span>
            <span>★ {t.liveFeedMsg4 || "AI AUTO-SUMMARIZATION AND PROPOSAL DESK GENERATES CONSTITUENCY DRAFTS SECURELY"}</span>
          </div>
        </div>
      </div>

      {/* 1. GOVERNMENT BRANDING HEADER BAR */}
      <header className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 py-4 sm:px-6 shadow-2xl relative z-20 animate-fade-in">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          
          {/* TOP ROW: Title and Profile Action Button */}
          <div className="flex items-center justify-between gap-4 w-full">
            
            {/* Emblem + Core Title */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                id="btn-trigger-navigation-menu"
                onClick={() => setShowNavMenu(true)}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-950 border-2 border-cyan-500/80 flex items-center justify-center text-cyan-400 hover:text-cyan-300 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.35)] transition-all cursor-pointer shadow-lg shadow-cyan-500/10 shrink-0 focus:outline-none"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
              </button>

              <div className="min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2">
                  <h1 className="text-lg sm:text-2xl md:text-3xl font-black font-display text-slate-100 tracking-wider uppercase bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent truncate">
                    {t.title}
                  </h1>
                  <span className="self-start sm:self-auto text-[8px] bg-cyan-950/50 text-cyan-400 px-2 py-0.5 border border-cyan-500/30 rounded-full font-mono font-bold uppercase tracking-wider animate-pulse whitespace-nowrap">
                    AI CORE OPERATIONAL
                  </span>
                </div>
              </div>
            </div>

            {/* User Profile Badge & Dropdown placed perfectly in the Top Right Corner */}
            <div className="relative shrink-0 z-30">
              <button
                id="user-profile-badge-btn"
                onClick={() => setShowProfileCard(!showProfileCard)}
                className="flex items-center gap-2 bg-slate-900/60 hover:bg-slate-850/80 p-1.5 px-2.5 sm:px-3 border border-slate-800 rounded-xl transition-all cursor-pointer shadow-md active:scale-95"
              >
                <div className="w-6 h-6 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-xs font-bold text-cyan-400">
                  {currentUser.firstName ? currentUser.firstName[0] : ''}{currentUser.lastName ? currentUser.lastName[0] : ''}
                </div>
                <div className="text-left hidden sm:block">
                  <span className="text-[9px] text-slate-500 block leading-none font-mono uppercase font-bold">
                    {currentUser.isAdmin ? 'REPRESENTATIVE (MP)' : 'CITIZEN'}
                  </span>
                  <span className="text-xs font-extrabold text-slate-200 block">
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
                      ].map(field => {
                        const stateCities = currentUser.state 
                          ? (INDIAN_STATES_CITIES.find(item => item.state === currentUser.state)?.cities || [])
                          : [];
                          
                        return (
                          <div key={field.key} className="flex justify-between items-center gap-2">
                            <span className="text-slate-500 font-medium shrink-0">{field.label}:</span>
                            {isEditing && field.key !== 'email' ? (
                              field.key === 'state' ? (
                                <select
                                  value={currentUser.state || ''}
                                  onChange={(e) => {
                                    const nextState = e.target.value;
                                    const nextCities = INDIAN_STATES_CITIES.find(item => item.state === nextState)?.cities || [];
                                    setCurrentUser({
                                      ...currentUser,
                                      state: nextState,
                                      city: nextCities.length > 0 ? nextCities[0] : ''
                                    });
                                  }}
                                  className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs w-40 focus:outline-none focus:border-cyan-500"
                                  style={{ colorScheme: 'dark' }}
                                >
                                  <option value="">Select State</option>
                                  {ALL_INDIAN_STATES.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                  ))}
                                </select>
                              ) : field.key === 'city' ? (
                                <select
                                  value={currentUser.city || ''}
                                  onChange={(e) => setCurrentUser({...currentUser, city: e.target.value})}
                                  disabled={!currentUser.state}
                                  className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs w-40 focus:outline-none focus:border-cyan-500 disabled:opacity-55"
                                  style={{ colorScheme: 'dark' }}
                                >
                                  <option value="">{currentUser.state ? "Select City" : "Select State First"}</option>
                                  {stateCities.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                  ))}
                                </select>
                              ) : field.key === 'gender' ? (
                                <select
                                  value={currentUser.gender || ''}
                                  onChange={(e) => setCurrentUser({...currentUser, gender: e.target.value})}
                                  className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs w-40 focus:outline-none focus:border-cyan-500"
                                  style={{ colorScheme: 'dark' }}
                                >
                                  <option value="">Select Gender</option>
                                  <option value="Male">Male</option>
                                  <option value="Female">Female</option>
                                  <option value="Other">Other</option>
                                  <option value="Prefer not to say">Prefer not to say</option>
                                </select>
                              ) : field.key === 'dob' ? (
                                <input
                                  type="date"
                                  value={currentUser.dob || ''}
                                  onChange={(e) => setCurrentUser({...currentUser, dob: e.target.value})}
                                  className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs w-40 focus:outline-none focus:border-cyan-500 [color-scheme:dark]"
                                />
                              ) : (
                                <input
                                  type="text"
                                  value={currentUser[field.key] || ''}
                                  onChange={(e) => setCurrentUser({...currentUser, [field.key]: e.target.value})}
                                  className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs w-40 focus:outline-none focus:border-cyan-500"
                                />
                              )
                            ) : (
                              <span className={`font-semibold truncate max-w-[150px] ${field.key === 'email' ? 'text-slate-400 select-none' : 'text-slate-300'}`}>
                                {currentUser[field.key]}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="space-y-3 pt-4 border-t border-zinc-800/60">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Preferred Language</span>
                        <span className="text-[10px] text-cyan-400 font-mono font-bold bg-cyan-950/50 px-1.5 py-0.5 rounded border border-cyan-800/30">
                          {ALL_INDIAN_LANGUAGES.find(l => l.code === lang)?.name || lang.toUpperCase()}
                        </span>
                      </div>
                      
                      {/* Comprehensive Dropdown containing all native Indian languages */}
                      <div className="relative flex items-center bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 focus-within:border-cyan-500/50 transition-colors">
                        <Languages className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
                        <select
                          value={lang}
                          onChange={(e) => {
                            const newLang = e.target.value;
                            setLang(newLang);
                            localStorage.setItem('mp_portal_selected_lang', newLang);
                          }}
                          className="w-full bg-transparent text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer pr-4 border-none"
                        >
                          {ALL_INDIAN_LANGUAGES.map((langObj) => (
                            <option key={langObj.code} value={langObj.code} className="bg-slate-950 text-slate-200">
                              {langObj.name} ({langObj.nativeName})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Quick-select toggles for popular ones */}
                      <div className="flex items-center justify-between gap-1 bg-slate-900/40 p-1 border border-slate-800/60 rounded-xl">
                        {[
                          { code: 'en', label: 'EN' },
                          { code: 'hi', label: 'हिन्दी' },
                          { code: 'ml', label: 'മലയാളം' },
                          { code: 'ta', label: 'தமிழ்' }
                        ].map((quickLang) => (
                          <button
                            key={quickLang.code}
                            type="button"
                            onClick={() => {
                              setLang(quickLang.code);
                              localStorage.setItem('mp_portal_selected_lang', quickLang.code);
                            }}
                            className={`flex-1 py-1 text-[10px] font-sans font-bold rounded-lg transition-all cursor-pointer ${
                              lang === quickLang.code
                                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-950/50'
                                : 'text-slate-400 hover:text-cyan-400 hover:bg-slate-800/30'
                            }`}
                          >
                            {quickLang.label}
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

          {/* SUB-ROW: Selectors (State, City) and Clock (on large screens) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-900/60">
            {/* Dynamic State & Constituency selector with GPS Auto-detection */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex flex-wrap items-center gap-2 bg-slate-900/45 p-1.5 rounded-xl border border-slate-800/60 max-w-fit">
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
                      const match = INDIAN_STATES_CITIES.find(item => item.state === nextState);
                      if (match && match.cities.length > 0) {
                        setSelectedCity(match.cities[0]);
                      }
                    }}
                    className="bg-slate-950 text-slate-200 text-[11px] font-sans font-bold py-0.5 px-1.5 rounded border border-slate-800 focus:outline-none focus:border-cyan-500 cursor-pointer"
                    style={{ colorScheme: 'dark' }}
                  >
                    {ALL_INDIAN_STATES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* City dropdown */}
                <div className="flex items-center gap-1 border-l border-slate-800/60 pl-2">
                  <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">City:</span>
                  <select
                    id="city-select"
                    value={selectedCity}
                    onChange={(e) => {
                      setSelectedCity(e.target.value);
                    }}
                    className="bg-slate-950 text-slate-200 text-[11px] font-sans font-bold py-0.5 px-1.5 rounded border border-slate-800 focus:outline-none focus:border-cyan-500 cursor-pointer"
                    style={{ colorScheme: 'dark' }}
                  >
                    {((selectedState ? INDIAN_STATES_CITIES.find(item => item.state === selectedState)?.cities : []) || []).map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>


              </div>

              {/* GPS Live Geolocation Button */}
              <button
                id="btn-auto-detect-location"
                onClick={handleAutoDetectLocation}
                disabled={detectingLocation}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold font-mono tracking-wider transition-all cursor-pointer ${
                  liveUserCoords ? 'cyber-glowing ' : ''
                }${
                  liveUserCoords
                    ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                    : 'bg-cyan-950/45 border border-cyan-800/30 hover:border-cyan-500/50 text-cyan-400 hover:bg-cyan-900/20 active:scale-[0.97]'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${liveUserCoords ? 'bg-emerald-500 animate-pulse' : 'bg-cyan-500'} shrink-0`}></span>
                <span>{detectingLocation ? 'GPS ACQUIRING...' : liveUserCoords ? 'GPS SIGNAL VERIFIED' : '📍 DETECT LIVE GPS LOCATION'}</span>
              </button>
            </div>


          </div>

        </div>
      </header>




      {/* 4. MAIN WORKSPACE */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 relative z-10 mt-2">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: CITIZEN INTAKE & ENGAGEMENT HUB */}
          {activeTab === 'intake' && (
            <motion.div
              key="intake-tab"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="max-w-4xl mx-auto w-full">
                {/* CITIZEN SUGGESTION INTAKE */}
                <div id="suggestion-intake-form" className="w-full space-y-6">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                      {/* Left Column: Profile & Geolocation */}
                      <div className="space-y-4">
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
                            setSelectedState(nextState);
                            const match = INDIAN_STATES_CITIES.find(item => item.state === nextState);
                            if (match && match.cities.length > 0) {
                              setFormCity(match.cities[0]);
                              setSelectedCity(match.cities[0]);
                            }
                          }}
                          className="w-full text-xs bg-slate-950/60 border border-slate-800 focus:border-cyan-500/50 rounded-xl p-3 text-slate-100 focus:outline-none cursor-pointer"
                          style={{ colorScheme: 'dark' }}
                        >
                          {ALL_INDIAN_STATES.map(state => (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          ))}
                        </select>
                        <select
                          value={formCity}
                          onChange={(e) => {
                            const nextCity = e.target.value;
                            setFormCity(nextCity);
                            setSelectedCity(nextCity);
                          }}
                          className="w-full text-xs bg-slate-950/60 border border-slate-800 focus:border-cyan-500/50 rounded-xl p-3 text-slate-100 focus:outline-none cursor-pointer"
                          style={{ colorScheme: 'dark' }}
                        >
                          {((formState ? INDIAN_STATES_CITIES.find(item => item.state === formState)?.cities : []) || []).map(city => (
                            <option key={city} value={city}>
                              {city}
                            </option>
                          ))}
                        </select>
                      </div>


                    </div>



                    {!liveUserCoords ? (
                      <div className="bg-cyan-950/20 border border-cyan-800/30 rounded-xl p-4 space-y-3">
                        <div className="flex items-center gap-2 text-cyan-400">
                          <MapPin className="w-4 h-4" />
                          <span className="text-xs font-bold font-sans">Location Required for Grievance</span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed">
                          To ensure your grievance is directed to the correct local authorities, please tag your current GPS location.
                        </p>
                        <button
                          type="button"
                          onClick={handleAutoDetectLocation}
                          disabled={detectingLocation}
                          className="w-full bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-950/50 disabled:opacity-50"
                        >
                          {detectingLocation ? (
                            <>
                              <Sparkles className="w-3.5 h-3.5 animate-spin" />
                              ACQUIRING GPS SIGNAL...
                            </>
                          ) : (
                            <>
                              <MapPin className="w-3.5 h-3.5" />
                              TAG MY CURRENT LOCATION
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-3 flex items-center justify-between gap-2 text-emerald-400">
                        <div className="flex items-center gap-2">
                          <span className="flex h-2 w-2 relative shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider block font-mono leading-none">GPS Location Tagged</span>
                            <span className="text-[9px] font-mono opacity-80">{liveUserCoords.lat.toFixed(6)}, {liveUserCoords.lng.toFixed(6)}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setLiveUserCoords(null)}
                          className="text-[9px] font-bold text-slate-400 hover:text-rose-400 font-mono transition-colors cursor-pointer"
                        >
                          REMOVE TAG
                        </button>
                      </div>
                    )}
                      </div>

                      {/* Right Column: Input Method & Details */}
                      <div className="space-y-4">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">
                        Select Input Method & Provide Details
                      </span>
                      
                      <div className="space-y-4">
                        {/* SECTION 1: TEXT SUGGESTION */}
                        <div 
                          onClick={() => setFormInputType('text')}
                          className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                            formInputType === 'text'
                              ? 'bg-slate-950/80 border-cyan-500/80 shadow-lg shadow-cyan-500/5'
                              : 'bg-slate-955/40 border-slate-850 hover:border-slate-800 hover:bg-slate-950/30'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className={`p-1.5 rounded-lg border ${formInputType === 'text' ? 'bg-cyan-950 border-cyan-800/30 text-cyan-400' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                                <FileText className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="text-xs font-bold text-slate-200 block">1. Text Suggestion / Grievance</span>
                                <span className="text-[9px] text-slate-500 font-mono block">Write in your preferred native language</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {formInputType === 'text' && (
                                <span className="text-[8px] bg-cyan-950 text-cyan-400 border border-cyan-800/30 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">ACTIVE</span>
                              )}
                              <input 
                                type="radio" 
                                checked={formInputType === 'text'} 
                                onChange={() => setFormInputType('text')} 
                                className="accent-cyan-500 h-3.5 w-3.5 cursor-pointer"
                              />
                            </div>
                          </div>
                          
                          {/* Inner Content - Textarea */}
                          <div onClick={(e) => e.stopPropagation()}>
                            <textarea
                              id="text-suggestion"
                              rows={3}
                              value={formTextDesc}
                              onChange={(e) => {
                                setFormTextDesc(e.target.value);
                              }}
                              placeholder={t.suggestionPlaceholder}
                              className="w-full text-xs bg-slate-950/60 border border-slate-800 focus:border-cyan-500/50 rounded-xl p-3 text-slate-100 placeholder-slate-650 focus:outline-none"
                            />
                            <div className="mt-2 flex items-center justify-between text-[9px]">
                              <span className="text-slate-500 font-mono flex items-center gap-1">
                                <Globe className="w-3 h-3 text-cyan-500/60" /> Write in Hindi, Malayalam, Tamil, etc.
                              </span>
                              {formTextDesc.trim() && (
                                <span className="text-emerald-400 font-mono flex items-center gap-1 animate-pulse">
                                  <Check className="w-3 h-3 text-emerald-500" /> AI Auto-Translation Active
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* SECTION 2: PHOTO ATTACHMENT */}
                        <div 
                          onClick={() => setFormInputType('photo')}
                          className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                            formInputType === 'photo'
                              ? 'bg-slate-950/80 border-cyan-500/80 shadow-lg shadow-cyan-500/5'
                              : 'bg-slate-955/40 border-slate-850 hover:border-slate-800 hover:bg-slate-950/30'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className={`p-1.5 rounded-lg border ${formInputType === 'photo' ? 'bg-cyan-950 border-cyan-800/30 text-cyan-400' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                                <Upload className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="text-xs font-bold text-slate-200 block">2. Photo Attachment</span>
                                <span className="text-[9px] text-slate-500 font-mono block">Upload images of the local issue</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {formInputType === 'photo' && (
                                <span className="text-[8px] bg-cyan-950 text-cyan-400 border border-cyan-800/30 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">ACTIVE</span>
                              )}
                              <input 
                                type="radio" 
                                checked={formInputType === 'photo'} 
                                onChange={() => setFormInputType('photo')} 
                                className="accent-cyan-500 h-3.5 w-3.5 cursor-pointer"
                              />
                            </div>
                          </div>

                          {/* Inner Content */}
                          <div onClick={(e) => e.stopPropagation()} className="space-y-3">
                            <div 
                              onDragOver={handleDrag}
                              onDragLeave={handleDrag}
                              onDrop={handleDrop}
                              onClick={() => {
                                setFormInputType('photo');
                                fileInputRef.current?.click();
                              }}
                              className={`border border-dashed rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 ${
                                dragActive 
                                  ? 'border-cyan-500 bg-cyan-950/20 shadow-lg shadow-cyan-500/5' 
                                  : 'border-slate-800 bg-slate-955/40 hover:border-cyan-500/40 hover:bg-slate-900/20'
                              }`}
                            >
                              <input 
                                ref={fileInputRef}
                                type="file" 
                                multiple
                                accept="image/*" 
                                onChange={handlePhotoUpload} 
                                className="hidden" 
                              />
                              <Upload className={`w-5 h-5 ${dragActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                              <span className="text-[11px] font-semibold text-slate-300">
                                {dragActive ? "Drop images here..." : "Click or drag multiple photos"}
                              </span>
                              <p className="text-[9px] text-slate-500 italic">Supports multiple JPG, PNG, WEBP</p>
                            </div>

                            {photoPreviews.length > 0 && (
                              <div className="grid grid-cols-2 gap-2">
                                {photoPreviews.map((preview, index) => (
                                  <div key={index} className="relative w-full h-28 rounded-lg overflow-hidden border border-slate-850 bg-slate-950/60 shadow-inner">
                                    <img 
                                      src={preview} 
                                      alt={`Suggestion Attachment ${index + 1}`} 
                                      referrerPolicy="no-referrer"
                                      className="w-full h-full object-cover"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setPhotoPreviews(prev => prev.filter((_, i) => i !== index))}
                                      className="absolute top-1.5 right-1.5 p-1 rounded-full bg-slate-950/80 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-800/40 transition-all"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}

                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">
                                Photo Description / Grievance Details
                              </label>
                              <textarea
                                rows={2}
                                value={formPhotoDesc}
                                onChange={(e) => setFormPhotoDesc(e.target.value)}
                                placeholder="Describe details of this photo in your native language..."
                                className="w-full text-xs bg-slate-950/60 border border-slate-800 focus:border-cyan-500/50 rounded-xl p-2.5 text-slate-100 placeholder-slate-650 focus:outline-none font-sans"
                              />
                            </div>
                          </div>
                        </div>

                        {/* SECTION 3: VOICE NOTE RECORDING */}
                        <div 
                          onClick={() => setFormInputType('voice')}
                          className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                            formInputType === 'voice'
                              ? 'bg-slate-950/80 border-cyan-500/80 shadow-lg shadow-cyan-500/5'
                              : 'bg-slate-955/40 border-slate-850 hover:border-slate-800 hover:bg-slate-950/30'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className={`p-1.5 rounded-lg border ${formInputType === 'voice' ? 'bg-cyan-950 border-cyan-800/30 text-cyan-400' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                                <Mic className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="text-xs font-bold text-slate-200 block">3. Voice Note Recorder</span>
                                <span className="text-[9px] text-slate-500 font-mono block">Speak directly in your native language</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {formInputType === 'voice' && (
                                <span className="text-[8px] bg-cyan-950 text-cyan-400 border border-cyan-800/30 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">ACTIVE</span>
                              )}
                              <input 
                                type="radio" 
                                checked={formInputType === 'voice'} 
                                onChange={() => setFormInputType('voice')} 
                                className="accent-cyan-500 h-3.5 w-3.5 cursor-pointer"
                              />
                            </div>
                          </div>

                          {/* Inner Content */}
                          <div onClick={(e) => e.stopPropagation()} className="space-y-3">
                            <div className="p-3 bg-slate-950/40 border border-slate-855 rounded-xl flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFormInputType('voice');
                                    toggleRecording();
                                  }}
                                  className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                                    isRecording
                                      ? 'bg-rose-950/30 border-rose-500/60 text-rose-500 animate-pulse'
                                      : 'bg-slate-900 border border-slate-850 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-450 shadow-inner'
                                  }`}
                                >
                                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                                </button>

                                <div className="text-left">
                                  {isRecording ? (
                                    <div className="font-mono">
                                      <span className="text-[11px] text-rose-500 font-bold block animate-pulse">
                                        ● Recording Audio...
                                      </span>
                                      <span className="text-[9px] text-slate-500 leading-none">
                                        Duration: {recordingSeconds}s
                                      </span>
                                    </div>
                                  ) : (
                                    <div>
                                      <span className="text-[11px] font-bold text-slate-300 block">Click mic to record speech</span>
                                      <span className="text-[9px] text-slate-500 leading-none">AI will transcribe & translate dynamically</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {isRecording && (
                                <div className="flex items-center gap-1 h-5 mr-1">
                                  {[0.8, 0.4, 0.95, 0.5, 0.7, 0.35, 0.85].map((val, i) => (
                                    <span
                                      key={i}
                                      className="w-0.5 bg-cyan-500 rounded-full animate-bounce"
                                      style={{
                                        height: `${val * 100}%`,
                                        animationDelay: `${i * 0.1}s`,
                                        animationDuration: '1s'
                                      }}
                                    ></span>
                                  ))}
                                </div>
                              )}
                            </div>

                            {audioUrl && formInputType === 'voice' && !isRecording && (
                              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col gap-2 animate-fade-in">
                                <div className="flex items-center justify-between">
                                  <span className="text-[9px] text-cyan-400 font-mono font-bold uppercase tracking-wider">
                                    🔊 Review Your Recorded Voice Note
                                  </span>
                                  <span className="text-[9px] text-slate-500 font-mono">
                                    Listen to your voice before submitting
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <button
                                    type="button"
                                    onClick={handlePlayVoiceNote}
                                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shrink-0 border cursor-pointer ${
                                      isAudioPlaying 
                                        ? 'bg-rose-950/40 border-rose-500/50 text-rose-400'
                                        : 'bg-cyan-950/30 border-cyan-800/50 text-cyan-400 hover:bg-cyan-900/30'
                                    }`}
                                  >
                                    {isAudioPlaying ? (
                                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                                      </svg>
                                    ) : (
                                      <svg className="w-3.5 h-3.5 fill-current ml-0.5" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                      </svg>
                                    )}
                                  </button>

                                  <div className="flex-1 space-y-1">
                                    {/* Waveform representation */}
                                    <div className="flex items-end gap-0.5 h-5">
                                      {[0.3, 0.6, 0.45, 0.8, 0.35, 0.9, 0.7, 0.5, 0.4, 0.65, 0.3, 0.85, 0.5, 0.75, 0.4, 0.9, 0.3, 0.5, 0.7, 0.4].map((val, i) => {
                                        // Highlight bars based on current playing time ratio
                                        const progress = voicePlaybackDuration ? (voicePlaybackCurrentTime / voicePlaybackDuration) : 0;
                                        const isHighlighted = isAudioPlaying && (i / 20) <= progress;
                                        return (
                                          <span
                                            key={i}
                                            className={`w-1 rounded-full transition-all duration-150 ${
                                              isHighlighted 
                                                ? 'bg-rose-500' 
                                                : isAudioPlaying 
                                                ? 'bg-cyan-500/80 animate-pulse' 
                                                : 'bg-slate-850'
                                            }`}
                                            style={{
                                              height: `${val * 100}%`,
                                              animationDelay: `${i * 0.03}s`
                                            }}
                                          ></span>
                                        );
                                      })}
                                    </div>
                                    <div className="flex items-center justify-between text-[8px] font-mono text-slate-500">
                                      <span>{Math.floor(voicePlaybackCurrentTime)}s</span>
                                      <span>{Math.floor(voicePlaybackDuration) || 8}s</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {formVoiceDesc && !isRecording && (
                              <div className="text-left border-t border-slate-850 pt-2.5 space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <span className="text-[9px] text-cyan-400 font-mono font-bold block uppercase tracking-wide">
                                    AI Native Voice Transcript (Editable)
                                  </span>
                                  <span className="text-[9px] text-slate-500 font-mono flex items-center gap-1 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-850">
                                    🌐 Language: {ALL_INDIAN_LANGUAGES.find(l => l.code === lang)?.name || lang.toUpperCase()}
                                  </span>
                                </div>
                                <textarea
                                  rows={3}
                                  value={formVoiceDesc}
                                  onChange={(e) => setFormVoiceDesc(e.target.value)}
                                  className="w-full text-xs bg-slate-950/60 border border-slate-800 focus:border-cyan-500/50 rounded-xl p-3 text-slate-100 placeholder-slate-650 focus:outline-none font-sans italic animate-fade-in"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    </div>

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
                      disabled={submitting || !(formTextDesc.trim() || formPhotoDesc.trim() || formVoiceDesc.trim())}
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
                    
                    {/* Grievance Preview Modal */}
                    {showGrievanceModal && pendingGrievance && (
                      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl">
                          <h3 className="text-lg font-bold text-white mb-4">Confirm Formal Grievance</h3>
                          <div className="bg-slate-950 p-4 rounded-xl mb-4 text-sm text-slate-300">
                            <div className="mb-2">
                              <strong className="text-cyan-400 block text-xs mb-1">Summary:</strong>
                              <textarea
                                value={pendingGrievance.aiSummary}
                                onChange={(e) => setPendingGrievance(prev => ({...prev, aiSummary: e.target.value}))}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white focus:border-cyan-500 outline-none"
                                rows={2}
                              />
                            </div>
                            <div>
                              <strong className="text-cyan-400 block text-xs mb-1">Details:</strong>
                              <textarea
                                value={pendingGrievance.translatedText}
                                onChange={(e) => setPendingGrievance(prev => ({...prev, translatedText: e.target.value}))}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white focus:border-cyan-500 outline-none"
                                rows={6}
                              />
                            </div>
                            {pendingGrievance.photoUrls && pendingGrievance.photoUrls.length > 0 && (
                              <div className="mt-4">
                                <strong className="text-cyan-400 block text-xs mb-1">Attached Photos:</strong>
                                <div className="grid grid-cols-2 gap-2">
                                  {pendingGrievance.photoUrls.map((url: string, index: number) => (
                                    <img key={index} src={url} alt={`Attached Grievance Photo ${index + 1}`} className="w-full h-auto rounded-lg border border-slate-700" />
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex justify-end gap-3">
                            <button
                              onClick={() => setShowGrievanceModal(false)}
                              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700"
                            >
                              Remove
                            </button>
                            <button
                              onClick={handleFinalSubmit}
                              disabled={submittingGrievance}
                              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 disabled:bg-slate-700"
                            >
                              {submittingGrievance ? 'Submitting...' : 'Final Submit'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                  </form>
                </div>
              </div>
              </div>

              {/* AI PROPOSAL DESK */}
              <div id="ai-proposal-desk">
                <AIProposalDesk 
                  state={formState}
                  city={formCity}
                  language={lang}
                  currentUser={currentUser}
                  onProposalSubmitted={async () => {
                    setSelectedState(formState);
                    setSelectedCity(formCity);
                    await loadData(formState, formCity, feedScope);
                    if (currentUser) {
                      await loadUserSubmissions();
                    }
                  }}
                />
              </div>
            </motion.div>
          )}

          {/* TAB 2: SPATIAL ANALYTICS MAP */}
          {activeTab === 'map' && (
            <motion.div
              key="map-tab"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-1 shadow-2xl">
                <GoogleMapComponent
                  cityName={selectedCity}
                  submissions={submissions}
                  projects={enrichedProjects}
                  liveUserCoords={liveUserCoords}
                  detectingLocation={detectingLocation}
                  onDetectLocation={handleAutoDetectLocation}
                  language={lang}
                />
              </div>
            </motion.div>
          )}

          {/* TAB: AI SUGGESTIONS DECK */}
          {activeTab === 'suggestions' && (
            <motion.div
              key="suggestions-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <AISuggestionTab
                selectedState={selectedState}
                selectedCity={selectedCity}
                submissions={submissions}
                onSelectProjectForReport={(proj) => {
                  setSelectedProjectForReport(proj);
                  setActiveTab('intake');
                  setTimeout(() => {
                    document.getElementById('ai-proposal-desk')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                selectedProject={selectedProjectForReport}
              />
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
                projects={enrichedProjects}
                onSelectProjectForReport={(proj) => {
                  setSelectedProjectForReport(proj);
                  setActiveTab('intake');
                  setTimeout(() => {
                    document.getElementById('ai-proposal-desk')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                selectedProject={selectedProjectForReport}
                language={lang}
                liveUserCoords={liveUserCoords}
              />
            </motion.div>
          )}

          {/* TAB 5: MY GRIEVANCES HISTORY */}
          {activeTab === 'history' && (
            <motion.div
              key="history-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
                <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-100 font-sans tracking-tight">
                      {t.myHistory}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-mono">TRACKING & DOCUMENTATION CENTER</p>
                  </div>
                  <div className="bg-slate-955/60 border border-slate-800 px-3 py-1 rounded-full">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                      {userSubmissions.length} Records
                    </span>
                  </div>
                </div>

                <GrievanceSentimentRadar submissions={userSubmissions} />

                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
                  {!currentUser ? (
                    <div className="flex flex-col items-center justify-center py-20 px-6 text-center space-y-5 bg-slate-950/40 rounded-2xl border border-dashed border-slate-800">
                      <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                        <User className="w-8 h-8 text-cyan-500" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-base font-bold text-slate-100">Authentication Required</h4>
                        <p className="text-xs text-slate-500 max-w-[240px] leading-relaxed">
                          Please sign in or set up your profile to track your submitted grievances and download official receipts.
                        </p>
                      </div>
                      <button
                        onClick={() => setShowProfileCard(true)}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold py-2 px-6 rounded-lg transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
                      >
                        Sign In / Setup Profile
                      </button>
                    </div>
                  ) : userSubmissions.length > 0 ? (
                    userSubmissions.map((sub) => (
                      <div
                        key={sub.id}
                        className="bg-slate-955/40 border border-slate-850 hover:border-cyan-500/30 rounded-xl p-4 transition-all duration-200 space-y-3 group"
                      >
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-cyan-400 font-mono uppercase tracking-tighter">
                                {sub.category}
                              </span>
                              <span className="text-slate-600 font-mono text-[10px]">•</span>
                              <span className="text-[10px] font-mono text-slate-400">{new Date(sub.timestamp).toLocaleDateString()}</span>
                            </div>
                            <h4 className="text-xs font-bold text-slate-100">
                              {sub.latitude && sub.longitude 
                                ? `${sub.latitude.toFixed(4)}, ${sub.longitude.toFixed(4)} (Tagged Location)` 
                                : `Constituency Level`
                              }
                            </h4>
                          </div>
                          <div className="flex flex-col items-end gap-1.5">
                            <span className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold border ${
                              sub.status === 'Actioned' || sub.status === 'Approved' 
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                                : sub.status === 'Rejected'
                                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                                  : 'bg-slate-900 border-slate-800 text-cyan-400'
                            }`}>
                              {sub.status.toUpperCase()}
                            </span>
                            <span className={`text-[9px] font-mono ${
                              sub.urgency === 'High' ? 'text-rose-400' : sub.urgency === 'Medium' ? 'text-amber-400' : 'text-slate-500'
                            }`}>
                              {sub.urgency} Urgency
                            </span>
                          </div>
                        </div>

                        <p className="text-sm text-slate-300 leading-relaxed italic border-l-2 border-slate-800 pl-3 py-1 bg-slate-900/30 rounded-r-lg">
                          "{sub.aiSummary}"
                        </p>

                        {sub.targetDepartment && (
                          <div className="flex items-center gap-2 bg-slate-950/40 border border-slate-800/50 p-2 rounded-lg">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Routing:</span>
                            <span className="text-[11px] font-bold text-cyan-400">{sub.targetDepartment}</span>
                          </div>
                        )}

                        {sub.suggestedActions && sub.suggestedActions.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Action Plan:</p>
                            <div className="grid grid-cols-1 gap-1.5">
                              {sub.suggestedActions.map((action, idx) => (
                                <div key={idx} className="flex items-start gap-2 bg-slate-900/50 p-2 rounded border border-slate-850/50 group/action">
                                  <span className="text-[10px] text-cyan-500 font-bold mt-0.5">{idx + 1}</span>
                                  <span className="text-[10px] text-slate-400 group-hover/action:text-slate-300 transition-colors">{action}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-slate-850/50">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <div className={`w-1.5 h-1.5 rounded-full ${sub.sentiment === 'positive' ? 'bg-emerald-500' : sub.sentiment === 'negative' ? 'bg-rose-500' : 'bg-slate-500'}`} />
                              <span className="text-[10px] text-slate-500 capitalize">{sub.sentiment || 'neutral'} sentiment</span>
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono">ID: {sub.id.substring(0, 8)}...</span>
                          </div>

                          <button
                            onClick={async () => await generateGrievancePDF(sub)}
                            className="flex items-center gap-1.5 text-[10px] font-bold text-cyan-400 bg-cyan-950/30 border border-cyan-500/30 hover:bg-cyan-500 hover:text-white px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                          >
                            <Download className="w-3 h-3" />
                            {t.pdfReceipt}
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-4">
                      <div className="w-12 h-12 rounded-full bg-slate-850 flex items-center justify-center">
                        <Clock3 className="w-6 h-6 text-slate-600" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-400">{t.noHistory}</p>
                        <p className="text-xs text-slate-600 max-w-[200px]">
                          Your submitted grievances and official receipts will appear here.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 6: MULTILINGUAL CITIZEN FEED */}
          {activeTab === 'feed' && (
            <motion.div
              key="feed-tab"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <CitizenFeed 
                submissions={submissions}
                onStatusToggle={handleStatusToggle}
                selectedCity={selectedCity}
                selectedState={selectedState}
                lang={lang}
                t={t}
                feedScope={feedScope}
                onChangeFeedScope={setFeedScope}
                currentUser={currentUser}
                liveUserCoords={liveUserCoords}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* FOOTER COGNIZANCE */}
      <footer className="bg-slate-950 border-t border-slate-850 py-8 px-4 mt-12 text-center text-xs text-slate-500 font-sans space-y-2">
        <p>© 2026 Office of the Member of Parliament. All legislative datasets secured by AI clearance protocols.</p>
      </footer>

    </div>
  );
}

