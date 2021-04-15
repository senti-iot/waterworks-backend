const request = require('supertest')
const app = require('../server')
require('mysql2/node_modules/iconv-lite').encodingExists('foo');

describe('Get Installation',  () => {
	let instUUID = null
	it('should create', async () => {
		const res = await request(app)
			.put('/v3/installation').type('json').send({
				address: "Schubertstr",
				orgUUID: "d866eb04-90d4-436c-9cc8-bd593258c54f", //Webhouse ApS UUID
				state: 2,
				adults: 1,
				children: 3
			})
		expect(res.statusCode).toEqual(200)
		expect(res.body.address).toEqual('Schubertstr')
		instUUID = res.body.uuid
	} )
	it('should get', async () => {
		expect(instUUID).not.toBeNull()
		const res = await request(app)
			.get(`/v3/installation/${instUUID}`).send()
		expect(res.statusCode).toEqual(200)
		expect(res.body.address).toEqual('Schubertstr')
		expect(res.body.uuid).toEqual(instUUID)
		// expect(res.body).toHaveProperty('get')
	})
})

afterAll(async () => {
	await new Promise(resolve => setTimeout(() => resolve(), 500)) // avoid jest open handle error
});