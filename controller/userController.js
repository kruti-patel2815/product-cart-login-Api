const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/* ===================== SIGNUP ===================== */
exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // check user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({
                success: false,
                message: 'User already exists'
            });
        }

        // 🔐 hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        // ✅ TOKEN CREATION FOR SIGNUP
        const token = jwt.sign(
            {
                userId: user._id,  // IMPORTANT: Use userId
                email: user.email
            },
            process.env.JWT_SECRET || 'fallback_secret_key',
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'Signup successful',
            token: token,  // ✅ Send token
            userId: user._id,
            username: user.username
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

/* ===================== LOGIN ===================== */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email.trim() });

        if (!user) {
            return res.json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // 🔐 compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // ✅ TOKEN CREATION FOR LOGIN
        const token = jwt.sign(
            {
                id: user._id.toString(),  // ✅ id field add કરો
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        res.json({
            success: true,
            message: 'Login successful',
            token: token,          // ✅ IMPORTANT
            userId: user._id,
            username: user.username
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};