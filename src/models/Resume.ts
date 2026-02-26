import mongoose, { Schema, Document, Model } from "mongoose";

export interface IResume extends Document {
    userId: string;
    name: string;
    data: Record<string, unknown>;
    config: Record<string, unknown>;
    atsScore?: number;
    starred: boolean;
    version: number;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ResumeSchema = new Schema<IResume>(
    {
        userId: { type: String, required: true, index: true },
        name: { type: String, required: true, default: "Untitled Resume" },
        data: { type: Schema.Types.Mixed, default: {} },
        config: { type: Schema.Types.Mixed, default: {} },
        atsScore: { type: Number, min: 0, max: 100 },
        starred: { type: Boolean, default: false },
        version: { type: Number, default: 1 },
        isDeleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
        // Exclude soft-deleted by default
        query: {
            find() {
                return this.where({ isDeleted: { $ne: true } });
            },
        },
    }
);

// Compound index for efficient user queries
ResumeSchema.index({ userId: 1, updatedAt: -1 });
ResumeSchema.index({ userId: 1, starred: 1 });

const Resume: Model<IResume> =
    mongoose.models.Resume ?? mongoose.model<IResume>("Resume", ResumeSchema);

export default Resume;
