import { TonConnectButton, useTonAddress } from '@tonconnect/ui-react';
import './App.css'; 

function App() {
  // Hook to get the connected address
  const userFriendlyAddress = useTonAddress();

  const handleVerify = async () => {
    // Try to access the TonConnect UI instance (it may be exposed on window)
    const tonConnectUI = (typeof window !== 'undefined' && window.tonConnectUI) || globalThis.tonConnectUI;
    const wallet = tonConnectUI?.wallet;

    // Check if we have the proof from the wallet
    if (!wallet || !wallet.connectItems?.tonProof) {
      alert('Please reconnect your wallet to generate proof.');
      return;
    }

    try {
      const response = await fetch('/api/verify-proof', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: wallet.account.address,
          proof: wallet.connectItems.tonProof.proof,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Success! Identity Verified & Saved to MongoDB.');
      } else {
        alert('Verification failed: ' + (data.message || 'unknown'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Server error during verification.');
    }
  };

  return (
    <div className="App">
      <h1>TON Identity Linker</h1>

      {/* The main button component */}
      <TonConnectButton /> 

      {userFriendlyAddress && (
        <>
          <p>Wallet Connected: <code>{userFriendlyAddress}</code></p>
          <button onClick={handleVerify}>Verify Identity</button>
        </>
      )}

      {!userFriendlyAddress && (
        <p>Connect your wallet to verify your TON identity.</p>
      )}
    </div>
  );
}

export default App;
