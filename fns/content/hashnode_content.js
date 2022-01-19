// fetches content from hashnode's featured articles
// Not currently utilized

const axios = require("axios");
const { analysePostsByKeywords } = require("./helpers")
let totalPosts = 0;
let analysedPosts = 0;

const GET_FEATURED_ARTICLES = `
  query {
    storiesFeed(type: FEATURED){
      title
      slug
      brief
      coverImage
      author{
        name
        publicationDomain
        username
      }
      dateAdded
      replyCount
      responseCount
      popularity
    }
  }
`;

// fetch articles
async function fetchHashnodePostsFromAPI(variables={}, query = GET_FEATURED_ARTICLES) {
  const {data} = await axios.post('https://api.hashnode.com/', {
    query,
    variables
  });

  return data;
}

const rateHashnodePostsByKeywords = (keywords) => new Promise((resolve, reject) => {
  fetchHashnodePostsFromAPI({ page: 1}, GET_FEATURED_ARTICLES)
    .then(async response => {
      console.log("response[# of posts]: -- ", response.data.storiesFeed.length)
      totalPosts = response.data.storiesFeed.length;
      const contentList = response.data.storiesFeed

      analysePostsByKeywords(contentList, keywords, analysedPosts, totalPosts, 'hashnode')
        .then(response => {
          // console.log("SORTED ARTICLES: -- ", response)
          resolve(response)
        }).catch(error => {
          console.log("Error: -- ", error)
          reject(error)
        })
    })
});

module.exports = {
  rateHashnodePostsByKeywords,
  fetchHashnodePostsFromAPI
}