require('dotenv').config();
const { findOneDocument, updateDocument, deleteOneDocument } = require("./db");

/**
 * @description This function updates the keywords on the users collection after validating the OTP provided
 * @param { Object } otpData => The one time password object
 * @param { String } keywordsData => Keywords string
**/
const UpdateKeywords = (otpData, keywordsData) => new Promise(async (resolve, reject) => {
  try {    
    let message;
    const otpResult = await findOneDocument(otpData, process.env.OTP_COLLECTION, {_id: 1, email: 1, created: 1});
    if(!otpResult){
      message = "OTP does not exist!";
      return resolve(message);
    }
    if((Date.parse(new Date()) - Date.parse(new Date(otpResult.created))) > 900000){
      message = "OTP expired!";
      return resolve(message);
    }
    if(otpResult){
      const deleteOTPRow = await deleteOneDocument(otpData, process.env.OTP_COLLECTION);
      if(!deleteOTPRow){
        message = "Could not delete OTP row!";
        // should send troubleshooting email here!! 
        return resolve(message);
      }
    }
    
    const userAccount = await findOneDocument({email: otpResult.email}, process.env.USER_COLLECTION, {_id: 1, email: 1, name: 1});
    if(!userAccount){
      message = "No user with email!";
      return resolve(message);
    }
    
    const updateKeywords = await updateDocument({email: userAccount.email}, keywordsData, process.env.USER_COLLECTION)
    if(!updateKeywords){
      message = "Could not update keywords!";
      // should send troubleshooting email here!! 
      return resolve(message);
    }

    // TODO: send keywords update email
    
    // respond accordingly
    message = "Successfully changed keywords!";
    return resolve(message);
  } catch(e) {
    // respond accordingly
    message = 'Failed to  change keywords!';
    // TODO: Send error log email
    return resolve(message);
  }
})

module.exports = {
  UpdateKeywords
}