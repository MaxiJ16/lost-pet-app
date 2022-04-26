import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "postgres",
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: "dd4f7ka0p0t8i6",
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

sequelize.authenticate()

export { sequelize };