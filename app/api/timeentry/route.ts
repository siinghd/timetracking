// app/api/projects/route.ts

import { connectToDatabase } from '@/app/config/db';
import { type NextRequest } from 'next/server';

import { WhereClauseTimeEntry } from '@/app/utils/WhereClause/TimeEntry.clause';
import TimeEntry from '@/models/timeEntry.model';
import { options } from '../auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';
import User from '@/models/user.model';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(options);
    await connectToDatabase();
    const user = await User.findOne({ email: session?.user.email });
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 401, // Unauthorized
      });
    }
    const timeEntriesData = await request.json(); // Assume timeEntriesData is an array of time entry objects

    // Prepare the data for insertion
    const timeEntries = timeEntriesData.map(
      (entryData: { project: string; hoursSpent: number }) => ({
        project: entryData.project,
        hoursSpent: entryData.hoursSpent,
        user: user._id,
      })
    );

    // Use insertMany to insert all time entries to the database
    const insertedTimeEntries = await TimeEntry.insertMany(timeEntries);

    return new Response(JSON.stringify({ insertedTimeEntries }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to save time entries' }), // Changed the error message to be more descriptive
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500, // Internal Server Error
      }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // const session = await getServerSession(options);
    // if (!session) {
    //   return new Response(JSON.stringify({ error: 'Unauthorized' }), {
    //     headers: { 'Content-Type': 'application/json' },
    //     status: 401, // Unauthorized
    //   });
    // }
    await connectToDatabase();
    const url = new URL(req.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());

    const docsObj = new WhereClauseTimeEntry(queryParams, {});
    const result = await docsObj.exec();
    return new Response(JSON.stringify({ data: { ...result } }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200, // OK
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch projects' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500, // Internal Server Error
    });
  }
}
