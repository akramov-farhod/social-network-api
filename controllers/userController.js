const { User, Thought } = require("../models");

const userController = {
  // get all users
  async getUsers(req, res) {
    try {
      const dbUserData = await User.find().select("-__v");

      res.json(dbUserData);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
  // get single user by id
  async getSingleUser(req, res) {
    try {
      const dbUserData = await User.findOne({ _id: req.params.userId })
        .select("-__v")
        .populate("friends")
        .populate("thoughts");

      if (!dbUserData) {
        return res.status(404).json({ message: "No users match this ID" });
      }

      res.json(dbUserData);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
  // create a new user
  async createUser(req, res) {
    try {
      const dbUserData = await User.create(req.body);
      res.json(dbUserData);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
  // update a user
  async updateUser(req, res) {
    try {
      const dbUserData = await User.findOneAndUpdate(
        { _id: req.params.userId },
        {
          $set: req.body,
        },
        {
          runValidators: true,
          new: true,
        }
      );

      if (!dbUserData) {
        return res.status(404).json({ message: "No users match this ID" });
      }

      res.json(dbUserData);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
  // delete user (BONUS: and delete associated thoughts)
  async deleteUser(req, res) {
    try {
      const dbUserData = await User.findOneAndDelete({
        _id: req.params.userId,
      });

      if (!dbUserData) {
        return res.status(404).json({ message: "No users match this ID" });
      }

      // BONUS: get ids of user's `thoughts` and delete them all
      await Thought.deleteMany({ _id: { $in: dbUserData.thoughts } });
      res.json({
        message: "User and All Their Thoughts Successfully Deleted!",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },

  // add friend to friend list
  async addFriend(req, res) {
    try {
      const dbUserData = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { new: true }
      );

      if (!dbUserData) {
        return res.status(404).json({ message: "No users match this ID" });
      }

      res.json(dbUserData);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
  // remove friend from friend list
  async removeFriend(req, res) {
    try {
      const dbUserData = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { new: true }
      );

      if (!dbUserData) {
        return res.status(404).json({ message: "No users match this ID" });
      }

      res.json(dbUserData);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
};

module.exports = userController;
