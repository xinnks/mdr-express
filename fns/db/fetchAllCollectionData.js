const {client, dbName} = require('./client');

/**
 * @description This function fetches all the docs within a collection
 * @param { String } collection => Collection name
 * @param { Object } query => The query to match the docs to fetch
**/
const fetchAllCollectionData = async (collection, query) => new Promise(async (resolve, reject) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const dbCollection = db.collection(collection) || db.collection('sources');
    let cursor;
    
    if(query){
      cursor = await dbCollection.find(query);
    } else {
      cursor = await dbCollection.find();
    }

    let result = [];
    await cursor.forEach(user => {
      result.push(user);
    });

    resolve(result);
  } catch(e) {
    // TODO: Send error log email
  } finally {
    await client.close();
  }
});

module.exports = {
  fetchAllCollectionData
}