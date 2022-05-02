import { Pet } from "../models";
import { index } from "../lib/algolia";
import { cloudinary } from "../lib/cloudinary";
import { bodyToIndex } from "../middleware/middleware";

// REPORTAR/CREAR MASCOTA PERDIDA
export async function createPet(
  petData: {
    name: string;
    pictureURL: string;
    state: string;
    last_location_lat;
    last_location_lng;
    location: string;
  },
  userId: number
) {
  const {
    name,
    pictureURL,
    state,
    last_location_lat,
    last_location_lng,
    location,
  } = petData;

  if (!petData && !userId) {
    return { error: "Faltan datos de la mascota" };
  }

  //subimos la imágen con upload de cloudinary, el 1er parametro es la imágen y el segundo el obj con la configuración
  const petImage = await cloudinary.uploader.upload(pictureURL, {
    resource_type: "image",
    discard_original_filename: true,
    width: 1000,
  });

  // Creamos la mascota en la base de datos con el id del user
  const createPet = await Pet.create({
    name,
    pictureURL: petImage.url,
    state,
    last_location_lat,
    last_location_lng,
    location,
    userId,
  });

  // Creamos la mascota en algolia
  const algoliaCreatePet = await index.saveObject({
    objectID: createPet["id"],
    name: createPet["name"],
    pictureURL: createPet["pictureURL"],
    state: createPet["state"],
    _geoloc: {
      lat: createPet["last_location_lat"],
      lng: createPet["last_location_lng"],
    },
    userId: createPet["userId"],
  });

  return {
    createPet,
    algoliaCreatePet,
    message: "Mascota Publicada",
  };
}

// MODIFICAR LOS DATOS DE LA MASCOTA
export async function modifiedPet(petData, petId: number) {
  if (!petData && !petId) {
    return { error: " Faltan datos de la mascota" };
  }

  if (petData.pictureURL) {
    const imgUpload = await cloudinary.uploader.upload(petData.pictureURL, {
      resource_type: "image",
      discard_original_filename: true,
      width: 1000,
    });
    petData.pictureURL = imgUpload.url;
  }

  // MODIFICAMOS EN LA BASE DE DATOS
  const petModif = await Pet.update(petData, { where: { id: petId } });

  // TRANSFORMAMOS EL OBJETO PET DATA PARA PODER SUBIRLO A ALGOLIA
  const indexItem = bodyToIndex(petData, petId);

  // MODIFICAMOS EN ALGOLIA
  const algoliaPetRes = await index.partialUpdateObject(indexItem);

  return {
    petModif,
    algoliaPetRes,
    message: "Mascota modificada",
  };
}

// BUSCA TODAS LAS MASCOTAS
export async function findAllPets() { return await Pet.findAll() }

// BUSCA TODAS LAS MASCOTAS DE UN USUARIO
export async function findUserPets(userId: number) {
  if (!userId) {
    return { error: "Es necesario el id del usuario" };
  }

  // BUSCAMOS EN LA BASE DE DATOS
  const allPets = await Pet.findAll({ where: { userId }});
  // AMOUNT HACE REFERENCIA A LA CANTIDAD DE MASCOTAS REPORTADAS POR ESE USUARIO
  return {
    allPets,
    amount: allPets.length,
    message: "Mascotas Encontradas",
  };
}

// DELETE PED
export async function deletePet(petId: number) {
  if (!petId) {
    return { error: "Es necesario el id de la mascota" };
  }
  // DELETE IN DB
  await Pet.destroy({ where: { id: petId } });
  // DELETE IN ALGOLIA
  const objectID = petId.toString();
  await index.deleteObject(objectID);

  return {
    message: "Mascota Eliminada",
  };
}

// BUSCA MASCOTAS PERDIDAS CERCA DE UNA UBICACIÓN
export async function findLostPetNear(lat, lng) {
  if (!lat && !lng) {
    return { error: "Faltan datos para buscar las mascotas" };
  }

  //usamos el método search del index, sabemos que hits tiene la respuesta
  const { hits } = await index.search("", {
    // hacemos un join de este array de lat y lng y los unimos con una coma
    aroundLatLng: [lat, lng].join(","),
    aroundRadius: 30000,
  });

  // Obtenemos los id de las mascotas haciendo un map de los hits
  const idPetsLost = hits.map((hits) => {
    return hits.objectID;
  });
  // Con esos id hacemos la búsqueda en la base de datos y agregamos que su estado tiene que ser perdido
  const findPet = await Pet.findAll({ where: { id: idPetsLost, state: "PERDIDO" }});

  return {
    findPet,
    length: findPet.length,
  };
}
