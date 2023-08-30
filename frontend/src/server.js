const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const serveStatic = require("serve-static");

const app = express();
const port = 5051;

const apiProxy = createProxyMiddleware("/api", {
  target: "http://localhost:8080",
  changeOrigin: true,
  pathRewrite: {
    "^/api": "/api",
  },
});

app.use("/api", apiProxy);

app.use(serveStatic("dist"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
