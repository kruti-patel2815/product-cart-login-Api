const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const productController = require('../controller/productController');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage });


router.get('/', productController.pageview);
router.post('/create', upload.single('profile'), productController.create);
router.patch('/update/:id', upload.single('profile'), productController.update);

module.exports = router;
