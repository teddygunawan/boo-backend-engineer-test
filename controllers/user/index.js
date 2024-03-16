const User = require('@/models/User');

module.exports = {
  async get(_req, res) {
    try {
      const userList = await User.find().lean();
      return res.json(userList);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  async create(req, res) {
    try {
      const newUser = new User(req.body);
      const savedUser = await newUser.save();

      return res.status(201).json(savedUser);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  async findById(req, res) {
    try {
      const user = await User.findById(req.params.userId).lean();

      if (!user) {
        return res.status(404).json({ message: "User doesn't exist" });
      }

      return res.render('profile_template', {
        profile: user,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};
