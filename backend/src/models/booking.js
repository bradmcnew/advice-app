"use strict";

import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Booking extends Model {
    static associate(models) {
      Booking.belongsTo(models.UserProfile, {
        as: "student",
        foreignKey: "student_id",
      });

      Booking.belongsTo(models.UserProfile, {
        as: "mentor",
        foreignKey: "mentor_id",
      });
    }
  }

  Booking.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      student_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "user_profiles",
          key: "id",
        },
      },
      mentor_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "user_profiles",
          key: "id",
        },
      },
      status: {
        type: DataTypes.ENUM("pending", "confirmed", "cancelled"),
        defaultValue: "pending",
        allowNull: false,
      },
      confirmed_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Booking",
      tableName: "bookings",
      timestamps: true,
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Booking;
};
