const mysqlConn = require('./mysqlService')
const { v4: uuidv4 } = require('uuid')
const InstDevice = require('./DBClass/InstDevice')
const databrokerAPI = require('./api/dataBroker')
const coreAPI = require('./api/core')


class instDeviceService {
	db = null
	constructor(auth) {
		this.db = mysqlConn
		this.databroker = databrokerAPI
		this.core = coreAPI
		this.databroker.setHeader('Authorization', auth)
		this.core.setHeader('Authorization', auth)
		// console.log(this.core.headers)
	}
	async getAllDevicesByInstallationUUID() { }
	async getAllDevicesByInstallationId() { }

	async getInstDeviceByUUID(uuid) {
		let selectSQL = `SELECT * from instDevice where uuid=? and deleted=0`
		let selectQuery = await this.db.query(selectSQL, [uuid])
		if (selectQuery[0][0]) {
			let instDevice = selectQuery[0][0]
			// let installation = null
			return new InstDevice(instDevice)
		}
	}
	async getInstDeviceById(id) {
		let selectSQL = `SELECT * from instDevice where id=? and deleted=0`
		let selectQuery = await this.db.query(selectSQL, [id])
		if (selectQuery[0][0]) {
			let instDevice = selectQuery[0][0]
			console.log('instDevice selected', instDevice)
			// let installation = null
			let fInst = new InstDevice(instDevice)
			console.log('fInst', fInst)
			return fInst
		}
	}
	async createInstDevice(instDevice) {
		if (instDevice) {
			let inst = new InstDevice(instDevice)
			inst.uuid = uuidv4()
			let insertSQL = `INSERT INTO instDevice
							(uuid, startDate, endDate, deviceUUID, instUUID, deleted)
							VALUES(?, ?, ?, ?, ?, 0);`
			let insertQuery = await this.db.query(insertSQL, [inst.uuid, inst.startDate, inst.endDate, inst.deviceUUID, inst.instUUID])
			if (insertQuery[0].affectedRows === 1) {
				let fInst = await this.getInstDeviceById(insertQuery[0].insertId)
				// console.log(fInst)
				return fInst
			}
		}
		return null
	}
	async editInstDevice(instDevice) {
		if (instDevice) {
			let inst = await this.getInstDeviceByUUID(instDevice.uuid)
			if (inst) {
				let updateSQL = `UPDATE instDevice
						SET startDate=?, endDate=?, deviceUUID=?, instUUID=?, deleted=0
						WHERE uuid=?;`
				let i = inst
				let updateQuery = await this.db.query(updateSQL, [i.startDate, i.endDate, i.deviceUUID, i.instUUID, i.uuid])
				if (updateQuery[0].affectedRows === 1) {
					let fInst = await this.getInstDeviceByUUID(i.uuid)
					// console.log(fInst)
					return fInst
				}
			}
			return null
		}
		return null
	}
	async deleteInstDevice(uuid) {
		if (uuid) {
			let deleteSQL = `UPDATE instDevice
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


module.exports = instDeviceService