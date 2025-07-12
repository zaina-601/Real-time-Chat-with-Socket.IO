import React, { useEffect, useRef, useState, useContext } from 'react';
import { SocketContext } from '../context/SocketContext';

const Chat = ({ user, to }) => {
  const socket = useContext(SocketContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  // Handle receiving messages
  useEffect(() => {
    const handleReceiveMessage = (msg) => {
      // Only show messages between current user and selected chat partner
      if (
        (msg.from === user && msg.to === to) ||
        (msg.from === to && msg.to === user)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on('receiveMessage', handleReceiveMessage);

    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
    };
  }, [socket, user, to]);

  // Auto scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const message = {
      from: user,
      to,
      text: input,
      time: new Date().toLocaleTimeString(),
    };

    // ✅ Do not update messages locally — server will emit back
    socket.emit('sendMessage', message);

    setInput('');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-dark text-white">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-xs p-3 mb-2 rounded-lg ${
              msg.from === user
                ? 'ml-auto bg-green-600 text-white'
                : 'mr-auto bg-blue-600 text-white'
            }`}
          >
            <p className="break-words">{msg.text}</p>
            <span className="text-xs text-white opacity-70 block mt-1">
              {msg.time}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <form
        onSubmit={sendMessage}
        className="flex items-center p-3 bg-lightDark border-t border-gray-700"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 rounded bg-dark text-white placeholder-gray-400 outline-none"
        />
        <button
          type="submit"
          className="ml-3 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
