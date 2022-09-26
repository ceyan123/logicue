const mongoose = require('mongoose');

// const photosSchema = new mongoose.Schema({
//     photoss : { 
//         type : String
//     }
// })

// const creditcardSchema = new mongoose.Schema({
//     creditcardId:{
//         type : String
//     },
//     type: {
//         type: String,
//         required: true,
//         unique:true
//     },
//     number: {
//         type: String,
//         required: true
//     },
//     namecard: {
//         type: String,
//         required: true
//     },
//     expired: {
//         type: String,
//         required: true
//     }
// })

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique:true
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    photos: {
        images : { 
            type : String
        },
    },
    creditcards: {
        type: {
            type: String,
            required: true,
        },
        number: {
            type: String,
            required: true
        },
        namecard: {
            type: String,
            required: true
        },
        expired: {
            type: String,
            required: true
        }
    }
    // photos: [photosSchema],
    // creditcards: [creditcardSchema]
})


const myDB = mongoose.connection.useDb('logique');
const userInfo = myDB.model('pengguna', userSchema);
module.exports = userInfo;