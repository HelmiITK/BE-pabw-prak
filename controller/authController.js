const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Auth, User } = require("../models");

const ApiError = require("../utils/apiError");

const register = async (req, res, next) => {
  try {
    const { name, phoneNumber, country, city, email, password } = req.body;
    const passwordLength = password.length < 8;
    if (passwordLength) {
      return next(
        new ApiError("Panjang kata sandi minimal harus 8 karakter", 400)
      );
    }
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    const newUser = await User.create({
      name,
      phoneNumber,
      country,
      city,
    });
    await Auth.create({
      email,
      password: hashedPassword,
      userId: newUser.id,
    });

    res.status(201).json({
      status: "Registrasi berhasil",
      data: {
        email,
        newUser,
      },
    });
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await Auth.findOne({
      where: {
        email,
      },
      include: ["User"],
    });

    if (!user) {
      return next(new ApiError("Email tidak ditemukan", 404));
    }

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign(
        {
          id: user.userId,
          username: user.User.name,
          email: user.email,
        },
        process.env.JWT_SECRET
      );

      res.status(200).json({
        status: "Success",
        message: "Login berhasil",
        data: {
          token,
          id: user.userId,
          name: user.User.name,
          email: user.email,
        },
      });
    }
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};

const authMe = async (req, res, next) => {
  try {
    res.status(200).json({
      status: "Success",
      data: {
        id: req.user.id,
        name: req.user.name,
        phoneNumber: req.user.phoneNumber,
        country: req.user.country,
        city: req.user.city,
        email: req.user.Auth.email,
      },
    });
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};

module.exports = {
  register,
  login,
  authMe,
};
