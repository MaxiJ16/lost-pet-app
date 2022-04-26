import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db/connection";

export class Report extends Model {}

Report.init(
  {
    reporter: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    message: DataTypes.TEXT,
  },
  { sequelize, modelName: "report" }
);
