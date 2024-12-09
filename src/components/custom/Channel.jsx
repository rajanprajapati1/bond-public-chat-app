"use client";
import { useEffect, useState } from "react";

const Channel = ({ user = null, db = null }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (db) {
      const unsubscribe = db && db
        .collection("messages")
        .orderBy("createdAt")
        .limit(100)
        .onSnapshot((snapshot) => {
          const data = snapshot.docs.map((doc) => {
            const docData = doc.data();
            return {
              ...docData,
              id: doc.id,
              createdAt: docData.createdAt ? docData.createdAt.toDate().toISOString() : null,
            };
          });
          setMessages(data);
        });

      return () => {
        unsubscribe();
      };
    }
  }, [db]);

  if (!db) {
    return <div>Error: Database connection not available</div>;
  }

  return (
    <div className="channel-container">
      <h2 className="text-lg font-bold mb-4">Chat Messages</h2>
      <ul className="message-list space-y-2">
        {messages.length === 0 ? (
          <li className="message-item p-2 border rounded text-gray-500">
            Loading messages...
          </li>
        ) : (
            messages &&messages.map((message) => (
            <li key={message.id} className="message-item p-2 border rounded">
              <p>
                <strong>{message.senderName || "Unknown User"}:</strong> {message.text}
              </p>
              <small className="text-gray-500">
                {message.createdAt
                  ? new Date(message.createdAt).toLocaleString()
                  : "Unknown date"}
              </small>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Channel;
