import { NextRequest, NextResponse } from "next/server";
import { routeAIRequest } from "@/lib/ai-router";
import { ATS_SCORE_PROMPT } from "@/lib/ollama";
import type { ATSScore } from "@/types/resume";

export async function POST(req: NextRequest) {
    try {
        const { resumeText, jobDescription } = await req.json();

        if (!resumeText || !jobDescription) {
            return NextResponse.json({ error: "Missing resume or job description" }, { status: 400 });
        }

        const prompt = ATS_SCORE_PROMPT(resumeText, jobDescription);
        const raw = await routeAIRequest("ats_scoring", prompt, true);

        // Parse JSON response
        let score: ATSScore;
        try {
            score = JSON.parse(raw);
        } catch {
            // Try to extract JSON from response
            const match = raw.match(/\{[\s\S]*\}/);
            if (!match) throw new Error("Invalid JSON response");
            score = JSON.parse(match[0]);
        }

        // Validate and normalize
        const normalized: ATSScore = {
            score: Math.min(100, Math.max(0, Number(score.score) || 0)),
            matchedKeywords: Array.isArray(score.matchedKeywords) ? score.matchedKeywords : [],
            missingKeywords: Array.isArray(score.missingKeywords) ? score.missingKeywords : [],
            suggestions: Array.isArray(score.suggestions) ? score.suggestions : [],
            confidence: Number(score.confidence) || 0.8,
        };

        return NextResponse.json(normalized);
    } catch (err: any) {
        console.error("[ATS Score API]", err);
        const message = err?.message || "ATS scoring failed";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
