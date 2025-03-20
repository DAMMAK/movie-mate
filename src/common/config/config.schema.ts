import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),
  DB_HOST: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION: Joi.string().default('24h'),
  // API_URL: Joi.string().required(),
  THROTTLE_TTL: Joi.number().default(60),
  THROTTLE_LIMIT: Joi.number().default(100),
});

// @IsString()
// DB_HOST: string;

// @IsNumber()
// DB_PORT: number;

// @IsString()
// DB_USERNAME: string;

// @IsString()
// DB_PASSWORD: string;

// @IsString()
// DB_DATABASE: string;
