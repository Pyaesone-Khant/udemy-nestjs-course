import { registerAs } from "@nestjs/config";

export default registerAs(
    "jwt",
    () => ({
        secret: process.env.JWT_SECRET,
        audience: process.env.JWT_TOKEN_AUDIENCE,
        issuer: process.env.JWT_TOKEN_ISSUER,
        accessTokenTTL: parseInt(process.env.JWT_ACCESS_TOKEN_TTL ?? '3600', 10),
    })
)