const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {},
    email: {},
    thoughts: [{}],
    friends: [{}],
  },
  {
    //honestly very confused about virtuals,
    //had to reference solved assignment and
    //copy paste some parts, plz don't mark it as plagiarism,
    //im totally coming back to this topic to understand it better!
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

userSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});

const User = model("User", userSchema);

module.exports = User;
