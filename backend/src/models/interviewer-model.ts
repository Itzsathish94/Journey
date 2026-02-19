
import mongoose, { Types, Document, ObjectId, Schema } from "mongoose";
export interface IInterviewerDTO {
  username: string;
  email: string;
  password: string;
}

export interface InterviewerProfileDTO {
  _id: ObjectId;
  interviewerName: string;
  email: string;
  role: string;
  isBlocked: boolean;
  skills?: string[];
  expertise?: string[];
  status: boolean;
  bankAccountLinked: boolean;
  profilePicUrl?: string;
}

export interface IInterviewer extends Document {
  _id: ObjectId;
  username: string;
  email: string;
  password: string;
  mobileNo?: string;
  profilePicUrl?: string;
  role: "INTERVIEWER";
  isVerified: boolean;
  isBlocked: boolean;
  skills?: string[];
  expertise?: string[];
  membershipExpiryDate?: Date;
  membershipPlanId?: mongoose.Types.ObjectId;
  bankAccount?: {
    accountHolderName?: string;
    accountNumber?: string;
    ifscCode?: string;
    bankName?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IInterviewerPopulated extends IInterviewer{
  username:string;
}

const interviewerSchema: Schema<IInterviewer> = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobileNo: {
      type: String,
      required: false,
    },
    profilePicUrl: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ["USER", "INTERVIEWER", "ADMIN"],
      default: "INTERVIEWER",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    membershipExpiryDate: {
      type: Date,
    },
    membershipPlanId: {
      type: Schema.Types.ObjectId,
      ref: "MembershipPlan",
      required: false,
    },
    skills: {
      type: [String],
      default: [],
    },
    expertise: {
      type: [String],
      default: [],
    },
    bankAccount: {
      accountHolderName: { type: String, required: false },
      accountNumber: { type: String, required: false },
      ifscCode: { type: String, required: false },
      bankName: { type: String, required: false },
    },
  },
  { timestamps: true },
);

const InterviewerModel = mongoose.model<IInterviewer>(
  "INTERVIEWER",
  interviewerSchema,
);

export default InterviewerModel;


export function isInterviewer(obj: Types.ObjectId | IInterviewer): obj is IInterviewer {
  return (obj as IInterviewer)?.username !== undefined;
}
