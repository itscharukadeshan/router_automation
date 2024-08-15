/** @format */

import * as dotenv from "dotenv";

dotenv.config();

const DIALOG_ROUTER = process.env.DIALOG_ROUTER as string;
const HUTCH_ROUTER = process.env.HUTCH_ROUTER as string;
const DIALOG_ROUTER_PASSWORD = process.env.DIALOG_ROUTER_PASSWORD as string;
const DIALOG_ROUTER_USER_NAME = process.env.DIALOG_ROUTER_USER_NAME as string;
const HUTCH_ROUTER_PASSWORD = process.env.HUTCH_ROUTER_PASSWORD as string;
const HUTCH_ROUTER_USER_NAME = process.env.HUTCH_ROUTER_USER_NAME as string;
const BROWSER_ENDPOINT = process.env.BROWSER_ENDPOINT as string;
const BROWSER_TOKEN = process.env.BROWSER_TOKEN as string;
const BROWSER_LESS_ENDPOINT = process.env.BROWSER_LESS_ENDPOINT as string;

export {
  DIALOG_ROUTER,
  HUTCH_ROUTER,
  DIALOG_ROUTER_PASSWORD,
  DIALOG_ROUTER_USER_NAME,
  HUTCH_ROUTER_PASSWORD,
  HUTCH_ROUTER_USER_NAME,
  BROWSER_ENDPOINT,
  BROWSER_TOKEN,
  BROWSER_LESS_ENDPOINT,
};
