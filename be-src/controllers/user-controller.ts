import { Auth, User } from "../models";

import { getSHA256ofString } from "../middleware/middleware";

// Función para crear el usuario
export async function createUser(userData: {
  fullname: string;
  email: string;
  password: string;
}) {
  if (!userData.fullname || !userData.email || !userData.password) {
    return { error: "Faltan datos del usuario." };
  }

  const { fullname, email, password } = userData;
  const passwordString = password.toString();

  const [user, created] = await User.findOrCreate({
    // Busca en la tabla users el campo email con el valor req.body.email
    where: { email },
    // sino lo encuentra le ponemos los datos básicos del user.
    defaults: {
      email,
      fullname,
    },
  });

  const [auth, authCreated] = await Auth.findOrCreate({
    // Busca en la tabla auth cualquiera que tenga user_id = a user.get("id")
    // es el campo que nunca puede cambiar, en cambio email si puede cambiar
    where: { userId: user["id"] },
    // si no lo encuentra le ponemos los datos básicos del auth.
    defaults: {
      email,
      password: getSHA256ofString(passwordString),
      // el user_id en este caso va a ser el user que nos devuelve el registro de arriba
      userId: user["id"],
    },
  });

  return {
    user,
    newUser: created,
    message: "Usuario creado con éxito",
  };
}

// Buscamos el usuario por el id
export async function findUser(userId: number) {
  if (!userId) {
    return { error: "El id es necesario" };
  }
  const user = await User.findByPk(userId);

  return user;
}

// Buscamos el user por su email, si existe devuelve true, sino false
export async function checkEmailUser(userData: { email: string }) {
  const { email } = userData;

  if (!email) {
    return { error: "El email es necesario" };
  }

  const userExist = await User.findOne({
    where: { email },
  });

  if (userExist) {
    return true;
  } else {
    return false;
  }
}

// Función para encontrar y modificar un usuario
export async function modifiedUser(
  userData: { fullname: string; password: string },
  id: number
) {
  const { fullname, password } = userData;

  if (!fullname || !password) {
    return { error: "Faltan datos del usuario" };
  }
  // Se modifica el nombre en la tabla de usuarios
  await User.update({ fullname }, { where: { id } });
  // Se modifica la contrasena en la tabla auth
  await Auth.update({ password }, { where: { id } });

  return { exito: `Usuario modificado con éxito` };
}


