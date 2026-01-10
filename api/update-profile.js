import dbConnect from '../../dbConnect';
import User from '../../models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  
  try {
    await dbConnect(); // If this fails, you get a 500 error
    const { address, name, bio } = req.body;

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
