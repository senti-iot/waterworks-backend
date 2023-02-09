const createAPI = require('apisauce').create

let dataexportAPI = createAPI({
	baseURL: process.env.SENTIDATAEXPORT,
	timeout: 300000,
	headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json',
	}
})
module.exports = dataexportAPI