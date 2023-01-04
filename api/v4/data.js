const express = require('express')
const router = express.Router()
const moment = require('moment')

const databrokerAPI = require('../../lib/api/dataBroker')
const coreAPI = require('../../lib/api/core')
const wrcAPI = require('../../lib/api/wrc')
const installationService = require('../../lib/installationService')

const smoothMissingDays = (data) => {
	let newData = [];

	//push first
	newData.push({ ...data[0], calculated: false });

	for (let i = 0; i < data.length - 1; i++) {
		let d = data[i];
		let curDate = moment(d.datetime);
		let nextDate = moment(data[i + 1].datetime);
		let dayDiff = nextDate.diff(curDate, 'days');

		if (dayDiff > 1) {
			const value = data[i + 1].value / dayDiff;
			const totalFlowPerDay = data[i + 1].totalFlowPerDay;
			const totalFlowPerSecond = data[i + 1].totalFlowPerSecond;

			for (let j = 1; j <= dayDiff; j++) {
				newData.push({ value: value, totalFlowPerDay: totalFlowPerDay, totalFlowPerSecond: totalFlowPerSecond, datetime: moment(curDate).add(j, 'days'), calculated: true })
			}
		} else {
			newData.push({ ...data[i + 1], calculated: false });
		}
	}

	//push last if not calculated in the loop
	if (newData.length > 1) {
		const foundLast = newData.find(d => moment(newData[newData.length - 1].datetime).isSame(moment(data[data.length - 1].datetime), 'day'));
		if (foundLast === undefined) {
			newData.push({ ...data[data.length - 1], calculated: false });
		}
	}

	return newData;
}

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
		//smooth out missing days
		const newData = smoothMissingDays(response.data);

		return res.status(200).json(newData)
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
		// console.log(data);

		//smooth out missing days
		const newData = smoothMissingDays(data);

		return res.status(200).json(newData)
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

router.post('/v4/data/waterusageperson', async (req, res) => {
	const data = req.body
	const startDate = moment(data.from).format('YYYY-MM-DD')
	const endDate = moment(data.to).format('YYYY-MM-DD')

	let response

	response = await wrcAPI.post(`/usage`, {
		orgId: data.orgUUID,
		period: {
			from: startDate,
			to: endDate
		},
		uuids: data.uuids
	})

	if (!response.ok) {
		return res.status(404)
	} else {
		const usagedata = smoothMissingDays(response.data)

		let values = []
		usagedata.forEach(d => {
			values.push(d.value)
		})

		const avgUsage = (values.reduce((a, b) => a + b, 0) / values.length)

		const user = await coreAPI.get('/v2/auth/user').then(r => r.data)

		let installations = []

		if (!user) {
			return res.status(401);
		} else {
			const isSuperUser = user.role.priority <= 10 ? true : false
			const isSWAdmin = user.privileges.indexOf('waterworks.admin') > -1 ? true : false
	
			const service = new installationService(req.lease.token)
	
			if (isSuperUser || isSWAdmin) {
				installations = await service.getInstallationsByUUIDs(data.uuids)
				// installations = await service.getInstallationsByOrgUUID(user.org.uuid)
			} else {
				installations = await service.getInstallationsByUserUUID(user.uuid)
			}
		}

		let people = 0;
		installations.forEach(i => {
			if (!i.adults && !i.children) {
				people += 2.5
			} else if (i.adults && i.children) {
				people += i.adults + i.children / 2
			} else if (i.adults) {
				people += i.adults
			}
		})

		const result = avgUsage / people

		return res.status(200).json({ value: result })
	}
})

module.exports = router