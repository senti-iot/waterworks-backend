const express = require('express')
const router = express.Router()
const sentiEventService = require('../../lib/eventService')
let eService = null

router.all('/v3/events*', async (req, res, next) => {
	eService = new sentiEventService()
	console.log()
	next()
})

router.get('/v3/events/get-user-uuid/:deviceUUID', async (req, res) => {
	let deviceUUID = req.params.deviceUUID
	if (eService && deviceUUID) {
		let resp = await eService.getUserUUID(deviceUUID)
		return res.status(200).json({ deviceUUID: resp })
	}
	else {
		return res.status(500).json({"Error": "eService or DeviceUUID is null"})
	}
})

module.exports = router