import { config } from "../config";
import { getAccessTokenFromKv } from "../db/repo";

interface InstagramPostOptions {
  imageUrl: string;
  caption: string;
}

export async function postToInstagram({ imageUrl, caption }: InstagramPostOptions) {
  const accessToken = await getAccessTokenFromKv();
  const businessAccountId = config.instagram.businessAccountId;

  if (!accessToken || !businessAccountId) {
    throw new Error("Missing Instagram credentials in environment variables");
  }

  try {
    // Step 1: Create media object
    const createMedia = await fetch(
      `https://graph.facebook.com/v20.0/${businessAccountId}/media`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_url: imageUrl,
          caption,
          access_token: accessToken,
        }),
      }
    );

    const mediaData: any = await createMedia.json();
    if (!createMedia.ok) throw new Error(JSON.stringify(mediaData));

    console.log("📸 Media object created:", mediaData.id);

    if(!mediaData.id) {
      throw new Error("No media ID returned from Instagram");
    }

    // Step 2: Publish the media
    const publish = await fetch(
      `https://graph.facebook.com/v20.0/${businessAccountId}/media_publish`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creation_id: mediaData.id,
          access_token: accessToken,
        }),
      }
    );

    const publishData = await publish.json();
    if (!publish.ok) throw new Error(JSON.stringify(publishData));

    console.log("✅ Successfully posted to Instagram:", publishData);
    return publishData;
  } catch (err: any) {
    console.error("❌ Instagram post failed:", err.message || err);
    throw err;
  }
}