const express = require('express')
const router = express.Router()
const moment = require('moment')

const databrokerAPI = require('../../lib/api/dataBroker')
const coreAPI = require('../../lib/api/core')
const wrcAPI = require('../../lib/api/wrc')

router.post('/v4/data/:field/:from/:to', async (req, res) => {
	databrokerAPI.setHeader('Authorization', "Bearer " + process.env.SENTI_TOKEN)

	let startDate = moment(from).format('YYYY-MM-DD HH:mm:ss')
	let endDate = moment(to).format('YYYY-MM-DD HH:mm:ss')

	const response = await databrokerAPI.post(`/v2/waterworks/data/${startDate}/${endDate}/${req.params.to}`, req.body)

	if (!response) {
		return res.status(404)
	} else {
		return res.status(200).json(response.data)
	}
})

router.get('/v4/data/usagebyhour/:from/:to', async (req, res) => {
	coreAPI.setHeader('Authorization', "Bearer " + process.env.SENTI_TOKEN)

	let startDate = moment(req.params.from).format('YYYY-MM-DD HH:mm:ss')
	let endDate = moment(req.params.to).format('YYYY-MM-DD HH:mm:ss')

	const response = await coreAPI.get(`/v2/waterworks/data/usagebyhour/${startDate}/${endDate}`)

	if (!response) {
		return res.status(404)
	} else {
		return res.status(200).json(response.data)
	}
})

router.post('/v4/data/usagebyhour/:from/:to', async (req, res) => {
	coreAPI.setHeader('Authorization', "Bearer " + process.env.SENTI_TOKEN)

	let startDate = moment(req.params.from).format('YYYY-MM-DD HH:mm:ss')
	let endDate = moment(req.params.to).format('YYYY-MM-DD HH:mm:ss')

	const response = await coreAPI.post(`/v2/waterworks/data/usagebyhour/${startDate}/${endDate}`, req.body)

	if (!response) {
		return res.status(404)
	} else {
		return res.status(200).json(response.data)
	}
})

router.get('/v4/data/usagebyday/:from/:to', async (req, res) => {
	coreAPI.setHeader('Authorization', "Bearer " + process.env.SENTI_TOKEN)

	let startDate = moment(req.params.from).format('YYYY-MM-DD HH:mm:ss')
	let endDate = moment(req.params.to).format('YYYY-MM-DD HH:mm:ss')

	const response = await coreAPI.get(`/v2/waterworks/data/usagebyday/${startDate}/${endDate}`)

	if (!response) {
		return res.status(404)
	} else {
		return res.status(200).json(response.data)
	}
})

router.post('/v4/data/usagebyday/:from/:to', async (req, res) => {
	coreAPI.setHeader('Authorization', "Bearer " + process.env.SENTI_TOKEN)

	let startDate = moment(req.params.from).format('YYYY-MM-DD HH:mm:ss')
	let endDate = moment(req.params.to).format('YYYY-MM-DD HH:mm:ss')

	const response = await coreAPI.post(`/v3/usage/byday/${startDate}/${endDate}`, req.body)

	if (!response) {
		return res.status(404)
	} else {
		return res.status(200).json(response.data)
	}
})

router.post('/v4/data/cachedreading', async (req, res) => {
	let data = req.body
	data.from = moment(data.from).format('YYYY-MM-DD')
	data.to = moment(data.to).format('YYYY-MM-DD')

	if (data.uuids) {
		const response = await wrcAPI.post(`/reading`, data)
		return res.status(200).json(response.data)
	} else {
		return res.status(404)
	}
})

router.get('/v4/data/benchmarkperhour', async (req, res) => {
	databrokerAPI.setHeader('Authorization', "Bearer " + process.env.SENTI_TOKEN)

	const startDate = moment(req.params.from).format('YYYY-MM-DD HH:mm:ss')
	const endDate = moment(req.params.to).format('YYYY-MM-DD HH:mm:ss')

	let response = await databrokerAPI.get(`/v2/waterworks/data/benchmark/byhour/${orgUuid}/${startDate}/${endDate}`)

	if (!response) {
		return res.status(404)
	} else {
		return res.status(200).json(response.data)
	}
})

router.get('/v4/data/benchmarkperday', async (req, res) => {
	databrokerAPI.setHeader('Authorization', "Bearer " + process.env.SENTI_TOKEN)

	const startDate = moment(req.params.from).format('YYYY-MM-DD')
	const endDate = moment(req.params.to).format('YYYY-MM-DD')

	const response = await databrokerAPI.get(`/v2/waterworks/data/benchmark/${orgUuid}/${startDate}/${endDate}`)

	if (!response) {
		return res.status(404)
	} else {
		return res.status(200).json(response.data)
	}
})

router.post('/v4/data/benchmarkcustom', async (req, res) => {
	databrokerAPI.setHeader('Authorization', "Bearer " + process.env.SENTI_TOKEN)

	const data = req.body
	const startDate = moment(data.from).format('YYYY-MM-DD')
	const endDate = moment(data.to).format('YYYY-MM-DD')
	const uuids = data.uuids

	const response = await databrokerAPI.post(`/v2/waterworks/data/custom-benchmark/${startDate}/${endDate}`, uuids)

	if (!response) {
		return res.status(404)
	} else {
		return res.status(200).json(response.data)
	}
})

router.post('/v4/data/cachedtotalvolume', async (req, res) => {
	const data = req.body
	const startDate = moment(data.from).format('YYYY-MM-DD')
	const endDate = moment(data.to).format('YYYY-MM-DD')
	const uuids = data.uuids
	const orgUUID = data.orgUUID

	let response
	if (uuids) {
		response = await wrcAPI.post(`/usage`, {
			orgId: orgUUID,
			period: {
				from: startDate,
				to: endDate
			},
			uuids: uuids
		})
	} else {
		response = await wrcAPI.post(`/usage`, {
			orgId: orgUUID,
			period: {
				from: startDate,
				to: endDate
			},
			uuids: uuids
		})
	}

	if (!response.ok) {
		return res.status(404)
	} else {
		return res.status(200).json(response.data)
	}
})

router.post('/v4/data/cachedtemeraturewmin', async (req, res) => {
	const data = req.body
	const startDate = moment(data.from).format('YYYY-MM-DD')
	const endDate = moment(data.to).format('YYYY-MM-DD')
	const uuids = data.uuids
	const orgUUID = data.orgUUID

	let response = {}
	if (uuids) {
		response = await wrcAPI.post(`/minwtemp`, {
			orgId: orgUUID,
			period: {
				from: startDate,
				to: endDate
			},
			uuids: uuids
		})

		if (response.ok) {
			return res.status(200).json(response.data)
		} else {
			return res.status(404)
		}
	} else {
		return res.status(404)
	}
})

router.post('/v4/data/cachedtemeratureamin', async (req, res) => {
	const data = req.body
	const startDate = moment(data.from).format('YYYY-MM-DD')
	const endDate = moment(data.to).format('YYYY-MM-DD')
	const uuids = data.uuids
	const orgUUID = data.orgUUID

	let response = {}
	if (uuids) {
		response = await wrcAPI.post(`/minatemp`, {
			orgId: orgUUID,
			period: {
				from: startDate,
				to: endDate
			},
			uuids: uuids
		})

		if (response.ok) {
			return res.status(200).json(response.data)
		} else {
			return res.status(404)
		}
	} else {
		return res.status(404)
	}
})

router.post('/v4/data/cachedflowmax', async (req, res) => {
	const data = req.body
	const startDate = moment(data.from).format('YYYY-MM-DD')
	const endDate = moment(data.to).format('YYYY-MM-DD')
	const uuids = data.uuids
	const orgUUID = data.orgUUID

	let response = {}
	if (uuids) {
		response = await wrcAPI.post(`/maxflow`, {
			orgId: orgUUID,
			period: {
				from: startDate,
				to: endDate
			},
			uuids: uuids
		})
		console.log(response.data)

		if (response.ok) {
			return res.status(200).json(response.data)
		} else {
			return res.status(404)
		}
	} else {
		return res.status(404)
	}
})

module.exports = router