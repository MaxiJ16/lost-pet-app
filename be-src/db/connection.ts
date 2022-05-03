import "dotenv/config";

import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "postgres",
  username: "quhxzpkvpnqdrn",
  password: process.env.DATABASE_PASSWORD,
  database: "dd4f7ka0p0t8i6",
  port: 5432,
  host: "ec2-54-160-109-68.compute-1.amazonaws.com",
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

export { sequelize };
