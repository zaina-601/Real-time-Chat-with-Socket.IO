import { createContext } from 'react';
import { io } from 'socket.io-client';

// 👇 Double check this!
export const socket = io('http://localhost:4000'); 
export const SocketContext = createContext();
