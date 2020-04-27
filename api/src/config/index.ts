export default () => ({
  mode: process.env.NODE_ENV,
  port: parseInt(process.env.APP_PORT, 10) || 3000,
  database: {
    provider: process.env.DB_PROVIDER,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    synchronize: process.env.DB_RUN_MIGRATIONS,
  },
  cache: {
    port: parseInt(process.env.CACHE_PORT) || 6379,
    ttl: process.env.CACHE_TTL,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    ttl: process.env.JWT_TTL,
  },
});
