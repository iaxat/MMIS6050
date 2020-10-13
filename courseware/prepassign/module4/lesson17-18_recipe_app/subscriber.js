const mongoose = require("mongoose");

const subscriberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  zipCode: {
    type: Number,
    min: [10000, "Zip code too short"],
    max: 99999
  }
});

module.exports = mongoose.model("Subscriber", subscriberSchema);

subscriberSchema.methods.getInfo = function() {
    return `Name: ${this.name} Email: ${this.email} Zip Code:
    ${this.zipCode}`;
  };
  
  subscriberSchema.methods.findLocalSubscribers = function() {
    return this.model("Subscriber")
      .find({zipCode: this.zipCode})
      .exec();
  };
  subscribers: [{type: mongoose .Schema.Types.ObjectId, ref: "Subscriber"}]
  subscriberSchema: courses: [{type: mongoose.Schema.Types.ObjectId, ref: "Course"}]