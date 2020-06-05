#!/usr/bin/env nodejs
process.title = "waterworks-backend"
const dotenv = require('dotenv').config()
if (dotenv.error) {
	console.warn(dotenv.error)
}

const createAPI = require('apisauce').create
const CronJob = require('cron').CronJob

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const app = express()


const sentiAuthClient = require('senti-apicore').sentiAuthClient
const authClient = new sentiAuthClient(process.env.SENTICOREURL, process.env.PASSWORDSALT)
module.exports.authClient = authClient

const sentiAclBackend = require('senti-apicore').sentiAclBackend
const sentiAclClient = require('senti-apicore').sentiAclClient

const aclBackend = new sentiAclBackend(process.env.ACLBACKENDTURL)
const aclClient = new sentiAclClient(aclBackend)
module.exports.aclClient = aclClient

// API endpoint imports
const test = require('./api/index')
const onboardingInstallation = require('./api/onboarding/installation')
const onboardingUser = require('./api/onboarding/user')
const settingsPrice = require('./api/settings/price')
const settingsGlobals = require('./api/settings/globals')

const port = process.env.NODE_PORT || 3029

app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors())

//---API---------------------------------------
app.use([test])
app.use([onboardingInstallation, onboardingUser])
app.use([settingsPrice, settingsGlobals])

//---Start the express server---------------------------------------------------

const startServer = () => {
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

const job = new CronJob('*/10 * * * * *', async function() {
	const d = new Date();
	console.log(d);
	
	if (authClient.getStoredToken() === false) {
		let login = await authClient.login(process.env.SENTIUSER, process.env.SENTIPASS)
		authClient.setStoredToken(login.token)
	}
	if (await authClient.getTokenLease(authClient.getStoredToken()) === false) {
		authClient.setStoredToken((await authClient.login(process.env.SENTIUSER, process.env.SENTIPASS)).token)
	}
	dataBrokerAPI.setHeader('Authorization', 'Bearer ' + authClient.getStoredToken())
	console.log('SET WLHOST', process.env.WLHOST)
	dataBrokerAPI.setHeader('wlhost', process.env.WLHOST)

	let deviceGet = await dataBrokerAPI.get('/v2/waterworks/alarm/threshold/489043f8-16ef-4b56-8f66-0b0bfa55e0d4')
	console.log(deviceGet.ok, deviceGet.data)
});
job.start();

