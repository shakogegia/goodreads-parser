import { AxiosResponse } from "axios";

type ParseElementValueProps = {
  document?: Document;
  element?: Element;
  query: string;
  content?: string;
  attr?: string;
  parser?: (value: string) => string | number;
}

function parseElementValue({ document, element, query, content, attr, parser }: ParseElementValueProps){
  const el = (document || element).querySelector(query);
  if (el) {
    let value = content ? el[content] as string | undefined : el.getAttribute(attr);
    if(value) {
      value = value.trim();
      return parser ? parser(value) : value;
    }
  }
  return;
};

function parseBookDataBoxValue({ document, query }: { document: Document; query: string }) {
  const nodes = document.getElementById("bookDataBox").children;
  const tr = Array.from(nodes).find((node) => node.textContent.toLowerCase().includes(query));

  if (tr && tr.children && tr.children[1]) {
    const value = tr.children[1].textContent;
    if(value) {
      return value.trim();
    }
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

export function parseBookPage(document: Document){
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

export function getIdAndUrl(response: AxiosResponse<unknown>){
  const url = response.request.res.responseUrl as string
  let id = ''
  
  let urlParts: string[] = url.split('book/show/')

  if (urlParts.length > 1) {
    const urlPart = urlParts[1]

    if (urlPart.split('.').length > 1) {
      id = urlPart.split('.')[0]
    } else if (urlPart.split('-').length > 1) {
      id = urlPart.split('-')[0]
    } else {
      id = parseInt(urlPart, 10).toString()
    }
  }

  return ({ id, url})
}


export function parseSearchResult(document: Document){
  const trs = document.querySelectorAll('[itemtype^="http://schema.org/Book"]')

  const result = Array.from(trs).map(tr => {
    const meta  = parseElementValue({ element: tr, query: 'td:nth-child(2) .minirating', content: 'textContent' }) as string
    // 4.58 avg rating — 3,432,135 ratings
    return ({
      title: parseElementValue({ element: tr, query: 'td:first-of-type a', attr: 'title' }),
      author: parseElementValue({ element: tr, query: '.authorName__container', content: 'textContent' }),
      rating: parseFloat(meta.split('avg')[0].trim()),
      ratingCount: parseInt(meta.split('avg rating — ')[1].trim()),
      cover: parseElementValue({ element: tr, query: 'td:first-of-type img', attr: 'src' }),
    })
  })

  return result
}