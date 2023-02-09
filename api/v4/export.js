const express = require('express')
const router = express.Router()

const dataExportAPI = require('../../lib/api/dataexport')

router.post('/v4/export/csv', async (req, res) => {
	dataExportAPI.setHeader('Authorization', "Bearer " + req.lease.token)
	const data = await dataExportAPI.get('/v1/export/csv', req.body).then(r => r.data)

	if (!data) {
		return res.status(404)
	} else {
		return res.status(200).json(data)
	}
})

router.post('/v4/export/data', async (req, res) => {
	dataExportAPI.setHeader('Authorization', "Bearer " + req.lease.token)
	const data = await dataExportAPI.post('/v2/waterworks/export', req.body).then(r => r.data)

	if (!data) {
		return res.status(404);
	} else {
		return res.status(200).json(data)
	}
})

module.exports = router
