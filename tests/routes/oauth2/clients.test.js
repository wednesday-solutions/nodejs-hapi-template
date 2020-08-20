/* global server */
const payload = {
    scope: 'ADMIN',
    resources: [
        {
            resource_type: 'USER_ID',
            resource_id: '2'
        }
    ],
    client_id: 'TEST_CLIENT_ID_7',
    client_secret: 'TEST_CLIENT_SECRET',
    grant_type: 'CLIENT_CREDENTIALS'
};

const responseBody = {
    oauth_client: {
        client_id: 'TEST_CLIENT_ID_7',
        grant_type: 'CLIENT_CREDENTIALS'
    },
    resources: [
        {
            id: 1,
            oauth_client_id: 1,
            resource_type: 'USER_ID',
            resource_id: '2'
        }
    ],
    scopes: {
        id: 1,
        scope: 'ADMIN',
        oauth_client_id: 1
    }
};

describe('/oauth2/clients route tests', () => {
    it('should create a client with the provided credientials and resources', async () => {
        const res = await server.inject({
            method: 'POST',
            url: '/oauth2/clients',
            payload
        });
        expect(res.statusCode).toEqual(200);
        expect(res.payload).toEqual(
            expect.stringContaining(
                JSON.stringify(responseBody.oauth_client.client_id)
            )
        );
        expect(res.payload).toEqual(
            expect.stringContaining(
                JSON.stringify(responseBody.oauth_client.grant_type)
            )
        );
        expect(res.payload).toEqual(
            expect.stringContaining(
                JSON.stringify(responseBody.resources[0].resource_id)
            )
        );
        expect(res.payload).toEqual(
            expect.stringContaining(
                JSON.stringify(responseBody.resources[0].resource_type)
            )
        );
    });
    it('should validate the parameters correctly', async () => {
        payload.scope = 1;
        const res = await server.inject({
            method: 'POST',
            url: '/oauth2/clients',
            payload
        });
        expect(res.statusCode).toEqual(400);
        expect(res.result.error).toEqual('Bad Request');
    });
});
