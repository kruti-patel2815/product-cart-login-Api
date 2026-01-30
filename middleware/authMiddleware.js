const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
       
        let token;
        
        if (req.cookies?.token) {
            token = req.cookies.token;
        } else if (req.headers.authorization) {
            token = req.headers.authorization.replace('Bearer ', '');
        }

        if (!token) {
           
            if (req.method === 'POST' && req.originalUrl.includes('/cart')) {
                return res.redirect('/login?error=Please login first');
            }
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'fallback_secret_key'
        );

        
        req.user = {
            userId: decoded.id,  
            id: decoded.id,      
            email: decoded.email
        };

        console.log('Authenticated user ID:', req.user.userId);
        next();

    } catch (err) {
        console.error('Auth error:', err);
        
        
        if (req.method === 'POST' && req.originalUrl.includes('/cart')) {
            return res.redirect('/login?error=Session expired, please login again');
        }
        
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

module.exports = authMiddleware;