"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_json_1 = __importDefault(require("../config.json"));
const genai_1 = require("@google/genai");
const ai = new genai_1.GoogleGenAI({ apiKey: config_json_1.default.geminiApiKey });
