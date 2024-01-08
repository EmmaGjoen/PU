import React, { useState } from 'react'
import firebase from 'firebase/compat/app';
import { db, auth } from '../firebase-config'
import 'firebase/compat/storage';
import { Button, Input } from '@chakra-ui/react'

function SendMessage({ recipient }) {
    const [message, setMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const sender = auth.currentUser.email;
      
        const messageData = {
          senderID: sender,
          recipientID: recipient.userEmail,
          text: message,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        };
      
        const chatRef1 = db.collection('users').doc(sender).collection('chats').doc(recipient.userEmail);
        const chatRef2 = db.collection('users').doc(recipient.userEmail).collection('chats').doc(sender);
      
        await db.runTransaction(async (transaction) => {
          const chatDoc1 = await transaction.get(chatRef1);
          const chatDoc2 = await transaction.get(chatRef2);
      
          if (!chatDoc1.exists) {
            transaction.set(chatRef1, {
              recipientID: recipient.userEmail,
              lastMessage: messageData,
            });
          }
      
          if (!chatDoc2.exists) {
            transaction.set(chatRef2, {
              recipientID: sender,
              lastMessage: messageData,
            });
          }
      
          transaction.set(chatRef1.collection('messages').doc(), messageData);
          transaction.set(chatRef2.collection('messages').doc(), messageData);
      
          const chat1 = chatDoc1.exists ? chatDoc1.data() : null;
          const chat2 = chatDoc2.exists ? chatDoc2.data() : null;
      
          if (chat1 && chat1.lastMessage?.createdAt < messageData.createdAt) {
            transaction.update(chatRef1, { lastMessage: messageData });
          }
      
          if (chat2 && chat2.lastMessage?.createdAt < messageData.createdAt) {
            transaction.update(chatRef2, { lastMessage: messageData });
          }
        });
      
        setMessage('');
      };      
      

    return (
    <div>
        <form onSubmit={handleSubmit}>
            <div>
                <Input type="text" value={message} onChange={e => setMessage(e.target.value)} />
                <Button type="submit">Send</Button>
            </div>
        </form>
    </div>
    )
}

export default SendMessage