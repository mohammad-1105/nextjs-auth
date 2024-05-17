import mongoose, { Schema, Document } from "mongoose";

// define types
export interface User extends Document {
  name: string;
  email: string;
  password: string;
  sessionToken: string;
  sessionTokenExpiry: Date;
  forgetPasswordToken: string;
  forgetPasswordTokenExpiry: Date;
}

// define userSchema
const userSchema: Schema<User> = new Schema(
  {
    name: { type: String, required: [true, "name is required"] },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: [true, "password is required"] },
    sessionToken: { type: String },
    sessionTokenExpiry: { type: Date },
    forgetPasswordToken: { type: String },
    forgetPasswordTokenExpiry: { type: Date },
  },
  { timestamps: true }
);

// create user model
const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", userSchema);

export default UserModel;
