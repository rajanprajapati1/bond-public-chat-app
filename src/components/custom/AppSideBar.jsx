'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from 'lucide-react';
import { useAuth } from '@/provider/AuthProvider';
import { signOut } from 'firebase/auth';
import { auth, db } from '@/configs/Firebase'; // Assumes you have Firebase initialized
import { collection, addDoc, query, onSnapshot, serverTimestamp, deleteDoc, doc, setDoc } from 'firebase/firestore';
import Header from './Header';
import SideButton from './SideButton';

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const { authUser } = useAuth();
  const [activeUsers, setActiveUsers] = useState(0); // Track number of users
  const [activeList, setActiveList] = useState([]); // Store user data

  // Reference to Firebase messages collection
  const messagesCollectionRef = collection(db, 'chatMessages');
  const usersCollectionRef = collection(db, 'users'); // Reference for active users

  // Scroll to the bottom of the messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (authUser) {
      const userDocRef = doc(usersCollectionRef, authUser.uid);

      // Add user to active users on component mount
      setDoc(userDocRef, {
        email: authUser.email,
        timestamp: serverTimestamp(),
      });

      // Remove user from active users on component unmount
      return () => {
        deleteDoc(userDocRef);
      };
    }
  }, [authUser]);

  // Fetch active users count
  useEffect(() => {
    const unsubscribe = onSnapshot(usersCollectionRef, (snapshot) => {
      setActiveUsers(snapshot.size); // Number of documents = active users
      const users = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setActiveList(users);
    });

    return () => unsubscribe();
  }, []);

  // Fetch messages in real-time
  useEffect(() => {
    const q = query(messagesCollectionRef);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
    });

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, []);

  useEffect(scrollToBottom, [messages]);

  // Send a new message
  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      try {
        await addDoc(messagesCollectionRef, {
          text: inputValue,
          sender: authUser?.email || 'Anonymous',
          timestamp: serverTimestamp(),
        });
        setInputValue('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
<div className="flex flex-col w-[94%] sm:w-[60%] h-[80%] bg-gray-100 shadow-md rounded-lg">
{/* Header */}
      <Header live={activeUsers || 0} activeList={activeList}/>

      {/* Messages */}
      <ScrollArea className="flex-grow p-4">
        {messages.sort((a, b) => a.timestamp?.toMillis() - b.timestamp?.toMillis()).map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${message.sender === authUser?.email ? 'text-right' : 'text-left'}`}
          >
            <div
              className={`inline-block px-4 py-2 rounded-md ${
                message.sender === authUser?.email
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              <div>{message.text}</div>
              <Badge className="bg-blue-600 text-xs">
                {message.sender === authUser?.email ? 'You' : message.sender}
              </Badge>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Input Area */}
      <div className="bg-white p-4 shadow-md">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-grow"
          />
          <Button onClick={handleSendMessage}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Avatar and Dropdown */}
      <SideButton authUser={authUser} logOut={logOut} />
    </div>
  );
}
