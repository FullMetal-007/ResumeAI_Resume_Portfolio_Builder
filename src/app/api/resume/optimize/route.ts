import { NextRequest, NextResponse } from "next/server";
import { generateWithGemini } from "@/lib/gemini";
import type { ResumeData } from "@/types/resume";

export async function POST(req: NextRequest) {
    try {
        const { resumeData }: { resumeData: ResumeData } = await req.json();

        const prompt = `You are a senior career coach and resume expert.

Optimize the following resume data to:
1. Rewrite all experience bullet points with strong action verbs and quantified impact
2. Improve the professional summary to be compelling and keyword-rich
3. Ensure all descriptions are concise (under 25 words per bullet)
4. Add measurable metrics where possible (%, $, numbers)

Return the COMPLETE resume data as JSON in the EXACT same structure as the input.
Only modify: personalInfo.summary, experience[].description

Input resume data:
${JSON.stringify(resumeData, null, 2)}

Return ONLY valid JSON matching the exact input structure.`;

        const raw = await generateWithGemini(prompt, true);

        let optimized: ResumeData;
        try {
            optimized = JSON.parse(raw);
        } catch {
            const match = raw.match(/\{[\s\S]*\}/);
            if (!match) throw new Error("Invalid JSON response from AI");
            optimized = JSON.parse(match[0]);
        }

        // Merge: only update summary and experience descriptions
        const result: ResumeData = {
            ...resumeData,
            personalInfo: {
                ...resumeData.personalInfo,
                summary: optimized.personalInfo?.summary || resumeData.personalInfo.summary,
            },
            experience: resumeData.experience.map((exp, i) => ({
                ...exp,
                description: optimized.experience?.[i]?.description || exp.description,
            })),
        };

        return NextResponse.json(result);
    } catch (err: any) {
        console.error("[Resume Optimize API]", err);
        const message = err?.message || "AI optimization failed";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
