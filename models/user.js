const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: [true, "E-mail must be unique"],
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
     this.password = await bcrypt.hash(this.password, 10);
  }
  next();
 });
 
 UserSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
 }; 

module.exports = mongoose.model("User", UserSchema);