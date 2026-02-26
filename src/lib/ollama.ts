const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const MODEL = "llama3:8b-instruct";

interface OllamaResponse {
    model: string;
    response: string;
    done: boolean;
}

export async function isOllamaAvailable(): Promise<boolean> {
    try {
        const res = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
            signal: AbortSignal.timeout(2000),
        });
        return res.ok;
    } catch {
        return false;
    }
}

export async function generateWithOllama(prompt: string): Promise<{ text: string; confidence: number }> {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            model: MODEL,
            prompt,
            stream: false,
            options: {
                temperature: 0.3,
                top_p: 0.9,
                num_predict: 2048,
            },
        }),
        signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
        throw new Error(`Ollama error: ${response.statusText}`);
    }

    const data: OllamaResponse = await response.json();

    // Estimate confidence based on response quality indicators
    const text = data.response.trim();
    const confidence = estimateConfidence(text);

    return { text, confidence };
}

function estimateConfidence(text: string): number {
    // Simple heuristics for confidence estimation
    if (text.length < 20) return 0.3;
    if (text.includes("I don't know") || text.includes("I cannot")) return 0.4;
    if (text.length > 100 && !text.includes("error")) return 0.9;
    return 0.75;
}

export const BULLET_REWRITE_PROMPT = (bullet: string) => `You are a professional resume optimizer.

Rewrite the following resume bullet point to:
- Add measurable impact with specific numbers/percentages where possible
- Use a strong action verb at the start
- Keep it under 25 words
- Maintain technical accuracy

Bullet: ${bullet}

Return ONLY the improved bullet point, nothing else.`;

export const ATS_SCORE_PROMPT = (resumeText: string, jobDescription: string) => `You are an ATS (Applicant Tracking System) analyzer.

Analyze this resume against the job description and return a JSON object with:
{
  "score": <number 0-100>,
  "matchedKeywords": [<array of matched keywords>],
  "missingKeywords": [<array of important missing keywords>],
  "suggestions": [<array of improvement suggestions>],
  "confidence": <number 0-1>
}

Resume:
${resumeText}

Job Description:
${jobDescription}

Return ONLY valid JSON.`;
