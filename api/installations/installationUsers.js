const express = require('express')
const router = express.Router()
const sentiInstUserService = require('../../lib/InstUserService')
// let instUserService = null

let instUserService = new sentiInstUserService()

/**
 * Set the auth bearer Token to serviceClass
 */
router.all('/v3/installation*', async (req, res, next) => {
	instUserService = new sentiInstUserService(req.headers.authorization)
	// console.log(req.headers.authorization)
	next()
})

/**
 * Get Installation Users
 * @param {UUIDv4} req.params.uuid
 */
router.get('/v3/installation/:uuid/users', (req, res) => {
	let installationUUID = req.params.uuid
	// let instUser = instUserService.
	res.status(200)
})

/**
 * Get Installation Users
 * @param {UUIDv4} req.params.uuid
 * @param {UUIDv4} req.params.useruuid
 */
router.get('/v3/installation/user/:uuid', async (req, res) => {
	// let installationUUID = req.params.uuid
	let userUUID = req.params.uuid
	let instUser = await instUserService.getInstUserByUUID(userUUID)
	if (instUser) {
		return res.status(200).json(instUser)
	}
	res.status(500)
})

/**
 * Create User under Installation
 * @param {UUIDv4} req.params.uuid
 * @param {UUIDv4} req.params.useruuid
 * @param {Object} req.body - User object + from/to
 */
router.put('/v3/installation/user', async (req, res) => {
	let instUser = req.body
	// let userUUID = req.params.useruuid
	let fInstUser = await instUserService.createInstUser(instUser)
	if (fInstUser) {
		return res.status(200).json(instUser)
	}
	res.status(500)
})

/**
 * Edit Installation user
 * @param {UUIDv4} req.params.uuid
 * @param {UUIDv4} req.params.useruuid
 * @param {Object} req.body - User object + from/to
 */
router.post('/v3/installation/user/', async (req, res) => {
	let instUser = req.body

	let fInstUser = await instUserService.editInstUser(instUser)
	if (fInstUser) {
		return res.status(200).json(fInstUser)
	}
	else
		return res.status(500).json({ "Error": "Error" })
})

/**
 * Delete Installation
 * @param {UUIDv4} req.params.uuid
 * @param {UUIDv4} req.params.useruuid
 */
router.delete('v3/installation/user/:useruuid', (req, res) => {
	let installationUUID = req.params.uuid

	res.status(200)
})

module.exports = router