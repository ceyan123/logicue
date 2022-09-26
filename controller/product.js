const express = require("express")
const ProductModel = require('../model/product');
const UserModel = require('../model/user');
const cloudinary = require("../utils/cloudinary");
// const upload = require("../utils/multer");
// const bcrypt = require('bcryptjs');
// const salt = 10;
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");
// const assert = require('assert')
const app = express();
app.use(cookieParser());
require('dotenv').config();
const JWT_SECRET=process.env.JWT;
var fs = require("fs");


const add_product = async ( req,res) => {


    const maybeFile = req.file 
    const maybePath = maybeFile ? maybeFile.path : undefined
    // const maybeImgPath = maybePath ? maybePath.substring(path.indexOf('/'), path.length) : undefined

    var stats = fs.statSync(maybePath)
    var fileSizeInBytes = stats.size;
    var fileSizeInMegabytes = fileSizeInBytes / (1024*1024);

    let message="";

    const {namabarang,hargabeli,hargajual,stok}=req.body;
    if ( maybePath && fileSizeInMegabytes < 1 ) {
        const result = await cloudinary.uploader.upload(maybePath, {folder: 'product'});
        try {
        
            let product = new ProductModel({
                namabarang: namabarang,
                hargabeli: hargabeli,
                hargajual: hargajual,
                stok: stok,
                image: result.secure_url
            })
        
            await product.save();
            console.log("message : Everythink OK")
            message = "Everythink OK"
              
        } catch (err) {
            if(err.code === 11000){
                console.log("errornya : Nama barang tidak tersedia");
                message = "Nama barang tidak tersedia"
                //halamn error
            } else {
                console.log("errornya : Maaf, terjadi gangguan, silahkan coba lagi");
                message = "Maaf, terjadi gangguan, silahkan coba lagi"
                //halamn error
            }
            
        }
    } else {
        console.log("errornya : file image idak terbaca");
        message = "file image error / size terlalu besar ( > 1Mb) "
        //halamn error
    } 
        
    ProductModel.find((err, products) => {
        if (!err) {
            res.render("home", {
                data: products,
                message: message
            });
        } else {
            res.render('404')
        }
    }); 
}

const edit_product = async (req, res) => {
    const {token} = req.cookies;
    if(await verifyToken(token)){
        let edit = await ProductModel.findOne({ _id: req.params.id });
        if (edit) {
            res.render('edit', { data: edit });
        } else {
            ProductModel.find((err, products) => {
                if (!err) {
                    res.render("home", {
                        data: products,
                        message: "kesalahan dalam mengedit, coba ulangi lagi"
                    });
                } else {
                    res.render('404')
                }
            }); 
        }
    }else{
        res.redirect('/signin')
    }
}

const update_product = async (req, res) => {

    const id = req.params.id
    const product = await ProductModel.findOne({_id: id}).exec();
    product.namabarang = req.body.namabarang;
    product.hargabeli = req.body.hargabeli;
    product.hargajual = req.body.hargajual;
    product.stok = req.body.stok;

    const saving =  await product.save();

    if (saving) {
        console.log("saving :", saving)
        console.log("namabarang :", req.body.namabarang)
        ProductModel.find((err, products) => {
            if (!err) {
                res.render("home", {
                    data: products,
                    message: `anda telah update ${product.namabarang}`
                });
            } else {
                res.render('404')
            }
        }); 
    } else {
        res.render('signin')
    }
}

const delete_product = async (req, res) => {
    let message="";
    const {id} = req.params;
    const foundProduct = await ProductModel.findOne({_id: id});

    if(foundProduct) {
        await foundProduct.deleteOne({_id: id});
        message = "Data telah terhapus"
    } else {
        message = "User not found"
    }

    ProductModel.find((err, products) => {
        if (!err) {
            res.render("home", {
                data: products,
                message: message
            });
        } else {
            res.render('404')
        }
    }); 

}


// verify token
const verifyToken = async (token) => {
    try {
        const verify = jwt.verify(token, JWT_SECRET);
        const emailnya = verify.email
        const user = await UserModel.findOne({emailnya}).lean()

        if (user) { 
            return true; 
        } else { 
            return false;
        }
       
    } catch (err) {
        return false;
    }
}  

module.exports = { add_product, edit_product, update_product, delete_product};