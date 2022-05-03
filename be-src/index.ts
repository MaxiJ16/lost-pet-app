import * as express from "express";
import * as path from "path";
import * as cors from "cors";

// IMPORT CONTROLLERS
import { checkEmailUser, createUser, findUser, modifiedUser } from "./controllers/user-controller";
import { newPassword, signInUser } from "./controllers/auth-controller";
import { createPet, deletePet, findAllPets, findLostPetNear, findUserPets, modifiedPet } from "./controllers/pet-controller";
import { createReport } from "./controllers/report-controller";

// IMPORT MIDDLEWARES
import { authMiddleware, bodyMiddleware } from "./middleware/middleware";
import { connectionTest } from "./db/connection";
// ROUTES
const ruta = path.resolve(__dirname, "../fe-dist/index.html");

// CONFIG APP
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "50mb" }));
app.use(cors());

// ENDPOINTS

//
// TESTS
// TESTEA LA CONEXION A SEQUELIZE EN DEV Y PRODUCTION
app.get("/test", async (req, res) => {
  const prueba = await connectionTest();

  console.log(prueba);

  res.status(200).json({
    message: "todo ok",
    test: prueba,
    base_url: process.env.API_BASE_URL,
    secret: process.env.API_SECRET,
  });
});

app.get("/env", (req, res) => {
  res.json({
    environment: process.env.NODE_ENV,
  });
});

///// USER /////

// SIGN UP - PROCESO DE REGISTRO
app.post("/auth", bodyMiddleware, async (req, res) => {
  const newUser = await createUser(req.body);
  res.json(newUser);
});

// SIGN IN - INGRESAR
app.post("/auth/token", bodyMiddleware, async (req, res) => {
  const userToken = await signInUser(req.body);
  res.json(userToken);
});

// RECUPERAR CONTRASEÑA
app.post("/auth/forgot", bodyMiddleware, async (req, res) => {
  const resForgot = await newPassword(req.body);
  res.json(resForgot);
});

// UPDATE USER
app.put("/auth", bodyMiddleware, authMiddleware, async (req, res) => {
  const userToModify = await modifiedUser(req.body, req._userData.id);
  res.json(userToModify);
});

// CHEQUEA QUE EL EMAIL EXISTA
app.post("/auth/emailCheck", bodyMiddleware, async (req, res) => {
  const useremail = await checkEmailUser(req.body);
  res.json(useremail);
});

// MI INFORMACIÓN - CHEQUEA EL TOKEN Y LO DESENCRIPTA
app.get("/me", authMiddleware, async (req, res) => {
  const userData = await findUser(req._userData.id);
  res.json(userData);
});


///// REPORT /////

// CREATE REPORT
app.post("/report", bodyMiddleware, async (req, res) => {
  try {
    const newReport = await createReport(req.body);
    res.json(newReport);
  } catch (error) {
    console.log(error);
  }
});


///// PET /////

// CREATE PET
app.post("/pet", bodyMiddleware, authMiddleware, async (req, res) => {
  try {
    const reportPet = await createPet(req.body, req._userData.id);
    res.json(reportPet);
  } catch (error) {
    console.log(error);
  }
});

// UPDATE PET
app.put("/pet/:petId", bodyMiddleware, authMiddleware, async (req, res) => {
  const { petId } = req.params;
  const modifPet = await modifiedPet(req.body, petId);
  res.json(modifPet);
});

// DATA DE TODAS LAS MASCOTAS
app.get("/pet", async (req, res) => {
  const allPets = await findAllPets();
  res.json(allPets);
});

// DATA DE TODAS LAS MASCOTAS DE UN USUARIO
app.get("/pet/allUserPets", authMiddleware, async (req, res) => {
  const allPetsUser = await findUserPets(req._userData.id);
  res.json(allPetsUser);
});

// MASCOTAS PERDIDAS CERCA DE LA LAT Y LNG QUE LE INDICAMOS
app.get("/lostPetNear", async (req, res) => {
  const { lat, lng } = req.query;
  const resNearLostPet = await findLostPetNear(lat, lng);
  res.json(resNearLostPet);
});

// DELETE PET
app.delete("/pet/:petId", authMiddleware, async (req, res) => {
  const { petId } = req.params;
  const deletedPet = await deletePet(Number(petId));
  res.json(deletedPet);
});

app.use(express.static("fe-dist"));

// POR DEFECTO NOS LLEVA A LA PÁG PRINCIPAL
app.get("*", (req, res) => {
  res.sendFile(ruta);
});

// LISTEN SERVER
app.listen(port, () => {
  console.log(`Server corriendo en http://localhost:${port}`);
});
