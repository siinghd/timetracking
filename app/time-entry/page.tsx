import { getServerSession } from 'next-auth';
import { options } from '../api/auth/[...nextauth]/options';
import User from '@/models/user.model';
import Project from '@/models/project.model';
import TimeEntryComponent from './TimeEntryComponent';

export const revalidate = 60;

const TimeEntryPage = async ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  const session = await getServerSession(options);
  if (!session || !session.user) {
    return (
      <div className="container mx-auto p-8 text-2xl text-red-600">
        Access Denied
      </div>
    );
  }

  const user: any = await User.findOne({ email: session.user.email }).lean();
  if (!user)
    return (
      <div className="container mx-auto p-8 text-2xl text-red-600">
        Access Denied
      </div>
    );

  const projects = await Project.find({
    assignedUsers: user._id,
  }).lean();

  return (
    <div className="bg-white dark:bg-gray-800">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-6 border-b-2 pb-2">
          Log Time
        </h1>
        <TimeEntryComponent
          projects={projects.map((p: any) => ({
            ...p,
            _id: p._id.toString(),
            createdAt: p.createdAt.toString(),
            updatedAt: p.updatedAt.toString(),
          }))}
        />
      </div>
    </div>
  );

};

export default TimeEntryPage;
