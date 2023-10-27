import mongoose, { Document, Schema, Types } from 'mongoose';

enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

interface IUser {
  _id: Types.ObjectId;
  email: string;
  fullName?: string;
  picture?: string;
  providerAccountId?: string;
  provider?: string;
  role: UserRole;
  assignedProjects: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export type UserDocument = IUser & Document;

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
    },
    picture: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    assignedProjects: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Project',
      },
    ],
    providerAccountId: {
      type: String,
    },
    provider: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
