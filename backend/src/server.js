import app from "./app.js"; // Import the Express application
import { sequelize } from "./models/index.js"; // Import the Sequelize instance for database connection

const PORT = process.env.PORT || 8000; // Define the port to listen on, defaulting to 8000 if not specified

// Sync the database before starting the server
// This ensures that the database schema is up-to-date with the models defined in your application
sequelize
  .sync()
  .then(() => {
    // Start the server after the database synchronization is complete
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`); // Log the server URL to the console
    });
  })
  .catch((error) => {
    // Log any errors that occur during database synchronization
    console.error("Failed to sync database:", error);
    process.exit(1); // Exit the process with an error code if the database sync fails
  });
