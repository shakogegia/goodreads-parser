const parseElementValue = ({ document, query, content, attr, parser }) => {
  const elm = document.querySelector(query);
  if (elm) {
    let value = content ? elm[content] : elm.getAttribute(attr);
    value = value.trim();
    return parser ? parser(value) : value;
  }
  return;
};

const parseBookDataBoxValue = ({ document, query, parser }) => {
  const nodes = document.getElementById("bookDataBox").children;
  const tr = [...nodes].find((node) => node.textContent.toLowerCase().includes(query));

  if (tr && tr.children && tr.children[1]) {
    let value = tr.children[1].textContent;
    value = value.trim();
    return parser ? parser(value) : value;
  }

  return;
};

const parseGenres = ({ document }) => {
  const nodes = document.querySelectorAll('.brownBackground')
  const genresH2 = [...nodes].find((node) => node.textContent.toLowerCase().includes('genres'));
  
  if(!genresH2) return 
  
  const genresBox = genresH2.parentElement.parentElement
  
  if(!genresBox) return 

  const genreDivs = genresBox.querySelectorAll('.elementList .left')

  if(!genreDivs) return
  
  const genres = [...genreDivs].map(node => {
    return [...node.querySelectorAll('.bookPageGenreLink')]
      .map(a => a.textContent.trim())
      .join(' > ')
  })
  return genres
}

const parseBookPage = (document) => {
  const title = parseElementValue({
    document,
    query: "#bookTitle",
    content: "textContent",
  });

  const originalTitle = parseBookDataBoxValue({
    document,
    query: "original title",
  });

  const author = parseElementValue({
    document,
    query: ".authorName",
    content: "textContent",
  });

  const description = parseElementValue({
    document,
    query: "#description>span:nth-of-type(2)",
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
    parser: parseFloat,
  });

  const ratingCount = parseElementValue({
    document,
    query: '[itemprop="ratingCount"]',
    attr: "content",
    parser: parseInt,
  });

  const reviewsCount = parseElementValue({
    document,
    query: '[itemprop="reviewCount"]',
    attr: "content",
    parser: parseInt,
  });

  const pages = parseElementValue({
    document,
    query: '[itemprop="numberOfPages"]',
    content: "textContent",
    parser: parseInt,
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

  const genres = parseGenres({ document })

  const result = {
    title,
    originalTitle,
    author,
    description,
    cover,
    isbn13,
    pages,
    rating,
    ratingCount,
    reviewsCount,
    language,
    genres
  };

  return result;
};

module.exports = { parseBookPage };
