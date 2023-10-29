// app/api/projects/route.ts

import { connectToDatabase } from '@/app/config/db';
import { type NextRequest } from 'next/server';
import { WhereClauseUser } from '@/app/utils/WhereClause/User.clause';
import { getServerSession } from 'next-auth';
import { options } from '../auth/[...nextauth]/options';

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

    const docsObj = new WhereClauseUser(queryParams);
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
