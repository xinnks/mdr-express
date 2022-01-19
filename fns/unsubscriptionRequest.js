require('dotenv').config();
const { findOneDocument, insertDocuments } = require("./db");
const { sendOtpEmail, generateOTP } = require("./content");

/**
 * @description This function verifies the user account from a unsubscription request
 * @param { String } email => The user's data
**/
const UnsubscriptionRequest = (email) => new Promise(async (resolve, reject) => {
  try {
    const userAccount = await findOneDocument({email: email}, process.env.USER_COLLECTION, {_id: 1, email: 1, name: 1});
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
    
    const emailSent = await sendOtpEmail(userAccount.email, otp, userAccount.name, "unsubscribe")
    if(!emailSent){
      message = "Could not send OTP email!";
      // TODO: Send error log email
      return resolve(message);
    }
    
    message = "Email Sent!";
    return resolve(message);
  } catch(e) {
    const message = 'experienced some error!';
    // TODO: Send error log email
    resolve(message);
  }
})

module.exports = {
  UnsubscriptionRequest
}