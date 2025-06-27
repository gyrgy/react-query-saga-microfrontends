const express = require("express");
const path = require("path");
require("dotenv").config();
const cors = require("cors");

const serveLocal = (port = 3000, context = __dirname) => {
  const app = express();

  const buildPath = path.resolve(context, "build");

  app.use(cors());
  app.use(express.static(buildPath));

  app.get("*", (_, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

module.exports = serveLocal;
