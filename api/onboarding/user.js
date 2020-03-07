const express = require('express')
const router = express.Router()
const createAPI = require('apisauce').create

const dataBrokerAPI = createAPI({
	baseURL: process.env.SENTIDATABROKER,
	headers: { 
		'Accept': 'application/json', 
		'Content-Type': 'application/json',
		'User-Agent': 'Senti.io v2'
	}
})
const coreAPI = createAPI({
	baseURL: process.env.SENTICOREURL,
	headers: { 
		'Accept': 'application/json', 
		'Content-Type': 'application/json',
		'User-Agent': 'Senti.io v2'
	}
})
const authClient = require('../../server').authClient

const mysqlConn = require('../../mysql/mysql_handler')
const InstallationInfo = require('./dataClasses/InstallationInfo')

router.post('/onboarding/user/:installationuuid', async (req, res) => {
	// Check installation
	let select = `SELECT * FROM installations I WHERE I.uuid = ? AND I.state = ?`
	let rs = await mysqlConn.query(select, [req.params.installationuuid, 0])
	if (rs[0].length !== 1) {
		res.status(404).json()
		return
	}
	let installation = new InstallationInfo(rs[0][0])
	
	if (authClient.getStoredToken() === false) {
		let login = await authClient.login(process.env.SENTIUSER, process.env.SENTIPASS)
		authClient.setStoredToken(login.token)
	}
	if (await authClient.getTokenLease(authClient.getStoredToken()) === false) {
		authClient.setStoredToken((await authClient.login(process.env.SENTIUSER, process.env.SENTIPASS)).token)
	}
	coreAPI.setHeader('Authorization', 'Bearer ' + authClient.getStoredToken())
	dataBrokerAPI.setHeader('Authorization', 'Bearer ' + authClient.getStoredToken())

	console.log(req.body)
	let userPost = await coreAPI.post('/v2/entity/user', req.body)
	if(userPost.ok === false) {
		res.status(userPost.status).json()
		return
	}
	console.log(userPost.data)
	let deviceGet = await dataBrokerAPI.get(`/v2/waterworks/organisation/${installation.orgUUID}/device/${installation.deviceIdent}`)
	if(deviceGet.ok === false) {
		res.status(deviceGet.status).json()
		return
	}
	console.log(deviceGet.data)
	let addDevicePost = await dataBrokerAPI.post(`/v2/waterworks/adddevice/${deviceGet.data.uuid}/touser/${userPost.data.uuid}`)
	console.log(addDevicePost.ok)

	let update = `UPTDATE installations I SET I.state = ? WHERE I.uuid = ?`
	let rsUpdate = await mysqlConn.query(select, [req.params.installationuuid, 1])

	res.status(200).json(true);
});

module.exports = router