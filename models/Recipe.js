const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const recipeSchema = new Schema({
  apiId: String,
  name: String,
  image: String,
  yield: String,
  ingredients: Array,
  calories: Number,
  totalWeight: Number,
  totalNutrients: Object,
  totalTime: Number,
})

const Recipe = mongoose.model("recipes", recipeSchema);

module.exports = Recipe;