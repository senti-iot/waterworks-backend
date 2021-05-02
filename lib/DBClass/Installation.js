const { sentiData } = require('senti-apicore')

class Installation extends sentiData {
	id = null
	uuid = null
	deviceUUID = null
	startDate = null
	endDate = null
	instDevUUID = null
	address = null
	orgUUID = null
	state = null
	operation = null
	moving = null
	org = null
	constructor(data = null, vars = null) {
		super()
		this.assignData(data, vars)
	}
}

module.exports = Installation