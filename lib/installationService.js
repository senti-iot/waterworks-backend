const mysqlConn = require('./mysqlService')
const { v4: uuidv4 } = require('uuid')
const Installation = require('./DBClass/Installation')


class installationService {
	db = null
	constructor() {
		this.db = mysqlConn
	}


	/**
	* Get Installation by UUID
	*/
	async getInstallationByUUID(uuid) {
		if (uuid) {
			let selectSQL = `SELECT * from installation where uuid=?`
			let selectQuery = await this.db.query(selectSQL, [uuid])
			/**
			 * Get the Org from senti and inject it into the object -? use InstallationUI
			 */
			return new Installation(selectQuery[0][0])
		}
	}

	/**
	 * Get Installation by ID
	 */
	async getInstallationByID(id) {
		if (id) {
			let selectSQL = `SELECT * from installation where id=?`
			let selectQuery = await this.db.query(selectSQL, [id])
			/**
			 * Get the Org from senti and inject it into the object -? use InstallationUI
			 */
			return new Installation(selectQuery[0][0])
		}
	}
	/**
	 * Create new installation
	 */
	async createInstallation(installation) {
		if (installation) {
			let inst = new Installation(installation)
			inst.uuid = uuidv4()
			let insertSQL = `INSERT INTO installation (uuid, address, orgUUID, state, adults, children) VALUES(?, ?, ?, ?, ?, ?);`
			let insertQuery = await this.db.query(insertSQL, [inst.uuid, inst.address, inst.orgUUID, inst.state, inst.adults, inst.children])
			if (insertQuery[0].affectedRows === 1) {
				let fInst = await this.getInstallationByID(insertQuery[0].insertId)
				console.log(fInst)
				return fInst
			}
		}
		return null
	}
	/**
	 * Edit/ Udoate installation
	 */
	async editInstallation(installation) {
		if (installation) {
			let inst = this.getInstallationByUUID(installation.uuid)
			if (inst) {
				let updateSQL = `UPDATE installation
								SET children=?,address=?,state=?,adults=?,orgUUID=?
								WHERE uuid=?;`
				let i = installation
				let updateQuery = await this.db.query(updateSQL, [i.children, i.address, i.state, i.adults, i.orgUUID, i.uuid])
				if (updateQuery[0].affectedRows === 1) {
					let fInst = await this.getInstallationByUUID(i.uuid)
					console.log(fInst)
					return fInst
				}
			}
			return null
		}
		return null
	}
}

module.exports = installationService