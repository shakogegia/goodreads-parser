const GoodReadsParser = require("./index");

;(async () => {
  try {
    const data = await GoodReadsParser.parseByISBN13("9781788543002" );
    console.log("Book Data::", data);
  } catch (error) {
    console.log("error", error);
  }
})();
