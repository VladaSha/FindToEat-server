const express = require("express");
const router = express.Router();
const createError = require('http-errors');

const User = require("../models/User");

const bcrypt = require("bcryptjs");
const bcryptSalt = 10;

// router.get("auth/signup", (req, res, next) => {
//   res.json("auth/signup");
// });

router.post("/signup", (req, res, next) => {
    debugger
  const username = req.body.username;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const password = req.body.password;
//   const salt = bcrypt.genSaltSync(bcryptSalt);
//   const hashPass = bcrypt.hashSync(password, salt);

  if (username === "") {
    next(createError(500))
  } else if (firstname === "") {
    next(createError(500))
  } else if (lastname === "") {
    next(createError(500))
  } else if (email === "") {
    next(createError(500))
  } else if (password === "") {
    next(createError(500))
  }

  User.findOne({ "username": username })
  .populate("favoriteRecipes")
  .then(user => {
    if (user !== null) {
      next(createError(500))
      }

    const salt     = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    User.create({
      username,
      firstname,
      lastname,
      email,
      password: hashPass
    })
    .then((user) => {
      res.json(user);
    })
    .catch(error => {
      next(createError(500))
    })
})
.catch(error => {
  next(createError(500))
})

});

module.exports = router;