const mongoose = require("mongoose")

async function connect() {
    try {
        await mongoose.connect('mongodb+srv://duyminh1052002:duy12344321@cluster0.7jm2j.mongodb.net/Review_company?retryWrites=true&w=majority');
        console.log("kết nối database thành công!!!");
    } catch (error) {
        console.log("kết nối database thất bại!!!");
    }
}

module.exports = { connect }