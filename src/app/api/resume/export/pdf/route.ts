import { NextRequest, NextResponse } from "next/server";
import type { ResumeData, ResumeConfig } from "@/types/resume";
import type { TemplateId } from "@/components/resume/templates";

export async function POST(req: NextRequest) {
    try {
        const { resumeData, config, templateId }: {
            resumeData: ResumeData;
            config: ResumeConfig;
            templateId: TemplateId;
        } = await req.json();

        // Use Puppeteer for PDF generation (server-side)
        // For now, return a placeholder response — full puppeteer integration
        // requires a running Chrome instance which is environment-dependent.
        // The client-side fallback uses window.print() with @media print styles.

        const htmlContent = buildResumeHTML(resumeData, config, templateId);

        // In production, use puppeteer:
        // const browser = await puppeteer.launch({ headless: true });
        // const page = await browser.newPage();
        // await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        // const pdf = await page.pdf({ format: 'A4', printBackground: true });
        // await browser.close();
        // return new NextResponse(pdf, { headers: { 'Content-Type': 'application/pdf', ... } });

        // For now, return the HTML for client-side printing
        return new NextResponse(htmlContent, {
            headers: {
                "Content-Type": "text/html",
                "Content-Disposition": `attachment; filename="${resumeData.personalInfo.fullName || "resume"}.html"`,
            },
        });
    } catch (err) {
        console.error("[PDF Export API]", err);
        return NextResponse.json({ error: "PDF export failed" }, { status: 500 });
    }
}

function buildResumeHTML(data: ResumeData, config: ResumeConfig, templateId: string): string {
    const { personalInfo: p, experience, education, skills, projects, certifications } = data;
    const accent = config.accentColor || "#6366f1";

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${p.fullName} - Resume</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: ${config.fontFamily || "Inter"}, sans-serif; font-size: 13px; color: #111; background: white; }
    @media print {
      body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
      @page { margin: 0; size: A4; }
    }
    .header { background: ${accent}; color: white; padding: 32px 40px; }
    .header h1 { font-size: 28px; font-weight: 700; }
    .header .contact { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 8px; font-size: 12px; opacity: 0.9; }
    .body { display: flex; }
    .sidebar { width: 220px; flex-shrink: 0; background: #f8f8f8; padding: 24px 20px; }
    .main { flex: 1; padding: 24px 32px; }
    .section-title { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: ${accent}; margin-bottom: 10px; padding-bottom: 3px; border-bottom: 1px solid ${accent}44; }
    .section { margin-bottom: 20px; }
    .exp-header { display: flex; justify-content: space-between; align-items: flex-start; }
    .exp-title { font-size: 13px; font-weight: 700; }
    .exp-company { font-size: 11px; color: #555; margin-bottom: 4px; }
    .exp-date { font-size: 10px; color: #999; white-space: nowrap; margin-left: 8px; }
    .bullet { font-size: 11px; color: #444; display: flex; gap: 6px; margin-bottom: 3px; }
    .bullet::before { content: "▸"; color: ${accent}; flex-shrink: 0; }
    .skill-group { margin-bottom: 10px; }
    .skill-cat { font-size: 10px; font-weight: 600; color: #555; margin-bottom: 3px; }
    .skill-items { font-size: 10px; color: #666; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${p.fullName}</h1>
    <div class="contact">
      ${p.email ? `<span>${p.email}</span>` : ""}
      ${p.phone ? `<span>• ${p.phone}</span>` : ""}
      ${p.location ? `<span>• ${p.location}</span>` : ""}
      ${p.linkedin ? `<span>• ${p.linkedin}</span>` : ""}
      ${p.github ? `<span>• ${p.github}</span>` : ""}
    </div>
  </div>
  <div class="body">
    <div class="sidebar">
      ${skills.length > 0 ? `
      <div class="section">
        <div class="section-title">Skills</div>
        ${skills.map((s) => `<div class="skill-group"><div class="skill-cat">${s.category}</div><div class="skill-items">${s.items.join(", ")}</div></div>`).join("")}
      </div>` : ""}
      ${education.length > 0 ? `
      <div class="section">
        <div class="section-title">Education</div>
        ${education.map((e) => `<div style="margin-bottom:10px"><div style="font-size:11px;font-weight:700">${e.institution}</div><div style="font-size:10px;color:#555">${e.degree} in ${e.field}</div><div style="font-size:10px;color:#999">${e.endDate}</div></div>`).join("")}
      </div>` : ""}
    </div>
    <div class="main">
      ${p.summary ? `<div class="section"><div class="section-title">Summary</div><p style="font-size:11px;color:#444;line-height:1.6">${p.summary}</p></div>` : ""}
      ${experience.length > 0 ? `
      <div class="section">
        <div class="section-title">Experience</div>
        ${experience.map((e) => `
          <div style="margin-bottom:14px">
            <div class="exp-header">
              <div>
                <div class="exp-title">${e.position}</div>
                <div class="exp-company">${e.company}${e.location ? ` · ${e.location}` : ""}</div>
              </div>
              <div class="exp-date">${e.startDate} – ${e.current ? "Present" : e.endDate}</div>
            </div>
            ${e.description.map((b) => `<div class="bullet">${b}</div>`).join("")}
          </div>`).join("")}
      </div>` : ""}
      ${projects.length > 0 ? `
      <div class="section">
        <div class="section-title">Projects</div>
        ${projects.map((p) => `
          <div style="margin-bottom:10px">
            <div style="font-size:12px;font-weight:700">${p.name}</div>
            <div style="font-size:11px;color:#444">${p.description}</div>
            <div style="font-size:10px;color:#888">${p.technologies.join(", ")}</div>
          </div>`).join("")}
      </div>` : ""}
    </div>
  </div>
</body>
</html>`;
}
