const mysqlConn = require('./mysqlService')
const { v4: uuidv4 } = require('uuid')
const InstUser = require('./DBClass/InstUser')
const databrokerAPI = require('./api/dataBroker')
const coreAPI = require('./api/core')
const dawaAPI = require('./api/dawa')

class onboardService {
	db = null
	constructor(auth) {
		this.db = mysqlConn
		this.databroker = databrokerAPI
		this.core = coreAPI
		this.databroker.setHeader('Authorization', "Bearer " + auth)
		this.core.setHeader('Authorization', "Bearer " + auth)
		this.core.setHeader('wlHost', process.env.WLHOST)
		// console.log(this.core.headers)
	}


	async getPrices(orgUUID) {
		let select = `SELECT settings, watercost, watertax, statetax, sewage, vat,
						(watercost + watertax + statetax) as waterPrice,
						((watercost + watertax + statetax)*vat)/100 as waterVat,
						(sewage*vat)/100 as sewageVat,
						(watercost + watertax + statetax) + ((watercost + watertax + statetax)*vat)/100 as waterTotal,
						sewage + (sewage*vat)/100 as sewageTotal	,
						(watercost + watertax + statetax + sewage) + ((watercost + watertax + statetax + sewage)*vat)/100 as total
					FROM installationSettings i
					WHERE i.orgUUID = ?`
		let result = await this.db.query(select, [orgUUID])
		if (rs[0].length === 0) {
			return res.status(404).json()
		}
		if (rs[0].length > 1) {
			return res.status(400).json
		}
		res.status(200).json(rs[0][0])
	}


	async setPrices(d) {
		let update = `UPDATE installationSettings
					  SET watercost=?,
					  	  watertax=?,
					  	  statetax=?,
					  	  sewage=?,
					  	  vat=?,
					  	  settings=?
					  WHERE orgUUID=? AND year=?;`
		let updFormat = await this.db.format(update, [d.watercost,
						d.watertax, d.statetax, d.sewage,
			d.vat, d.settings, d.orgUUID, d.year])
		let updQuery = await this.db.query(update, [d.watercost,
			d.watertax, d.statetax, d.sewage,
			d.vat, d.settings, d.orgUUID, d.year])
		if (updQuery.affectedRows > 0) {
			return true
		}
		else {
			return false
		}
	}
	async createNewYear(d) {
		let insert = `INSERT INTO installationSettings
						(orgUUID, watercost, watertax, statetax, sewage, vat, settings, \`year\`)
					  VALUES(?, ?, ?, ?, ?, ?, ?, ?);`
		let createFormat = await this.db.format(insert, [d.orgUUID, d.watercost, d.watertax, d.statetax, d.sewage, d.vat, d.settings, d.year])
		let createQuery = await this.db.query(insert, [d.orgUUID, d.watercost, d.watertax, d.statetax, d.sewage, d.vat, d.settings, d.year])

		if (createQuery.affectedRows > 0) {
			return true
		}
		else {
			return false
		}
	}

}