import React from 'react';
import { MessageSquare, Check, Phone, ArrowUpRight } from 'lucide-react';

interface WhatsAppMessage {
  id: string;
  sender: string;
  time: string;
  text: string;
  lang: 'en' | 'ml' | 'hi' | 'ta';
}

interface WhatsAppPreviewProps {
  onSelectMessage: (text: string, lang: 'en' | 'ml' | 'hi' | 'ta', sender: string) => void;
  state: string;
  city: string;
  userName: string;
}

const MOCK_MESSAGES: WhatsAppMessage[] = [
  {
    id: 'wa_1',
    sender: 'Sajeev Kumar',
    time: '10:02 AM',
    text: 'കഴക്കൂട്ടത്ത് ഗവൺമെന്റ് സ്കൂളിലേക്ക് കുട്ടികൾക്ക് പോകാൻ വഴിയിൽ വെളിച്ചമില്ല. സോളാർ തെരുവ് വിളക്കുകൾ അടിയന്തിരമായി വേണം.',
    lang: 'ml',
  },
  {
    id: 'wa_2',
    sender: 'Saritha Pillai',
    time: '11:15 AM',
    text: 'വാർഡിൽ കുടിവെള്ള പൈപ്പുകൾ പൊട്ടിയിട്ട് മൂന്ന് ദിവസമായി. വെള്ളം പാഴായി പോകുന്നു. ദയവായി നടപടിയെടുക്കുക.',
    lang: 'ml',
  },
  {
    id: 'wa_3',
    sender: 'Devan Pillai',
    time: 'Yesterday',
    text: 'விழிஞ்ஞம் துறைமுக வேலைகளுக்காக இளைஞர்களுக்கு சிறப்பு பயிற்சி மையம் வேண்டும். வேலை வாய்ப்பு கிடைக்க இது உதவும்.',
    lang: 'ta',
  },
  {
    id: 'wa_4',
    sender: 'Rakesh Yadav',
    time: 'Yesterday',
    text: 'कचरा निस्तारण की कोई अच्छी व्यवस्था नहीं है। चारों तरफ बदबू फैली हुई है। कूड़ेदान बढ़ाए जाएं।',
    lang: 'hi',
  }
];

export const WhatsAppPreview: React.FC<WhatsAppPreviewProps> = ({ onSelectMessage, state, city, userName }) => {
  const getStateIntakeNode = (state: string) => {
    const nodes: Record<string, string> = {
      'Kerala': '+91 90123-55500',
      'Tamil Nadu': '+91 80123-44400',
      'Delhi': '+91 70123-33300',
      'Maharashtra': '+91 91234-56789',
      'Karnataka': '+91 82345-67890',
      'Gujarat': '+91 74567-89012',
      'Rajasthan': '+91 75678-90123',
      'West Bengal': '+91 76789-01234',
      'Punjab': '+91 77890-12345',
      'Haryana': '+91 78901-23456',
      'Telangana': '+91 79012-34567',
    };
    return nodes[state] || '+91 90000-00000';
  };

  const nodeNumber = getStateIntakeNode(state);
  const waLink = `https://wa.me/${nodeNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi, I am ${userName || 'a citizen'}. I want to report a grievance in ${city}, ${state}.`)}`;

  return (
    <div className="bg-slate-900/65 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 shadow-2xl shadow-emerald-950/10 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-emerald-950/60 border border-emerald-500/30 rounded-lg">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 font-display uppercase tracking-wide">
              {state} Intake Node
            </h3>
            <p className="text-[9px] text-emerald-400 font-mono font-bold tracking-widest uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block"></span>
              Secure Node: {city.toUpperCase()}
            </p>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-400 mb-4 font-sans leading-relaxed">
        Autonomous intake nodes ingest civilian representations via encrypted WhatsApp channels. Click any payload below to **simulate secure ingestion** into the legislative database:
      </p>

      {/* Message Stream */}
      <div className="space-y-3 flex-1 overflow-y-auto max-h-[320px] pr-1">
        {MOCK_MESSAGES.map((msg) => (
          <button
            key={msg.id}
            id={`wa-msg-${msg.id}`}
            onClick={() => onSelectMessage(msg.text, msg.lang, msg.sender.split(' ')[0])}
            className="w-full text-left bg-slate-950/40 hover:bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/50 rounded-xl p-3.5 transition-all duration-300 group relative flex flex-col gap-1"
          >
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-emerald-400 font-mono flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-emerald-500/60" />
                {msg.sender.toUpperCase()}
              </span>
              <span className="text-slate-500 font-mono text-[10px]">{msg.time}</span>
            </div>
            
            <p className="text-xs text-slate-100 font-sans leading-relaxed bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/50 mt-1 shadow-inner">
              "{msg.text}"
            </p>

            <div className="flex items-center justify-end mt-1 text-[9px] font-mono">
              <span className="text-emerald-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 tracking-wider">
                IMPORT BUFFER <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[9px] text-slate-500 font-mono">
        <span className="flex items-center gap-1 text-emerald-500/80">
          <Check className="w-3 h-3 text-emerald-400" />
          SECURE END-TO-END CRYPTO CHANNEL
        </span>
        <span>INTELLIGENT CITIZEN INTAKE</span>
      </div>
    </div>
  );
};
