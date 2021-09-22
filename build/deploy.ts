import { getEnv } from "./getEnv";
import execa from "execa";
import { prepareEnv } from "./prepareEnv";
const deploy = async () => {
  const env = getEnv();
  await prepareEnv();
  await execa("webpack", [], {
    preferLocal: true,
    stdio: "inherit",
  });
  await execa("clasp", ["push"], {
    preferLocal: true,
    stdio: "inherit",
  });
  await execa("clasp", ["deploy", "-i", env.APP_DEPLOY_ID], {
    preferLocal: true,
    stdio: "inherit",
  });
};
deploy();
