'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  role: 'user' | 'auntie';
  content: string;
  timestamp: Date;
}

export default function AuntieChatsPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'auntie',
      content: "Assalaam alaikum beta! I'm your AI Auntie. Ask me anything about weddings, dowry, negotiations, or life. I'll give you the unfiltered truth that your actual aunties are too polite to say.",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue('');
    setLoading(true);

    try {
      const res = await fetch('/api/auntie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');

      const auntieMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'auntie',
        content: data.reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, auntieMessage]);
    } catch (error) {
      toast.error('Auntie busy hai abhi, thoda wait karo beta!');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col bg-background" style={{ minHeight: '100dvh' }}>
      <Navbar />

      {/* Chat area fills remaining space */}
      <div className="flex-1 flex flex-col min-h-0 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8" style={{ height: 'calc(100dvh - 140px)' }}>

        {/* Title */}
        <motion.div
          className="text-center mb-4 shrink-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl sm:text-4xl font-bold text-foreground mb-1">
            AI Auntie Chat
          </h1>
          <p className="text-sm text-muted-foreground">
            Your sarcastic, brutally honest virtual auntie. No judgment, just truth.
          </p>
        </motion.div>

        {/* Chat Box */}
        <div className="flex-1 flex flex-col min-h-0 rounded-lg bg-card/50 backdrop-blur border border-border/50 overflow-hidden">

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div
                  className={`max-w-[80%] sm:max-w-md px-4 py-3 rounded-lg text-sm ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-muted text-foreground rounded-bl-none'
                  }`}
                >
                  <p>{message.content}</p>
                  <p className="text-xs opacity-60 mt-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </motion.div>
            ))}

            {loading && (
              <motion.div
                className="flex justify-start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="p-4 bg-muted rounded-lg rounded-bl-none">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="shrink-0 border-t border-border/50 p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask your auntie anything..."
                className="flex-1 px-4 py-2 bg-input border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                disabled={loading}
              />
              <Button
                onClick={handleSend}
                disabled={loading || !inputValue.trim()}
                className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              AI Auntie is for entertainment only. Seek professional advice for legal/financial matters.
            </p>
          </div>
        </div>
      </div>

      {/* Footer only on desktop */}
      <div className="hidden sm:block shrink-0">
        <Footer />
      </div>
    </div>
  );
}