const mysqlConn = require('./mysqlService')
const { v4: uuidv4 } = require('uuid')
const InstUser = require('./DBClass/InstUser')
const databrokerAPI = require('./api/dataBroker')
const coreAPI = require('./api/core')


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


	async createSentiUser(data) {

		let user = {
			...data,
			userName: data.email,
			email: data.email,
			org: {
				uuid: data.org.uuid
			},
			state: 2,
			role: { uuid: "943dc3fc-c9f5-4e73-a24f-b0ae334c0c5e" }
		}
		console.log(user)
		let res = await this.core.post(`/v2/entity/user`, user).then(rs => rs)
		console.log(res.data, res.ok, res.status)
		return res.data
	}

	async getInstUserById(id) {
		let selectSQL = `SELECT * from instUser where id=? and deleted=0`
		let selectQuery = await this.db.query(selectSQL, [id])
		if (selectQuery[0][0]) {
			let instUser = selectQuery[0][0]
			// let installation = null
			return new InstUser(instUser)
		}
	}

	async createWaterworksUser(instUser) {
		if (instUser) {
			let inst = new InstUser(instUser)
			inst.uuid = uuidv4()
			let insertSQL = `INSERT INTO instUser
							(uuid, startDate, endDate, userUUID, instUUID, deleted)
							VALUES(?, ?, ?, ?, ?, 0);`
			let insertQuery = await this.db.query(insertSQL, [inst.uuid, inst.startDate, inst.endDate, inst.userUUID, inst.instUUID])
			if (insertQuery[0].affectedRows === 1) {
				let fInst = await this.getInstUserById(insertQuery[0].insertId)
				// console.log(fInst)
				return fInst
			}
		}
		return null

	}

	async getOnboarding(data) {
		if (data) {
			let selectSQL = `SELECT * from onboarding where deviceIdent=? and installationIdent=? and orgIdent=?`
			let selectQuery = await this.db.query(selectSQL, [data.deviceIndent, data.installationIndent, data.orgIndent])
			if (selectQuery[0][0]) {
				return selectQuery[0][0]
			}
		}
		return null

	}

	async updateInstAddress(data) {
		if (data) {
			let updateSQL = `UPDATE installation i
							SET i.address=?
							where i.uuid=?`
			let updateQuery = await this.db.query(updateSQL, [data.address, data.uuid])
			if (updateQuery[0].affectedRows === 1) {
				return true
			}
		}
		return false
	}
}


module.exports = onboardService