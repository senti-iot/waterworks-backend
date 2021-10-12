const { sentiData } = require('senti-apicore')

class Installation extends sentiData {
	id = null
	uuid = null
	instDevUUID = null
	instUserUUID = null
	sentiUserUUID = null
	address = null
	lat = null
	long = null
	orgUUID = null
	deviceUUID = null
	state = null
	startDate = null
	endDate = null
	operation = null
	moving = null
	org = null
	constructor(data = null, vars = null) {
		super()
		this.assignData(data, vars)
	}
}

module.exports = Installation