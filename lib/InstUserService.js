const mysqlConn = require('./mysqlService')
const { v4: uuidv4 } = require('uuid')
const InstUser = require('./DBClass/InstUser')
const databrokerAPI = require('./api/dataBroker')
const coreAPI = require('./api/core')


class instUserService {
	db = null
	constructor(auth) {
		this.db = mysqlConn
		this.databroker = databrokerAPI
		this.core = coreAPI
		this.databroker.setHeader('Authorization', auth)
		this.core.setHeader('Authorization', auth)
		// console.log(this.core.headers)
	}
	async getAllUsersByInstallationUUID() { }
	async getAllUsersByInstallationId() { }

	async getInstUserByUUID(uuid) {
		let selectSQL = `SELECT * from instUser where uuid=? and deleted=0`
		let selectQuery = await this.db.query(selectSQL, [uuid])
		if (selectQuery[0][0]) {
			let instUser = selectQuery[0][0]
			// let installation = null
			return new InstUser(instUser)
		}
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
	async createInstUser(instUser) {
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
	async editInstUser(instUser) {
		if (instUser) {
			let inst = await this.getInstUserByUUID(instUser.uuid)
			console.log(inst)
			if (inst) {
				let updateSQL = `UPDATE instUser
						SET startDate=?, endDate=?, userUUID=?, instUUID=?, deleted=0
						WHERE uuid=?;`
				let i = inst
				let updateQuery = await this.db.query(updateSQL, [i.startDate, i.endDate, i.userUUID, i.instUUID, i.uuid])
				if (updateQuery[0].affectedRows === 1) {
					let fInst = await this.getInstUserByUUID(i.uuid)
					// console.log(fInst)
					return fInst
				}
			}
			return null
		}
		return null
	}
	async deleteInstUser(uuid) {
		if (uuid) {
			let deleteSQL = `UPDATE instUser
							SET deleted=1
							WHERE uuid=?;`
			let deleteQuery = await this.db.query(deleteSQL, [uuid])
			// console.log(deleteQuery)
			if (deleteQuery[0].affectedRows === 1) {
				return true
			}
			else {
				return false
			}
		}
		return false
	}

}


module.exports = instUserService