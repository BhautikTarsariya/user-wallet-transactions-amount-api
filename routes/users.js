var express = require('express');
var router = express.Router();
const UserController = require('../controllers/UserController')
const WalletController = require('../controllers/WalletController')
const USER = require('../models/UserModel')
var jwt = require('jsonwebtoken');

const secure = async function (req, res, next) {
  try {
    let token = req.headers.authorization
    // console.log('here',token);
    if (!token) {
      throw new Error("Request Fail")
    }

    var decord = jwt.verify(token, "ABC");

    let checkUser = await USER.findById(decord.id)

    if (!checkUser) {
      throw new Error("Data Not Found")
    }

    req.body.id = decord.id

    next()

  } catch (err) {
    return res.status(404).json({
      status: "Fail",
      message: err.message
    })
  }
}

/* GET users listing. */
router.post('/user/signup', UserController.signup);
router.post('/user/signin', UserController.signin);

/* Wallet */

router.post('/user/wallet/addbalance', secure, WalletController.addBalance)
router.post('/user/wallet/transfermoney', secure, WalletController.debitBalance)

router.get('/user/wallet/alltransactions', secure, WalletController.walletTransactions)


module.exports = router;
