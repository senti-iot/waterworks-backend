const express = require('express')
const router = express.Router()

const InstallationInfo = require('./dataClasses/InstallationInfo')

const mysqlConn = require('../../mysql/mysql_handler')

router.get('/onboarding/installation/:organisationident/:installationnumber/:deviceident', async (req, res) => {
	let select = `SELECT * FROM installations I WHERE I.orgIdent = ? AND I.installationId = ? AND I.deviceIdent = ? AND I.state = ?`
	let rs = await mysqlConn.query(select, [req.params.organisationident, req.params.installationnumber, req.params.deviceident, 0])
	if (rs[0].length === 0) {
		res.status(404).json()
		return
	}
	if (rs[0].length > 1) {
		res.status(400).json()
		return
	}

	let a = new InstallationInfo(rs[0][0])
	console.log(a)

	res.status(200).json(req.params);
});

module.exports = router