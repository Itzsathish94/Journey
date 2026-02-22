import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IUserDTO {
  username: string;
  email: string;
  password: string;
  role?: string;
}
export interface IUser extends Document {
  _id: ObjectId;
  username: string;
  email: string;
  password: string;
  role?: string;
  profilePicUrl?: string;
  isVerified: boolean;
  isBlocked: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema: Schema<IUser> = new Schema(
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
    role: {
      type: String,
      enum: ["USER", "INTERVIEWER", "ADMIN"],  
      default: "USER",
      required: false,
    },
    profilePicUrl: {
      type: String,
      required: false,
    },
    isVerified: {
      type: Boolean,
      required: false,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true },
);

const UserModel = mongoose.model<IUser>("User", userSchema);
export default UserModel;