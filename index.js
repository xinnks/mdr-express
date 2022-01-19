require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

const { Subscribe, CollectContentForDay, SendContentEmails, KeywordsUpdateRequest, UpdateKeywords, Unsubscribe, UnsubscriptionRequest } = require("./fns");
const { formatDate, dateDifference } = require("./fns/content");

// parsers
const jsonParser = bodyParser.json();
const urlEncodedParser = bodyParser.urlencoded({extended: true });

const { indexHtml, successHtml, messageHtml, NotFoundHtml, UpdateKeywordsRequestHtml, KeywordsUpdateHtml, UnsubscribeRequestHtml } = require("./fns/html");

app.get("/", (req, res) => {
  res.send(indexHtml);
});

app.post("/subscribe", urlEncodedParser, async (req, res) => {
  const {name, email, keywords} = req.body;
  if (!name || !email || !keywords) {
    res.status(422).send(`${!name?'name, ':''}${!email?'email, ':''}${!keywords?'keywords, ':''} are required.`);
  }
  // filter keywords  
  let filteredKeywords = keywords.match(/^([\w]+[ ]*[,]*[ ]*[\w]+)/gi);
  let screenedKeywordsData = filteredKeywords.length ? filteredKeywords.join(",") : filteredKeywords.join("");

  try{
    const subscriptionResponse = await Subscribe([{name, email, keywords: screenedKeywordsData}], process.env.USER_COLLECTION);
    console.error("subscriptionResponse: -- ", subscriptionResponse);
    res.send(successHtml);
  }
  catch (e) {
    console.error("ERROR", e);
    res.send(messageHtml("Retry", "We experienced an error on our side, please retry!"));
  }
});

app.route("/unsubscribe")
  .get(async (req, res) => {
    const { email } = req.query;
    if (!email) {
      console.error("Email not provided!");
      return res.status(400).send(NotFoundHtml);
    }
    console.error("Unsubscribing user with email: -- ", email);

    try{
      const unsubscriptionResponse = await UnsubscriptionRequest(email);

      let message;
      if(unsubscriptionResponse === "Email Sent!"){
        res.send(UnsubscribeRequestHtml);
      } else {
        console.error("unsubscriptionResponse: -- ", unsubscriptionResponse);
        message = "Sorry we've encountered an error on our side, please refresh page.";
        res.send("Server Error", message);
      }
    }
    catch (e) {
      console.error("ERROR: -- ", e);
      res.status(500).send(e);
    }
  })
  .post(urlEncodedParser, async (req, res) => {

    const {otp} = req.body
    if (!otp) {
      return res.status(422).send(messageHtml("Missing fields", `${!otp?'otp, ':''} is required.`));
    }
  
    try{
      const unsubscriptionResponse = await Unsubscribe({otp: parseInt(otp)});
      
      let message;
      if(unsubscriptionResponse === "OTP does not exist!"){
        console.log("HERE 1: ", unsubscriptionResponse);
        message = "No keywords update request has been made for this account.";
      }
      if(unsubscriptionResponse === "OTP expired!"){
        console.log("HERE 3: ", unsubscriptionResponse);
        message = "This one time password(OTP) has expired.";
      }
      if(unsubscriptionResponse === "Could not delete OTP row!"){
        console.log("HERE 5: ", unsubscriptionResponse);
        message = "Sorry we've encountered an error on our side, please retry.";
      }
      if(unsubscriptionResponse === "No user with email!"){
        console.log("HERE 4: ", unsubscriptionResponse);
        message = "Sorry we've encountered an error on our side, please retry.";
      }
      if(unsubscriptionResponse === "Could not delete user!"){
        console.log("HERE 6: ", unsubscriptionResponse);
        message = "Sorry we've encountered an error on our side, please retry.";
      }
      if(unsubscriptionResponse === "Could not delete user's reads!"){
        console.log("HERE 4: ", unsubscriptionResponse);
        message = "Sorry we've encountered an error on our side, please retry.";
      }
      if(unsubscriptionResponse === "Could not send email!"){
        console.log("HERE 6: ", unsubscriptionResponse);
        message = "Sorry we've encountered an error on our side, please retry.";
      }
      if(unsubscriptionResponse === "Successfully unsubscribed!"){
        console.log("HERE 6: ", unsubscriptionResponse);
        message = "You have successfully unsubscribed from receiving daily dev content.";
      }
      res.send(messageHtml(unsubscriptionResponse, message));
    }
    catch (e) {
      console.error("ERROR: -- ", e);
      res.status(500).send(e);
    }
  });

app.route("/update")
  .get(async (req, res) => {
    res.send(UpdateKeywordsRequestHtml());
  })
  .post(urlEncodedParser, async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(422).send(UpdateKeywordsRequestHtml(`${!email?'email ':''} is required.`));
    }
    console.log(`update keywords for user with email: ${email}`);

    try{
      const subscriptionResponse = await KeywordsUpdateRequest({ email: email}, process.env.USER_COLLECTION);
      
      if(subscriptionResponse === "Email Sent!"){
        res.send(KeywordsUpdateHtml);
      } else {
        res.send(UpdateKeywordsRequestHtml(subscriptionResponse));
      }
    }
    catch (e) {
      console.error("ERROR: -- ", e);
      res.status(500).send(e);
    }
  });

app.post("/update-keywords", urlEncodedParser, async (req, res) => {
  const { otp, keywords } = req.body;
  if (!otp || !keywords) {
    return res.status(422).send(messageHtml("Missing fields", `${!otp?'otp, ':''}${!keywords?'keywords, ':''} are required.`));
  }
  console.log(`update keywords to: [${keywords}] for otp number request: [${typeof otp}] ${otp}`);

  // filter keywords
  let filteredKeywords = keywords.match(/^([.]*[\w]+[ ]*[,]*[ ]*[.]*[\w]+)/gi);
  let escapedKeywordsData = filteredKeywords.length ? filteredKeywords.join(",") : filteredKeywords.join("");

  try{
    const updatedKeywordsData = await UpdateKeywords({ otp: parseInt(otp) }, { keywords: escapedKeywordsData });
  
    let message;
    if(updatedKeywordsData == "No user with email!"){
      console.log("HERE 1: ", updatedKeywordsData);
      message = "This account does not exist.";
    }
    if(updatedKeywordsData == "OTP does not exist!"){
      console.log("HERE 2: ", updatedKeywordsData);
      message = "No keywords update request has been made for this account.";
    }
    if(updatedKeywordsData == "OTP expired!"){
      console.log("HERE 3: ", updatedKeywordsData);
      message = "This one time password(OTP) has expired.";
    }
    if(updatedKeywordsData == "Could not send OTP email!"){
      console.log("HERE 4: ", updatedKeywordsData);
      message = "Sorry we've encountered an error on our side, please retry.";
    }
    if(updatedKeywordsData == "Could not delete OTP row!"){
      console.log("HERE 4: ", updatedKeywordsData);
      message = "Sorry we've encountered an error on our side, please retry.";
    }
    if(updatedKeywordsData == "Successfully changed keywords!"){
      console.log("HERE 4: ", updatedKeywordsData);
      message = "You have successfully changed the keywords to your daily dev content.";
    }
    res.send(messageHtml(updatedKeywordsData, message));
  }
  catch (e) {
    console.error("ERROR", e);
    res.status(500).send(e);
  }
});

app.post("/submit-new-keywords", urlEncodedParser, async (req, res) => {
  res.send(indexHtml);
});

app.post("/collect-content", jsonParser, async (req, res) => {
  console.log(req.body);
  const data = req.body;
  if(!data.secret || (data.secret && (data.secret !== process.env.CRON_REQUEST_SECRET))){
    console.log("data: -- ", data);
    return res.status(403).json("Unauthorized request");
  }
  
  const yesterdayDate = formatDate(dateDifference(new Date(), -1), "dashedDate");
  console.log("yesterdayDate: -- ", yesterdayDate);

  try{
    let collectContent = await CollectContentForDay(data.count || 100, data.lastDate || yesterdayDate);
  
    let message, statusCode;
    if(collectContent === "Could not delete documents"){
      console.log("HERE 1: ", collectContent);
      message = {message: collectContent};
      statusCode = 500;
    }
    if(collectContent === "Could not submit documents"){
      console.log("HERE 2: ", collectContent);
      message = {message: collectContent};
      statusCode = 500;
    }
    if(collectContent === "Successfully added daily content."){
      console.log("HERE 3: ", collectContent);
      message = {message: collectContent};
      statusCode = 200;
    }
    
    res.json(message);
  }
  catch (e) {
    console.error("ERROR", e);
    res.status(500).json(e);
  }
});

app.post("/send-emails", jsonParser, async (req, res) => {
  console.log(req.body);
  const data = req.body;
  if(!data.secret || (data.secret && (data.secret !== process.env.CRON_REQUEST_SECRET))){
    console.log("data: -- ", data);
    return res.status(403).json("Unauthorized request");
  }

  try{
    const mailContentToUsers = await SendContentEmails();
  
    let message, statusCode;
    
    if(mailContentToUsers === "Successfully completed task."){
      console.log("HERE 1: ", mailContentToUsers);
    } else {
      console.log("HERE 2: ", mailContentToUsers);
      message = {message: mailContentToUsers};
      statusCode = 500;
    }
    
    res.json(message);
  }
  catch (e) {
    console.error("ERROR", e);
    res.status(500).json(e);
  }
});

app.route("/*")
.post(async (req, res) => {
  res.status(400).json({message: "Page Not Found"});
})
.get(async (req, res) => {
  res.status(400).send(NotFoundHtml);
});

app.listen(process.env.PORT || 3000, () => console.log("Listening to PORT: ", process.env.PORT || 3000));