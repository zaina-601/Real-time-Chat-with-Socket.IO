import React, { useState, useContext } from 'react';
import { SocketContext } from '../context/SocketContext';
import toast from 'react-hot-toast';

const Login = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const socket = useContext(SocketContext);

  const handleLogin = () => {
    if (!username.trim()) return;

    socket.emit('login', username, (res) => {
      if (res.success) {
        setUser(username);
        toast.success(`Signed in as ${username}`);
      }
    });
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-white">Enter your name</h1>
        <input
          className="px-4 py-2 rounded bg-gray-700 text-white"
          placeholder="Your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          className="ml-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white"
          onClick={handleLogin}
        >
          Join Chat
        </button>
      </div>
    </div>
  );
};

export default Login;
