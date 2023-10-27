// app/api/projects/route.ts

import { connectToDatabase } from '@/app/config/db';
import { WhereClauseProject } from '@/app/utils/WhereClause/Project.clause';
import Project from '@/models/project.model';
import { getServerSession } from 'next-auth';
import { NextRequestWithAuth } from 'next-auth/middleware';
import { type NextRequest } from 'next/server';
import { options } from '../auth/[...nextauth]/options';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const session = await getServerSession(options);
    if (session?.user.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'User not admin' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400, // Internal Server Error
      });
    }
    const body = await request.json();
    const project = new Project(body);
    await project.save();

    return new Response(JSON.stringify({ data: project }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch projects' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500, // Internal Server Error
    });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const url = new URL(req.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());

    const docsObj = new WhereClauseProject(queryParams, {});
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
