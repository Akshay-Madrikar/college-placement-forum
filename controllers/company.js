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

exports.list = async (req ,res) => {
    // by most_placed - /companies?sortBy=count_of_placed_students&order=desc&limit=4
    // by arrivals - /companies?sortBy=createdAt&order=desc&limit=4
    // if no params - /companies
    try{
        let order = req.query.order ? req.query.order : 'asc';
        let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
        let limit = req.query.limit ? parseInt(req.query.limit) : 6;
    
        const companies = await Company.find()
                                .populate('industryName')
                                .sort([[sortBy, order]])
                                .limit(limit)
                                .exec();
        res.status(200).json({companies});
    } catch(error) {
        res.status(400).json({
            error: 'Companies not found!'
        });
    } 
};

exports.listBySearch = async (req, res) => {
    try {
        let order = req.body.order ? req.body.order : "desc";
        let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
        let limit = req.body.limit ? parseInt(req.body.limit) : 100;
        let skip = parseInt(req.body.skip);
        let findArgs = {};
     
        for (let key in req.body.filters) {
            if (req.body.filters[key].length > 0) {
                if (key === "price") {
                    // gte -  greater than price [0-10]
                    // lte - less than
                    findArgs[key] = {
                        $gte: req.body.filters[key][0],
                        $lte: req.body.filters[key][1]
                    };
                } else {
                    findArgs[key] = req.body.filters[key];
                }
            }
        }
    
        const companiesBySearch = await Company.find(findArgs)
            .populate("industryName")
            .sort([[sortBy, order]])
            .skip(skip)
            .limit(limit)
            .exec();

        res.status(200).json({
            size: companiesBySearch.length,
            companiesBySearch
        });
    } catch(error) {
        res.status(400).json({
            error: 'Companies not found!'
        });
    }
};