import { GRANT_TYPE } from '@utils/constants';

export default function (sequelize, DataTypes) {
  const oauthClients = sequelize.define(
    'oauth_clients',
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      clientId: {
        field: 'client_id',
        type: DataTypes.STRING(36),
        allowNull: false,
        unique: true,
      },
      clientSecret: {
        field: 'client_secret',
        type: DataTypes.STRING(36),
        allowNull: false,
      },
      grantType: {
        field: 'grant_type',
        type: DataTypes.ENUM(
          GRANT_TYPE.CLIENT_CREDENTIALS,
          GRANT_TYPE.GOOGLE_SSO,
        ),
        allowNull: false,
      },
      createdAt: {
        field: 'created_at',
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        field: 'updated_at',
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'oauth_clients',
    },
  );
  oauthClients.associate = function (models) {
    oauthClients.hasOne(models.oauthClientScopes, {
      foreignKey: 'oauth_client_id',
      sourceKey: 'id',
    });
    oauthClients.hasOne(models.users, {
      foreignKey: 'oauth_client_id',
      sourceKey: 'id',
    });
    oauthClients.hasMany(models.oauthClientResources, {
      foreignKey: 'oauth_client_id',
      sourceKey: 'id',
    });
  };
  return oauthClients;
}
