const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String },
    visits: { type: Number, required: true },
    totalAmountSpent: { type: Number },
    messageStatus: {
        type: String, enum: ["pending", "sent"],
        default: "pending"
    },
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);