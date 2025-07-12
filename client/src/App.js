import React, { useState } from 'react';
import { SocketContext, socket } from './context/SocketContext';
import Login from './components/Login';
import ChatRoom from './components/ChatRoom';
import { Toaster } from 'react-hot-toast';

function App() {
  const [user, setUser] = useState(null);

  return (
    <SocketContext.Provider value={socket}>
      <div className="min-h-screen bg-dark text-white">
        <Toaster position="top-right" reverseOrder={false} />
        {!user ? <Login setUser={setUser} /> : <ChatRoom user={user} />}
      </div>
    </SocketContext.Provider>
  );
}

export default App;
