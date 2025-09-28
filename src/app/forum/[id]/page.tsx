'use client'

import { useState } from 'react'

interface Message {
  id: string;
  author: string;
  authorRole: string;
  content: string;
  timestamp: Date;
}

export default function ForumPage({ params }: { params: { id: string } }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      author: 'Sarah Jones',
      authorRole: 'MSD Case Worker', 
      content: 'Emergency housing application received for John Smith. Fast-tracking eligibility check.',
      timestamp: new Date()
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: Date.now().toString(),
      author: 'Current User',
      authorRole: 'System',
      content: newMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Emergency Housing Forum</h1>
      <p className="text-gray-600 mb-6">Coordination space for housing placement</p>
      
      <div className="border rounded-lg h-96 overflow-y-auto p-4 mb-4 bg-gray-50">
        {messages.map(message => (
          <div key={message.id} className="mb-4 p-3 bg-white rounded shadow-sm">
            <div className="font-semibold text-sm text-blue-600">
              {message.author} ({message.authorRole})
            </div>
            <div className="mt-1">{message.content}</div>
            <div className="text-xs text-gray-500 mt-1">
              {message.timestamp.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border rounded px-3 py-2"
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button 
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}
