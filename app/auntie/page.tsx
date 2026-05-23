'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { ProtectedFeature } from '@/components/protected-feature';
import { SkeletonCard } from '@/components/loading-skeleton';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  role: 'user' | 'auntie';
  content: string;
  timestamp: Date;
}

const auntieResponses = [
  "Beta, rishta and shaadi are two different beasts entirely. Have you thought about what you REALLY want?",
  "Haye Ram! That dowry amount... let's just say the groom's mother is definitely expecting more. Trust me, I know these things.",
  "Listen beta, if they're asking for that much, they probably don't deserve it. You know your worth, no?",
  "Acha, acha, I'll tell you what I told my own daughter: marry for love, negotiate for sanity.",
  "These days, with dowry and shaadi expenses, it's like they're pricing daughters like real estate! Madness, pure madness.",
  "Beta, take it from someone who's seen 50 years of weddings: the ones that lasted were the ones where both families respected each other.",
  "Have you considered just eloping? I'm joking... mostly. But seriously, have a backbone in these negotiations!",
  "You know what I always say? If the marriage doesn't last, at least the dowry did its job. Use your head!",
];

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

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    try {
      setLoading(true);

      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: inputValue,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputValue('');

      // Simulate AI response with delay
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const mockResponse = auntieResponses[Math.floor(Math.random() * auntieResponses.length)];
      const auntieMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'auntie',
        content: mockResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, auntieMessage]);
    } catch (error) {
      toast.error('Something went wrong');
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
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <ProtectedFeature featureName="AI Auntie Chat">
          <section className="py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-[calc(100vh-200px)]">
              <motion.div
                className="text-center mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                  AI Auntie Chat
                </h1>
                <p className="text-muted-foreground">
                  Your sarcastic, brutally honest virtual auntie. No judgment, just truth.
                </p>
              </motion.div>

              {/* Chat Container */}
              <div className="rounded-lg bg-card/50 backdrop-blur border border-border/50 flex flex-col h-full overflow-hidden">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground rounded-br-none'
                            : 'bg-muted text-foreground rounded-bl-none'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
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
                      <div className="space-y-2 p-4 bg-muted rounded-lg rounded-bl-none">
                        <div className="flex gap-2">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Input Area */}
                <div className="border-t border-border/50 p-4">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask your auntie anything..."
                      className="flex-1 px-4 py-2 bg-input border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      disabled={loading}
                    />
                    <Button
                      onClick={handleSend}
                      disabled={loading || !inputValue.trim()}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <motion.div
                className="mt-4 text-center text-xs text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p>AI Auntie is for entertainment and perspective. Always seek legal/financial advice from professionals.</p>
              </motion.div>
            </div>
          </section>
        </ProtectedFeature>
      </main>

      <Footer />
    </div>
  );
}
