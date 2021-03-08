const express = require('express')
const router = express.Router()

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