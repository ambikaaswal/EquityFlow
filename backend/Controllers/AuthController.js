const { UsersModel } = require("../models/UsersModel");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcryptjs");

module.exports.Signup = async (req, res) => {
  // console.log(req.body);
  try {
    const { email, mobile, password, username, createdAt } = req.body;

    //creates new collection, if it doesn't exist.
    const existingUser = await UsersModel.findOne({ email });
    if (existingUser) {
      return res.json({
        message: "A User with this email already exists",
        success: false,
      });
    }

    const existingMobile = await UsersModel.findOne({ mobile });
    if (existingMobile) {
      return res.json({
        message: "A user with this mobile number already exists",
        success: false,
      });
    }

    const user = await UsersModel.create({
      email,
      password,
      username,
      mobile,
      createdAt,
    });
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: true,//earlier false
    });
    res
      .status(201)
      .json({ message: "User signed in successfully", success: true, user });
    // next();
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", success: false, error });
  }
};

module.exports.Login = async (req, res) => {
  try {
    const { email, mobile, password } = req.body;
    if (!email || !password || !mobile) {
      return res.json({ message: "All fields are required", success: false });
    }
    const user = await UsersModel.findOne({ email });
    if (!user) {
      return res.json({
        message: "Incorrect password or emaile",
        success: false,
      });
    }
    if(user.mobile != mobile)
    {
      return res.json({
        message:"Incorrect mobile number or passwordm",
        success:false,
      })
    }
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.json({
        message: "Incorrect password or emailp",
        success: false,
      });
    }
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,//earlier true
    });
    res
      .status(201)
      .json({
        message: "User logged in successfully",
        success: true,
        user:{
          id: user._id,
          username: user.username,
          email: user.email
        } });
    // next();//there is no next middleware
  } catch (error) {
    console.error(error);
  }
};
