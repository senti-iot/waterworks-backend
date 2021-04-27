const mysqlConn = require('./mysqlService')
const { v4: uuidv4 } = require('uuid')
const Installation = require('./DBClass/Installation')
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
		console.log(this.core.headers)
	}
	async getAllDevicesByInstallationUUID() { }
	async getAllDevicesByInstallationId() { }
	async getInstDevice() { }
	async createInstDevice() { }
	async editInstDevice() { }
	async deleteInstDevice() { }

}


module.exports = instDeviceService