// pages/create-project.tsx

import User from '@/models/user.model';
import CreateProjectComponent from './CreateProjectComponent';
import { toPlainObject } from '../utils/methods';
import Project, { ProjectDocument } from '@/models/project.model';
export const dynamic = 'force-dynamic';

const CreateProject = async ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  const users = await User.find({}).lean();
  const project: ProjectDocument | null = searchParams?.id
    ? await Project.findById(searchParams?.id).lean()
    : null;
return (
  <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-800">
    <div className="flex-grow p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-4">
          Create Project
        </h1>
        <CreateProjectComponent
          users={toPlainObject(users)}
          project={
            project
              ? {
                  ...project,
                  _id: project?._id?.toString(),
                }
              : null
          }
        />
      </div>
    </div>
  </div>
);

};

export default CreateProject;
