import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Resume from "@/models/Resume";

type Params = { params: { id: string } };

// ─── GET /api/resumes/[id] ────────────────────────────────────────────────────
export async function GET(_req: NextRequest, { params }: Params) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id?: string }).id ?? session.user.email ?? "";
    await connectDB();

    const resume = await Resume.findOne({ _id: params.id, userId }).lean();
    if (!resume) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ resume });
}

// ─── PATCH /api/resumes/[id] — partial update (star, name, etc.) ─────────────
export async function PATCH(req: NextRequest, { params }: Params) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id?: string }).id ?? session.user.email ?? "";
    const updates = await req.json();
    await connectDB();

    const resume = await Resume.findOneAndUpdate(
        { _id: params.id, userId },
        { $set: { ...updates, updatedAt: new Date() } },
        { new: true }
    );

    if (!resume) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ resume });
}

// ─── DELETE /api/resumes/[id] — soft delete ───────────────────────────────────
export async function DELETE(_req: NextRequest, { params }: Params) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id?: string }).id ?? session.user.email ?? "";
    await connectDB();

    // Soft delete — preserves data for undo/recovery
    const resume = await Resume.findOneAndUpdate(
        { _id: params.id, userId },
        { $set: { isDeleted: true } },
        { new: true }
    );

    if (!resume) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
}
