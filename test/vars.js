const request = require('supertest')
const app = require('../server')
const bearerToken = process.env.BEARER_TOKEN
const agent = request.agent(app)


module.exports.agent = agent
module.exports.bearerToken = bearerToken
