const UserModel = require("../model/user");
const cloudinary = require("../utils/cloudinary");
const argon2 = require("argon2");
var fs = require("fs");

const add_user = async (req, res) => {
  const maybeFile = req.file;
  const maybePath = maybeFile ? maybeFile.path : undefined;

  var stats = fs.statSync(maybePath);
  var fileSizeInBytes = stats.size;
  var fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);

  if (maybePath && fileSizeInMegabytes < 1) {
    const result = await cloudinary.uploader.upload(maybePath, {
      folder: "user",
    });
    const { name, email, address, type, number, namecard, expired, password } =
      req.body;
    const hashPassword = await argon2.hash(password);
    try {
      // let simpan;
      let simpan = await UserModel.create({
        name: name,
        email: email,
        address: address,
        password: hashPassword,
        photos: {
          images: result.secure_url,
        },
        creditcards: {
          type: type,
          number: number,
          namecard: namecard,
          expired: expired,
        },
      });
      // console.log(simpan);
      res.status(200).json({ user_id: simpan._id });
    } catch (err) {
      if (err.code === 11000) {
        res.status(400).json({ msg: "nama tidak boleh double" });
      } else {
        res.status(400).json({ msg: err.message });
      }
    }
  } else {
    res.status(400).json({ msg: "file image terlalu besar(<1Mb)" });
  }
};

const user_list = async (req, res) => {
  try {
    const response = await UserModel.find({});
    res.status(200).json({
      count: response.length,
      rows: [response],
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const user_update = async (req, res) => {
  const id = req.params.id;
  // const user = await UserModel.findOne({_id: id}).exec();
//   user.name = req.body.name;
//   user.email = req.body.email;
//   user.address = req.body.address;

  const name = req.body.name;
  const email = req.body.email;
  const address = req.body.address;

  // try {
  //     await UserModel.save();
  //     res.status(200).json({
  //         success: true
  //     });
  //   } catch (error) {
  //     res.status(500).json({ msg: error.message });
  //   }

  try {
    await UserModel.update(
      {
        name: name,
        email: email,
        address: address,
        // role: role,
      },
      {
        // where: {
        id: id,
        // },
      }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const user_detail = async (req, res) => {
  try {
    const id = req.params.id;
    const response = await UserModel.findOne({
      _id: id,
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = { add_user, user_list, user_update, user_detail };
