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
    date: {
      type: Date,
      required: true,
    },
    hoursSpent: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const TimeEntry =
  mongoose.models.TimeEntry ||
  mongoose.model<ITimeEntry>('TimeEntry', timeEntrySchema);

export default TimeEntry;
