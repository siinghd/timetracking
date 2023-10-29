import mongoose, { Document, Schema, Types } from 'mongoose';

interface ITimeEntry {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  project: Types.ObjectId;
  date: Date;
  hoursSpent: number;
  createdAt: Date;
  updatedAt: Date;
}

export type TimeEntryDocument = ITimeEntry & Document;

const timeEntrySchema = new Schema<ITimeEntry>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    hoursSpent: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
timeEntrySchema.index({ user: 1, project: 1 });
timeEntrySchema.index({ user: 1 });
timeEntrySchema.index({ project: 1 });
timeEntrySchema.index({ createdAt: -1 });
timeEntrySchema.index({ hoursSpent: -1 });

const TimeEntry =
  mongoose.models?.TimeEntry ||
  mongoose.model<ITimeEntry>('TimeEntry', timeEntrySchema);

export default TimeEntry;
