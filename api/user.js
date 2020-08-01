const crypto = require("crypto");
const uuid = require('uuid');
const { promisify } = require('util');
const redis = require('./redis.js');

module.exports = async fastify => {
  fastify.post("/api/user", async function(request, reply) {
    const { uid } = request.body;
    const hash = crypto
      .createHash("sha512")
      .update(uid)
      .digest("hex");
    const exists = await redis.get(`peerid:${uid}`);
    let peerid = exists
    if (!exists) {
      peerid = uuid.v4()
      await redis.set(`peerid:${uid}`, peerid);
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
