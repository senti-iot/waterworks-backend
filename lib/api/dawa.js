const createAPI = require('apisauce').create

const dawaApi = createAPI({
	timeout: 30000,
	header: {
		'Accept': 'application/json',
		'Content-Type': 'application/json'
	}
})


module.exports = dawaApi