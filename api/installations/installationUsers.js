const express = require('express')
const router = express.Router()

/**
 * Get Installation Users
 * @param {UUIDv4} req.params.uuid
 */
router.get('v3/installation/:uuid/users', (req, res) => {
	let installationUUID = req.params.uuid

	res.status(200)
})

/**
 * Get Installation Users
 * @param {UUIDv4} req.params.uuid
 * @param {UUIDv4} req.params.useruuid
 */
router.get('v3/installation/:uuid/user/:useruuid', (req, res) => {
	let installationUUID = req.params.uuid
	let userUUID = req.params.useruuid

	res.status(200)
})

/**
 * Create User under Installation
 * @param {UUIDv4} req.params.uuid
 * @param {UUIDv4} req.params.useruuid
 * @param {Object} req.body - User object + from/to
 */
router.put('v3/installation/:uuid/user/:useruuid', (req, res) => {
	let installation = req.body
	let installationUUID = req.params.uuid
	let userUUID = req.params.useruuid


	res.status(200)
})

/**
 * Edit Installation
 * @param {UUIDv4} req.params.uuid
 * @param {UUIDv4} req.params.useruuid
 * @param {Object} req.body - User object + from/to
 */
router.post('v3/installation/:uuid/user/:useruuid', (req, res) => {
	let installation = req.body
	let installationUUID = req.params.uuid
	let userUUID = req.params.useruuid

	res.status(200)
})

/**
 * Delete Installation
 * @param {UUIDv4} req.params.uuid
 * @param {UUIDv4} req.params.useruuid
 */
router.delete('v3/installation/:uuid/user/:useruuid', (req, res) => {
	let installationUUID = req.params.uuid

	res.status(200)
})

module.exports = router