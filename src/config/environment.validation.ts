import * as Joi from "joi"

export default Joi.object({
    NODE_ENV: Joi.string()
        .valid("development", "production", "test", "provision")
        .default("development"),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().port().default(5432),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_NAME: Joi.string().required(),
    PROFILE_API_KEY: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
    JWT_ACCESS_TOKEN_TTL: Joi.number().required().default(3600),
    JWT_TOKEN_AUDIENCE: Joi.string().required(),
    JWT_TOKEN_ISSUER: Joi.string().required(),
})