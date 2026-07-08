import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Filter, Heart, MessageSquare, Share2, MapPin, 
  Sparkles, CheckCircle2, ChevronDown, ChevronUp,
  Clock, Mic, Image, MessageCircle, Send, UserCheck, ShieldAlert,
  Globe
} from 'lucide-react';
import { Submission } from '../types';

interface CitizenFeedProps {
  submissions: Submission[];
  onStatusToggle: (id: string, currentStatus: any) => void;
  selectedCity: string;
  selectedState: string;
  lang: string;
  t: any;
  feedScope: 'local' | 'national' | 'mine';
  onChangeFeedScope: (scope: 'local' | 'national' | 'mine') => void;
  currentUser?: any;
}

export const CitizenFeed: React.FC<CitizenFeedProps> = ({
  submissions,
  onStatusToggle,
  selectedCity,
  selectedState,
  lang,
  t,
  feedScope,
  onChangeFeedScope,
  currentUser
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [sortOption, setSortOption] = useState<string>('newest'); // Added sorting state
  const [expandedCommentsId, setExpandedCommentsId] = useState<string | null>(null);
  
  // Interactive client-side states for Upvoting & Comments
  const [upvotedIds, setUpvotedIds] = useState<Record<string, boolean>>({});
  const [additionalUpvotes, setAdditionalUpvotes] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, Array<{
    id: string;
    name: string;
    handle: string;
    text: string;
    timestamp: string;
  }>>>({});
  const [newCommentText, setNewCommentText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Toggle upvote
  const handleUpvote = (id: string) => {
    const isUpvoted = !!upvotedIds[id];
    setUpvotedIds(prev => ({ ...prev, [id]: !isUpvoted }));
    setAdditionalUpvotes(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + (isUpvoted ? -1 : 1)
    }));
  };

  // Add a new comment
  const handleAddComment = (submissionId: string) => {
    if (!newCommentText.trim()) return;
    
    const newComment = {
      id: Math.random().toString(),
      name: "You (Citizen Hero)",
      handle: "@citizen_hero_active",
      text: newCommentText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setComments(prev => ({
      ...prev,
      [submissionId]: [...(prev[submissionId] || []), newComment]
    }));
    setNewCommentText('');
  };

  // Pre-seed some realistic localized citizen discussion comments
  const getSeededComments = (id: string, name: string) => {
    if (comments[id]) return comments[id];
    
    const seeded = [
      {
        id: 'seed-1',
        name: 'Rajesh Kumar',
        handle: '@rajesh_k_nagpur',
        text: 'This is a high-priority issue in our area too. Glad to see it posted here!',
        timestamp: '10:14 AM'
      },
      {
        id: 'seed-2',
        name: 'Anjali Sharma',
        handle: '@anjali_s_unite',
        text: 'Fully support this. Our school children face extreme difficulty every morning.',
        timestamp: '11:22 AM'
      }
    ];
    return seeded;
  };

  // Copy simulated direct link
  const handleShare = (id: string) => {
    const shareUrl = `${window.location.origin}/grievance/${id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }).catch(err => {
      console.error('Failed to copy link', err);
    });
  };

  // Filter submissions
  const filteredList = submissions.filter(sub => {
    // If we are looking at 'mine', filter out submissions that are not by the current user
    if (feedScope === 'mine') {
      const isMine = currentUser && (
        (sub.phone && currentUser.phone && sub.phone.trim().toLowerCase() === currentUser.phone.trim().toLowerCase()) ||
        (sub.name && sub.name.trim().toLowerCase() === `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim().toLowerCase())
      );
      if (!isMine) return false;
    }

    // Search input match
    const handleStr = `@${sub.name.toLowerCase().replace(/\s+/g, '_')}`;
    const matchesSearch = 
      sub.name.toLowerCase().includes(searchInput.toLowerCase()) ||
      handleStr.toLowerCase().includes(searchInput.toLowerCase()) ||
      sub.originalText.toLowerCase().includes(searchInput.toLowerCase()) ||
      sub.translatedText.toLowerCase().includes(searchInput.toLowerCase()) ||
      sub.category.toLowerCase().includes(searchInput.toLowerCase()) ||
      (sub.targetDepartment && sub.targetDepartment.toLowerCase().includes(searchInput.toLowerCase()));

    // Category filter
    const matchesCategory = selectedCategory === 'All' || sub.category === selectedCategory;

    // Urgency filter
    const matchesUrgency = selectedUrgency === 'All' || sub.urgency === selectedUrgency;

    // Status filter
    const matchesStatus = selectedStatus === 'All' || sub.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesUrgency && matchesStatus;
  });

  const sortedList = [...filteredList].sort((a, b) => {
    switch (sortOption) {
      case 'newest':
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      case 'oldest':
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      case 'urgency':
        const urgencyMap = { High: 3, Medium: 2, Low: 1 };
        return urgencyMap[b.urgency] - urgencyMap[a.urgency];
      case 'category':
        return a.category.localeCompare(b.category);
      default:
        return 0;
    }
  });

  const categories = ['All', 'Education', 'Healthcare', 'Roads & Transport', 'Sanitation', 'Water Supply', 'Vocations'];
  const urgencies = ['All', 'High', 'Medium', 'Low'];
  const statuses = ['All', 'Received', 'Reviewed', 'Approved', 'Actioned'];

  // Avatar gradient styles
  const getAvatarGradient = (name: string) => {
    const gradients = [
      'from-cyan-500/20 to-blue-600/20 text-cyan-400 border-cyan-500/30',
      'from-emerald-500/20 to-teal-600/20 text-emerald-400 border-emerald-500/30',
      'from-purple-500/20 to-indigo-600/20 text-purple-400 border-purple-500/30',
      'from-amber-500/20 to-orange-600/20 text-amber-400 border-amber-500/30',
      'from-rose-500/20 to-pink-600/20 text-rose-400 border-rose-500/30'
    ];
    const index = name.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  return (
    <div className="bg-slate-900/65 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 shadow-2xl shadow-cyan-950/10 space-y-6">
      
      {/* Header and Live Status */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between border-b border-slate-800/60 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <h3 className="text-lg font-bold text-slate-100 font-sans tracking-tight">
              {feedScope === 'national' 
                ? "All India Citizen Suggestion & Grievance Feed"
                : feedScope === 'mine'
                ? "My Suggestions & Grievances"
                : (t.activeFeed ? t.activeFeed.replace('{city}', selectedCity).replace('{state}', selectedState) : "Consolidated Citizen Suggestion Feed")}
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1.5 flex items-center gap-2">
            {feedScope === 'national' ? (
              <>
                <span className="text-cyan-400">🇮🇳 ALL INDIA LIVE GRID</span>
                <span className="text-slate-600">•</span>
                <span>NATIONAL FEED CHANNEL</span>
              </>
            ) : feedScope === 'mine' ? (
              <>
                <span className="text-amber-400">👤 YOUR SUBMITTED GRIEVANCES</span>
                <span className="text-slate-600">•</span>
                <span>PERSONAL PORTAL LOGS</span>
              </>
            ) : (
              <>
                <span>{selectedCity.toUpperCase()} DISPATCH CENTER</span>
                <span className="text-slate-600">•</span>
                <span>{selectedState.toUpperCase()}</span>
                <span className="text-slate-600">•</span>
                <span className="text-cyan-400">{lang.toUpperCase()} INPUT CHANNEL</span>
              </>
            )}
          </p>
        </div>
        
        {/* Scope Selector and Stats */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          {/* Feed Scope Selector */}
          <div className="flex bg-slate-950 p-1 border border-slate-800/80 rounded-xl shadow-inner flex-wrap gap-1">
            <button
              onClick={() => onChangeFeedScope('local')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                feedScope === 'local'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md font-sans'
                  : 'text-slate-400 hover:text-slate-200 font-sans'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{selectedCity}</span>
            </button>
            <button
              onClick={() => onChangeFeedScope('national')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                feedScope === 'national'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md font-sans'
                  : 'text-slate-400 hover:text-slate-200 font-sans'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>All Over India</span>
            </button>
            <button
              onClick={() => onChangeFeedScope('mine')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                feedScope === 'mine'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md font-sans'
                  : 'text-slate-400 hover:text-slate-200 font-sans'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>My Suggestions</span>
            </button>
          </div>

          {/* Total stats counters */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-950/80 border border-slate-800 px-4 py-2 rounded-xl text-center shadow-inner">
              <span className="block text-[9px] font-mono font-bold tracking-wider text-slate-500">TOTAL</span>
              <span className="text-base font-sans font-black text-cyan-400">{submissions.length}</span>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 px-4 py-2 rounded-xl text-center shadow-inner">
              <span className="block text-[9px] font-mono font-bold tracking-wider text-slate-500">MATCHED</span>
              <span className="text-base font-sans font-black text-amber-400">{filteredList.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Panel: Search & Filters */}
      <div className="bg-slate-950/40 border border-slate-800/80 p-5 rounded-2xl space-y-5 shadow-inner">
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder={`Search by citizen name, handle (@username), or grievance details...`}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 rounded-xl pl-11 pr-16 py-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none transition-all shadow-inner"
          />
          {searchInput && (
            <button 
              onClick={() => setSearchInput('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-200 bg-slate-800 border border-slate-700 px-2 py-1 rounded font-mono font-bold transition-all"
            >
              CLEAR
            </button>
          )}
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          
          {/* Category Filter */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Filter className="w-3.5 h-3.5 text-cyan-500" /> Category Filter
            </span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all cursor-pointer"
              style={{ colorScheme: 'dark' }}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Filter className="w-3.5 h-3.5 text-indigo-500" /> Sort By
            </span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 rounded-xl p-2.5 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all cursor-pointer"
              style={{ colorScheme: 'dark' }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="urgency">Highest Urgency</option>
              <option value="category">Category (A-Z)</option>
            </select>
          </div>

          {/* Urgency Filter */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5 text-amber-500" /> Urgency Level
            </span>
            <div className="flex gap-1 bg-slate-950 p-1 border border-slate-800 rounded-xl">
              {urgencies.map(urg => (
                <button
                  key={urg}
                  onClick={() => setSelectedUrgency(urg)}
                  className={`flex-1 text-[10px] py-2 rounded-lg font-sans font-bold transition-all cursor-pointer ${
                    selectedUrgency === urg 
                      ? 'bg-slate-800 text-slate-100 border border-slate-700/80 shadow-md' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {urg}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Milestone Status
            </span>
            <div className="flex gap-1 bg-slate-950 p-1 border border-slate-800 rounded-xl">
              {statuses.map(stat => (
                <button
                  key={stat}
                  onClick={() => setSelectedStatus(stat)}
                  className={`flex-1 text-[10px] py-2 rounded-lg font-sans font-bold transition-all cursor-pointer ${
                    selectedStatus === stat 
                      ? 'bg-slate-800 text-slate-100 border border-slate-700/80 shadow-md' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {stat === 'All' ? 'All' : stat}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Submissions Feed */}
      <div className="space-y-5 max-h-[750px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        
        <AnimatePresence mode="popLayout">
          {sortedList.length > 0 ? (
            sortedList.map((sub) => {
              const handle = `@${sub.name.toLowerCase().replace(/\s+/g, '_')}`;
              const hasUpvoted = !!upvotedIds[sub.id];
              const upvoteBonus = additionalUpvotes[sub.id] || 0;
              const displayUpvotes = sub.impactCount + upvoteBonus;
              const isCommentsExpanded = expandedCommentsId === sub.id;
              const currentCommentsList = getSeededComments(sub.id, sub.name);

              // Step state calculation for progression bar
              const statusSteps = ['Received', 'Reviewed', 'Approved', 'Actioned'];
              const currentStepIndex = statusSteps.indexOf(sub.status);

              return (
                <motion.div
                  key={sub.id}
                  id={`feed-card-${sub.id}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="bg-slate-950/40 border border-slate-800/80 hover:border-cyan-500/25 rounded-2xl p-5 md:p-6 transition-all duration-300 relative overflow-hidden space-y-5 shadow-lg hover:shadow-cyan-950/5 group"
                >
                  {/* Accent border on hover */}
                  <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500/0 group-hover:bg-cyan-500/40 transition-all duration-300" />

                  {/* Card Header Profile Block */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800/50">
                    
                    <div className="flex items-center gap-3.5">
                      {/* Avatar with gradient background */}
                      <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${getAvatarGradient(sub.name)} border flex items-center justify-center font-black text-sm font-sans shadow-md`}>
                        {sub.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                      </div>
                      
                      <div>
                        <div className="flex items-center flex-wrap gap-2">
                          <span className="text-sm font-extrabold text-slate-100 font-sans tracking-tight">{sub.name}</span>
                          <span className="text-xs text-slate-500 font-mono font-medium">{handle}</span>
                          
                          {/* Verified Citizen Badge */}
                          <span className="inline-flex items-center gap-1 bg-cyan-950/40 border border-cyan-800/60 text-[9px] text-cyan-400 px-2 py-0.5 rounded-full font-bold">
                            <UserCheck className="w-3 h-3 text-cyan-400" /> VERIFIED
                          </span>

                          {/* Submitted by You Badge */}
                          {currentUser && (
                            ((sub.phone && currentUser.phone && sub.phone.trim().toLowerCase() === currentUser.phone.trim().toLowerCase()) ||
                             (sub.name && sub.name.trim().toLowerCase() === `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim().toLowerCase()))
                          ) && (
                            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-[9px] text-amber-400 px-2.5 py-0.5 rounded-full font-extrabold animate-pulse shadow-sm">
                              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> MY SUGGESTION
                            </span>
                          )}
                        </div>
                        
                        {/* Channel Badge & Geo Location */}
                        <div className="flex items-center gap-2.5 mt-1.5 flex-wrap">
                          <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1 font-semibold">
                            <MapPin className="w-3 h-3 text-slate-500" /> {sub.constituency || selectedCity} • {sub.state || selectedState}
                          </span>
                          
                          <span className="text-slate-700 font-mono text-[10px]">•</span>
                          
                          {/* Beautiful source pill indicators */}
                          {sub.inputType === 'whatsapp' && (
                            <span className="text-[10px] text-emerald-400 bg-emerald-950/30 border border-emerald-500/20 px-2 py-0.5 rounded-md font-mono flex items-center gap-1 font-bold" title="WhatsApp Channel">
                              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp
                            </span>
                          )}
                          {sub.inputType === 'voice' && (
                            <span className="text-[10px] text-cyan-400 bg-cyan-950/30 border border-cyan-500/20 px-2 py-0.5 rounded-md font-mono flex items-center gap-1 font-bold" title="Voice Channel">
                              <Mic className="w-3.5 h-3.5 text-cyan-400" /> Voice Note
                            </span>
                          )}
                          {sub.inputType === 'photo' && (
                            <span className="text-[10px] text-amber-400 bg-amber-950/30 border border-amber-500/20 px-2 py-0.5 rounded-md font-mono flex items-center gap-1 font-bold" title="Photo Attachment">
                              <Image className="w-3.5 h-3.5 text-amber-400" /> Photo Ingest
                            </span>
                          )}
                          {sub.inputType === 'text' && (
                            <span className="text-[10px] text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md font-mono flex items-center gap-1 font-bold" title="Web Portal">
                              <Sparkles className="w-3.5 h-3.5 text-cyan-500" /> Web Ingest
                            </span>
                          )}

                          {sub.locationVerified && (
                            <>
                              <span className="text-slate-700 font-mono text-[10px]">•</span>
                              <span className="text-[10px] text-emerald-400 bg-emerald-950/30 border border-emerald-500/30 px-2 py-0.5 rounded-md font-mono flex items-center gap-1 font-extrabold shadow-sm" title="Verified with Hardware GPS Signal">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                GPS SECURED
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                    </div>

                    {/* Right-aligned timestamp */}
                    <div className="text-left sm:text-right flex flex-col sm:items-end gap-1">
                      <span className="text-[11px] text-slate-500 font-mono bg-slate-900/60 border border-slate-800/50 px-2 py-1 rounded-md">
                        {new Date(sub.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })} • {new Date(sub.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                  </div>

                  {/* Grievance Texts (Original & Translated) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Left: Original Submission */}
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/60 space-y-2 relative shadow-inner">
                      <div className="flex items-center justify-between border-b border-slate-900 pb-1.5">
                        <span className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-wider block">
                          {t.original || "Original Citizen Text"}
                        </span>
                        <span className="text-[9px] font-mono bg-slate-900 px-2 py-0.5 rounded text-slate-500 font-bold uppercase">
                          {sub.language} Source
                        </span>
                      </div>
                      <p className="text-xs text-slate-350 font-sans leading-relaxed italic">
                        "{sub.originalText}"
                      </p>
                    </div>

                    {/* Right: AI Translated & Standardized */}
                    <div className="bg-cyan-950/10 p-4 rounded-xl border border-cyan-500/10 space-y-2 relative overflow-hidden shadow-inner">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl" />
                      
                      <div className="flex items-center justify-between border-b border-cyan-900/30 pb-1.5 relative z-10">
                        <span className="text-[9px] font-bold font-mono text-cyan-400 uppercase tracking-wider block flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                          {t.aiTranslation || "AI Ingest Standardized Text"}
                        </span>
                        <span className="text-[9px] font-mono bg-cyan-950/50 border border-cyan-800/40 px-2 py-0.5 rounded text-cyan-300 font-bold uppercase">
                          ENGLISH TRANS
                        </span>
                      </div>
                      
                      <p className="text-xs text-slate-200 font-sans leading-relaxed font-semibold relative z-10">
                        "{sub.translatedText}"
                      </p>
                    </div>

                  </div>

                  {/* AI Metadata & Status Indicator */}
                  <div className="bg-slate-950/70 p-4 border border-slate-800/60 rounded-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs font-mono">
                    
                    <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-x-5 gap-y-3 text-slate-400">
                      <div>
                        <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider">CATEGORY</span>
                        <span className="text-slate-200 font-sans font-bold">{sub.category}</span>
                      </div>
                      
                      <div>
                        <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider">URGENCY</span>
                        <span className={`inline-block px-2 py-0.5 rounded font-black text-[9px] mt-0.5 ${
                          sub.urgency === 'High'
                            ? 'bg-rose-950/40 text-rose-400 border border-rose-500/20'
                            : sub.urgency === 'Medium'
                            ? 'bg-amber-950/40 text-amber-400 border border-amber-500/20'
                            : 'bg-slate-900 text-slate-400 border border-slate-800'
                        }`}>
                          {sub.urgency.toUpperCase()}
                        </span>
                      </div>

                      {sub.targetDepartment && (
                        <div>
                          <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider">ROUTED TO</span>
                          <span className="text-cyan-400 font-sans font-bold">{sub.targetDepartment.toUpperCase()}</span>
                        </div>
                      )}

                      {sub.sentiment && (
                        <div>
                          <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider">SENTIMENT</span>
                          <span className="flex items-center gap-1.5 mt-1">
                            <span className={`w-2 h-2 rounded-full ${
                              sub.sentiment === 'negative' ? 'bg-rose-500 animate-pulse' : sub.sentiment === 'positive' ? 'bg-emerald-500' : 'bg-slate-500'
                            }`} />
                            <span className="capitalize text-slate-200 font-bold text-[10px]">{sub.sentiment}</span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Department Official Actions Button */}
                    <div className="flex items-center self-start lg:self-center">
                      <button
                        onClick={() => onStatusToggle(sub.id, sub.status)}
                        className={`w-full lg:w-auto px-4 py-2 rounded-xl text-xs font-sans font-extrabold border transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-102 hover:shadow-lg ${
                          sub.status === 'Received'
                            ? 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-slate-200'
                            : sub.status === 'Reviewed'
                            ? 'bg-cyan-950/40 border-cyan-500/30 text-cyan-400 hover:bg-cyan-950/60'
                            : sub.status === 'Approved'
                            ? 'bg-amber-950/40 border-amber-500/30 text-amber-400 hover:bg-amber-950/60'
                            : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400 hover:bg-emerald-950/60'
                        }`}
                        title="Click to advance status (Simulating Official Action)"
                      >
                        <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                        <span>Grievance: {sub.status}</span>
                      </button>
                    </div>

                  </div>

                  {/* Resolution Visual Timeline / Progress Bar */}
                  <div className="bg-slate-950/30 border border-slate-800/40 rounded-xl p-4 space-y-4">
                    <span className="text-[9px] font-bold font-mono text-slate-500 uppercase tracking-wider block">
                      RESOLUTION MILESTONES PROGRESS
                    </span>
                    
                    <div className="relative flex justify-between items-center px-2">
                      {/* Connection bar */}
                      <div className="absolute left-6 right-6 top-4 h-0.5 bg-slate-800" />
                      <div 
                        className="absolute left-6 top-4 h-0.5 bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-500" 
                        style={{ width: `${(Math.max(0, currentStepIndex) / (statusSteps.length - 1)) * 90}%` }}
                      />

                      {statusSteps.map((step, idx) => {
                        const isCompleted = idx <= currentStepIndex;
                        const isCurrent = idx === currentStepIndex;
                        
                        return (
                          <div key={step} className="relative z-10 flex flex-col items-center flex-1">
                            <button 
                              onClick={() => {
                                // Direct jump milestone simulation for polished UX
                                onStatusToggle(sub.id, statusSteps[Math.max(0, idx - 1)]);
                              }}
                              className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 text-xs font-bold cursor-pointer ${
                                isCompleted 
                                  ? 'bg-slate-950 border-cyan-500 text-cyan-400 shadow-md shadow-cyan-950/80 hover:bg-cyan-950/20' 
                                  : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300'
                              }`}
                              title={`Jump to ${step}`}
                            >
                              {isCompleted ? '✓' : idx + 1}
                            </button>
                            <span className={`text-[9px] font-mono font-bold mt-2 tracking-wide ${
                              isCurrent 
                                ? 'text-cyan-400' 
                                : isCompleted 
                                ? 'text-slate-300' 
                                : 'text-slate-600'
                            }`}>
                              {step.toUpperCase()}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Interactive Action Ribbon (Upvote, Comment, Share) */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-3 border-t border-slate-800/40">
                    
                    <div className="flex items-center gap-3">
                      {/* Support/Upvote button */}
                      <button
                        onClick={() => handleUpvote(sub.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-200 text-xs font-sans font-extrabold cursor-pointer ${
                          hasUpvoted 
                            ? 'bg-rose-950/30 border-rose-500/40 text-rose-400' 
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/25 hover:bg-rose-950/10'
                        }`}
                      >
                        <Heart className={`w-4 h-4 transition-transform duration-300 ${hasUpvoted ? 'fill-current scale-110 text-rose-500' : 'group-hover:scale-110'}`} />
                        <span>Support Request ({displayUpvotes})</span>
                      </button>

                      {/* Comment section expand button */}
                      <button
                        onClick={() => setExpandedCommentsId(isCommentsExpanded ? null : sub.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-200 text-xs font-sans font-extrabold cursor-pointer ${
                          isCommentsExpanded 
                            ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-400' 
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/25 hover:bg-cyan-950/10'
                        }`}
                      >
                        <MessageSquare className="w-4 h-4 text-cyan-500" />
                        <span>Discussion ({currentCommentsList.length})</span>
                        {isCommentsExpanded ? <ChevronUp className="w-3.5 h-3.5 ml-0.5" /> : <ChevronDown className="w-3.5 h-3.5 ml-0.5" />}
                      </button>
                    </div>

                    {/* Share Action */}
                    <button
                      onClick={() => handleShare(sub.id)}
                      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl border transition-all text-xs font-sans font-extrabold cursor-pointer ${
                        copiedId === sub.id
                          ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 hover:bg-slate-800'
                      }`}
                    >
                      <Share2 className="w-4 h-4" />
                      <span>{copiedId === sub.id ? "Link Copied!" : "Share Citation"}</span>
                    </button>

                  </div>

                  {/* Expanded Comments Drawer */}
                  {isCommentsExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="border-t border-slate-800/50 pt-4 space-y-4 overflow-hidden"
                    >
                      <span className="text-[9px] font-bold font-mono text-slate-500 uppercase tracking-wider block">
                        COMMUNITY DISPATCH FEED
                      </span>

                      {/* Comments Feed List */}
                      <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                        {currentCommentsList.map((comm) => (
                          <div key={comm.id} className="bg-slate-950 p-3 border border-slate-800/80 rounded-xl space-y-1.5 shadow-sm">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-sans font-bold text-slate-300">
                                  {comm.name[0]}
                                </div>
                                <span className="text-xs font-extrabold text-slate-200">{comm.name}</span>
                                <span className="text-[10px] text-slate-500 font-mono">{comm.handle}</span>
                              </div>
                              <span className="text-[9px] text-slate-500 font-mono">{comm.timestamp}</span>
                            </div>
                            <p className="text-xs text-slate-300 font-sans leading-relaxed pl-8">
                              {comm.text}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Add Comment Input Bar */}
                      <div className="flex items-center gap-2.5 bg-slate-950 border border-slate-800 rounded-xl p-2 shadow-inner focus-within:border-cyan-500/40 transition-all">
                        <input
                          type="text"
                          placeholder="Add supportive comment or critical feedback for this grievance..."
                          value={newCommentText}
                          onChange={(e) => setNewCommentText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddComment(sub.id);
                          }}
                          className="flex-1 bg-transparent text-xs text-slate-200 placeholder-slate-600 px-2.5 focus:outline-none"
                        />
                        <button
                          onClick={() => handleAddComment(sub.id)}
                          disabled={!newCommentText.trim()}
                          className="p-2 bg-cyan-950 border border-cyan-800/50 rounded-xl text-cyan-400 hover:bg-cyan-900/50 hover:text-cyan-300 disabled:opacity-30 disabled:hover:bg-cyan-950 transition-all cursor-pointer"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>

                    </motion.div>
                  )}

                </motion.div>
              );
            })
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-slate-950/30 border border-dashed border-slate-800/80 rounded-2xl p-12 text-center"
            >
              <div className="inline-flex p-3 bg-slate-900/80 border border-slate-800 rounded-2xl mb-3.5">
                <ShieldAlert className="w-6 h-6 text-slate-500" />
              </div>
              <p className="text-xs text-slate-400 font-sans italic leading-relaxed">
                No citizens or suggestions found matching "{searchInput}"
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

    </div>
  );
};
