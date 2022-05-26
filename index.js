const axios = require("axios");
const jsdom = require("jsdom");
const { parseBookPage, parseAuthorPage } = require("./utils");
const { JSDOM } = jsdom;

const getResult = (result, response) => {
  const url = response.request.res.responseUrl
  let id = ''
  
  let urlParts = url.split('/show/')
  if (urlParts.length > 1) {
    urlParts = urlParts[1]
    if (urlParts.split('.').length > 1) {
      id = urlParts.split('.')[0]
    } else if (urlParts.split('-').length > 1) {
      id = urlParts.split('-')[0]
    } else {
      id = parseInt(urlParts)
    }
  }

  return ({ ...result, id, url})
}

module.exports.parseByISBN13 = async isbn13 => {
  try {
    const response = await axios.get("https://www.goodreads.com/search?q="+isbn13);
    const { data, ...da } = response
    

    
    const dom = new JSDOM(response.data);
    const { document } = dom.window;
    const result = parseBookPage(document);
    return getResult(result, response)
  } catch (error) {
    throw error;
  }
};

module.exports.parseByURL = async url => {
  try {
    const response = await axios.get(url);
    const dom = new JSDOM(response.data);
    const { document } = dom.window;
    const result = parseBookPage(document);
    return getResult(result, response)
  } catch (error) {
    throw error;
  }
};

module.exports.parseAuthorByURL = async url => {
  try {
    const response = await axios.get(url);
    const dom = new JSDOM(response.data);
    const { document } = dom.window;
    const result = parseAuthorPage(document);
    return getResult(result, response)
  } catch (error) {
    throw error;
  }
};
