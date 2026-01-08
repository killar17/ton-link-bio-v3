// api/update-profile.js
const dbConnect = require('../dbConnect');
const User = require('../models/User');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  await dbConnect();
  const { address, name, bio } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { tonAddress: address },
      { name, bio },
      { new: true }
    );

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
