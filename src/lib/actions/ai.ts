"use server";

/**
 * Server Action to handle AI Chat interactions using Google Gemini
 * This keeps the API key secure on the server.
 */
export async function getAIChatResponse(userMessage: string) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      error: "Gemini AI Configuration missing. Please add GEMINI_API_KEY to your .env file.",
    };
  }

  try {
    // Gemini 1.5 Flash Endpoint
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `You are the friendly and professional AI Assistant for 'TasteNest', a premium restaurant. 
                Your goal is to help users with:
                1. Menu information (Steaks, Burgers, Coffee, Desserts).
                2. Reservations (Mon-Sun, 9 AM - 11 PM).
                3. Delivery timings (30-45 mins).
                4. General FAQs.
                Be helpful, use culinary-themed language occasionally, and if you don't know something, suggest they contact human support at +1 234 567 890.
                
                User question: ${userMessage}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to fetch Gemini response");
    }

    // Extracting the text response from Gemini's specific JSON structure
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiText) {
      throw new Error("Empty response from AI");
    }

    return {
      content: aiText,
    };
  } catch (error) {
    console.error("Gemini AI Action Error:", error);
    return {
      error: "I'm having trouble connecting to my Gemini brain. Please check your API key or try again!",
    };
  }
}
