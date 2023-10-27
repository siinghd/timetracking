import mongoose from 'mongoose';

export async function connectToDatabase(): Promise<void> {
  if (mongoose.connection.readyState) {
    return;
  }

  try {
    const uri = process.env.MONGODB_URI!;
    await mongoose.connect(uri);
  } catch (error) {
    throw new Error(`Failed to connect to the database: ${error}`);
  }
}
