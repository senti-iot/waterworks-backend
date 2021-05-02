const express = require('express')
const router = express.Router()
const sentiInstDeviceService = require('../../lib/instDeviceService')
// let instDeviceService = null

let instDeviceService = new sentiInstDeviceService()

/**
 * Set the auth bearer Token to serviceClass
 */
router.all('/v3/installation*', async (req, res, next) => {
	instDeviceService = new sentiInstDeviceService(req.headers.authorization)
	console.log(req.headers.authorization)
	next()
})

/**
 * Get Installation Devices
 * @param {UUIDv4} req.params.uuid
 */
router.get('/v3/installation/:uuid/devices', (req, res) => {
	let installationUUID = req.params.uuid
	// let instDevice = instDeviceService.
	res.status(200)
})

/**
 * Get Installation Devices
 * @param {UUIDv4} req.params.uuid
 * @param {UUIDv4} req.params.deviceuuid
 */
router.get('/v3/installation/device/:uuid', async (req, res) => {
	// let installationUUID = req.params.uuid
	let deviceUUID = req.params.deviceuuid
	let instDevice = await instDeviceService.getInstDeviceByUUID(deviceUUID)
	if (instDevice) {
		return res.status(200).json(instDevice)
	}
	res.status(500)
})

/**
 * Create Device under Installation
 * @param {UUIDv4} req.params.uuid
 * @param {UUIDv4} req.params.deviceuuid
 * @param {Object} req.body - Device object + from/to
 */
router.put('/v3/installation/device', async (req, res) => {
	let instDevice = req.body
	// let deviceUUID = req.params.deviceuuid
	let fInstDevice = await instDeviceService.createInstDevice(instDevice)
	console.log('fInstDevice', JSON.stringify(fInstDevice))
	if (fInstDevice) {

		return res.status(200).json(fInstDevice)
	}
	res.status(500)
})

/**
 * Edit Installation Device
 * @param {UUIDv4} req.params.uuid
 * @param {Object} req.body - Device object + from/to
 */
router.post('/v3/installation/device', async (req, res) => {
	let instDevice = req.body
	console.log(instDevice)
	let fInstDevice = await instDeviceService.editInstDevice(instDevice)
	if (fInstDevice) {
		return res.status(200).json(fInstDevice)
	}
	return res.status(500)
})

/**
 * Delete Installation
 * @param {UUIDv4} req.params.uuid
 * @param {UUIDv4} req.params.deviceuuid
 */
router.delete('v3/installation/device/:deviceuuid', (req, res) => {
	let installationUUID = req.params.uuid

	res.status(200)
})

module.exports = router