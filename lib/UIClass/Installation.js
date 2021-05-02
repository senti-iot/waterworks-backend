const { sentiData } = require('senti-apicore')

class InstallationUI extends sentiData {
	uuid = null
	address = null
	org = {}

	constructor(data = null, vars = null) {
		super()
		this.assign(data, vars)
	}
}

module.exports = InstallationUI