const mongoose = require("mongoose");

const url = `mongodb+srv://ceyan:jLF3WfuUyiLufi5@cluster0.zomm4vc.mongodb.net/?retryWrites=true&w=majority`

const connectionParams = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}

const database = async () => {
    await mongoose.connect(
        url, connectionParams
    ).then( () => {
        console.log("Connected to Database")
    })
    .catch( (err) => {
        console.error(`Error connected to database. \n${err}`)
    })
    
};

module.exports = database;