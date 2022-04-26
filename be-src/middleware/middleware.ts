// importamos el método crypto incorporado en node, este paquete tiene la f createHash
import * as crypto from "crypto";

// importamos jsonwebtoken
import * as jwt from "jsonwebtoken";

// Secret
export const SECRET = process.env.SECRET;

//función que usa SHA-1
export function getSHA256ofString(text: string) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

// chequea el token que le pasamos en el header, en vez de responder directamente con la data invoca a next()
export function authMiddleware(req, res, next) {
  // para obtener el token hacemos un split
  // con ese split le decimos que cuando encuentre un espacio parta el texto en dos y elijamos la posición uno donde está el token
  const token = req.headers.authorization.split(" ")[1];

  // para capturar errores usamos try y catch
  // el código que está en try se evalúa, si en algún punto dispara un error entra al catch
  try {
    // desencriptamos el token con json web token y su f verify
    // como 1er parametro usa el token y segundo el SECRET
    const data = jwt.verify(token, SECRET);
    // data contiene esto
    //   {
    //     "id": 5,
    //     "iat": 1647639813
    // }
    // para que la data le llegue a /me se lo agregamos al req
    req._userData = data;
    next();
  } catch (e) {
    res.status(401).json({ error: "authorization not allowed" });
  }
}

export async function bodyMiddleware(req, res, next) {
  if (req.body) {
    next();
  } else {
    res.status(400).json("Faltan datos en el body");
  }
}

// Función para transformar un item del body a un item para el indice de algolia
// recibimos un objeto en un formato y lo devolvemos en otro formato

export function bodyToIndex(body, id?) {
  // este es nuestro objeto respuesta
  const respuesta: any = {};
  // respuesta va a tener un nombre que va a ser igual al body.nombre
  if (body.name) {
    respuesta.name = body.name;
  }
  if (body.pictureURL) {
    respuesta.pictureURL = body.pictureURL;
  }
  if (body.state) {
    respuesta.state = body.state;
  }
  if (body.last_location_lat && body.last_location_lng) {
    respuesta._geoloc = {
      lat: body.last_location_lat,
      lng: body.last_location_lng,
    };
  }
  if (body.userId) {
    respuesta.userId = body.userId;
  }
  if (id) {
    respuesta.objectID = id;
  }
  //devuelve la respuesta
  return respuesta;
}
