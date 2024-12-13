'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Handshake, Send } from 'lucide-react';
import { useAuth } from '@/provider/AuthProvider';
import { signInAnonymously } from 'firebase/auth';
import { signOut } from 'firebase/auth';
import { auth, db } from '@/configs/Firebase'; // Assumes you have Firebase initialized
import { collection, addDoc, query, onSnapshot, serverTimestamp, deleteDoc, doc, setDoc, getDoc } from 'firebase/firestore';
import Header from './Header';
import SideButton from './SideButton';
import { BottomDrawer } from './BottomDrawer';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import Announcer from './Announcer';


export default function ChatInterface() {
  const searchParams = useSearchParams();
  const prevActiveListRef = useRef([]); // Store the previous activeList
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const { authUser } = useAuth();
  const [activeUsers, setActiveUsers] = useState(0); // Track number of users
  const [activeList, setActiveList] = useState([]); // Store user data
  const [inviteLink, setInviteLink] = useState("");
  const [ShowAnnounce,setShowAnnounce] = useState(false)
  const [LatestUser,setLatestUser] =useState(null)
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
      const latestUser = users
      .filter((user) => user?.timestamp) // Ensure timestamp exists
      .sort((a, b) => b.timestamp.seconds - a.timestamp.seconds)[0]; // Sort by timestamp descending
    if (latestUser) {
      setLatestUser(latestUser); // Store the latest user if needed
    } else {
      console.error('No users with a valid join timestamp found!');
    }
    });

    return () => unsubscribe();
  }, []);


  useEffect(() => {
    if (activeList.length > prevActiveListRef.current.length) {
      setShowAnnounce(true);
      setTimeout(() => {
        setShowAnnounce(false);
      }, 2000);
    }
  
    prevActiveListRef.current = activeList;
  }, [activeList]);
  
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

    return () => unsubscribe();
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
      const url = new URL(window.location.href);
      url.search = ''; 
      window.history.pushState({}, '', url);
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };


  useEffect(() => {
    if (authUser) {
      const roomId = "default-room-id"; 
      const inviteUrl = `${window.location.origin}/auth?room=${roomId}&invite=${authUser.uid}`;
      setInviteLink(inviteUrl);
    }
  }, [authUser]);
  


  return (
    <div className="flex flex-col w-[94%] sm:w-[60%] h-[80%] bg-gray-100 shadow-md rounded-lg">
      {/* Header */}
      <Header live={activeUsers || 0} activeList={activeList} />

      {/* Messages */}
      <ScrollArea className="flex-grow p-4 relative">
        {ShowAnnounce && <Announcer user={LatestUser?.email || 'Anonymous'}/>}
        {/* {activeList && activeList?.map((user) => {
  const fallbackLetter = user?.email?.charAt(0) || user?.name?.charAt(0) || defaultName.charAt(0); */}

        {messages.sort((a, b) => a.timestamp?.toMillis() - b.timestamp?.toMillis()).map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${message.sender === authUser?.email ? 'text-right' : 'text-left'}`}
          >
            <div
              className={`inline-block px-4 py-2 rounded-md ${message.sender === authUser?.email
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
                }`}
            >
              <div className=''>
                {message.text}</div>
                <div className="bg-blue-600 text-xs -mt-0  text-white capitalize font-semibold flex items-center
                 justify-center rounded-sm px-1">
                {message.sender === authUser?.email ? 'You' : message.sender?.split('@')[0]}
              </div>
              
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
          <BottomDrawer inviteLink={inviteLink} />
        </div>
      </div>
      {/* Avatar and Dropdown */}
      <SideButton authUser={authUser} logOut={logOut} />
    </div>
  );
}
