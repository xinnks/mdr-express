// dev.to articles
const axios = require("axios");
const { analysePostsByKeywords } = require("./helpers")
let totalPosts = 0;
let analysedPosts = 0;

/**
 * @description This function fetches content from dev.to API
 * @param { Number } page => page count
 * @param { Number } date => post items per page
**/
const fetchDevToArticlesFromAPI = (page = 1, perPage = 20) => new Promise(async (resolve, reject) => {
  try {
    const { data } = await axios.get(`https://dev.to/api/articles/latest?page=${page}&per_page=${perPage}`)
    console.log("response: -- ", data.length)
    resolve(data)
  } catch(error) {
    console.log("error stack: -- ", error)
    reject(error)
  }
})

const rateDevToPostsByKeywords = (posts, keywords) => new Promise((resolve, reject) => {
  console.log("posts[# of posts]: -- ", posts.length)
  totalPosts = posts.length;
  const contentList = posts

  analysePostsByKeywords(contentList, keywords, analysedPosts, totalPosts, 'dev.to')
    .then(posts => {
      // console.log("SORTED ARTICLES: -- ", posts)
      resolve(posts)
    }).catch(error => {
      console.log("Error: -- ", error)
      reject(error)
    })
})

module.exports = {
  rateDevToPostsByKeywords,
  fetchDevToArticlesFromAPI
}