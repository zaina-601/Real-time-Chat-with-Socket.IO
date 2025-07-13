import React, { useEffect, useRef, useState, useContext } from 'react';
import { SocketContext } from '../context/SocketContext';

const Chat = ({ user, to }) => {
  const socket = useContext(SocketContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    const handleReceiveMessage = (msg) => {
      if (
        (msg.from === user && msg.to === to) ||
        (msg.from === to && msg.to === user)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on('receiveMessage', handleReceiveMessage);

    socket.on('typing', ({ from }) => {
      if (from === to) {
        setIsTyping(true);
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 2000);
      }
    });

    socket.on('stopTyping', ({ from }) => {
      if (from === to) setIsTyping(false);
    });

    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
      socket.off('typing');
      socket.off('stopTyping');
    };
  }, [socket, user, to]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const message = {
      from: user,
      to,
      text: input,
      time: new Date().toLocaleTimeString(),
    };

    socket.emit('sendMessage', message);
    socket.emit('stopTyping', { from: user, to });

    setInput('');
  };

  const handleTyping = (e) => {
    setInput(e.target.value);
    socket.emit('typing', { from: user, to });

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stopTyping', { from: user, to });
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 bg-dark text-white">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-xs p-3 mb-2 rounded-lg ${
              msg.from === user
                ? 'ml-auto bg-green-600'
                : 'mr-auto bg-blue-600'
            }`}
          >
            <p className="break-words">{msg.text}</p>
            <span className="text-xs text-white opacity-70 block mt-1">
              {msg.time}
            </span>
          </div>
        ))}
        {isTyping && (
          <p className="text-sm text-gray-400 italic">{to} is typing...</p>
        )}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={sendMessage}
        className="flex items-center p-3 bg-lightDark border-t border-gray-700"
      >
        <input
          type="text"
          value={input}
          onChange={handleTyping}
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
