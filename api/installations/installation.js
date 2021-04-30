const express = require('express')
const router = express.Router()
const sentiInstallationService = require('../../lib/installationService')
let instService = null



router.all('/v3/installation', async (req, res, next) => {
	instService = new sentiInstallationService(req.headers.authorization)
	console.log(req.headers.authorization)
	next()
})
/**
 * Get Installation
 * @param {UUIDv4} req.params.uuid
 */
router.get('/v3/installation/:uuid', async (req, res) => {
	let installationUUID = req.params.uuid
	let inst = await instService.getInstallationByUUID(installationUUID)
	// console.log(inst)
	if (inst)
		res.status(200).json(inst)
	else {
		res.status(404).json(null)
	}
})

/**
 * Create Installation
 * @param {UUIDv4} req.params.uuid
 * @param {Object} req.body - Installation object
 */
router.put('/v3/installation', async (req, res) => {
	let installation = req.body
	let fInst = await instService.createInstallation(installation)
	if (fInst) {

		return res.status(200).json(fInst)
	}
	return res.status(500).json(fInst)
})

/**
 * Edit Installation
 * @param {UUIDv4} req.params.uuid
 * @param {Object} req.body - Installation Object
 */
router.post('/v3/installation', async (req, res) => {
	let installation = req.body
	let fInst = await instService.editInstallation(installation)
	if (fInst) {
		return res.status(200).json(fInst)
	}
	return res.status(500).json(fInst)})

/**
 * Delete Installation
 * @param {UUIDv4} req.params.uuid
 */
router.delete('/v3/installation/:uuid', async (req, res) => {
	let installationUUID = req.params.uuid
	let fDeleted = await instService.deleteInstallation(installationUUID)
	if (fDeleted) {
		res.status(200).json(true)
	}
	else {
		res.status(500).json(false)
	}
})

module.exports = router