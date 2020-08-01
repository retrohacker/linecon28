const redis = require('redis')
const client = redis.createClient({
  path: '/tmp/redis.sock'
})
const { promisify } = require('util')

module.exports = {
  get: promisify(client.get).bind(client),
  set: promisify(client.set).bind(client)
}
