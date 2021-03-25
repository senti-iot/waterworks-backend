const { sentiData } = require('senti-apicore')

class InstallationDB extends sentiData {
	id = null
	uuid = null
	address = null
	orgId = null

	constructor(data = null, vars = null) {
		super()
		this.assign(data, vars)
	}
}

module.exports = InstallationDB