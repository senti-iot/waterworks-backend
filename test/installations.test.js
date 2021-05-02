const vars = require('./vars')
const agent = vars.agent
const bearerToken = vars.bearerToken
const orgUUID = vars.orgUUID
var expect = require('chai').expect

describe('Installation CRUD',  () => {
	let instUUID = null
	it('should get all installations', async () => {
		const res = await agent
			.get(`/v3/installations/${orgUUID}`).type('json')
			.set('Authorization', `Bearer ${bearerToken}`)
			.send()
		expect(res.statusCode).equal(200)
		expect(res.body).to.be.an('array')
		// expect(res.body).toEqual('Schubertstr')
		// instUUID = res.body.uuid
	} )

})

afterAll(async () => {
	await new Promise(resolve => setTimeout(() => resolve(), 1000)) // avoid jest open handle error
});