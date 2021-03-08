const express = require('express')
const router = express.Router()

/**
 * Get Installation
 * @param {UUIDv4} req.params.uuid
 */
router.get('v3/installation/:uuid', (req, res) => {
	let installationUUID = req.params.uuid

	res.status(200);
})

/**
 * Create Installation
 * @param {UUIDv4} req.params.uuid
 * @param {Object} req.body - Installation object
 */
router.put('v3/installation/:uuid', (req, res) => {
	let installation = req.body
	let installationUUID = req.params.uuid

	res.status(200)
})

/**
 * Edit Installation
 * @param {UUIDv4} req.params.uuid
 * @param {Object} req.body - Installation Object
 */
router.post('v3/installation/:uuid', (req, res) => {
	let installation = req.body
	let installationUUID = req.params.uuid

	res.status(200)
})

/**
 * Delete Installation
 * @param {UUIDv4} req.params.uuid
 */
router.delete('v3/installation/:uuid', (req, res) => {
	let installationUUID = req.params.uuid

	res.status(200)
})

module.exports = router