#!/usr/bin/env nodejs
process.title = "waterworks-backend"
const dotenv = require('dotenv').config()
if (dotenv.error) {
	console.warn(dotenv.error)
}
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const app = express()


const sentiAuthClient = require('senti-apicore').sentiAuthClient
const authClient = new sentiAuthClient(process.env.SENTICOREURL, process.env.PASSWORDSALT)
module.exports.authClient = authClient

// API endpoint imports
const test = require('./api/index')
const onboardingInstallation = require('./api/onboarding/installation')
const onboardingUser = require('./api/onboarding/user')
const settingsPrice = require('./api/settings/price')

const port = process.env.NODE_PORT || 3029

app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors())

//---API---------------------------------------
app.use([test])
app.use([onboardingInstallation, onboardingUser])
app.use([settingsPrice])

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

// const mysqlConn = require('./mysql/mysql_handler')

// async function testsql() {
// 	let select = `SELECT * FROM test`
// 	let rs = await mysqlConn.query(select, [])
// 	console.log(rs[0])
// }

// testsql()
