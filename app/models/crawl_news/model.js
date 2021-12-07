const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const newsTitleSchema = new Schema({
  model: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  title:{
    type: String,
    required: true 
  },
  sentiment:{
    type: String,
    default: null
  }
  ,
  createdOn: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("newsTitle", newsTitleSchema);
