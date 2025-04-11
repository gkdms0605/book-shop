const {StatusCodes} = require('http-status-codes');

const ok = (res) => {
    return res.status(StatusCodes.OK)
}