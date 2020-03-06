const express = require('express')
const router = express.Router()

const authClient = require('../../server').authClient

const mysqlConn = require('../../mysql/mysql_handler')

router.post('/onboarding/user', async (req, res) => {
	if (authClient.getStoredToken() === false) {
		let login = await authClient.login(process.env.SENTIUSER, process.env.SENTIPASS)
		authClient.setStoredToken(login.token)
	}
	if (await authClient.getTokenLease(authClient.getStoredToken()) === false) {
		authClient.setStoredToken((await authClient.login(process.env.SENTIUSER, process.env.SENTIPASS)).token)
	}
	authClient.api.setHeader('Authorization', 'Bearer ' + authClient.getStoredToken())

	// Check installation
	// let user = await authClient.api.post('/v2/entity/user', {})
	// console.log(user)
	console.log(req.body)

	// let select = `SELECT * FROM installations I WHERE I.orgIdent = ? AND I.installationId = ? AND I.deviceIdent = ? AND I.state = ?`
	// let rs = await mysqlConn.query(select, [req.params.organisationident, req.params.installationnumber, req.params.deviceident, 0])
	// console.log(rs[0])

	res.status(200).json(true);
});

module.exports = router