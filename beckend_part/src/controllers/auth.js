require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../modal/authModel");

const newToken = (user) => {
  return jwt.sign( {user} , process.env.JWT_SECRET_KEY);
};

const register = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email }).lean().exec();

    if (user)
      return res.status(400).send({ message: "Please try another email or password" });

    user = await User.create(req.body);
    
    
    const token = newToken(user);
  
    res.send({ user, token });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const login = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user)
      return res
        .status(400)
        .send({ message: "Please try another email or password" });

    const match = user.checkPassword(req.body.password);
      console.log(match)
    if (!match)
      return res
        .status(400)
        .send({ message: "Please try another email or password" });

    const token = newToken(user);

    res.send({ user, token });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = { register, login };
