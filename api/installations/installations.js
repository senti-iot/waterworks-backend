const express = require('express')
const router = express.Router()
const sentiInstallationService = require('../../lib/installationService')
let instService = null



router.all('/v3/installations*', async (req, res, next) => {
	console.log('We passed this')
	instService = new sentiInstallationService(req.headers.authorization)
	console.log(req.headers.authorization)
	next()
})

/**
 * Get all installations under ORG
 * @param {UUIDv4} req.params.orgUUID
 */

router.get('/v3/installations/:orguuid', async (req, res) => {
	let orgUUID = req.params.orguuid
	if (orgUUID) {
		let installations = await instService.getInstallationsByOrgUUID(orgUUID)
		if (installations) {
			return res.status(200).json(installations)
		}
		else {
			return res.status(500);
		}
	}
	return res.status(500);
});

router.get('/v3/installations/user/:useruuid', async (req, res) => {
	let userUUID = req.params.useruuid
	if (userUUID) {
		let installations = await instService.getInstallationsByUserUUID(userUUID)
		if (installations.length > 0) {
			return res.status(200).json(installations)
		}
		else {
			return res.status(200).json([])
		}
	}
	return res.status(500)
})
module.exports = router
