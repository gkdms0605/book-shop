const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser')
dotenv.config();

const ensureAuthorization = (req, res) => {
    try {
        let token = req.cookies.token;

        if(token) {
            let decodedjwt = jwt.verify(token, process.env.PRIVATE_KEY);
            return decodedjwt;
        }

        else {
            throw new ReferenceError('jwt must be provided');
        }
    }
    catch (err) {
        console.log(err.name);
        console.log(err.message);

        return err;
    }
}

module.exports = ensureAuthorization;