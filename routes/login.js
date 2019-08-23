const express = require("express");
const router = express.Router();
const User = require("../models/User")
const createError = require('http-errors');

const bcrypt = require("bcryptjs");

router.post("/login", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username === "" || password === "") {
      next(createError(500))
    }
  
    User.findOne({ "username": username })
    .populate("favoriteRecipes")
    .then(user => {
      debugger
        if (!user) {
          debugger
          next(createError(500))
        }
        if (bcrypt.compareSync(password, user.password)) {
          // Save the login in the session!
          req.session.currentUser = user
          res.send(user);
        } else {
          next(createError(500))
        }
    })
    .catch(error => {
      next(createError(500))
    })
  });

  module.exports = router;
