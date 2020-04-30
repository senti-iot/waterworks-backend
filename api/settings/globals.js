const express = require('express')
const router = express.Router()

const mysqlConn = require('../../mysql/mysql_handler')

router.get('/settings/globals/:countrycode', async (req, res) => {
	let select = `SELECT countryCode, benchmark, goal 
				FROM globalSettings 
				WHERE countryCode = ?;`
	let rs = await mysqlConn.query(select, [req.params.countrycode])
	if (rs[0].length === 0) {
		res.status(404).json()
		return
	}
	if (rs[0].length > 1) {
		res.status(400).json()
		return
	}
	res.status(200).json(rs[0][0]);
});

module.exports = router