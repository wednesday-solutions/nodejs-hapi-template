import { subjects } from 'models';
import sequelize from 'sequelize';

const attributes = ['id', 'name'];
export const findOneSubject = id =>
    subjects.findOne({ where: { id }, attributes });

export const findAllSubjects = async (where, page, limit) => {
    const totalCount = await subjects.count({ where });
    const results = await subjects.findAll({
        where,
        attributes,
        order: sequelize.literal('id ASC'),
        limit,
        offset: (page - 1) * limit
    });
    return {
        results,
        totalCount
    };
};
