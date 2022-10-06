import JoiBase from 'joi';
import JoiDate from '@hapi/joi-date';
import seedData from './seedData';
import { GRANT_TYPE } from './constants';

const Joi = JoiBase.extend(JoiDate);

export const idAllowedSchema = Joi.number().min(1).required();

export const idOptionalSchema = Joi.number().min(1).optional();

export const tokenSchema = Joi.string();

export const dateOptionalSchema = Joi.date().iso().optional().raw();

export const urlSchema = Joi.string().uri();

export const metadataSchema = Joi.object();

export const scopeAllowedSchema = Joi.string().valid(
  ...Object.keys(seedData.SCOPE_TYPE),
);

export const stringSchema = Joi.string().required();

export const stringSchemaOptional = Joi.string().optional();

export const emailAllowedSchema = Joi.string().email({ tlds: { allow: true } });

export const grantTypeSchema = Joi.string()
  .trim()
  .required()
  .valid(GRANT_TYPE.CLIENT_CREDENTIALS);

export const clientCredentialsSchema = Joi.string()
  .trim()
  .required()
  .min(8)
  .max(32);

export const emailSchema = Joi.string().email({ tlds: { allow: true } });

export const dateAllowedSchema = Joi.date();

export const numberSchema = Joi.number();

export const statusSchema = Joi.binary().length(2);

export const versionStatusSchema = Joi.number().integer().min(0).max(2);
export const idOrUUIDAllowedSchema = [Joi.string(), Joi.number()];
export const oneOfAllowedScopes = Joi.string()
  .valid(
    seedData.SCOPE_TYPE.ADMIN,
    seedData.SCOPE_TYPE.SUPER_ADMIN,
    seedData.SCOPE_TYPE.USER,
  )
  .required();
export const stringAllowedSchema = Joi.string().required();

export const numberAllowedSchema = Joi.number();
