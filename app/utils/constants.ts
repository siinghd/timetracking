const MAX_QUERY_LIMIT = 100;
const MIN_QUERY_LIMIT = 1;

// role-specific data
const ROLE_MAP: any = {
  admin: {
    required: [],
    allowed: [],
    handler: () => {},
  },
  user: {
    required: [],
    allowed: [],
    handler: () => {},
  },
};
export { MAX_QUERY_LIMIT, MIN_QUERY_LIMIT, ROLE_MAP };
