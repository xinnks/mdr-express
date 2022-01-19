const { client, dbName } = require( "./client");

/**
 * @description This function filters the docs within a collection using the given query
 * @param { Object } query => The query to match the docs to find
 * @param { String } collection => Collection name
 * @param { Object } dataToReturn => Object projecting the data fields to be returned
**/
const findOneDocument = (query, collection, dataToReturn) => new Promise(async (resolve, reject) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const dbCollection = db.collection(collection) || db.collection('sources');
    query = query || {};
    const options = {
      projection: dataToReturn
    }
    
    let result = await dbCollection.findOne(query, options);

    resolve(result);
  } catch(e) {
    // TODO: Send error log email
  } finally {
    await client.close()
  }
});

module.exports = {
  findOneDocument
}