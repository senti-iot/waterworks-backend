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
			return res.status(200).json({ "Result": true })
		}

		return res.status(500).json({ "Result": false })
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
		return res.status(500).json({ "Error": "oService is closed." })
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
 *
 */
router.post(`/v3/onboard/complete`, async (req, res) => {
	let body = req.body
	let sUserBody = body.sUserBody
	let wUserBody = body.wUserBody
	let instBody = body.instBody
	if (oService) {
		//Create Senti User or check if it is already created
		let user = await oService.findSentiUser(sUserBody)
		console.log('Request findUser:', user)
		if (!user) {
			user = await oService.createSentiUser(sUserBody)
		}

		if (user) {
			//If the user exists, create the Installation User
			wUserBody.userUUID = user.uuid
			console.log('Request createWaterworksUser:', wUserBody)
			let wUser = await oService.createWaterworksUser(wUserBody)
			console.log('Request createWaterworksUser result:', wUser)
			if (wUser) {
				//Update the installation
				let inst = await oService.updateInstallation(instBody)
				console.log('Installation update:', inst)
				res.status(200).json({ "Result": true })
			}
			else {
				res.status(500).json({ "Error": "Installation User failed to be created." })
			}
		}
		else {
			res.status(500).json({ "Error": "User failed to be created" })
		}
	}
})

module.exports = router