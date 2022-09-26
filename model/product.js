const mongoose = require('mongoose')
const productSchema = new mongoose.Schema({
    namabarang: {
        type: String,
        required: true,
        unique:true
    },
    hargabeli: {
        type: Number,
        required: true
    },
    hargajual: {
        type: Number,
        required: true
    },
    stok: {
        type: Number,
        required: true
    },
    image: {
        type: String
    }
})


const myDB = mongoose.connection.useDb('nutech')

const productInfo = myDB.model('product', productSchema);

module.exports = productInfo;