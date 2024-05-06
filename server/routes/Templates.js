const express = require('express');
const router = express.Router();
const pool = require('../db'); // Assuming you have a 'db.js' that sets up your PostgreSQL pool

router.get('/', async (req, res) => {
    try {
        const templatesQuery = await pool.query('SELECT * FROM email_templates');
        res.json(templatesQuery.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
