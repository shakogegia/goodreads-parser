const GoodReadsParser = require("../build/")


;(async () => {
  try {
    const data = await GoodReadsParser.search("three")
    console.log("Book Data::", data);

  } catch (error) {
    console.log("error", error);
  }
})();
