const { sentiData } = require('senti-apicore')

class InstUser extends sentiData {
	id = null
	uuid = null
	startDate = null
	endDate = null
	userUUID = null
	instUUID = null

	constructor(data = null, vars = null) {
		super()
		this.assignData(data, vars)
	}
}

module.exports = InstUser