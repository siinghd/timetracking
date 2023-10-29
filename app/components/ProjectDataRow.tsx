import React from 'react';
import { formatChartData, getData } from '../utils/methods';
import { Bar, BarChart } from 'recharts';
import Charts from './Charts';

const ProjectDataRow = async ({
  project,
  user,
}: {
  project: any;
  user: any;
}) => {
  const isAdmin = user.role === 'admin';
  const rawData = await getData(user.email, project._id, isAdmin);
  if (
    rawData.weeklyData.length === 0 &&
    rawData.monthlyData.length === 0 &&
    rawData.allTimeData.length === 0
  ) {
    return <p>No data available</p>;
  }

  const week = formatChartData(rawData.weeklyData, isAdmin);
  const month = formatChartData(rawData.monthlyData, isAdmin);
  const allTime = formatChartData(rawData.allTimeData, isAdmin);

  return (
    week.data.length > 0 &&
    month.data.length > 0 &&
    allTime.data.length > 0 && (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        {/* Week */}
        <div className="bg-white dark:bg-gray-800 p-4 border rounded shadow dark:border-gray-600">
          <Charts data={week.data} />
          <p className="mt-2 text-center font-semibold">
            Total Hours (Weekly): {week.totalHours}
          </p>
        </div>

        {/* Month */}
        <div className="bg-white dark:bg-gray-800 p-4 border rounded shadow dark:border-gray-600">
          <Charts data={month.data} />
          <p className="mt-2 text-center font-semibold">
            Total Hours (Monthly): {month.totalHours}
          </p>
        </div>

        {/* All Time */}
        <div className="bg-white dark:bg-gray-800 p-4 border rounded shadow dark:border-gray-600">
          <Charts data={allTime.data} />
          <p className="mt-2 text-center font-semibold">
            Total Hours (All Time): {allTime.totalHours}
          </p>
        </div>
      </div>
    )
  );
};

export default ProjectDataRow;
