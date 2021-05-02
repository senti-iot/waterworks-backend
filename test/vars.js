const request = require('supertest')
const app = require('../server')
const bearerToken = process.env.BEARER_TOKEN
const agent = request.agent(app)
const orgUUID = 'd866eb04-90d4-436c-9cc8-bd593258c54f'

module.exports.agent = agent
module.exports.bearerToken = bearerToken
module.exports.orgUUID = orgUUID