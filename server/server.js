const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const socketToUser = new Map();

io.on('connection', (socket) => {
  console.log('New socket connected:', socket.id);

  socket.on('login', (username, callback) => {
    socketToUser.set(socket.id, username);
    console.log(username, 'logged in');

    const allUsers = Array.from(socketToUser.values());

    io.emit('updateUsers', allUsers);

    if (callback) callback({ success: true });
  });

  socket.on('sendMessage', (msg) => {
    const targetSocketId = [...socketToUser.entries()].find(([_, name]) => name === msg.to)?.[0];
    if (targetSocketId) {
      io.to(targetSocketId).emit('receiveMessage', msg);
    }
    socket.emit('receiveMessage', msg);
  });

  socket.on('typing', ({ to, from }) => {
    const targetSocketId = [...socketToUser.entries()].find(([_, name]) => name === to)?.[0];
    if (targetSocketId) {
      io.to(targetSocketId).emit('typing', { from });
    }
  });

  socket.on('stopTyping', ({ to, from }) => {
    const targetSocketId = [...socketToUser.entries()].find(([_, name]) => name === to)?.[0];
    if (targetSocketId) {
      io.to(targetSocketId).emit('stopTyping', { from });
    }
  });

  socket.on('disconnect', () => {
    const username = socketToUser.get(socket.id);
    if (username) {
      console.log(username, 'disconnected');
      socketToUser.delete(socket.id);
      const updatedUsers = Array.from(socketToUser.values());
      io.emit('updateUsers', updatedUsers);
      io.emit('removeUser', username);
    }
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
