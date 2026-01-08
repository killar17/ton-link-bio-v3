import { TonConnectButton, useTonConnectUI, useTonAddress } from '@tonconnect/ui-react';
import { useState, useEffect } from 'react';

function App() {
  const [tonConnectUI] = useTonConnectUI();
  const userAddress = useTonAddress();
  const [profile, setProfile] = useState({ name: '', bio: '' });
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!tonConnectUI) return;

    // This MUST be set to 'ready' to trigger the signature request
    tonConnectUI.setConnectRequestParameters({
      state: 'ready',
      value: {
        tonProof: 'Verify-Me-Please'
      }
    });
  }, [tonConnectUI]);

  const handleSave = async () => {
    if (!userAddress) return alert('Please connect your wallet first.');

    setStatus('Saving...');
    try {
      const response = await fetch('/api/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: userAddress, ...profile }),
      });

      const data = await response.json();
      if (data.success) {
        setStatus('Profile saved.');
        alert('Profile Saved!');
      } else {
        setStatus('Save failed.');
        alert('Save failed.');
      }
    } catch (e) {
      console.error(e);
      setStatus('Server error.');
      alert('Server error.');
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Arial' }}>
      <h1>TON D ID</h1>
      <TonConnectButton />

      {userAddress && (
        <div style={{ marginTop: '20px' }}>
          <h3>Settings</h3>
          <input
            placeholder="Name"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            style={{ display: 'block', margin: '10px auto', padding: '10px', width: '200px' }}
          />
          <textarea
            placeholder="Bio"
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            style={{ display: 'block', margin: '10px auto', padding: '10px', width: '200px' }}
          />
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '10px' }}>
            <button
              onClick={handleSave}
              style={{ backgroundColor: '#0088cc', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px' }}
            >
              Save to Profile
            </button>
            <button
              onClick={() => tonConnectUI?.disconnect()}
              style={{ backgroundColor: '#ccc', color: '#222', padding: '10px 20px', border: 'none', borderRadius: '5px' }}
            >
              Disconnect
            </button>
          </div>
          <p style={{ marginTop: '12px', color: '#666' }}>{status}</p>
        </div>
      )}
    </div>
  );
}

export default App;
