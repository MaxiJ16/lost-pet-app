import { sequelize } from "./connection";
import "../models";

sequelize.sync({ alter: true }).then((res) => {
  console.log(res);
});
