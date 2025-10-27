import { config } from "../config";

export async function uploadToSupabaseBucket(
  file: Uint8Array,
  filename: string
): Promise<string> {
  const { projectUrl, bucketName, serviceRoleKey} = config.supabase;

  const uploadUrl = `${projectUrl}/storage/v1/object/${bucketName}/${filename}`;

  const res = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "image/png",
    },
    body: file,
  });

  if (!res.ok) {
    throw new Error(`Supabase upload failed: ${await res.text()}`);
  }

  // Construct public URL
  return `${projectUrl}/storage/v1/object/public/${bucketName}/${filename}`;
}