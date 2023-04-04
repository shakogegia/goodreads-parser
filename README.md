# goodreads-parser

Goodreads book parser for Node.js

### Install

```bash
yarn add goodreads-parser
```

### Usage

First, import library

```js
const GoodReadsParser = require("goodreads-parser");

try {
  const data = await GoodReadsParser.getBook({ isbn: '1524759783' });
  console.log("Book Data::", data);
} catch (error) {
  console.log("error", error);
}
```

Response:

```js
{
  title: 'The Three-Body Problem',
  originalTitle: '三体',
  author: 'Liu Cixin',
  description: `"1967: Ye Wenjie witnesses Red Guards beat her father to death during China's Cultural Revolution. This singular event will shape not only the rest of her life but also the future of mankind.<br><br>Four decades later, Beijing police ask nanotech engineer Wang Miao to infiltrate a secretive cabal of scientists after a spate of inexplicable suicides. Wang's investigation will lead him to a mysterious online game and immerse him in a virtual world ruled by the intractable and unpredicatable interaction of its three suns.<br><br>This is the Three-Body Problem and it is the key to everything: the key to the scientists' deaths, the key to a conspiracy that spans light-years and the key to the extinction-level threat humanity now faces."`,
  cover: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1545742427l/36262331._SY475_.jpg',
  isbn13: '9781788543002',
  pages: 434,
  rating: 4.06,
  ratingCount: 173247,
  reviewsCount: 17086,
  language: undefined,
  genres: [
    'Science Fiction',
    'Fiction',
    'Cultural > China',
    'Science Fiction Fantasy',
    'Audiobook',
    'Fantasy',
    'Science Fiction > Aliens',
    'Novels',
    'Speculative Fiction',
    'Cultural > Asia'
  ],
  id: '36262331',
  url: 'https://www.goodreads.com/book/show/36262331-the-three-body-problem'
}
```

### API

You can fetch book data by providing ISBN13 or just the url of the book in format like this: `https://www.goodreads.com/book/show/{ID}`

#### By ISBN13

```js
const result = await GoodReadsParser.getBook({ isbn: '1524759783' });
```

#### By URL

```js
const result = await GoodReadsParser.getBook({ url: "https://www.goodreads.com/book/show/36262331-the-three-body-problem" });
```
