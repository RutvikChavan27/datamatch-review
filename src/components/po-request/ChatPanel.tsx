import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { X, Send } from 'lucide-react';
import { PurchaseOrder } from '@/types/po-types';

interface Message {
  id: string;
  author: string;
  authorInitials: string;
  timestamp: Date;
  content: string;
  avatarColor: string;
}

interface ChatPanelProps {
  po: PurchaseOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

const mockMessages: Message[] = [
  {
    id: '1',
    author: 'Michael Evans',
    authorInitials: 'ME',
    timestamp: new Date(2025, 6, 15, 14, 10),
    content: 'Can someone confirm if the lead times listed in the supplier quote are still accurate based on the latest update?',
    avatarColor: 'bg-blue-100 text-blue-600'
  },
  {
    id: '2',
    author: 'Samantha Lee',
    authorInitials: 'SL',
    timestamp: new Date(2025, 6, 16, 9, 0),
    content: 'I followed up with our supplier this morning. All lead times remain the same except for Item #A457, which now has a revised delivery estimate — delayed by 10 days due to shipping constraints.',
    avatarColor: 'bg-purple-100 text-purple-600'
  },
  {
    id: '3',
    author: 'David Carter',
    authorInitials: 'SC',
    timestamp: new Date(2025, 6, 16, 9, 22),
    content: 'Thanks, Samantha. Will this delay affect our client shipment scheduled for August 1st?',
    avatarColor: 'bg-yellow-100 text-yellow-700'
  },
  {
    id: '4',
    author: 'Samantha Lee',
    authorInitials: 'SL',
    timestamp: new Date(2025, 6, 16, 10, 5),
    content: "It might. I'll check with our logistics partner and propose alternative options. Will update you by the end of the day.",
    avatarColor: 'bg-purple-100 text-purple-600'
  },
  {
    id: '5',
    author: 'Michael Evans',
    authorInitials: 'ME',
    timestamp: new Date(2025, 6, 16, 10, 18),
    content: 'Sounds good. Once we have the revised plan, please ensure the client team is informed.',
    avatarColor: 'bg-blue-100 text-blue-600'
  }
];

const ChatPanel: React.FC<ChatPanelProps> = ({ po, isOpen, onClose }) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message to the backend
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (!isOpen || !po) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-20 z-40"
        onClick={onClose}
      />
      
      {/* Chat Panel */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white border-l border-po-border z-50 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-po-border bg-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-inter font-semibold text-base text-po-text-primary">
              {po.title}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-fira-code text-sm text-po-text-secondary">
              {po.reference}
            </span>
            <div className="px-2 py-0.5 bg-blue-50 rounded-xl">
              <span className="text-xs font-roboto font-medium text-blue-600">
                Ready For Review
              </span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {mockMessages.map((message) => (
            <div key={message.id} className="flex gap-3">
              <Avatar className={`h-10 w-10 ${message.avatarColor} flex-shrink-0`}>
                <AvatarFallback className="text-sm font-medium">
                  {message.authorInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-roboto font-medium text-sm text-po-text-primary">
                    {message.author}
                  </span>
                  <span className="font-roboto text-xs text-po-text-secondary">
                    {formatTimestamp(message.timestamp)}
                  </span>
                </div>
                <p className="font-roboto text-sm text-po-text-primary leading-relaxed">
                  {message.content}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Reply Section */}
        <div className="p-4 border-t border-po-border bg-white">
          <div className="flex gap-3">
            <Avatar className="h-10 w-10 bg-blue-100 text-blue-600 flex-shrink-0">
              <AvatarFallback className="text-sm font-medium">
                ME
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="mb-2">
                <span className="font-roboto text-sm text-po-text-secondary">
                  Response
                </span>
              </div>
              <div className="flex gap-2">
                <Textarea
                  placeholder="Type your response..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 min-h-[80px] resize-none font-roboto text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="self-end bg-po-brand hover:bg-po-hover p-2"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatPanel;