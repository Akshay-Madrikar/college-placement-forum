const Department = require('../models/department');

exports.departmentById = async (req ,res, next, id) => {
    try {
        const department = await Department.findById(id).exec();
        if(!department) {
            throw new Error();
        }

        req.department = department;
        next();
    } catch(error) {
        res.status(400).json({
            error: 'No such department'
        });
    };
};

exports.create = async (req, res) => {
    try {
        const department = new Department(req.body);
        await department.save();
        res.status(201).json({
            department
        })
    } catch(error) {
        res.status(400).json({
            error
        });
    };
};

exports.read = (req, res) => {
    res.status(200).json(req.department);
};

exports.update = async (req, res) => {
    try {
        const department = req.department;
        department.name = req.body.name;
        await department.save();
        res.status(201).json(department);
    } catch(error) {
        res.status(400).json({
            error
        });
    };
};

exports.remove = async (req, res) => {
    try {
        const department = req.department;
        const {_id, name} = department;
        await department.remove();
        res.status(201).json({
            department: {_id, name},
            message: 'Department deleted successfully!'
        });
    } catch(error) {
        res.status(400).json({
            error
        });
    };
};

exports.list = async (req, res) => {
    try {
        const departments = await Department.find({});
        if(!departments) {
            throw new Error();
        }

        res.status(201).json(departments);
    } catch(error) {
        res.status(400).json({
            error: 'Departments not found'
        });
    };
};