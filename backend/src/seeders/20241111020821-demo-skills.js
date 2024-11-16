import { v4 as uuidv4 } from "uuid"; // Import the uuid package to generate UUIDs

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    // Insert sample data into the 'skills' table with UUIDs
    await queryInterface.bulkInsert(
      "skills",
      [
        {
          id: uuidv4(),
          name: "JavaScript",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: uuidv4(),
          name: "Python",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: uuidv4(),
          name: "Ruby",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: uuidv4(),
          name: "Java",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: uuidv4(),
          name: "SQL",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    // Revert the inserted data by deleting from the 'skills' table
    await queryInterface.bulkDelete("skills", null, {});
  },
};
