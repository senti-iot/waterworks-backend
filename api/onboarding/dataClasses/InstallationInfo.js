const { sentiData } = require('senti-apicore')

class InstallationInfo extends sentiData {
	orgUUID = null
	orgIdent = null
	installationId = null
	deviceIdent = null
	firstName
	lastName
	email
	adults
	chrildren

	constructor(data = null, vars = null) {
		super()
		this.assignData(data, vars)
	}
}
module.exports = InstallationInfo