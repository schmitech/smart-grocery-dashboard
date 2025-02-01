import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Minimize2, Maximize2 } from 'lucide-react';
import { Product, CategoryInsight } from '../types';
import { generateResponse } from '../utils/chatbot';

interface StoreChatProps {
  products: Product[];
  categoryInsights: CategoryInsight[];
}

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export function StoreChat({ products, categoryInsights }: StoreChatProps) {
  const [messages, setMessages] = useState<Message[]>([{
    text: "Hello! I can help you understand what's happening in your store. Ask me about inventory levels, demand forecasts, or category performance.",
    isUser: false,
    timestamp: new Date()
  }]);
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      text: input,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Get AI response
    const response = await generateResponse(input, products, categoryInsights);
    
    const aiMessage: Message = {
      text: response,
      isUser: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMessage]);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-blue-500 text-white">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5" />
          <h2 className="font-semibold">Store Assistant</h2>
        </div>
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="p-1 hover:bg-blue-600 rounded"
        >
          {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
        </button>
      </div>
      
      {!isMinimized && (
        <>
          <div className="h-[200px] overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    message.isUser
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p>{message.text}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your store's inventory..."
                className="flex-1 text-sm rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white rounded-lg px-3 py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}