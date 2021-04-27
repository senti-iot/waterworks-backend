const express = require('express')
const router = express.Router()
const sentiInstDeviceService = require('../../lib/instDeviceService')
let instDeviceService = null


/**
 * Set the auth bearer Token to serviceClass
 */
router.all('/v3/installation', async (req, res, next) => {
	instDeviceService = new sentiInstDeviceService(req.headers.authorization)
	console.log(req.headers.authorization)
	next()
})

/**
 * Get Installation Devices
 * @param {UUIDv4} req.params.uuid
 */
router.get('v3/installation/:uuid/devices', (req, res) => {
	let installationUUID = req.params.uuid

	res.status(200)
})

/**
 * Get Installation Devices
 * @param {UUIDv4} req.params.uuid
 * @param {UUIDv4} req.params.deviceuuid
 */
router.get('v3/installation/:uuid/device/:deviceuuid', (req, res) => {
	let installationUUID = req.params.uuid
	let deviceUUID = req.params.deviceuuid

	res.status(200)
})

/**
 * Create Device under Installation
 * @param {UUIDv4} req.params.uuid
 * @param {UUIDv4} req.params.deviceuuid
 * @param {Object} req.body - Device object + from/to
 */
router.put('v3/installation/:uuid/device/:deviceuuid', (req, res) => {
	let installation = req.body
	let installationUUID = req.params.uuid
	let deviceUUID = req.params.deviceuuid


	res.status(200)
})

/**
 * Edit Installation
 * @param {UUIDv4} req.params.uuid
 * @param {UUIDv4} req.params.deviceuuid
 * @param {Object} req.body - Device object + from/to
 */
router.post('v3/installation/:uuid/device/:deviceuuid', (req, res) => {
	let installation = req.body
	let installationUUID = req.params.uuid
	let deviceUUID = req.params.deviceuuid

	res.status(200)
})

/**
 * Delete Installation
 * @param {UUIDv4} req.params.uuid
 * @param {UUIDv4} req.params.deviceuuid
 */
router.delete('v3/installation/:uuid/device/:deviceuuid', (req, res) => {
	let installationUUID = req.params.uuid

	res.status(200)
})

module.exports = router