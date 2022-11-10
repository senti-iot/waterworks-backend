const express = require('express')
const router = express.Router()

const coreAPI = require('../../lib/api/core')
const installationService = require('../../lib/installationService')

router.get('/v4/installation/:id', async (req, res) => {

})

router.get('/v4/installations', async (req, res) => {
	coreAPI.setHeader('Authorization', "Bearer " + req.lease.token)
	const user = await coreAPI.get('/v2/auth/user').then(r => r.data)

	if (!user) {
		return res.status(401);
	} else {
		const isSuperUser = user.role.priority <= 10 ? true : false
		const isSWAdmin = user.privileges.indexOf('waterworks.admin') > -1 ? true : false

		const service = new installationService(req.lease.token)

		let installations = []
		if (isSuperUser || isSWAdmin) {
			installations = await service.getInstallationsByOrgUUID(user.org.uuid)
		} else {
			installations = await service.getInstallationsByUserUUID(user.uuid)
		}

		// console.log(installations);

		if (installations) {
			return res.status(200).json(installations)
		} else {
			return res.status(500);
		}
	}
})

module.exports = router
