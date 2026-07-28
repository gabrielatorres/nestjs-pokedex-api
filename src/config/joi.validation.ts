import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  MONGO_DB_CONNECTION: Joi.required(),
  PORT: Joi.number().default(3000).required(),
  DEFAULT_LIMIT: Joi.number().default(10).required(),
});
