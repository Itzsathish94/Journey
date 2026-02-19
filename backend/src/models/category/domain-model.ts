import mongoose, { Schema, Document } from "mongoose";
import { Types } from 'mongoose';
export interface IDomainModel extends Document {
  _id: Types.ObjectId;
  domainName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DomainSchema: Schema<IDomainModel> = new Schema(
    {
      domainName: {
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

const DomainModel = mongoose.model<IDomainModel>("Domain", DomainSchema);
export default DomainModel;