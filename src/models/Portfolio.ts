import mongoose, { Schema, Document } from "mongoose";
import { PortfolioData } from "@/types/portfolio";

export interface IPortfolio extends Document {
    userId: string;
    name: string;
    templateId: string;
    data: PortfolioData;
    version: number;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const PortfolioSchema: Schema = new Schema(
    {
        userId: { type: String, required: true, index: true },
        name: { type: String, required: true },
        templateId: { type: String, required: true },
        data: { type: Object, required: true },
        version: { type: Number, default: 1 },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Optimize queries for listing user portfolios
PortfolioSchema.index({ userId: 1, isDeleted: 1, updatedAt: -1 });

export default mongoose.models.Portfolio || mongoose.model<IPortfolio>("Portfolio", PortfolioSchema);
