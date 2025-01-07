import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { PiTextAa, PiSmileyLight, PiImageSquareBold } from "react-icons/pi";

const HINTS = {
  FORMATTING: 'Formatting',
  EMOJI: 'Emoji',
  PICTURES: 'Pictures'
};

function Chat({ 
  recipient, // This can be either a user or a channel
  currentUserId,
  type = 'direct', // 'direct' for DMs, 'channel' for channels
  placeholder = 'Type a message...',
  onSendMessage // Callback for handling message sending
}) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const quillRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (recipient) {
      fetchMessages();
    }
  }, [recipient, currentUserId, type]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      let url;
      if (type === 'direct') {
        url = `http://127.0.0.1:5000/messages/${currentUserId}/${recipient.id}`;
      } else {
        url = `http://127.0.0.1:5000/channels/${recipient.id}/messages`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const messageData = {
        content: newMessage,
        sender_id: currentUserId,
        ...(type === 'direct' 
          ? { receiver_id: recipient.id }
          : { channel_id: recipient.id }
        )
      };

      if (onSendMessage) {
        await onSendMessage(messageData);
      } else {
        // Default handling if no callback provided
        const endpoint = type === 'direct' ? 'messages' : 'channel-messages';
        const response = await fetch(`http://127.0.0.1:5000/${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(messageData),
        });

        const data = await response.json();
        setMessages([...messages, data]);
      }

      setNewMessage('');
      if (quillRef.current) {
        const editor = quillRef.current.getEditor();
        editor.setText('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleChange = (content, delta, source, editor) => {
    setNewMessage(content);
  };

  const modules = {
    toolbar: {
      container: [
        ['bold', 'italic', 'strike'],
        ['link'],
        ['blockquote', 'code-block'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }]
      ]
    },
    clipboard: {
      matchVisual: false
    }
  };

  const formats = [
    'bold', 'italic', 'strike',
    'link',
    'blockquote', 'code-block',
    'list', 'bullet'
  ];

  if (!recipient) {
    return (
      <div className="chat-container empty-chat">
        <p>Select a {type === 'direct' ? 'user' : 'channel'} to start chatting</p>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>{recipient.name || recipient.username}</h2>
      </div>
      
      <div className="messages-container">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.sender_id === currentUserId ? 'sent' : 'received'}`}
          >
            {type === 'channel' && message.sender_id !== currentUserId && (
              <div className="message-sender">{message.sender_name}</div>
            )}
            <div 
              className="message-content"
              dangerouslySetInnerHTML={{ __html: message.content }}
            />
            <div className="message-timestamp">
              {new Date(message.timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="message-form">
        <div className="editor-toolbar">
          <button 
            className="toolbar-button"
            onClick={() => {}}
            title={HINTS.FORMATTING}
          >
            <PiTextAa size={20} />
          </button>
          <button 
            className="toolbar-button"
            onClick={() => {}}
            title={HINTS.EMOJI}
          >
            <PiSmileyLight size={20} />
          </button>
          <button 
            className="toolbar-button"
            onClick={() => {}}
            title={HINTS.PICTURES}
          >
            <PiImageSquareBold size={20} />
          </button>
        </div>
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={newMessage}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          preserveWhitespace={true}
        />
        <button 
          className="send-button"
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat; 