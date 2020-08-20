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

describe('/oauth2/clients route tests', () => {
    it('should create a client with the provided credientials and resources', async () => {
        const res = await server.inject({
            method: 'POST',
            url: '/oauth2/clients',
            payload
        });
        expect(res.statusCode).toEqual(200);
        const { result } = res;
        expect(result.oauth_client.client_id).toEqual(payload.client_id);
        expect(result.oauth_client.grant_type).toEqual(payload.grant_type);
        expect(result.resources[0].resource_id).toEqual(
            payload.resources[0].resource_id
        );

        expect(result.resources[0].resource_type).toEqual(
            payload.resources[0].resource_type
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
