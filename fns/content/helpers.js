require('dotenv').config();
const mailjet = require('node-mailjet').connect(process.env.MAILJET_API_KEY, process.env.MAILJET_API_SECRET);
const axios = require("axios");
const cheerio = require("cheerio");
const Bottleneck = require('bottleneck');
const { otpEmailHtml } = require('../html/otpEmailHtml');
const { ContentEmailHtml, WelcomeEmailHtml, FarewellEmailHtml } = require('../html');
const { floor, random } = require('mathjs');
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * @description This function takes a date string and formats it
 * @param { String } date => date to be formatted
**/
function formatDate(date = new Date(), format = "human") {
  let theDate = new Date(date);
  let parsedDate;
  if(format === "human"){
    parsedDate = `${months[theDate.getMonth()]} ${theDate.getUTCDate()}, ${theDate.getFullYear()}`;
  }
  if(format === "dashedDate"){
    parsedDate = `${theDate.getUTCDate()}-${theDate.getMonth()+1}-${theDate.getFullYear()}`;
  }
  return parsedDate;
}

/**
 * @description This function takes a date and a difference in number and returns a new date
 * @param { Number } date => Original date
 * @param { Number } date => The difference to be operated on the date, defaults to -1
**/
function dateDifference(date = new Date(), difference = -1) {
  return date.setDate(date.getUTCDate() + difference)
}

/**
 * @description This function takes mixed cased name and formats it
 * @param { String } name => name to be formatted
**/
function formatName(name) {
  return name.match(/(\w)+/g).map(x => x.slice(0,1).toUpperCase()+''+x.slice(1,x.length).toLowerCase()).join(" ")
}

/**
 * @description This function generates a six figure random number
**/
const generateOTP = () => floor(100000 + random() * 900000);

/**
 * @description This function takes a string and rates it by the given keywords
 * @param { Array } keywords => keywords to rate the string by
 * @param { String } content => The string to be rated
**/
const analyseKeywords = (keywords, content) => {
  let contentToKeywordValue = 0;
  
  keywords.forEach(word => {
    let escapedKeyword = word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    let regexp = new RegExp(escapedKeyword, "g");
    let keywordsFound = content.match(regexp);
    // console.log(`keywordsFound -- [${word}]: -- `, keywordsFound ? keywordsFound.length : 0, content.includes(word))
    let keywordCount = keywordsFound ? keywordsFound.length : 0;

    let keywordValue = (0.625 * word.length) * keywordCount;
    contentToKeywordValue += keywordValue;
    // console.log(`keywordValue[${word}]: -- `, keywordValue)
  });
  // console.log(`articleValue: -- `, contentToKeywordValue)
  return parseFloat(contentToKeywordValue.toFixed(2));
}

/**
 * @description This function takes postdata with a number of properties rates it to the given keywords
 * @param { Object } postData => The string to be rated
 * @param { Array } keywords => keywords to rate the string by
**/
const getPostValue = (postData , keywords) => {
  let postValue = 0; // value of the post in relation to the keywords
  
  // get page <head> title inner text; get value of the title in relation to the keywords
  postValue += (analyseKeywords(keywords, postData.headTitle) * 2);

  // get page <head> description meta content inner text; get value of the description in relation to the keywords
  postValue += (analyseKeywords(keywords, postData.headMetaDescription) * 2);

  // get page <body> <h1> title inner text; get value of the heading in relation to the keywords
  postValue += (analyseKeywords(keywords, postData.bodyH1Heading) * 2);
  
  // get keywords value for text in <body> <article> content
  postValue += analyseKeywords(keywords, postData.bodyArticleContent);

  console.log("evaluating post value for: -- ", postData.url, " : ", postValue.toFixed(2));
  return parseFloat(postValue.toFixed(2));
}

/**
 * @description This function takes a url scrappes for and returns usefull post data
 * @param { String } url => The url of the content
 * @param { String } source => Source where the content is from
**/
const getImportantPageFields = (url, source = "dev.to") => new Promise(async (resolve, reject) => {
  // console.log("THE URL WE'RE CHECKING: -- ", url);
  axios.get(url)
  .then(response => {
    let $ = cheerio.load(response.data);

    // get page <head> title inner text; get value of the title in relation to the keywords
    let headMetaOgImage = $('meta[property="og:image"]').attr('content');
    // console.log("headMetaOgImage: -- ", headMetaOgImage);

    // get page <head> title inner text; get value of the title in relation to the keywords
    let headTitle = $('head').find('title').text();
    // console.log("headTitle [title]: -- ", headTitle);

    // get page <head> description meta content inner text; get value of the description in relation to the keywords
    let headMetaDescription = $('meta[name="description"]').attr('content');
    // console.log(`meta[name="description"]: -- `, headMetaDescription);

    // get page <body> <h1> title inner text; get value of the heading in relation to the keywords
    let bodyH1Heading;
    if(source === 'hashnode'){
      bodyH1Heading = $('h1[data-query="post-title"]').text();
      // console.log("bodyH1Heading [h1]: -- ", bodyH1Heading) // hashnode specific with [data-query="post-title"]
    }
    if(source === 'dev.to'){
      bodyH1Heading = $('h1').text();
      // console.log("bodyH1Heading [h1]: -- ", bodyH1Heading) // dev.to specific with [data-query="post-title"]
    }

    let articleWithHtml = $('article').text();
    const bodyArticleContent = articleWithHtml
      .replace(/<style[^>]*>[^]*<\/style>/gi, "") // clear styles
      .replace(/<pre[^>]*>[^]*<\/pre>/gi, "") // clear code blocks
      .replace(/<[^>]*>/g, ""); // clear all html tags

    return resolve({
      headMetaOgImage,
      headTitle,
      headMetaDescription,
      bodyH1Heading,
      bodyArticleContent,
      url // for comparison purposes
    });
  })
  .catch(error => {

    return resolve({
      headMetaOgImage: "",
      headTitle: "",
      headMetaDescription: "",
      bodyH1Heading: "",
      bodyArticleContent: "",
      url // for comparison purposes
    });
  })
});

/**
 * @description This function rates an array of posts using the provided keywords
 * @param { Array } posts => The array of posts to be rated
 * @param { Array } keywords => The keywords to rate the posts by
 * @param { Number } startingPoint => Posts starting count point
 * @param { Number } totalPosts => The total posts count
 * @param { String } source => Source of the posts content
**/
const analysePostsByKeywords = (posts, keywords, startingPoint, totalPosts, source = 'hashnode') => new Promise((resolve, reject) => {
  let postsByValue = [];
  console.log("TOTAL POSTS [getPostValue] -- ", posts.length);
  posts.forEach(async post => {
    let postValue = 0; // value of the post in relation to the keywords
    postValue = getPostValue(post, keywords, source);
    console.log(`postValue[${post.url}]: -- `, postValue);
  
    // aggregate posts
    postsByValue.push({...post, postValue});
      
    if(startingPoint + 1 >= totalPosts){
      // console.log(`postsByValue ###: -- `, postsByValue.map(x => ({postValue: x.postValue, url: x.url})))
      const sortedArticles = postsByValue.sort((x, y) => {
        return y.postValue - x.postValue
      }).map((post) => ({
        url: post.url,
        title: post.title,
        description: post.description,
        datePublished: post.datePublished,
        author: !!post.author ? (post.author.includes(" ") ? formatName(post.author) : post.author) : "Unknown Author",
        image: post.image,
        keywords: keywords.join(),
        articleValue: post.postValue,
        source: `dev.to`,
        contentStashId: post._id.toString()
      }));
      // console.log(`postsByValue SORTED ###: -- `, sortedArticles.length, sortedArticles);
      resolve(sortedArticles);
    }
    startingPoint++;
  })
});

/**
 * @description This function formats posts to our post data schema
 * @param { Array } posts => The array of posts to be formatted
 * @param { Number } startingPoint => Posts starting count point
 * @param { Number } totalPostsCount => The total posts count
 * @param { String } source => Source of the posts content
**/
const formatPostsDataSchema = (posts, startingCount, totalPostsCount, source = 'hashnode') => new Promise(async (resolve, reject) => {
  let formattedPosts = [];
  console.log("POSTS Count: ",totalPostsCount, " | totalPostsCount: ", totalPostsCount, " | posts.length: ", posts.length);
  const limiter = new Bottleneck({
    maxConcurent: 5
  });
  const concurLimitedGetFields = limiter.wrap(getImportantPageFields);
  const fetchAll = posts.map(x => {
    const postUrl = source === "hashnode" ? ((x.author && x.author.publicationDomain) ? `https://${x.author.publicationDomain}/${x.slug}` : `https://${x.author.username}.hashnode.com/${x.slug}`) : x.url;
    const fetchFields = async () => await concurLimitedGetFields(postUrl, source);
    return fetchFields();
  });
  const getAll = Promise.all(fetchAll);
  try {
    console.time("timeUsed");
    const allFetched = await getAll;
    console.timeEnd("timeUsed");
    console.log("FINISHED CHECKING URLs[totalPostsCount]: ", allFetched.length);
    // console.log("HASHNODE URL CHECK");
    let isHashnode = source === "hashnode";
    allFetched.forEach(item => {
      // content
      let postInfo = posts.filter(p => p.url === item.url);
      let postUrl = isHashnode ? ((postInfo[0].author && postInfo[0].author.publicationDomain) ? `https://${postInfo[0].author.publicationDomain}/${postInfo[0].slug}` : `https://${postInfo[0].author.username}.hashnode.com/${postInfo[0].slug}`) : item.url;
      delete item.url;
      console.log(`WORKING ON POST FROM (${source})[${postUrl}]: -- `, item.headTitle);
      let alternativeImage = item.headMetaOgImage;
      formattedPosts.push({
        title: postInfo[0].title,
        domain: isHashnode ? (postInfo[0].author.publicationDomain || `https://${postInfo[0].author.username}.hashnode.com`) : 'https://dev.to',
        description: isHashnode ? postInfo[0].brief : postInfo[0].description,
        url: postUrl,
        image: isHashnode ? (postInfo[0].coverImage || alternativeImage) : (postInfo[0].cover_image || alternativeImage),
        author: isHashnode ? postInfo[0].author.name : postInfo[0].user.name,
        datePublished: isHashnode ? postInfo[0].dateAdded : postInfo[0].published_at,
        ...item,
        source
      });
    });
    return resolve(formattedPosts);
  } catch(e) {
    console.log("Error logged: ", e);
  }

});

/**
 * @description This function sends an OTP password to the provided email account
 * @param { String } email => Receiver's email
 * @param { Number } otp => The one time password to be sent
 * @param { String } name => The name of the receiver of the email
 * @param { String } type => Type of OTP email to be sent
**/
const sendOtpEmail = (email, otp, name, type = "verification") => new Promise(async (resolve, reject) => {
  let emailMessage, customMessage = "";
  if(type === "verification"){
    emailMessage = `Verify your My Daily Reads account \n ${otp} \n Please use this OTP to verify your account and update your daily content keywords. \n This OTP expires after 15 minutes. \n `;
    customMessage = "Please use this OTP to verify your account and update your daily content keywords.";
  }
  if(type === "unsubscribe"){
    emailText = `Verify your My Daily Reads account. \n We have received a request to unsubscribe you from the My Daiy Reads service, please use this OTP to proceed. \n ${otp} \n \n This OTP expires after 15 minutes. \n `;
    customMessage = "We have received a request to unsubscribe you from the My Daiy Reads service, please use this OTP to proceed.";
  }
  const request = mailjet
    .post("send", {'version': 'v3.1'})
    .request({
      "Messages":[
        {
          "From": {
            "Email": process.env.MDR_FROM_EMAIL,
            "Name": "My Daily Reads"
          },
          "To": [
            {
              "Email": email,
              "Name": name
            }
          ],
          "Subject": "Verify your My Daily Reads account",
          "TextPart": emailMessage,
          "HTMLPart": otpEmailHtml(otp, email, customMessage)
        }
      ]
    })

  try {
    await request
    resolve(true);
  } catch(e) {
    console.log(e);
    resolve(false);
  }
});

/**
 * @description This function mails content emails to users
 * @param { Array } data => The array of emails to be sent
**/
const sendDailyContentEmails = (data) => new Promise(async (resolve, reject) => {
  let formattedData = data.map( x => {
    console.log("formattedData TO BE SENT AS EMAIL: ", {to: x.user.email, titles: JSON.stringify(x.content.map(z => z.title))});
    const textPart = x.content.map(x => `${x.title} \n ${x.url} \n ${x.description} \n by ${x.author} \n\n`);
    return {
      "From": {
        "Email": process.env.MDR_FROM_EMAIL,
        "Name": "My Daily Reads"
      },
      "To": [
        {
          "Email": x.user.email,
          "Name": x.user.name
        }
      ],
      "Subject": `Here are some interesting reads we've compiled for you for ${x.date}.`,
      "TextPart": `Here are some interesting reads we've compiled for you for ${x.date} \n\n ${textPart}`,
      "HTMLPart": ContentEmailHtml(x.content, x.keywords, x.user)
    };
  })
  // console.log("formattedData TO BE SENT AS EMAIL: ", formattedData);
  const request = mailjet
    .post("send", {'version': 'v3.1'})
    .request({
      "Messages": formattedData
    })
    
    resolve(true);

  try {
    await request
    resolve(true);
  } catch(e) {
    // console.log("formattedData TO BE SENT AS EMAIL: ", formattedData);
    console.log("GOT MAILJET ERROR: ", e);
    resolve(false);
  }
});

/**
 * @description This function sends a welcome email
 * @param { Object } user => user object
**/
const sendWelcomeEmail = (user) => new Promise(async (resolve, reject) => {
	let firstName = user.name.match(/^([\w]+)/gi)[0];
	let keywords = user.keywords.includes(",") ? user.keywords.replace(" ", "").split(",") : [user.keywords];
	let keywordsText = keywords.length > 1 ? (keywords.length > 1 ? `${keywords[0]} and ${keywords[1]}` : keywords[0]) : "the keywords you provided";
  const request = mailjet
    .post("send", {'version': 'v3.1'})
    .request({
      "Messages":[
        {
          "From": {
            "Email": process.env.MDR_FROM_EMAIL,
            "Name": "My Daily Reads"
          },
          "To": [
            {
              "Email": user.email,
              "Name": user.name
            }
          ],
          "Subject": "Congrats for subscribing to My Daily Reads",
          "TextPart": `Hello ${user.name.match(/^([\w]+)/gi)[0]}, you've successfully subscribed to My Daily Reads. \n We'll be sending you daily dev content tailored to ${keywordsText}.`,
          "HTMLPart": WelcomeEmailHtml(firstName, keywordsText, user.email)
        }
      ]
    })

  try {
    await request
    resolve(true);
  } catch(e) {
    console.log(e);
    resolve(false);
  }
});

/**
 * @description This function sends a farewell email
 * @param { Object } user => user object
**/
const sendFarewellEmail = (user) => new Promise(async (resolve, reject) => {
	let firstName = user.name.match(/^([\w]+)/gi)[0];
  const request = mailjet
    .post("send", {'version': 'v3.1'})
    .request({
      "Messages":[
        {
          "From": {
            "Email": process.env.MDR_FROM_EMAIL,
            "Name": "My Daily Reads"
          },
          "To": [
            {
              "Email": user.email,
              "Name": user.name
            }
          ],
          "Subject": "Tchao! " + firstName,
          "TextPart": `Hello ${firstName}, you've successfully unsubscribed from My Daily Reads. \n we're sad to see you go.`,
          "HTMLPart": FarewellEmailHtml(firstName)
        }
      ]
    })

  try {
    await request
    resolve(true);
  } catch(e) {
    console.log(e);
    resolve(false);
  }
});

module.exports = {
  formatDate,
  dateDifference,
  getPostValue,
  analysePostsByKeywords,
  formatPostsDataSchema,
  formatName,
  generateOTP,
  sendOtpEmail,
  sendDailyContentEmails,
  sendFarewellEmail,
  sendWelcomeEmail
}