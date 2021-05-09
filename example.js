const goodreadsParser = require("./index");

;(async () => {
  try {
    const data = await goodreadsParser({ isbn13: "9781788543002" });
    console.log("Book Data::", data);
  } catch (error) {
    console.log("error", error);
  }
})();
