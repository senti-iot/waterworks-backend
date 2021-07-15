const express = require('express')
const router = express.Router()
const wbOnboardService = require('../../lib/onboardService')
let oService = null



router.all('/v3/onboard*', async (req, res, next) => {
	oService = new wbOnboardService(req.headers.authorization)
	console.log(req.headers.authorization)
	next()
})

/**
 * Get Onboarding info
 */

router.post(`/v3/onboard/get-installation`, async (req, res) => {
	let body = req.body
	if (oService) {
		let onboarding = await oService.getOnboarding(body)
		if (onboarding) {

			return res.status(200).json(onboarding)
		}
		else {
			return res.status(404).json({ "Error": "Onboard not found" })
		}
	}

})

/**
 * Create Senti User
 */
router.post(`/v3/onboard/create-senti-user`, async (req, res) => {
	let body = req.body
	if (oService) {
		let user = await oService.createSentiUser(body)
		if (user) {
			return res.status(200).json(user)
		}
		else {
			return res.status(500).json({ "Error": "Create User error" })
		}
	}
	else {
		return res.status(500).json({"Error": "oService is closed."})
	}
})

/**
 * Create instUser
 */
router.post(`/v3/onboard/create-waterworks-user`, async (req, res) => {
	let body = req.body
	if (oService) {
		let user = await oService.createWaterworksUser(body)
		if (user) {
			return res.status(200).json(user)
		}
		else {
			return res.status(500).json({ "Error": "Create User error" })
		}
	}
	else {
		return res.status(500).json({ "Error": "oService is closed." })
	}
})
/**
 * Get Installation
 * @param {UUIDv4} req.params.uuid
 */
router.get('/v3/installation/:uuid', async (req, res) => {
	let installationUUID = req.params.uuid
	if (instService) {

		let inst = await instService.getInstallationByUUID(installationUUID)
		// console.log(inst)
		if (inst)
			res.status(200).json(inst)
		else {
			res.status(404).json(null)
		}
	}
	return res.status(500)
})


module.exports = router