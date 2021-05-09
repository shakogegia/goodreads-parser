# goodreads-parser

Goodreads book parser for Node.js

### Install

```bash
yarn add goodreads-parser
```

### Usage
First, import library

```js
const goodreadsParser = require('goodreads-parser)
```

Usage example

```jsx
try {
  const data = await goodreadsParser({ isbn13: "9781788543002" });
  console.log("Book Data::", data);
} catch (error) {
  console.log("error", error);
}
```

Example response:

```json
{
  "title": "The Three-Body Problem",
  "author": "Liu Cixin",
  "description": "1967: Ye Wenjie witnesses Red Guards beat her father to death during China's Cultural Revolution. This singular event will shape not only the rest of her life but also the future of mankind",
  "cover": "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1545742427l/36262331._SY475_.jpg",
  "isbn13": "9781788543002",
  "pages": 434,
  "rating": 4.06,
  "ratingCount": 173247,
  "reviewsCount": 17086,
  "language": undefined
}
```