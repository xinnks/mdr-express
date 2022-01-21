require('dotenv').config();
const { findOneDocument, updateDocument } = require("./db");

/**
 * @description This function gets articleId and returns article link
 * @param { String } articleId => article id
**/
const RedirectToArticle = (articleId) => new Promise(async (resolve, reject) => {
  try {
    const articleContent = await findOneDocument({contentStashId: articleId}, process.env.READS_COLLECTION, {contentStashId: 1, url: 1});

    let message;
    if(!articleContent){
      message = "Article not found!";
      return resolve({message, url: null});
    }
    
    // mark content as read
    const updateReadStatus = await updateDocument({contentStashId: articleId}, {read: 1}, process.env.READS_COLLECTION);
    if(!updateReadStatus){
      message = "Could not update read status!";
      // should send troubleshooting email here!! 
      return resolve({message, url: articleContent.url});
    }
    
    message = "Read status updated!";
    return resolve({status: message, url: articleContent.url});
  } catch(e) {
    message = 'Failed to update read status!';
    // TODO: Send error log email
    resolve({status: message, url: null});
  }
})

module.exports = {
  RedirectToArticle
}