const USER = require("../models/UserModel")
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.signup = async function (req, res, next) {
    try {
        if (!req.body.name || !req.body.dateOfBirth || !req.body.gender || !req.body.email || !req.body.mobile || !req.body.password) {
            throw new Error("Please Complete Details")
        }

        if (req.body.password != req.body.confirmpassword) {
            throw new Error("Password And Confirm-Password are different")
        }

        req.body.password = await bcrypt.hash(req.body.password, 10)

        let newUser = await USER.create(req.body)

        let token = jwt.sign({ id: newUser._id }, 'ABC')
        // console.log("Check");
        res.status(200).json({
            status: "Successfull",
            message: "Signup Successfull",
            data: newUser,
            token
        })
    } catch (err) {
        res.status(404).json({
            status: "Signup Fail",
            message: err.message
        })
    }
}

exports.signin = async function (req, res, next) {
    try {
        if (!req.body.email) {
            throw new Error("Please Enter Email")
        }

        let userData = await USER.findOne({ email: req.body.email })
        // console.log("Check", userData);
        var password = req.body.password

        if (!userData) {
            throw new Error("Please Enter Vald Email")
        }

        // console.log("Check");

        checkPassword = await bcrypt.compare(password, userData.password)

        // console.log("Check", checkPassword);

        if (!checkPassword) {
            throw new Error("Incrrect Password")
        }

        let token = jwt.sign({ id: userData._id }, 'ABC')

        res.status(200).json({
            status: "Successfull",
            message: "Signin Successfull",
            // data: newUser,
            token
        })
    } catch (err) {
        return res.status(404).json({
            status: "Signin Fail",
            message: err.message
        })
    }
}