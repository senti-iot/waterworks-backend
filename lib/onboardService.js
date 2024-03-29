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

	async findSentiUser(data) {
		console.log('Find Senti User data:', data)
		let res = await this.core.get(`/v2/entity/user/username/${data.email}`).then(rs => rs)
		console.log('Find Senti User Result:', res.data, res.ok, res.status)
		return res.ok ? res.data : null
	}

	async createSentiUser(data) {

		let user = {
			...data,
			userName: data.email,
			email: data.email,
			org: {
				uuid: data.org.uuid
			},
			aux: {
				sentiWaterworks: {
					extendedProfile: {
						city: data.city,
						postnr: data.postnr,
						address: data.address,
						noOfChildren: data.noOfChildren,
						noOfAdults: data.noOfAdults
					}
				}
			},
			state: 2,
			role: { uuid: "943dc3fc-c9f5-4e73-a24f-b0ae334c0c5e" }
		}
		console.log(user)
		let res = await this.core.post(`/v2/entity/user`, user).then(rs => rs)
		console.log('Create Senti User', res.data, res.ok, res.status)
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
							(uuid, startDate, endDate, userUUID, instUUID, adults, children, deleted)
							VALUES(?, ?, ?, ?, ?, ?, ?, 0);`
			let insertQuery = await this.db.query(insertSQL, [inst.uuid, inst.startDate, inst.endDate, inst.userUUID, inst.instUUID, inst.adults, inst.children])
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
							SET i.streetName=?
							where i.uuid=?`
			let updateQuery = await this.db.query(updateSQL, [data.streetName, data.uuid])
			if (updateQuery[0].affectedRows === 1) {
				return true
			}
		}
		return false
	}
	async activateInstallation(uuid) {
		let updateSQL = `UPDATE installation i
						SET i.state=1
						where i.uuid=?`
		let updateQuery = await this.db.query(updateSQL, [uuid])
		if (updateQuery[0].affectedRows === 1) {
			return true
		}
		return false
	}
	async updateInstallation(body) {
		let data = body
		if (data) {

			// Get lat long for the installation
			let completeAddress = data.streetName + ' ' + data.streetNumber + ',' + data.side + ',' + data.zip + ' ' + data.city
			let dawaData = await dawaAPI.get(`https://dawa.aws.dk/adresser?q=${encodeURIComponent(completeAddress)}&struktur=mini`)
				.then(rs => {
					return rs.data
				})
			if (dawaData && dawaData.length > 0) {
				let dawaAddr = dawaData[0]
				data.lat = dawaAddr.y
				data.long = dawaAddr.x
			}
			let updateSQL = `UPDATE installation i
							SET i.streetName=?,
							i.streetNumber=?,
							i.side=?,
							i.zip=?,
							i.city=?,
							i.lat=?,
							i.\`long\`=?
							where i.uuid=?`

			let updateQuery = await this.db.query(updateSQL, [data.streetName, data.streetNumber, data.side, data.zip, data.city, data.lat, data.long, data.uuid])
			if (updateQuery[0].affectedRows === 1) {
				return true
			}
		}
		return false
	}
}


module.exports = onboardService