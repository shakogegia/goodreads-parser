const axios = require("axios");
const jsdom = require("jsdom");
const { parseBookPage } = require("./utils");
const { JSDOM } = jsdom;

module.exports.parseByISBN13 = async isbn13 => {
  try {
    const response = await axios.get("https://www.goodreads.com/search?q="+isbn13);
    const dom = new JSDOM(response.data);
    const { document } = dom.window;
    const result = parseBookPage(document);
    return result;
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
    return result;
  } catch (error) {
    throw error;
  }
};
