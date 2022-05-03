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

console.log(process.env.SENDGRID_API);
console.log(process.env.DATABASE_USERNAME);
console.log(process.env.DATABASE_PASSWORD);
console.log(process.env.DATABASE_PORT);
console.log(process.env.DATABASE_HOST);
console.log(process.env.DATABASE_DATABASE);
console.log(process.env.CLOUDINARY_API_KEY);
console.log(process.env.ALGOLIA_API_KEY);


sequelize.authenticate();

export { sequelize  };
