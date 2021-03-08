const express = require('express');
const router = express.Router();

/**
 * Get usage by hour
 * @param {UUIDv4} req.params.uuid
 * @param {Date} req.params.from
 * @param {Date} req.params.to
 */
router.get('v3/usage/byhour/:uuid/:from/:to', (req, res) => {
	let UUID = req.params.uuid
	let startDate = req.params.from
	let endDate = req.params.to


	res.status(200)
})


module.exports = router