const Company = require('../models/company');

exports.companyById = async(req ,res, next, id) => {
    try{
        const company = await Company.findById(id)
                                    .populate('industryName')
                                    .populate('questions.submitted_by')
                                    .exec();
        if(!company) {
            throw new Error();
        }
        req.company = company;
        next();
    } catch(error) {
        res.status(404).json({
            error: 'No such company!'
        });
    }
};

exports.read = async(req, res) => {
    return res.status(200).json({company: req.company});
};

exports.create = async(req, res) => {
    try {
        const { formData, pic } = req.body;
        const { name, description, industryName, openings, count_of_placed_students} = formData;
        if(!name || !description || !industryName) {
            return res.status(400).json({
                error: 'Name, Description and Industry type fields are required!'
            });
        };

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

exports.update = async(req, res) => {
    let companyFields = {};
    try {
        const { formData, pic } = req.body;
        if(formData) {
            const { name, description, industryName, openings, count_of_placed_students} = formData;
          
            if(name) companyFields.name = name
            if(description) companyFields.description = description
            if(industryName) companyFields.industryName = industryName
            if(openings) companyFields.openings = openings
            if(count_of_placed_students) companyFields.count_of_placed_students = count_of_placed_students

        }

        if(pic.cloudinary_id) companyFields.pic = pic;
        
        const company = await Company.findByIdAndUpdate(req.company._id, {
            $set: companyFields
        }, {
            new: true
        });
        
        res.status(200).json({
            company
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

exports.remove = async (req, res) => {
    try {
        const company = req.company;
        await company.remove();
        res.status(200).json({
            company,
            message: 'Company deleted successfully!'
        });
    } catch(error) {
        res.status(400).json({
            error
        });
    };
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

exports.listAll = async (req, res) => {
    try {
        const companies = await Company.find({});
        if(!companies) {
            throw new Error();
        }

        res.status(201).json(companies);
    } catch(error) {
        res.status(400).json({
            error: 'Companies not found'
        });
    };
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
                    findArgs[key] = req.body.filters[key];
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

exports.listSearch = async (req, res) => {
    // To hold search and industry values 
    let query = {};
    //assign search value to query.name

    console.log(req.query)
    if(req.query.search) {
        query.name = {
            $regex: req.query.search,
            $options: 'i'
        }

        //assign industry value to  query.industry
        if(req.query.industry && req.query.industry !== 'All') {
            query.industry = req.query.industry
        }
        
        try {
            //Now we'll find products based on search and category
            const companies = await Company.find(query);
            res.status(200).json({companies});
        } catch (error) {
            res.status(400).json({
                error: 'Companies not found!'
            });
        }
    }
};

exports.addQuestion = async (req, res) => {
    try {
        const question = {
            text: req.body.text,
            submitted_by: req.profile._id
        }

        const company = await Company.findByIdAndUpdate(req.company._id, {
            $push: { questions: question } 
        }, {
            new: true
        })
        .populate('questions.submitted_by')
        .exec();

        res.status(200).json({ 
            id: company._id,
            questions: company.questions 
        })
    } catch(error) {
        res.status(400).json({
            error: 'Server error'
        });
    };
};

exports.totalStudentsPlaced = async (req, res) => {
    try {
        const total_count = await Company.aggregate([
            {
                $group: {
                    total_count: {
                        $sum: "count"
                    }
                }
            }
        ])
        
        if(!total_placed) {
            throw new Error();
        }

        res.status(201).json(total_count);
    } catch(error) {
        res.status(400).json({
            error: 'Companies not found'
        });
    };
};