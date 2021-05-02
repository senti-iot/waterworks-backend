const express = require('express')
const router = express.Router()

/**
 * Get benchmark
 * @param {UUIDv4} req.params.orguuid
 * @param {Date} req.params.from
 * @param {Date} req.params.to
 */
router.get('v3/benchmark/:orguuid/:from/:to', (req, res) => {
	let orgUUID = req.params.orguuid
	let startDate = req.params.from
	let endDate = req.params.to


	res.status(200)
})

/**
 * Get benchmark and UUIDS? @Mikkel
 * @param {Date} req.params.from
 * @param {Date} req.params.to
 * @param {Array<UUIDv4>} req.body - Device UUIDS
 */

router.post('v3/benchmark/:from/:to', (req, res) => {
	let startDate = req.params.from
	let endDate = req.params.to
	let deviceUUIDs = req.body

	res.status(200)
})

module.exports = router