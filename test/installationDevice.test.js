const vars = require('./vars')
const agent = vars.agent
const bearerToken = vars.bearerToken

describe('Installation Device CRUD', () => {
	let demoDeviceUUID = '8806a3dc-952c-4d78-8caf-ea71078bed96'
	let instUUID = null
	let instDevice1 = null
	let instDevice2 = null
	it('should create installation', async () => {
		const res = await agent
			.put('/v3/installation').type('json')
			.set('Authorization', `Bearer ${bearerToken}`)
			.send({
				address: "Schubertstr",
				orgUUID: "d866eb04-90d4-436c-9cc8-bd593258c54f", //Webhouse ApS UUID
				state: 1,
				moving: 0,
				operation: 1
			})
		expect(res.statusCode).toEqual(200)
		expect(res.body.address).toEqual('Schubertstr')
		instUUID = res.body.uuid

	})
	it('should create device without end date', async () => {
		const res = await agent
			.put('/v3/installation/device').type('json')
			.set('Authorization', `Bearer ${bearerToken}`)
			.send({
				startDate: "2020-01-01 00:00:00",
				endDate: null,
				deviceUUID:demoDeviceUUID,
				instUUID: instUUID,
			})
		expect(res.statusCode).toEqual(200)
		expect(res.body.instUUID).toEqual(instUUID)
		console.log(res.body)

	})
	it('should create device with end date', async () => {
		const res = await agent
			.put('/v3/installation/device').type('json')
			.set('Authorization', `Bearer ${bearerToken}`)
			.send({
				startDate: "2020-01-01 00:00:00",
				endDate: '2021-01-01 00:00:00',
				deviceUUID: demoDeviceUUID,
				instUUID: instUUID,
			})
		expect(res.statusCode).toEqual(200)
		expect(res.body.instUUID).toEqual(instUUID)
		instDevice1 = res.body
		console.log(res.body)

	})
	it('should edit', async () => {
		expect(instUUID).not.toBeNull()
		console.log('instDevice',instDevice1)
		let editInst = {
			startDate: "2021-01-01 00:00:00",
			endDate: '2022-01-01 00:00:00',
			deviceUUID: demoDeviceUUID,
			instUUID: instUUID,
			uuid: instDevice1.uuid
		}
		console.log("EditInst", editInst)
		const res = await agent
			.post(`/v3/installation/device`)
			.set('Authorization', `Bearer ${bearerToken}`)
			.type('json').send(editInst)
		expect(res.statusCode).toEqual(200)

	})
	// it('should delete', async () => {
	// 	expect(instUUID).not.toBeNull()
	// 	const res = await request(app)
	// 		.delete(`/v3/installation/${instUUID}`)
	// 		.set('Authorization', `Bearer ${bearerToken}`)
	// 		.send()
	// 	expect(res.statusCode).toEqual(200)

	// })
	// it('should not get deleted installation', async () => {
	// 	expect(instUUID).not.toBeNull()
	// 	const res = await request(app)
	// 		.get(`/v3/installation/${instUUID}`)
	// 		.set('Authorization', `Bearer ${bearerToken}`)
	// 		.send()
	// 	console.log(res.statusCode)
	// 	expect(res.statusCode).not.toEqual(200)
	// 	// expect(res.body).toHaveProperty('get')
	// })
})

afterAll(async () => {
	await new Promise(resolve => setTimeout(() => resolve(), 1000)) // avoid jest open handle error
})