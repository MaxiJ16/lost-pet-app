// For the default version
import algoliasearch from "algoliasearch";

const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY);

// el nombre de nuestro índice se llama products
const index = client.initIndex("pets");

// exportamos el index
export { index };
