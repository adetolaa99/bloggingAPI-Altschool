const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BlogSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: [true, "Title must be unique"],
  },
  description: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  state: {
    type: String,
    enum: ["draft", "published"],
    default: "draft",
  },
  read_count: {
    type: Number,
    default: 0,
  },
  reading_time: Number,
  tags: [String],
  body: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Blog", BlogSchema);
