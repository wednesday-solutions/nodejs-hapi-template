import { findAllSubjects, findOneSubject } from 'daos/subjectsDao';

module.exports = [
    {
        method: 'GET',
        path: '/{subjectId}',
        options: {
            description: 'get one subject by ID',
            notes: 'GET subject API',
            tags: ['api', ' subjects'],
            cors: true,
            auth: false
        },
        handler: async request => {
            const subjectId = request.params.subjectId;
            console.log({ subjectId });
            return findOneSubject(subjectId);
        }
    },
    {
        method: 'GET',
        path: '/',
        options: {
            description: 'get all subjects',
            notes: 'GET all subjects API',
            tags: ['api', ' subjects'],
            cors: true,
            auth: false,
            plugins: {
                pagination: {
                    enabled: true
                },
                query: {
                    pagination: true
                }
            }
        },
        handler: async (request, h) => {
            const where = {};
            if (request.query.name) {
                where.name = request.query.name;
            }
            const { totalCount, results } = await findAllSubjects(
                where,
                request.query.page,
                request.query.limit
            );
            return h.response({ totalCount, results });
        }
    }
];
