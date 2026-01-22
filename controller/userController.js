const User = require('../model/User');


exports.signup = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        
        res.json({
            success: true,                    
            message: 'Signup successful',     
            userId: user._id
        });
        
    } catch (err) {
        
        res.status(500).json({ 
            error: err.message 
        });
    }
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email: email.trim() });
        
        if (!user) {
           
            const allUsers = await User.find({}, 'email');
            
            return res.json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        
    
        if (user.password !== password) {
           
            return res.json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        
        res.json({
            success: true,
            message: 'Login successful',
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