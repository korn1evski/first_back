const path = require("path");
const bcrypt = require("bcrypt");
const User = require('../model/User');

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  const duplicate = await User.findOne({username: user}).exec()
  //409 stands for conflict
  if (duplicate)
    return res
      .status(409)
      .json({ message: `user with name ${user} already exists` });
  try {
    //ecnrypt the password
    const hashPassword = await bcrypt.hash(pwd, 10);
    
    //create and store a new user
    const result = await User.create({
      "username" : user,
      "password" : hashPassword
    });
    console.log(result)

    res
      .status(201)
      .json({ success: `new user ${result.username} was created` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  handleNewUser,
};
