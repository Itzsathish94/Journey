import mongoose, { Model, Schema, Document } from 'mongoose';
import { Roles } from '../utils/enum';
import { InterviewerSignup, UserSignup } from '../types/types';

export interface Iotp extends Document {
  userId?: mongoose.Types.ObjectId;
  email: string;
  otp: string;
  role: Roles;
  expiresAt: Date;
  failedAttempts: number;
  lockedOutUntil?: Date | null;
  resendCount: number;
  lastResendAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  signupData?: InterviewerSignup | UserSignup;
}

const otpSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: Object.values(Roles),
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 60 * 60 * 1000), // 1 hour
  },
  failedAttempts: { type: Number, default: 0 },
  lockedOutUntil: { type: Date, required: false }, 
  resendCount: { type: Number, default: 0 },
  lastResendAt: { type: Date, required: false },
  signupData: { type: Schema.Types.Mixed, required: false },
}, { timestamps: true });

otpSchema.index({ email: 1, role: 1 });
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const otpModel: Model<Iotp> = mongoose.model<Iotp>('otp', otpSchema);
export default otpModel;