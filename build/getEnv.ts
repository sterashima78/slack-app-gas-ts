import { config } from "dotenv";
import path from "path";
export const getEnv = () =>
  config({
    path: path.resolve(
      __dirname,
      "..",
      `.env.${process.env.NODE_ENV || "development"}`
    ),
  }).parsed;
