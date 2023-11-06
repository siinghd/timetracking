import { connectToDatabase } from '@/app/config/db';
import Project from '@/models/project.model';
import { getServerSession } from 'next-auth';
import { options } from '../../auth/[...nextauth]/options';
import { NextRequest } from 'next/server';
import User from '@/models/user.model';

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
        status: 403, // Forbidden
      });
    }
    const body = await request.json();

    // Fetch the current state of the project
    const currentProject = await Project.findById(params.id);

    // Update the project
    const updatedProject = await Project.findByIdAndUpdate(params.id, body, {
      new: true,
    });

    // Identify users who have been removed from the project
    const removedUsers = currentProject.assignedUsers.filter(
      (userId: string) => !updatedProject.assignedUsers.includes(userId)
    );

    // Update the assignedProjects array for each removed user
    await Promise.all(
      removedUsers.map(async (userId: string) => {
        await User.findByIdAndUpdate(
          userId,
          {
            $pull: { assignedProjects: updatedProject._id },
          },
          { new: true }
        );
      })
    );

    // Identify users who have been added to the project
    const addedUsers = updatedProject.assignedUsers.filter(
      (userId: string) => !currentProject.assignedUsers.includes(userId)
    );

    // Update the assignedProjects array for each added user
    await Promise.all(
      addedUsers.map(async (userId: string) => {
        await User.findByIdAndUpdate(
          userId,
          {
            $push: { assignedProjects: updatedProject._id },
          },
          { new: true }
        );
      })
    );

    return new Response(JSON.stringify({ project: updatedProject }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200, // OK
    });
  } catch (error: any) {
    console.error(error); // Log the actual error to the server logs
    return new Response(
      JSON.stringify({ error: `Failed to update project: ${error.message}` }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500, // Internal Server Error
      }
    );
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

    return new Response(JSON.stringify({ document: {} }), {
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
