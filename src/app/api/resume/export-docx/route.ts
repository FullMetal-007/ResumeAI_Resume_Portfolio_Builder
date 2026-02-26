import { NextRequest, NextResponse } from "next/server";
import type { ResumeData } from "@/types/resume";

function escapeXml(s: string): string {
    return (s || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

function buildDocxXml(resume: ResumeData): string {
    const { personalInfo, experience, education, skills, projects, certifications, sections } = resume;

    const heading2 = (text: string) =>
        `<w:p><w:pPr><w:pStyle w:val="Heading2"/></w:pPr><w:r><w:t>${escapeXml(text)}</w:t></w:r></w:p>`;

    const para = (text: string, bold = false, size = 20, color = "") =>
        `<w:p><w:r><w:rPr>${bold ? "<w:b/>" : ""}<w:sz w:val="${size}"/>${color ? `<w:color w:val="${color}"/>` : ""}</w:rPr><w:t xml:space="preserve">${escapeXml(text)}</w:t></w:r></w:p>`;

    const bullet = (text: string) =>
        `<w:p><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr></w:pPr><w:r><w:t>${escapeXml(text)}</w:t></w:r></w:p>`;

    const hr = () =>
        `<w:p><w:pPr><w:pBdr><w:bottom w:val="single" w:sz="6" w:space="1" w:color="CCCCCC"/></w:pBdr></w:pPr></w:p>`;

    const lines: string[] = [];

    // Header — name, title, contact
    lines.push(`<w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="36"/></w:rPr><w:t>${escapeXml(personalInfo.fullName)}</w:t></w:r></w:p>`);
    const contactParts = [personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.linkedin, personalInfo.github]
        .filter(Boolean).join("  |  ");
    if (contactParts) {
        lines.push(`<w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:sz w:val="18"/><w:color w:val="777777"/></w:rPr><w:t>${escapeXml(contactParts)}</w:t></w:r></w:p>`);
    }
    lines.push(hr());

    // Summary
    if (sections.showSummary && personalInfo.summary) {
        lines.push(heading2("Professional Summary"));
        lines.push(para(personalInfo.summary));
        lines.push(hr());
    }

    // Experience
    if (sections.showExperience && experience.length > 0) {
        lines.push(heading2("Experience"));
        for (const exp of experience) {
            lines.push(para(`${exp.company} — ${exp.position}`, true));
            const dateRange = `${exp.startDate} – ${exp.current ? "Present" : exp.endDate}${exp.location ? `  |  ${exp.location}` : ""}`;
            lines.push(para(dateRange, false, 18, "777777"));
            if (Array.isArray(exp.description)) {
                for (const d of exp.description) { if (d) lines.push(bullet(d)); }
            } else if (exp.description) {
                lines.push(para(exp.description as string));
            }
        }
        lines.push(hr());
    }

    // Education
    if (sections.showEducation && education.length > 0) {
        lines.push(heading2("Education"));
        for (const edu of education) {
            lines.push(para(`${edu.institution} — ${edu.degree} in ${edu.field}`, true));
            const eduLine = `${edu.startDate} – ${edu.endDate}${edu.gpa ? `  |  GPA: ${edu.gpa}` : ""}`;
            lines.push(para(eduLine, false, 18, "777777"));
        }
        lines.push(hr());
    }

    // Skills
    if (sections.showSkills && skills.length > 0) {
        lines.push(heading2("Skills"));
        for (const group of skills) {
            if (group.category && group.items.length > 0) {
                lines.push(para(`${group.category}: ${group.items.join(", ")}`));
            }
        }
        lines.push(hr());
    }

    // Projects
    if (sections.showProjects && projects.length > 0) {
        lines.push(heading2("Projects"));
        for (const proj of projects) {
            lines.push(para(proj.name, true));
            if (proj.description) lines.push(para(proj.description));
            if (proj.technologies.length > 0) {
                lines.push(para(`Technologies: ${proj.technologies.join(", ")}`, false, 18, "777777"));
            }
            if (proj.url) lines.push(para(proj.url, false, 18, "4f46e5"));
        }
        lines.push(hr());
    }

    // Certifications
    if (sections.showCertifications && certifications.length > 0) {
        lines.push(heading2("Certifications"));
        for (const cert of certifications) {
            lines.push(para(`${cert.name} — ${cert.issuer} (${cert.date})`, false));
        }
    }

    return lines.join("\n");
}

function buildDocxPackage(bodyXml: string): ArrayBuffer {
    const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/>
</Types>`;

    const relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

    const wordRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/>
</Relationships>`;

    const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
${bodyXml}
    <w:sectPr>
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar w:top="1080" w:right="1080" w:bottom="1080" w:left="1080"/>
    </w:sectPr>
  </w:body>
</w:document>`;

    const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:style w:type="paragraph" w:styleId="Heading2">
    <w:name w:val="heading 2"/>
    <w:pPr><w:spacing w:before="200" w:after="80"/></w:pPr>
    <w:rPr><w:b/><w:sz w:val="26"/><w:color w:val="4f46e5"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal">
    <w:name w:val="Normal"/>
    <w:pPr><w:spacing w:after="100" w:line="276" w:lineRule="auto"/></w:pPr>
    <w:rPr><w:sz w:val="20"/></w:rPr>
  </w:style>
</w:styles>`;

    const numberingXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:numbering xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:abstractNum w:abstractNumId="0">
    <w:lvl w:ilvl="0">
      <w:start w:val="1"/><w:numFmt w:val="bullet"/>
      <w:lvlText w:val="•"/><w:lvlJc w:val="left"/>
      <w:pPr><w:ind w:left="360" w:hanging="360"/></w:pPr>
    </w:lvl>
  </w:abstractNum>
  <w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num>
</w:numbering>`;

    const files = [
        { path: "[Content_Types].xml", content: contentTypesXml },
        { path: "_rels/.rels", content: relsXml },
        { path: "word/_rels/document.xml.rels", content: wordRelsXml },
        { path: "word/document.xml", content: documentXml },
        { path: "word/styles.xml", content: stylesXml },
        { path: "word/numbering.xml", content: numberingXml },
    ];

    function uint16LE(n: number): number[] { return [n & 0xff, (n >> 8) & 0xff]; }
    function uint32LE(n: number): number[] { return [n & 0xff, (n >> 8) & 0xff, (n >> 16) & 0xff, (n >> 24) & 0xff]; }
    function crc32(bytes: number[]): number {
        const table: number[] = [];
        for (let i = 0; i < 256; i++) {
            let c = i;
            for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
            table[i] = c;
        }
        let crc = 0xffffffff;
        for (const b of bytes) crc = table[(crc ^ b) & 0xff] ^ (crc >>> 8);
        return (crc ^ 0xffffffff) >>> 0;
    }
    function strToBytes(s: string): number[] {
        const out: number[] = [];
        for (let i = 0; i < s.length; i++) {
            const code = s.charCodeAt(i);
            if (code < 128) out.push(code);
            else if (code < 2048) out.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
            else out.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
        }
        return out;
    }

    const entries: Array<{ pathBytes: number[]; dataBytes: number[]; crc: number; offset: number }> = [];
    const localParts: number[] = [];
    let offset = 0;

    for (const f of files) {
        const pathBytes = strToBytes(f.path);
        const dataBytes = strToBytes(f.content);
        const crc = crc32(dataBytes);
        const localHeader = [
            0x50, 0x4b, 0x03, 0x04, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            ...uint32LE(crc), ...uint32LE(dataBytes.length), ...uint32LE(dataBytes.length),
            ...uint16LE(pathBytes.length), 0, 0,
        ];
        entries.push({ pathBytes, dataBytes, crc, offset });
        offset += localHeader.length + pathBytes.length + dataBytes.length;
        for (const b of localHeader) localParts.push(b);
        for (const b of pathBytes) localParts.push(b);
        for (const b of dataBytes) localParts.push(b);
    }

    const cdParts: number[] = [];
    const cdStart = offset;
    for (const entry of entries) {
        const cdEntry = [
            0x50, 0x4b, 0x01, 0x02, 20, 0, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            ...uint32LE(entry.crc), ...uint32LE(entry.dataBytes.length), ...uint32LE(entry.dataBytes.length),
            ...uint16LE(entry.pathBytes.length), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            ...uint32LE(entry.offset),
        ];
        for (const b of cdEntry) cdParts.push(b);
        for (const b of entry.pathBytes) cdParts.push(b);
    }

    const eocd = [
        0x50, 0x4b, 0x05, 0x06, 0, 0, 0, 0,
        ...uint16LE(entries.length), ...uint16LE(entries.length),
        ...uint32LE(cdParts.length), ...uint32LE(cdStart), 0, 0,
    ];

    const all = [...localParts, ...cdParts, ...eocd];
    const buf = new ArrayBuffer(all.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < all.length; i++) view[i] = all[i];
    return buf;
}

export async function POST(req: NextRequest) {
    try {
        const resume: ResumeData = await req.json();
        const bodyXml = buildDocxXml(resume);
        const docxBuffer = buildDocxPackage(bodyXml);
        const name = (resume.personalInfo?.fullName || "resume").replace(/\s+/g, "_");

        return new NextResponse(docxBuffer, {
            headers: {
                "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "Content-Disposition": `attachment; filename=${name}_resume.docx`,
                "Content-Length": docxBuffer.byteLength.toString(),
            },
        });
    } catch (error) {
        console.error("[DOCX Export]", error);
        return NextResponse.json({ error: "DOCX export failed" }, { status: 500 });
    }
}
