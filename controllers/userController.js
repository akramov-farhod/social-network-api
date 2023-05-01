const { User, Thought } = require("../models");

const userController = {
  // GET ALL USERS
  async getUsers(req, res) {
    try {
      const dbUserData = await User.find().select("-__v");

      res.json(dbUserData);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
  // GET USER BY ID
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
  // CREATE USER
  async createUser(req, res) {
    try {
      const dbUserData = await User.create(req.body);
      res.json(dbUserData);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
  // UPDATE USER
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
  // DELETE USER
  async deleteUser(req, res) {
    try {
      const dbUserData = await User.findOneAndDelete({
        _id: req.params.userId,
      });

      if (!dbUserData) {
        return res.status(404).json({ message: "No users match this ID" });
      }

      await Thought.deleteMany({ _id: { $in: dbUserData.thoughts } });
      res.json({
        message: "User and All Their Thoughts Successfully Deleted!",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },

  // ADD FRIEND TO FRIENDS ARRAY
  async addFriend(req, res) {
    console.log("req.params !!!!!!!!!!");
    console.log(req.params);
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
  // REMOVE FRIEND FROM RESPECTIVE FRIENDS ARRAY
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
