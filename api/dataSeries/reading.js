const express = require('express')
const router = express.Router()

/**
 * Get reading of a device
 * @param {UUIDv4} req.params.uuid
 * @param {Date} req.params.from
 * @param {Date} req.params.to
 */
router.get('v3/reading/:uuid/:from/:to', (req, res) => {
	let uuid = req.params.uuid
	let startDate = req.params.from
	let endDate = req.params.to


	res.status(200)
})


module.exports = router