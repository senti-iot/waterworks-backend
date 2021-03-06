const { sentiData } = require('senti-apicore')

class InstallationInfo extends sentiData {
	uuid = null
	orgUUID = null
	roleUUID
	orgIdent = null
	installationId = null
	deviceIdent = null
	deviceUuname = null
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