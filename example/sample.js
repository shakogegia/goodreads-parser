const GoodReadsParser = require('../build/')

;(async () => {
  try {
    // await GoodReadsParser.searchBooks({ q: 'dark matter' })
    // await GoodReadsParser.searchBooks({ q: 'პურის ყანა' })
    const result = await GoodReadsParser.searchBooks({ q: 'Dark', page: 1 })
    // const result = await GoodReadsParser.getBook({ isbn: '1524759783' })
    console.log('result:', result)
  } catch (error) {
    console.log('error', error)
  }
})()
