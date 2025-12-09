import { TonConnectButton, useTonAddress } from '@tonconnect/ui-react';
import './App.css'; 

function App() {
  // Hook to get the connected address
  const userFriendlyAddress = useTonAddress();

  return (
    <div className="App">
      <h1>TON Identity Linker</h1>

      {/* The main button component */}
      <TonConnectButton /> 

      {userFriendlyAddress && (
        <p>Wallet Connected: <code>{userFriendlyAddress}</code></p>
      )}

      {!userFriendlyAddress && (
        <p>Connect your wallet to verify your TON identity.</p>
      )}
    </div>
  );
}

export default App;
