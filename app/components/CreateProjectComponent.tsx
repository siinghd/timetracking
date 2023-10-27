import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import fetchData from '../utils/methods';

interface User {
  _id: string;
  email: string;
  fullName?: string;
  picture?: string;
}

const CreateProject: React.FC = ({ users }: { users: User[] }) => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const {data}
  useEffect(() => {
    const fetchUsers = async () => {
      const data = await fetchData('/api/users');
      setUsers(data);
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        description,
        assignedUsers: selectedUsers,
      }),
    });

    if (response.ok) {
      // Handle success
      alert('Project created successfully!');
    } else {
      // Handle error
      alert('Failed to create project. Please try again.');
    }
  };

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedUsers([...selectedUsers, event.target.value]);
    } else {
      setSelectedUsers(
        selectedUsers.filter((userId) => userId !== event.target.value)
      );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Create New Project</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Project Name:
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Description:
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Assign Users:
          </label>
          {users.map((user, index) => (
            <div key={index} className="mb-2">
              <input
                type="checkbox"
                id={`user-${index}`}
                value={user._id}
                onChange={handleCheckboxChange}
              />
              <label htmlFor={`user-${index}`} className="ml-2">
                {user.fullName || user.email}
              </label>
            </div>
          ))}
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create Project
        </button>
      </form>
    </div>
  );
};

export default CreateProject;
