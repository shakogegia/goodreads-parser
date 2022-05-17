const GoodReadsParser = require('../build/')

;(async () => {
  try {
    // const result = await GoodReadsParser.searchBooks({ q: 'Dark', page: 2 })
    const result = await GoodReadsParser.getBook({ isbn: '1524759783' })
    console.log('result:', result)
  } catch (error) {
    console.log('error', error)
  }
})()
