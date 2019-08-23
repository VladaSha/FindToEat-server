const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new Schema({
  username: String,
  firstname: String,
  lastname: String,
  password: String,
  email: String,
  favoriteRecipes: [{ type : ObjectId, ref: 'recipes' }]
}, {
  timestamps: true
});

const User = mongoose.model("users", userSchema);

module.exports = User;