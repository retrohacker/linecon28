const crypto = require("crypto");
const uuid = require('uuid');
const { promisify } = require('util');
const redis = require('./redis.js');

module.exports = async fastify => {
  fastify.post("/api/login", async function(request, reply) {
    const { uid } = request.body;
    const hash = crypto
      .createHash("sha512")
      .update(uid)
      .digest("hex");
    const peerid = await redis.get(`peerid:${uid}`);
    if (!peerid) {
      return reply.redirect('/login');
    }
    const token = uuid.v4();
    await redis.set(`token:${token}`, uid);
    return reply
      .setCookie("auth-token", token)
      .setCookie("peerid", peerid)
      .redirect("/chat")
      .send();
  });
};
