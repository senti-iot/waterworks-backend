const createAPI = require('apisauce').create

let databrokerAPI = createAPI({
	baseURL: process.env.SENTI_DATABROKER,
	timeout: 300000,
	headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json'
	}
})
module.exports = databrokerAPI