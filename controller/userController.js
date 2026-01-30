const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({
        success: false,
        message: 'User already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword
    });

    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    
    res.cookie('token', token, { httpOnly: true });
    
 
    res.redirect('/products');

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.trim() });

    if (!user) {
      return res.render('login', { error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('login', { error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    
    res.cookie('token', token, { httpOnly: true });
    
   
    res.redirect('/products');

  } catch (err) {
    res.render('login', { error: 'Server error' });
  }
};