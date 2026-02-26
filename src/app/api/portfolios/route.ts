import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Portfolio from "@/models/Portfolio";

// GET /api/portfolios - List all portfolios for the current user
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const portfolios = await Portfolio.find({
            userId: session.user.id,
            isDeleted: false,
        }).sort({ updatedAt: -1 });

        return NextResponse.json(portfolios);
    } catch (error) {
        console.error("[Portfolios GET]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// POST /api/portfolios - Create a new portfolio
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { name, templateId, data } = await req.json();

        if (!name || !templateId || !data) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        await connectDB();
        const portfolio = await Portfolio.create({
            userId: session.user.id,
            name,
            templateId,
            data,
        });

        return NextResponse.json(portfolio, { status: 201 });
    } catch (error) {
        console.error("[Portfolios POST]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
