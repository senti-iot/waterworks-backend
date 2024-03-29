const { sentiData } = require('senti-apicore')

class Installation extends sentiData {
	id = null
	uuid = null
	instDevUUID = null
	instUserUUID = null
	sentiUserUUID = null
	lat = null
	long = null
	orgUUID = null
	deviceUUID = null
	device = null
	state = null
	startDate = null
	endDate = null
	operation = null
	moving = null
	org = null
	user = null
	streetName = null
	streetNumber= null
	side = null
	zip = null
	city = null
	installationIdent = null
	adults = null
	children = null

	constructor(data = null, vars = null) {
		super()
		this.assignData(data, vars)
	}
}

module.exports = Installation