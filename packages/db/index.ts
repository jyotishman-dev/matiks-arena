import { configDotenv } from "dotenv";
import path from "node:path";
import { PrismaClient } from "./generated/prisma/client";

// Ensure .env is loaded from root or package folder if present
configDotenv();
configDotenv({ path: path.resolve(__dirname, "../../.env") });
configDotenv({ path: path.resolve(__dirname, "./.env") });

const databaseUrl =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5432/matiks?schema=public";

process.env.DATABASE_URL = databaseUrl;

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

export default prisma;