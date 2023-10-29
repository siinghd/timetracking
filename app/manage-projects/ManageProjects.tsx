import Link from 'next/link';
import { ProjectDocument } from '@/models/project.model';

interface ManageProjectProps {
  projects: ProjectDocument[];
}

const ManageProjectsComponent: React.FC<ManageProjectProps> = ({
  projects,
}) => {
return (
  <div className="container mx-auto p-4">
    <ul>
      {projects.map((project) => (
        <li
          key={project._id}
          className="mb-2 bg-white dark:bg-gray-800 p-4 rounded shadow dark:border-gray-600"
        >
          <div className="flex justify-between items-center">
            <span className="text-lg text-gray-800 dark:text-white">
              {project.name}
            </span>
            <Link
              href={`/create-project?id=${project._id}`}
              className="text-blue-500 hover:underline"
            >
              Edit
            </Link>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

};

export default ManageProjectsComponent;
