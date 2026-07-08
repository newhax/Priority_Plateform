import { Submission, ProposedProject } from './types';


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
    urgency: 'High',
    timestamp: '2026-07-01T10:14:00-07:00',
    sentiment: 'negative',
    impactCount: 1200,
    status: 'Reviewed',
    aiSummary: 'Demand for a government high school in Kazhakkoottam due to long school commute distances and unaffordable transit costs.',
    latitude: 8.5684,
    longitude: 76.8732,
    locationVerified: true
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
    urgency: 'High',
    timestamp: '2026-07-01T14:30:00-07:00',
    sentiment: 'negative',
    impactCount: 800,
    audioUrl: '#simulated-audio-wave',
    status: 'Approved',
    aiSummary: 'Urgent requests to upgrade and fix the beachside drainage system near Kovalam to stop water contamination and protect tourist health.',
    latitude: 8.4005,
    longitude: 76.9785,
    locationVerified: true
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
    urgency: 'Medium',
    timestamp: '2026-07-02T09:12:00-07:00',
    sentiment: 'neutral',
    impactCount: 2500,
    status: 'Received',
    aiSummary: 'Proposal for an industrial/vocational training school at Vizhinjam to equip local youth with skills required for port operations.',
    latitude: 8.3758,
    longitude: 76.9904,
    locationVerified: true
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
    urgency: 'High',
    timestamp: '2026-07-02T16:45:00-07:00',
    sentiment: 'negative',
    impactCount: 1500,
    status: 'Received',
    aiSummary: 'Critical summer water shortages in Vattiyoorkavu. Call for emergency pipeline repair and localized public drinking water kiosks.',
    latitude: 8.5284,
    longitude: 76.9801,
    locationVerified: true
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
    urgency: 'High',
    timestamp: '2026-07-02T11:20:00-07:00',
    sentiment: 'negative',
    impactCount: 5000,
    photoUrls: ['/assets/sample_traffic.jpg'],
    status: 'Received',
    aiSummary: 'Critical ambulance blockages on Medical College roads. Recommends immediate pedestrian subways or intersection restructuring.',
    latitude: 8.5218,
    longitude: 76.9270,
    locationVerified: true
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
    urgency: 'High',
    timestamp: '2026-07-01T08:00:00-07:00',
    sentiment: 'negative',
    impactCount: 3000,
    status: 'Reviewed',
    aiSummary: 'Congestion and maternal healthcare gap at Nemom PHC. Recommends expanding specialized pediatric and maternity wings to avoid travel to general hospitals.',
    latitude: 8.4632,
    longitude: 77.0003,
    locationVerified: true
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
    urgency: 'Medium',
    timestamp: '2026-07-02T18:05:00-07:00',
    sentiment: 'negative',
    impactCount: 950,
    audioUrl: '#simulated-audio-wave',
    status: 'Received',
    aiSummary: 'Inadequate drainage system in Ulloor leading to severe localized urban flooding during standard monsoons.',
    latitude: 8.5342,
    longitude: 76.9184,
    locationVerified: true
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
    urgency: 'Low',
    timestamp: '2026-07-03T00:05:00-07:00',
    sentiment: 'positive',
    impactCount: 400,
    status: 'Received',
    aiSummary: 'Enhancement of senior citizen accessibility in public parks at Vazhuthacaud, along with eco-friendly solar lighting.',
    latitude: 8.5012,
    longitude: 76.9584,
    locationVerified: true
  }
];

export const INITIAL_PROJECTS: ProposedProject[] = [
  {
    id: 'proj_1',
    title: 'Kazhakkoottam Gov High School New Academic Block',
    category: 'Education',
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
    cities: ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Kollam', 'Thrissur', 'Alappuzha', 'Palakkad', 'Kottayam', 'Kannur', 'Manjeri', 'Kasaragod', 'Wayanad', 'Pathanamthitta', 'Idukki', 'Malappuram', 'Koduvally', 'Neyyattinkara', 'Kayamkulam', 'Muvattupuzha', 'Vatakara', 'Changanassery', 'Punalur', 'Cherthala']
  },
  {
    state: 'Delhi',
    cities: ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi', 'Dwarka', 'Rohini', 'Chandni Chowk', 'Karol Bagh', 'Connaught Place', 'Vasant Kunj', 'Saket', 'Rajouri Garden', 'Janakpuri', 'Mayur Vihar', 'Laxmi Nagar']
  },
  {
    state: 'Maharashtra',
    cities: ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Pimpri-Chinchwad', 'Nashik', 'Kalyan-Dombivli', 'Vasai-Virar', 'Aurangabad', 'Navi Mumbai', 'Solapur', 'Mira-Bhayandar', 'Kolhapur', 'Amravati', 'Sangli', 'Nanded', 'Akola', 'Jalgaon', 'Dhule', 'Ahmednagar', 'Chandrapur', 'Parbhani', 'Ichalkaranji', 'Jalna', 'Bhusawal', 'Panvel', 'Satara', 'Alibag', 'Ratnagiri', 'Latur', 'Gondia']
  },
  {
    state: 'Karnataka',
    cities: ['Bengaluru', 'Hubballi-Dharwad', 'Mysuru', 'Kalaburagi', 'Mangaluru', 'Belagavi', 'Davanagere', 'Ballari', 'Vijayapura', 'Shivamogga', 'Tumakuru', 'Raichur', 'Bidar', 'Hosapete', 'Gadag-Betageri', 'Hassan', 'Udupi', 'Kolar', 'Mandya', 'Karwar', 'Chikmagalur', 'Chitradurga', 'Bagalkot', 'Ranibennur', 'Gangavati']
  },
  {
    state: 'Tamil Nadu',
    cities: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tiruppur', 'Erode', 'Vellore', 'Thoothukudi', 'Tirunelveli', 'Nagercoil', 'Thanjavur', 'Dindigul', 'Karur', 'Ranipet', 'Sivakasi', 'Kanchipuram', 'Ooty', 'Cuddalore', 'Kumbakonam', 'Pollachi', 'Karaikudi', 'Neyveli', 'Ambur', 'Pudukkottai']
  },
  {
    state: 'Andhra Pradesh',
    cities: ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Tirupati', 'Kurnool', 'Kakinada', 'Rajamahendravaram', 'Kadapa', 'Anantapur', 'Eluru', 'Vizianagaram', 'Ongole', 'Nandyal', 'Machilipatnam', 'Adoni', 'Tenali', 'Proddatur', 'Chittoor', 'Hindupur', 'Bhimavaram', 'Madanapalle', 'Guntakal', 'Dharmavaram', 'Gudivada', 'Srikakulam']
  },
  {
    state: 'Gujarat',
    cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Gandhinagar', 'Nadiad', 'Gandhidham', 'Anand', 'Morbi', 'Mehsana', 'Surendranagar', 'Bhuj', 'Veraval', 'Navsari', 'Valsad', 'Vapi', 'Godhra', 'Bharuch', 'Porbandar', 'Botad', 'Palanpur', 'Kalol', 'Jetpur', 'Patan', 'Dahod']
  },
  {
    state: 'Rajasthan',
    cities: ['Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer', 'Udaipur', 'Bhilwara', 'Alwar', 'Sikar', 'Bharatpur', 'Sri Ganganagar', 'Hanumangarh', 'Pali', 'Tonk', 'Kishangarh', 'Beawar', 'Sadulpur', 'Dhaulpur', 'Gangapur City', 'Sawai Madhopur', 'Jhunjhunu', 'Baran', 'Chittorgarh', 'Churu', 'Hindaun', 'Banswara']
  },
  {
    state: 'West Bengal',
    cities: ['Kolkata', 'Howrah', 'Siliguri', 'Asansol', 'Durgapur', 'Bardhaman', 'Malda', 'Baharampur', 'Habra', 'Kharagpur', 'Shantipur', 'Dankuni', 'Alipurduar', 'Cooch Behar', 'Haldia', 'Darjeeling', 'Kalimpong', 'Purulia', 'Jalpaiguri', 'Balurghat', 'Bankura', 'Basirhat', 'Kalyani']
  },
  {
    state: 'Punjab',
    cities: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Hoshiarpur', 'Pathankot', 'Moga', 'Abohar', 'Khanna', 'Sri Muktsar Sahib', 'Barnala', 'Firozpur', 'Kapurthala', 'Phagwara', 'Zirakpur', 'Rajpura', 'Batala']
  },
  {
    state: 'Haryana',
    cities: ['Faridabad', 'Gurugram', 'Panipat', 'Ambala', 'Yamunanagar', 'Rohtak', 'Hisar', 'Karnal', 'Sonipat', 'Panchkula', 'Sirsa', 'Bhiwani', 'Bahadurgarh', 'Jind', 'Thanesar', 'Kaithal', 'Rewari', 'Palwal', 'Hansi', 'Narnaul', 'Pundri', 'Tohana']
  },
  {
    state: 'Telangana',
    cities: ['Hyderabad', 'Warangal', 'Nizamabad', 'Khammam', 'Karimnagar', 'Ramagundam', 'Mahbubnagar', 'Nalgonda', 'Adilabad', 'Suryapet', 'Miryalaguda', 'Siddipet', 'Jagtial', 'Mancherial', 'Kothagudem', 'Bodhan', 'Siricilla']
  },
  {
    state: 'Madhya Pradesh',
    cities: ['Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Dewas', 'Satna', 'Ratlam', 'Rewa', 'Murwara', 'Singrauli', 'Burhanpur', 'Khandwa', 'Bhind', 'Chhindwara', 'Guna', 'Shivpuri', 'Vidisha', 'Chhatarpur', 'Damoh', 'Mandsaur', 'Khargone', 'Neemuch', 'Itarsi', 'Sehore', 'Hoshangabad']
  },
  {
    state: 'Bihar',
    cities: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga', 'Bihar Sharif', 'Arrah', 'Begusarai', 'Katihar', 'Munger', 'Chhapra', 'Bettiah', 'Saharsa', 'Sasaram', 'Hajipur', 'Dehri', 'Siwan', 'Motihari', 'Nawada', 'Bagaha', 'Buxar', 'Kishanganj', 'Jamalpur', 'Jehanabad', 'Aurangabad', 'Samastipur', 'Madhubani']
  },
  {
    state: 'Assam',
    cities: ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia', 'Tezpur', 'Bongaigaon', 'Karimganj', 'Sivasagar', 'North Lakhimpur', 'Goalpara', 'Dhubri', 'Barpeta', 'Diphu', 'Lumding', 'Hailakandi', 'Kokrajhar']
  },
  {
    state: 'Odisha',
    cities: ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Brahmapur', 'Sambalpur', 'Puri', 'Balasore', 'Bhadrak', 'Baripada', 'Jharsuguda', 'Balangir', 'Rayagada', 'Jeypore', 'Bargarh', 'Kendrapara', 'Bhawanipatna', 'Dhenkanal']
  },
  {
    state: 'Jammu & Kashmir',
    cities: ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Kathua', 'Sopore', 'Samba', 'Udhampur', 'Poonch', 'Rajouri', 'Kupwara', 'Reasi', 'Ramban', 'Doda']
  },
  {
    state: 'Arunachal Pradesh',
    cities: ['Itanagar', 'Naharlagun', 'Pasighat', 'Namsai', 'Ziro', 'Bomdila', 'Tezu', 'Along', 'Khonsa', 'Tawang']
  },
  {
    state: 'Chhattisgarh',
    cities: ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Rajnandgaon', 'Jagdalpur', 'Raigarh', 'Ambikapur', 'Dhamtari', 'Mahasamund', 'Champa', 'Naila Janjgir', 'Bhatapara', 'Durg', 'Surguja']
  },
  {
    state: 'Goa',
    cities: ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda', 'Bicholim', 'Curchorem', 'Cuncolim', 'Valpoi', 'Canacona', 'Sanquelim']
  },
  {
    state: 'Himachal Pradesh',
    cities: ['Shimla', 'Dharamshala', 'Solan', 'Mandi', 'Bilaspur', 'Kullu', 'Chamba', 'Hamirpur', 'Una', 'Nahan', 'Keylong', 'Paonta Sahib', 'Kangra', 'Sundernagar']
  },
  {
    state: 'Jharkhand',
    cities: ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro Steel City', 'Deoghar', 'Phusro', 'Hazaribagh', 'Giridih', 'Ramgarh', 'Medininagar', 'Chirkunda', 'Jhumri Telaiya', 'Sahibganj', 'Chaibasa', 'Pakur', 'Ghatshila', 'Gumia']
  },
  {
    state: 'Manipur',
    cities: ['Imphal', 'Thoubal', 'Bishnupur', 'Churachandpur', 'Kakching', 'Ukhrul', 'Senapati', 'Chandel']
  },
  {
    state: 'Meghalaya',
    cities: ['Shillong', 'Tura', 'Jowai', 'Nongpoh', 'Williamnagar', 'Baghmara', 'Resubelpara', 'Nongstoin']
  },
  {
    state: 'Mizoram',
    cities: ['Aizawl', 'Lunglei', 'Champhai', 'Serchhip', 'Kolasib', 'Saiha', 'Mamit', 'Lawngtlai']
  },
  {
    state: 'Nagaland',
    cities: ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang', 'Wokha', 'Zunheboto', 'Phek', 'Mon', 'Kiphire']
  },
  {
    state: 'Sikkim',
    cities: ['Gangtok', 'Namchi', 'Geyzing', 'Mangan', 'Jorethang', 'Singtam', 'Rangpo']
  },
  {
    state: 'Tripura',
    cities: ['Agartala', 'Dharmanagar', 'Udaipur', 'Kailasahar', 'Ambassa', 'Belonia', 'Khowai', 'Ranirbazar', 'Melaghar']
  },
  {
    state: 'Uttarakhand',
    cities: ['Dehradun', 'Haridwar', 'Haldwani', 'Roorkee', 'Rudrapur', 'Kashipur', 'Rishikesh', 'Pithoragarh', 'Ramnagar', 'Manglaur', 'Almora', 'Mussoorie', 'Tehri', 'Nainital', 'Srinagar Garhwal']
  },
  {
    state: 'Ladakh',
    cities: ['Leh', 'Kargil']
  },
  {
    state: 'Puducherry',
    cities: ['Puducherry', 'Karaikal', 'Mahe', 'Yanam']
  },
  {
    state: 'Chandigarh',
    cities: ['Chandigarh']
  },
  {
    state: 'Andaman & Nicobar',
    cities: ['Port Blair', 'Diglipur', 'Mayabunder', 'Garacharma', 'Bambooflat']
  },
  {
    state: 'Dadra & Nagar Haveli',
    cities: ['Silvassa', 'Daman', 'Diu', 'Amli']
  },
  {
    state: 'Lakshadweep',
    cities: ['Kavaratti', 'Minicoy', 'Amini', 'Andrott', 'Kalpeni']
  },
  {
    state: 'Uttar Pradesh',
    cities: ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Meerut', 'Varanasi', 'Prayagraj', 'Bareilly', 'Aligarh', 'Moradabad', 'Saharanpur', 'Gorakhpur', 'Noida', 'Greater Noida', 'Firozabad', 'Jhansi', 'Muzaffarnagar', 'Mathura', 'Ayodhya', 'Rampur', 'Shahjahanpur', 'Farrukhabad', 'Hapur', 'Mirzapur', 'Bulandshahr', 'Sambhal', 'Amroha', 'Hardoi', 'Fatehpur', 'Rae Bareli', 'Orai', 'Bahraich', 'Jaunpur', 'Unnao', 'Lakhimpur', 'Budaun']
  }
];

export const ALL_INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 
  'West Bengal', 'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh', 
  'Andaman & Nicobar', 'Dadra & Nagar Haveli', 'Lakshadweep'
];

