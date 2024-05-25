const WALLET = require('../models/WalletModel')
const USER = require('../models/UserModel')
var jwt = require('jsonwebtoken');
const { default: mongoose } = require('mongoose');
// const bcrypt = require('bcrypt');

exports.addBalance = async function (req, res, next) {
    try {
        // console.log("Check");
        if (!req.body.credit_amount || req.body.credit_amount <= 0) {
            throw new Error('Add must be at least ₹1')
        }
        let token = req.headers.authorization;
        // console.log("token", token);
        var decord = jwt.verify(token, "ABC");

        // console.log('Check', decord.id);
        let checkUser = await USER.findById(decord.id)
        let totalBalance = checkUser.WalletBalance + (req.body.credit_amount - 0)
        checkUser.WalletBalance = totalBalance;
        checkUser.save()

        let wallet = await WALLET({})
        wallet.credit_amount = req.body.credit_amount;
        wallet.login_user = decord.id
        wallet.total_balance = totalBalance;
        wallet.save()
        // console.log('Check', checkUser)

        res.status(200).json({
            // status: "Balance Add Successfull",
            message: "Balance Add Successfull",
            data: wallet
        })
    } catch (err) {
        res.status(404).json({
            status: "Fail",
            message: err.message
        })
        // console.log("Error", err);
    }
}

exports.debitBalance = async function (req, res, next) {
    try {
        if (!req.body.debit_amount || req.body.debit_amount <= 0) {
            throw new Error('Payment must be at least ₹1')
        }

        if (!req.body.other_user) {
            throw new Error('Please complete field')
        }

        let otherUserData = await USER.findById(req.body.other_user)

        if (!otherUserData) {
            throw new Error('User not found')
        }

        let token = req.headers.authorization;

        var decord = jwt.verify(token, "ABC");

        let checkUser = await USER.findById(decord.id)

        if (checkUser.WalletBalance < req.body.debit_amount) {
            throw new Error("Not Enough Balance")
        }

        let totalBalance = checkUser.WalletBalance - (req.body.debit_amount - 0)
        checkUser.WalletBalance = totalBalance;
        checkUser.save()

        let wallet = await WALLET({})
        wallet.debit_amount = req.body.debit_amount;
        wallet.login_user = decord.id;
        wallet.other_user = req.body.other_user;
        wallet.total_balance = totalBalance;
        wallet.save()

        res.status(200).json({
            // status: "Balance Add Successfull",
            message: "Money Transfer Successfully",
            data: wallet
        })

    } catch (err) {
        res.status(404).json({
            status: "Fail",
            message: err.message
        })
    }
}

exports.walletTransactions = async function (req, res, next) {
    try {
        let token = req.headers.authorization;

        var decord = jwt.verify(token, "ABC");

        let userData = await WALLET.aggregate([
            {
                $match: {
                    $expr: {
                        $and: [
                            { $eq: ["$login_user", mongoose.Types.ObjectId(decord.id)] }
                        ]
                    }
                }
            },
            {
                $lookup:
                {
                    from: "users",
                    localField: "other_user",
                    foreignField: "_id",
                    as: "transferto"
                }
            },
            {
                $facet: {
                    data: [
                        {
                            $project: {
                                credit_amount: 1,
                                debit_amount: 1,
                                other_user: 1,
                                transferto: {
                                    name: 1,
                                    email: 1,
                                    mobile: 1
                                }
                            }
                        },
                    ]
                }
            }

        ])

        res.status(200).json({
            // status: "Balance Add Successfull",
            message: "All wallet Transactions",
            data: userData
        })

    } catch (err) {
        res.status(404).json({
            status: "Fail",
            message: err.message
        })
    }
}

