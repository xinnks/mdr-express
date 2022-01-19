const {client, dbName} = require('./client')

/**
 * @description This function deletes one doc
 * @param { Object } query => The query to match the doc to delete
 * @param { String } collection => Collection name
**/
const deleteOneDocument = async (query, collection) => new Promise(async (resolve, reject) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const dbCollection = db.collection(collection) || db.collection('sources');
    
    query = query || { title: "None" };

    const result = await dbCollection.deleteOne(query);
    
    resolve(result);
  } catch(e) {
    // TODO: Send error log email
  } finally {
    await client.close();
  }
});

module.exports = {
  deleteOneDocument
}