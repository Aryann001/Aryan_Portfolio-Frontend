"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
// Assuming you have Redux setup, otherwise these can be removed.
import { useDispatch } from "react-redux";
import { hideLoader } from "@/reducers/loadingReducer";

// Define a type for our message objects for better type safety
type Message = {
  id: number;
  text: string;
  sender: "user" | "ai";
};

// --- CONFIGURATION ---
const BACKEND_URL = process.env.NEXT_PUBLIC_AGENT_BACKEND;

// --- UI COMPONENTS ---

const TypingIndicator = () => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="flex items-center space-x-2 my-2 justify-start"
    >
        <div className="flex items-center justify-center p-3 rounded-2xl bg-[#C8A464]/80 shadow-sm">
            <motion.span className="w-2 h-2 bg-white rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }} />
            <motion.span className="w-2 h-2 bg-white rounded-full mx-1" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.8, delay: 0.2, repeat: Infinity, ease: "easeInOut" }} />
            <motion.span className="w-2 h-2 bg-white rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.8, delay: 0.4, repeat: Infinity, ease: "easeInOut" }} />
        </div>
    </motion.div>
);

const SendIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform rotate-45">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
);

// --- MAIN PAGE COMPONENT ---

const ContactPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! How can I help you today?", sender: "ai" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  
  // --- REDUX GLOBAL LOADER LOGIC ---
  const dispatch = useDispatch();

  // On component mount, hide the global loader.
  useEffect(() => {
    dispatch(hideLoader());
  }, []); // Removed dispatch from dependency array as it's stable
  // ---------------------------------

  // Generate a unique thread ID once when the component mounts
  useEffect(() => {
    setThreadId(`thread_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    
    // Cleanup function to close the connection if the component unmounts
    return () => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
        }
    }
  }, []);

  // Effect to auto-scroll to the bottom of the chat window
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages, isAiTyping]);

  // Main function to send a message and handle the streaming response
  const handleSendMessage = () => {
    if (inputValue.trim() === "" || !threadId || isAiTyping) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      sender: "user",
    };
    
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue("");
    setIsAiTyping(true);

    let aiMessageId: number | null = null;
    
    // Close any existing connection before starting a new one
    if (eventSourceRef.current) {
        eventSourceRef.current.close();
    }

    // The EventSource API requires the parameters to be in the URL
    const url = `${BACKEND_URL}/chat/stream?user_message=${encodeURIComponent(currentInput)}&thread_id=${encodeURIComponent(threadId)}`;
    const newEventSource = new EventSource(url);
    eventSourceRef.current = newEventSource;

    newEventSource.onmessage = (event) => {
        try {
            const jsonData = JSON.parse(event.data);

            if (jsonData.event === 'end') {
                setIsAiTyping(false);
                newEventSource.close();
                return;
            }

            if (jsonData.event === 'data' && jsonData.data) {
                if (!aiMessageId) {
                    const newAiMessage: Message = {
                        id: Date.now() + 1,
                        text: jsonData.data,
                        sender: "ai",
                    };
                    aiMessageId = newAiMessage.id;
                    setIsAiTyping(false); // Hide typing indicator as soon as the first chunk arrives
                    setMessages(prev => [...prev, newAiMessage]);
                } else {
                    setMessages(prev => prev.map(msg => 
                        msg.id === aiMessageId 
                        ? { ...msg, text: msg.text + jsonData.data } 
                        : msg
                    ));
                }
            }
        } catch (e) {
            console.error("Failed to parse message data:", event.data, e);
        }
    };

    newEventSource.onerror = (err) => {
        console.error("EventSource failed:", err);
        const errorMessage: Message = {
            id: Date.now() + 1,
            text: "Sorry, I couldn't connect to the server. Please try again.",
            sender: "ai",
        };
        setMessages(prev => [...prev, errorMessage]);
        setIsAiTyping(false);
        newEventSource.close();
    };
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* This style block hides the scrollbar in the chat window */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
      {/* --- RESPONSIVE LAYOUT CHANGES --- */}
      {/* - The main container now centers the chat component vertically.
        - The chat component itself has a max height of 90vh to prevent the page from scrolling.
      */}
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#faf3e0] p-4 font-sans sm:p-6 md:p-8">
        <div className="flex h-[90vh] w-full max-w-4xl flex-col">
          
          <div ref={chatWindowRef} className="hide-scrollbar flex-grow p-4 sm:p-6 bg-white/50 rounded-2xl border-2 border-[#C8A464] overflow-y-auto mb-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div 
                  key={message.id} 
                  layout 
                  initial={{ opacity: 0, scale: 0.8, y: 20 }} 
                  animate={{ opacity: 1, scale: 1, y: 0 }} 
                  exit={{ opacity: 0, scale: 0.8 }} 
                  transition={{ 
                    opacity: { duration: 0.2 }, 
                    layout: { type: "spring", bounce: 0.4, duration: 0.5 } 
                  }} 
                  className={`flex my-2 ${message.sender === "ai" ? "justify-start" : "justify-end"}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-sm ${message.sender === "ai" ? "bg-[#C8A464] text-white rounded-bl-none" : "bg-white text-[#3d2b1f] rounded-br-none"}`}>
                    {message.text}
                  </div>
                </motion.div>
              ))}
              {isAiTyping && <TypingIndicator />}
            </AnimatePresence>
          </div>

          <div className="flex items-center p-2 bg-white/80 rounded-2xl border-2 border-[#C8A464]">
            <input 
              type="text" 
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)} 
              onKeyPress={handleKeyPress} 
              placeholder="Type your message..." 
              className="flex-grow bg-transparent text-[#3d2b1f] placeholder-[#3d2b1f]/60 focus:outline-none px-4 py-2" 
            />
            <button 
              onClick={handleSendMessage} 
              className="p-3 rounded-full bg-[#3d2b1f] text-white hover:bg-[#C8A464] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center" 
              disabled={!inputValue.trim() || isAiTyping}
            >
              <SendIcon />
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default ContactPage;
