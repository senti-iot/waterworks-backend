const mysqlConn = require('./mysqlService')
const { v4: uuidv4 } = require('uuid')
const Installation = require('./DBClass/Installation')
const InstallationDB = require('./DBClass/InstallationDB')
const databrokerAPI = require('./api/dataBroker')
const coreAPI = require('./api/core')


class installationService {
	db = null
	constructor(auth) {
		this.db = mysqlConn
		this.databroker = databrokerAPI
		this.core = coreAPI
		this.databroker.setHeader('Authorization', auth)
		this.core.setHeader('Authorization', auth)
		// console.log(this.core.headers)
	}

	/**
	 * Get Installation by Senti UUID
	 */
	async getInstallationByUserUUID(uuid) {
		if (uuid) {
			let selectSQL = `SELECT i.uuid, iD.uuid as instDevUUID, i.address, i.orgUUID, i.state, i.operation, i.moving, iD.deviceUUID, iD.startDate, iD.endDate from installation i
							LEFT JOIN instDevice iD on i.uuid = iD.instUUID
							LEFT JOIN instUser iU on i.uuid = iU.instUUID
							where iU.userUUID=? and i.deleted=0`
			let selectQuery = await this.db.query(selectSQL, [uuid])
			if (selectQuery[0].length > 0) {
				let inst = selectQuery[0][0]
				let org = await this.core.get(`/v2/entity/organisation/${inst.orgUUID}`).then(rs => rs.data)
				inst.org = org
				return new Installation(inst)
			}
			else {
				return null
			}
		}
	}

	/**
	* Get Installation by UUID
	*/
	async getInstallationByUUID(uuid) {
		if (uuid) {
			let selectSQL = `SELECT i.uuid, iD.uuid as instDevUUID, iU.uuid as instUserUUID, i.address, i.orgUUID, i.state, i.operation, i.moving, iD.deviceUUID, iD.startDate, iD.endDate
							from installation i
							LEFT JOIN instDevice iD on i.uuid = iD.instUUID
							LEFT JOIN instUser iU on i.uuid = iU.instUUID
							where i.uuid=? and i.deleted=0`
			let selectQuery = await this.db.query(selectSQL, [uuid])
			/**
			 * Get the Org from senti and inject it into the object -? use InstallationUI
			 */
			// console.log(selectQuery[0][0])
			if (selectQuery[0].length > 0) {
				let inst = selectQuery[0][0]
				let org = await this.core.get(`/v2/entity/organisation/${inst.orgUUID}`).then(rs => rs.data)
				inst.org = org
				return new Installation(inst)
			}
			else {
				return null
			}
		}
	}

	/**
	 * Get Installation by ID
	 */
	async getInstallationByID(id) {
		if (id) {
			let selectSQL = `SELECT i.uuid, iD.uuid as instDevUUID, iU.uuid as instUserUUID, i.address, i.orgUUID, i.state, i.operation, i.moving, iD.deviceUUID, iD.startDate, iD.endDate
							from installation i
							LEFT JOIN instDevice iD on i.uuid = iD.instUUID
							LEFT JOIN instUser iU on i.uuid = iU.instUUID
							where i.id=? and i.deleted=0`
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
			let inst = new InstallationDB(installation)
			inst.uuid = uuidv4()
			let insertSQL = `INSERT INTO installation (uuid, address, orgUUID, state, moving, operation, deleted) VALUES(?, ?, ?, ?, ?, ?, 0);`
			let insertQuery = await this.db.query(insertSQL, [inst.uuid, inst.address, inst.orgUUID, inst.state, inst.moving, inst.operation])
			if (insertQuery[0].insertId) {

				let fInst = await this.getInstallationByID(insertQuery[0].insertId)
				// console.log(fInst)
				return fInst
			}
		}
		return null
	}
	/**
	 * Edit / Update installation
	 */
	async editInstallation(installation) {
		//This needs to be way more complex
		//needs a lot of IFs
		/**
		 * If = if () changed
		 * If(instDevice) -> update the endDate
		 * If(instUser) -> close the current instDevice and create a new one for the new user
		 */
		if (installation) {
			let inst = this.getInstallationByUUID(installation.uuid)
			if (inst) {
				let updateSQL = `UPDATE installation
								SET operation=?,address=?,state=?,moving=?,orgUUID=?
								WHERE uuid=?;`
				let i = installation
				let updateQuery = await this.db.query(updateSQL, [i.operation, i.address, i.state, i.moving, i.orgUUID, i.uuid])
				if (updateQuery[0].affectedRows === 1) {
					let fInst = await this.getInstallationByUUID(i.uuid)
					// console.log(fInst)
					return fInst
				}
			}
			return null
		}
		return null
	}
	/**
	 * Delete Installation
	 */
	async deleteInstallation(uuid) {
		if (uuid) {
			let deleteSQL = `UPDATE installation
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
	/**
	 * Get all installations
	 */
	async getInstallationsByOrgUUID(orgUUID) {
		if (orgUUID) {
			let selectSQL = `SELECT i.uuid, iD.uuid as instDevUUID, i.address, i.orgUUID, i.state, i.operation, i.moving, iD.deviceUUID, iD.startDate, iD.endDate from installation i
							LEFT JOIN instDevice iD on i.uuid = iD.instUUID
							where orgUUID=? and i.deleted=0;`
			let selectQuery = await this.db.query(selectSQL, [orgUUID])
			if (selectQuery[0].length > 0) {
				let fInsts = selectQuery[0].map(i => new Installation(i))
				return fInsts
			}
			return []
		}
		return null
	}
}

module.exports = installationService