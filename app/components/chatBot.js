'use client';

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    const userMessage = { type: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    try {
      const response = await axios.post('/api/chat', { query: input });
      const botMessage = { type: 'bot', content: formatResponse(response.data.response) };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { type: 'bot', content: "Sorry, I encountered an error. Please try again." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatResponse = (response) => {
    // Split the response into sections
    const sections = response.split('###').map(section => section.trim());
  
    // Format each section
    const formattedSections = sections.map(section => {
      if (!section) return '';
  
      const lines = section.split('\n');
      const title = lines.shift();
      const content = lines.join('\n');
  
      return `<h3>${title}</h3>
        ${content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                 .replace(/- (.*)/g, '<li>$1</li>')
                 .replace(/\n\n/g, '<br><br>')}`;
    });
  
    // Join the formatted sections
    return formattedSections.join('');
  };

  return (
    <div className="flex flex-col h-screen bg-cover bg-center" style={{ backgroundImage: `url('/Image/background-image.jpg')` }}>
      <header className="bg-gradient-to-r from-blue-800 to-blue-900 text-white py-6 px-8 shadow-lg flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-wide">RBC Investment Assistant</h1>
      </header>
      
      <div className="flex-grow overflow-auto p-6 space-y-4">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-xs lg:max-w-md xl:max-w-lg p-4 rounded-2xl shadow-md ${
                msg.type === 'user' 
                  ? 'bg-blue-700 text-white' 
                  : 'bg-gray-800 text-white'
              } transform transition-all duration-300 hover:scale-105`}
            >
              {msg.type === 'user' ? (
                msg.content
              ) : (
                <div className="chat-response">
                  <h3 className="text-xl font-bold mb-2">Assistant Response:</h3>
                  <div dangerouslySetInnerHTML={{ __html: msg.content }} />
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-6 bg-gray-800 shadow-lg">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about RBC investment strategies..."
            className="flex-grow p-4 border border-gray-700 bg-gray-900 rounded-l-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            className={`px-6 py-3 bg-gradient-to-r from-blue-700 to-blue-900 text-white rounded-r-full hover:from-blue-800 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Send'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
