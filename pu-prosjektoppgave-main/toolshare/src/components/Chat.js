import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase-config';
import { Select } from '@chakra-ui/react';
import SendMessage from './SendMessage';
import './Chat.css'; // import the CSS file

const Chat = () => {
  const [recipientIds, setRecipientIds] = useState([]);
  const [selectedValue, setSelectedValue] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const currentUserEmail = auth.currentUser.email;
    const unsubscribe = db
      .collection('users')
      .doc(currentUserEmail)
      .collection('chats')
      .onSnapshot((snapshot) => {
        const ids = snapshot.docs.map((doc) => doc.id);
        setRecipientIds(ids);
      });
    return unsubscribe;
  }, []);


  useEffect(() => {
    const currentUserEmail = auth.currentUser.email;
    if (selectedValue) {
      const messagesRef = db
        .collection('users')
        .doc(currentUserEmail)
        .collection('chats')
        .doc(selectedValue)
        .collection('messages')
        .orderBy('createdAt', 'asc');
      const unsubscribe = messagesRef.onSnapshot((snapshot) => {
        const messagesData = snapshot.docs.map((doc) => doc.data());
        setMessages(messagesData);
      });
      return unsubscribe;
    }
  }, [selectedValue]);

  const handleValueChange = async (event) => {
    setSelectedValue(event.target.value);
    const currentUserEmail = auth.currentUser.email;
    if (event.target.value) {
      const messagesRef = db
        .collection('users')
        .doc(currentUserEmail)
        .collection('chats')
        .doc(event.target.value)
        .collection('messages')
        .orderBy('createdAt', 'asc');
      const messagesSnapshot = await messagesRef.get();
      const messagesData = messagesSnapshot.docs.map((doc) => doc.data());
      setMessages(messagesData);
    } else {
      setMessages([]);
    }
  };


  return (
    <div className="chat-container">
      <Select 
        className="recipient-select"
        placeholder="Select a recipient"
        value={selectedValue}
        onChange={handleValueChange}
      >
        {recipientIds.map((id) => (
          <option key={id} value={id}>
            {id}
          </option>
        ))}
      </Select>
      <div className="chat-messages">
        {messages.map((message) => (
          <div className="chat-message" key={message.createdAt}>
            <p>{message.recipientId}</p>
            <p className="sender">{message.senderID}</p>
            <p className="text">{message.text}</p>
          </div>
        ))}
        {selectedValue && <SendMessage recipient={{ userEmail: selectedValue }} />}
      </div>
    </div>
  );
};

export default Chat;