import { TonProofVerifier } from '@ton/ton-connect';
import dbConnect from '../../dbConnect.js';
import User from '../../models/User.js';

const HOST_URL = 'https://ton-link-bio-v3-tblm-git-main-killar17s-projects.vercel.app';
const verifier = new TonProofVerifier({ host: HOST_URL });

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    try {
        // 1. Establish Database Connection
        await dbConnect();

        const { address, proof } = req.body;

        if (!address || !proof) {
            return res.status(400).json({ success: false, message: 'Missing address or proof in request body.' });
        }

        // 2. Perform cryptographic verification (R1)
        const result = await verifier.verify({ address, proof }, proof.payload);

        if (result.isValid) {
            // 3. SUCCESS: Save/Update User record (R2)
            console.log('User model is:', User);
            console.log('User model type:', typeof User);
            console.log('User.findOneAndUpdate exists:', typeof User.findOneAndUpdate);

            const user = await User.findOneAndUpdate(
                { tonAddress: address }, 
                { 
                    proofs: proof, 
                    $setOnInsert: { // Only set these fields if creating a NEW document
                        bio: `Hi! I'm a verified TON D ID user.`,
                        links: [{ title: 'My TON D ID Link', url: HOST_URL }]
                    }
                },
                { 
                    upsert: true, 
                    new: true,
                    runValidators: true,
                }
            );

            return res.status(200).json({ 
                success: true, 
                message: 'Identity Verified & Saved!',
                tonAddress: user.tonAddress,
            });
        } else {
            return res.status(401).json({ success: false, message: 'TON Proof signature failed.' });
        }

    } catch (error) {
        console.error('Verification error:', error);
        return res.status(500).json({ success: false, error: error.message || 'Server verification error.' });
    }
}