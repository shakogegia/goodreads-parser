const GoodReadsParser = require("../build/")


;(async () => {
  try {
    const data = await GoodReadsParser.search("dark matter")
    console.log("Book Data::", data);

  } catch (error) {
    console.log("error", error);
  }
})();
