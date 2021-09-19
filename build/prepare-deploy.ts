import { config } from "dotenv";
import path from "path";
import fs from "fs";
const env = config({
  path: path.resolve(
    __dirname,
    "..",
    `.env.${process.env.NODE_ENV || "development"}`
  ),
}).parsed;

fs.writeFileSync(
  path.resolve(__dirname, "..", ".clasp.json"),
  JSON.stringify({
    scriptId: env.APP_SCREPT_ID,
    rootDir: "./dist",
  })
);
