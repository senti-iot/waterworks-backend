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
		this.databrokerUserApi = databrokerAPI
		this.databroker.setHeader('Authorization', 'Bearer ' + process.env.SENTI_TOKEN)
		this.databrokerUserApi.setHeader('Authorization', 'Bearer ' + auth)
		this.core = coreAPI
		this.core.setHeader('Authorization', 'Bearer ' + process.env.SENTI_TOKEN)
		// console.log(this.core.headers)
	}

	/**
	 * Get Installation by Senti UUID
	 */
	async getInstallationByUserUUID(uuid) {
		if (uuid) {
			let selectSQL = `SELECT i.uuid, iD.uuid as instDevUUID, i.streetName, i.streetNumber, i.side, i.city, i.zip, i.lat, i.\`long\`, i.orgUUID, i.state, i.operation, i.moving, iD.deviceUUID, iD.startDate, iD.endDate from installation i
							LEFT JOIN instDevice iD on i.uuid = iD.instUUID
							LEFT JOIN instUser iU on i.uuid = iU.instUUID
							where iU.userUUID=? and i.deleted=0`
			let selectQuery = await this.db.query(selectSQL, [uuid])
			if (selectQuery[0].length > 0) {
				let inst = selectQuery[0][0]
				let org = await this.core.get(`/v2/entity/organisation/${inst.orgUUID}`).then(rs => rs.data)
				let user = await this.core.get(`/v2/entity/user/${inst.userUUID}`).then(rs => rs.data)
				inst.user = user
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
			let selectSQL = `SELECT i.uuid, iD.uuid as instDevUUID, i.streetName, i.streetNumber, i.side, i.city, i.zip, i.lat, i.\`long\`, i.orgUUID, i.state,
										i.operation, i.moving, iD.deviceUUID, iD.startDate as deviceStartDate, iD.endDate as deviceEndDate, iU.userUUID as userUUID,
										iU.startDate as userStartDate, iU.endDate as userEndDate
								FROM installation i
									LEFT JOIN instDevice iD on i.uuid = iD.instUUID AND iD.startDate <= NOW() AND (ISNULL(iD.endDate) OR iD.endDate >= NOW())
									INNER JOIN instUser iU on i.uuid = iU.instUUID AND iU.startDate <= NOW() AND (ISNULL(iU.endDate) OR iU.endDate >= NOW())
								WHERE iU.userUUID=? and i.deleted=0`
			let selectQuery = await this.db.query(selectSQL, [uuid])
			/**
			 * Get the Org from senti and inject it into the object -? use InstallationUI
			 */
			// console.log(selectQuery[0][0])
			if (selectQuery[0].length > 0) {
				let inst = selectQuery[0][0]
				let org = await this.core.get(`/v2/entity/organisation/${inst.orgUUID}`).then(rs => rs.data)
				let user = await this.core.get(`/v2/entity/user/${inst.sentiUserUUID}`).then(rs => rs.data)
				inst.user = user
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
			let selectSQL = `SELECT i.uuid, iD.uuid as instDevUUID, iU.uuid as instUserUUID, iU.userUUID as sentiUserUUID, i.streetName, i.streetNumber, i.side, i.city, i.zip, i.lat, i.\`long\`, i.orgUUID, i.state, i.operation, i.moving, iD.deviceUUID, iD.startDate, iD.endDate
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
			let insertSQL = `INSERT INTO installation (uuid, streetName, streetNumber, side, city, zip, lat, \`long\`, orgUUID, state, moving, operation, deleted) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0);`
			let insertQuery = await this.db.query(insertSQL, [inst.uuid, inst.streetName, inst.streetNumber, inst.side, inst.city, inst.zip, inst.lat, inst.long, inst.orgUUID, inst.state, inst.moving, inst.operation])
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
								SET operation=?,streetName=?,streetNumber=?,side=?,zip=?,city=?,state=?,moving=?,orgUUID=?,lat=?,\`long\`=?
								WHERE uuid=?;`
				let i = installation
				let updateQuer = await this.db.format(updateSQL, [i.operation, i.streetName, i.streetNumber, i.side, i.city, i.zip, i.state, i.moving, i.orgUUID,i.lat, i.long, i.uuid])
				console.log(updateQuer)
				let updateQuery = await this.db.query(updateSQL, [i.operation, i.streetName, i.streetNumber, i.side, i.city, i.zip, i.state, i.moving, i.orgUUID,i.lat, i.long, i.uuid])
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
			let selectSQL = `SELECT i.uuid, iD.uuid AS instDevUUID, i.streetName, i.streetNumber, i.side, i.city, i.zip, i.lat, i.\`long\`, i.orgUUID, i.state,
										i.operation, i.moving, iD.deviceUUID, iD.startDate AS deviceStartDate, iD.endDate AS deviceEndDate, iU.userUUID AS userUUID,
										iU.startDate AS userStartDate, iU.endDate AS userEndDate
								FROM installation i
									LEFT JOIN instDevice iD on i.uuid = iD.instUUID AND iD.startDate <= NOW() AND (ISNULL(iD.endDate) OR iD.endDate >= NOW())
									LEFT JOIN instUser iU on i.uuid = iU.instUUID AND iU.startDate <= NOW() AND (ISNULL(iU.endDate) OR iU.endDate >= NOW())
								WHERE i.orgUUID=? AND i.deleted=0
								GROUP BY i.uuid`
			let selectQuery = await this.db.query(selectSQL, [orgUUID])

			if (selectQuery[0].length > 0) {
				let userUUIDs = selectQuery[0].map(i => i.userUUID).filter(f => f !== null)
				let getUsers = await this.core.post('/v2/entity/waterworks/users', {uuids: userUUIDs}).then(rs => rs.data)

				const devices = await this.databrokerUserApi.get('/v2/devices').then(rs => rs.ok ? rs.data : rs.ok)
				// console.log(devices)

				let fInsts = selectQuery[0].map(i => {
					let inst = i
					inst.user = getUsers[getUsers.findIndex(f => f.uuid === i.userUUID)]
					if (inst.user) {
						inst.user.fullName = inst.user.firstName + " " + inst.user.lastName
					}

					let fInst = new Installation(inst)
					fInst.device = devices.find(f => f.uuid === i.deviceUUID)
					return fInst
				})
				return fInsts
			}

			return []
		}

		return null
	}
	/**
	 * Get all installations by user UUID
	 */
	async getInstallationsByUserUUID(uuid) {
		if (uuid) {
			let selectSQL = `SELECT i.uuid, iD.uuid as instDevUUID, i.streetName, i.streetNumber, i.side, i.city, i.zip, i.lat, i.\`long\`, i.orgUUID, i.state, i.operation, i.moving, iD.deviceUUID, iD.startDate, iD.endDate, iU.userUUID as userUUID from installation i
							LEFT JOIN instDevice iD on i.uuid = iD.instUUID
							LEFT JOIN instUser iU on i.uuid = iU.instUUID
							where iU.userUUID=? and i.deleted=0`
			let selectQuery = await this.db.query(selectSQL, [uuid])

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