const { sentiData } = require('senti-apicore')

class InstUserUI extends sentiData {
	uuid = null
	startDate = null
	endDate = null
	user = {}
	instUUID = null

	constructor(data = null, vars = null) {
		super()
		this.assignData(data, vars)
	}
}

module.exports = InstUserUI