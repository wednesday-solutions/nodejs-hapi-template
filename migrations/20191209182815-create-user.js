const fs = require('fs');
const shell = require('shelljs');

module.exports = {
    up: async queryInterface => {
        const directories = shell.ls(`./resources/v1`);
        directories.forEach(async fileName => {
            const initialSchema = fs.readFileSync(
                `./resources/v1/${fileName}`,
                'utf-8'
            );
            try {
                await queryInterface.sequelize.query(initialSchema);
                return Promise.resolve();
            } catch (e) {
                const error = e.original.sqlMessage;
                if (
                    error.startsWith('Table') &&
                    error.endsWith('already exists')
                ) {
                    // If the database is already built add this migration to sequelizeMeta table.
                    return Promise.resolve();
                }
                return Promise.reject(e);
            }
        });
    },
    down: () => Promise.reject(new Error('error'))
};
