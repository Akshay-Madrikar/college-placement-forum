const Company = require('../models/company');

exports.companyById = async(req ,res, next, id) => {
    try{
        const company = await Company.findById(id).populate('category').exec();
        if(!company) {
            throw new Error();
        }
        req.company = company;
        next();
    } catch(error) {
        res.status(404).json({
            error: 'No such product!'
        });
    }
};

exports.read = async(req, res) => {
    return res.status(200).json(req.company);
};

exports.create = async(req, res) => {
    try {
        const company = new Company(req.body);
        await company.save();
        res.status(201).json({
            company
        });
    } catch (error) {
        res.status(400).json({
            error
        });
    }
};