const vars = require('./vars')
const agent = vars.agent
const bearerToken = vars.bearerToken

describe('Installation CRUD',  () => {
	let instUUID = null
	it('should create', async () => {
		const res = await agent
			.put('/v3/installation').type('json')
			.set('Authorization', `Bearer ${bearerToken}`)
			.send({
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
		const res = await agent
			.get(`/v3/installation/${instUUID}`)
			.set('Authorization', `Bearer ${bearerToken}`)
			.send()
		expect(res.statusCode).toEqual(200)
		expect(res.body.address).toEqual('Schubertstr')
		expect(res.body.uuid).toEqual(instUUID)
		// expect(res.body).toHaveProperty('get')
	})
	it('should edit', async () => {
		expect(instUUID).not.toBeNull()
		let editInst = {
			uuid: instUUID,
			address: "FakeAddress",
			orgUUID: "d866eb04-90d4-436c-9cc8-bd593258c54f", //Webhouse ApS UUID
			state: 0,
			adults: 2,
			children: 0
		}
		const res = await agent
			.post(`/v3/installation`)
			.set('Authorization', `Bearer ${bearerToken}`)
			.type('json').send(editInst)
		expect(res.statusCode).toEqual(200)
		expect(res.body.address).toEqual('FakeAddress')
		expect(res.body.state).toEqual(0)
		expect(res.body.adults).toEqual(2)
		expect(res.body.children).toEqual(0)
		expect(res.body.uuid).toEqual(instUUID)
	})
	it('should delete', async () => {
		expect(instUUID).not.toBeNull()
		const res = await agent
			.delete(`/v3/installation/${instUUID}`)
			.set('Authorization', `Bearer ${bearerToken}`)
			.send()
		expect(res.statusCode).toEqual(200)

	})
	it('should not get deleted installation', async () => {
		expect(instUUID).not.toBeNull()
		const res = await agent
			.get(`/v3/installation/${instUUID}`)
			.set('Authorization', `Bearer ${bearerToken}`)
			.send()
			console.log(res.statusCode)
		expect(res.statusCode).not.toEqual(200)
		// expect(res.body).toHaveProperty('get')
	})
})

afterAll(async () => {
	await new Promise(resolve => setTimeout(() => resolve(), 1000)) // avoid jest open handle error
});