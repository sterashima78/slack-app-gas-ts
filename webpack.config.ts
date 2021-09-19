import { Configuration, DefinePlugin } from "webpack";
import path from "path";
import GasPlugin from "gas-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";

const config: Configuration = {
  entry: "./src/index.ts",
  output: {
    filename: "index.js",
    path: path.join(__dirname, "dist"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [
    new GasPlugin(),
    new CopyPlugin({
      patterns: [{ from: "./src/appsscript.json" }],
    }),
    new DefinePlugin({
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    }),
  ],
};

export default config;
