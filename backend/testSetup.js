// Setup environment variables for testing
process.env.NODE_ENV = "test"; // Set NODE_ENV to 'test'
process.env.DB_HOST = "localhost"; // Example DB config for tests

// Example of setting up a testing DB or initializing a mock DB connection
// You might use this space to run migrations or seed data
const { sequelize } = require("./src/models/index");

// Ensure DB is set up properly for tests
beforeAll(async () => {
  await sequelize.authenticate(); // Connect to the database
  await sequelize.sync({ force: true }); // Clear and re-sync all tables
});

afterAll(async () => {
  await sequelize.close(); // Close DB connection after tests
});
