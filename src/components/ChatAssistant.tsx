import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { useChat } from '../hooks';
import { cn } from './Layout';
import { Transaction } from '../types';

interface ChatAssistantProps {
  transactions: Transaction[];
}

export function ChatAssistant({ transactions }: ChatAssistantProps) {
  const { messages, addMessage, setMessages } = useChat();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    addMessage('user', userMsg);
    setInput('');
    setIsLoading(true);

    try {
      // Append context about transactions for the AI to understand user's data
      const recentTx = [...transactions].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);
      let context = '';
      if (recentTx.length > 0) {
        context = `\n[System note: User's recent transactions: ${JSON.stringify(recentTx)}]`;
      }
      
      const updatedMessages = [...messages, { id: 'tmp', role: 'user', content: userMsg + context, timestamp: Date.now() }];

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch response');
      }

      addMessage('ai', data.message);
    } catch (error: any) {
      console.error(error);
      const errorMsg = error.message || "I'm sorry, I'm having trouble connecting right now. Please ensure your Gemini API key is configured correctly.";
      addMessage('ai', `Error: ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
            Atlas AI 
            <Sparkles size={24} className="text-blue-500" />
          </h2>
          <p className="text-neutral-500 mt-1">Ask questions, get financial advice, and analyze your spending.</p>
        </div>
      </div>

      <div className="flex-1 bg-white border border-neutral-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            
            // Clean up system context from user message UI
            let displayContent = msg.content;
            if (isUser && displayContent.includes('[System note:')) {
              displayContent = displayContent.split('[System note:')[0].trim();
            }

            return (
              <div key={msg.id} className={cn("flex gap-4 max-w-[85%]", isUser ? "ml-auto flex-row-reverse" : "")}>
                <div className={cn("w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-white", isUser ? "bg-neutral-900" : "bg-blue-600")}>
                  {isUser ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={cn("p-4 rounded-2xl text-[15px] leading-relaxed", isUser ? "bg-neutral-100 text-neutral-900 rounded-tr-sm" : "bg-blue-50 text-neutral-900 rounded-tl-sm")}>
                  <div className="prose prose-sm prose-neutral" dangerouslySetInnerHTML={{ __html: displayContent.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                </div>
              </div>
            );
          })}
          
          {isLoading && (
            <div className="flex gap-4 max-w-[85%]">
              <div className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-white bg-blue-600">
                <Bot size={16} />
              </div>
              <div className="p-4 rounded-2xl bg-blue-50 text-neutral-900 rounded-tl-sm flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>
          )}
          <div ref={endOfMessagesRef} />
        </div>

        <div className="p-4 bg-white border-t border-neutral-100">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Atlas about your finances..."
              className="w-full pl-5 pr-14 py-4 rounded-full border border-neutral-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-neutral-50/50 shadow-sm transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 p-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
