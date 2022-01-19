require('dotenv').config();
const { fetchDevToArticlesFromAPI, formatPostsDataSchema, formatDate, dateDifference } = require("./content");
const { deleteManyDocuments, insertDocuments, fetchAllCollectionData } = require("./db");
const todayDate = formatDate(new Date(), "dashedDate");
const yesterdayDate = formatDate(dateDifference(new Date(), -1), "dashedDate");

/**
 * @description This function fetches and compiles the latest content from sources, formats to a preffered schema and stores them into the database
**/
const CollectContentForDay = (contentLimit, previousInsertDate = yesterdayDate) => new Promise(async (resolve, reject) => {
  let message;
  let devToContent = await fetchDevToArticlesFromAPI(1, contentLimit);
  let formattedDevToContent = await formatPostsDataSchema(devToContent, 0, devToContent.length, 'dev.to');
  
  const allContent = formattedDevToContent;
  const allContentWithInsertDate = allContent.map(post => ({...post, insertDate: todayDate}));
  
  let existingContentStash = await fetchAllCollectionData(process.env.CONTENT_COLLECTION, {insertDate: { $eq: previousInsertDate}});
  console.log("existing documents: --- ", existingContentStash.length);
  if(existingContentStash.length){
    const deleteExistingDBData = await deleteManyDocuments({insertDate: { $eq: previousInsertDate}}, process.env.CONTENT_COLLECTION);
    console.log("deleted documents: --- ", deleteExistingDBData);
    if(!deleteExistingDBData){
      message = "Could not delete documents";
      // resolve(message);
      // TODO: send error log email
    }
  }
  
  const submitDataToDB = await insertDocuments(allContentWithInsertDate, process.env.CONTENT_COLLECTION);
  if(!submitDataToDB){
    message = "Could not submit documents";
    // TODO: send error log email
    return resolve(message);
  }

  message = "Successfully added daily content.";
  resolve(message);
});

module.exports = {
  CollectContentForDay
}