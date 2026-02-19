// src/models/category/industry-model.ts
import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IIndustry extends Document {
  _id: ObjectId;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const IndustrySchema: Schema<IIndustry> = new Schema(
    {
      name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },
      isActive: {
        type: Boolean,
        default: true,
      },
    },
    { timestamps: true }
  );

const IndustryModel = mongoose.model<IIndustry>("Industry", IndustrySchema);
export default IndustryModel;
