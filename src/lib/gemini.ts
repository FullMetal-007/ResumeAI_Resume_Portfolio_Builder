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
    const apiKey = process.env.GEMINI_API_KEY;
    const isPlaceholder = !apiKey || apiKey.includes("your_") || apiKey === "placeholder";

    if (isPlaceholder) {
        console.warn("[Gemini AI] Using Prototype Mode mock responses.");
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate lattice

        if (prompt.includes("optimize the following resume")) {
            // Mock optimized resume response
            return JSON.stringify({
                personalInfo: {
                    summary: "Versatile developer with a strong foundation in modern web technologies and a track record of delivering high-impact solutions. Expert at bridging the gap between design and scalable architecture."
                },
                experience: [
                    { description: ["Architected a microservices-based architecture that scaled to 100k+ users.", "Optimized frontend performance reducing bundle size by 45%.", "Led a team of 4 engineers to deliver the core platform features on schedule."] }
                ]
            });
        }

        if (prompt.includes("complete, production-ready portfolio website")) {
            // Mock portfolio generation response
            return JSON.stringify({
                files: [
                    { path: "app/page.tsx", content: "export default function Home() { return <div>Mock Portfolio</div> }", language: "tsx" }
                ],
                previewHtml: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <style>
                            body { background: #0d1117; color: white; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
                            .card { text-align: center; padding: 40px; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; background: rgba(255,255,255,0.02); }
                            h1 { color: #10b981; margin: 0 0 10px 0; }
                            p { opacity: 0.6; }
                        </style>
                    </head>
                    <body>
                        <div class="card">
                            <h1>Prototype Mode Active</h1>
                            <p>This is a simulated portfolio generation for demonstration purposes.</p>
                        </div>
                    </body>
                    </html>
                `,
                deployConfig: { framework: "nextjs", buildCommand: "npm run build", outputDir: ".next" }
            });
        }

        return jsonMode ? "{}" : "Mock AI response for prototype mode.";
    }

    const model = jsonMode ? geminiModelJSON : geminiModel;
    const result = await model.generateContent([
        { text: SYSTEM_PROMPT },
        { text: prompt },
    ]);
    return result.response.text();
}
