// @ts-ignore
import { WebSocketServer, WebSocket } from 'ws';
import server from './app';

/**
 * Initialize a WebSocket server using the existing HTTP server from Express.
 */
const wss = new WebSocketServer({ server });

/**
 * In-memory store for chat messages.
 * This array is shared across all connections and reset on server restart.
 */
const messages: string[] = [];

/**
 * Handles incoming WebSocket connections.
 */
wss.on('connection', (ws: WebSocket) => {
  console.log('Client connected');

  // Send chat history to the newly connected client
  messages.forEach((msg) => ws.send(msg));

  /**
   * Handle incoming message from the client.
   */
  ws.on('message', (message: string | Buffer) => {
    const msgStr = message.toString();
    messages.push(msgStr);

    // Broadcast the new message to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(msgStr);
      }
    });
  });

  /**
   * Handle client disconnection.
   */
  ws.on('close', () => console.log('Client disconnected'));
});

console.log('✅ WebSocket server attached to Express (ws://localhost:3000)');
