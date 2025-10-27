import { prisma } from "../lib/prisma";

export async function addAccessTokenToKv(token: string) {
  const kvStore = await prisma.kvStore.upsert({
    where: { key: "instagram_access_token" },
    update: { value: token },
    create: { key: "instagram_access_token", value: token },
  });
}


export async function getAccessTokenFromKv(): Promise<string | null> {
  const record = await prisma.kvStore.findUnique({
    where: { key: "instagram_access_token" }
  });
  return record ? record.value : null;
}