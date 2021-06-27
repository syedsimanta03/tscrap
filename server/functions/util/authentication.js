const { admin } = require('./admin')

const authentication = async (req, res, next) => {
    let idToken;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')
    ) {
        idToken = req.headers.authorization.split('Bearer ')[1];
    } else {
        console.log(req.headers.authorization)
        console.log('No token found');
        return res.status(403).json({error: 'Unauthorized'});
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken)
    req.user = decodedToken;
    
    return next();
}

module.exports = { authentication };