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

  const { document, responseUrl } = await fetch(url)

  const el = element(document)

  function dataBoxValue(query: string) {
    const nodes = el.queryAll('div')
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
    id: responseUrl?.split('show/')[1]?.split('-')[0],
    url: el.query('[hreflang="en"]')?.attr('href') || responseUrl,
    title: el.query('.Text__title1')?.text(),
    originalTitle: dataBoxValue('original title'),
    originalUrl: dataBoxValue('url'),
    author: el.query('[data-testid=name]')?.text(),
    description: el
      .query('.DetailsLayoutRightParagraph__widthConstrained')
      ?.text(),
    coverSmall: el.query('.BookCover__image>div>img')?.attr('src'),
    coverLarge: cover(el.query('.BookCover__image>div>img')?.attr('src')),
    isbn: dataBoxValue('isbn')?.split('(')[0]?.escape(),
    isbn13: el.query('[itemprop="isbn"]')?.text(),
    pages: el.query('.pagesFormat')?.text().toInt(),
    rating: el.query('.RatingStatistics__rating')?.text().toFloat(),
    ratingCount: el.query('[data-testid=ratingsCount]')?.text().toFloat(),
    reviewsCount: el.query('[data-testid=reviewsCount]')?.text().toFloat(),
    language: el.query('[itemprop="inLanguage"]')?.text(),
    genres: genres(),
    altCovers: Array.from(el.queryAll('.otherEdition img')).map((img) =>
      cover(element(img)?.attr('src'))
    ),
  }

  return result as any
}
