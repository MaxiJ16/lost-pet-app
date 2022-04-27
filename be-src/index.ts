import * as express from "express";
import * as path from "path";
import * as cors from "cors";

// importamos desde controllers
import {
  checkEmailUser,
  createUser,
  findUser,
  modifiedUser,
} from "./controllers/user-controller";
import { newPassword, signInUser } from "./controllers/auth-controller";

import { authMiddleware, bodyMiddleware } from "./middleware/middleware";
import {
  createPet,
  deletePet,
  findAllPets,
  findLostPetNear,
  findUserPets,
  modifiedPet,
} from "./controllers/pet-controller";
import { createReport } from "./controllers/report-controller";

// import { createProduct } from "./controllers/users-controller";
// import { updateProfile, getProfile } from "./controllers/users-controller";

// configuramos la app
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "50mb" }));

app.use(cors());

//signup - proceso de registro

app.post("/auth", bodyMiddleware, async (req, res) => {
  const newUser = await createUser(req.body);
  res.json(newUser);
});

// signin - ingresar
app.post("/auth/token", bodyMiddleware, async (req, res) => {
  const userToken = await signInUser(req.body);
  res.json(userToken);
});

// Cuando el user olvidó su contraseña
app.post("/auth/forgot", bodyMiddleware, async (req, res) => {
  const resForgot = await newPassword(req.body);
  res.json(resForgot);
});

// Modificar usuario
app.put("/auth", bodyMiddleware, authMiddleware, async (req, res) => {
  const userToModify = await modifiedUser(req.body, req._userData.id);
  res.json(userToModify);
});

// Chequeamos si existe el email
app.post("/auth/emailCheck", bodyMiddleware, async (req, res) => {
  const useremail = await checkEmailUser(req.body);
  res.json(useremail);
});

// /me
// es un endpoint clásico que hace referencia a mi información
// Sirve para chequear que el token que me mande sea verdaero
// los token se mandan por los headers, utilizaremos el header authorization bearer
app.get("/me", authMiddleware, async (req, res) => {
  const userData = await findUser(req._userData.id);
  res.json(userData);
});

// REPORT

// create report
app.post("/report", bodyMiddleware, async (req, res) => {
  try {
    const newReport = await createReport(req.body);
    res.json(newReport);
  } catch (error) {
    console.log(error);
  }
});

// PET

//Create pet

app.post("/pet", bodyMiddleware, authMiddleware, async (req, res) => {
  try {
    const reportPet = await createPet(req.body, req._userData.id);
    res.json(reportPet);
  } catch (error) {
    console.log(error);
  }
});

//Modified pet

app.put("/pet/:petId", bodyMiddleware, authMiddleware, async (req, res) => {
  const { petId } = req.params;
  const modifPet = await modifiedPet(req.body, petId);
  res.json(modifPet);
});

// Para traer todas las mascotas
app.get("/pet", async (req, res) => {
  const allPets = await findAllPets();
  res.json(allPets);
});

// Para traer todas las mascotas de un usuario
app.get("/pet/allUserPets", authMiddleware, async (req, res) => {
  const allPetsUser = await findUserPets(req._userData.id);
  res.json(allPetsUser);
});

// Buscamos mascotas perdidas cerca de una ubicación que le pasamos por la query
app.get("/lostPetNear", async (req, res) => {
  // del query traemos lat y lng
  const { lat, lng } = req.query;

  const resNearLostPet = await findLostPetNear(lat, lng);
  res.json(resNearLostPet);
});

// Para eliminar la mascota
app.delete("/pet/:petId", authMiddleware, async (req, res) => {
  const { petId } = req.params;
  const deletedPet = await deletePet(Number(petId));
  res.json(deletedPet);
});

const ruta = path.resolve(__dirname, "../fe-dist");

app.use(express.static(ruta));

// ante cualquier get
app.get("*", (req, res) => {
  res.sendFile(ruta + "/index.html");
});

app.listen(port, () => {
  console.log(`Server corriendo en http://localhost:${port}`);
});
