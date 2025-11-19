const express = require('express');
const router = express.Router();
// Import the new getPOById function
const {
    getClients,
    getJobs,
    getTalents,
    createPO,
    getPOById
} = require('../controllers/poController');

router.get('/clients', getClients);
router.get('/jobs', getJobs);
router.get('/talents', getTalents);

// Route to save
router.post('/purchase-order', createPO);

// Route to fetch by ID (Used on page refresh/edit)
router.get('/purchase-order/:id', getPOById);

module.exports = router;