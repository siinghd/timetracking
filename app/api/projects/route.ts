// app/api/projects/route.ts

import { connectToDatabase } from '@/app/config/db';
import { WhereClauseProject } from '@/app/utils/WhereClause/Project.clause';
import Project from '@/models/project.model';
import { getServerSession } from 'next-auth';
import { type NextRequest } from 'next/server';
import { options } from '../auth/[...nextauth]/options';
import User from '@/models/user.model';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(options);

    // if (!session) {
    //   return new Response(JSON.stringify({ error: 'Unauthorized' }), {
    //     headers: { 'Content-Type': 'application/json' },
    //     status: 401, // Unauthorized
    //   });
    // }
    if (session?.user.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'User not admin' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400, // Internal Server Error
      });
    }
    await connectToDatabase();
    const body = await request.json();
    const project = new Project(body);
    await project.save();
    // Update the assignedUsers field for each user
    await User.updateMany(
      { _id: { $in: body.assignedUsers } },
      { $push: { assignedProjects: project._id } }
    );

    return new Response(JSON.stringify({ project }), {
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

    const docsObj = new WhereClauseProject(queryParams, {});
    const result = await docsObj.exec();
    return new Response(JSON.stringify({ documen: { ...result } }), {
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
