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
        const { formData, pic } = req.body;
        const { name, description, industryName, openings, count_of_placed_students} = formData;
        const company = new Company({ name, description, industryName, openings, count_of_placed_students, pic });
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