import { TonConnectButton, useTonConnectUI, useTonAddress } from '@tonconnect/ui-react';
import { useState, useEffect } from 'react';

function App() {
  const [tonConnectUI] = useTonConnectUI();
  const userAddress = useTonAddress(); // This is the wallet address
  const [status, setStatus] = useState("");
  const [profile, setProfile] = useState({ name: "", bio: "" });

  // 1. Prepare the "Proof Request" as soon as the app loads
  useEffect(() => {
    const generateNonce = () => {
      return Math.random().toString(36).substring(2, 15) + 
             Math.random().toString(36).substring(2, 15);
    };

    tonConnectUI.setConnectRequestParameters({
      state: 'ready',
      value: { 
        tonProof: generateNonce()
      }
    });
  }, [tonConnectUI]);

  // 2. Function to save the profile
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

      {/* Step 2: Show Profile Settings when wallet is connected */}
      {userAddress && (
        <div>
          <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #0088cc', borderRadius: '10px' }}>
            <p>Wallet Connected: <b>{userAddress.slice(0,6)}...{userAddress.slice(-4)}</b></p>
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
