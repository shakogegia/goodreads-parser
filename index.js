const axios = require("axios");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const parseElementValue = ({ document, query, content, attr, parser }) => {
  const elm = document.querySelector(query);
  if (elm) {
    let value = content ? elm[content] : elm.getAttribute(attr);
    value = value.trim();
    return parser ? parser(value) : value;
  }
  return;
};

const init = async (options) => {
  try {
    const response = await axios.get(
      "https://www.goodreads.com/search?q=" + options.isbn13
    );

    const dom = new JSDOM(response.data);

    const { document } = dom.window;

    const title = parseElementValue({
      document,
      query: "#bookTitle",
      content: "textContent",
    });

    const author = parseElementValue({
      document,
      query: ".authorName",
      content: "textContent",
    });

    const description = parseElementValue({
      document,
      query: "#description",
      content: "innerHTML",
    });

    const cover = parseElementValue({
      document,
      query: "#coverImage",
      attr: "src",
    });

    const rating = parseElementValue({
      document,
      query: '[itemprop="ratingValue"]',
      content: "textContent",
      parser: parseFloat
    });

    const ratingCount = parseElementValue({
      document,
      query: '[itemprop="ratingCount"]',
      attr: "content",
      parser: parseInt
    });
    
    const reviewsCount = parseElementValue({
      document,
      query: '[itemprop="reviewCount"]',
      attr: "content",
      parser: parseInt
    });

    const pages = parseElementValue({
      document,
      query: '[itemprop="numberOfPages"]',
      content: "textContent",
      parser: parseInt
    });

    const isbn13 = parseElementValue({
      document,
      query: '[itemprop="isbn"]',
      content: "textContent",
    });

    const language = parseElementValue({
      document,
      query: '[itemprop="inLanguage"]',
      content: "textContent",
    });

    const result = {
      title,
      author,
      description,
      cover,
      isbn13,
      pages,
      rating,
      ratingCount,
      reviewsCount,
      language,
    };

    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = init