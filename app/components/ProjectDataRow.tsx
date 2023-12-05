import React from 'react';
import { formatChartData, formatDailyData, getData } from '../utils/methods';
import { Bar, BarChart } from 'recharts';
import Charts from './Charts';
import ChartsDaily from './ChartDaily';

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
    rawData.dailyData.length === 0 &&
    rawData.monthlyData.length === 0 &&
    rawData.allTimeData.length === 0
  ) {
    return <p>No data available</p>;
  }

  // const daily = rawData.dailyData.map((day) => ({
  //   date: day.date,
  //   ...formatChartData(day.data, isAdmin),
  // }));
  const dailyData = formatDailyData(rawData.dailyData, isAdmin);
  const month = formatChartData(rawData.monthlyData, isAdmin);
  const allTime = formatChartData(rawData.allTimeData, isAdmin);

  return (
    // daily.data.length > 0 &&
    month.data.length > 0 &&
    allTime.data.length > 0 && (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        {/* Week */}
        <div className="bg-white dark:bg-gray-800 p-4 border rounded shadow dark:border-gray-600">
          <ChartsDaily data={dailyData} />
          <p className="mt-2 text-center font-semibold">
            Total Hours (Weekly):{' '}
            {dailyData.reduce((prev, currval) => {
              return prev + currval.totalHours;
            }, 0)}
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
