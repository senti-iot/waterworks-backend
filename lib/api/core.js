const createAPI = require('apisauce').create

let coreAPI = createAPI({
	baseURL: process.env.SENTICOREURL,
	timeout: 300000,
	headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json'
	}
})
module.exports = coreAPI