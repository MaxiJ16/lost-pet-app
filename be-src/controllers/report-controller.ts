import { Pet, Report, User } from "../models";
import { sendEmailReport } from "../lib/sendgrid";

export async function createReport(reportData: { reporter: string; phone_number: string; message: Text; petId: string }) {
  const { reporter, phone_number, message, petId } = reportData;

  if (!reporter && !phone_number && !message && !petId) {
    return { error: "Falta información para generar el reporte" };
  }

  // Creamos el reporte
  const createReporter = await Report.create({ reporter, phone_number, message, petId: petId });

  // Buscamos la mascota para poder extraer el id del user que la perdió
  const findPet = await Pet.findByPk(petId);

  // Buscamos el usuario y obtenemos su data con el id
  const userId = findPet["userId"];
  const userData = await User.findByPk(userId);

  // Formamos el objeto para enviar el reporte en sendgrid
  const objReportData = {
    reporter,
    phone_number,
    message,
    petName: findPet["name"],
    userName: userData["fullname"],
    userEmail: userData["email"],
  };

  const resSendGrid = await sendEmailReport(objReportData);

  // Si la respuesta a la promesa de sendgrid se cumple, enviamos el mensaje
  if (resSendGrid.res) {
    return {
      mensaje: "Tu reporte fue enviado",
      res: resSendGrid.res,
    };
  }
}
