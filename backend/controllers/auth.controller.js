import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

// controller for signup api
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    // hashing the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(200).json("User created Successfully.");
  } catch (error) {
    next(error);
  }
};

// controller for signin api
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const userExist = await User.findOne({ email });

    // if the user email didn't find in the database
    if (!userExist) {
      return next(
        errorHandler(404, "Please input valid email or password!")
      );
    }

    // now checking password is correct or not
    const validPassword = bcrypt.compareSync(password, userExist.password);
    // if the password is incorrect then we will response an error
    if (!validPassword) {
      return next(
        errorHandler(401, "Please input valid email or password!")
      );
    }

    const token = jwt.sign({ id: userExist._id }, process.env.JWT_SECRET_KEY);
    const { password: pass, ...rest } = userExist._doc;

    res
      .status(200)
      .cookie("access_token", token, { httpOnly: true })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const { email, name, photoURL } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
      const { password: pass, ...rest } = user._doc;
      res
        .status(200)
        .cookie("access_token", token, { httpOnly: true })
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: email,
        password: hashedPassword,
        avatar: photoURL,
      });

      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY);
      const { password: pass, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie("access_token", token, { httpOnly: true })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

// creating an api for signout the user from their account
export const signout = async (req, res, next) => {
  try {
    res.clearCookie('access_token')
    res.status(200).json('User has been logged out!')
  } catch (error) {
    next(error)
  }
}
