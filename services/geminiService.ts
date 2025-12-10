import { GoogleGenAI, Type } from "@google/genai";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Models
const MODEL_CHAT = "gemini-3-pro-preview";
const MODEL_VISION = "gemini-3-pro-preview";
const MODEL_FAST = "gemini-2.5-flash"; // For summarization and simpler tasks

/**
 * Chat with the AI Health Assistant
 */
export const createChatSession = () => {
  return ai.chats.create({
    model: MODEL_CHAT,
    config: {
      systemInstruction: "You are HealMate, a compassionate and knowledgeable AI health assistant. You help users understand symptoms, general health advice, and medical concepts. CRITICAL: You must ALWAYS state that you are an AI and your advice is not a substitute for professional medical diagnosis or treatment. Be concise, professional, and empathetic.",
    },
  });
};

/**
 * Create a specialized Mental Health Chat Session
 */
export const createMentalHealthSession = () => {
  return ai.chats.create({
    model: MODEL_CHAT,
    config: {
      systemInstruction: "You are a supportive and empathetic mental health companion. Your goal is to listen, provide coping strategies for anxiety and stress, and offer comforting words. You are NOT a licensed therapist. If the user indicates self-harm or severe crisis, you MUST immediately direct them to emergency services. Use a calm, reassuring tone.",
    },
  });
};

/**
 * Analyze a medical image
 */
export const analyzeMedicalImage = async (base64Data: string, mimeType: string) => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_VISION,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: "Analyze this image in a medical context. Identify visible anomalies, potential conditions, or key features. Provide a structured response with a title, a list of findings, a general recommendation (e.g., see a specialist), and an estimated severity level (Low, Moderate, High, Unknown). Disclaimer: This is for informational purposes only.",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            findings: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            recommendation: { type: Type.STRING },
            severity: { type: Type.STRING, enum: ["Low", "Moderate", "High", "Unknown"] }
          },
          required: ["title", "findings", "recommendation", "severity"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text);

  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
  }
};

/**
 * Simplify a complex medical report
 */
export const simplifyMedicalReport = async (reportText: string) => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: `Simplify the following medical report or text into plain English for a patient to understand. Highlight key points and next steps. \n\nTEXT TO SIMPLIFY:\n${reportText}`,
      config: {
        systemInstruction: "You are a medical translator. Your goal is to make complex medical jargon easy to understand for a layperson without losing accuracy.",
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error simplifying report:", error);
    throw error;
  }
};

/**
 * Analyze diet compatibility with medications
 */
export const analyzeDietCompatibility = async (base64Data: string, mimeType: string, medications: string[]) => {
  try {
    const medList = medications.length > 0 ? medications.join(", ") : "None";
    const response = await ai.models.generateContent({
      model: MODEL_VISION,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: `Analyze this food image. The patient is currently taking the following medications: ${medList}. 
            1. Identify the food.
            2. Estimate nutritional value (calories, sugar, sodium).
            3. CRITICAL: Check for any known interactions between these foods and the medications listed.
            4. Provide a "Suitability Score" (High, Moderate, Low) and explanation.`,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            foodName: { type: Type.STRING },
            nutrition: { type: Type.STRING },
            interactions: { type: Type.STRING },
            suitability: { type: Type.STRING, enum: ["High", "Moderate", "Low"] },
            advice: { type: Type.STRING }
          },
          required: ["foodName", "nutrition", "interactions", "suitability", "advice"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("Error analyzing diet:", error);
    throw error;
  }
};

/**
 * Find nearby medical facilities using Google Maps Grounding
 */
export const findNearbyMedicalFacilities = async (query: string, location: { lat: number, lng: number }) => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: `Find ${query} near the provided location. List the names, addresses, and ratings if available.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          // Use retrievalConfig to pass user location for Maps Grounding
          retrievalConfig: {
            latLng: {
              latitude: location.lat,
              longitude: location.lng
            }
          }
        }
      }
    });

    // Extract grounding chunks for Maps
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const text = response.text;
    
    return { text, groundingChunks };
  } catch (error) {
    console.error("Error finding places:", error);
    throw error;
  }
};

/**
 * Generate a daily companion message
 */
export const getCompanionMessage = async (stats: any, character: string) => {
  try {
    const statsStr = JSON.stringify(stats);
    let persona = "";
    
    switch (character) {
      case 'ZenBot': persona = "calm, logical, but warm robot. Use robotic beep-boop puns occasionally."; break;
      case 'HealthPup': persona = "energetic, loyal, happy dog. Use woofs and tail wags metaphorically."; break;
      case 'CareKitty': persona = "gentle, slightly sassy but caring cat. Use purrs and meows."; break;
      case 'WiseOwl': persona = "wise, academic, encouraging owl. Use 'hoot' or wisdom metaphors."; break;
      default: persona = "supportive assistant.";
    }

    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: `You are a ${character}, a ${persona}. 
      The user's daily stats are: ${statsStr}.
      Generate a short, 2-3 sentence greeting for the dashboard. 
      Celebrate their good stats, or gently encourage them if numbers are low. 
      Make it feel like a daily check-in from a friend.`,
      config: {
        maxOutputTokens: 100,
        temperature: 0.8
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error generating companion message:", error);
    return "Welcome back! I'm here to support your health journey today.";
  }
};