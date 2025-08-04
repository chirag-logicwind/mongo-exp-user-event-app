const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.headers['authorization'].split(' ')[1];
    // console.log(token);
    if(!token)
        return res.status(401).json({ message: 'Access Denied due to auth token is not found.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token.' });
    }
}

module.exports = authenticate;