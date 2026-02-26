import { NextRequest, NextResponse } from "next/server";

/** Extract text from a plain-text or markdown file */
function extractTxt(buffer: ArrayBuffer): string {
    return new TextDecoder("utf-8").decode(buffer);
}

/**
 * Extract text from a DOCX file (Office Open XML).
 * A DOCX is a ZIP archive — we find word/document.xml and strip XML tags.
 */
function extractDocx(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    const text = new TextDecoder("latin1").decode(bytes);

    // Find word/document.xml inside the ZIP by looking for its content
    // We search for the XML content between <w:body> tags
    const xmlStart = text.indexOf("<w:body");
    const xmlEnd = text.indexOf("</w:body>");
    if (xmlStart === -1 || xmlEnd === -1) {
        // Fallback: try to find any readable text between XML tags
        return text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    }

    const bodyXml = text.slice(xmlStart, xmlEnd + 9);
    // Extract text from <w:t> tags (Word text runs)
    const textRuns: string[] = [];
    const wTRegex = /<w:t[^>]*>([^<]*)<\/w:t>/g;
    let match;
    while ((match = wTRegex.exec(bodyXml)) !== null) {
        if (match[1].trim()) textRuns.push(match[1]);
    }

    // Also handle paragraph breaks
    const result = bodyXml
        .replace(/<w:p[ >]/g, "\n")
        .replace(/<w:t[^>]*>([^<]*)<\/w:t>/g, "$1")
        .replace(/<[^>]+>/g, "")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

    return result || textRuns.join(" ");
}

/**
 * Extract readable text from a PDF file.
 * PDFs store text in stream objects — we extract text between BT/ET markers
 * and decode common PDF text operators (Tj, TJ, Td, etc.)
 */
function extractPdf(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    const raw = new TextDecoder("latin1").decode(bytes);

    const textParts: string[] = [];

    // Find all text blocks between BT (begin text) and ET (end text)
    const btEtRegex = /BT([\s\S]*?)ET/g;
    let btMatch;
    while ((btMatch = btEtRegex.exec(raw)) !== null) {
        const block = btMatch[1];

        // Extract strings from Tj operator: (text)Tj
        const tjRegex = /\(([^)]*)\)\s*Tj/g;
        let tjMatch;
        while ((tjMatch = tjRegex.exec(block)) !== null) {
            const decoded = decodePdfString(tjMatch[1]);
            if (decoded.trim()) textParts.push(decoded);
        }

        // Extract strings from TJ operator: [(text) offset (text)]TJ
        const tjArrayRegex = /\[([\s\S]*?)\]\s*TJ/g;
        let tjArrMatch;
        while ((tjArrMatch = tjArrayRegex.exec(block)) !== null) {
            const inner = tjArrMatch[1];
            const strRegex = /\(([^)]*)\)/g;
            let strMatch;
            while ((strMatch = strRegex.exec(inner)) !== null) {
                const decoded = decodePdfString(strMatch[1]);
                if (decoded.trim()) textParts.push(decoded);
            }
        }

        // Add paragraph break between text blocks
        if (textParts.length > 0) textParts.push("\n");
    }

    const result = textParts
        .join(" ")
        .replace(/ \n /g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

    // If we couldn't extract much, return a helpful message
    if (result.length < 50) {
        return "Could not extract text from this PDF. Please try a text-based PDF or use TXT/DOCX format.";
    }

    return result;
}

/** Decode common PDF string escape sequences */
function decodePdfString(s: string): string {
    return s
        .replace(/\\n/g, "\n")
        .replace(/\\r/g, "\r")
        .replace(/\\t/g, "\t")
        .replace(/\\\(/g, "(")
        .replace(/\\\)/g, ")")
        .replace(/\\\\/g, "\\")
        .replace(/\\(\d{3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)));
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
        }

        const buffer = await file.arrayBuffer();
        const ext = file.name.split(".").pop()?.toLowerCase() ?? "";

        let text = "";

        if (ext === "txt" || ext === "md") {
            text = extractTxt(buffer);
        } else if (ext === "docx") {
            text = extractDocx(buffer);
        } else if (ext === "pdf") {
            text = extractPdf(buffer);
        } else {
            return NextResponse.json(
                { error: "Unsupported file type. Please upload PDF, DOCX, or TXT." },
                { status: 400 }
            );
        }

        // Trim to reasonable length for AI processing
        const trimmed = text.slice(0, 8000);

        return NextResponse.json({ text: trimmed, fileName: file.name, length: trimmed.length });
    } catch (err) {
        console.error("[Parse File API]", err);
        return NextResponse.json({ error: "File parsing failed" }, { status: 500 });
    }
}
