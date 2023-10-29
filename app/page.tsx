import React from 'react';
import { getServerSession } from 'next-auth';
import { options } from './api/auth/[...nextauth]/options';

import User from '@/models/user.model';
import Project from '@/models/project.model';
import ProjectDataRow from './components/ProjectDataRow';

export const revalidate = 60;

const ProjectName = ({ projectName }: { projectName: string }) => (
  <h3 className="text-2xl font-semibold">{projectName}</h3>
);

export default async function Home() {
  const session: any = await getServerSession(options);
  if (!session || !session.user) {
    return <div>Access Denied</div>;
  }

  const user: any = await User.findOne({ email: session.user.email }).lean();
  if (!user) return <div>Access Denied</div>;
  const projects =
    user.role === 'admin'
      ? await Project.find().lean()
      : await Project.find({
          assignedUsers: user._id,
        }).lean();
 return (
   <div>
     {projects.map((project: any) => (
       <div
         className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4 border dark:border-gray-600"
         key={project._id.toString()}
       >
         <ProjectName projectName={project.name} />
         <ProjectDataRow
           project={{
             ...project,
             _id: project._id.toString(),
             createdAt: project.createdAt.toString(),
             updatedAt: project.updatedAt.toString(),
           }}
           user={user}
         />
       </div>
     ))}
   </div>
 );
}
