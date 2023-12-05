'use client';

import React, { useState } from 'react';
import { fetchData } from '../utils/methods';
import { revalidatePath } from 'next/cache';

interface TimeEntryComponentProps {
  projects: any;
}

const TimeEntryComponent: React.FC<TimeEntryComponentProps> = ({
  projects,
}) => {
  const [hoursSpent, setHoursSpent] = useState<any>({});

  const handleHoursChange = (projectId: string, hours: number) => {
    setHoursSpent({
      ...hoursSpent,
      [projectId]: hours,
    });
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const entries = projects.map((project: any) => ({
      project: project._id,
      hoursSpent: hoursSpent[project._id] || 0,
    }));
    const response = await fetchData('/api/timeentry', 'post', entries);
    if (response.status === 200) {
      alert('Time entries submitted successfully!');
      revalidatePath('/');
    } else {
      alert('Error submitting time entries!');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 md:p-8 lg:p-10"
    >
      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-6">
        Enter Time Entries
      </h2>
      {projects.map((project: any) => (
        <div
          key={project._id}
          className="mb-4 flex flex-col sm:flex-row justify-between items-center"
        >
          <div className="text-white-800 text-lg sm:text-xl font-medium mb-2 sm:mb-0 sm:w-1/2">
            {project.name}
          </div>
          <div className="w-full sm:w-1/2">
            <input
              type="number"
              placeholder="Hours Spent"
              step="0.01" // Allow floating-point values
              onChange={(e: any) =>
                handleHoursChange(project._id, e.target.value)
              }
              className="border-2 border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      ))}
      <button
        type="submit"
        className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded transition duration-200 w-full mt-4"
      >
        Submit Time Entries
      </button>
    </form>
  );
};

export default TimeEntryComponent;
