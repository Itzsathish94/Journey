import mongoose, { Schema, Document } from "mongoose";
import { ObjectId } from "mongodb";
import { Roles } from "../utils/enum";
import bcrypt from 'bcrypt';


export interface IUserDTO {
  name: string;
  email: string;
  password?: string;
  mobile?: string;
  totalExperience?: number;
  designation?: string;
  experienceCertificateURL?: string;
}

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  mobile?: string;
  password?: string;
  role: Roles;
  profilePicUrl?: string;
  googleId?: string;
  isBlocked: boolean;
  isSubscribed:boolean;
  subscriptionId?:string;
  isVerified: boolean;
  totalExperience?:number;
  designation?:string;
  experienceCertificateURL?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword?(password: string): Promise<boolean>;
}



const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: false },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(Roles), required: true, default: Roles.USER },
    profilePicUrl: {
      type: String,
      required: false,
      default: "https://freesvg.org/img/abstract-user-flat-4.png",
    },
    googleId:{type:String, required:false, unique:true, sparse:true},
    isBlocked: { type: Boolean, required: false, default: false },
    isSubscribed: { type: Boolean, required: false, default: false },
    subscriptionId:{type:String,required:false},
    isVerified: { type: Boolean, default: false },
    totalExperience:{type:Number , required:false, min:0},
    designation:{type:String, required:false},
    experienceCertificateURL: {type:String, required: false}
  },
  {
    timestamps: true,
  }
);

UserSchema.pre('save',async function (next){
  if(this.password && this.isModified('password')){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
  }
  next();
});

UserSchema.methods.comparePassword = async function (password:string){
  if(!this.password){
    throw new Error('No password set for this user')
  }
  return bcrypt.compare(password, this.password);
};


const User = mongoose.model<IUser>("User", UserSchema);

export default User;