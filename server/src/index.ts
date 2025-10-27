
import express from 'express';
import type { Request, Response } from 'express';
import { getDailyQuote } from './lib/llm';
import { generateQuoteImage } from './lib/image';
import { uploadToSupabaseBucket } from './db/db';
import { postToInstagram } from './lib/instagram';
import { addAccessTokenToKv, getAccessTokenFromKv } from './db/repo';
import { config } from './config';
import { prisma } from './lib/prisma';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello World with Express, TypeScript, and Bun!');
});

app.get('/trigger', async (req: Request, res: Response) => {
  try {
    const { quote, caption } = await getDailyQuote();
    if (!quote) {
      throw new Error("No quote generated");
    }
    const png = await generateQuoteImage(quote);
    const filename = `quotes/${Date.now()}.png`;
    const imageUrl = await uploadToSupabaseBucket(png, filename);
    const result = await postToInstagram({ imageUrl, caption });
    console.log("✅ post successful:", result);

    // update the quote as posted in DB
    await prisma.quotes.updateMany({
      where: { quote },
      data: { isPosted: true },
    })

    return res.status(200).json({ message: 'Post successful', result });
  } catch (error) {
    console.error("❌ Scheduled post failed:", error);
    return res.status(500).json({ message: 'Post failed', error });
  }
})

app.get('/refresh-token', async (_req: Request, res: Response) => {
  try {
    const oldToken = await getAccessTokenFromKv();
    console.log("🔄 Refreshing token, old token:", oldToken);
    if (!oldToken) {
      return res.status(400).json({ message: "No existing token found" });
    }

    const { appId, appSecret } = config.facebook;

    const refresh = await fetch(
      `https://graph.facebook.com/v17.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${oldToken}`,
    );
    const data: { access_token: string } = await refresh.json() as any;
    if (!refresh.ok) throw new Error(JSON.stringify(data));
    await addAccessTokenToKv(data.access_token);

    console.log("🔁 Token refreshed successfully:", data);
    return res.json({ message: "Token refreshed" });
  } catch (err) {
    console.error("❌ Token refresh failed:", err);
    return res.status(500).json({ message: "Token refresh failed", err });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});