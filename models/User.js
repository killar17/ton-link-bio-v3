import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  // The verified TON Address is the primary identity
  tonAddress: {
    type: String,
    required: [true, 'TON Address is required.'],
    unique: true,
  },
  // Display name for the user's profile
  name: {
    type: String,
    default: "Anonymous",
    maxLength: [100, 'Name cannot be more than 100 characters.'],
  },
  // The cryptographic TON Proof data payload
  proofs: {
    type: Object, 
    required: true,
  },
  // Placeholder for R3 feature
  tonDomain: {
    type: String,
    default: null,
  },
  // The main Link-in-Bio content
  bio: {
    type: String,
    default: "Hello! I am a verified TON D ID user.",
    maxLength: [200, 'Bio cannot be more than 200 characters.'],
  },
  // Array to store the user's links
  links: [
    {
      title: { type: String, required: true },
      url: { type: String, required: true },
      icon: String,
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);