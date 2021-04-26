const express = require('express')
const router = express.Router()
const sentiInstallationService = require('../../lib/installationService')
const instService = new sentiInstallationService()

/**
 * Get Installation
 * @param {UUIDv4} req.params.uuid
 */
router.get('/v3/installation/:uuid', async (req, res) => {
	let installationUUID = req.params.uuid
	let inst = await instService.getInstallationByUUID(installationUUID)
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
	let installationUUID = req.params.uuid
	let fInst = await instService.editInstallation(installation)
	if (fInst) {
		return res.status(200).json(fInst)
	}
	return res.status(500).json(fInst)})

/**
 * Delete Installation
 * @param {UUIDv4} req.params.uuid
 */
router.delete('v3/installation/:uuid', (req, res) => {
	let installationUUID = req.params.uuid

	res.status(200)
})

module.exports = router