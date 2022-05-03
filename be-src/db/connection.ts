import "dotenv/config";
import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "postgres",
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DATABASE,
  port: 5432,
  host: process.env.DATABASE_HOST,
  ssl: true,
  // esto es necesario para que corra correctamente
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

sequelize.authenticate();

// TESTEA LA CONEXION A SEQUALIZE
async function connectionTest() {
  try {
    await sequelize.authenticate();
    return "Connection has been established successfully.";
  } catch (error) {
    console.error("Unable to connect to the database:", error);

    return "Unable to connect to the database";
  }
}

export { sequelize, connectionTest };
