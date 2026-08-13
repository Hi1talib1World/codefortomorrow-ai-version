import React, { useState, useEffect, useRef } from 'react';
import { Send, Search, User as UserIcon, MessageSquare, ArrowLeft, MoreVertical, Check, CheckCheck, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import api from '../services/api';
import { User } from '../types';
import GuestLoginBanner from './GuestLoginBanner';

interface MessagingSystemProps {
  currentUser: User;
  onClose?: () => void;
}

interface Conversation {
  user: {
    _id: string;
    name: string;
    profilePictureUrl: string;
    role: string;
  };
  lastMessage: {
    content: string;
    createdAt: string;
  };
  unreadCount: number;
}

interface Message {
  _id: string;
  sender: {
    _id: string;
    name: string;
    profilePictureUrl: string;
  };
  content: string;
  createdAt: string;
  isRead: boolean;
}

const MessagingSystem: React.FC<MessagingSystemProps> = ({ currentUser, onClose }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUser, setSelectedUser] = useState<Conversation['user'] | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'conversations' | 'contacts'>('conversations');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (view === 'contacts') {
      const fetchContacts = async () => {
        setIsSearchingUsers(true);
        try {
          const results = await api.searchUsers(searchQuery);
          setSearchResults(results);
        } catch (error) {
          console.error('Error searching users:', error);
        } finally {
          setIsSearchingUsers(false);
        }
      };

      if (searchQuery.trim().length > 0) {
        const delayDebounceFn = setTimeout(fetchContacts, 300);
        return () => clearTimeout(delayDebounceFn);
      } else {
        fetchContacts();
      }
    }
  }, [searchQuery, view]);

  // Poll conversations and active messages in real-time (every 4 seconds)
  useEffect(() => {
    let isMounted = true;

    const pollMessageUpdates = async () => {
      try {
        const conversationsData = await api.getConversations();
        if (isMounted) {
          setConversations(conversationsData);
        }

        if (selectedUser) {
          const messagesData = await api.getConversation(selectedUser._id);
          if (isMounted) {
            setMessages(prev => {
              // Avoid updating if the messages list hasn't changed to prevent scroll jumping
              const hasChanged = prev.length !== messagesData.length || 
                (messagesData.length > 0 && prev[prev.length - 1]?._id !== messagesData[messagesData.length - 1]?._id);
              return hasChanged ? messagesData : prev;
            });
          }
        }
      } catch (error) {
        console.error('Error polling messaging updates:', error);
      }
    };

    pollMessageUpdates(); // Fetch immediately on mount or user change

    const interval = setInterval(pollMessageUpdates, 4000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    setIsLoading(true);
    try {
      const data = await api.getConversations();
      setConversations(data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchConversation = async (userId: string) => {
    try {
      const data = await api.getConversation(userId);
      setMessages(data);
      // Refresh conversations to update unread counts
      fetchConversations();
    } catch (error) {
      console.error('Error fetching conversation:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser || isSending) return;

    setIsSending(true);
    try {
      const sentMsg = await api.sendMessage(selectedUser._id, newMessage);
      setMessages([...messages, sentMsg]);
      setNewMessage('');
      fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const filteredConversations = conversations.filter(c =>
    c.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isGuest = !currentUser || currentUser._id.startsWith('guest_') || currentUser.email.includes('guest');

  return (
    <div className="flex flex-col space-y-4 w-full h-full">
      {isGuest && (
        <GuestLoginBanner 
          title="Sign in to chat with classmates & mentors"
          description="You are currently in Guest Mode. Log in or create a free account to send direct messages, start group chats, and contact mentors!"
        />
      )}
      <div className="flex h-full bg-brand-50 dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800">
      {/* Sidebar - Conversation List */}
      <div className={`w-full md:w-80 border-r border-slate-100 dark:border-slate-800 flex flex-col bg-white dark:bg-slate-900 ${selectedUser ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Messages</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setView(view === 'conversations' ? 'contacts' : 'conversations')}
                className={`p-2 rounded-xl transition-all ${view === 'contacts' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                title={view === 'contacts' ? 'Back to chats' : 'New message'}
              >
                <Plus className="w-5 h-5" />
              </button>
              {onClose && (
                <button onClick={onClose} className="md:hidden p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={view === 'conversations' ? "Search conversations..." : "Search registered users..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm font-bold border-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : view === 'conversations' ? (
            filteredConversations.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-bold text-sm">No messages yet.</p>
                {currentUser.role === 'student' && (
                  <button
                    onClick={() => setView('contacts')}
                    className="mt-4 text-brand-600 font-black text-xs uppercase hover:underline"
                  >
                    Contact a teacher
                  </button>
                )}
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <button
                  key={conv.user._id}
                  onClick={() => setSelectedUser(conv.user)}
                  className={`w-full p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-50 dark:border-slate-800/50 ${selectedUser?._id === conv.user._id ? 'bg-brand-50 dark:bg-brand-900/20' : ''}`}
                >
                  <div className="relative">
                    <img
                      src={conv.user.profilePictureUrl || 'https://picsum.photos/seed/user/100/100'}
                      alt={conv.user.name}
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-white dark:border-slate-700 shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                    {conv.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-black text-slate-800 dark:text-white text-sm truncate">{conv.user.name}</h3>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        {conv.lastMessage ? new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                    <p className={`text-xs truncate ${conv.unreadCount > 0 ? 'text-slate-800 dark:text-slate-200 font-black' : 'text-slate-400 font-bold'}`}>
                      {conv.lastMessage?.content || 'Start a conversation'}
                    </p>
                  </div>
                </button>
              ))
            )
          ) : (
            <div className="p-2">
              <div className="px-4 py-2 mb-2">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {searchQuery.trim().length > 0 ? 'Search Results' : 'Available Contacts'}
                </h3>
              </div>
              {isSearchingUsers ? (
                <div className="p-8 flex justify-center">
                  <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="p-8 text-center text-slate-400 font-bold text-sm">
                  {searchQuery.trim().length > 0 ? 'No users found.' : 'No available contacts.'}
                </div>
              ) : (
                searchResults.map((user) => (
                  <button
                    key={user._id}
                    onClick={() => {
                      setSelectedUser(user);
                      setView('conversations');
                    }}
                    className="w-full p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-all"
                  >
                    <img
                      src={user.profilePictureUrl || 'https://picsum.photos/seed/user/100/100'}
                      alt={user.name}
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-white dark:border-slate-700 shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                    <div className="text-left">
                      <h3 className="font-black text-slate-800 dark:text-white text-sm">{user.name}</h3>
                      <p className="text-[10px] font-black text-brand-600 uppercase tracking-widest">{user.role}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col bg-slate-50 dark:bg-slate-900/50 ${!selectedUser ? 'hidden md:flex items-center justify-center' : 'flex'}`}>
        {!selectedUser ? (
          <div className="text-center p-12">
            <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-10 h-10 text-brand-600" />
            </div>
            <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Your Inbox</h3>
            <p className="text-slate-400 font-bold max-w-xs mx-auto mt-2">Select a conversation to start chatting with your teacher or students.</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => setSelectedUser(null)} className="md:hidden p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <img
                  src={selectedUser.profilePictureUrl}
                  alt={selectedUser.name}
                  className="w-10 h-10 rounded-xl object-cover border-2 border-brand-50 dark:border-slate-700 shadow-sm"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="font-black text-slate-800 dark:text-white text-sm">{selectedUser.name}</h3>
                  <p className="text-[10px] font-black text-brand-600 uppercase tracking-widest">{selectedUser.role}</p>
                </div>
              </div>
              <button className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg, i) => {
                const isMe = msg.sender._id === currentUser._id;
                const showAvatar = i === 0 || messages[i - 1].sender._id !== msg.sender._id;

                return (
                  <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                    {!isMe && showAvatar && (
                      <img
                        src={msg.sender.profilePictureUrl}
                        alt=""
                        className="w-8 h-8 rounded-lg object-cover mb-1"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    {!isMe && !showAvatar && <div className="w-8" />}

                    <div className={`max-w-[75%] group`}>
                      <div className={`p-4 rounded-3xl text-sm font-bold shadow-sm ${isMe
                          ? 'bg-brand-600 text-white rounded-br-none'
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none'
                        }`}>
                        {msg.content}
                      </div>
                      <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-[9px] font-bold text-slate-400 uppercase">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {isMe && (
                          msg.isRead ? <CheckCheck className="w-3 h-3 text-brand-500" /> : <Check className="w-3 h-3 text-slate-300" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-800">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-slate-900 border-none focus:ring-2 focus:ring-brand-500 rounded-2xl px-6 py-3 text-sm font-bold text-slate-800 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || isSending}
                  className="p-3 bg-brand-600 text-white rounded-2xl shadow-lg hover:bg-brand-500 disabled:bg-slate-300 transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  </div>
);
};

export default MessagingSystem;
