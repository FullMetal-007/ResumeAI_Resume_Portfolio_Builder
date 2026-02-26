import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Resume from "@/models/Resume";

// ─── GET /api/resumes — list all resumes for current user ─────────────────────
export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id?: string }).id ?? session.user.email ?? "";

    const db = await connectDB();
    if (!db) {
        return NextResponse.json({ resumes: [], source: "none" });
    }

    const resumes = await Resume.find({ userId })
        .sort({ updatedAt: -1 })
        .lean();

    return NextResponse.json({ resumes, source: "mongodb" });
}

// ─── POST /api/resumes — create or update a resume ───────────────────────────
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id?: string }).id ?? session.user.email ?? "";
    const body = await req.json();
    const { id, name, data, config, atsScore, starred } = body;

    const db = await connectDB();
    if (!db) {
        return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    let resume;

    if (id) {
        // Update existing
        resume = await Resume.findOneAndUpdate(
            { _id: id, userId },
            {
                $set: { name, data, config, atsScore, starred, updatedAt: new Date() },
                $inc: { version: 1 },
            },
            { new: true }
        );
        if (!resume) {
            return NextResponse.json({ error: "Resume not found" }, { status: 404 });
        }
    } else {
        // Create new
        resume = await Resume.create({ userId, name, data, config, atsScore, starred });
    }

    return NextResponse.json({ resume });
}
