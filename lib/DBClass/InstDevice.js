const { sentiData } = require('senti-apicore')

class InstDeviceDB extends sentiData {
	id = null
	uuid = null
	startDate = null
	endDate = null
	deviceId = null
	instId = null

	constructor(data = null, vars = null) {
		super()
		this.assignData(data, vars)
	}
}

module.exports = InstDeviceDB