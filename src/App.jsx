import { TonConnectButton, useTonConnectUI, useTonAddress } from '@tonconnect/ui-react';
import { useState, useEffect } from 'react';

function App() {
  const [tonConnectUI] = useTonConnectUI();
  const userAddress = useTonAddress(); // This is the wallet address
  const [status, setStatus] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [profile, setProfile] = useState({ name: "", bio: "" });

  // 1. Prepare the "Proof Request" as soon as the app loads
  useEffect(() => {
    tonConnectUI.setConnectRequestParameters({
      state: 'ready',
      value: { tonProof: "VERIFY-TON-D-ID" }
    });
  }, [tonConnectUI]);

  // 2. The function for your NEW Sign In Button
  const handleSignIn = async () => {
    if (!userAddress) {
      setStatus("Error: No wallet connected. Please connect your wallet first.");
      return;
    }

    const wallet = tonConnectUI.wallet;
    const tonProof = wallet?.connectItems?.[0]?.tonProof;

    if (!tonProof) {
      setStatus("Error: No proof found. Please disconnect and reconnect your wallet.");
      return;
    }

    setStatus("Verifying Identity...");

    try {
      const response = await fetch('/api/verify-proof', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: userAddress,
          proof: tonProof
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setIsVerified(true);
        setStatus("✅ Identity Verified!");
      } else {
        setStatus(`❌ Verification Failed: ${data.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Sign-in error:', err);
      setStatus(`Server Error: ${err.message}`);
    }
  };

  // 3. Function to save the profile
  const saveProfile = async () => {
    try {
      const response = await fetch('/api/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: userAddress,
          ...profile
        }),
      });

      const data = await response.json();
      if (data.success) {
        setStatus("✅ Profile saved successfully!");
      } else {
        setStatus(`❌ Failed to save profile: ${data.message}`);
      }
    } catch (err) {
      console.error('Save profile error:', err);
      setStatus(`Server Error: ${err.message}`);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'Arial' }}>
      <h1>TON D ID</h1>
      
      {/* Step 1: The Standard Connect Button */}
      <div style={{ marginBottom: '20px' }}>
        <TonConnectButton />
      </div>

      {/* Step 2: Show "Sign In" Button ONLY after wallet is connected AND not verified */}
      {userAddress && !isVerified && (
        <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #0088cc', borderRadius: '10px' }}>
          <p>Wallet Connected: <b>{userAddress.slice(0,6)}...{userAddress.slice(-4)}</b></p>
          <button 
            onClick={handleSignIn}
            style={{ 
              backgroundColor: '#0088cc', color: 'white', padding: '15px 30px', 
              border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' 
            }}
          >
            Sign In to Verify Identity
          </button>
        </div>
      )}

      {/* Step 3: Show Success Message or Dashboard */}
      {isVerified && (
        <div>
          <div style={{ color: 'green', marginTop: '20px' }}>
            <h2>Welcome, Verified User!</h2>
            <p>Your ID is now securely stored in our database.</p>
          </div>

          <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '15px' }}>
            <h3>Edit Your TON ID</h3>
            <input 
              type="text" 
              placeholder="Display Name" 
              onChange={(e) => setProfile({...profile, name: e.target.value})}
              style={{ width: '80%', padding: '10px', marginBottom: '10px' }}
            />
            <textarea 
              placeholder="Bio" 
              onChange={(e) => setProfile({...profile, bio: e.target.value})}
              style={{ width: '80%', padding: '10px', marginBottom: '10px' }}
            />
            <button onClick={saveProfile} style={{ backgroundColor: 'green', color: 'white', padding: '10px 20px' }}>
              Save Profile
            </button>
          </div>
        </div>
      )}

      <p style={{ marginTop: '20px', color: '#666' }}>{status}</p>
    </div>
  );
}

export default App;
