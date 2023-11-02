'use client';

import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { fetchData } from '../utils/methods';
import { ProjectDocument } from '@/models/project.model';

interface User {
  _id: string;
  email: string;
  fullName?: string;
}

interface CreateProjectProps {
  users: User[];
  project: any;
}

const CreateProjectComponent: React.FC<CreateProjectProps> = ({
  users,
  project,
}) => {
  const [name, setName] = useState<string>(project?.name || '');
  const [description, setDescription] = useState<string>(
    project?.description || ''
  );
  const [selectedUsers, setSelectedUsers] = useState<string[]>(
    project?.assignedUsers?.map((user: string) => user) || []
  );
  const [showAllUsers, setShowAllUsers] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const method = project ? 'PUT' : 'POST';
    const url = project ? `/api/projects/${project._id}` : '/api/projects';
    const response = await fetchData(url, method, {
      name,
      description,
      assignedUsers: selectedUsers,
    });

    if (response.status === 200) {
      alert(
        project
          ? 'Project updated successfully!'
          : 'Project created successfully!'
      );
    } else {
      alert('Error handling project!');
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

  const toggleShowAllUsers = () => {
    setShowAllUsers(!showAllUsers);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl sm:text-3xl mb-4">
        {project ? 'Update' : 'Create New'} Project
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-white-700 text-sm font-bold mb-2"
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
            className="block text-white-700 text-sm font-bold mb-2"
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
          <label className="block text-white-700 text-sm font-bold mb-2">
            Assign Users:
          </label>
          <div className="overflow-hidden">
            {users
              .slice(0, showAllUsers ? users.length : 5)
              .map((user, index) => (
                <div key={index} className="mb-2">
                  <input
                    type="checkbox"
                    id={`user-${index}`}
                    checked={selectedUsers.includes(user._id)}
                    value={user._id}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor={`user-${index}`} className="ml-2">
                    {user.fullName || user.email}
                  </label>
                </div>
              ))}
          </div>
          {users.length > 5 && (
            <button
              type="button"
              onClick={toggleShowAllUsers}
              className="text-blue-500 hover:underline"
            >
              {showAllUsers ? 'Show Less' : 'Show More'}
            </button>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {project ? 'Update' : 'Create'} Project
        </button>
      </form>
    </div>
  );
};

export default CreateProjectComponent;
