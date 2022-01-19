require('dotenv').config();
const { insertDocuments, findOneDocument } = require("./db");
const { sendWelcomeEmail } = require("./content");

/**
 * @description This function subscribes a user to my daily reads
 * @param { Object } userData => The user's data
 * @param { String } collectionName => Collection name
**/
const Subscribe = (userData, collectionName) => new Promise(async (resolve, reject) => {
  try {
    const accountExists = await findOneDocument({email: userData[0].email}, process.env.USER_COLLECTION, {_id: 1, email: 1, name: 1});
    if(accountExists){
      message = "Email already subscribed!";
      return resolve(message);
    } else {
      const savedUserData = await insertDocuments(userData, collectionName);
      let message = "Successfully subscribed!";
      if(!savedUserData){
        message = 'Failed to subscribe!';
        // TODO: Send error log email
        return resolve(message);
      }
      
      const welcomeUser = await sendWelcomeEmail(userData[0]);
      if(!welcomeUser){
        message = 'Failed to send welcome email!';
        // TODO: Send error log email
        return resolve(message);
      }

      message = 'Successfully subscribed!';
      return resolve(message);
    }
  } catch(e) {
    const message = 'Failed to  subscribe!';
    // TODO: Send error log email
    resolve(message);
  }
})

module.exports = {
  Subscribe
}