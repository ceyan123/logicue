const mongoose = require('mongoose')

const connectDB = async() => {
    try {
        const connection = await mongoose.connect (process.env.DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log(`Mongo DB Connected : ${connection.connection.host}`)
    } catch (err) {
        console.log(`Error : ${err.message}`)
        process.exit(1)
    }
}

module.exports = connectDB;