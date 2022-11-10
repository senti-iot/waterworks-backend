const express = require('express')
const router = express.Router()

const databrokerAPI = require('../../lib/api/dataBroker')

router.post('/v4/data/:field/:from/:to', async (req, res) => {
	databrokerAPI.setHeader('Authorization', "Bearer " + process.env.SENTI_TOKEN)
	const data = await databrokerAPI.post(`/v2/waterworks/data/${req.params.field}/${req.params.from}/${req.params.to}`, req.body).then(r => r.data)

	if (!data) {
		return res.status(404);
	} else {
		return res.status(200).json(data)
	}
})

module.exports = router