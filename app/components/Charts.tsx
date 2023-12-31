'use client';
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface IProps {
  data: any;
}

const Charts: React.FC<IProps> = ({ data }) => {
  if (!data) {
    return <p>No data available</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
      >
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />

        <Bar dataKey="hours" fill="#8884d8" radius={[5, 5, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Charts;
