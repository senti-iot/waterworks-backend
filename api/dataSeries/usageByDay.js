const express = require('express')
const databrokerAPI = require('../../lib/api/dataBroker')
const router = express.Router()

/**
 * Get usage by hour
 * @param {UUIDv4} req.params.uuid
 * @param {Date} req.params.from
 * @param {Date} req.params.to
 */
router.get('/v3/usage/byday/:uuid/:from/:to', async (req, res) => {
	let UUID = req.params.uuid
	let startDate = req.params.from
	let endDate = req.params.to

	let response = await databrokerAPI.post(`/v2/waterworks/data/usagebyday/${startDate}/${endDate}`, uuids)
	if (response.ok) {
		res.status(200).json(response.data)
	}
	else {
		res.status(500).json({"error": "error"})
	}

})


module.exports = router