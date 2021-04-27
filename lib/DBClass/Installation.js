const { sentiData } = require('senti-apicore')

class Installation extends sentiData {
	id = null
	uuid = null
	address = null
	orgUUID = null
	state = null
	adults = null
	children = null
	org = null
	constructor(data = null, vars = null) {
		super()
		this.assignData(data, vars)
	}
}

module.exports = Installation