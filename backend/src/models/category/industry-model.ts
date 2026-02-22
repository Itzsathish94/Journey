import mongoose, { Schema, Document } from "mongoose";
import {Types} from 'mongoose';

export interface IIndustryModel extends Document {
  _id:  Types.ObjectId;
  industryName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const IndustrySchema: Schema<IIndustryModel> = new Schema(
    {
      industryName: {
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

const IndustryModel = mongoose.model<IIndustryModel>("Industry", IndustrySchema);
export default IndustryModel;
