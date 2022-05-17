const GoodReadsParser = require('../build/')

;(async () => {
  try {
    const result = await GoodReadsParser.searchBooks({ q: 'Dark', page: 2 })
    console.log('result:', result)
  } catch (error) {
    console.log('error', error)
  }
})()
