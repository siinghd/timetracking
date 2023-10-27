import Link from 'next/link';
import fetchData from '../utils/methods';

const ManageProjects = async () => {
  const data = await fetchData('/api/projects');
  console.log(data);
  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl">Manage Projects</h1>
        <Link href="/create-project">Create New Project</Link>
      </div>
    </div>
  );
};

export default ManageProjects;
