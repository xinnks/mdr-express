require('dotenv').config();
const { sendFarewellEmail } = require("./content");
const { findOneDocument, deleteOneDocument, deleteManyDocuments, fetchAllCollectionData } = require("./db");

/**
 * @description This function unsubscribes a user from the service
 * @param { Object } otpData => The one time password object
**/
const Unsubscribe = (otpData) => new Promise(async (resolve, reject) => {
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
    
    const deleteUser = await deleteOneDocument({email: { $eq: userAccount.email}}, process.env.USER_COLLECTION);
    if(!deleteUser){
      message = "Could not delete user!";
      // should send troubleshooting email here!! 
      return resolve(message);
    }
    
    // fetch user's reads
    const allUserReads = fetchAllCollectionData(process.env.READS_COLLECTION, {"user.email": { $eq: userAccount.email}});
    if(allUserReads.length){
      const deleteUsersReads = await deleteManyDocuments({"user.email": { $eq: userAccount.email}}, process.env.READS_COLLECTION);
      if(!deleteUsersReads){
        message = "Could not delete user's reads!";
        // should send troubleshooting email here!! 
        return resolve(message);
      }
    }
    
    // send Goodbye email
    const sayGoodbye = await sendFarewellEmail(userAccount);
    if(!sayGoodbye){
      message = "Could not send email!";
      // should send troubleshooting email here!! 
      return resolve(message);
    }
    
    // respond accordingly
    message = "Successfully unsubscribed!";
    return resolve(message);
  } catch(e) {
    // respond accordingly
    message = 'Failed to unsubscribe!';
    // TODO: Send error log email
    return resolve(message);
  }
})

module.exports = {
  Unsubscribe
}