export const EnvConfiguration = () => ({
  enviroment: process.env.NODE_ENV || 'development',
  mongodb: process.env.MONGO_DB_CONNECTION || '',
  port: Number(process.env.PORT) || 3000,
  defaultLimit: Number(process.env.DEFAULT_LIMIT) || 7,
});
