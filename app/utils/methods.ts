// utils/buildParams.ts

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

// utils/fetchData.ts

async function fetchData(
  url: string,
  method: string = 'GET',
  body: Record<string, any> | null = null,
  headers: HeadersInit = {}
): Promise<any> {
  // Set up the options for the fetch request
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    credentials: 'same-origin',
  };

  // If a body is provided and the method is not GET, add the body to the options
  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }

  // Make the fetch request
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_FRONT_URL}${url}`,
    options
  );

  // If the response is not ok, throw an error
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch data');
  }

  // Parse and return the JSON from the response
  return response.json();
}

export default fetchData;

export { buildParams, fetchData };
