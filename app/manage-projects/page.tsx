import Link from 'next/link';
import { connectToDatabase } from '../config/db';
import Project from '@/models/project.model';

import { toPlainObject } from '../utils/methods';
import ManageProjectsComponent from './ManageProjects';

export const revalidate = 60;

const ManageProjects = async ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  await connectToDatabase();
  const projects = await Project.find({}).lean();

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-2 sm:mb-0">
          Manage Projects
        </h1>
        <Link
          href="/create-project"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded sm:ml-2"
        >
          Create New Project
        </Link>
      </div>
      <ManageProjectsComponent projects={toPlainObject(projects)} />
    </div>
  );
};

export default ManageProjects;
