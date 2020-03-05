const express = require('express')
const router = express.Router()

const mysqlConn = require('../../mysql/mysql_handler')

router.post('/onboarding/user', async (req, res) => {
	// let select = `SELECT * FROM installations I WHERE I.orgIdent = ? AND I.installationId = ? AND I.deviceIdent = ? AND I.state = ?`
	// let rs = await mysqlConn.query(select, [req.params.organisationident, req.params.installationnumber, req.params.deviceident, 0])
	// console.log(rs[0])
	console.log(req.body)

	res.status(200).json(true);
});

module.exports = router