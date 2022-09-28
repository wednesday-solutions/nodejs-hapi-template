import Sequelize from 'sequelize';
// eslint-disable-next-line import/no-extraneous-dependencies
import SequelizeMock from 'sequelize-mock';
import dbConfig from '@config/db';

import oauthAccessTokens from './oauthAccessTokens';
import oauthClientResources from './oauthClientResources';
import oauthClientScopes from './oauthClientScopes';
import oauthClients from './oauthClients';
import users from './users';

let sequelize;
if (process.env.NODE_ENV === 'test') {
  sequelize = new SequelizeMock();
} else {
  // eslint-disable-next-line global-require
  const { getLogger } = require('@utils');
  sequelize = new Sequelize(dbConfig.url, {
    logging: getLogger(),
    ...dbConfig,
  });
}

// eslint-disable-next-line import/prefer-default-export
export const models = {
  oauthAccessTokens: oauthAccessTokens(sequelize, Sequelize.DataTypes),
  oauthClientResources: oauthClientResources(sequelize, Sequelize.DataTypes),
  oauthClientScopes: oauthClientScopes(sequelize, Sequelize.DataTypes),
  oauthClients: oauthClients(sequelize, Sequelize.DataTypes),
  users: users(sequelize, Sequelize.DataTypes),
};

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;
