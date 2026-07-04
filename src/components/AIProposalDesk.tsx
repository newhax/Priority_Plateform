import React, { useState, useRef } from 'react';
import { FileText, Sparkles, Mic, Upload, Camera, Trash2, Download } from 'lucide-react';
import jsPDF from 'jspdf';

interface AIProposalDeskProps {
  state: string;
  city: string;
  ward: string;
  language: string;
  currentUser?: any;
}

export const AIProposalDesk: React.FC<AIProposalDeskProps> = ({ state, city, ward, language, currentUser }) => {
  const [textInput, setTextInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [photoData, setPhotoData] = useState<string | null>(null);
  const [voiceData, setVoiceData] = useState<string | null>(null);
  const [generatedProposal, setGeneratedProposal] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoData(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startRecording = async () => {
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
    };

    recorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop());
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state,
          city,
          ward,
          problemText: textInput,
          language,
          photoData,
          voiceData,
          currentUser
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate proposal');
      }

      const data = await response.json();
      setGeneratedProposal(data.proposal);
    } catch (err) {
      console.error(err);
      alert('Failed to generate proposal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!generatedProposal) return;
    
    const doc = new jsPDF();
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxWidth = pageWidth - (margin * 2);
    
    doc.setFontSize(12);
    
    const splitText = doc.splitTextToSize(generatedProposal, maxWidth);
    
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
    
    doc.save('AI_Proposal.pdf');
  };

  return (
    <div className="bg-slate-900/65 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 shadow-2xl space-y-6">
      <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
        <div className="p-1.5 bg-cyan-950/50 border border-cyan-800/40 rounded-lg">
          <Sparkles className="w-4 h-4 text-cyan-400" />
        </div>
        <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wide">AI Proposal Desk</h2>
      </div>

      <div className="space-y-4">
        <textarea
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Describe your problem..."
          className="w-full text-xs bg-slate-950/60 border border-slate-800 focus:border-cyan-500/50 rounded-xl p-3 text-slate-100"
          rows={4}
        />
        
        <div className="grid grid-cols-2 gap-2">
            <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" accept="image/*" />
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 py-2 px-3 bg-slate-800 rounded-lg text-slate-300 text-xs hover:bg-slate-700">
                <Camera className="w-4 h-4"/> {photoData ? 'Photo Added' : 'Upload Photo'}
            </button>
            <button 
                onClick={isRecording ? stopRecording : startRecording}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs ${isRecording ? 'bg-rose-900 text-rose-200' : 'bg-slate-800 text-slate-300'} hover:bg-slate-700`}>
                <Mic className="w-4 h-4"/> {isRecording ? 'Stop Recording' : (voiceData ? 'Voice Note Added' : 'Voice Note')}
            </button>
        </div>
        
        {(photoData || voiceData) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {photoData && (
              <div className="relative">
                <img src={photoData} alt="Preview" className="w-full h-32 object-cover rounded-lg border border-slate-700" />
                <button onClick={() => setPhotoData(null)} className="absolute top-2 right-2 p-1.5 bg-red-500/80 rounded-full text-white hover:bg-red-600"><Trash2 size={14}/></button>
              </div>
            )}
            {voiceData && (
              <div className="relative p-3 bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Mic size={16} /> <span>Voice Recorded</span>
                </div>
                <button onClick={() => setVoiceData(null)} className="p-1.5 hover:bg-slate-700 rounded-full text-red-400"><Trash2 size={16}/></button>
              </div>
            )}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading || (!textInput.trim() && !photoData && !voiceData)}
          className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
        >
          {loading ? 'Analyzing...' : 'Generate Proposal'}
        </button>
      </div>

      {generatedProposal !== null && (
        <div className="space-y-4 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-cyan-400 text-xs">Edit Proposal</h3>
            <button 
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 py-1.5 px-3 rounded-md transition-colors"
            >
              <Download size={14} /> Download PDF
            </button>
          </div>
          <textarea
            value={generatedProposal}
            onChange={(e) => setGeneratedProposal(e.target.value)}
            className="w-full h-64 p-4 bg-slate-950 border border-cyan-500/30 rounded-xl text-slate-300 text-xs font-sans whitespace-pre-wrap leading-relaxed shadow-inner focus:outline-none focus:border-cyan-500/60"
          />
        </div>
      )}
    </div>
  );
};
