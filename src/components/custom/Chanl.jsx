"use client";
import { useState, useEffect, useRef } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/configs/Firebase";

function Channel({ user = null }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const bottomListRef = useRef(null);

  useEffect(() => {
    const messagesRef = collection(db, "messages"); // Modular syntax
    const messagesQuery = query(messagesRef, orderBy("createdAt"), limit(100));

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(data);
    });

    return () => unsubscribe();
  }, []);

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    const trimmedMessage = newMessage.trim();
    if (trimmedMessage) {
      const messagesRef = collection(db, "messages");
      await addDoc(messagesRef, {
        text: trimmedMessage,
        createdAt: serverTimestamp(),
        uid: user?.uid || "Anonymous",
        displayName: user?.displayName || "Anonymous User",
        photoURL: user?.photoURL || "",
      });
      setNewMessage("");
      bottomListRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="overflow-auto h-full">
        <div className="py-4 max-w-screen-lg mx-auto">
          <ul>
            {messages.map((message) => (
              <li key={message.id}>
                <h1>{message.text}</h1>
              </li>
            ))}
          </ul>
          <div ref={bottomListRef} />
        </div>
      </div>
      <form onSubmit={handleOnSubmit}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message here..."
        />
        <button type="submit" disabled={!newMessage}>
          Send
        </button>
      </form>
    </div>
  );
}

export default Channel;
