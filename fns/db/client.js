require( 'dotenv').config();

const { MongoClient, ServerApiVersion } = require( 'mongodb');

// Connection URL
const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER_URL}/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`;

// Client Object
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// Database Name
const dbName = process.env.MONGO_DATABASE;

module.exports = {
  uri,
  client,
  dbName
}