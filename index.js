const express = require("express")
const dotenv = require("dotenv")
var cookieParser = require('cookie-parser');

dotenv.config()

const users = require('./routes/user')
const products = require('./routes/product')


const connectDB = require("./config/db")
connectDB();

const port = process.env.PORT || 3000;
const app = express();



app.set('view engine', 'ejs');

//middleware
app.use(express.json())
app.use(express.urlencoded({limit: '1mb', extended:true}))
app.use(cookieParser());
app.use(express.static('public'));


//routes
app.use(users);
app.use(products);


app.listen(port, () => {
    console.log(`Listening On Port ${port}`);
})