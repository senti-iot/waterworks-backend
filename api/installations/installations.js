const express = require('express');
const router = express.Router();

/**
 * Get all installations
 */
router.get('v3/installations', (req, res) => {

	return res.status(200);
})

/**
 * Get all installations under ORG
 * @param {UUIDv4} req.params.orgUUID
 */

router.get('v3/installations/:orguuid', (req, res) => {
	let orgUUID = req.params.orguuid

	return res.status(200);
});

module.exports = router
