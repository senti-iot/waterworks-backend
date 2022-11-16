const createAPI = require('apisauce').create

let servicesAPI = createAPI({
	baseURL: process.env.REACT_APP_WBACKEND,
	timeout: 300000,
	headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json'
	}
})
module.exports = servicesAPI