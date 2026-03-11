"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Send, Search, MoreVertical, Phone, Video } from "lucide-react";
import { ref, push, onValue, serverTimestamp } from "firebase/database";
import { db, auth } from "@/firebase/config";

type Message = {
  id: string;
  text: string;
  sender: "buyer" | "seller";
};

type Chat = {
  id: number;
  sellerName: string;
  profilePic: string;
  lastMessage: string;
};

export default function ChatPage() {
  const [search, setSearch] = useState("");

  const [chats] = useState<Chat[]>([
    { id: 1, sellerName: "Rahul Store", profilePic: "/seller.jpg", lastMessage: "Yes! It's available." },
    { id: 2, sellerName: "Ananya Books", profilePic: "/seller.jpg", lastMessage: "Can you pick it up?" },
    { id: 3, sellerName: "Tech World", profilePic: "/seller.jpg", lastMessage: "Price is negotiable." },
  ]);

  const [selectedChat, setSelectedChat] = useState<Chat>(chats[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  // Real-time listener for messages of the selected chat
  useEffect(() => {
    const messagesRef = ref(db, `chats/${selectedChat.id}/messages`);

    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const fetched = Object.entries(data).map(([id, val]: any) => ({
          id,
          text: val.text,
          sender: val.sender,
        }));
        setMessages(fetched);
      } else {
        setMessages([]);
      }
    });

    return () => unsubscribe();
  }, [selectedChat.id]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    await push(ref(db, `chats/${selectedChat.id}/messages`), {
      text: newMessage,
      sender: "buyer",
      senderId: auth.currentUser?.uid ?? null,
      createdAt: serverTimestamp(),
    });

    setNewMessage("");
  };

  const filteredChats = chats.filter((chat) =>
    chat.sellerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-screen flex bg-gray-100">

      {/* LEFT PANEL */}
      <div className="w-[20%] bg-white border-r border-gray-200 flex flex-col">

        {/* Top Header */}
        <div className="h-16 flex items-center px-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-800 text-lg">Chats</h2>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b border-gray-100">
          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
            <Search size={16} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search chats"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent ml-2 w-full outline-none text-sm"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`flex items-center gap-3 p-4 cursor-pointer border-b border-gray-100 hover:bg-gray-50 ${
                selectedChat.id === chat.id ? "bg-yellow-100" : ""
              }`}
            >
              <div className="relative w-10 h-10">
                <Image src={chat.profilePic} alt={chat.sellerName} fill className="rounded-full object-cover" />
              </div>

              <div className="flex-1">
                <h3 className="font-medium text-gray-800 text-sm">{chat.sellerName}</h3>
                <p className="text-xs text-gray-500 truncate">{chat.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-[80%] flex flex-col bg-white">

        {/* TOP HEADER */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image src={selectedChat.profilePic} alt={selectedChat.sellerName} fill className="rounded-full object-cover" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-800 text-base">{selectedChat.sellerName}</h2>
              <p className="text-xs text-green-500">Online</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-gray-600">
            <Phone size={18} className="cursor-pointer hover:text-yellow-500" />
            <Video size={18} className="cursor-pointer hover:text-yellow-500" />
            <MoreVertical size={18} className="cursor-pointer hover:text-yellow-500" />
          </div>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-gray-50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "buyer" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-md px-4 py-2 rounded-xl text-sm shadow-sm ${
                  msg.sender === "buyer"
                    ? "bg-yellow-400 text-black rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* INPUT AREA */}
        <div className="h-16 px-6 border-t border-gray-200 flex items-center gap-3 bg-white">
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          <button
            onClick={handleSend}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg transition hover:scale-105"
          >
            <Send size={18} />
          </button>
        </div>

      </div>
    </div>
  );
}