import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Send, Upload, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import MessageBubble from './MessageBubble';
import FileUpload from './FileUpload';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  files?: { name: string; type: string; url: string }[];
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hello! I'm your Drug Discovery AI Assistant. How can I help you today?",
      timestamp: new Date(),
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ✅ Updated backend call
  const sendMessageToBackend = async (text: string) => {
    try {
      const response = await fetch("http://localhost:3001/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text }),
      });

      const data = await response.json();
      return data.answer || "No response from server.";
    } catch (err) {
      console.error(err);
      return "Error: Unable to connect to backend.";
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = input;
    setInput('');
    setIsLoading(true);

    const aiResponse = await sendMessageToBackend(userInput);

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: aiResponse,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleFileUpload = (files: File[]) => {
    const fileData = files.map(file => ({
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file)
    }));

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: `Uploaded ${files.length} file(s)`,
      timestamp: new Date(),
      files: fileData
    };

    setMessages(prev => [...prev, userMessage]);
    setShowFileUpload(false);
    setIsLoading(true);

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `Files processed successfully ✅`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-subtle">
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <Card className="bg-gradient-card shadow-card p-4 max-w-xs">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="animate-pulse text-sm">Thinking...</span>
              </div>
            </Card>
          </div>
        )}
      </ScrollArea>

      {showFileUpload && (
        <div className="p-4 border-t bg-card">
          <FileUpload onUpload={handleFileUpload} onCancel={() => setShowFileUpload(false)} />
        </div>
      )}

      <Card className="m-4 p-4 bg-gradient-card shadow-molecular">
        <div className="flex items-end space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFileUpload(!showFileUpload)}
            className={cn("transition-smooth", showFileUpload && "bg-primary text-primary-foreground")}
          >
            <Upload className="h-4 w-4" />
          </Button>

          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask anything..."
            className="flex-1"
            disabled={isLoading}
          />

          <Button onClick={handleSendMessage} disabled={!input.trim() || isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span>Powered by Your Custom AI Backend</span>
          <Badge variant="secondary">{messages.length - 1} messages</Badge>
        </div>
      </Card>
    </div>
  );
};

export default ChatInterface;
