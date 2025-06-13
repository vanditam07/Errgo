import React, { useCallback, useEffect, useRef, useState } from 'react';

/**
 * ChatPage component implements a simple WebSocket-based chat UI.
 * 
 * Features:
 * - Connects to a WebSocket server at ws://localhost:3000
 * - Displays chat messages from all users in real-time
 * - Allows user to send messages via input box (Enter key or Send button)
 * - Handles connection lifecycle and errors
 * 
 * @component
 * @returns {JSX.Element} The chat page UI.
 */
const ChatPage: React.FC = () => {
  // State for storing all received messages
  const [messages, setMessages] = useState<string[]>([]);
  // State for the current input message
  const [input, setInput] = useState('');
  // Ref to store the WebSocket instance
  const ws = useRef<WebSocket | null>(null);

  /**
   * Initialize WebSocket connection on component mount,
   * setup event handlers, and cleanup on unmount.
   */
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3000'); // Adjust URL if backend differs

    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    socket.onerror = (err) => {
      console.error('WebSocket error:', err);
      alert('WebSocket error. Is the backend running?');
    };

    socket.onclose = () => {
      console.warn('WebSocket closed');
    };

    ws.current = socket;

    return () => {
      socket.close();
    };
  }, []);

  /**
   * Sends the current input message via WebSocket
   * and clears the input field if connection is open.
   */
  const sendMessage = useCallback(() => {
    if (input.trim() !== '' && ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(input);
      setInput('');
    }
  }, [input]);

  /**
   * Handles Enter key press in input box to trigger sendMessage.
   * @param e Keyboard event on the input element
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="p-4 flex flex-col h-screen">
      {/* Messages display area */}
      <div
        className="flex-1 overflow-y-auto mb-4 bg-gray-100 p-2 rounded shadow"
        style={{ minHeight: 0, maxHeight: '60vh' }}
      >
        {messages.length === 0 ? (
          <div className="text-gray-400 text-center mt-10">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className="mb-1 text-sm break-words">
              {msg}
            </div>
          ))
        )}
      </div>

      {/* Input and send button */}
      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 border border-gray-300 rounded-l px-3 py-2"
          placeholder="Type a message and hit Enter or click Send..."
          aria-label="Chat message input"
        />
        <button
          onClick={sendMessage}
          className="bg-purple-500 text-white px-4 py-2 rounded-r hover:bg-purple-600"
          aria-label="Send message"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
