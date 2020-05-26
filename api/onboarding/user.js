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
const { sentiAclPriviledge, sentiAclResourceType } = require('senti-apicore')

const authClient = require('../../server').authClient
const aclClient = require('../../server').aclClient

const mysqlConn = require('../../mysql/mysql_handler')
const InstallationInfo = require('./dataClasses/InstallationInfo')

// router.get('/onboarding/userfix/:uuid', async (req, res) => {
// 	if (authClient.getStoredToken() === false) {
// 		let login = await authClient.login(process.env.SENTIUSER, process.env.SENTIPASS)
// 		authClient.setStoredToken(login.token)
// 	}
// 	if (await authClient.getTokenLease(authClient.getStoredToken()) === false) {
// 		authClient.setStoredToken((await authClient.login(process.env.SENTIUSER, process.env.SENTIPASS)).token)
// 	}
// 	coreAPI.setHeader('Authorization', 'Bearer ' + authClient.getStoredToken())
// 	dataBrokerAPI.setHeader('Authorization', 'Bearer ' + authClient.getStoredToken())
// 	if (req.headers['wlhost']) {
// 		console.log('SET WLHOST', req.headers['wlhost'])
// 		coreAPI.setHeader('wlhost', req.headers['wlhost'])
// 		dataBrokerAPI.setHeader('wlhost', req.headers['wlhost'])
// 	}
// 	let userPost = await coreAPI.get(`/v2/entity/users/${req.params.uuid}`)
// 	if(userPost.ok === false) {
// 		res.status(userPost.status).json()
// 		return
// 	}
// 	let users = []
// 	await userPost.data.reduce(async (promise, user) => {
// 		// This line will wait for the last async function to finish.
// 		// The first iteration uses an already resolved Promise
// 		// so, it will immediately continue.
// 		await promise;
// 		console.log(user.uuid)
// 		let internalPost = await coreAPI.get(`/v2/entity/user/${user.uuid}/internal`)
// 		if(internalPost.ok === false) {
// 			res.status(internalPost.status).json()
// 			return
// 		}
// 		console.log(internalPost.data.internal)
// 		if (internalPost.data.internal && internalPost.data.internal.sentiWaterworks) {
// 			let resources = await aclClient.findResources(user.uuid, '00000000-0000-0000-0000-000000000000', sentiAclResourceType.device, sentiAclPriviledge.device.read)
// 			if (resources.length === 0) {
// 				res.status(404).json([])
// 				return
// 			}
// 			let deviceUUIDs = (resources.length > 0) ? resources.map(item => { return item.uuid }) : []
// 			internalPost.data.internal.sentiWaterworks.devices = deviceUUIDs

// 			let userInternalPost = await coreAPI.put('/v2/entity/user/' + user.uuid + '/internal', internalPost.data.internal)
// 			if(userInternalPost.ok === false) {
// 				console.log('error on ', internalPost.data)
// 			}
	
// 			users.push(internalPost.data)
// 		}
// 	}, Promise.resolve());
// 	res.status(200).json(users);
// })
router.post('/onboarding/user/:installationuuid', async (req, res) => {
	// Check installation
	let select = `SELECT uuid,
						orgUUID,
						orgIdent,
						installationId,
						deviceIdent,
						deviceUuname,
						firstName,
						lastName,
						email,
						adults,
						children 
					FROM installations I 
					WHERE I.uuid = ? 
						AND I.state = ?`
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
	if (req.headers['wlhost']) {
		console.log('SET WLHOST', req.headers['wlhost'])
		coreAPI.setHeader('wlhost', req.headers['wlhost'])
		dataBrokerAPI.setHeader('wlhost', req.headers['wlhost'])
	}

	console.log(req.body)
	let userPost = await coreAPI.post('/v2/entity/user', req.body)
	if(userPost.ok === false) {
		res.status(userPost.status).json()
		return
	}
	let deviceGet = await dataBrokerAPI.get('/v2/waterworks/organisation/' + installation.orgUUID + '/device/' + installation.deviceUuname)
	if(deviceGet.ok === false) {
		res.status(deviceGet.status).json()
		return
	}
	let devices = []
	devices.push(deviceGet.data.uuid)

	if (req.body.internal && req.body.internal.sentiWaterworks) {
		req.body.internal.sentiWaterworks.devices = devices
	} else {
		req.body.internal.sentiWaterworks = {}
		req.body.internal.sentiWaterworks.devices = devices
	}
	if (req.body.internal) {
		let userInternalPost = await coreAPI.put('/v2/entity/user/' + userPost.data.uuid + '/internal', req.body.internal)
		if(userInternalPost.ok === false) {
			res.status(userInternalPost.status).json()
			return
		}
	}
	let addDevicePost = await dataBrokerAPI.post(`/v2/waterworks/adddevice/${deviceGet.data.uuid}/touser/${userPost.data.uuid}`)

	let update = `UPDATE installations I SET I.state = ? WHERE I.uuid = ?`
	let rsUpdate = await mysqlConn.query(update, [1, installation.uuid])

	res.status(200).json(true);
});

module.exports = router