const {client, dbName} = require('./client');

/**
 * @description This function updates a doc inside a collection
 * @param { Object } filter => The query to match the doc to update
 * @param { Object } updateData => new data
 * @param { String } collection => Collection name
 * @param { Boolean } upsert => Upsert instructs the update method to create a document if no documents match the filter
**/
const updateDocument = async (filter, updateData, collection, upsert = true) => new Promise(async (resolve, reject) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const dbCollection = db.collection(collection) || db.collection('sources');
    filter = filter || { _id : 0};
    updateData = updateData || { name: 'No Source'};
    let result;
    
    const options = { upsert };
    
    const updateDoc = {
      $set: updateData,
    };

    result = await dbCollection.updateOne(filter, updateDoc, options);
    
    resolve(result);
  } catch(e) {
    // TODO: Send error log email
  } finally {
    await client.close();
  }

  return 'done.';
});

module.exports = {
  updateDocument
}