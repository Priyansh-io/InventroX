import dotenv from "dotenv";
import { ConvexHttpClient } from "convex/browser";

dotenv.config({ path: ".env.local" });

const convexUrl = process.env.CONVEX_URL;

if (!convexUrl) {
  throw new Error("CONVEX_URL is not defined");
}

export const convexClient = new ConvexHttpClient(convexUrl);