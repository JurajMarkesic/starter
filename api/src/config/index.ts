export default () => ({
  mode: process.env.NODE_ENV,
  port: parseInt(process.env.API_PORT, 10) || 3000,
  database: {
    provider: process.env.DB_PROVIDER,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    synchronize: process.env.DB_RUN_MIGRATIONS,
  }
});