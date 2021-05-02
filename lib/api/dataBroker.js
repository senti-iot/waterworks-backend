const createAPI = require('apisauce').create

let databrokerAPI = createAPI({
	baseURL: process.env.SENTIDATABROKER,
	timeout: 300000,
	headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json'
	}
})
module.exports = databrokerAPI