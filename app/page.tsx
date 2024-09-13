// app/page.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

export default function ChatPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (loading) return <p>Loading...</p>;
  
  if (!user && process.env.NODE_ENV !== 'development') {
    router.push('/login');
    return null;
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  const handleSend = async () => {
    if (input.trim() === '') return;

    setMessages((prev) => [...prev, { sender: 'user', text: input }]);
    const userInput = input;
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: `You said: ${userInput}` },
      ]);
    }, 1000);
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="flex items-center justify-center h-16 bg-gray-900">
          <h1 className="text-xl font-semibold">My App</h1>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          <button className="w-full px-4 py-2 text-left bg-gray-700 rounded hover:bg-gray-600">
            + New Chat
          </button>
          {/* Chat history */}
        </nav>
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-left bg-gray-700 rounded hover:bg-gray-600"
          >
            Logout
          </button>
        </div>
      </aside>
      {/* Main Chat Area */}
      <main className="flex flex-1 flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xl rounded-lg px-4 py-2 ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-900'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 bg-gray-100">
          <div className="flex">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 rounded-l-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleSend}
              className="rounded-r-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            >
              Send
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}