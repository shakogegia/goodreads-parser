import { element } from '../parsers/element'
import cover from '../utils/cover'
import fetch from '../utils/fetch'

type Params = {
  url?: string
  isbn?: string
  isbn13?: string
}

type Book = {
  id: string
  url: string
  title: string
  originalTitle: string | null
  originalUrl: string | null
  author: string | null
  description: string | null
  coverSmall: string | null
  coverLarge: string | null
  isbn: string | null
  isbn13: string | null
  pages: number | null
  rating: number | null
  ratingCount: number | null
  reviewsCount: number | null
  language: string | null
  genres: string[][] | null
  altCovers: string[] | null
}

export default async function getBook(params: Params): Promise<Book> {
  if (!params.isbn13 && !params.isbn && !params.url) {
    throw new Error('No params provided')
  }

  const url =
    params.url ||
    'https://www.goodreads.com/search?q=' +
      encodeURIComponent(params.isbn13 || params.isbn)

  const document = await fetch(url)

  const el = element(document)

  function dataBoxValue(query: string) {
    const nodes = el.queryAll('.infoBoxRowTitle')
    const tr = Array.from(nodes).find((node) =>
      node?.textContent?.toLowerCase().includes(query)
    )

    if (tr && tr.parentNode) {
      const td = tr.parentNode.querySelector('.infoBoxRowItem')
      return element(td).text()
    }
    return null
  }

  function genres() {
    const nodes = el.queryAll('.brownBackground')
    const genresBox = Array.from(nodes).find((node) =>
      node?.textContent?.toLowerCase().includes('genres')
    )?.parentElement?.parentElement

    if (!genresBox) return

    const genres = Array.from(
      genresBox.querySelectorAll('.elementList .left')
    ).map((node) => {
      return Array.from(node.querySelectorAll('.bookPageGenreLink')).map((a) =>
        a?.textContent?.trim().escape()
      )
    })
    return genres
  }

  const result = {
    id: el.query('#book_id')?.attr('value'),
    url: el.query('[hreflang="en"]')?.attr('href'),
    title: el.query('#bookTitle')?.text(),
    originalTitle: dataBoxValue('original title'),
    originalUrl: dataBoxValue('url'),
    author: el.query('.authorName')?.text(),
    description: el.query('#description>span:nth-of-type(2)')?.text(),
    coverSmall: el.query('#coverImage')?.attr('src'),
    coverLarge: cover(el.query('#coverImage')?.attr('src')),
    isbn: dataBoxValue('isbn')?.split('(')[0]?.escape(),
    isbn13: el.query('[itemprop="isbn"]')?.text(),
    pages: el.query('[itemprop="numberOfPages"]')?.text().toInt(),
    rating: el.query('[itemprop="ratingValue"]')?.text().toFloat(),
    ratingCount: el.query('[itemprop="ratingCount"]')?.text().toFloat(),
    reviewsCount: el.query('[itemprop="reviewCount"]')?.text().toFloat(),
    language: el.query('[itemprop="inLanguage"]')?.text(),
    genres: genres(),
    altCovers: Array.from(el.queryAll('.otherEdition img')).map((img) =>
      cover(element(img)?.attr('src'))
    ),
  }

  return result
}
