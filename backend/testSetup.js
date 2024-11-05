// Setup environment variables for testing
process.env.NODE_ENV = "test"; // Set NODE_ENV to 'test' to indicate that the environment is for testing
process.env.DB_HOST = "localhost"; // Example DB config for tests, adjust as necessary for your testing setup

// // Import Sequelize instance for database operations
// const { sequelize } = require("./src/models/index");
// const app = require("./src/app"); // Import your Express app

// let server;

// // Before all tests run
// beforeAll(async () => {
//   // Authenticate connection to ensure that the database is reachable
//   await sequelize.authenticate(); // Verify that the database connection is working

//   // Sync the database schema to ensure it is up-to-date
//   // { force: true } clears all tables and re-syncs the schema
//   await sequelize.sync({ force: true }); // Create fresh tables for testing
//   server = app.listen(); // Start the Express server
// });

// afterEach(async () => {
//   // Clean data between tests
//   await sequelize.truncate({ cascade: true, restartIdentity: true });
// });

// // After all tests are done
// afterAll(async () => {
//   if (server) {
//     console.log("Closing server");
//     await new Promise((resolve, reject) => {
//       server.close((err) => (err ? reject(err) : resolve()));
//     });
//     console.log("Server closed");
//   }
//   // Close the database connection to clean up resources
//   await sequelize.close(); // Properly close the connection to prevent open connections
// });
