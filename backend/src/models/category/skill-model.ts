import mongoose, { Schema, Document } from "mongoose";
import { Types } from 'mongoose';


export interface ISkillModel extends Document {
  _id: Types.ObjectId;
  skillName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SkillSchema: Schema<ISkillModel> = new Schema(
  {
    skillName: { 
      type: String, 
      required: true, 
      unique: true,  
      trim: true 
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);


const SkillModel = mongoose.model<ISkillModel>("Skill", SkillSchema);
export default SkillModel;