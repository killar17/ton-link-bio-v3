// api/verify-proof.js
const { TonProofVerifier } = require('@ton/ton-connect');
const dbConnect = require('../dbConnect'); // Import connection
const User = require('../models/User'); // Import User model

// REPLACED WITH ACTUAL VERCEL HTTPS URL
const HOST_URL = 'https://ton-link-bio-v3-tblm-git-main-killar17s-projects.vercel.app'; 
const verifier = new TonProofVerifier({ host: HOST_URL });

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    // 1. Establish Database Connection
    await dbConnect(); 

    try {
        const { address, proof } = req.body;

        if (!address || !proof) {
            return res.status(400).json({ success: false, message: 'Missing address or proof in request body.' });
        }

        // 2. Perform cryptographic verification (R1)
        const result = await verifier.verify({ address, proof }, proof.payload);

        if (result.isValid) {
            // 3. SUCCESS: Save/Update User record (R2)
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

            res.status(200).json({ 
                success: true, 
                message: 'Identity Verified & Saved!',
                tonAddress: user.tonAddress,
            });
        } else {
            res.status(401).json({ success: false, message: 'TON Proof signature failed.' });
        }

    } catch (e) {
        console.error('Verification error:', e);
        res.status(500).json({ success: false, error: 'Server verification error.' });
    }
};
