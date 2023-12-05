'use client'
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from 'recharts';

interface UserDetail {
  name: string;
  hours: number;
}

interface ChartData {
  date: string;
  totalHours: number;
  userDetails: UserDetail[];
}

interface IProps {
  data: ChartData[];
}

const ChartsDaily: React.FC<IProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <p>No data available</p>;
  }

  const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`Date: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p
              key={`item-${index}`}
              className="intro"
            >{`${entry.name}: ${entry.value} hours`}</p>
          ))}
        </div>
      );
    }

    return null;
  };

  // Generate a stable color for each user based on their name
  const getColor = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = (hash & 0x00ffffff).toString(16).toUpperCase();
    return '#' + '00000'.substring(0, 6 - color.length) + color;
  };

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {data[0].userDetails.map((user, index) => (
          <Bar
            key={`bar-${user.name}`}
            dataKey={`userDetails[${index}].hours`}
            name={user.name}
            fill={getColor(user.name)}
            stackId="a"
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ChartsDaily;
