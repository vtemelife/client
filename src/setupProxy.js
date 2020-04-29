const proxy = require("http-proxy-middleware");

const proxyBaseConfig = {
  changeOrigin: true,
  secure: false
};

const proxyApiConfig = {
  ...proxyBaseConfig,
  target: process.env.API_SERVER
};

const proxySockjsConfig = {
  ...proxyBaseConfig,
  ws: true,
  target: process.env.SOCKJS_SERVER // tslint:disable-line
  // pathRewrite: { "^/sockjs": "/sockjs" }
};

module.exports = function(app) {
  // tslint:disable-next-line
  console.table({
    API_SERVER: process.env.API_SERVER,
    SOCKJS_SERVER: process.env.SOCKJS_SERVER
  });
  if (!process.env.API_SERVER) {
    // tslint:disable-next-line
    console.error("No environment variables set");
    process.exit(1);
  }
  app.use(proxy("/api/", proxyApiConfig));
  app.use(proxy("/admin/", proxyApiConfig));
  app.use(proxy("/server_static/", proxyApiConfig));
  app.use(proxy("/server_media/", proxyApiConfig));
  app.use(proxy("/sockjs/", proxySockjsConfig));
};
