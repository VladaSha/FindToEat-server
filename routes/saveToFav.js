const express = require("express");
const router = express.Router();
const createError = require('http-errors');
const User = require("../models/User")
const Recipe = require("../models/Recipe")

router.post("/favorite", (req,res,next) => {
    debugger
    let cleanNutrients = req.body.totalNutrients
    if(cleanNutrients["SUGAR.added"]) delete cleanNutrients["SUGAR.added"]
    let newRecipe = {
        apiId: req.body.apiId,
        name: req.body.name,
        image: req.body.image,
        yield: req.body.yield,
        ingredients: req.body.ingredients,
        calories: req.body.calories,
        totalWeight: req.body.totalWeight,
        totalNutrients: cleanNutrients
    }
    Recipe.create(newRecipe)
    .then((response) => {
        return User.findByIdAndUpdate(req.session.currentUser._id, { $push: {favoriteRecipes: response._id} }, { new: true })
        .populate("favoriteRecipes")
    })
    .then(user => {
        res.send({user: user})
    })
    .catch(() => {
        next(createError(500))
    })
    
})

module.exports = router;
