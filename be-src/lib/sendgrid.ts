const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// F PARA ENVIAR POR MAIL EL REPORTE DE LA MASCOTA
export async function sendEmailReport(reportData) {
  const { reporter, phone_number, message, petName, userEmail, userName } =
    reportData;

  const msgEmail = {
    to: userEmail,
    from: "maxijofre.c@gmail.com",
    subject: `Información de ${petName} tu mascota perdida`,
    text: "Nueva información sobre tu mascota",
    html: `<h1>APP ANIMALES PERDIDOS</h1><p>Estimado/a ${userName}, han visto a su mascota <strong>${petName}</strong>.<p>Quién envío la información es <strong>${reporter}</strong>, su número de teléfono es: <strong>${phone_number}</strong></p><p>Ubicación dónde la vió:</p><p>${message}</p>`,
  };

  const mailSentRes = await sgMail.send(msgEmail);
  return { message: "Información enviada! :)", res: mailSentRes };
}

// F PARA ENVIAR POR MAIL LA CONTRASEÑA TEMPORARIA
export async function temporaryPassword(authData: { email; newPassword }) {
  const { email, newPassword } = authData;

  const msg = {
    to: email,
    from: "maxijofre.c@gmail.com",
    subject: "Recuperar contraseña de App Mascotas Perdidas",
    text: "Nueva información sobre tu mascota",
    html: `<h1>APP ANIMALES PERDIDOS</h1><p>Tu <strong>contraseña provisoria es: ${newPassword} </strong><p>Recuerda que puedes cambiarla en la sección "Mis Datos"</p><p>Saludos!</p>`,
  };

  const sentEmail = await sgMail.send(msg);
  return { message: "Email Enviado! :D", res: sentEmail };
}
