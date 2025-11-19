
const mongoose = require('mongoose');



const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/po_db');
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB Connection Failed:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;