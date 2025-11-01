import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Image, Clock, User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  files?: { name: string; type: string; url: string }[];
}

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.type === 'user';
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div className={cn("flex space-x-2 max-w-[85%]", isUser && "flex-row-reverse space-x-reverse")}>
        {/* Avatar */}
        <div className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          isUser 
            ? "bg-gradient-primary text-primary-foreground shadow-glow" 
            : "bg-gradient-scientific text-secondary-foreground shadow-molecular"
        )}>
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </div>

        {/* Message Content */}
        <div className="flex flex-col space-y-1">
          <Card className={cn(
            "p-4 shadow-card transition-smooth hover:shadow-molecular",
            isUser 
              ? "bg-gradient-primary text-primary-foreground ml-2" 
              : "bg-gradient-card mr-2"
          )}>
            {/* Files */}
            {message.files && message.files.length > 0 && (
              <div className="mb-3 space-y-2">
                {message.files.map((file, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center space-x-2 p-2 rounded-md",
                      isUser 
                        ? "bg-primary-foreground/10" 
                        : "bg-muted"
                    )}
                  >
                    {getFileIcon(file.type)}
                    <span className="text-sm truncate flex-1">{file.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {file.type.split('/')[0]}
                    </Badge>
                  </div>
                ))}
              </div>
            )}

            {/* Message Text */}
            <div className="prose prose-sm max-w-none">
              {message.content.split('\n').map((line, index) => {
                if (line.startsWith('• ')) {
                  return (
                    <div key={index} className="flex items-start space-x-2 my-1">
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0",
                        isUser ? "bg-primary-foreground" : "bg-primary"
                      )} />
                      <span>{line.substring(2)}</span>
                    </div>
                  );
                }
                return line ? <p key={index} className="my-1">{line}</p> : <br key={index} />;
              })}
            </div>
          </Card>

          {/* Timestamp */}
          <div className={cn(
            "flex items-center space-x-1 text-xs text-muted-foreground px-2",
            isUser && "justify-end"
          )}>
            <Clock className="h-3 w-3" />
            <span>{formatTime(message.timestamp)}</span>
            {!isUser && (
              <Badge variant="secondary" className="text-xs ml-2">
                RAG AI
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;