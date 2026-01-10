import dbConnect from '../../dbConnect.js';
import User from '../../models/User.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  
  try {
    await dbConnect(); // If this fails, you get a 500 error
    const { address, name, bio } = req.body;

    console.log('User model is:', User);
    console.log('User model type:', typeof User);
    console.log('User.findOneAndUpdate exists:', typeof User.findOneAndUpdate);

    const updatedUser = await User.findOneAndUpdate(
      { tonAddress: address },
      { name, bio },
      { new: true, upsert: true } // 'upsert' creates the user if they don't exist
    );

    return res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
