const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const ensureAuthorization = (req, res) => {
    try {
        let receivedjwt = req.headers['authorization'];
        console.log(receivedjwt);

        if(receivedjwt) {
            let decodedjwt = jwt.verify(receivedjwt, process.env.PRIVATE_KEY);
            console.log(decodedjwt);
    
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