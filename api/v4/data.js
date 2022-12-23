const express = require('express')
const router = express.Router()
const moment = require('moment')

const databrokerAPI = require('../../lib/api/dataBroker')
const coreAPI = require('../../lib/api/core')
const wrcAPI = require('../../lib/api/wrc')

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
	databrokerAPI.setHeader('Authorization', "Bearer " + process.env.SENTI_TOKEN)

	let startDate = moment(req.params.from).format('YYYY-MM-DD HH:mm:ss')
	let endDate = moment(req.params.to).format('YYYY-MM-DD HH:mm:ss')

	const response = await databrokerAPI.get(`/v2/waterworks/data/usagebyday/${startDate}/${endDate}`)

	if (!response) {
		return res.status(404)
	} else {
		return res.status(200).json(response.data)
	}
})

router.post('/v4/data/usagebyday/:from/:to', async (req, res) => {
	databrokerAPI.setHeader('Authorization', "Bearer " + process.env.SENTI_TOKEN)

	const startDate = moment(req.params.from).format('YYYY-MM-DD HH:mm:ss')
	const endDate = moment(req.params.to).format('YYYY-MM-DD HH:mm:ss')
	const uuids = req.body

	let response = await databrokerAPI.post(`/v2/waterworks/data/usagebyday/${startDate}/${endDate}`, [uuids[0]])

	if (!response) {
		return res.status(404)
	} else {
		return res.status(200).json(response.data)
	}
})

router.post('/v4/data/cachedreading', async (req, res) => {
	let data = req.body
	data.period = {};
	data.period.from = moment(data.from).format('YYYY-MM-DD')
	data.period.to = moment(data.to).format('YYYY-MM-DD')

	if (data.uuids) {
		const response = await wrcAPI.post(`/reading`, data)
		return res.status(200).json(response.data)
	} else {
		return res.status(404)
	}
})

router.get('/v4/data/benchmarkbyhour/:orgUUID/:from/:to', async (req, res) => {
	databrokerAPI.setHeader('Authorization', "Bearer " + process.env.SENTI_TOKEN)

	const startDate = moment(req.params.from).format('YYYY-MM-DD HH:mm:ss')
	const endDate = moment(req.params.to).format('YYYY-MM-DD HH:mm:ss')

	let response = await databrokerAPI.get(`/v2/waterworks/data/benchmark/byhour/${req.params.orgUUID}/${startDate}/${endDate}`)

	if (!response) {
		return res.status(404)
	} else {
		return res.status(200).json(response.data)
	}
})

router.get('/v4/data/benchmarkbyday/:orgUUID/:from/:to', async (req, res) => {
	databrokerAPI.setHeader('Authorization', "Bearer " + process.env.SENTI_TOKEN)

	const startDate = moment(req.params.from).format('YYYY-MM-DD')
	const endDate = moment(req.params.to).format('YYYY-MM-DD')

	const response = await databrokerAPI.get(`/v2/waterworks/data/benchmark/${req.params.orgUUID}/${startDate}/${endDate}`)

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
		let data = response.data;

		//smooth out missing days
		const dates = data.map(item => new Date(item.datetime));

		for (let i = 0; i < dates.length - 1; i++) {
			const currentDate = dates[i];
			const nextDate = dates[i + 1];
			const diffInDays = moment(nextDate).diff(currentDate, 'days');

			if (diffInDays > 1) {
				const value = data[i + 1].value / diffInDays;
				const totalFlowPerDay = data[i + 1].totalFlowPerDay / diffInDays;
				const totalFlowPerSecond = data[i + 1].totalFlowPerSecond / diffInDays;

				for (let j = 0; j < diffInDays; j++) {
					const missingDay = moment(currentDate).utc().add(j + 1, 'days');
					dates.splice(i + 1 + j, 0, missingDay);
					data.splice(i + 1 + j, 0, { value, totalFlowPerDay, totalFlowPerSecond, datetime: moment(missingDay), calculated: true });

				}

				//also add calculated to the last day
				const nextDateObj = data.find(d => moment(d.datetime).isSame(moment(nextDate)));
				const index = data.indexOf(nextDateObj);
				data.splice(index, 1, { value, totalFlowPerDay, totalFlowPerSecond, datetime: moment(nextDate), calculated: true });
			}
		}

		// console.log(data);

		return res.status(200).json(data)
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

		if (response.ok) {
			return res.status(200).json(response.data)
		} else {
			return res.status(404)
		}
	} else {
		return res.status(404)
	}
})

router.post('/v4/data/:field/:from/:to', async (req, res) => {
	databrokerAPI.setHeader('Authorization', "Bearer " + process.env.SENTI_TOKEN)

	let startDate = moment(req.params.from).format('YYYY-MM-DD HH:mm:ss')
	let endDate = moment(req.params.to).format('YYYY-MM-DD HH:mm:ss')

	const response = await databrokerAPI.post(`/v2/waterworks/data/${req.params.field}/${startDate}/${endDate}`, req.body)

	if (!response) {
		return res.status(404)
	} else {
		return res.status(200).json(response.data)
	}
})

module.exports = router