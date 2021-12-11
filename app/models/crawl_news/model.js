const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const newsTitleSchema = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    default: mongoose.Types.ObjectId,
  },
  title: {
    type: String,
    required: true,
    index: true,
  },
  referenceLink: {
    type: String,
    required: true
  },
  sentiment: {
    type: String,
    default: null,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("newsTitle", newsTitleSchema);
