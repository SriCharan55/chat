'use client';

import { useState, useEffect, useRef } from 'react';
import { Menu, Send, Smile, Paperclip, Phone, Video, MoreVertical, Search, X, Image, FileText } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';

const contacts = [
  {
    id: 1,
    name: 'Emma Thompson',
    initials: 'ET',
    lastMessage: "I've sent you the latest project files....",
    time: '12:45 PM',
    online: true,
    color: 'bg-blue-500',
    messages: [
      { id: 1, text: "Hey! How's the project coming along?", sender: 'other', time: '9:45 AM' },
      { id: 2, text: "Oh, I almost forgot - do you have the latest version of the client presentation? I want to make sure we're all on the same page for tomorrow.", sender: 'other', time: '10:20 AM' }
    ]
  },
  {
    id: 2,
    name: 'Michael Johnson',
    initials: 'MJ',
    lastMessage: 'Are we still meeting for coffee tom...',
    time: 'Yesterday',
    online: true,
    color: 'bg-green-500',
    messages: [
      { id: 1, text: "Are we still meeting for coffee tomorrow?", sender: 'other', time: 'Yesterday 2:30 PM' },
      { id: 2, text: "Yes, looking forward to it! Same place as usual?", sender: 'me', time: 'Yesterday 2:45 PM' }
    ]
  },
  {
    id: 3,
    name: 'Sophia Lee',
    initials: 'SL',
    lastMessage: 'The design team loved your propo...',
    time: 'Yesterday',
    online: true,
    color: 'bg-purple-500',
    messages: [
      { id: 1, text: "The design team loved your proposal!", sender: 'other', time: 'Yesterday 4:15 PM' },
      { id: 2, text: "We should discuss the next steps when you have a moment.", sender: 'other', time: 'Yesterday 4:16 PM' }
    ]
  },
  {
    id: 4,
    name: 'Robert Brown',
    initials: 'RB',
    lastMessage: 'Can we discuss the budget propos...',
    time: 'Tuesday',
    online: true,
    color: 'bg-orange-500',
    messages: [
      { id: 1, text: "Can we discuss the budget proposal?", sender: 'other', time: 'Tuesday 11:30 AM' },
      { id: 2, text: "Sure, I'll review it and get back to you shortly.", sender: 'me', time: 'Tuesday 11:45 AM' }
    ]
  },
  {
    id: 5,
    name: 'Amelia Wilson',
    initials: 'AW',
    lastMessage: 'Thanks for your help with the client.',
    time: 'Monday',
    online: true,
    color: 'bg-pink-500',
    messages: [
      { id: 1, text: "Thanks for your help with the client presentation!", sender: 'other', time: 'Monday 3:20 PM' },
      { id: 2, text: "You're welcome! It went really well.", sender: 'me', time: 'Monday 3:35 PM' }
    ]
  },
  {
    id: 6,
    name: 'Daniel Martinez',
    initials: 'DM',
    lastMessage: "Let's schedule a call to discuss the ...",
    time: 'May 29',
    online: true,
    color: 'bg-indigo-500',
    messages: [
      { id: 1, text: "Let's schedule a call to discuss the new requirements.", sender: 'other', time: 'May 29 1:15 PM' },
      { id: 2, text: "I'm available this week. What works for you?", sender: 'me', time: 'May 29 1:30 PM' }
    ]
  }
];

const botReplies = [
  "Thanks for reaching out! I'll get back to you soon.",
  "That sounds great! Let me know if you need anything else.",
  "I'm currently working on it. Will update you shortly.",
  "Perfect! I'll send you the details by email.",
  "Got it, thanks! I'll review it before our lunch. See you soon!",
  "Absolutely! Looking forward to discussing this further.",
  "I appreciate the update. Let me check and confirm.",
  "That's wonderful news! Thanks for letting me know."
];

export default function ChatApp() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedContact, setSelectedContact] = useState(contacts[0]);
  const [messages, setMessages] = useState(contacts[0].messages);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredContacts, setFilteredContacts] = useState(contacts);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    // Filter contacts based on search query
    const filtered = contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredContacts(filtered);
  }, [searchQuery]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
    setMessages(contact.messages);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      text: newMessage,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate typing and bot reply
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        const botReply = {
          id: Date.now() + 1,
          text: botReplies[Math.floor(Math.random() * botReplies.length)],
          sender: 'other',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botReply]);
        setIsTyping(false);
      }, 2000);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const onEmojiClick = (emojiObject) => {
    setNewMessage(prev => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const message = {
        id: Date.now(),
        text: `📎 ${file.name}`,
        sender: 'me',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'file'
      };
      setMessages(prev => [...prev, message]);
      
      // Reset file input
      event.target.value = '';
      
      // Simulate bot reply
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          const botReply = {
            id: Date.now() + 1,
            text: "Thanks for sharing the file! I'll review it shortly.",
            sender: 'other',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setMessages(prev => [...prev, botReply]);
          setIsTyping(false);
        }, 1500);
      }, 500);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const message = {
        id: Date.now(),
        text: `🖼️ ${file.name}`,
        sender: 'me',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'image'
      };
      setMessages(prev => [...prev, message]);
      
      // Reset file input
      event.target.value = '';
      
      // Simulate bot reply
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          const botReply = {
            id: Date.now() + 1,
            text: "Nice image! Thanks for sharing.",
            sender: 'other',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setMessages(prev => [...prev, botReply]);
          setIsTyping(false);
        }, 1500);
      }, 500);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="flex h-screen bg-gray-50 relative">
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-80' : 'w-0'
        } transition-all duration-300 ease-in-out bg-white border-r border-gray-200 flex flex-col overflow-hidden ${
          isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative'
        }`}
      >
        {sidebarOpen && (
          <>
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">💬</span>
                  </div>
                  <h1 className="text-xl font-semibold text-gray-900">Chats</h1>
                </div>
                <button
                  onClick={toggleSidebar}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Menu className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Contacts List */}
            <div className="flex-1 overflow-y-auto">
              {filteredContacts.length > 0 ? (
                filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    onClick={() => handleContactSelect(contact)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedContact.id === contact.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className={`w-12 h-12 ${contact.color} rounded-full flex items-center justify-center`}>
                          <span className="text-white font-semibold">{contact.initials}</span>
                        </div>
                        {contact.online && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900 truncate">{contact.name}</h3>
                          <span className="text-xs text-gray-500">{contact.time}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 truncate">{contact.lastMessage}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  <p>No contacts found</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            {!sidebarOpen && (
              <button
                onClick={toggleSidebar}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
            )}
            <div className="relative">
              <div className={`w-10 h-10 ${selectedContact.color} rounded-full flex items-center justify-center`}>
                <span className="text-white font-semibold">{selectedContact.initials}</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{selectedContact.name}</h2>
              <p className="text-sm text-green-600">Online</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Phone className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Video className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
            <div className="text-blue-500 font-semibold text-sm bg-blue-100 px-3 py-1 rounded-lg">
              SC
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.sender === 'me'
                    ? 'bg-blue-500 text-white rounded-br-md'
                    : 'bg-gray-200 text-gray-900 rounded-bl-md'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender === 'me' ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {message.time}
                </p>
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start animate-fadeIn">
              <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-2xl bg-gray-200 text-gray-900 rounded-bl-md">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full typing-dot"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full typing-dot"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full typing-dot"></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0">
          <div className="flex items-end space-x-2">
            <div className="flex-1 relative">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="w-full p-3 pr-32 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="1"
                style={{ minHeight: '44px', maxHeight: '120px' }}
              />
              <div className="absolute right-2 bottom-2 flex items-center space-x-1">
                <button 
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  title="Add emoji"
                >
                  <Smile className="w-5 h-5 text-gray-500" />
                </button>
                <button 
                  onClick={() => imageInputRef.current?.click()}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  title="Upload image"
                >
                  <Image className="w-5 h-5 text-gray-500" />
                </button>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  title="Upload file"
                >
                  <Paperclip className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          
          {/* Hidden File Inputs */}
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.xlsx,.ppt,.pptx"
          />
          <input
            ref={imageInputRef}
            type="file"
            onChange={handleImageUpload}
            className="hidden"
            accept="image/*"
          />
          
          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="absolute bottom-20 right-4 z-50">
              <EmojiPicker
                onEmojiClick={onEmojiClick}
                width={300}
                height={400}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}