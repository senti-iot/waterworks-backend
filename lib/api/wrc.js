const createAPI = require('apisauce').create

let token = process.env.SENTI_TOKEN
let wrcAPI = createAPI({
	baseURL: process.env.WRCURL,
	timeout: 300000,
	headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json',
		'Authorization': `Bearer ${token}`
	}
})
module.exports = wrcAPI