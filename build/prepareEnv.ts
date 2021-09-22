import path from "path";
import fs from "fs/promises";
import { getEnv } from "./getEnv";

export const prepareEnv = () =>
  fs.writeFile(
    path.resolve(__dirname, "..", ".clasp.json"),
    JSON.stringify({
      scriptId: getEnv().APP_SCREPT_ID,
      rootDir: "./dist",
    })
  );
