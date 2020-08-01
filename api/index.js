const server = (module.exports = require("fastify")({
  logger: true
}));

server.register(require("fastify-formbody"));
server.register(require("fastify-cookie"));
server.register(require("./user.js"));
server.register(require("./login.js"));
server.listen(8000)
