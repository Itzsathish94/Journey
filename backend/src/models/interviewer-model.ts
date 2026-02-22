
import mongoose, { Types, Document, Schema } from "mongoose";

// ✅ single source of truth (prevents enum drift)
export const DIFFICULTY_LEVELS = ["entry", "mid", "senior", "jobDescription"] as const;
export type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[number];


// Mock offering type (single domain + multiple skills/industries)
export interface IMockOffering {
  _id?: Types.ObjectId;
  domainId: Types.ObjectId;
  skillIds: Types.ObjectId[];
  industryIds: Types.ObjectId[];
  signature: string;
  difficultyLevels: {
    level: DifficultyLevel;
    price: number; // in rupees
  }[];
  isActive: boolean;
}

export interface IInterviewerModel extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  role: "USER" | "INTERVIEWER" | "ADMIN";

  //profile
  profilePicUrl?: string;
  bio?: string;
  currentDesignation:string;

  // Overall expertise (shown on profile)
  domains: Types.ObjectId[];
  skills: Types.ObjectId[];
  industries: Types.ObjectId[];

  // Mock offerings (what they actually offer)
  offerings: IMockOffering[];

  //status
  isVerified: boolean;
  isBlocked: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

// Backwards‑compat convenience type used across services/repositories
export type IInterviewer = IInterviewerModel;

const difficultyLevelSchema = new Schema(
  {
    level: {
      type: String,
      enum: DIFFICULTY_LEVELS,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const mockOfferingSchema = new Schema({
  domainId: {
    type: Schema.Types.ObjectId,
    ref: "Domain",
    required: true,
  },
  skillIds: [
    {
      type: Schema.Types.ObjectId,
      ref: "Skill",
      required: true,
    },
  ],
  industryIds: [
    {
      type: Schema.Types.ObjectId,
      ref: "Industry",
      required: true,
    },
  ],
  signature: { type: String, required: true },
  difficultyLevels: { type: [difficultyLevelSchema], required: true },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const interviewerSchema: Schema<IInterviewerModel> = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,       // ← prevents duplicates with different case
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,         // ← never return in queries by default
    },
    role: {
      type: String,
      enum: ["USER", "INTERVIEWER", "ADMIN"],
      required: true,        // ← remove default, set explicitly on create
    },
    profilePicUrl: String,
    bio: {
      type: String,
      maxlength: 500,
      trim: true,
    },
    currentDesignation: String,  // ← fixed typo

    domains: [{ type: Schema.Types.ObjectId, ref: "Domain" }],
    skills: [{ type: Schema.Types.ObjectId, ref: "Skill" }],
    industries: [{ type: Schema.Types.ObjectId, ref: "Industry" }],

    offerings: [mockOfferingSchema],

    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const InterviewerModel = mongoose.model<IInterviewerModel>(
  "INTERVIEWER",
  interviewerSchema,
);

export default InterviewerModel;


export function isInterviewer(obj: Types.ObjectId | IInterviewerModel): obj is IInterviewerModel {
  return (obj as IInterviewerModel)?.username !== undefined;
}
