import "dotenv/config";

export default {
  dev: {
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME || "connections-app-v2",
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
  },
  test: {
    username: process.env.TEST_DB_USERNAME || "postgres",
    password: process.env.TEST_DB_PASSWORD || null,
    database: process.env.TEST_DB_NAME || "connections-app-v2",
    host: process.env.TEST_DB_HOST || "localhost",
    dialect: "postgres",
  },
  production: {
    username: process.env.PROD_DB_USERNAME || "postgres",
    password: process.env.PROD_DB_PASSWORD || null,
    database: process.env.PROD_DB_NAME || "connections-app-v2",
    host: process.env.PROD_DB_HOST || "localhost",
    dialect: "postgres",
  },
};
