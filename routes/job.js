const express = require('express');
const router = express.Router();
const { getAllJobs, getSingleJob, updateJob, deleteJob, createJob } = require('../controllers/job');

router.route('/').post(createJob).get(getAllJobs);
router.route('/:id').get(getSingleJob).patch(updateJob).delete(deleteJob);

module.exports = router;