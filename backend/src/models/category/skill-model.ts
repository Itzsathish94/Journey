// src/models/category/skill-model.ts
import mongoose, { Schema, Document, ObjectId } from "mongoose";
import { IDomainModel } from "./domain-model";
import { Types } from 'mongoose';

// Base interface (domainId is just ObjectId)
export interface ISkill extends Document {
  _id: ObjectId;
  name: string;
  domainId: Types.ObjectId | string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Populated interface (domainId is full Domain object)
export interface ISkillPopulated extends Omit<ISkill, "domainId"> {
  domainId: IDomainModel;
}

const SkillSchema: Schema<ISkill> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    domainId: { type: Schema.Types.ObjectId, ref: "Domain", required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

SkillSchema.index({ name: 1, domainId: 1 }, { unique: true });

const SkillModel = mongoose.model<ISkill>("Skill", SkillSchema);
export default SkillModel;