import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialize the Gemini client to avoid crashes on startup if key is missing
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not set. Chatbot will run in simulation mode.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Simulated backend database for the AI agents to reference if needed
const STADIUM_MOCK_DATA = {
  name: "SwissArena FIFA Smart Stadium",
  location: "Zurich, Switzerland",
  capacity: 48000,
  builtYear: 2024,
  match: {
    home: "Switzerland",
    away: "Italy",
    time: "20:00 CEST",
    countdown: "Kickoff in 30 minutes",
    attendance: "45,210 / 48,000",
    gates: "Open (Gate A, B, C, D)",
  },
  menu: [
    { id: "burger", name: "Gladiator Beef Burger", price: 14.50, prepTime: 8, rating: 4.8 },
    { id: "pizza", name: "Zurich Melt Pizza Slice", price: 12.00, prepTime: 6, rating: 4.7 },
    { id: "hotdog", name: "Smart Arena Hotdog", price: 9.50, prepTime: 4, rating: 4.5 },
    { id: "pretzel", name: "Alpine Butter Pretzel", price: 6.50, prepTime: 2, rating: 4.6 },
    { id: "drink", name: "Zero-Gravity Swiss Cola", price: 5.00, prepTime: 1, rating: 4.9 },
    { id: "beer", name: "Craft Arena Brew", price: 8.50, prepTime: 2, rating: 4.8 },
  ]
};

// Orchestrated AI Agent API
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const apiKeyExists = !!process.env.GEMINI_API_KEY;

    if (!apiKeyExists) {
      // Elegant simulation response if key is missing
      const lower = message.toLowerCase();
      let activeAgent = "orchestrator";
      let agentName = "Stadium AI Concierge";
      let reply = "Welcome to the SwissArena Smart Stadium! How can I assist you today?";
      let suggestedActions = ["Book a Seat", "Order Alpine Burger", "Get Travel Guide"];

      if (lower.includes("hotel") || lower.includes("travel") || lower.includes("itinerary") || lower.includes("airport") || lower.includes("metro")) {
        activeAgent = "travel";
        agentName = "Travel Planner Agent";
        reply = "### Alpine & Zurich Travel Guide 🚇\n\nBased on your travel profile, I have compiled an optimal Zurich itinerary:\n\n1. **Arriving at Zurich Airport (ZRH)**: Take the S16 or S2 Metro directly to Zurich Hauptbahnhof (Main Station). It's a quick 10-minute journey.\n2. **stadium Access**: Board Metro Line M4 directly to the SwissArena Gate Front Station.\n3. **Recommended Stay**: *The Zurich Grand Plaza* (CHF 160/night, 15m from stadium).\n4. **Recommended Activity**: Take a scenic boat cruise on Lake Zurich before kickoff!\n\nWould you like me to book transit or filter hotels by budget?";
        suggestedActions = ["View Budget Hotels", "Get Metro Map", "Add Transit to Wallet"];
      } else if (lower.includes("burger") || lower.includes("food") || lower.includes("pizza") || lower.includes("eat") || lower.includes("menu")) {
        activeAgent = "food";
        agentName = "Food Concierge Agent";
        reply = "### Food Concierge Recommendations 🍔\n\nWelcome to SwissArena seat service! Here are the crowd favorites and combinations recommended just for you:\n\n* **The Swiss Champion Combo**: Gladiator Beef Burger 🍔 + Zero-Gravity Swiss Cola 🥤 + Alpine Fries 🍟 (Bundle price: CHF 22.00, save CHF 4.50).\n* **For vegetarian fans**: Zurich Melt Pizza Slice (CHF 12.00) paired with an Alpine Butter Pretzel (CHF 6.50).\n\nAll food ordered through the app is delivered **straight to your seat in under 10 minutes**! Let me know if you would like to add any items to your cart.";
        suggestedActions = ["Add Swiss Combo", "Order Pizza Slice", "Show Vegan Menu"];
      } else if (lower.includes("seat") || lower.includes("book") || lower.includes("ticket") || lower.includes("vip")) {
        activeAgent = "seat";
        agentName = "SeatServe Agent";
        reply = "### Seating Explorer 🎟️\n\nI can help you find the absolute best views in SwissArena:\n\n* **East Stand Section A (Premium)**: Excellent diagonal sightline over the goal, perfect for tactical fans. Rating: ⭐⭐⭐⭐ (CHF 85.00)\n* **West VIP Box 4**: Includes personalized catering, hostesses, and leather recliners. Rating: ⭐⭐⭐⭐⭐ (CHF 250.00)\n* **North Stand (Fan Curve)**: High energy, flags, and supporter chants. Rating: ⭐⭐⭐⭐ (CHF 45.00)\n\nWhich category would you like to explore on the stadium map?";
        suggestedActions = ["View East Stand Seats", "Book VIP Box 4", "Show Family Sections"];
      } else if (lower.includes("gate") || lower.includes("navigate") || lower.includes("where") || lower.includes("toilet") || lower.includes("lost")) {
        activeAgent = "navigation";
        agentName = "Navigation Agent";
        reply = "### Indoor Navigation Guide 🗺️\n\nBased on your seat or location in SwissArena:\n\n* **To Section D (Row 12)**: Enter via **Gate 3**. Walk straight through the turnstiles, turn left past the fan merchandise mega-store, and take Escalator West up to Level 2.\n* **Nearest Washrooms**: 15 meters to the right of section D tunnel entrance.\n* **Merchandise Store**: Main atrium opposite Gate A.\n\nWould you like a step-by-step 3D walking path?";
        suggestedActions = ["Start Walking Navigation", "Locate Nearest Washroom", "Find Gate 3"];
      } else if (lower.includes("emergency") || lower.includes("hurt") || lower.includes("police") || lower.includes("medical") || lower.includes("security")) {
        activeAgent = "emergency";
        agentName = "Emergency Response Agent";
        reply = "🚨 **SWISSARENA EMERGENCY CENTER ALERT** 🚨\n\nYour message has been escalated. If you are experiencing an immediate threat or medical crisis, please stay calm and note your exact section, row, and seat:\n\n* **First-aid station**: Located behind Section B entrance (Atrium level).\n* **On-duty Security**: Deploying standard patrols to Section B, Row 5.\n* **Lost Child / Items**: Head directly to the Information Desk at Gate 1.\n\nI have automatically generated a priority assistance ticket for our stadium staff. Emergency service is on standby.";
        suggestedActions = ["Request Medical Escort", "Call Stadium Security", "Track Emergency Ticket"];
      } else if (lower.includes("queue") || lower.includes("crowd") || lower.includes("busy") || lower.includes("wait")) {
        activeAgent = "crowd";
        agentName = "Crowd Intelligence Agent";
        reply = "### Live Crowd Forecast 📊\n\nHere are the active crowd levels at SwissArena right now:\n\n* **Gate B Entrances**: Moderate traffic (Wait time: ~3 mins).\n* **Central Food Atrium**: **High Peak** (Wait time: ~8 mins). I recommend ordering to your seat to completely bypass the lines!\n* **Restrooms (South Wing)**: Low traffic (Wait time: ~1 min).\n\nTraffic is expected to peak 10 minutes before kickoff. Plan accordingly!";
        suggestedActions = ["Bypass Atrium Order to Seat", "View Live Gate Wait Times", "Find Quiet Entrance"];
      } else if (lower.includes("feedback") || lower.includes("complain") || lower.includes("great") || lower.includes("sucks")) {
        activeAgent = "feedback";
        agentName = "Feedback Agent";
        reply = "### Feedback Sentiment Engine 📝\n\nThank you for sharing your experience. I have analyzed your comments:\n\n* **Sentiment Detection**: Recognized as valuable spectator feedback.\n* **Action Item**: This has been logged into our smart system under 'Fan Quality of Experience'. Our operators review these live to adjust concessions or security deployment.\n\nIs there anything specific we can improve right now to make your SwissArena matchday perfect?";
        suggestedActions = ["Submit Detail Survey", "Speak to Manager", "View Feedback Dashboard"];
      } else if (lower.includes("predict") || lower.includes("revenue") || lower.includes("demand") || lower.includes("analytics")) {
        activeAgent = "analytics";
        agentName = "AI Operations Analytics Agent";
        reply = "### AI Operations & Predictions Dashboard 📈\n\nGreetings Admin. Running match-day predictions for Switzerland vs Italy:\n\n* **Attendance Forecast**: 96.5% occupancy (46,320 projected fans).\n* **Food Demand Forecast**: Extreme demand for Gladiator Burgers (approx. 1,420 burgers needed).\n* **Projected Revenue**: CHF 214,500 total (Tickets: CHF 185k, F&B: CHF 29.5k).\n* **Peak Exit Time**: 21:52 CEST. Transit Metro S-Bahn frequency will be doubled.\n\nWould you like me to adjust concession stock levels or update dynamic pricing rules?";
        suggestedActions = ["Deploy Dynamic Pricing", "Authorize Extra Metro Transit", "Export Forecast Report"];
      }

      return res.json({
        activeAgent,
        agentName,
        message: reply,
        suggestedActions,
        data: { simulated: true }
      });
    }

    // Call real Gemini API
    const ai = getGeminiClient();

    // Compile historical chat context
    const formattedHistory = history.map((h: any) => ({
      role: h.role === "user" ? "user" : "model",
      parts: [{ text: h.text }]
    }));

    const systemInstruction = `You are the central Agentic AI Orchestrator for the FIFA HACKUP Smart Stadium Operating System at SwissArena (Zurich).
You coordinate 8 specialized stadium agents. When the fan or admin talks, evaluate their intent and route the answer to the appropriate specialized agent. Always respond in character of the active agent, with highly professional, specific, and actionable details.

List of Agents:
1. "travel" - Travel Planner Agent: Generates custom Zurich travel itineraries, hotel bookings, flight/metro logistics, and nearby tourist hotspots.
2. "food" - Food Concierge Agent: Recommends stadium food/beverages, combos, and personalized meal plans based on fan diet or budget.
3. "seat" - SeatServe Agent: Assists with seat views, ticket availability checks, section dynamic pricing and delivery predictions.
4. "navigation" - Navigation Agent: Explains exact turn-by-step gates, washrooms, seating sections, and walking directions.
5. "crowd" - Crowd Agent: Estimates queue wait times, busiest food concession stands, entrance times, and exit pathways.
6. "feedback" - Feedback Agent: Logs customer complaints/suggestions, analyzes sentiment, and summarizes spectator experience.
7. "analytics" - Analytics Agent: Handles admin queries on revenue forecasts, occupancy predictions, concessions demand, and transit schedule optimizations.
8. "emergency" - Emergency Agent: Instantly prioritizes medical, security, lost children or lost items reports, explaining first-aid or gate coordination clearly.

You MUST respond ONLY with a clean JSON object that fits the following JSON schema:
{
  "activeAgent": "travel" | "food" | "seat" | "navigation" | "crowd" | "feedback" | "analytics" | "emergency" | "orchestrator",
  "agentName": "Name of the Active Agent (e.g. Travel Planner Agent)",
  "message": "Write a highly engaging, fully formatted markdown response. Use bolding, bullets, emojis, lists, headers. Provide high quality, complete recommendations.",
  "suggestedActions": ["List 2 or 3 quick-click buttons for the user to select next"],
  "data": { "any": "supporting JSON structures or metrics" }
}

Keep responses grounded in Zurich, SwissArena, and Switzerland-based themes. Menu items available: Gladiator Beef Burger (CHF 14.50), Zurich Melt Pizza Slice (CHF 12.00), Smart Arena Hotdog (CHF 9.50), Alpine Butter Pretzel (CHF 6.50), Zero-Gravity Swiss Cola (CHF 5.00), Craft Arena Brew (CHF 8.50). Match today is Switzerland vs Italy (Kickoff 20:00 CEST).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        ...formattedHistory,
        { role: "user", parts: [{ text: message }] }
      ],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.7,
      }
    });

    const textOutput = response.text || "{}";
    try {
      const parsed = JSON.parse(textOutput.trim());
      res.json(parsed);
    } catch (parseErr) {
      console.error("Failed to parse Gemini output as JSON", textOutput, parseErr);
      res.json({
        activeAgent: "orchestrator",
        agentName: "Stadium AI Orchestrator",
        message: textOutput,
        suggestedActions: ["Book a Seat", "Browse Food Menu", "Get Zurich Map"],
        data: {}
      });
    }
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({
      error: "Error processing AI request",
      details: error.message,
      activeAgent: "orchestrator",
      agentName: "System Recovery Agent",
      message: "Our stadium AI systems are undergoing rapid diagnostics. I can assist you with manual navigation, seat booking, and food ordering in the main tabs while we reload the brain!",
      suggestedActions: ["Browse Food Menu", "Interactive Seat Booking"]
    });
  }
});

// Serve static assets in production, otherwise mount Vite in development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite middleware mounted for development");
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log("Serving static production build from /dist");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
