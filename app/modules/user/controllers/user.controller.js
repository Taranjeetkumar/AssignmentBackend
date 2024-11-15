// const { msg } = require('../../../../config/message');
const asyncHandler = require('../../../middleware/async');
// const ErrorResponse = require('../../../helper/errorResponse');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Login User
// @route   POST/api/v1/user/login
//access    Public
exports.login = asyncHandler(async (req, res, next) => {
    const { token } = req.body;

    try {
        // Verify the Google token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        // User information from Google
        const { sub, email, name, picture } = payload;

        const userToken = jwt.sign(
            { sub, email, name, picture },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Send the token back to the client
        res.status(200).json({
            success: true,
            data: { name, email, picture },
            token: userToken
        });

    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ message: 'Invalid Google token' });
    }  
});

// @desc    Get current logged in user
// @route   GET/api/v1/user/me
//access    Private
exports.getMe = asyncHandler(async (req, res, next) => {
    let user = await User.findById(req.user._id);

    user = JSON.stringify(user);
    user = JSON.parse(user);

    delete user["password"];


    res.status(200).json({
        success: true,
        data: user
    });
});

