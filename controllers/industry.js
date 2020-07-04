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