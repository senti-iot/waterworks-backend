const express = require('express')
const router = express.Router()
const { authClient } = require('../server')

router.all('*', async (req, res, next) => {

	let lease = await authClient.getLease(req)
	// console.log(lease)
	let bearerToken = await authClient.parseBearerToken(req)
	if (lease === false) {
		res.status(401).json('The lease is expired')
		return
	}
	// console.log('Authenticated')
	req.bearer = bearerToken
	req.lease = lease
	next()
})


module.exports = router