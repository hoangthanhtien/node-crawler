const constant = require('../constants')
exports.validateAccessToken = async (req, res, next) => {
  const access_token = req.header('access_token')
  if (access_token != constant.ACCESS_TOKEN) {
    res.status(401).send("Invalid Access Token")
  }
  else {
    next()
  }
}
