import { GoogleGenAI } from "@google/genai";
import { config } from "../config/index.js";
import { prisma } from "./prisma/index.js";

export const geminiClient = new GoogleGenAI({
  apiKey: config.gemini.apiKey,
});

export async function generateQuotes(): Promise<string[]> {
  const prompt = `
You are a creative AI that writes motivational quotes for software developers.

Return exactly 10 short, original motivational quotes for developers. 
Each quote must be a single-line string, not numbered or formatted as code.
Separate each quote with the delimiter "|||".

Example output:
Dream in code, live in logic.|||
The bug you fix today becomes your superpower tomorrow.|||
...

Now, generate the quotes:
  `;

  const response = await geminiClient.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  if (typeof response !== "object" || !response.text) {
    throw new Error("No response from Gemini API");
  }

  const rawText = response.text.trim();
  console.log("Gemini Raw Output:", rawText);

  const quotes = rawText
    .split("|||")
    .map((q) => q.trim())
    .filter((q) => q.length > 0);

  console.log("Parsed Quotes:", quotes);

  return quotes;
}

export async function getDailyQuote() {
  const today = new Date();

  // ✅ Check if there are unposted quotes in the database
  const unpostedQuotes = await prisma.quotes.findMany({
    where: {
      isPosted: false,
    },
  });

  let quotes: string[];

  if (unpostedQuotes.length === 0) {
    // ✅ No unposted quotes, generate new ones
    console.log("No unposted quotes found. Generating new quotes...");
    quotes = await generateQuotes();

    // ✅ Store quotes in DB
    for (const quote of quotes) {
      await prisma.quotes.create({
        data: {
          quote,
          isPosted: false,
        },
      });
    }
  } else {
    // ✅ Use existing unposted quotes from database
    console.log(`Found ${unpostedQuotes.length} unposted quotes in database`);
    quotes = unpostedQuotes.map((q) => q.quote);
  }

  // ✅ Pick today's quote deterministically
  const quote = quotes[today.getDate() % quotes.length];
  const caption = `✨ "${quote}"\n\n#motivation #inspiration #dailyquote #developers #coding`;

  return { quote, caption };
}

// Test run
getDailyQuote().then(({ quote, caption }) => {
  console.log("Quote:", quote);
  console.log("Caption:", caption);
});
