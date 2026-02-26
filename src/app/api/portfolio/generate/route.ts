import { NextRequest, NextResponse } from "next/server";
import { generateWithGemini } from "@/lib/gemini";
import type { WizardData, GeneratedPortfolio } from "@/types/portfolio";

function buildPrompt(data: WizardData): string {
    const { step1, step2, step3, step4, step5 } = data;
    const projects = step4.projects
        .filter((p) => p.name)
        .map((p) => `- ${p.name}: ${p.description} (Tech: ${p.tech}${p.url ? `, URL: ${p.url}` : ""})`)
        .join("\n");

    const skills = step3.skills.split(",").map((s) => s.trim()).filter(Boolean);

    return `You are a senior Next.js developer. Generate a complete, production-ready portfolio website.

DEVELOPER INFO:
- Name: ${step1.name}
- Title: ${step1.title}
- Bio: ${step1.bio || "Passionate developer building great products"}
- Location: ${step1.location || ""}
- Email: ${step1.email || ""}
- GitHub: ${step2.github || ""}
- LinkedIn: ${step2.linkedin || ""}
- Website: ${step2.website || ""}
- Experience: ${step3.experience} years
- Specialization: ${step3.specialization || "Full-Stack Development"}
- Skills: ${skills.join(", ")}

PROJECTS:
${projects || "- Personal portfolio project"}

STYLE PREFERENCES:
- Template: ${step5.style}
- Accent Color: ${step5.colorScheme}
- Tone: ${step5.tone}

REQUIREMENTS:
1. Generate a Next.js 14 App Router project with TypeScript
2. Use Tailwind CSS for styling
3. Include Framer Motion animations
4. Make it fully responsive
5. Include SEO metadata
6. Style: ${step5.style === "developer-dark" ? "Dark terminal aesthetic with green/emerald accents, monospace fonts, code-like UI elements" : step5.style === "agency-pro" ? "Bold modern design with large hero, gradient backgrounds, professional card layouts" : "Clean minimal white design with subtle shadows, refined typography, lots of whitespace"}

Return a JSON object with this exact structure:
{
  "files": [
    {
      "path": "app/page.tsx",
      "content": "...",
      "language": "tsx"
    },
    {
      "path": "app/layout.tsx", 
      "content": "...",
      "language": "tsx"
    },
    {
      "path": "app/globals.css",
      "content": "...",
      "language": "css"
    },
    {
      "path": "components/Hero.tsx",
      "content": "...",
      "language": "tsx"
    },
    {
      "path": "components/Projects.tsx",
      "content": "...",
      "language": "tsx"
    },
    {
      "path": "components/Skills.tsx",
      "content": "...",
      "language": "tsx"
    },
    {
      "path": "components/Contact.tsx",
      "content": "...",
      "language": "tsx"
    },
    {
      "path": "package.json",
      "content": "...",
      "language": "json"
    },
    {
      "path": "tailwind.config.ts",
      "content": "...",
      "language": "ts"
    },
    {
      "path": "README.md",
      "content": "...",
      "language": "markdown"
    }
  ],
  "previewHtml": "<!DOCTYPE html>...",
  "deployConfig": {
    "framework": "nextjs",
    "buildCommand": "npm run build",
    "outputDir": ".next"
  }
}

IMPORTANT:
- The "previewHtml" field must be a complete, self-contained HTML page that visually represents the portfolio. Include all CSS inline or in a <style> tag. Make it look exactly like the final portfolio would look. Use the accent color ${step5.colorScheme}.
- All file contents must be complete, working code — no placeholders or TODOs.
- The portfolio must showcase: ${step1.name}'s projects, skills, and contact info.
- Return ONLY valid JSON, no markdown code blocks.`;
}

export async function POST(req: NextRequest) {
    try {
        const data: WizardData = await req.json();

        if (!data.step1.name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        const prompt = buildPrompt(data);
        const raw = await generateWithGemini(prompt, true);

        let result: GeneratedPortfolio;
        try {
            result = JSON.parse(raw);
        } catch {
            // Try to extract JSON
            const match = raw.match(/\{[\s\S]*\}/);
            if (!match) throw new Error("Invalid JSON response from AI");
            result = JSON.parse(match[0]);
        }

        // Validate structure
        if (!result.files || !Array.isArray(result.files)) {
            throw new Error("Invalid portfolio structure returned");
        }

        // Ensure deployConfig exists
        if (!result.deployConfig) {
            result.deployConfig = {
                framework: "nextjs",
                buildCommand: "npm run build",
                outputDir: ".next",
            };
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error("[Portfolio Generate]", error);
        return NextResponse.json(
            { error: "Failed to generate portfolio. Please try again." },
            { status: 500 }
        );
    }
}
