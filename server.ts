import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { INITIAL_SUBMISSIONS, INITIAL_PROJECTS } from "./src/seedData";
import { Submission, ProposedProject } from "./src/types";

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
  }> = {
    "Kerala:Thiruvananthapuram": {
      submissions: [...INITIAL_SUBMISSIONS],
      projects: [...INITIAL_PROJECTS]
    }
  };

  // Helper to fetch or dynamically seed a constituency
  function getOrCreateConstituencyData(state: string, constituency: string) {
    const key = `${state}:${constituency}`;
    if (constituencyStore[key]) {
      return constituencyStore[key];
    }

    if (state === "Kerala" && constituency === "Thiruvananthapuram") {
      return constituencyStore["Kerala:Thiruvananthapuram"];
    }

    // Default seed for new constituencies
    const generatedSubmissions: Submission[] = [
      {
        id: `gen_sub_${Date.now()}_1`,
        name: "A. Sharma",
        phone: "+91 99000 11000",
        language: 'hi',
        inputType: 'text',
        originalText: `हमारे क्षेत्र में एक नया हाई स्कूल खोला जाना अत्यंत आवश्यक है। बच्चों को काफी दूर जाना पड़ता है जिससे सुरक्षा की भी चिंता रहती है।`,
        translatedText: `It is extremely necessary to open a new high school in our area. Children have to travel very far, which also raises safety concerns.`,
        category: 'Education',
        urgency: 'High',
        timestamp: new Date().toISOString(),
        sentiment: 'negative',
        impactCount: 5000,
        status: 'Received',
        aiSummary: `High school demand due to remote student travel times and security safety risks.`
      },
      {
        id: `gen_sub_${Date.now()}_2`,
        name: "L. Khan",
        phone: "+91 99000 22000",
        language: 'en',
        inputType: 'text',
        originalText: `Severe drinking water shortage in this area for the past three weeks. Please repair the damaged pipelines immediately and set up localized water kiosks.`,
        translatedText: `Severe drinking water shortage in this area for the past three weeks. Please repair the damaged pipelines immediately and set up localized water kiosks.`,
        category: 'Water Supply',
        urgency: 'High',
        timestamp: new Date().toISOString(),
        sentiment: 'negative',
        impactCount: 8000,
        status: 'Received',
        aiSummary: `Critical drinking water scarcity due to pipeline damage.`
      }
    ];

    const generatedProjects: ProposedProject[] = [
      {
        id: `gen_proj_${Date.now()}_1`,
        title: `Government High School Infrastructure Upgrade`,
        category: 'Education',
        estimatedCost: 150,
        infrastructureBenefitScore: 85,
        demographicNeedScore: 75,
        demandIndex: 90,
        citizenSubmissionsCount: 12,
        description: `Construction of standard academic facilities, science labs, and computer classrooms at the local Government High School.`
      },
      {
        id: `gen_proj_${Date.now()}_2`,
        title: `High-Capacity Water Grid Pipeline Network`,
        category: 'Water Supply',
        estimatedCost: 200,
        infrastructureBenefitScore: 90,
        demographicNeedScore: 80,
        demandIndex: 95,
        citizenSubmissionsCount: 25,
        description: `Laying high-diameter water transmission conduits and establishing community tap stands to resolve unpiped water scarcities.`
      }
    ];

    const newData = {
      submissions: generatedSubmissions,
      projects: generatedProjects
    };

    constituencyStore[key] = newData;
    return newData;
  }

  // Helper: Simulated translation/analysis fallback when API key is missing
  function getMockAnalysis(text: string, language: string): Partial<Submission> {
    const lower = text.toLowerCase();
    let category: Submission['category'] = 'Roads & Transport';
    let urgency: Submission['urgency'] = 'Medium';
    let impactCount = 500;
    let aiSummary = "Civic complaint logged for area attention.";

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
    const showAll = req.query.all === "true";
    if (showAll) {
      const allSubmissions: Submission[] = [];
      for (const key of Object.keys(constituencyStore)) {
        const [st, con] = key.split(":");
        const subs = constituencyStore[key].submissions.map(s => ({
          ...s,
          state: s.state || st,
          constituency: s.constituency || con
        }));
        allSubmissions.push(...subs);
      }
      // Sort by timestamp descending
      allSubmissions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      const nonProposals = allSubmissions.filter(s => !s.isProposal);
      return res.json({ submissions: nonProposals });
    }
    const state = (req.query.state as string) || "Kerala";
    const constituency = (req.query.constituency as string) || "Thiruvananthapuram";
    const data = getOrCreateConstituencyData(state, constituency);
    
    // Inject state and constituency if missing
    const enriched = data.submissions.map(s => ({
      ...s,
      state: s.state || state,
      constituency: s.constituency || constituency
    }));
    
    const nonProposals = enriched.filter(s => !s.isProposal);
    res.json({ submissions: nonProposals });
  });

  // --- API ROUTE: GET Projects ---
  app.get("/api/projects", (req, res) => {
    const state = (req.query.state as string) || "Kerala";
    const constituency = (req.query.constituency as string) || "Thiruvananthapuram";
    const data = getOrCreateConstituencyData(state, constituency);
    res.json({ projects: data.projects });
  });

  // --- API ROUTE: GET AI Suggestions ---
  app.get("/api/ai-suggestions", async (req, res) => {
    const state = (req.query.state as string) || "Kerala";
    const constituency = (req.query.constituency as string) || "Thiruvananthapuram";
    const language = (req.query.language as string) || "en";

    // 1. Get constituency store data
    const data = getOrCreateConstituencyData(state, constituency);
    const submissions = data.submissions || [];

    // Filter out proposals from the submissions analyzed (only analyze grievances)
    const grievances = submissions.filter(s => !s.isProposal);

    // 2. Mock datasets to combine - dynamically named according to constituency
    const datasetsUsed = {
      population: constituency === "Thiruvananthapuram" ? "950,000 Constituents" : `680,000 Constituents in ${constituency}`,
      youthRatio: constituency === "Thiruvananthapuram" ? "28.5% of total population" : "31.2% youth and child ratio",
      schoolDeficitIndex: constituency === "Thiruvananthapuram" ? "8.2 / 10 (Critical Deficit)" : "6.5 / 10 (Moderate Deficit in peripherals)",
      waterDeficitIndex: constituency === "Thiruvananthapuram" ? "7.5 / 10 (High Scarcity)" : "8.1 / 10 (High Scarcity in high-elevation wards)",
      floodingRisk: constituency === "Thiruvananthapuram" ? "High Risk (Kovalam, Ulloor coastal & low-lying zones)" : `Medium-High Risk (${constituency} drainage channels & low-lying basins)`,
      averageAQI: constituency === "Thiruvananthapuram" ? "84 (Moderate)" : "112 (Slightly Poor Seasonal AQI)",
      unemploymentRate: "14.2% structural youth unemployment"
    };

    const ai = getGeminiClient();
    if (ai) {
      try {
        const langInstruction = language !== "en"
          ? `\nIMPORTANT REQUIREMENT: You MUST generate the entire JSON response (including all theme names, theme summaries, hotspot names, hotspot issues, recommendation titles, alignment reasons, impact scopes, action plans, demographic indicators, infraGap indicators, and datasetsUsed field values) in the language with code '${language}' (e.g. 'ml' is Malayalam, 'hi' is Hindi, 'bn' is Bengali, 'te' is Telugu, 'pa' is Punjabi, 'ta' is Tamil, etc.). Do NOT translate or change JSON schema keys (such as "themes", "name", "count", "severity", "sentiment", "summary", "hotspots", "recommendations", "id", "title", "category", "rank", "priorityScore", "alignmentReason", etc.). Only translate or output string values in the requested language. Translate category names to standard English categories (Education, Healthcare, Roads & Transport, Sanitation, Water Supply, Vocations) so they map correctly to UI categories, but all descriptions and lists must be written in language: ${language}.`
          : "";

        const prompt = `You are a Chief Digital Town Planner and Civic Analyst for the Member of Parliament (MP) office in India.
Your mission is to perform a deep semantic analysis of the active citizen grievances and cross-reference them with local demographics, environmental indicators, development plans, and infrastructure gap indexes to generate optimized developmental suggestions for the Member of Parliament.

ACTIVE CONSTITUENCY CONTEXT:
- State: ${state}
- Constituency (City): ${constituency}
- Population Indicators: ${JSON.stringify(datasetsUsed)}

ACTIVE CITIZEN GRIEVANCES:
${JSON.stringify(grievances.map(g => ({
  category: g.category,
  text: g.translatedText || g.originalText,
  urgency: g.urgency,
  impactCount: g.impactCount,
  aiSummary: g.aiSummary
})).slice(0, 30))}

INFRASTRUCTURE GAP REGISTER & REGION MASTER PLAN:
- Education: Deficit in high-school level science labs & computer clusters in peripheries of ${constituency}. Master Plan: ${constituency} Digital Skillup Scheme.
- Water Supply: Water mains pipeline leaks, obsolete 80mm plumbing. Master Plan: ${constituency} Jal Jeevan Grid Extension.
- Roads & Transport: Densely populated junctions (e.g., ${constituency} Station Transit Corridor) lack ambulance bypass pathways. Master Plan: ${constituency} Smart Transit Corridor Initiative.
- Sanitation & Sewerage: Low-lying zones in ${constituency} suffer sewer blockages due to non-segregated plastics. Master Plan: ${constituency} Stormwater drainage upgrade scheme.
- Healthcare: Primary health centers have medical equipment gap for prenatal and maternal wings.

Based on this synthesis, output a single JSON object (with no markdown fences or preambles, just raw valid JSON that satisfies the schema below):
{
  "themes": [
    {
      "name": "string (name of recurring grievance theme)",
      "count": number,
      "severity": "High" | "Medium" | "Low",
      "sentiment": "string",
      "summary": "string"
    }
  ],
  "hotspots": [
    {
      "name": "string",
      "activeGrievances": number,
      "priorityLevel": "Critical" | "High" | "Medium",
      "issues": ["string"]
    }
  ],
  "recommendations": [
    {
      "id": "string",
      "title": "string",
      "category": "Education" | "Healthcare" | "Roads & Transport" | "Sanitation" | "Water Supply" | "Vocations",
      "rank": number,
      "priorityScore": number,
      "alignmentReason": "string",
      "estimatedCost": "string",
      "impactScope": "string",
      "actionPlan": ["string"],
      "demographicIndicator": "string",
      "infraGapIndicator": "string",
      "localPlanAlignment": "string",
      "publicDatasetInsight": "string"
    }
  ],
  "datasetsUsed": {
    "population": "string",
    "youthRatio": "string",
    "schoolDeficitIndex": "string",
    "waterDeficitIndex": "string",
    "floodingRisk": "string"
  }
}

Ensure the recommendations are highly practical, specific, and directly rank the top high-priority works that the MP should fund under MPLADS (Member of Parliament Local Area Development Scheme) for ${constituency}, ${state}.
${langInstruction}
No other text beside the JSON object!`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json"
          }
        });

        const textResponse = response.text || "";
        const cleanedJson = textResponse.trim().replace(/^```json/i, "").replace(/```$/, "").trim();
        const parsedResult = JSON.parse(cleanedJson);
        return res.json({ success: true, analysis: parsedResult, isMock: false });
      } catch (err: any) {
        if (err?.status === 429 || err?.error?.code === 429) {
          console.warn("Gemini Quota Exceeded (429), falling back.");
        } else {
          console.error("Gemini Suggestions Error, falling back:", err?.message || err);
        }
      }
    }

    // --- DETERMINISTIC STATIC FALLBACK CORE (Fully Dynamic to selected Constituency & State) ---
    const themes: any[] = [];
    const hotspots: any[] = [];
    const recommendations: any[] = [];

    // Analyze live grievance categories
    const categoryCounts: Record<string, number> = {};
    grievances.forEach(g => {
      categoryCounts[g.category] = (categoryCounts[g.category] || 0) + 1;
    });

    // 1. Build dynamic recurring themes
    const categories = Object.keys(categoryCounts);
    if (categories.length === 0) {
      categories.push('Water Supply', 'Roads & Transport', 'Education');
      categoryCounts['Water Supply'] = 3;
      categoryCounts['Roads & Transport'] = 2;
      categoryCounts['Education'] = 1;
    }

    categories.forEach((cat) => {
      let themeName = "";
      let themeSummary = "";
      if (cat === 'Water Supply') {
        themeName = `Drinking Water Supply & Pipe Network Deficit in ${constituency}`;
        themeSummary = `High concentration of requests in ${constituency} regarding leaking main supply pipelines, severe water rationing, and lack of localized kiosks.`;
      } else if (cat === 'Roads & Transport') {
        themeName = `${constituency} Junction Bottlenecks & Pedestrian Safety`;
        themeSummary = `Commuters and ambulance services reported major delays at core intersections in ${constituency} due to unpaved sides, bad lighting, and missing crossings.`;
      } else if (cat === 'Education') {
        themeName = `${constituency} Outskirt Public School Infrastructure Gaps`;
        themeSummary = `Requests for multi-classroom blocks, high-capacity labs, and clean sanitation facilities in suburban schools of ${constituency}.`;
      } else if (cat === 'Sanitation') {
        themeName = `Low-Lying Drainage Clogging & Stormwater Flooding in ${constituency}`;
        themeSummary = `Submissions highlight plastic accumulation and sediment runoff choking canals in ${constituency}, causing backflow during high tides or monsoons.`;
      } else if (cat === 'Healthcare') {
        themeName = `Maternal Diagnostics & Maternity Ward Shortfalls in ${constituency}`;
        themeSummary = `Demands for modern diagnostic scanners and nursing equipment in local Primary Health Centres of ${constituency}.`;
      } else {
        themeName = `Localized ${cat} Expansion for ${constituency}`;
        themeSummary = `Active requests to expand basic coverage of ${cat.toLowerCase()} in newly incorporated suburban wards of ${constituency}.`;
      }

      themes.push({
        name: themeName,
        count: categoryCounts[cat] || 2,
        severity: (categoryCounts[cat] || 0) > 3 ? "High" : "Medium",
        sentiment: "highly negative",
        summary: themeSummary
      });
    });

    // 2. Build Hotspots dynamically tailored to constituency
    const knownPlaces = [
      `${constituency} Station Transit Junction`,
      `${constituency} Civic Market Precinct`,
      `Central ${constituency} Wards`,
      `${constituency} River/Canal Margins`,
      `Outer ${constituency} Suburban Clusters`
    ];

    knownPlaces.forEach((place) => {
      let activeCount = Math.floor(Math.random() * 4) + 1;
      let issues: string[] = [];
      let priority: 'Critical' | 'High' | 'Medium' = 'Medium';

      if (place.includes("Transit")) {
        issues = ["Ambulance gridlocks", "High pedestrian accident rate", "Missing subways"];
        priority = "Critical";
        activeCount = Math.max(1, grievances.filter(g => g.category === 'Roads & Transport').length) + 2;
      } else if (place.includes("Margins") || place.includes("Canal")) {
        issues = ["Stormwater flooding", "Sewage runoff", "Canal waste clog"];
        priority = "High";
        activeCount = Math.max(1, grievances.filter(g => g.category === 'Sanitation').length) + 1;
      } else if (place.includes("Suburban")) {
        issues = ["Overcrowded classrooms", "Poor science labs", "Security concerns"];
        priority = "High";
        activeCount = Math.max(1, grievances.filter(g => g.category === 'Education').length) + 1;
      } else {
        issues = ["General civic pipeline leaks", "Water pressure drop"];
        activeCount = Math.max(1, grievances.filter(g => g.category === 'Water Supply').length) + 1;
      }

      hotspots.push({
        name: place,
        activeGrievances: activeCount,
        priorityLevel: priority,
        issues: issues
      });
    });

    // 3. Match and Build AI-recommended Project Works dynamically
    const projectTemplates = [
      {
        title: `${constituency} Transit Junction Emergency Lane & Subway`,
        category: "Roads & Transport",
        cost: "₹1.2 Crores",
        scope: `Over 45,000 daily commuters, emergency vehicles & local residents of ${constituency}`,
        alignmentReason: `Combines high citizen urgency (accident reports in ${constituency}) with demographic data (22% senior citizens requiring safe crossing infrastructure) and master transit plan.`,
        demographic: `High elderly population and daily outpatient commuter traffic in ${constituency}`,
        infraGap: "Pedestrian safety index: 3/10; Accident risk: High",
        localPlan: `${constituency} Smart Transit Corridor Initiative Section 4`,
        publicDataset: `${constituency} Public Health Safety Map Zone A`,
        action: [
          "Phase 1: Civil land survey & temporary diversion of traffic flow (Month 1)",
          "Phase 2: Installation of pre-cast concrete structural pedestrian tubes (Month 2-4)",
          "Phase 3: Resurfacing of bottleneck lanes & smart pedestrian signaling setup (Month 5)"
        ]
      },
      {
        title: `${constituency} High-Diameter Drinking Water Distribution Main`,
        category: "Water Supply",
        cost: "₹65 Lakhs",
        scope: `8,500 families in dry elevation clusters across ${constituency}`,
        alignmentReason: `Directly resolves high citizen water complaints in ${constituency}. Aligns with Jal Jeevan pipe water coverage gap (9/10 water supply deficit in inland wards).`,
        demographic: `High concentration of low-income household grids in ${constituency}`,
        infraGap: "Drinking water access coverage: 40% only; Grid leak rate: High",
        localPlan: `Jal Jeevan Mission Grid Expansion Phase II for ${constituency}`,
        publicDataset: `${state} Water Resources ground aquifer survey report`,
        action: [
          "Phase 1: Excavation of rocky terrain tracts for main lines (Month 1-2)",
          "Phase 2: Laying of 200mm high-diameter ductile iron supply mains (Month 3-4)",
          "Phase 3: Provision of decentralized public tap standposts & individual meters (Month 5)"
        ]
      },
      {
        title: `${constituency} Suburban Government High School Science Block`,
        category: "Education",
        cost: "₹45 Lakhs",
        scope: `1,200 public secondary school students in ${constituency}`,
        alignmentReason: `Solves the educational deficit index (8.2/10 deficit in outskirts of ${constituency}) identified by citizen grievances, boosting youth skill development.`,
        demographic: "High student/youth ratio (28.5% population density under age 18)",
        infraGap: `Secondary school science lab deficit in ${constituency}: 8/10`,
        localPlan: `${constituency} Digital Skillup Grid Scheme`,
        publicDataset: `Census literacy and public education enrolment indicators for ${constituency}`,
        action: [
          "Phase 1: Civil foundations & high-durability roof fabrication (Month 1-2)",
          "Phase 2: Procurement of modern physics, chemistry, & computer hardware (Month 3-4)",
          "Phase 3: Solar rooftop backup grid installation & laboratory handover (Month 5)"
        ]
      },
      {
        title: `${constituency} Basin Integrated Storm Water Drainage Network`,
        category: "Sanitation",
        cost: "₹80 Lakhs",
        scope: `12,000 local residents & business clusters in low-lying ${constituency} wards`,
        alignmentReason: `Solves sewage spillover grievances during flooding in ${constituency}. Directly addresses high environmental flooding risk categories in coastal or low-lying zones.`,
        demographic: `Coastal/river community wards & local tourism/market workers of ${constituency}`,
        infraGap: "Sewer capacity deficit: 75% during high monsoon tide",
        localPlan: `${constituency} Drainage and Environmental Masterplan`,
        publicDataset: `${state} Coastal/Basin ecological flooding indicators & geographic map grids`,
        action: [
          "Phase 1: Laying scientific concrete stormwater trunk drains (Month 1-2)",
          "Phase 2: Setting up automatic screening gates & sewage bypass pump units (Month 3-4)",
          "Phase 3: Restructuring outlet canals with sandtrap filtration systems (Month 5)"
        ]
      }
    ];

    projectTemplates.forEach((tpl, i) => {
      recommendations.push({
        id: `suggestion_${i + 1}`,
        title: tpl.title,
        category: tpl.category,
        rank: i + 1,
        priorityScore: Math.round((95 - i * 4.5 + Math.random() * 2) * 10) / 10,
        alignmentReason: tpl.alignmentReason,
        estimatedCost: tpl.cost,
        impactScope: tpl.scope,
        actionPlan: tpl.action,
        demographicIndicator: tpl.demographic,
        infraGapIndicator: tpl.infraGap,
        localPlanAlignment: tpl.localPlan,
        publicDatasetInsight: tpl.publicDataset
      });
    });

    const fallbackResponse = {
      themes,
      hotspots,
      recommendations,
      datasetsUsed
    };

    if (language !== "en" && ai) {
      try {
        const translatePrompt = `You are a professional translator. Translate the following JSON object into the language code '${language}' (e.g. 'ml' is Malayalam, 'hi' is Hindi, 'ta' is Tamil, 'te' is Telugu, 'bn' is Bengali, 'pa' is Punjabi, etc.). Maintain the exact same JSON structure, keys, arrays, and formats. Only translate the string values. Output ONLY the translated JSON, with no other text, markdown blocks or fences:
${JSON.stringify(fallbackResponse)}`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: translatePrompt,
          config: {
            responseMimeType: "application/json"
          }
        });

        const textResponse = response.text || "";
        const cleanedJson = textResponse.trim().replace(/^```json/i, "").replace(/```$/, "").trim();
        const parsedResult = JSON.parse(cleanedJson);
        return res.json({
          success: true,
          analysis: parsedResult,
          isMock: true
        });
      } catch (err: any) {
        if (err?.status === 429 || err?.error?.code === 429) {
          console.warn("Gemini Quota Exceeded (429) during translation, falling back.");
        } else {
          console.error("Failed to translate suggestions fallback:", err?.message || err);
        }
      }
    }

    res.json({
      success: true,
      analysis: fallbackResponse,
      isMock: true
    });
  });

  // --- API ROUTE: GET Submissions for a specific user ---
  app.get("/api/submissions/user", (req, res) => {
    console.log("GET /api/submissions/user hit with query:", req.query);
    const { name, phone } = req.query;
    if (!name && !phone) {
      return res.status(400).json({ error: "Missing name or phone query parameter" });
    }

    const searchName = (name as string || "").toLowerCase().trim();
    const searchPhone = (phone as string || "").toLowerCase().trim();
    const userSubmissions: Submission[] = [];

    for (const key of Object.keys(constituencyStore)) {
      const [st, con] = key.split(":");
      const filtered = constituencyStore[key].submissions.filter(s => {
        const subName = (s.name || "").toLowerCase().trim();
        const subPhone = (s.phone || "").toLowerCase().trim();
        
        const nameMatch = searchName && subName === searchName;
        const phoneMatch = searchPhone && subPhone === searchPhone;
        
        return nameMatch || phoneMatch;
      }).map(s => ({
        ...s,
        state: s.state || st,
        constituency: s.constituency || con
      }));
      userSubmissions.push(...filtered);
    }

    // Sort by timestamp descending
    userSubmissions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    res.json({ submissions: userSubmissions });
  });




  // --- API ROUTE: POST Submission (Process via Gemini) ---
  app.post("/api/submissions", async (req, res) => {
    const { name, phone, language, inputType, originalText, audioUrl, photoUrls, state, constituency, latitude, longitude, locationVerified, isProposal } = req.body;

    if (!originalText || typeof originalText !== "string") {
      return res.status(400).json({ error: "Missing originalText" });
    }

    const ai = getGeminiClient();
    const newId = `sub_${Date.now()}`;

    let analyzedData: Partial<Submission> = {};

    if (ai) {
      try {
        // Truncate text to avoid token limits
        const truncatedText = originalText.length > 2000 ? originalText.substring(0, 2000) + "..." : originalText;

        const prompt = `You are an expert civic analyst for an MP development portal in India. Analyze the following citizen feedback and extract categorization details.
Citizen input (in language: "${language}"):
"${truncatedText}"

Your output must be a valid JSON object matching the requested schema.`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash", // Use flash-lite for better quota management
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                translatedText: { type: Type.STRING },
                category: { 
                  type: Type.STRING, 
                  description: "One of: Education, Healthcare, Roads & Transport, Sanitation, Water Supply, Vocations" 
                },
                urgency: { 
                  type: Type.STRING, 
                  description: "One of: High, Medium, Low" 
                },
                sentiment: { 
                  type: Type.STRING, 
                  description: "One of: positive, neutral, negative" 
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
      } catch (err: any) {
        if (err?.status === 429 || err?.error?.code === 429) {
          console.warn("Gemini Quota Exceeded (429) during analysis, falling back.");
        } else {
          console.error("Gemini analysis failed:", err?.message || err);
        }
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
      urgency: (analyzedData.urgency as any) || "Medium",
      timestamp: new Date().toISOString(),
      sentiment: analyzedData.sentiment,
      impactCount: analyzedData.impactCount || 500,
      audioUrl,
      photoUrls,
      status: "Received",
      aiSummary: analyzedData.aiSummary || "Civic request received.",
      latitude: latitude ? Number(latitude) : undefined,
      longitude: longitude ? Number(longitude) : undefined,
      locationVerified: Boolean(locationVerified),
      isProposal: Boolean(isProposal)
    };

    const activeState = state || "Kerala";
    const activeConstituency = constituency || "Thiruvananthapuram";
    const data = getOrCreateConstituencyData(activeState, activeConstituency);

    // Save to memory
    data.submissions.unshift(fullSubmission);

    // Dynamic updating: update matching proposed projects in our memory list
    const matchingProj = data.projects.find(
      p => p.category === fullSubmission.category
    );
    if (matchingProj) {
      matchingProj.citizenSubmissionsCount += 1;
      // Recalculate demandIndex based on count
      matchingProj.demandIndex = Math.min(100, 60 + matchingProj.citizenSubmissionsCount * 2.5);
    }

    res.json({ success: true, submission: fullSubmission });
  });

  // --- API ROUTE: POST Transcribe Audio (Via Gemini 1.5 Flash) ---
  app.post("/api/transcribe", async (req, res) => {
    console.log("Received /api/transcribe request");
    const { audio, language, mimeType } = req.body;

    if (!audio) {
      console.log("Missing audio base64 data");
      return res.status(400).json({ error: "Missing audio base64 data" });
    }

    const ai = getGeminiClient();

    if (ai) {
      try {
        const cleanBase64 = audio.includes(",") ? audio.split(",")[1] : audio;
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [
            {
              role: "user",
              parts: [
                {
                  inlineData: {
                    mimeType: (mimeType || "audio/wav").split(";")[0],
                    data: cleanBase64
                  }
                },
                {
                  text: `You are an expert multilingual speech transcriber for a citizen grievance web portal.
             Please listen to this audio recorded voice note of a citizen and transcribe it exactly into the native script of the language they are speaking.
             
             IMPORTANT:
             - If the speaker is speaking Malayalam, write the transcription in Malayalam script (മലയാളം ലിപി).
             - If the speaker is speaking Hindi, write the transcription in Devanagari script (देवनागरी).
             - If the speaker is speaking Tamil, write the transcription in Tamil script (தமிழ்).
             - If the speaker is speaking English, write the transcription in English.
             - Also, detect which language they are speaking (one of: 'ml', 'hi', 'ta', 'en') and translate the transcription into standard, clear English.
             - If there is no speech, only background noise, or you cannot understand the audio at all, return empty strings for transcription and translation, and confidence 0. Do NOT hallucinate random text.
             
             Respond with a strictly valid JSON object matching the following structure:
             {
               "transcription": "The precise transcription in the native language script",
               "translation": "The complete translation into clear, professional English",
               "detectedLanguage": "The ISO language code: 'ml', 'hi', 'ta', or 'en'",
               "confidence": 0.95
             }
             Do not include any Markdown blocks, comments, or backticks around the JSON.`
                }
              ]
            }
          ],
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                transcription: { type: Type.STRING },
                translation: { type: Type.STRING },
                detectedLanguage: { type: Type.STRING },
                confidence: { type: Type.NUMBER }
              },
              required: ["transcription", "translation", "detectedLanguage"]
            }
          }
        });

        const text = response.text;
        if (!text || text.trim() === "") {
          console.error("Gemini returned no valid text");
          throw new Error("No text returned from Gemini");
        }
        
        console.log("Gemini response text:", text);
        const parsed = JSON.parse(text.trim());
        const result = {
          success: true,
          transcription: parsed.transcription,
          translation: parsed.translation,
          detectedLanguage: parsed.detectedLanguage || language || "en",
          confidence: parsed.confidence || 0.9
        };
        console.log("Returning JSON:", result);
        return res.json(result);
      } catch (err: any) {
        if (err?.status === 429 || err?.error?.code === 429) {
          console.warn("Gemini Quota Exceeded (429) during audio transcription, falling back to mock.");
        } else {
          console.error("Gemini audio transcription failed, falling back to mock:", err?.message || err);
        }
      }
    }

    
    // Return a clear error instead of misleading hardcoded text
    return res.status(429).json({ error: "AI Transcription failed due to quota limits. Please type your grievance." });

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

  // --- API ROUTE: POST Generate AI Grievance Preview ---
  app.post("/api/submissions/generate-grievance", async (req, res) => {
    const { originalText, language, name, phone, inputType, photoUrls, audioUrl, state, constituency, latitude, longitude, locationVerified } = req.body;

    if (!originalText || typeof originalText !== "string") {
      return res.status(400).json({ error: "Missing originalText" });
    }

    const ai = getGeminiClient();

    if (ai) {
      try {
        const truncatedText = originalText.length > 2000 ? originalText.substring(0, 2000) + "..." : originalText;
        const prompt = `You are a highly experienced legislative grievance officer specializing in urban governance and civic rights.
Draft a professional, authoritative, and persuasive grievance letter based on this input:
Citizen Name: ${name || 'Anonymous'}
Location: ${constituency || 'Unknown'}, ${state || 'Unknown'}
Input Description: "${truncatedText}"
Source Language: "${language || 'en'}"

Your goal is to transform the citizen's raw feedback into a structured, high-impact grievance that compels the administration to act.

Key Requirements for the Letter:
1. **Tone**: Constructive, formal, and bureaucratic yet urgent.
2. **Structure**: Formal salutation, Subject line, Problem statement, Impact analysis, and Specific demands.
3. **Multi-lingual**: Translate the grievance into standard, clear English regardless of source language.
4. **Summary**: Provide a 2-sentence executive summary.
5. **Impact**: Estimate how many people (approximate impactCount) are affected by this issue.
6. **Sentiment**: Detect the emotional tone.
7. **Category**: Match the issue to one of: 'Education', 'Healthcare', 'Roads & Transport', 'Sanitation', 'Water Supply', 'Vocations'.
8. **Department**: Suggest the specific government department responsible (e.g., PWD, Municipal Corporation, Health Dept).
9. **Action Plan**: List 3 specific actionable steps the authority should take.

Return as a JSON object matching the requested schema.`;

        const requestConfig = {
          model: "gemini-2.5-flash",
          contents: prompt,
          config: { 
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                grievance: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    phone: { type: Type.STRING },
                    language: { type: Type.STRING },
                    inputType: { type: Type.STRING },
                    originalText: { type: Type.STRING },
                    translatedText: { type: Type.STRING },
                    category: { type: Type.STRING },
                    targetDepartment: { type: Type.STRING },
                    suggestedActions: { type: Type.ARRAY, items: { type: Type.STRING } },
                    urgency: { type: Type.STRING },
                    sentiment: { type: Type.STRING },
                    impactCount: { type: Type.NUMBER },
                    photoUrls: { type: Type.ARRAY, items: { type: Type.STRING } },
                    audioUrl: { type: Type.STRING },
                    status: { type: Type.STRING },
                    aiSummary: { type: Type.STRING },
                    state: { type: Type.STRING },
                    constituency: { type: Type.STRING },
                    latitude: { type: Type.NUMBER },
                    longitude: { type: Type.NUMBER },
                    locationVerified: { type: Type.BOOLEAN }
                  },
                  required: ["translatedText", "aiSummary", "category", "targetDepartment", "suggestedActions"]
                }
              },
              required: ["grievance"]
            }
          }
        };

        let response;
        try {
          response = await ai.models.generateContent(requestConfig);
        } catch (err: any) {
          const isRetryable = err?.status === 503 || err?.error?.code === 503;
          if (isRetryable) {
            console.warn(`Gemini error ${err?.status || err?.error?.code}, retrying once...`);
            await new Promise(resolve => setTimeout(resolve, 3000));
            response = await ai.models.generateContent(requestConfig);
          } else {
            throw err;
          }
        }

        const parsed = JSON.parse(response.text || "{}");
        if (parsed.grievance) {
          const g = parsed.grievance;
          // Merge with original metadata to ensure fields aren't lost
          const fullGrievance = {
            ...g,
            name: g.name || name || 'Anonymous',
            phone: g.phone || phone || '',
            language: g.language || language || 'en',
            inputType: g.inputType || inputType || 'text',
            originalText: g.originalText || originalText,
            category: g.category || 'Sanitation',
            targetDepartment: g.targetDepartment || 'Municipal Corporation',
            suggestedActions: g.suggestedActions || [],
            urgency: g.urgency || 'High',
            sentiment: g.sentiment || 'negative',
            impactCount: g.impactCount || 100,
            photoUrls: photoUrls || [],
            audioUrl: audioUrl || '',
            status: g.status || 'Received',
            state: state || '',
            constituency: constituency || '',
            latitude: latitude || null,
            longitude: longitude || null,
            locationVerified: !!locationVerified
          };
          return res.json({ grievance: fullGrievance });
        }
      } catch (err: any) {
        if (err?.status === 429 || err?.error?.code === 429) {
          console.warn("Gemini Quota Exceeded (429) during grievance generation, falling back.");
        } else {
          console.error("Gemini grievance generation failed:", err?.message || err);
        }
      }
    }
    
    // Simple fallback if AI fails
    res.json({
      grievance: {
        name: name || 'Anonymous',
        phone: phone || '',
        language: language || 'en',
        inputType: inputType || 'text',
        originalText,
        translatedText: originalText,
        urgency: 'Medium',
        sentiment: 'negative',
        impactCount: 100,
        photoUrls: photoUrls || [],
        audioUrl: audioUrl || '',
        status: 'Received',
        aiSummary: 'Citizen grievance (AI generation failed)',
        state: state || '',
        constituency: constituency || '',
        latitude: latitude || null,
        longitude: longitude || null,
        locationVerified: !!locationVerified
      }
    });
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
- Location: ${proj.constituency || 'General area'}
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
          model: "gemini-2.5-flash",
          contents: prompt,
        });

        return res.json({ report: response.text });
      } catch (err: any) {
        if (err?.status === 429 || err?.error?.code === 429) {
          console.warn("Gemini Quota Exceeded (429) during report generation, falling back.");
        } else {
          console.error("Gemini report generation failed:", err?.message || err);
        }
      }
    }

    // High quality mock report fallback in English/Malayalam/Hindi if Gemini is missing or failed
    let fallbackReport = "";
    if (language === "ml") {
      fallbackReport = `# പാർലമെന്റ് അംഗത്തിന്റെ കാര്യാലയം (OFFICE OF THE MEMBER OF PARLIAMENT)
## വികസന ശുപാർശ റിപ്പോർട്ട് (PRIORITY DEVELOPMENT REPORT)

**പദ്ധതി**: ${proj.title}
**വിഭാഗം**: ${proj.category}
**പ്രദേശം**: ${proj.constituency || 'General'}
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
**Location**: ${proj.constituency || 'General'}
**Estimated Budget**: ₹${proj.estimatedCost} Lakhs
**Priority Index**: ${proj.demandIndex}/100

---

### 1. Executive Summary
This project aims to directly address the critical infrastructure deficit in this constituency. By resolving this key issue, we significantly enhance local productivity, standard of living, and safety.

### 2. Citizen Demand Correlation
We have consolidated **${proj.citizenSubmissionsCount} registered citizen submissions** regarding this specific grievance. The high feedback density registers a Demand Score of **${proj.demandIndex}/100**, justifying immediate administrative sanction.

### 3. Demographic Benefit Analysis
This initiative is highly tailored to meet the needs of the population. 
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
    const { state, city, problemText, language, photoData, voiceData, currentUser } = req.body;

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
        model: "gemini-2.5-flash",
        contents: [{ role: 'user', parts: promptParts }],
      });

      res.json({ proposal: response.text });
    } catch (err: any) {
      if (err?.status === 429 || err?.error?.code === 429) {
        console.warn("Gemini Quota Exceeded (429) during proposal generation, falling back.");
        return res.json({ proposal: `**MOCK PROPOSAL (API Quota Exceeded)**\n\n# Official Grievance Submission\n\n**Category:** ${req.body.category || 'General'}\n\n**Description:**\n${req.body.description}\n\n**Location:**\n${req.body.location || 'Not Specified'}\n\nThis is a mock proposal generated because the AI API quota was exceeded. Please try again later.` });
      }
      console.error("Proposal generation failed:", err?.message || err);
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
