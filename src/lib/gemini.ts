import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const geminiModel = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-preview-04-17",
    generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 8192,
    },
});

export const geminiModelJSON = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-preview-04-17",
    generationConfig: {
        temperature: 0.3,
        topP: 0.9,
        maxOutputTokens: 16384,
        responseMimeType: "application/json",
    },
});

export const SYSTEM_PROMPT = `You are a senior AI career strategist and full-stack portfolio architect.

Your job is to generate ATS-optimized resumes and production-ready portfolio code.

When generating a resume:
- Use quantified achievements with measurable impact
- Use strong action verbs (Led, Built, Optimized, Reduced, Increased)
- Ensure keyword alignment with the job description
- Structure clearly with professional formatting
- Provide improvement suggestions with confidence scores

When generating portfolio code:
- Generate modern, responsive Next.js 14 projects
- Use TypeScript and Tailwind CSS
- Include reusable components
- Add smooth Framer Motion animations
- Add SEO metadata
- Ensure mobile responsiveness
- Provide clean folder structure
- Output production-ready code
- Include README with deployment steps

Always output structured JSON matching the requested schema exactly.
Do not include explanations outside the JSON structure.`;

export async function generateWithGemini(prompt: string, jsonMode = true): Promise<string> {
    const model = jsonMode ? geminiModelJSON : geminiModel;
    const result = await model.generateContent([
        { text: SYSTEM_PROMPT },
        { text: prompt },
    ]);
    return result.response.text();
}
