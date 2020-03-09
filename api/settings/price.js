const express = require('express')
const router = express.Router()

const mysqlConn = require('../../mysql/mysql_handler')

router.get('/settings/price/:organisationident', async (req, res) => {
	let select = `SELECT watercost, watertax, statetax, sewage, vat, 
						(watercost + watertax + statetax) as waterPrice, 
						((watercost + watertax + statetax)*vat)/100 as waterVat,
						(sewage*vat)/100 as sewageVat,
						round((watercost + watertax + statetax) + ((watercost + watertax + statetax)*vat)/100, 2) as waterTotal,
						round(sewage + (sewage*vat)/100, 2) as sewageTotal	,
						round((watercost + watertax + statetax + sewage) + ((watercost + watertax + statetax + sewage)*vat)/100, 2) as total
					FROM installationSettings i
					WHERE i.orgUUID = ?`
	let rs = await mysqlConn.query(select, [req.params.organisationident])
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