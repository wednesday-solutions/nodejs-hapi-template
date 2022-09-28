export const ONE_USER_DATA = {
  id: 1,
  first_name: 'mac',
  last_name: 'mac',
  email: 'mac@wednesday.is',
};

export const GRANT_TYPE = {
  CLIENT_CREDENTIALS: 'CLIENT_CREDENTIALS',
};
export const TIMESTAMP = 'YYYY-MM-DD HH:mm:ss';

export const ACCESS_DENIED = 'ACCESS_DENIED';

export const SCOPE_TYPE = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
  INTERNAL_SERVICE: 'INTERNAL_SERVICE',
};
export const ADMINS = [
  SCOPE_TYPE.SUPER_ADMIN,
  SCOPE_TYPE.ADMIN,
  SCOPE_TYPE.INTERNAL_SERVICE,
];
export const SLIDING_WINDOW = 1 * 24 * 60 * 60; // days * hours * minutes * seconds *
export const INVALID_CLIENT_CREDENTIALS = 'Invalid client credentials';
export const OAUTH_CLIENT_ID = 'OAUTH_CLIENT_ID';

export const SUPER_SCOPES = [
  SCOPE_TYPE.SUPER_ADMIN,
  SCOPE_TYPE.INTERNAL_SERVICE,
];

export const GET_USER_PATH = '/users/{userId}';

export const USER_ID = 'USER_ID';

export const DEFAULT_METADATA_OPTIONS = {
  scope: SCOPE_TYPE.ADMIN,
  resourceType: OAUTH_CLIENT_ID,
};
