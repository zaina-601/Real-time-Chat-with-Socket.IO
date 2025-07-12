import React, { useEffect, useState, useContext } from 'react';
import Chat from './Chat';
import { SocketContext } from '../context/SocketContext';
import toast from 'react-hot-toast';

const ChatRoom = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const socket = useContext(SocketContext);

  useEffect(() => {
    socket.emit('login', user, (res) => {
      if (res.success) console.log('✅ Logged in as', user);
    });

    socket.on('updateUsers', (list) => {
      const filtered = list.filter((u) => u !== user);
      setUsers(filtered);
    });

    socket.on('removeUser', (username) => {
      setUsers((prev) => prev.filter((u) => u !== username));
    });

    return () => {
      socket.off('updateUsers');
      socket.off('removeUser');
    };
  }, [socket, user]);

  const handleSignOut = () => {
    toast.success('Signed out');
    setTimeout(() => {
      window.location.reload();
    }, 1200);
  };

  return (
    <div className="grid grid-cols-4 gap-4 h-screen bg-dark">
      {/* Sidebar */}
      <div className="col-span-1 bg-lightDark p-4 border-r border-gray-700">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-white">Online Users</h2>
            <button
              onClick={handleSignOut}
              className="text-sm text-white bg-red-500 px-3 py-1 rounded"
            >
              Sign Out
            </button>
          </div>
          <ul className="space-y-2">
            {users.map((u) => (
              <li
                key={u}
                className={`bg-dark p-3 rounded cursor-pointer transition ${
                  activeChat === u ? 'border-l-4 border-purple-500' : ''
                }`}
                onClick={() => setActiveChat(u)}
              >
                <p className="text-white font-semibold">{u}</p>
                <span className="text-green-400 text-xs">online ●</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Chat Section */}
      <div className="col-span-3 flex flex-col">
        {activeChat && (
          <div className="bg-lightDark px-4 py-3 shadow flex items-center justify-between border-b border-gray-700">
            <div>
              <h2 className="text-xl font-semibold text-white">{activeChat}</h2>
              <span className="text-green-400 text-sm">online ●</span>
            </div>
          </div>
        )}
        <div className="flex-1 overflow-hidden">
          {activeChat ? (
            <Chat to={activeChat} user={user} />
          ) : (
            <p className="text-gray-400 mt-20 text-center">
              Select a user to start chatting.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
