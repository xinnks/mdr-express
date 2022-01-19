require('dotenv').config();
const { findOneDocument, insertDocuments } = require("./db");
const { generateOTP, sendOtpEmail } = require("./content");

/**
 * @description This function updates the user's content keywords
 * @param { Object } userData => The user's data
 * @param { String } collectionName => Collection name
**/
const KeywordsUpdateRequest = (userData, collectionName) => new Promise(async (resolve, reject) => {
  try {
    const userAccount = await findOneDocument(userData, collectionName, {_id: 1, email: 1, name: 1});

    let message;
    if(!userAccount){
      message = "No user with email!";
      return resolve(message);
    }
    
    const otp = generateOTP();
    
    const submitOTP = await insertDocuments([{email: userAccount.email, otp: otp, created: new Date()}], process.env.OTP_COLLECTION);
    if(!submitOTP){
      message = "Could not create OTP row!";
      // TODO: Send error log email
      return resolve(message);
    }
    
    const emailSent = await sendOtpEmail(userAccount.email, otp, userAccount.name)
    if(!emailSent){
      message = "Could not send OTP email!";
      // TODO: Send error log email
      return resolve(message);
    }
    
    message = "Email Sent!";
    return resolve(message);
  } catch(e) {
    message = 'Failed to  subscribe!';
    // TODO: Send error log email
    resolve(message);
  }
})

module.exports = {
  KeywordsUpdateRequest
}