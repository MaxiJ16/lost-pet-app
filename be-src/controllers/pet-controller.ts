import { Pet } from "../models";
import { index } from "../lib/algolia";
import { cloudinary } from "../lib/cloudinary";
import { bodyToIndex } from "../middleware/middleware";

// Función para Reportar una nueva mascota
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

  //subimos la imágen con upload de cloudinary
  // el 1er parametro es la imágen y el segundo el obj con la configuración
  const petImage = await cloudinary.uploader.upload(pictureURL, {
    // esto es el tipo que estamos subiendo, xq tmb soporta videos
    resource_type: "image",
    //que no use el nombre original que le estoy mandando así no se choca con otras imágenes
    discard_original_filename: true,
    // y que limite el ancho a mil así no se suben img gigantes
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

// Función para modificar los datos de la mascota
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

  // Modificamos la mascota en la db
  const petModif = await Pet.update(petData, {
    where: {
      id: petId,
    },
  });

  // Transformamos el objeto para poder modificarlo en algolia
  const indexItem = bodyToIndex(petData, petId);

  // Guardamos la modificación en algolia
  const algoliaPetRes = await index.partialUpdateObject(indexItem);

  return {
    petModif,
    algoliaPetRes,
    message: "Mascota modificada",
  };
}

// Función para buscar todas las mascotas
export async function findAllPets() {
  return await Pet.findAll();
}

// Función para buscar las mascotas reportadas de un usuario
export async function findUserPets(userId: number) {
  if (!userId) {
    return { error: "Es necesario el id del usuario" };
  }
  // Busca todas las mascotas publicadas por ese userId
  const allPets = await Pet.findAll({
    where: {
      userId,
    },
  });

  return {
    allPets,
    amount: allPets.length,
    message: "Mascotas Encontradas",
  };
}

// Función para eliminar una mascota
export async function deletePet(petId: number) {
  if (!petId) {
    return { error: "Es necesario el id de la mascota" };
  }

  await Pet.destroy({ where: { id: petId } });

  const objectID = petId.toString();
  await index.deleteObject(objectID);

  return {
    message: "Mascota Eliminada",
  };
}

// Función para buscar mascotas perdidas cerca
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
  const findPet = await Pet.findAll({
    where: {
      id: idPetsLost,
      state: "PERDIDO",
    },
  });

  return {
    findPet,
    length: findPet.length,
  };
}
