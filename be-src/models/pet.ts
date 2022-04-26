import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db/connection";

export class Pet extends Model {}

Pet.init(
  {
    name: DataTypes.STRING,
    pictureURL: DataTypes.STRING,
    state: DataTypes.STRING,
    last_location_lat: DataTypes.FLOAT,
    last_location_lng: DataTypes.FLOAT,
    location: DataTypes.STRING
  },
  { sequelize, modelName: "pet" }
);
