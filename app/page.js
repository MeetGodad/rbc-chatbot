'use client';

import { useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) {
        throw new Error('Failed to fetch response');
      }

      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.error('Error:', error);
      setResponse('An error occurred while processing your request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-800 text-white">
      <div className="z-10 max-w-3xl w-full items-center justify-between text-center">
        <h1 className="text-4xl font-bold mb-8">RBC Services Assistant</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask about RBC services..."
            className="w-full p-4 border border-gray-700 bg-gray-900 rounded"
            rows={4}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded"
          >
            {isLoading ? 'Processing...' : 'Send'}
          </button>
        </form>
        {response && (
          <div className="mt-8 p-4 bg-gray-700 rounded">
            <h2 className="text-2xl font-semibold mb-2">Assistant Response:</h2>
            <p>{response}</p>
          </div>
        )}
      </div>
    </main>
  );
}
