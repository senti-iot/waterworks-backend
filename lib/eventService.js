const mysqlConn = require('./mysqlService')


class eventService {
	db = null
	constructor() {
		this.db = mysqlConn

	}

	async getUserUUID(uuid) {
		let selectSQL = `select userUUID from instUser iu
						 inner join installation i on i.uuid = iu.instUUID
						 inner join instDevice iD on iD.instUUID = i.uuid
						 where iD.deviceUUID = ?`
		let selectQuery = this.db.query(selectSQL, [uuid])
		if (selectQuery[0][0]) {
			console.log(selectQuery[0][0])
			return selectQuery[0][0]
		}
		else return null
	}

}

module.exports = eventService