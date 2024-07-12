'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);

  const handleSubmit = async () => {
    if (!message.trim()) return;
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

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      if (textarea) {
        textarea.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [message]);

  const formatResponse = (response) => {
  let formatted = response
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
    .replace(/### (.*?)(?=\n|$)/g, '<h3>$1</h3>') // Headers
    .replace(/\n/g, '<br>'); // Line breaks

  // Correctly format numbered lists, adjusting for the starting number
  let counter = 1;
  formatted = formatted.replace(/(\d+)\. (.*?)(?=\n|$)/g, (match, number, text) => {
    if (parseInt(number) === 1) {
      return `<li><strong>${text}</strong></li>`; // Format the first numbered item differently
    } else {
      return `<li>${text}</li>`;
    }
  });

  // Correctly format bullet points
  formatted = formatted.replace(/- (.*?)(?=\n|$)/g, '<li>$1</li>');

  // Wrap lists in <ul> or <ol>
  formatted = formatted.replace(/(<li>.*?<\/li>)/g, '<ul>$1</ul>');
  formatted = formatted.replace(/<ul><ul>/g, '<ul>'); // Merge nested lists
  formatted = formatted.replace(/<\/ul><\/ul>/g, '</ul>'); // Merge nested lists

  return formatted;
};


  return (
    <main className="flex min-h-screen items-center justify-center bg-cover bg-center p-6 text-white"
      style={{ backgroundImage: `url('/Image/background-image.jpg')` }}>
      <div className="bg-black bg-opacity-60 p-8 rounded-2xl backdrop-blur-lg shadow-2xl max-w-2xl w-full hover:shadow-3xl transition-shadow duration-300">
        <motion.h1 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
        >
          RBC Services Assistant
        </motion.h1>
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative"
          >
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about RBC services..."
              className="w-full p-5 pr-16 border border-gray-700 bg-gray-900 rounded-lg text-white resize-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              rows={4}
            />
            <motion.button
              onClick={handleSubmit}
              disabled={isLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="absolute right-4 bottom-20 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isLoading ? (
                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </motion.button>
          </motion.div>
        </div>
        {response && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 p-6 bg-gray-800 rounded-lg shadow-inner"
            dangerouslySetInnerHTML={{ __html: formatResponse(response) }}
          >
          </motion.div>
        )}
      </div>
    </main>
  );
}
