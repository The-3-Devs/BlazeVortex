import config from "../config.json"
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });

