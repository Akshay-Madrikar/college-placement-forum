const Industry = require('../models/industry');

exports.industryById = async (req ,res, next, id) => {
    try {
        const industry = await Industry.findById(id).exec();
        if(!industry) {
            throw new Error();
        }

        req.industry = industry;
        next();
    } catch(error) {
        res.status(400).json({
            error: 'No such industry'
        });
    };
};

exports.create = async (req, res) => {
    try {
        const industry = new Industry(req.body);
        await industry.save();
        res.status(201).json({
            industry
        })
    } catch(error) {
        res.status(400).json({
            error
        });
    };
};

exports.read = (req, res) => {
    res.status(200).json(req.industry);
};

exports.update = async (req, res) => {
    try {
        const industry = req.industry;
        industry.name = req.body.name;
        await industry.save();
        res.status(201).json(industry);
    } catch(error) {
        res.status(400).json({
            error
        });
    };
};

exports.remove = async (req, res) => {
    try {
        const industry = req.industry;
        const {_id, name} = industry;
        await industry.remove();
        res.status(201).json({
            industry: {_id, name},
            message: 'Industry deleted successfully!'
        });
    } catch(error) {
        res.status(400).json({
            error
        });
    };
};

exports.list = async (req, res) => {
    try {
        const industries = await Industry.find({});
        if(!industries) {
            throw new Error();
        }

        res.status(201).json(industries);
    } catch(error) {
        res.status(400).json({
            error: 'Industries not found'
        });
    };
};