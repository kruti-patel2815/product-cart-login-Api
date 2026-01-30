require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');

const viewRoutes = require('./routes/viewRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const productRoutes = require('./routes/product');

const Product = require('./model/product');

const app = express();


mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err.message));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

app.use(
  fileUpload({
    createParentPath: true,
    limits: { fileSize: 5 * 1024 * 1024 }
  })
);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



app.use('/', viewRoutes);



app.use('/api/user', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/product', productRoutes);


app.get('/admin/products', async (req, res) => {
  const data = await Product.find().sort({ _id: -1 });
  res.render('admin', { data, editrecord: null });
});

app.get('/edit/:id', async (req, res) => {
  const editrecord = await Product.findById(req.params.id);
  const data = await Product.find().sort({ _id: -1 });
  res.render('admin', { data, editrecord });
});

app.post('/create', async (req, res) => {
  let profile = '';

  if (req.files?.profile) {
    profile = Date.now() + '-' + req.files.profile.name;
    await req.files.profile.mv(path.join(__dirname, 'uploads', profile));
  }

  await Product.create({
    name: req.body.name,
    price: Number(req.body.price),
    profile
  });

  res.redirect('/admin/products');
});

app.post('/update/:id', async (req, res) => {
  const updateData = {
    name: req.body.name,
    price: Number(req.body.price)
  };

  if (req.files?.profile) {
    const profile = Date.now() + '-' + req.files.profile.name;
    await req.files.profile.mv(path.join(__dirname, 'uploads', profile));
    updateData.profile = profile;
  }

  await Product.findByIdAndUpdate(req.params.id, updateData);
  res.redirect('/admin/products');
});



app.get('/api/status', (req, res) => {
  res.json({
    status: 'API running',
    database: mongoose.connection.name,
    time: new Date().toISOString()
  });
});



app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  if (req.originalUrl.startsWith('/api')) {
    return res.json({ success: false, message: err.message });
  }

  res.render('error');
});

module.exports = app;

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

