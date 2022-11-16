const express = require('express')
const router = express.Router()

const dataBrokerAPI = require('../../lib/api/dataBroker')

router.get('/v4/device/:uuid', async (req, res) => {
	dataBrokerAPI.setHeader('Authorization', "Bearer " + req.lease.token)
	const device = await dataBrokerAPI.get('/v2/device/' + req.params.uuid).then(r => r.data)

	if (!device) {
		return res.status(404);
	} else {
		return res.status(200).json(device)
	}
})

router.get('/v4/devices', async (req, res) => {
	dataBrokerAPI.setHeader('Authorization', "Bearer " + req.lease.token)
	const devices = await dataBrokerAPI.get('/v2/devices').then(r => r.data)

	if (!devices) {
		return res.status(404);
	} else {
		return res.status(200).json(devices)
	}
})

module.exports = router
