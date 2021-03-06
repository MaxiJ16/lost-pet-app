import { Auth } from "../models";

import { getSHA256ofString, SECRET } from "../middleware/middleware";
import { temporaryPassword } from "../lib/sendgrid";

// importamos jsonwebtoken
import * as jwt from "jsonwebtoken";

// Identifica a la persona de nuevo en el sistema xq volvió, lo que vamos a obtener a cambio es un token
export async function signInUser(userData: { email: string; password }) {
  if (!userData.email || !userData.password) {
    return { error: "Faltan datos del usuario" };
  }

  // pedimos el email y password que son el par para identificar a alguien
  const { email, password } = userData;

  // hasheamos el password que nos pasan por el body
  const passwordHasheado = getSHA256ofString(password.toString());

  // buscamos en la tabla auth el registro que tenga el email y contraseña que nos pasan
  const auth = await Auth.findOne({ where:{ email, password: passwordHasheado }});

  // si encontró un registro que coincida
  if (auth) {
    // creamos un token a partir de la data de esta persona, solo nos interesa el id
    const token = jwt.sign({ id: auth["userId"] }, SECRET);
    return { token };
  } else {
    return { error: "Email o contraseña incorrecto" };
  }
}

// Función para generar una nueva contraseña si se olvidó el usuario
export async function newPassword(userData: { email: string; password: string }) {
  const { email, password } = userData;

  if (!email || !password) {
    return { error: "Faltan datos del usuario" };
  }

  // hasheamos el password que nos pasan por el body
  const passwordHasheado = getSHA256ofString(password.toString());

  // Se modifica la contraseña en la db - tabla auth
  const resNewPass = await Auth.update({ password: passwordHasheado }, { where: { email } });
  // creamos el objeto con el email y la nueva contraseña
  const dataPassword = { email, newPassword: password };
  // pasamos el objeto a la función de sendgrid
  const resTemporaryPassword = await temporaryPassword(dataPassword);

  // si se cumple la promesa y obtenemos la respuesta:
  const res = resTemporaryPassword.res;
  if (res) {
    return {
      resNewPass,
      message: `Revisá tu correo, se envío una contraseña provisoria. "Aclaración": puede estar en spam o promociones.`,
      res,
    };
  }
}
