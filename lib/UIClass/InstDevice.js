const { sentiData } = require('senti-apicore')

class InstDeviceUI extends sentiData {
	uuid = null
	startDate = null
	endDate = null
	device = {}
	instUUID = null //maybe Not needed if tree structure used

	constructor(data = null, vars = null) {
		super()
		this.assignData(data, vars)
	}
}

module.exports = InstDeviceUI