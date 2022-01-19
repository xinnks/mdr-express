const { client, dbName } = require( "./client");

/**
 * @description This function inserts docs into a collection
 * @param { Array } docs => The query to match the docs to find
 * @param { String } collection => Collection name
**/
const insertDocuments = (docs, collection) => new Promise(async (resolve, reject) => {
  // Use connect method to connect to the server
  try {
    await client.connect();
    const db = client.db(dbName);
    const dbCollection = db.collection(collection) || db.collection('sources');
    docs = docs || {};
    let result;

    // insert document to collection
    if(docs.length > 1) {
      result = await dbCollection.insertMany(docs);
      resolve(result.insertedCount);
    } else {
      result = await dbCollection.insertOne(docs[0]);
      resolve(result);
    }

  } catch(e) {
    // TODO: Send error log email
  } finally {
    await client.close()
  }
});

module.exports = {
  insertDocuments
}