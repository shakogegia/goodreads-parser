import { element } from '../parsers/element'
import cover from '../utils/cover'
import fetch from '../utils/fetch'

type SearchBooksProps = {
  q: string
  page?: number
  field?: 'title' | 'author' | 'genre'
}

type SearchBooksResult = {
  page: number
  totalRecords: number
  books: SearchBookItem[]
}

type SearchBookItem = {
  id: string
  url: string
  title: string
  author: string
  cover: string
  rating: number
  ratingCount: number
  publicationYear: number
}

export default async function searchBooks({
  q,
  page,
  field,
}: SearchBooksProps): Promise<SearchBooksResult> {
  const document = await fetch(`https://goodreads.com/search`, {
    q,
    page,
    field,
  })

  const resultInfo = element(document).query('.searchSubNavContainer').text()

  const [pageInfo, totalInfo] = resultInfo.split('of about')

  const trs = document.querySelectorAll('[itemtype^="http://schema.org/Book"]')

  const books = Array.from(trs).map((tr) => {
    const el = element(tr)
    const ratingStr = el
      .query('td:nth-child(2) .minirating')
      .text()
      .split('avg rating — ')

    return {
      title: el.query('td:first-of-type a')?.attr('title'),
      author: el.query('.authorName__container').text(),
      rating: ratingStr[0].toFloat(),
      ratingCount: ratingStr[1].toInt(),
      cover: cover(el.query('td:first-of-type img').attr('src')),
      publicationYear: el
        .query('.greyText.smallText.uitext')
        .textContent()
        .between('published', '—')
        .toInt(),
      url: 'https://goodreads.com/' + el.query('.bookTitle').attr('href'),
      id: el
        .query('.bookTitle')
        .attr('href')
        .split('&')[0]
        .replace('/book/show/', ''),
    }
  })

  return {
    page: pageInfo.toInt(),
    totalRecords: totalInfo.split('results')[0].toInt(),
    books,
  }
}
