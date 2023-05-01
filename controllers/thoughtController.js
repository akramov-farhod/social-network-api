const { Thought, User } = require("../models");

const thoughtController = {
  // GET ALL THOUGHTS
  async getThoughts(req, res) {
    try {
      const dbThoughtData = await Thought.find().sort({ createdAt: -1 });

      res.json(dbThoughtData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // GET THOUGHT BY ID
  async getSingleThought(req, res) {
    try {
      const dbThoughtData = await Thought.findOne({
        _id: `${req.params.thoughtId}`,
      });

      if (!dbThoughtData) {
        return res.status(404).json({ message: "No users match this ID" });
      }

      res.json(dbThoughtData);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
  // CREATE THOUGHT
  async createThought(req, res) {
    try {
      const dbThoughtData = await Thought.create(req.body);

      const dbUserData = await User.findOneAndUpdate(
        { username: req.body.username },
        { $push: { thoughts: dbThoughtData._id } },
        { new: true }
      );

      if (!dbUserData) {
        return res
          .status(404)
          .json({ message: "Thought created but No User matched this ID" });
      }

      res.json({ message: "Thought successfully created!" });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
  // UPDATE THOUGHT
  async updateThought(req, res) {
    try {
      const dbThoughtData = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!dbThoughtData) {
        return res.status(404).json({ message: "No users match this ID" });
      }

      res.json(dbThoughtData);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
  // DELETE THOUGHT
  async deleteThought(req, res) {
    try {
      const dbThoughtData = await Thought.findOneAndRemove({
        _id: req.params.thoughtId,
      });

      if (!dbThoughtData) {
        return res.status(404).json({ message: "No users match this ID" });
      }

      // REMOVE THOUGHT FROM RESPECTIVE THOUGHTS ARRAY
      const dbUserData = User.findOneAndUpdate(
        { thoughts: req.params.thoughtId },
        { $pull: { thoughts: req.params.thoughtId } },
        { new: true }
      );

      if (!dbUserData) {
        return res
          .status(404)
          .json({ message: "Can't Delete Thought, No User matched this ID" });
      }

      res.json({ message: "Thought successfully deleted!" });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },

  // ADD REACTION TO SPECIFIC THOUGHT
  async addReaction(req, res) {
    try {
      const dbThoughtData = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );

      if (!dbThoughtData) {
        return res.status(404).json({ message: "No thought matches this ID" });
      }

      res.json(dbThoughtData);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
  // REMOVE REACTION FROM RESPECTIVE THOUGHT
  async removeReaction(req, res) {
    try {
      const dbThoughtData = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      );

      if (!dbThoughtData) {
        return res.status(404).json({ message: "No users match this ID" });
      }

      res.json(dbThoughtData);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
};

module.exports = thoughtController;
