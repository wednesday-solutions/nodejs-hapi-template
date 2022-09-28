const fs = require('fs');
const shell = require('shelljs');

function getVersion(currentFileName) {
  let version;
  shell.ls('./migrations').forEach((item, index) => {
    if (item === currentFileName) {
      version = index + 1;
    }
  });
  return version;
}

module.exports = {
  up: async () => {},
  down: async () => {},
  async migrate(currentFileName, queryInterface) {
    const version = getVersion(
      currentFileName.split('/')[currentFileName.split('/').length - 1]
    );
    const directories = shell.ls(`./resources/v${version}`);
    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < directories.length; index++) {
      const fileName = directories[index];
      // eslint-disable-next-line no-await-in-loop
      await queryInterface.sequelize
        .query(fs.readFileSync(`./resources/v${version}/${fileName}`, 'utf-8'))
        .catch((e) => {
          const error = e.original.sqlMessage;
          if (error.startsWith('Table') && error.endsWith('already exists')) {
            // If the database is already built add this migration to sequelizeMeta table.
            return;
          }
          throw e;
        });
    }
  },
  getVersion,
};
