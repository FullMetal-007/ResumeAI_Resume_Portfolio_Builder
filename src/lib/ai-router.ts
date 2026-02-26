import { generateWithGemini } from "./gemini";
import { generateWithOllama, isOllamaAvailable } from "./ollama";

export type RequestType =
    | "full_resume_generation"
    | "portfolio_full_project"
    | "minor_edit"
    | "bullet_rewrite"
    | "section_regeneration"
    | "ats_scoring"
    | "summary_generation"
    | "skill_suggestions";

const CONFIDENCE_THRESHOLD = 0.85;

export async function routeAIRequest(
    type: RequestType,
    prompt: string,
    jsonMode = false
): Promise<string> {
    // Heavy tasks → always use Gemini
    if (type === "full_resume_generation" || type === "portfolio_full_project" || type === "summary_generation") {
        return generateWithGemini(prompt, jsonMode);
    }

    // Light tasks → try Ollama first, fall back to Gemini
    if (
        type === "minor_edit" ||
        type === "bullet_rewrite" ||
        type === "section_regeneration" ||
        type === "ats_scoring" ||
        type === "skill_suggestions"
    ) {
        const ollamaAvailable = await isOllamaAvailable();

        if (ollamaAvailable) {
            try {
                const { text, confidence } = await generateWithOllama(prompt);

                if (confidence >= CONFIDENCE_THRESHOLD) {
                    console.log(`[AI Router] Used Ollama (confidence: ${confidence})`);
                    return text;
                }

                console.log(`[AI Router] Ollama confidence ${confidence} < ${CONFIDENCE_THRESHOLD}, falling back to Gemini`);
            } catch (err) {
                console.warn("[AI Router] Ollama failed, falling back to Gemini:", err);
            }
        } else {
            console.log("[AI Router] Ollama unavailable, using Gemini");
        }

        // Fallback to Gemini
        return generateWithGemini(prompt, jsonMode);
    }

    // Default: Gemini
    return generateWithGemini(prompt, jsonMode);
}
