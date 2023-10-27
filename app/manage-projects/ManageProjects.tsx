// pages/manage-projects.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Project from '../models/Project';

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch projects from your database
    const fetchProjects = async () => {
      try {
        const projectsList = await Project.find();
        setProjects(projectsList);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Manage Projects</h1>
      <Link href="/create-project">
        <a className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4 inline-block">
          Create New Project
        </a>
      </Link>
      {loading ? (
        <p>Loading projects...</p>
      ) : (
        <ul>
          {projects.map((project) => (
            <li key={project._id} className="mb-2">
              <div className="flex justify-between">
                <span>{project.name}</span>
                <Link href={`/edit-project/${project._id}`}>
                  <a className="text-blue-500">Edit</a>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManageProjects;
