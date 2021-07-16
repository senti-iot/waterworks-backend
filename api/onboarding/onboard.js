const express = require('express')
const router = express.Router()
const wbOnboardService = require('../../lib/onboardService')
let oService = null



router.all('/v3/onboard/*', async (req, res, next) => {
	let auth = process.env.SENTI_TOKEN
	oService = new wbOnboardService(auth)
	console.log(auth)
	next()
})


router.post(`/v3/onboard/update-installation-address`, async (req, res) => {
	let body = req.body
	if (oService) {
		let updInst = await oService.updateInstAddress(body)
		if (updInst) {
			return res.status(200).json({"Result": true})
		}

		return res.status(500).json({"Result": false})
	}
	else {
		return res.status(500).json({ "Error": "oService is closed." })
	}
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
	else {
		return res.status(500).json({ "Error": "oService is closed." })
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


module.exports = router