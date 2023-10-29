// utils/buildParams.ts
import Project from '@/models/project.model';
import TimeEntry from '@/models/timeEntry.model';
import User from '@/models/user.model';
import { Types } from 'mongoose';
const dayjs = require('dayjs');
const oneWeekAgo = dayjs().subtract(7, 'day').startOf('day').toDate();
const oneMonthAgo = dayjs().subtract(1, 'month').startOf('day').toDate();
function buildParams(params: Record<string, any>, prefix: string = ''): string {
  const query: string[] = [];

  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined) continue;

    let prefixedKey = prefix ? `${prefix}[${key}]` : key;

    if (Array.isArray(value)) {
      query.push(
        ...value.map((item, index) =>
          buildParams({ [`${index}`]: item }, prefixedKey)
        )
      );
    } else if (typeof value === 'object') {
      query.push(buildParams(value, prefixedKey));
    } else {
      query.push(
        `${encodeURIComponent(prefixedKey)}=${encodeURIComponent(value)}`
      );
    }
  }

  return query.join('&');
}

async function fetchData(
  url: string,
  method: string = 'GET',
  body: Record<string, any> | null = null,
  headers: HeadersInit = {}
): Promise<{ data: any; status: number; message: string }> {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    credentials: 'include',
  };

  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_FRONT_URL}${url}`,
    options
  );

  const data = await response.json();

  const returnObject = {
    data: response.ok ? data : null,
    status: response.status,
    message: response.ok ? 'Success' : data.error || 'Failed to fetch data',
  };

  return returnObject;
}

const toPlainObject = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(toPlainObject);
  } else if (typeof obj === 'object' && obj !== null) {
    const plainObj: { [key: string]: any } = {};
    for (const key of Object.keys(obj)) {
      if (obj[key] instanceof Types.ObjectId) {
        // Replace ObjectId with the actual class you're using
        plainObj[key] = obj[key].toString();
      } else {
        plainObj[key] = toPlainObject(obj[key]);
      }
    }
    return plainObj;
  } else {
    return obj;
  }
};

const matchProject = (projectId: any) => ({
  $match: { project: projectId },
});

const matchUserProject = (userId: any, projectId: any) => ({
  $match: {
    user: userId,
    project: projectId,
  },
});

const lookupUser = {
  $lookup: {
    from: 'users',
    localField: 'user',
    foreignField: '_id',
    as: 'user',
  },
};

const unwindUser = { $unwind: '$user' };

const lookupProject = {
  $lookup: {
    from: 'projects',
    localField: 'project',
    foreignField: '_id',
    as: 'project',
  },
};

const unwindProject = { $unwind: '$project' };

const groupByUser = {
  $group: {
    _id: '$user._id',
    user: { $first: '$user' },
    hours: { $sum: '$hoursSpent' },
  },
};

const groupTotal = {
  $group: {
    _id: null,
    totalHours: { $sum: '$hours' },
    users: { $push: '$$ROOT' },
  },
};
const getTimeRangeData = async (
  userId: any,
  projectId: any,
  startDate: any,
  isAdmin: any
) => {
  let pipeline;
  if (isAdmin) {
    pipeline = [
      matchProject(projectId),
      lookupUser,
      unwindUser,
      lookupProject,
      unwindProject,
      groupByUser,
      groupTotal,
    ];
  } else {
    pipeline = [
      matchUserProject(userId, projectId),
      lookupProject,
      unwindProject,
      groupByUser,
    ];
  }

  pipeline.unshift({
    $match: { createdAt: { $gte: startDate } },
  });

  return await TimeEntry.aggregate(pipeline);
};
const getAdminAllTimeData = async (projectId: any) => {
  let pipeline;

  pipeline = [
    matchProject(projectId),
    lookupUser,
    unwindUser,
    lookupProject,
    unwindProject,
    groupByUser,
    groupTotal,
  ];

  return await TimeEntry.aggregate(pipeline);
};

const getUserAllTimeData = async (userId: any, projectId: any) => {
  let pipeline;

  pipeline = [
    matchUserProject(userId, projectId),
    lookupProject,
    unwindProject,
    groupByUser,
  ];

  return await TimeEntry.aggregate(pipeline);
};

const getData = async (
  useremail: string,
  projectIdStr: string,
  isAdmin = true
) => {
  const projectId = new Types.ObjectId(projectIdStr);
  const user: any = await User.findOne({ email: useremail });
  if (!user) throw new Error('User not found');
  const userId = user._id;

  const weeklyData = await getTimeRangeData(
    userId,
    projectId,
    oneWeekAgo,
    isAdmin
  );
  const monthlyData = await getTimeRangeData(
    userId,
    projectId,
    oneMonthAgo,
    isAdmin
  );

  let allTimeData;
  if (isAdmin) {
    allTimeData = await getAdminAllTimeData(projectId);
  } else {
    allTimeData = await getUserAllTimeData(userId, projectId);
  }

  return { weeklyData, monthlyData, allTimeData };
};
const formatChartData = (rawData: any, isAdmin: any) => {
  let data;

  if (isAdmin) {
    // Admin format as before
    data = rawData[0].users.map((u: any) => ({
      name: u.user.fullName,
      hours: u.hours,
    }));
  } else {
    // For non-admin, single data point
    data = [
      {
        name: 'You',
        hours: rawData[0].hours,
      },
    ];
  }

  return {
    data,
    totalHours: isAdmin ? rawData[0].totalHours : rawData[0].hours,
  };
};
export { buildParams, fetchData, toPlainObject, formatChartData, getData };
