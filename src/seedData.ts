import { Submission, WardData, ProposedProject } from './types';

export const INITIAL_WARDS: WardData[] = [
  {
    id: 'kazhakkoottam',
    name: 'Kazhakkoottam',
    population: 48000,
    avgIncome: 'High',
    elderlyRatio: 12,
    studentRatio: 35,
    primaryNeeds: ['High School Access', 'Evening Transit', 'Pedestrian Walkways'],
    infrastructureGaps: {
      schools: 8, // high deficit
      clinics: 4,
      waterAccess: 10,
      roadQuality: 7,
    },
  },
  {
    id: 'medical_college',
    name: 'Medical College',
    population: 52000,
    avgIncome: 'Medium',
    elderlyRatio: 22,
    studentRatio: 20,
    primaryNeeds: ['Traffic Decongestion', 'Elderly Daycare', 'Waste Management'],
    infrastructureGaps: {
      schools: 2,
      clinics: 1, // very low deficit
      waterAccess: 5,
      roadQuality: 4, // bad roads/congestion
    },
  },
  {
    id: 'vattiyoorkavu',
    name: 'Vattiyoorkavu',
    population: 41000,
    avgIncome: 'Medium',
    elderlyRatio: 15,
    studentRatio: 28,
    primaryNeeds: ['Summer Water Supply', 'Public Library', 'Waste Sorting Yard'],
    infrastructureGaps: {
      schools: 3,
      clinics: 3,
      waterAccess: 35, // high deficit in water coverage
      roadQuality: 6,
    },
  },
  {
    id: 'vazhuthacaud',
    name: 'Vazhuthacaud',
    population: 38000,
    avgIncome: 'High',
    elderlyRatio: 18,
    studentRatio: 22,
    primaryNeeds: ['Electric Vehicle Chargers', 'Green Parks', 'Noise Reduction'],
    infrastructureGaps: {
      schools: 2,
      clinics: 2,
      waterAccess: 3,
      roadQuality: 8,
    },
  },
  {
    id: 'kovalam',
    name: 'Kovalam',
    population: 35000,
    avgIncome: 'Low',
    elderlyRatio: 14,
    studentRatio: 24,
    primaryNeeds: ['Coastal Drainage', 'Primary Health Centre Upgrade', 'Sanitation Facilities'],
    infrastructureGaps: {
      schools: 5,
      clinics: 8, // high clinic deficit
      waterAccess: 25,
      roadQuality: 5,
    },
  },
  {
    id: 'nemom',
    name: 'Nemom',
    population: 55000,
    avgIncome: 'Low',
    elderlyRatio: 11,
    studentRatio: 32,
    primaryNeeds: ['Primary School Safety', 'Sewerage Treatment', 'Maternal Health Clinic'],
    infrastructureGaps: {
      schools: 6,
      clinics: 7,
      waterAccess: 28,
      roadQuality: 4,
    },
  },
  {
    id: 'vizhinjam',
    name: 'Vizhinjam',
    population: 45000,
    avgIncome: 'Low',
    elderlyRatio: 10,
    studentRatio: 30,
    primaryNeeds: ['Vocational Training', 'Drinking Water Taps', 'Fisherfolk Safety Shelter'],
    infrastructureGaps: {
      schools: 4,
      clinics: 6,
      waterAccess: 30,
      roadQuality: 5,
    },
  },
  {
    id: 'ulloor',
    name: 'Ulloor',
    population: 43000,
    avgIncome: 'Medium',
    elderlyRatio: 16,
    studentRatio: 25,
    primaryNeeds: ['Storm Water Drains', 'Recreational Park', 'Streetlights'],
    infrastructureGaps: {
      schools: 3,
      clinics: 4,
      waterAccess: 12,
      roadQuality: 6,
    },
  },
];

export const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: 'sub_1',
    name: 'Harikrishnan K.',
    phone: '+91 94471 23456',
    language: 'ml',
    inputType: 'text',
    originalText: 'കഴക്കൂട്ടത്ത് ഒരു പുതിയ ഗവൺമെന്റ് ഹൈസ്കൂൾ വേണം, കുട്ടികൾക്ക് പഠിക്കാൻ ദൂരെ പോകേണ്ടി വരുന്നു. ബസ് ചാർജ് കൊടുക്കാൻ സാധാരണക്കാർക്ക് ബുദ്ധിമുട്ടാണ്.',
    translatedText: 'A new government high school is needed in Kazhakkoottam; children have to travel far to study. It is difficult for common people to afford bus fares.',
    category: 'Education',
    ward: 'Kazhakkoottam',
    urgency: 'High',
    timestamp: '2026-07-01T10:14:00-07:00',
    sentiment: 'negative',
    impactCount: 1200,
    status: 'Reviewed',
    aiSummary: 'Demand for a government high school in Kazhakkoottam due to long school commute distances and unaffordable transit costs.',
  },
  {
    id: 'sub_2',
    name: 'Anjali Sharma',
    phone: '+91 98950 98765',
    language: 'hi',
    inputType: 'voice',
    originalText: 'कोवलम तट के पास स्वच्छता की बहुत समस्या है। जल निकासी व्यवस्था को तुरंत ठीक करने की आवश्यकता है, जिससे यहाँ पर्यटकों और निवासियों दोनों को बीमारी का खतरा कम हो सके।',
    translatedText: 'There is a major sanitation issue near Kovalam beach. The drainage system needs immediate repair to reduce risk of disease for both tourists and residents.',
    category: 'Sanitation',
    ward: 'Kovalam',
    urgency: 'High',
    timestamp: '2026-07-01T14:30:00-07:00',
    sentiment: 'negative',
    impactCount: 800,
    audioUrl: '#simulated-audio-wave',
    status: 'Approved',
    aiSummary: 'Urgent requests to upgrade and fix the beachside drainage system near Kovalam to stop water contamination and protect tourist health.',
  },
  {
    id: 'sub_3',
    name: 'Senthil Kumar',
    phone: '+91 81290 11223',
    language: 'ta',
    inputType: 'whatsapp',
    originalText: 'விழிஞ்ஞம் பகுதியில் புதிய தொழில் பயிற்சி மையம் தேவைப்படுகிறது. இளைஞர்களுக்கு வேலைவாய்ப்பு கிடைக்கும், துறைமுகத் திட்டத்தில் வேலை செய்ய பயனுள்ளதாக இருக்கும்.',
    translatedText: 'A new vocational training center is required in the Vizhinjam area. It will provide employment opportunities for youth and prepare them for port-related jobs.',
    category: 'Vocations',
    ward: 'Vizhinjam',
    urgency: 'Medium',
    timestamp: '2026-07-02T09:12:00-07:00',
    sentiment: 'neutral',
    impactCount: 2500,
    status: 'Received',
    aiSummary: 'Proposal for an industrial/vocational training school at Vizhinjam to equip local youth with skills required for port operations.',
  },
  {
    id: 'sub_4',
    name: 'George Mathew',
    phone: '+91 94460 55443',
    language: 'ml',
    inputType: 'text',
    originalText: 'വട്ടിയൂർക്കാവിൽ വേനൽക്കാലത്ത് കുടിവെള്ളക്ഷാമം രൂക്ഷമാണ്. പ്രധാന പൈപ്പ് ലൈൻ അറ്റകുറ്റപ്പണികൾ ഉടൻ നടത്തണം, പൊതു കുടിവെള്ള ടാപ്പുകൾ സ്ഥാപിക്കണം.',
    translatedText: 'Drinking water scarcity is severe in Vattiyoorkavu during summer. Major pipeline repairs should be done immediately, and public drinking water taps must be installed.',
    category: 'Water Supply',
    ward: 'Vattiyoorkavu',
    urgency: 'High',
    timestamp: '2026-07-02T16:45:00-07:00',
    sentiment: 'negative',
    impactCount: 1500,
    status: 'Received',
    aiSummary: 'Critical summer water shortages in Vattiyoorkavu. Call for emergency pipeline repair and localized public drinking water kiosks.',
  },
  {
    id: 'sub_5',
    name: 'Lekshmi Nair',
    phone: '+91 94960 12345',
    language: 'ml',
    inputType: 'photo',
    originalText: 'മെഡിക്കൽ കോളേജ് റോഡുകളിൽ കനത്ത ഗതാഗതക്കുരുക്കാണ്. ആംബുലൻസുകൾ പോലും കുടുങ്ങി കിടക്കുന്നു. റോഡ് വീതികൂട്ടണം അല്ലെങ്കിൽ പുതിയ ക്രമീകരണങ്ങൾ വേണം.',
    translatedText: 'Heavy traffic congestion is occurring on Medical College roads. Even ambulances are getting stuck. Road widening or new traffic arrangements are badly needed.',
    category: 'Roads & Transport',
    ward: 'Medical College',
    urgency: 'High',
    timestamp: '2026-07-02T11:20:00-07:00',
    sentiment: 'negative',
    impactCount: 5000,
    photoUrl: '/assets/sample_traffic.jpg',
    status: 'Received',
    aiSummary: 'Critical ambulance blockages on Medical College roads. Recommends immediate pedestrian subways or intersection restructuring.',
  },
  {
    id: 'sub_6',
    name: 'Dr. Vineeth Joseph',
    phone: '+91 98470 54321',
    language: 'en',
    inputType: 'text',
    originalText: 'The primary health centre in Nemom is extremely congested and understaffed. We need an extension wing for maternal and child healthcare, as mothers currently travel 12 km to town.',
    translatedText: 'The primary health centre in Nemom is extremely congested and understaffed. We need an extension wing for maternal and child healthcare, as mothers currently travel 12 km to town.',
    category: 'Healthcare',
    ward: 'Nemom',
    urgency: 'High',
    timestamp: '2026-07-01T08:00:00-07:00',
    sentiment: 'negative',
    impactCount: 3000,
    status: 'Reviewed',
    aiSummary: 'Congestion and maternal healthcare gap at Nemom PHC. Recommends expanding specialized pediatric and maternity wings to avoid travel to general hospitals.',
  },
  {
    id: 'sub_7',
    name: 'Radhakrishnan Nair',
    phone: '+91 95620 90807',
    language: 'ml',
    inputType: 'voice',
    originalText: 'ഉള്ളൂരിലെ ഓടകൾ കവിഞ്ഞൊഴുകുകയാണ്. ഒരല്പം മഴ പെയ്താൽ റോഡ് മുഴുവൻ വെള്ളത്തിലാകും. ശാസ്ത്രീയമായ ഓട നിർമാണം വേണം.',
    translatedText: 'Drains in Ulloor are overflowing. Even a small shower floods the entire road. Scientifically designed drainage construction is necessary.',
    category: 'Sanitation',
    ward: 'Ulloor',
    urgency: 'Medium',
    timestamp: '2026-07-02T18:05:00-07:00',
    sentiment: 'negative',
    impactCount: 950,
    audioUrl: '#simulated-audio-wave',
    status: 'Received',
    aiSummary: 'Inadequate drainage system in Ulloor leading to severe localized urban flooding during standard monsoons.',
  },
  {
    id: 'sub_8',
    name: 'Meena kumari',
    phone: '+91 97440 22334',
    language: 'en',
    inputType: 'whatsapp',
    originalText: 'Vazhuthacaud area needs better municipal parks with sitting space for senior citizens. Also solar street lights in inner residential lanes.',
    translatedText: 'Vazhuthacaud area needs better municipal parks with sitting space for senior citizens. Also solar street lights in inner residential lanes.',
    category: 'Sanitation',
    ward: 'Vazhuthacaud',
    urgency: 'Low',
    timestamp: '2026-07-03T00:05:00-07:00',
    sentiment: 'positive',
    impactCount: 400,
    status: 'Received',
    aiSummary: 'Enhancement of senior citizen accessibility in public parks at Vazhuthacaud, along with eco-friendly solar lighting.',
  }
];

export const INITIAL_PROJECTS: ProposedProject[] = [
  {
    id: 'proj_1',
    title: 'Kazhakkoottam Gov High School New Academic Block',
    category: 'Education',
    ward: 'Kazhakkoottam',
    estimatedCost: 45, // Lakhs
    infrastructureBenefitScore: 88, // fills school gap (8/10 deficit)
    demographicNeedScore: 82, // studentRatio is 35%
    demandIndex: 94, // based on sub_1 urgency and similar requests
    citizenSubmissionsCount: 14,
    description: 'Construction of a two-story multi-classroom academic block with physics/chemistry laboratories and reliable computer science infrastructure at Government High School, Kazhakkoottam.',
  },
  {
    id: 'proj_2',
    title: 'Kovalam Beach Integrated Storm Water Drainage Network',
    category: 'Sanitation',
    ward: 'Kovalam',
    estimatedCost: 80,
    infrastructureBenefitScore: 75, // clinics gap 8, water 25
    demographicNeedScore: 70, // coastal, low income ward
    demandIndex: 90, // urgent tourist destination environmental safety
    citizenSubmissionsCount: 11,
    description: 'Laying scientific concrete stormwater trunk drains, bypass pumping units, and filtration screening barriers near the beach zone to prevent sewage spillover and disease.',
  },
  {
    id: 'proj_3',
    title: 'Vattiyoorkavu Drinking Water Grid & Pipeline Extension',
    category: 'Water Supply',
    ward: 'Vattiyoorkavu',
    estimatedCost: 60,
    infrastructureBenefitScore: 92, // water gap is 35%
    demographicNeedScore: 68,
    demandIndex: 85,
    citizenSubmissionsCount: 18,
    description: 'Replacing standard 80mm pipes with high-diameter ductile iron supply mains from the reservoir, expanding community tap standposts to unpiped clusters.',
  },
  {
    id: 'proj_4',
    title: 'Nemom PHC Maternal and Child Health Care Wing',
    category: 'Healthcare',
    ward: 'Nemom',
    estimatedCost: 75,
    infrastructureBenefitScore: 85, // clinics gap is 7
    demographicNeedScore: 90, // low income, densely populated ward
    demandIndex: 88,
    citizenSubmissionsCount: 9,
    description: 'Establishment of a specialized maternal-pediatric ward at Nemom Primary Health Centre, adding essential diagnostic scanners, prenatal units, and specialized nursing quarters.',
  },
  {
    id: 'proj_5',
    title: 'Vizhinjam Port Skill Development & Vocational Institute',
    category: 'Vocations',
    ward: 'Vizhinjam',
    estimatedCost: 90,
    infrastructureBenefitScore: 65,
    demographicNeedScore: 85, // student/youth ratio high, low income
    demandIndex: 82,
    citizenSubmissionsCount: 15,
    description: 'A fully equipped skill training centre with specialized marine engineering, logistics handling, heavy machinery operating, and digital operations modules.',
  },
  {
    id: 'proj_6',
    title: 'Medical College Junction Road Widening & Traffic Restructuring',
    category: 'Roads & Transport',
    ward: 'Medical College',
    estimatedCost: 120,
    infrastructureBenefitScore: 95, // roadQuality is 4/10
    demographicNeedScore: 75, // high elderly ratio 22% needs easy crossings
    demandIndex: 96, // critical safety/ambulance issue
    citizenSubmissionsCount: 22,
    description: 'Widening bottleneck pathways from Medical College gates, establishing dedicated emergency ambulance lanes, and building a high-capacity concrete pedestrian subway.',
  },
  {
    id: 'proj_7',
    title: 'Ulloor Stormwater Channelization & Sewer Upgrades',
    category: 'Sanitation',
    ward: 'Ulloor',
    estimatedCost: 50,
    infrastructureBenefitScore: 72,
    demographicNeedScore: 62,
    demandIndex: 68,
    citizenSubmissionsCount: 5,
    description: 'Excavation of standard gravity flow drains and installation of automated screen rakes to capture plastic garbage clogging the canal inlets.',
  }
];

export interface StateCityMap {
  state: string;
  cities: string[];
}

export const INDIAN_STATES_CITIES: StateCityMap[] = [
  {
    state: 'Kerala',
    cities: ['Thiruvananthapuram', 'Ernakulam', 'Kozhikode', 'Wayanad']
  },
  {
    state: 'Delhi',
    cities: ['New Delhi', 'East Delhi', 'Chandni Chowk']
  },
  {
    state: 'Maharashtra',
    cities: ['Mumbai South', 'Pune', 'Nagpur']
  },
  {
    state: 'Karnataka',
    cities: ['Bangalore South', 'Mysuru', 'Hubli-Dharwad']
  },
  {
    state: 'Tamil Nadu',
    cities: ['Chennai South', 'Coimbatore', 'Madurai']
  },
  {
    state: 'Uttar Pradesh',
    cities: ['Lucknow', 'Varanasi', 'Amethi']
  },
  {
    state: 'Andhra Pradesh',
    cities: ['Visakhapatnam', 'Vijayawada', 'Tirupati']
  },
  {
    state: 'Gujarat',
    cities: ['Ahmedabad West', 'Surat', 'Vadodara']
  },
  {
    state: 'Rajasthan',
    cities: ['Jaipur', 'Jodhpur', 'Udaipur']
  },
  {
    state: 'West Bengal',
    cities: ['Kolkata South', 'Darjeeling', 'Asansol']
  },
  {
    state: 'Punjab',
    cities: ['Amritsar', 'Ludhiana', 'Patiala']
  },
  {
    state: 'Haryana',
    cities: ['Gurugram', 'Faridabad', 'Ambala']
  },
  {
    state: 'Telangana',
    cities: ['Hyderabad', 'Secunderabad', 'Warangal']
  },
  {
    state: 'Madhya Pradesh',
    cities: ['Bhopal', 'Indore', 'Gwalior']
  },
  {
    state: 'Bihar',
    cities: ['Patna Sahib', 'Gaya', 'Bhagalpur']
  },
  {
    state: 'Assam',
    cities: ['Guwahati', 'Dibrugarh', 'Silchar']
  },
  {
    state: 'Odisha',
    cities: ['Bhubaneswar', 'Cuttack', 'Puri']
  },
  {
    state: 'Jammu & Kashmir',
    cities: ['Srinagar', 'Jammu', 'Anantnag']
  }
];

export const ALL_INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttarakhand', 'Uttar Pradesh', 
  'West Bengal', 'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh', 
  'Andaman & Nicobar', 'Dadra & Nagar Haveli', 'Lakshadweep'
];

