import { io } from 'socket.io-client';

// Read backend url from Vite env or fallback
const BACKEND_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_BACKEND_URL) || process.env.BACKEND_URL || 'http://localhost:5000';

let socket = null;

export const connectLeaderboardSocket = (onConnect = () => {}, options = {}) => {
  if (socket && socket.connected) return socket;

  socket = io(BACKEND_URL, {
    path: '/socket.io',
    transports: ['websocket'],
    withCredentials: true,
    ...options
  });

  socket.on('connect', () => {
    onConnect(socket);
    console.log('Connected to leaderboard socket:', socket.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('Leaderboard socket disconnected:', reason);
  });

  // Optional built-in listeners can be registered by callers
  socket.on('leaderboard_update', (payload) => {
    // default: log; callers should also register their own listeners
    console.debug('leaderboard_update', payload?.timestamp || '');
  });

  return socket;
};

export const onLeaderboardUpdate = (cb) => {
  if (!socket) return () => {};
  socket.on('leaderboard_update', cb);
  return () => socket.off('leaderboard_update', cb);
};

export const onUserRankChange = (cb) => {
  if (!socket) return () => {};
  socket.on('user_rank_change', cb);
  return () => socket.off('user_rank_change', cb);
};

export const onNewSolve = (cb) => {
  if (!socket) return () => {};
  socket.on('new_solve', cb);
  return () => socket.off('new_solve', cb);
};

export const disconnectLeaderboardSocket = () => {
  if (!socket) return;
  socket.disconnect();
  socket = null;
};

export default {
  connectLeaderboardSocket,
  onLeaderboardUpdate,
  onUserRankChange,
  onNewSolve,
  disconnectLeaderboardSocket
};
