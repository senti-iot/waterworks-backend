const express = require('express')
const router = express.Router()
const mysqlConn = require('../../mysql/mysql_handler')

const swOrgSettings = require('../../lib/orgSettingsService')


router.all('/org/settings/*', async (req, res) => {
	swOrgService = new swOrgSettings()
	next()
})

/**
 * Create a new endpoint for org settings and call it appropriately
 * @Andrei
 */
router.get('/settings/price/:organisationident', async (req, res) => {
	let select = `SELECT settings, watercost, watertax, statetax, sewage, vat,
						(watercost + watertax + statetax) as waterPrice,
						((watercost + watertax + statetax)*vat)/100 as waterVat,
						(sewage*vat)/100 as sewageVat,
						(watercost + watertax + statetax) + ((watercost + watertax + statetax)*vat)/100 as waterTotal,
						sewage + (sewage*vat)/100 as sewageTotal	,
						(watercost + watertax + statetax + sewage) + ((watercost + watertax + statetax + sewage)*vat)/100 as total
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

/**
 * Update Price
 */
router.post('/org/settings', async (req, res) => {

})

/**
 * Create Year Price
 */

router.put('/org/settings', async (req, res) => {

})

module.exports = router