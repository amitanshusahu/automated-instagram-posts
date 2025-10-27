import { config } from "../src/config";
import { addAccessTokenToKv } from "../src/db/repo";
import { prisma } from "../src/lib/prisma";

async function addAccessTokenToKvSeed() {
  await addAccessTokenToKv(config.instagram.accessToken);
}

addAccessTokenToKvSeed()
  .then(async () => {
    console.log("Seeded Instagram access token to KV store.");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Error seeding Instagram access token:", e);
    await prisma.$disconnect();
    process.exit(1);
  });