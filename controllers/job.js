const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');
const { Job } = require('../models/Job');
const createJob = async (req, res) => {
    const { company, position } = req.body;
    const job = await Job.create({ company, position, "createdBy": req.user.userId })
    res.status(StatusCodes.CREATED).json({ job });
}

const getAllJobs = async (req, res) => {
    const jobs = await Job.find({ createdBy: req.user.userId });
    res.status(StatusCodes.OK).json({ "counts": jobs.length, jobs });
}


const getSingleJob = async (req, res) => {
    const { params: { id }, user: { userId } } = req
    const job = await Job.findOne({ _id: id, createdBy: userId });
    if (!job) {
        throw new BadRequestError('There is no job!')
    }
    res.status(StatusCodes.OK).json(job);
}
const updateJob = async (req, res) => {
    const { body: { company, position }, params: { id }, user: { userId } } = req;
    if (!company || !position) {
        throw new BadRequestError('No Data Porvided for company and position!')
    }
    const job = await Job.findOneAndUpdate({ _id: id, createdBy: userId }, req.body);
    if (!job) {
        throw new NotFoundError('No Job Found!');
    }
    res.status(StatusCodes.OK).json(job);
}
const deleteJob = async (req, res) => {
    const { params: { id }, user: { userId } } = req;
    const job = await Job.findOneAndRemove({ _id: id, createdBy: userId });
    if (!job) {
        throw new NotFoundError('There is no Job!')
    }

    res.status(StatusCodes.OK).json({ job });
}

module.exports = {
    createJob,
    getAllJobs,
    getSingleJob,
    updateJob,
    deleteJob
}