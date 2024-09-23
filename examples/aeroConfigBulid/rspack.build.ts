import { boolFlag, FeatureFlagsRspack } from "aero-proxy/featureFlags";

import path from "path";
import rspack from "@rspack/core";

import { RsdoctorRspackPlugin } from "@rsdoctor/rspack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";

const debugMode = "DEBUG" in process.env;
const serverMode = process.env.SERVER_MODE;

// @ts-ignore
const webpackFeatureFlags: FeatureFlagsRspack = {
  FEATURE_URL_ENC: boolFlag(false),
  FEATURE_CORS_TESTING: boolFlag(false),
  FEATURE_CORS_EMULATION: boolFlag(false),
  FEATURE_INTEGRITY_EMULATION: boolFlag(false),
  FEATURE_ENC_BODY_EMULATION: boolFlag(false),
  FEATURE_CACHES_EMULATION: boolFlag(false),
  FEATURE_CLEAR_EMULATION: boolFlag(false),
  REWRITER_HTML: boolFlag(true),
  REWRITER_XSLT: boolFlag(false),
  REWRITER_JS: boolFlag(false),
  REWRITER_CACHE_MANIFEST: boolFlag(false),
  SUPPORT_LEGACY: boolFlag(false),
  SUPPORT_WORKER: boolFlag(false),
  DEBUG: JSON.stringify(debugMode),
};

if (serverMode) {
  webpackFeatureFlags.REQ_INTERCEPTION_CATCH_ALL = "referrer";
  if (serverMode === "winterjs") webpackFeatureFlags.SERVER_ONLY = "winterjs";
  else if (serverMode === "cf-workers")
    webpackFeatureFlags.SERVER_ONLY = "cf-workers";
} else webpackFeatureFlags.REQ_INTERCEPTION_CATCH_ALL = "clients";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const plugins: any = [
  // @ts-ignore
  new CleanWebpackPlugin(),
  // @ts-ignore
  new rspack.DefinePlugin(webpackFeatureFlags),
];

if (debugMode)
  plugins.push(
    new RsdoctorRspackPlugin({
      port: 3300,
    })
  );

const config: rspack.Configuration = {
  mode: debugMode ? "development" : "production",
  entry: {
    config: path.resolve(__dirname, "./src/aeroConfig.ts"),
  },
  plugins,
  resolve: {
    extensions: [".ts"],
    tsConfigPath: path.resolve(__dirname, "./tsconfig.json"),
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/[\\/]node_modules[\\/]/],
        loader: "builtin:swc-loader",
      },
    ],
  },
  output: {
    filename: "[name].aero.js",
    path: path.resolve(__dirname, "./src/lib/aero"),
    iife: true,
    clean: true,
  },
  target: "webworker",
};

if (debugMode) config.watch = true;

export default config;
