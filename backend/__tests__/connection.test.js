// Example of a Jest test for connection
const pool = require("../src/config/db");

afterAll(async () => {
  await pool.end();
});

test("Database connection", async () => {
  const client = await pool.connect();
  expect(client).toBeDefined();
  expect(pool.options.database).toBe("connections-app-v2");
  client.release();
});
