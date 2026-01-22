const Product = require('../model/product');
const mongoose = require('mongoose');

exports.pageview = async (req, res) => {
    try {
        const data = await Product.find();
        res.status(200).json({
            status: 'success',
            message: 'Data retrieved successfully',
            data
        });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error.message });
    }
};


exports.create = async (req, res) => {
    try {
        const data = req.body;

        if (data.price) data.price = Number(data.price);
        if (req.file) data.profile = req.file.filename;

        const product = await Product.create(data);
        res.status(201).json({ status: 'success', message: 'Product created', data: product });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};


exports.update = async (req, res) => {
    try {
        const editId = req.params.id;

        
        if (!mongoose.Types.ObjectId.isValid(editId)) {
            return res.status(400).json({ 
                status: 'fail', 
                message: 'Invalid product ID' 
            });
        }

      
        if (req.file) {
            req.body.profile = req.file.filename;
        }

        
        if (req.body.price) {
            req.body.price = Number(req.body.price);
        }

        
        if (!Object.keys(req.body).length) {
            return res.status(400).json({ 
                status: 'fail', 
                message: 'No data provided for update' 
            });
        }

        
        const editProduct = await Product.findByIdAndUpdate(
            editId, 
            req.body, 
            { new: true, runValidators: true }
        );

        
        if (!editProduct) {
            return res.status(404).json({ 
                status: 'fail', 
                message: 'Product not found' 
            });
        }
        res.status(200).json({
            status: 'success',
            message: 'Product updated successfully',
            data: editProduct
        });

    } catch (error) {
        
        res.status(500).json({
            status: 'fail',
            message: error.message
        });
    }
};


