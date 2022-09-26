const express = require("express")
const UserModel = require('../model/user');
const ProductModel = require('../model/product');
// const cloudinary = require("../utils/cloudinary");
// const upload = require("../utils/multer");
const bcrypt = require('bcryptjs');
const salt = 10;
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");
const app = express();
app.use(cookieParser());


require('dotenv').config();
const JWT_SECRET=process.env.JWT;

const sign_up = async (req, res) => {
    try {

        const {email,password}=req.body;
        const passwordnya = await bcrypt.hash(password,salt);

        // create instance of user
        let user = new UserModel({
            email: email,
            password: passwordnya
        });

        // version API
        // await user.save();
        // res.json(user);

        //version Web App
        await user.save();
        return res.redirect('signin');

    } catch (err) {
        if(err.code === 11000){
            return res.send({status:'error',error:'email already exists'})
        }
        res.render("signin");
        // throw err
    }
}

const sign_in = async (req, res) => {

    const {email, password} = req.body;

    const user = await UserModel.findOne({email}).lean()

    if(!user){
        // res.send({
        //     status:"failed",
        //     "message": "Email ditemukan"
        // })
        res.render("signin");
    }

    if (await bcrypt.compare(password, user.password)){
        token = jwt.sign({id:user._id,email:user.email},JWT_SECRET,{ expiresIn: '2h'})

        // version API
        // res.send({
        //     status:"success",
        //     "email":email,
        //     "password": password,
        //     "token":token
        // })

        //version Web App
        res.cookie('token',token,{ maxAge: 2 * 60 * 60 * 1000, httpOnly: true });  // maxAge: 2 hours
        res.redirect('/');

    } else {
        // errors = "Password tidak cocok";
        // res.status(404).json({ errors });
        res.render("signin");
    }
}

const log_out = async(req, res) => {
    cookie = await req.cookies;
    for (var prop in cookie) {
        if (!cookie.hasOwnProperty(prop)) {
            continue;
        }    
        res.cookie(prop, '', {expires: new Date(0)});
    }
    res.redirect('/signin');
}

const home = async (req, res) => {
    const {token} = req.cookies;
    if(await verifyToken(token)){

        ProductModel.find((err, products) => {
            if (!err) {
                console.log("data products :", products) 
                res.render("home", {
                    data: products,
                    message: "Everythink OK"
                });
            } else {
                console.log('Failed to retrieve the Course List: ' + err);
                res.render('home')
            }
        }); 

    }else{
        res.redirect('/signin')
    }

}


const signin = async ( req, res ) => {
    res.render('signin');
}

// verify token
const verifyToken = async (token) => {
    try {
        const verify = jwt.verify(token, JWT_SECRET);
        console.log("verify :", verify)
        const emailnya = verify.email
        const user = await UserModel.findOne({emailnya}).lean()

        if (user) { return true; } else { return false;}

       
    } catch (err) {
        // console.log(JSON.stringify(err), "error");
        return false;
    }
}  

module.exports = {sign_up, sign_in, home, signin,  log_out};