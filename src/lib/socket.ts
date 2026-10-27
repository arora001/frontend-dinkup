import { io, Socket } from 'socket.io-client';

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5003';

let socketInstance: Socket | null = null;

export function getSocket(): Socket {
  if (!socketInstance) {
    socketInstance = io(`${SOCKET_URL}/realtime`, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      transports: ['websocket', 'polling'],
    });

    socketInstance.on('connect', () => {
      console.log('⚡ DinkUp WebSocket connected:', socketInstance?.id);
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('🔌 DinkUp WebSocket disconnected:', reason);
    });

    socketInstance.on('connect_error', (error) => {
      console.warn('⚠️ DinkUp WebSocket connection error:', error.message);
    });
  }

  return socketInstance;
}
