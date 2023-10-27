import { connectToDatabase } from '@/app/config/db';
import Project from '@/models/project.model';
import { NextApiRequest } from 'next';
import { getServerSession } from 'next-auth';
import { options } from '../../auth/[...nextauth]/options';
import { NextRequest } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<Response> {
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

    const project = await Project.findByIdAndUpdate(params.id, body, {
      new: true,
    });

    return new Response(JSON.stringify({ data: project }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200, // OK
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update project' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500, // Internal Server Error
    });
  }
}

export async function DELETE(
  request: NextRequest, // Assuming NextApiRequest is imported from 'next'
  { params }: { params: { id: string } }
): Promise<Response> {
  try {
    await connectToDatabase();
    // const admin = await verifyAdmin(request); // Assuming verifyAdmin is an async function
    // if (!admin) {
    //   return new Response(JSON.stringify({ error: 'Unauthorized' }), {
    //     headers: { 'Content-Type': 'application/json' },
    //     status: 401, // Unauthorized
    //   });
    // }
    const session = await getServerSession(options);
    if (session?.user.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'User not admin' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400, // Internal Server Error
      });
    }
    await Project.findByIdAndDelete(params.id);

    return new Response(JSON.stringify({ data: {} }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200, // OK
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to delete project' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500, // Internal Server Error
    });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const project = await Project.findById(params.id);

    return new Response(JSON.stringify({ data: project }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200, // OK
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update project' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500, // Internal Server Error
    });
  }
}
