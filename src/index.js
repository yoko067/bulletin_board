"use strict";

const app = require("./app");

const main = async () => {
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });
};

main();
