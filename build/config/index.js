"use strict";
/** @format */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BROWSER_LESS_ENDPOINT = exports.BROWSER_TOKEN = exports.BROWSER_ENDPOINT = exports.HUTCH_ROUTER_USER_NAME = exports.HUTCH_ROUTER_PASSWORD = exports.DIALOG_ROUTER_USER_NAME = exports.DIALOG_ROUTER_PASSWORD = exports.HUTCH_ROUTER = exports.DIALOG_ROUTER = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const DIALOG_ROUTER = process.env.DIALOG_ROUTER;
exports.DIALOG_ROUTER = DIALOG_ROUTER;
const HUTCH_ROUTER = process.env.HUTCH_ROUTER;
exports.HUTCH_ROUTER = HUTCH_ROUTER;
const DIALOG_ROUTER_PASSWORD = process.env.DIALOG_ROUTER_PASSWORD;
exports.DIALOG_ROUTER_PASSWORD = DIALOG_ROUTER_PASSWORD;
const DIALOG_ROUTER_USER_NAME = process.env.DIALOG_ROUTER_USER_NAME;
exports.DIALOG_ROUTER_USER_NAME = DIALOG_ROUTER_USER_NAME;
const HUTCH_ROUTER_PASSWORD = process.env.HUTCH_ROUTER_PASSWORD;
exports.HUTCH_ROUTER_PASSWORD = HUTCH_ROUTER_PASSWORD;
const HUTCH_ROUTER_USER_NAME = process.env.HUTCH_ROUTER_USER_NAME;
exports.HUTCH_ROUTER_USER_NAME = HUTCH_ROUTER_USER_NAME;
const BROWSER_ENDPOINT = process.env.BROWSER_ENDPOINT;
exports.BROWSER_ENDPOINT = BROWSER_ENDPOINT;
const BROWSER_TOKEN = process.env.BROWSER_TOKEN;
exports.BROWSER_TOKEN = BROWSER_TOKEN;
const BROWSER_LESS_ENDPOINT = process.env.BROWSER_LESS_ENDPOINT;
exports.BROWSER_LESS_ENDPOINT = BROWSER_LESS_ENDPOINT;
