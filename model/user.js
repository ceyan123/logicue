const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true
    }
    // avatar: {
    //     type: String,
    // },
    // cloudinary_id: {
    //     type: String,
    // }
})


const myDB = mongoose.connection.useDb('logique')

const userInfo = myDB.model('user', userSchema);

module.exports = userInfo;