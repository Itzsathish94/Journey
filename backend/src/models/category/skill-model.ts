// src/models/category/skill-model.ts
import mongoose, { Schema, Document } from "mongoose";
import { IDomainModel } from "./domain-model";
import { Types } from 'mongoose';

// Base interface (domainId is just ObjectId)
export interface ISkillModel extends Document {
  _id: Types.ObjectId;
  skillName: string;
  domainId: Types.ObjectId | string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Populated interface (domainId is full Domain object)
export interface ISkillPopulated extends Omit<ISkillModel, "domainId"> {
  domainId: IDomainModel;
}

const SkillSchema: Schema<ISkillModel> = new Schema(
  {
    skillName: { type: String, required: true, trim: true },
    domainId: { type: Schema.Types.ObjectId, ref: "Domain", required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

SkillSchema.index({ skillName: 1, domainId: 1 }, { unique: true });

const SkillModel = mongoose.model<ISkillModel>("Skill", SkillSchema);
export default SkillModel;