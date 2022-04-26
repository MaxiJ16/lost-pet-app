import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db/connection";

export class User extends Model {}

User.init(
  {
    fullname: DataTypes.STRING,
    email: DataTypes.STRING,
  },
  { sequelize, modelName: "user" }
);
