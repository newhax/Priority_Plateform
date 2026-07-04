import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { INITIAL_SUBMISSIONS, INITIAL_PROJECTS, INITIAL_WARDS } from "./src/seedData";
import { Submission, ProposedProject, WardData } from "./src/types";

// Lazy-loaded Gemini client
let aiClient: GoogleGenAI | null = null;


function getGeminiClient(): GoogleGenAI | null {
  if (aiClient) return aiClient;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    console.warn("GEMINI_API_KEY is not defined or is placeholder. Using mock AI analyzer as fallback.");
    return null;
  }
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    return aiClient;
  } catch (err) {
    console.error("Error initializing GoogleGenAI client:", err);
    return null;
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // In-memory state partitioned by "State:Constituency"
  const constituencyStore: Record<string, {
    submissions: Submission[];
    projects: ProposedProject[];
    wards: WardData[];
  }> = {
    "Kerala:Thiruvananthapuram": {
      submissions: [...INITIAL_SUBMISSIONS],
      projects: [...INITIAL_PROJECTS],
      wards: [...INITIAL_WARDS]
    }
  };

  // Helper to fetch or dynamically seed a constituency
  function getOrCreateConstituencyData(state: string, constituency: string) {
    const key = `${state}:${constituency}`;
    if (constituencyStore[key]) {
      return constituencyStore[key];
    }

    // Dynamic ward and localized dataset generation
    let wardNames: string[] = [];
    if (state === "Kerala" && constituency === "Thiruvananthapuram") {
      return constituencyStore["Kerala:Thiruvananthapuram"];
    } else if (state === "Delhi" && constituency === "New Delhi") {
      wardNames = ["Connaught Place", "Chanakyapuri", "Karol Bagh", "Patel Nagar", "Greater Kailash", "RK Puram"];
    } else if (state === "Maharashtra" && constituency === "Mumbai South") {
      wardNames = ["Colaba", "Malabar Hill", "Byculla", "Mumbadevi", "Worli", "Sewri"];
    } else if (state === "Karnataka" && constituency === "Bangalore South") {
      wardNames = ["Jayanagar", "BTM Layout", "Basavanagudi", "Chickpet", "Padmanabhanagar", "Vijayanagar"];
    } else if (state === "Tamil Nadu" && constituency === "Chennai South") {
      wardNames = ["Mylapore", "Adyar", "Velachery", "Saidapet", "T. Nagar", "Sholinganallur"];
    } else if (state === "Uttar Pradesh" && constituency === "Lucknow") {
      wardNames = ["Hazratganj", "Alambagh", "Gomti Nagar", "Indira Nagar", "Aminabad", "Chowk"];
    } else {
      const cleanName = constituency.trim();
      wardNames = [
        `${cleanName} North`,
        `${cleanName} South`,
        `${cleanName} East`,
        `${cleanName} West`,
        `${cleanName} Central`,
        `${cleanName} Cantonment`
      ];
    }

    const generatedWards: WardData[] = wardNames.map((name, i) => {
      const id = name.toLowerCase().replace(/\s+/g, "_");
      const population = 35000 + Math.floor(Math.random() * 25000);
      const avgIncomes: ('Low' | 'Medium' | 'High')[] = ['Low', 'Medium', 'High'];
      const avgIncome = avgIncomes[i % 3];
      const elderlyRatio = 10 + (i * 3) % 15;
      const studentRatio = 15 + (i * 4) % 25;
      
      let primaryNeeds: string[] = [];
      if (i % 3 === 0) {
        primaryNeeds = ["High School Access", "Pedestrian Overpass", "Sewer Upgrades"];
      } else if (i % 3 === 1) {
        primaryNeeds = ["PHC Clinic Upgrade", "Drinking Water Scarcity Support", "Clean Public Parks"];
      } else {
        primaryNeeds = ["Road Widening", "Evening Public Transit", "Vocational Training Centre"];
      }

      return {
        id,
        name,
        population,
        avgIncome,
        elderlyRatio,
        studentRatio,
        primaryNeeds,
        infrastructureGaps: {
          schools: 3 + (i % 6),
          clinics: 2 + (i % 5),
          waterAccess: 10 + (i * 5) % 30,
          roadQuality: 4 + (i % 5),
        }
      };
    });

    const generatedSubmissions: Submission[] = [
      {
        id: `sub_dyn_${Date.now()}_1`,
        name: "Ramesh Kumar",
        phone: "+91 98123 45678",
        language: "hi",
        inputType: "text",
        originalText: `हमारे क्षेत्र ${wardNames[0]} में एक नया हाई स्कूल खोला जाना अत्यंत आवश्यक है। बच्चों को काफी दूर जाना पड़ता है जिससे सुरक्षा की भी चिंता रहती है।`,
        translatedText: `It is extremely necessary to open a new high school in our area of ${wardNames[0]}. Children have to travel very far, which also raises safety concerns.`,
        category: "Education",
        ward: wardNames[0],
        urgency: "High",
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
        sentiment: "negative",
        impactCount: 1500,
        status: "Reviewed",
        aiSummary: `High school demand in ${wardNames[0]} due to remote student travel times and security safety risks.`
      },
      {
        id: `sub_dyn_${Date.now()}_2`,
        name: "S. Subramanian",
        phone: "+91 94432 10987",
        language: "en",
        inputType: "whatsapp",
        originalText: `Severe drinking water shortage in ${wardNames[1]} area for the past three weeks. Please repair the damaged pipelines immediately and set up localized water kiosks.`,
        translatedText: `Severe drinking water shortage in ${wardNames[1]} area for the past three weeks. Please repair the damaged pipelines immediately and set up localized water kiosks.`,
        category: "Water Supply",
        ward: wardNames[1],
        urgency: "High",
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        sentiment: "negative",
        impactCount: 2200,
        status: "Received",
        aiSummary: `Critical drinking water scarcity in ${wardNames[1]} due to pipeline damage.`
      },
      {
        id: `sub_dyn_${Date.now()}_3`,
        name: "Deepa Nair",
        phone: "+91 98456 78901",
        language: "en",
        inputType: "voice",
        originalText: `The roads around ${wardNames[2]} are completely broken and full of potholes. Accidents are happening daily. Ambulances find it difficult to navigate. Emergency repairs are needed.`,
        translatedText: `The roads around ${wardNames[2]} are completely broken and full of potholes. Accidents are happening daily. Ambulances find it difficult to navigate. Emergency repairs are needed.`,
        category: "Roads & Transport",
        ward: wardNames[2],
        urgency: "High",
        timestamp: new Date(Date.now() - 3600000 * 10).toISOString(),
        sentiment: "negative",
        impactCount: 4500,
        audioUrl: "#simulated-audio-wave",
        status: "Approved",
        aiSummary: `Emergency pothole repairs and road widening in ${wardNames[2]} to resolve high accident rates and transport blocking.`
      },
      {
        id: `sub_dyn_${Date.now()}_4`,
        name: "Mohammed Salim",
        phone: "+91 99678 12345",
        language: "en",
        inputType: "photo",
        originalText: `Clogged open drains near the local market in ${wardNames[3]} are creating extremely unhygienic conditions and bad smell. Water floods the roads during rain.`,
        translatedText: `Clogged open drains near the local market in ${wardNames[3]} are creating extremely unhygienic conditions and bad smell. Water floods the roads during rain.`,
        category: "Sanitation",
        ward: wardNames[3],
        urgency: "Medium",
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
        sentiment: "negative",
        impactCount: 1200,
        photoUrl: "/assets/clogged_drain.jpg",
        status: "Received",
        aiSummary: `Clogged open drains causing bad smell and flooding risks in ${wardNames[3]} commercial market zones.`
      },
      {
        id: `sub_dyn_${Date.now()}_5`,
        name: "Priyanka Patel",
        phone: "+91 95543 21098",
        language: "hi",
        inputType: "text",
        originalText: `${wardNames[4]} में एक नया कौशल प्रशिक्षण और रोजगार केंद्र खोला जाना चाहिए ताकि युवाओं को विभिन्न उद्योगों के लिए तैयार किया जा सके।`,
        translatedText: `A new skill training and employment centre should be opened in ${wardNames[4]} to prepare youth for various industries.`,
        category: "Vocations",
        ward: wardNames[4],
        urgency: "Medium",
        timestamp: new Date(Date.now() - 3600000 * 36).toISOString(),
        sentiment: "neutral",
        impactCount: 2800,
        status: "Received",
        aiSummary: `Establishment of a local vocational skills institute in ${wardNames[4]} to boost youth employability.`
      }
    ];

    const generatedProjects: ProposedProject[] = [
      {
        id: `proj_dyn_${Date.now()}_1`,
        title: `${wardNames[0]} Government High School Infrastructure Upgrade`,
        category: "Education",
        ward: wardNames[0],
        estimatedCost: 55,
        infrastructureBenefitScore: 85,
        demographicNeedScore: 80,
        demandIndex: 92,
        citizenSubmissionsCount: 15,
        description: `Construction of standard academic facilities, science labs, and computer classrooms at the Government High School in ${wardNames[0]}.`
      },
      {
        id: `proj_dyn_${Date.now()}_2`,
        title: `${wardNames[1]} High-Capacity Water Grid Pipeline Network`,
        category: "Water Supply",
        ward: wardNames[1],
        estimatedCost: 75,
        infrastructureBenefitScore: 90,
        demographicNeedScore: 72,
        demandIndex: 88,
        citizenSubmissionsCount: 19,
        description: `Laying high-diameter water transmission conduits and establishing community tap stands to resolve unpiped water scarcities across ${wardNames[1]}.`
      },
      {
        id: `proj_dyn_${Date.now()}_3`,
        title: `${wardNames[2]} Junction Widening and Emergency Transit Corridor`,
        category: "Roads & Transport",
        ward: wardNames[2],
        estimatedCost: 110,
        infrastructureBenefitScore: 95,
        demographicNeedScore: 78,
        demandIndex: 94,
        citizenSubmissionsCount: 24,
        description: `Widening the main highway intersection, repaving deep potholes, and laying modern pedestrian safety signals in ${wardNames[2]}.`
      },
      {
        id: `proj_dyn_${Date.now()}_4`,
        title: `${wardNames[3]} Integrated Stormwater Drainage & Sewage Overhaul`,
        category: "Sanitation",
        ward: wardNames[3],
        estimatedCost: 65,
        infrastructureBenefitScore: 80,
        demographicNeedScore: 65,
        demandIndex: 82,
        citizenSubmissionsCount: 11,
        description: `Excavating high-capacity concrete gravity stormwater drains and garbage screening structures near the commercial zones of ${wardNames[3]}.`
      },
      {
        id: `proj_dyn_${Date.now()}_5`,
        title: `${wardNames[4]} Multi-Sector Vocational & Skill Development Center`,
        category: "Vocations",
        ward: wardNames[4],
        estimatedCost: 85,
        infrastructureBenefitScore: 75,
        demographicNeedScore: 82,
        demandIndex: 80,
        citizenSubmissionsCount: 13,
        description: `Establishing a training center with workshops for electrical engineering, digital operations, and logistics management in ${wardNames[4]}.`
      }
    ];

    constituencyStore[key] = {
      submissions: generatedSubmissions,
      projects: generatedProjects,
      wards: generatedWards
    };

    return constituencyStore[key];
  }

  // Helper: Simulated translation/analysis fallback when API key is missing
  function getMockAnalysis(text: string, language: string): Partial<Submission> {
    const lower = text.toLowerCase();
    let category: Submission['category'] = 'Roads & Transport';
    let urgency: Submission['urgency'] = 'Medium';
    let impactCount = 500;
    let aiSummary = "Civic complaint logged for ward attention.";

    if (lower.includes("school") || lower.includes("ഹൈസ്കൂൾ") || lower.includes("പഠി") || lower.includes("शिक्षा")) {
      category = "Education";
      urgency = "High";
      impactCount = 1200;
      aiSummary = "Request for primary or secondary educational facility development/upgrade.";
    } else if (lower.includes("hospital") || lower.includes("clinic") || lower.includes("ആശുപത്രി") || lower.includes("डॉक्टर") || lower.includes("மருத்துவமனை")) {
      category = "Healthcare";
      urgency = "High";
      impactCount = 2000;
      aiSummary = "Primary health center staffing and medical infrastructure enhancement request.";
    } else if (lower.includes("water") || lower.includes("pipe") || lower.includes("കുടിവെള്ള") || lower.includes("पानी") || lower.includes("தண்ணீர்")) {
      category = "Water Supply";
      urgency = "High";
      impactCount = 1500;
      aiSummary = "Localized clean drinking water pipeline scarcity and leak repair.";
    } else if (lower.includes("drain") || lower.includes("sewage") || lower.includes("शൂച") || lower.includes("ഓടകൾ") || lower.includes("नाली") || lower.includes("சுகாதாரம்")) {
      category = "Sanitation";
      urgency = "Medium";
      impactCount = 800;
      aiSummary = "Waste management congestion and concrete storm-water channel drainage overhaul.";
    } else if (lower.includes("job") || lower.includes("training") || lower.includes("തൊഴിൽ") || lower.includes("काम") || lower.includes("வேலை")) {
      category = "Vocations";
      urgency = "Medium";
      impactCount = 2500;
      aiSummary = "Vocational development proposal to generate jobs for local unemployed youth.";
    }

    return {
      translatedText: `[Translated] ${text}`,
      category,
      urgency,
      sentiment: "negative",
      impactCount,
      aiSummary,
    };
  }

  // --- API ROUTE: GET Submissions ---
  app.get("/api/submissions", (req, res) => {
    const state = (req.query.state as string) || "Kerala";
    const constituency = (req.query.constituency as string) || "Thiruvananthapuram";
    const data = getOrCreateConstituencyData(state, constituency);
    res.json({ submissions: data.submissions });
  });

  // --- API ROUTE: GET Projects ---
  app.get("/api/projects", (req, res) => {
    const state = (req.query.state as string) || "Kerala";
    const constituency = (req.query.constituency as string) || "Thiruvananthapuram";
    const data = getOrCreateConstituencyData(state, constituency);
    res.json({ projects: data.projects, wards: data.wards });
  });

  // --- API ROUTE: POST Submission (Process via Gemini) ---
  app.post("/api/submissions", async (req, res) => {
    const { name, phone, language, inputType, originalText, ward, audioUrl, photoUrl, state, constituency } = req.body;

    if (!originalText || typeof originalText !== "string") {
      return res.status(400).json({ error: "Missing originalText" });
    }

    const ai = getGeminiClient();
    const newId = `sub_${Date.now()}`;

    let analyzedData: Partial<Submission> = {};

    if (ai) {
      try {
        const prompt = `You are an expert civic analyst for an MP development portal in India. Analyze the following citizen feedback and extract categorization details.
Citizen input (in language: "${language}"):
"${originalText}"

Your output must be a valid JSON object matching the following structure:
{
  "translatedText": "The complete text translated into professional, clear English",
  "category": "One of: 'Education', 'Healthcare', 'Roads & Transport', 'Sanitation', 'Water Supply', 'Vocations'",
  "urgency": "One of: 'High', 'Medium', 'Low' based on severity of need",
  "sentiment": "One of: 'positive', 'neutral', 'negative'",
  "impactCount": 500, // a reasonable estimate of the number of people impacted (integer between 50 and 5000)
  "aiSummary": "A concise, elegant one-sentence summary of the core civic request (e.g. 'Urgent water pipeline repair')"
}

Ensure you strictly output only valid JSON, without markdown formatting.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                translatedText: { type: Type.STRING },
                category: { 
                  type: Type.STRING, 
                  description: "Must be exactly one of: Education, Healthcare, Roads & Transport, Sanitation, Water Supply, Vocations" 
                },
                urgency: { 
                  type: Type.STRING, 
                  description: "Must be exactly one of: High, Medium, Low" 
                },
                sentiment: { 
                  type: Type.STRING, 
                  description: "Must be exactly one of: positive, neutral, negative" 
                },
                impactCount: { type: Type.INTEGER },
                aiSummary: { type: Type.STRING }
              },
              required: ["translatedText", "category", "urgency", "sentiment", "impactCount", "aiSummary"]
            }
          }
        });

        const textResponse = response.text?.trim() || "";
        const parsed = JSON.parse(textResponse);
        analyzedData = {
          translatedText: parsed.translatedText || originalText,
          category: parsed.category || "Roads & Transport",
          urgency: parsed.urgency || "Medium",
          sentiment: parsed.sentiment || "negative",
          impactCount: parsed.impactCount || 1000,
          aiSummary: parsed.aiSummary || "Citizen suggestion processed by AI."
        };
      } catch (err) {
        console.error("Gemini analysis failed, falling back to mock:", err);
        analyzedData = getMockAnalysis(originalText, language);
      }
    } else {
      analyzedData = getMockAnalysis(originalText, language);
    }

    const fullSubmission: Submission = {
      id: newId,
      name: name || "Anonymous Citizen",
      phone: phone || "",
      language: language || "en",
      inputType: inputType || "text",
      originalText,
      translatedText: analyzedData.translatedText || originalText,
      category: (analyzedData.category as any) || "Roads & Transport",
      ward: ward || "General",
      urgency: (analyzedData.urgency as any) || "Medium",
      timestamp: new Date().toISOString(),
      sentiment: analyzedData.sentiment,
      impactCount: analyzedData.impactCount || 500,
      audioUrl,
      photoUrl,
      status: "Received",
      aiSummary: analyzedData.aiSummary || "Civic request received."
    };

    const activeState = state || "Kerala";
    const activeConstituency = constituency || "Thiruvananthapuram";
    const data = getOrCreateConstituencyData(activeState, activeConstituency);

    data.submissions.unshift(fullSubmission);

    // Dynamic updating: Let's also dynamically update the citizen count and demandIndex of matching proposed projects in our memory list!
    const matchingProj = data.projects.find(
      p => p.ward.toLowerCase() === fullSubmission.ward.toLowerCase() && p.category === fullSubmission.category
    );
    if (matchingProj) {
      matchingProj.citizenSubmissionsCount += 1;
      // Recalculate demandIndex based on count
      matchingProj.demandIndex = Math.min(100, 60 + matchingProj.citizenSubmissionsCount * 2.5);
    }

    res.json({ success: true, submission: fullSubmission });
  });

  // --- API ROUTE: PATCH Action Status Update ---
  app.patch("/api/submissions/:id", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    let sub: Submission | undefined;
    for (const key of Object.keys(constituencyStore)) {
      sub = constituencyStore[key].submissions.find(s => s.id === id);
      if (sub) {
        sub.status = status;
        break;
      }
    }

    if (sub) {
      return res.json({ success: true, submission: sub });
    }
    res.status(404).json({ error: "Submission not found" });
  });

  // --- API ROUTE: POST Generate AI Report ---
  app.post("/api/generate-report", async (req, res) => {
    const { project, customFocus, language } = req.body;

    if (!project) {
      return res.status(400).json({ error: "Missing project details" });
    }

    const ai = getGeminiClient();
    const proj = project as ProposedProject;

    if (ai) {
      try {
        const prompt = `You are a professional legislative executive assistant drafting an official, highly detailed "Member of Parliament Development Work Recommendation Report" for the MP.
Generate a structured report about the following proposed development work:
- Project Title: ${proj.title}
- Category: ${proj.category}
- Location (Ward/Division): ${proj.ward}
- Estimated Budget: ₹${proj.estimatedCost} Lakhs
- Citizen Submissions Supporting this: ${proj.citizenSubmissionsCount}
- Demand Priority Index: ${proj.demandIndex}/100
- Infrastructure Gap Benefit Score: ${proj.infrastructureBenefitScore}/100
- Demographic Need Score: ${proj.demographicNeedScore}/100
- Project Description: ${proj.description}
${customFocus ? `- MP Special Instructions/Focus: "${customFocus}"` : ""}

Draft the report in the requested language: "${language || "en"}" (if Malayalam, Hindi, or Tamil, write professionally in that language. Otherwise, write in English).

Your report MUST include:
1. OFFICIAL HEADER (e.g. "OFFICE OF THE MEMBER OF PARLIAMENT", "REPORT ON HIGH-PRIORITY CIVIC WORKS")
2. EXECUTIVE SUMMARY & STRATEGIC IMPORTANCE
3. PUBLIC DEMAND CORRELATION (Correlate with citizen submissions count and urgency)
4. DEMOGRAPHIC BENEFIT ANALYSIS (Specifically mentioning impact on local citizens, students, elderly, low income groups)
5. PHASED IMPLEMENTATION TIMELINE (Provide a structured breakdown of phase-1, phase-2, phase-3 over appropriate months)
6. BUDGET ALLOCATION PLAN (Itemized estimation summing up to ₹${proj.estimatedCost} Lakhs)
7. FORMAL DRAFT LETTER (Addressed to the District Collector / Ministry of Public Works requesting urgent administrative sanction)

Format nicely using clear markdown headings and paragraphs, with a very respectful, professional, and authoritative bureaucratic tone. Do not include external links or HTML boilerplate. Use clear, neat formatting.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
        });

        return res.json({ report: response.text });
      } catch (err) {
        console.error("Gemini report generation failed:", err);
      }
    }

    // High quality mock report fallback in English/Malayalam/Hindi if Gemini is missing or failed
    let fallbackReport = "";
    if (language === "ml") {
      fallbackReport = `# പാർലമെന്റ് അംഗത്തിന്റെ കാര്യാലയം (OFFICE OF THE MEMBER OF PARLIAMENT)
## വികസന ശുപാർശ റിപ്പോർട്ട് (PRIORITY DEVELOPMENT REPORT)

**പദ്ധതി**: ${proj.title}
**വിഭാഗം**: ${proj.category}
**പ്രദേശം (വാർഡ്)**: ${proj.ward}
**അനുമാനിച്ച ബഡ്ജറ്റ്**: ₹${proj.estimatedCost} ലക്ഷം രൂപ

---

### 1. എക്സിക്യൂട്ടീവ് സംഗ്രഹം (Executive Summary)
ഈ പദ്ധതി വാർഡിലെ അടിസ്ഥാന വികസന വിടവുകൾ നികത്തുന്നതിനും പൊതുജനങ്ങളുടെ ആവശ്യം പരിഹരിക്കുന്നതിനും അത്യന്താപേക്ഷിതമാണ്. പ്രദേശവാസികളായ സാധാരണക്കാർക്ക് ഇത് വലിയ നേട്ടമാകും.

### 2. ജനകീയ ആവശ്യം (Citizen Demand Analysis)
ഈ വികസന ആവശ്യത്തിനായി ${proj.citizenSubmissionsCount} ഔദ്യോഗിക പരാതികളും നിവേദനങ്ങളും ലഭിച്ചിട്ടുണ്ട്. ഇതിന്റെ അടിസ്ഥാനത്തിൽ തയ്യാറാക്കിയ പ്രയോറിറ്റി സൂചിക **${proj.demandIndex}/100** ആണ്.

### 3. നിർവ്വഹണ ഘട്ടങ്ങൾ (Phased Timeline)
* **ഘട്ടം 1 (1-2 മാസങ്ങൾ)**: സർവേ നടപടികളും സാങ്കേതിക അനുമതിയും.
* **ഘട്ടം 2 (3-6 മാസങ്ങൾ)**: കരാർ നടപടികളും നിർമ്മാണാരംഭവും.
* **ഘട്ടം 3 (7-9 മാസങ്ങൾ)**: നിർമ്മാണം പൂർത്തീകരിച്ച് സമർപ്പണം.

### 4. ബഡ്ജറ്റ് വിവരങ്ങൾ (Budget Allocation)
* പ്രാരംഭ നിർമ്മാണ ചെലവുകൾ: ₹${Math.round(proj.estimatedCost * 0.4)} ലക്ഷം
* സാമഗ്രികളും തൊഴിൽ ചെലവുകളും: ₹${Math.round(proj.estimatedCost * 0.45)} ലക്ഷം
* അനുബന്ധ ചെലവുകൾ: ₹${Math.round(proj.estimatedCost * 0.15)} ലക്ഷം
* **ആകെ തുക**: ₹${proj.estimatedCost} ലക്ഷം

### 5. നിവേദന കത്ത് (Draft Letter to District Collector)
ബഹുമാനപ്പെട്ട ജില്ലാ കളക്ടർ സമക്ഷം സമർപ്പിക്കുന്നത്,
മേൽവിവരിച്ച പദ്ധതി അടിയന്തിര പൊതുതാൽപ്പര്യം മുൻനിർത്തി MP ലാഡ്സ് (MPLADS) ഫണ്ടിൽ ഉൾപ്പെടുത്തി അടിയന്തിര അനുമതി നൽകണമെന്ന് അഭ്യർത്ഥിക്കുന്നു.

ഒപ്പ്,
**മെമ്പർ ഓഫ് പാർലമെന്റ് (MP)**`;
    } else {
      fallbackReport = `# OFFICE OF THE MEMBER OF PARLIAMENT
## HIGH-PRIORITY DEVELOPMENT RECOMMENDATION REPORT

**Project Name**: ${proj.title}
**Category**: ${proj.category}
**Location (Ward/Division)**: ${proj.ward}
**Estimated Budget**: ₹${proj.estimatedCost} Lakhs
**Priority Index**: ${proj.demandIndex}/100

---

### 1. Executive Summary
This project aims to directly address the critical infrastructure deficit in ${proj.ward}. By resolving this key issue, we significantly enhance local productivity, standard of living, and safety.

### 2. Citizen Demand Correlation
We have consolidated **${proj.citizenSubmissionsCount} registered citizen submissions** regarding this specific grievance. The high feedback density registers a Demand Score of **${proj.demandIndex}/100**, justifying immediate administrative sanction.

### 3. Demographic Benefit Analysis
This initiative is highly tailored to meet the needs of the ward population. 
- Fills targeted infrastructure gaps (Infrastructure Benefit Score: **${proj.infrastructureBenefitScore}/100**)
- Solves major access deficits for student networks and elderly citizens.

### 4. Structured Phased Timeline
- **Phase 1 (Month 1-2)**: Detailed project report (DPR) finalization, technical sanction, and bidding.
- **Phase 2 (Month 3-7)**: Structural excavation and foundational execution.
- **Phase 3 (Month 8-9)**: Testing, final inspection, and public commissioning.

### 5. Budget Allocation Detail
- **Core Engineering Work**: ₹${Math.round(proj.estimatedCost * 0.5)} Lakhs (50%)
- **Material Procurement**: ₹${Math.round(proj.estimatedCost * 0.35)} Lakhs (35%)
- **Supervision & Miscellaneous**: ₹${Math.round(proj.estimatedCost * 0.15)} Lakhs (15%)
- **Total Allocations**: ₹${proj.estimatedCost} Lakhs (100%)

### 6. Draft Requisition Letter
**To:** The District Collector & District Authority, Local Administration
**Subject:** Request for Administrative Sanction for "${proj.title}"

Sir/Madam,
I hereby submit this urgent recommendation to execute "${proj.title}" under the MPLADS (Member of Parliament Local Area Development Scheme). Given the overwhelming citizen backing and severe infrastructure gaps, I request your department to grant immediate administrative and financial clearance.

Sincerely,
**Member of Parliament (MP)**`;
    }

    res.json({ report: fallbackReport, isMock: !ai });
  });

  // --- API ROUTE: POST Generate AI Proposal ---
  app.post("/api/generate-proposal", async (req, res) => {
    const { state, city, ward, problemText, language, photoData, voiceData, currentUser } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(500).json({ error: "AI service unavailable" });
    }

    try {
      const promptParts: any[] = [
        {
          text: `You are a professional legislative executive assistant.
      
      The user is submitting a civic proposal. 
      - State: ${state}
      - City/Constituency: ${city}
      - Ward: ${ward}
      - Problem Description: ${problemText}
      - Language: ${language}
      - User provided additional media: Photo: ${photoData ? 'Yes' : 'No'}, Voice Note: ${voiceData ? 'Yes' : 'No'}
      ${currentUser ? `- User Details: Name: ${currentUser.firstName} ${currentUser.lastName}, Phone: ${currentUser.phone}` : ''}

      Analyze the provided text, photo, and voice (if available) and generate a formal, comprehensive proposal addressed to the MP of ${city} regarding this problem.
      
      If user details are provided, include them in the proposal (e.g. as the signatory or contact person).

      The proposal should:
      - Be addressed formally to the MP.
      - Describe the problem clearly based on the multimodal inputs.
      - Propose actionable solutions.
      - Urge for a solution.
      - Use a respectful, professional, bureaucratic tone.
      - Use the requested language: ${language}.

      Return the proposal in a structured, nice markdown format.`
        }
      ];

      if (photoData) {
        promptParts.push({
          inlineData: {
            data: photoData.split(',')[1],
            mimeType: photoData.split(',')[0].split(':')[1].split(';')[0]
          }
        });
      }

      if (voiceData) {
        promptParts.push({
          inlineData: {
            data: voiceData.split(',')[1],
            mimeType: voiceData.split(',')[0].split(':')[1].split(';')[0]
          }
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [{ role: 'user', parts: promptParts }],
      });

      res.json({ proposal: response.text });
    } catch (err) {
      console.error("Proposal generation failed:", err);
      res.status(500).json({ error: "Failed to generate proposal" });
    }
  });

  // --- API ROUTES: AUTHENTICATION ---
  const registeredUsers: any[] = [];

  app.post("/api/auth/register", (req, res) => {
    const user = req.body;
    if (user && user.email) {
      const exists = registeredUsers.some(u => u.email.toLowerCase() === user.email.toLowerCase());
      if (!exists) {
        registeredUsers.push(user);
      }
      return res.json({ success: true });
    }
    res.status(400).json({ error: "Invalid user data" });
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = registeredUsers.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (user) {
      return res.json({ success: true, user });
    }
    res.status(401).json({ error: "Invalid credentials" });
  });


  // Serve client assets inside Vite / Express
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
