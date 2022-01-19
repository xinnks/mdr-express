require('dotenv').config();
const { analysePostsByKeywords, formatDate, sendDailyContentEmails } = require("./content");
const { insertDocuments, fetchAllCollectionData } = require("./db");

/**
 * @description This function fetches the content stored in the database iterates through it rating the content by the provided keywords of each user and sends the 5 top rated articles to the user's inbox
**/
const SendContentEmails = () => new Promise(async (resolve, reject) => {
  let message;
  const userAccounts = await fetchAllCollectionData(process.env.USER_COLLECTION);
  if(!userAccounts){
    message = "Failed to fetch user accounts.";
    return resolve(message);
  }
  
  const collectedStashedContent = await fetchAllCollectionData(process.env.CONTENT_COLLECTION);
  if(!collectedStashedContent.length){
    message = "Failed to fetch collected content.";
    // TODO: send error log email
    return resolve(message);
  }

  let allUsersReads = [];
  let emailArray = [];
  
  await userAccounts.forEach(async (user) => {
    let keywordsToArray = user.keywords.includes(",") ? user.keywords.replace(" ", "").split(",") : [user.keywords];
    let analysedPosts = await analysePostsByKeywords(collectedStashedContent, keywordsToArray, 0, collectedStashedContent.length, 'dev.to');
    let pickedPosts = analysedPosts.slice(0, 5);
    const userReads = pickedPosts.map(x => ({
      ...Object.assign(x, {keywords: x.keywords}),
      user: {name: user.name, email:user.email},
      read: 0,
      inserDate: formatDate(new Date(), "dashedDate")
    }));
    if(!allUsersReads.length){
      allUsersReads = userReads;
    } else {
      allUsersReads = allUsersReads.concat(userReads);
    }
    emailArray.push({
      user: {name: user.name, email:user.email},
      date: formatDate(new Date(), "human"),
      content: pickedPosts.map(x => ({
        url: x.url,
        image: x.image,
        title: x.title,
        description: x.description,
        author: x.author
      })),
      keywords: user.keywords
    });
  });
  
  const storeReads = insertDocuments(allUsersReads, process.env.READS_COLLECTION);
  if(!storeReads){
    message = "Failed to store reads to database.";
    // TODO: send error log email
    return resolve(message);
  }
  
  const sendEmails = await sendDailyContentEmails(emailArray);
  if(!sendEmails){
    message = "Failed to send emails.";
    // TODO: send error log email
    return resolve(message);
  }

  message = "Successfully completed task.";
  resolve(message);
});

module.exports = {
  SendContentEmails
}