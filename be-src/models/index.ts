// este módulo importa los modelos
import { User } from "./user";
import { Auth } from "./auth";
import { Pet } from "./pet";
import { Report } from "./report";

// Un usuario puede tener varias mascotas
User.hasMany(Pet);
Pet.belongsTo(User);

// Un usuario solo puede tener 1 Auth
User.hasOne(Auth);
Auth.belongsTo(User);

// Una mascota puede tener muchos reportes
Pet.hasMany(Report);
Report.belongsTo(Pet);

export { User, Auth, Pet, Report };
