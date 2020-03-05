const { sentiData } = require('senti-apicore')

class InstallationInfo extends sentiData {
	orgUUID = null
	roleUUID = null
	orgIdent = null
	installationId = null
	deviceIdent = null
	firstName
	lastName
	email
	adults
	children

	constructor(data = null, vars = null) {
		super()
		this.assignData(data, vars)
	}
}
module.exports = InstallationInfo