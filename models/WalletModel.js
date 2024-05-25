const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WalletSchema = new Schema({
    credit_amount: {
        type: Number
        // required: true
    },
    debit_amount: {
        type: Number
        // required: true
    },
    login_user: {
        type: mongoose.Types.ObjectId,
        ref: 'users'
    },
    other_user: {
        type: mongoose.Types.ObjectId,
        ref: 'users'
    },
    total_balance: {
        type: Number
    }
},
    { timestamps: true }
);

const WALLET = mongoose.model('wallets', WalletSchema);

module.exports = WALLET;
