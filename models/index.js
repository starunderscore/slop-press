import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config(); // Load env variables

const DATABASE_URL = `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
  logging: false, // Set true for debugging queries
});

export default sequelize;
