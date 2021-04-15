#!/usr/bin/env nodejs
process.title = "waterworks-backend"
const dotenv = require('dotenv').config()
if (dotenv.error) {
	console.warn(dotenv.error)
}

const iconv = require('iconv-lite')
const encodings =  require('iconv-lite/encodings')
iconv.encodings = encodings;

const createAPI = require('apisauce').create
const CronJob = require('cron').CronJob

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const app = express()

const mysqlConn = require('./mysql/mysql_handler')

const sentiAuthClient = require('senti-apicore').sentiAuthClient
const authClient = new sentiAuthClient(process.env.SENTICOREURL, process.env.PASSWORDSALT)
module.exports.authClient = authClient

const sentiAclBackend = require('senti-apicore').sentiAclBackend
const sentiAclClient = require('senti-apicore').sentiAclClient

const aclBackend = new sentiAclBackend(process.env.ACLBACKENDTURL)
const aclClient = new sentiAclClient(aclBackend)
module.exports.aclClient = aclClient

/**
 *  API endpoint imports
 * */
const test = require('./api/index')
const onboardingInstallation = require('./api/onboarding/installation')
const onboardingUser = require('./api/onboarding/user')
const settingsPrice = require('./api/settings/price')
const settingsGlobals = require('./api/settings/globals')
/**
 * V3
 */
//--- Auth ---
const auth = require('./api/auth')
//--- Instalations ---
const installation = require('./api/installations/installation')
const installationDevices = require('./api/installations/installationDevices')
const installationUsers = require('./api/installations/installationUsers')
const installations = require('./api/installations/installations')
//--- Data Series ---
const benchmark = require('./api/dataSeries/benchmark')
const reading = require('./api/dataSeries/reading')
const totalUsageByDay = require('./api/dataSeries/totalUsageByDay')
const totalUsageByHour = require('./api/dataSeries/totalUsageByHour')
const usageByDay = require('./api/dataSeries/usageByDay')
const usageByHour = require('./api/dataSeries/usageByHour')

//--- App Port ---
const port = process.env.NODE_PORT || 3029

app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors())

//---API---------------------------------------
// app.use([auth])
app.use([installation, /* installationDevices, installationUsers, */ installations,
	benchmark, reading, totalUsageByDay, totalUsageByHour, usageByDay, usageByHour
])
app.use([test])
app.use([onboardingInstallation, onboardingUser])
app.use([settingsPrice, settingsGlobals])

//---Start the express server---------------------------------------------------
var allRoutes = require('./lib/routeLogger')

const startServer = () => {
	allRoutes(app)
	app.listen(port, () => {
		console.log('Senti Service started on port', port)
	}).on('error', (err) => {
		if (err.errno === 'EADDRINUSE') {
			console.log('Service not started, port ' + port + ' is busy')
		} else {
			console.log(err)
		}
	})
}

startServer()

const dataBrokerAPI = createAPI({
	baseURL: process.env.SENTIDATABROKER,
	headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json',
		'User-Agent': 'Senti.io v2'
	}
})

module.exports = app
//Move this to a separate Service Mikkel...

// async function submitAlarmThreshold() {
// 	let select = `SELECT i.orgUUID as uuid FROM installationSettings i`
// 	let rs = await mysqlConn.query(select, [])
// 	if (rs[0].length === 0) {
// 		return
// 	}
// 	if (authClient.getStoredToken() === false) {
// 		let login = await authClient.login(process.env.SENTIUSER, process.env.SENTIPASS)
// 		authClient.setStoredToken(login.token)
// 	}
// 	if (await authClient.getTokenLease(authClient.getStoredToken()) === false) {
// 		authClient.setStoredToken((await authClient.login(process.env.SENTIUSER, process.env.SENTIPASS)).token)
// 	}
// 	dataBrokerAPI.setHeader('Authorization', 'Bearer ' + authClient.getStoredToken())
// 	dataBrokerAPI.setHeader('wlhost', process.env.WLHOST)

// 	rs[0].map(async org => {
// 		let deviceGet = await dataBrokerAPI.get(`/v2/waterworks/alarm/threshold/${org.uuid}`)
// 		console.log(org.uuid, deviceGet.ok)
// 	})
// }

// const job = new CronJob('*/60 * * * *', async function() {
// 	const d = new Date()
// 	console.log(d)
// 	submitAlarmThreshold()
// })
// job.start()
// submitAlarmThreshold()
