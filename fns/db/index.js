const { insertDocuments } = require( "./insertDocuments");
const { deleteOneDocument } = require( "./deleteOneDocument");
const { deleteManyDocuments } = require( "./deleteManyDocuments");
const { updateDocument } = require( "./updateDocument");
const { findOneDocument } = require( "./findOneDocument");
const { fetchAllCollectionData } = require( "./fetchAllCollectionData");

module.exports = {
  insertDocuments,
  deleteOneDocument,
  deleteManyDocuments,
  updateDocument,
  findOneDocument,
  fetchAllCollectionData
}