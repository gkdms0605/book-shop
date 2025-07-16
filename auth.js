const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const ensureAuthorization = (req, res) => {
  try {
    const token = req.cookies.token;

    // 로그인 안 된 경우: null 반환
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    return decoded;
  } catch (err) {
    // 로그인 했지만 만료된 경우: err 그대로 반환
    return err;
  }
};

module.exports = ensureAuthorization;