import mongoose, { Document, Schema, Types } from 'mongoose';

interface IProject {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  assignedUsers: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export type ProjectDocument = IProject & Document;

const projectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    assignedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);
projectSchema.index({ name: 1 });
projectSchema.index({ createdAt: -1 });
const Project =
  mongoose.models?.Project ||
  mongoose.model<IProject>('Project', projectSchema);

export default Project;
