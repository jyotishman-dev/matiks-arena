import { configDotenv } from "dotenv";
import path from "node:path";

configDotenv();
configDotenv({ path: path.resolve(__dirname, "../../../.env") });

const JWT_SECRET = process.env.JWT_SECRET || "secret";
process.env.JWT_SECRET = JWT_SECRET;

export const config = {
  JWT_SECRET: JWT_SECRET,
};