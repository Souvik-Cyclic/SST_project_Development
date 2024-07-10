const express = require("express");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.json(error);
    }
});

router.post("/register", async (req, res) => {
  try {
    const userExists = await User.findOne({email:req.body.email})
    if(userExists){
        return res.json({success: false, message: "User Already Exists"});
    }

    const salt =  await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    const newUser = new User(req.body);
    await newUser.save();
    return res.status(201).json("User Created Successfully");
  } catch (error) {
    return res.json(error);
  }
});

router.post("/login", async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
  
      if (!user) {
        return res.send({
          success: false,
          message: "User doesn't exist, please register"
        });
      }
  
      const validPassword = await bcrypt.compare(req.body.password, user.password);
  
      if (!validPassword) {
        return res.send({
          success: false,
          message: "Invalid Password"
        });
      }
  
      res.send({
        success: true,
        message: "User successfully logged in."
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });
  

module.exports = router;
