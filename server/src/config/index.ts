import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

function getEnv(key: string, required = true): string {
  const value = process.env[key];
  if (!value && required) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value as string;
}

export const config = {
  app: {
    env: getEnv("NODE_ENV", false) || "development",
    port: parseInt(getEnv("PORT", false) || "3000", 10),
  },
  db: {
    url: getEnv("DATABASE_URL"),
  },
  auth: {
    jwtSecret: getEnv("JWT_SECRET", false) || "default-secret",
  },
  facebook: {
    appId: getEnv("FACEBOOK_APP_ID"),
    appSecret: getEnv("FACEBOOK_APP_SECRET"),
    pageId: getEnv("FACEBOOK_PAGE_ID"),
  },
  instagram: {
    accessToken: getEnv("INSTAGRAM_ACCESS_TOKEN"),
    businessAccountId: getEnv("INSTAGRAM_BUSINESS_ACCOUNT_ID"),
  },
  gemini: {
    apiKey: getEnv("GEMINI_API_KEY"),
  },
  supabase: {
    dbUrl: getEnv("DATABASE_URL"),
    projectUrl: getEnv("SUPABASE_PROJECT_URL"),
    serviceRoleKey: getEnv("SUPABASE_SERVICE_ROLE_KEY"),
    bucketName: getEnv("SUPABASE_BUCKET_NAME"),

  },
};
