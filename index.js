const express = require("express")
const dotenv = require("dotenv")
const bodyParser = require('body-parser');

dotenv.config()

const users = require('./routes/users')

const connectDB = require("./config/db")
connectDB();

const port = process.env.PORT || 3000;
const app = express();

//middleware
app.use(express.json())
app.use(express.urlencoded({limit: '1mb', extended:true}))
// app.use(express.urlencoded({ extended: false }))
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));


//routes
app.use(users);

app.listen(port, () => {
    console.log(`Listening On Port ${port}`);
})