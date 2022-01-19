const {fetchHashnodePostsFromAPI, rateHashnodePostsByKeywords} = require('./hashnode_content')
const {fetchDevToArticlesFromAPI, rateDevToPostsByKeywords} = require('./devto_content')
const { formatName, formatDate, dateDifference, analysePostsByKeywords, formatPostsDataSchema, generateOTP, sendOtpEmail, sendDailyContentEmails, sendFarewellEmail, sendWelcomeEmail } = require('./helpers')

module.exports = {
  fetchHashnodePostsFromAPI,
  rateHashnodePostsByKeywords,
  fetchDevToArticlesFromAPI,
  rateDevToPostsByKeywords,
  formatName,
  formatDate,
  dateDifference,
  analysePostsByKeywords,
  formatPostsDataSchema,
  generateOTP,
  sendOtpEmail,
  sendDailyContentEmails,
  sendFarewellEmail,
  sendWelcomeEmail
}