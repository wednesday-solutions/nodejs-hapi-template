import { SCOPE_TYPE } from 'utils/constants';
export const path = [
    {
        path: '/me',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.ADMIN, SCOPE_TYPE.USER],
        method: 'GET'
    },
    {
        path: '/oauth2/resources',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.ADMIN],
        method: 'POST'
    },
    {
        path: '/oauth2/resources/{resourceId}',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.ADMIN.lue],
        method: 'PATCH'
    },
    {
        path: '/oauth2/resources/{resourceId}',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.ADMIN, SCOPE_TYPE.USER],
        method: 'GET'
    },
    {
        path: '/oauth2/resources',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.ADMIN, SCOPE_TYPE.USER],
        method: 'GET'
    },
    {
        path: '/oauth2/scopes',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.ADMIN],
        method: 'POST'
    },
    {
        path: '/oauth2/scopes/{scopeId}',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.ADMIN, SCOPE_TYPE.USER],
        method: 'GET'
    },
    {
        path: '/oauth2/scopes',
        scopes: [SCOPE_TYPE.SUPER_ADMIN, SCOPE_TYPE.ADMIN, SCOPE_TYPE.USER],
        method: 'GET'
    },
    {
        path: '/oauth2/clients',
        scopes: [SCOPE_TYPE.INTERNAL_SERVICE, SCOPE_TYPE.SUPER_ADMIN],
        method: 'POST'
    },
    {
        path: '/oauth2/clients',
        scopes: [
            SCOPE_TYPE.INTERNAL_SERVICE,
            SCOPE_TYPE.SUPER_ADMIN,
            SCOPE_TYPE.ADMIN,
            SCOPE_TYPE.USER
        ],
        method: 'POST'
    }
];
