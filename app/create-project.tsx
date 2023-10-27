// pages/create-project.tsx

import fetchData from './utils/methods';

const CreateProject: React.FC = async () => {
  const users = fetchData('/api/users');
  console.log(users);
  return (
    <div>
      <h1>Create Project</h1>
    </div>
  );
};

export default CreateProject;
